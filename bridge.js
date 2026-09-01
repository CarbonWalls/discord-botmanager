const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const dgram = require('dgram');
const { spawn } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

let WebSocket;
try { WebSocket = require('ws'); } catch (e) { WebSocket = null; }

const PORT = 8787;
const WWW = path.join(__dirname, 'www');
const DATA_DIR = path.join(__dirname, 'data', 'messages');
const VOICE_DIR = path.join(__dirname, 'data', 'voice');
const LOCALES_DIR = path.join(WWW, 'locales');
const API = 'https://discord.com/api/v10';
const GATEWAY_URL = 'wss://gateway.discord.gg/?v=10&encoding=json';
const INTENTS = (1 << 0) | (1 << 9) | (1 << 15) | (1 << 7);
const VOICE_MODES = ['aead_aes256_gcm_rtpsize', 'aead_aes256_gcm'];

const MIME = {
'.html': 'text/html',
'.js': 'text/javascript',
'.css': 'text/css',
'.svg': 'image/svg+xml',
'.json': 'application/json',
'.ico': 'image/x-icon',
};

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(VOICE_DIR)) fs.mkdirSync(VOICE_DIR, { recursive: true });
if (!fs.existsSync(LOCALES_DIR)) fs.mkdirSync(LOCALES_DIR, { recursive: true });

/* ===== ogg/opus helpers ===== */
function parseOggOpusPackets(oggBuffer) {
const packets = [];
let current = Buffer.alloc(0);
let offset = 0;
while (offset + 27 <= oggBuffer.length) {
if (oggBuffer.toString('ascii', offset, offset + 4) !== 'OggS') break;
const numSegments = oggBuffer.readUInt8(offset + 26);
const tableStart = offset + 27;
let pos = tableStart + numSegments;
for (let i = 0; i < numSegments; i++) {
const len = oggBuffer.readUInt8(tableStart + i);
current = Buffer.concat([current, oggBuffer.slice(pos, pos + len)]);
pos += len;
if (len < 255) {
packets.push(current);
current = Buffer.alloc(0);
}
}
offset = pos;
}
if (current.length) packets.push(current);
let start = 0;
if (packets.length && packets[0].length >= 8 && packets[0].slice(0, 8).toString('ascii') === 'OpusHead') start++;
if (packets.length > start && packets[start].length >= 8 && packets[start].slice(0, 8).toString('ascii') === 'OpusTags') start++;
return packets.slice(start);
}

function extractOpusPackets(inputPath) {
return new Promise((resolve, reject) => {
const chunks = [];
let stderr = '';
const ff = spawn(ffmpegPath, [
'-hide_banner', '-loglevel', 'error',
'-i', inputPath,
'-map', '0:a:0',
'-c:a', 'libopus',
'-ar', '48000',
'-ac', '2',
'-b:a', '64k',
'-frame_duration', '20',
'-f', 'ogg',
'pipe:1'
]);
ff.stdout.on('data', (chunk) => chunks.push(chunk));
ff.stderr.on('data', (d) => { stderr += d.toString(); });
ff.on('error', () => reject(new Error('ffmpeg binary not found')));
ff.on('close', (code) => {
if (code !== 0) return reject(new Error('ffmpeg error: ' + (stderr || code)));
try {
resolve(parseOggOpusPackets(Buffer.concat(chunks)));
} catch (e) { reject(e); }
});
});
}

function transcodeToOggBuffer(inputPath) {
return new Promise((resolve, reject) => {
const chunks = [];
let stderr = '';
const ff = spawn(ffmpegPath, [
'-hide_banner', '-loglevel', 'error',
'-i', inputPath,
'-map', '0:a:0',
'-c:a', 'libopus',
'-ar', '48000',
'-ac', '1',
'-b:a', '64k',
'-frame_duration', '20',
'-f', 'ogg',
'pipe:1'
]);
ff.stdout.on('data', (chunk) => chunks.push(chunk));
ff.stderr.on('data', (d) => { stderr += d.toString(); });
ff.on('error', () => reject(new Error('ffmpeg binary not found')));
ff.on('close', (code) => {
if (code !== 0) return reject(new Error('ffmpeg error: ' + (stderr || code)));
try {
resolve(Buffer.concat(chunks));
} catch (e) { reject(e); }
});
});
}

/* ===== http helpers ===== */
const cors = (res) => {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-Bot-Token');
};
const send = (res, status, type, body) => {
res.writeHead(status, { 'Content-Type': type });
res.end(body);
};
const json = (res, status, obj) => send(res, status, 'application/json', JSON.stringify(obj));

async function readBody(req) {
const chunks = [];
for await (const ch of req) chunks.push(ch);
return Buffer.concat(chunks);
}
async function readJson(req) {
const buf = await readBody(req);
if (!buf.length) return {};
try { return JSON.parse(buf.toString()); } catch { return {}; }
}

async function proxyDiscord(req, res, target) {
const token = req.headers['x-bot-token'];
if (!token) return json(res, 400, { error: 'manca x-bot-token' });
const headers = {
Authorization: `Bot ${token}`,
'User-Agent': 'DiscordBot (local-manager, 1.0)'
};
const body = await readBody(req);
const ct = req.headers['content-type'];
if (body.length && ct) headers['Content-Type'] = ct;
try {
const up = await fetch(API + target, {
method: req.method,
headers,
body: ['GET', 'HEAD'].includes(req.method) ? undefined : body,
});
const buf = Buffer.from(await up.arrayBuffer());
res.writeHead(up.status, {
'Content-Type': up.headers.get('content-type') || (buf.length ? 'application/octet-stream' : 'text/plain'),
'X-RateLimit-Remaining': up.headers.get('x-ratelimit-remaining') ?? '',
'X-RateLimit-Reset': up.headers.get('x-ratelimit-reset') ?? '',
});
res.end(buf);
} catch (e) {
json(res, 502, { error: 'upstream: ' + e.message });
}
}

function serveStatic(res, pathname) {
const rel = pathname === '/' ? 'index.html' : pathname.slice(1);
const file = path.normalize(path.join(WWW, rel));
if (!file.startsWith(WWW + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
return send(res, 404, 'text/plain', '404');
}
send(res, 200, MIME[path.extname(file)] || 'application/octet-stream', fs.readFileSync(file));
}

/* ===== archive ===== */
const sessions = new Map();

function archivePath(channelId) {
return path.join(DATA_DIR, `${channelId}.json`);
}
function loadArchive(channelId) {
const p = archivePath(channelId);
if (!fs.existsSync(p)) return [];
try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return []; }
}
function saveMessage(msg) {
if (!msg || !msg.channel_id) return;
const arr = loadArchive(msg.channel_id);
const idx = arr.findIndex(m => m.id === msg.id);
if (idx >= 0) arr[idx] = { ...msg, _deleted: false, _editedAt: Date.now() };
else arr.push({ ...msg, _deleted: false });
while (arr.length > 500) arr.shift();
fs.writeFileSync(archivePath(msg.channel_id), JSON.stringify(arr));
}
function markDeleted(channelId, msgId) {
const arr = loadArchive(channelId);
const m = arr.find(x => x.id === msgId);
if (m) {
m._deleted = true;
m._deletedAt = Date.now();
fs.writeFileSync(archivePath(channelId), JSON.stringify(arr));
} else {
arr.push({
id: msgId,
channel_id: channelId,
_deleted: true,
_deletedAt: Date.now(),
content: '[messaggio eliminato prima della cattura]'
});
fs.writeFileSync(archivePath(channelId), JSON.stringify(arr));
}
}

/* ===== i18n helpers ===== */
function readJsonFile(file) {
let txt = fs.readFileSync(file, 'utf8');
if (txt.charCodeAt(0) === 0xFEFF) txt = txt.slice(1);
return JSON.parse(txt);
}
function listLocales() {
if (!fs.existsSync(LOCALES_DIR)) return [];
return fs.readdirSync(LOCALES_DIR)
.filter(f => /^([a-zA-Z0-9_-]{2,35})\.json$/.test(f))
.map(f => {
const code = f.replace(/\.json$/i, '');
let meta = {};
try {
const parsed = readJsonFile(path.join(LOCALES_DIR, f));
if (parsed && typeof parsed === 'object') meta = parsed.meta || parsed._meta || {};
} catch {}
return {
code,
name: meta.name || code,
native: meta.native || meta.name || code,
flag: meta.flag || ''
};
})
.sort((a, b) => {
if (a.code === 'en') return -1;
if (b.code === 'en') return 1;
return a.code.localeCompare(b.code);
});
}
function readLocale(code) {
if (!/^[a-zA-Z0-9_-]{2,35}$/.test(code)) return null;
const file = path.normalize(path.join(LOCALES_DIR, code + '.json'));
if (!file.startsWith(LOCALES_DIR + path.sep) || !fs.existsSync(file)) return null;
return readJsonFile(file);
}

/* ===== voice helpers ===== */
function sleep(ms) {
return new Promise(r => setTimeout(r, ms));
}

function resolveVoiceWaiters(session, d) {
if (!session.voiceWaiters || !session.voiceWaiters.length) return;
session.voiceWaiters = session.voiceWaiters.filter(w => {
let ok = false;
try { ok = w.predicate(d); } catch { ok = false; }
if (ok) {
try { w.resolve(d); } catch {}
return false;
}
return true;
});
}

function clearVoiceAutoLeave(session) {
if (session?.voice?.autoLeaveTimer) {
clearTimeout(session.voice.autoLeaveTimer);
session.voice.autoLeaveTimer = null;
}
}

function scheduleVoiceAutoLeave(session, seconds) {
clearVoiceAutoLeave(session);
const secs = parseInt(seconds, 10);
if (!secs || secs <= 0) return;
if (!session?.voice?.state?.guild_id) return;
session.voice.autoLeaveTimer = setTimeout(() => {
leaveVoice(session.botId).catch(() => {});
}, secs * 1000);
}

function stopPlayback(session, silent = false) {
const vc = session?.voiceConnection;
if (!vc) return;
if (vc.playTimer) clearInterval(vc.playTimer);
vc.playTimer = null;
vc.playing = false;
if (!silent) console.log(`[voice] playback stopped bot ${session.botId}`);
}

function cleanupVoice(session) {
stopPlayback(session, true);
const vc = session?.voiceConnection;
if (!vc) return;
if (vc.heartbeatTimer) clearInterval(vc.heartbeatTimer);
if (vc.ws) { try { vc.ws.close(); } catch {} }
if (vc.udp) { try { vc.udp.close(); } catch {} }
session.voiceConnection = null;
}

function udpDiscovery(ip, port, ssrc) {
return new Promise((resolve, reject) => {
const socket = dgram.createSocket('udp4');
const req = Buffer.alloc(74);
req.writeUInt16BE(0x1, 0);
req.writeUInt16BE(70, 2);
req.writeUInt32BE(ssrc, 4);
const timer = setTimeout(() => {
try { socket.close(); } catch {}
reject(new Error('udp discovery timeout'));
}, 8000);
socket.once('message', (msg) => {
clearTimeout(timer);
try {
const ipStr = msg.slice(8, msg.length - 2).toString('utf8').replace(/\0/g, '');
const discoveredPort = msg.readUInt16BE(msg.length - 2);
try { socket.close(); } catch {}
resolve({ ip: ipStr, port: discoveredPort });
} catch (e) {
try { socket.close(); } catch {}
reject(e);
}
});
socket.on('error', (err) => {
clearTimeout(timer);
try { socket.close(); } catch {}
reject(err);
});
socket.send(req, port, ip);
});
}

function connectVoiceTransport(session) {
return new Promise((resolve, reject) => {
if (!WebSocket) return reject(new Error('modulo ws non installato (npm i ws)'));
if (!session?.voice?.server?.endpoint) return reject(new Error('voice server mancante'));

let settled = false;
let heartbeatTimer = null;
let udp = null;
let ready = null;

const endpoint = session.voice.server.endpoint.replace(/:80$/, '');
const url = `wss://${endpoint}/?v=4&encoding=json`;
console.log(`[voice] connessione a ${url} (bot ${session.botId})`);
const vws = new WebSocket(url);

const timeout = setTimeout(() => done(new Error('timeout connessione voice (20s)')), 20000);

function done(err, value) {
if (settled) return;
settled = true;
clearTimeout(timeout);
if (heartbeatTimer) clearInterval(heartbeatTimer);
if (udp) { try { udp.close(); } catch {} }
if (err) {
try { vws.close(); } catch {}
reject(err);
} else {
resolve(value);
}
}

vws.on('message', async (raw) => {
let data;
try { data = JSON.parse(raw.toString()); } catch { return; }

if (data.op === 8) {
heartbeatTimer = setInterval(() => {
try {
if (vws.readyState === WebSocket.OPEN) vws.send(JSON.stringify({ op: 3, d: Date.now() }));
} catch {}
}, Math.max(5000, Math.floor((data.d?.heartbeat_interval || 13750) * 0.75)));
vws.send(JSON.stringify({
op: 0,
d: {
server_id: session.voice.state.guild_id,
user_id: session.user.id,
session_id: session.voice.state.session_id,
token: session.voice.server.token
}
}));
}
else if (data.op === 2) {
ready = data.d;
const mode = VOICE_MODES.find(m => ready.modes?.includes(m)) || null;
if (!mode) {
return done(new Error('modalità voice non supportata. disponibili: ' + (ready.modes || []).join(', ')));
}
console.log(`[voice] ready (ssrc=${ready.ssrc}), mode=${mode}`);
try {
const disc = await udpDiscovery(ready.ip, ready.port, ready.ssrc);
udp = dgram.createSocket('udp4');
udp.on('error', (err) => console.error('[voice] udp error:', err.message));
vws.send(JSON.stringify({
op: 1,
d: {
protocol: 'udp',
data: { address: disc.ip, port: disc.port, mode }
}
}));
} catch (e) {
done(e);
}
}
else if (data.op === 4) {
if (!ready || !udp) return;
if (!VOICE_MODES.includes(data.d.mode)) {
return done(new Error('modalità voice non supportata: ' + data.d.mode));
}
session.voiceConnection = {
guildId: session.voice.state.guild_id,
ws: vws,
udp,
ip: ready.ip,
port: ready.port,
ssrc: ready.ssrc,
secretKey: Buffer.from(data.d.secret_key),
mode: data.d.mode,
sequence: Math.floor(Math.random() * 0xffff),
timestamp: Math.floor(Math.random() * 0xffffffff),
nonceCounter: Math.floor(Math.random() * 0xffffffff),
heartbeatTimer,
ready: true,
playing: false,
playTimer: null
};
console.log(`[voice] transport pronto (bot ${session.botId}, mode=${data.d.mode})`);
done(null, session.voiceConnection);
}
else if (data.op === 7) {
console.warn(`[voice] il server ha richiesto reconnect (bot ${session.botId})`);
if (session.voiceConnection?.ws === vws) cleanupVoice(session);
done(new Error('voice reconnect richiesto: riprova'));
}
});

vws.on('error', (err) => done(new Error('voice ws error: ' + err.message)));
vws.on('close', (code, reason) => {
if (session.voiceConnection?.ws === vws) cleanupVoice(session);
done(new Error(`voice ws closed (code=${code}${reason && reason.length ? ', ' + reason.toString() : ''})`));
});
});
}

async function ensureVoiceUdp(session) {
if (!session?.voice?.state?.guild_id || !session?.voice?.state?.channel_id) {
throw new Error('bot non in canale vocale');
}
let waited = 0;
while (!session.voice?.server?.endpoint && waited < 10000) {
await sleep(100);
waited += 100;
}
if (!session.voice?.server?.endpoint) throw new Error('voice server info mancanti');
const existing = session.voiceConnection;
if (existing && existing.ready && existing.guildId === session.voice.state.guild_id) return existing;
cleanupVoice(session);
await connectVoiceTransport(session);
return session.voiceConnection;
}

function sendOpusPacket(session, opusPacket) {
const vc = session.voiceConnection;
if (!vc || !vc.ready || !vc.udp) return;

vc.sequence = (vc.sequence + 1) & 0xffff;
vc.timestamp = (vc.timestamp + 960) >>> 0;
vc.nonceCounter = (vc.nonceCounter + 1) >>> 0;

const nonce4 = Buffer.alloc(4);
nonce4.writeUInt32BE(vc.nonceCounter, 0);
const nonce = Buffer.concat([nonce4, Buffer.alloc(8)]);

let header;
if (vc.mode === 'aead_aes256_gcm_rtpsize') {
header = Buffer.alloc(20);
header[0] = 0x90;
header[1] = 0x78;
header.writeUInt16BE(vc.sequence, 2);
header.writeUInt32BE(vc.timestamp, 4);
header.writeUInt32BE(vc.ssrc, 8);
header.writeUInt16BE(0xBEDE, 12);
header.writeUInt16BE(1, 14);
nonce4.copy(header, 16);
} else if (vc.mode === 'aead_aes256_gcm') {
header = Buffer.alloc(12);
header[0] = 0x80;
header[1] = 0x78;
header.writeUInt16BE(vc.sequence, 2);
header.writeUInt32BE(vc.timestamp, 4);
header.writeUInt32BE(vc.ssrc, 8);
} else {
throw new Error('encryption mode non supportato: ' + vc.mode);
}

const cipher = crypto.createCipheriv('aes-256-gcm', vc.secretKey, nonce);
cipher.setAAD(header);
const encrypted = Buffer.concat([cipher.update(opusPacket), cipher.final(), cipher.getAuthTag()]);

if (vc.mode === 'aead_aes256_gcm') {
vc.udp.send(Buffer.concat([header, encrypted, nonce]), vc.port, vc.ip);
} else {
vc.udp.send(Buffer.concat([header, encrypted]), vc.port, vc.ip);
}
}

function startOpusPlayback(session, packets) {
const vc = session.voiceConnection;
if (!vc) return;
stopPlayback(session, true);
vc.playing = true;
let i = 0;
console.log(`[voice] avvio playback bot ${session.botId}: ${packets.length} pacchetti`);
vc.playTimer = setInterval(() => {
if (!session.voiceConnection || session.voiceConnection !== vc) {
stopPlayback(session, true);
return;
}
if (i >= packets.length) {
stopPlayback(session);
return;
}
try {
sendOpusPacket(session, packets[i]);
i++;
} catch (e) {
console.error('[voice] errore invio pacchetto:', e.message);
stopPlayback(session);
}
}, 20);
}

async function joinVoice(botId, opts = {}) {
const s = sessions.get(botId);
if (!s || s.ws.readyState !== WebSocket.OPEN) throw new Error('gateway non connesso');
const guild_id = String(opts.guild_id || '');
const channel_id = String(opts.channel_id || '');
if (!guild_id || !channel_id) throw new Error('guild_id e channel_id richiesti');
const self_mute = !!opts.self_mute;
const self_deaf = !!opts.self_deaf;

clearVoiceAutoLeave(s);
const current = s.voice?.state;
if (current && current.guild_id === guild_id && current.channel_id === channel_id) {
scheduleVoiceAutoLeave(s, opts.auto_leave_seconds);
return current;
}

const waiter = new Promise((resolve, reject) => {
const timeoutMs = Math.max(3000, parseInt(opts.timeout_ms || 12000, 10));
const timer = setTimeout(() => {
s.voiceWaiters = (s.voiceWaiters || []).filter(w => w !== entry);
reject(new Error('timeout voice join'));
}, timeoutMs);
const entry = {
predicate: (d) => d.guild_id === guild_id && d.channel_id === channel_id,
resolve: (d) => { clearTimeout(timer); resolve(d); }
};
s.voiceWaiters = s.voiceWaiters || [];
s.voiceWaiters.push(entry);
});

s.ws.send(JSON.stringify({ op: 4, d: { guild_id, channel_id, self_mute, self_deaf } }));
const state = await waiter;
scheduleVoiceAutoLeave(s, opts.auto_leave_seconds);
return state;
}

async function leaveVoice(botId, timeoutMs = 10000) {
const s = sessions.get(botId);
if (!s || s.ws.readyState !== WebSocket.OPEN) throw new Error('gateway non connesso');
clearVoiceAutoLeave(s);
const guild_id = s.voice?.state?.guild_id;
if (!guild_id || !s.voice?.state?.channel_id) return null;

const waiter = new Promise((resolve, reject) => {
const timer = setTimeout(() => {
s.voiceWaiters = (s.voiceWaiters || []).filter(w => w !== entry);
reject(new Error('timeout voice leave'));
}, timeoutMs);
const entry = {
predicate: (d) => d.guild_id === guild_id && d.channel_id === null,
resolve: (d) => { clearTimeout(timer); resolve(d); }
};
s.voiceWaiters = s.voiceWaiters || [];
s.voiceWaiters.push(entry);
});

s.ws.send(JSON.stringify({ op: 4, d: { guild_id, channel_id: null, self_mute: false, self_deaf: false } }));
return waiter;
}

async function playVoice(botId, opts = {}) {
const s = sessions.get(botId);
if (!s || s.ws.readyState !== WebSocket.OPEN) throw new Error('gateway non connesso');

if (opts.guild_id && opts.channel_id) {
const currentChannel = s.voice?.state?.channel_id;
if (!currentChannel || currentChannel !== String(opts.channel_id)) {
await joinVoice(botId, {
guild_id: opts.guild_id,
channel_id: opts.channel_id,
self_mute: !!opts.self_mute,
self_deaf: !!opts.self_deaf,
auto_leave_seconds: 0,
timeout_ms: 12000
});
}
}

if (!s.voice?.state?.channel_id) throw new Error('bot non in canale vocale');

clearVoiceAutoLeave(s);
await ensureVoiceUdp(s);
const vc = s.voiceConnection;
if (!vc) throw new Error('voice connection mancante');
if (vc.playing) throw new Error('playback già attivo');

let b64 = String(opts.audio_base64 || '');
if (b64.includes(',')) b64 = b64.split(',').pop();
const audioBuf = Buffer.from(b64, 'base64');
if (!audioBuf.length) throw new Error('audio vuoto');

const ext = path.extname(String(opts.filename || '')) || '.audio';
const tmp = path.join(VOICE_DIR, `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`);
fs.writeFileSync(tmp, audioBuf);

let packets;
try {
packets = await extractOpusPackets(tmp);
} finally {
try { fs.unlinkSync(tmp); } catch {}
}

if (!packets.length) throw new Error('nessun pacchetto audio estratto');
startOpusPlayback(s, packets);
return { ok: true, packets: packets.length, duration_ms: packets.length * 20 };
}

/* ===== gateway ===== */
function connectGateway(botId, token) {
return new Promise((resolve, reject) => {
const existing = sessions.get(botId);
if (existing && existing.ws.readyState === WebSocket.OPEN) return resolve(existing);
if (existing) {
try { existing.ws.close(); } catch {}
cleanupVoice(existing);
sessions.delete(botId);
}
if (!WebSocket) return reject(new Error('modulo ws non installato (npm i ws)'));

console.log(`[gateway] connetto bot ${botId}...`);
const ws = new WebSocket(GATEWAY_URL);
const session = {
botId,
ws,
token,
user: null,
heartbeatTimer: null,
seq: null,
presence: 'online',
voice: {},
voiceWaiters: [],
voiceConnection: null
};
sessions.set(botId, session);

const timeout = setTimeout(() => {
console.error(`[gateway] timeout connessione bot ${botId}`);
try { ws.close(); } catch {}
cleanupVoice(session);
sessions.delete(botId);
reject(new Error('timeout connessione gateway (30s) - verifica token e connessione'));
}, 30000);

ws.on('open', () => console.log(`[gateway] websocket aperto per bot ${botId}`));

ws.on('message', (raw) => {
try {
const data = JSON.parse(raw.toString());
if (data.s) session.seq = data.s;

if (data.op === 10) {
console.log(`[gateway] hello ricevuto, invio identify per bot ${botId}`);
const interval = data.d.heartbeat_interval;
ws.send(JSON.stringify({
op: 2,
d: {
token,
intents: INTENTS,
properties: { os: 'linux', browser: 'local-manager', device: 'local-manager' },
presence: { status: 'online', afk: false, activities: [], since: null }
}
}));
session.heartbeatTimer = setInterval(() => {
if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ op: 1, d: session.seq }));
}, interval * 0.9);
}
else if (data.op === 1) {
ws.send(JSON.stringify({ op: 1, d: session.seq }));
}
else if (data.op === 7 || data.op === 9) {
console.warn(`[gateway] reconnect/invalid session per bot ${botId}`);
clearTimeout(timeout);
try { ws.close(); } catch {}
cleanupVoice(session);
sessions.delete(botId);
if (data.op === 9 && data.d === false) {
setTimeout(() => {
console.log(`[gateway] retry connessione bot ${botId} dopo invalid session...`);
connectGateway(botId, token).then(resolve).catch(reject);
}, 5000);
}
}
else if (data.op === 0) {
if (data.t === 'READY') {
console.log(`[gateway] ready ricevuto per bot ${botId}: @${data.d.user.username}`);
session.user = data.d.user;
clearTimeout(timeout);
resolve(session);
}
else if (data.t === 'MESSAGE_CREATE' && data.d.channel_id) saveMessage(data.d);
else if (data.t === 'MESSAGE_UPDATE' && data.d.channel_id) saveMessage(data.d);
else if (data.t === 'MESSAGE_DELETE' && data.d.channel_id) markDeleted(data.d.channel_id, data.d.id);
else if (data.t === 'MESSAGE_DELETE_BULK' && data.d.channel_id) {
data.d.ids.forEach(id => markDeleted(data.d.channel_id, id));
}
else if (data.t === 'VOICE_STATE_UPDATE' && session.user && data.d.user_id === session.user.id) {
session.voice = session.voice || {};
session.voice.state = data.d;
if (!data.d.channel_id) {
session.voice.server = null;
session.voice.pendingServer = null;
cleanupVoice(session);
} else if (session.voice.pendingServer && session.voice.pendingServer.guild_id === data.d.guild_id) {
session.voice.server = session.voice.pendingServer;
session.voice.pendingServer = null;
}
resolveVoiceWaiters(session, data.d);
}
else if (data.t === 'VOICE_SERVER_UPDATE') {
session.voice = session.voice || {};
if (session.voice?.state?.guild_id === data.d.guild_id) {
session.voice.server = data.d;
} else {
session.voice.pendingServer = data.d;
}
}
}
else if (data.op === 11) {
// heartbeat ack
}
} catch (e) {
console.error('[gateway] errore parsing messaggio:', e.message);
}
});

ws.on('close', (code, reason) => {
console.log(`[gateway] connessione chiusa per bot ${botId}: code=${code}, reason=${reason}`);
if (session.heartbeatTimer) clearInterval(session.heartbeatTimer);
cleanupVoice(session);
sessions.delete(botId);
});

ws.on('error', (err) => {
console.error(`[gateway] errore per bot ${botId}:`, err.message);
clearTimeout(timeout);
try { ws.close(); } catch {}
cleanupVoice(session);
sessions.delete(botId);
reject(new Error('errore gateway: ' + err.message));
});
});
}

function setPresence(botId, status, activity) {
const s = sessions.get(botId);
if (!s || s.ws.readyState !== WebSocket.OPEN) {
throw new Error('gateway non connesso per questo bot - prova a riconnettere');
}
const presence = {
status,
afk: false,
since: Date.now(),
activities: activity ? [{ name: activity, type: 0 }] : []
};
s.ws.send(JSON.stringify({ op: 3, d: presence }));
s.presence = status;
console.log(`[gateway] presenza aggiornata per bot ${botId}: ${status}`);
}

function disconnectGateway(botId) {
const s = sessions.get(botId);
if (!s) return false;
console.log(`[gateway] disconnetto bot ${botId}`);
clearVoiceAutoLeave(s);
cleanupVoice(s);
try { s.ws.close(); } catch {}
sessions.delete(botId);
return true;
}

/* ===== server ===== */
http.createServer(async (req, res) => {
cors(res);
if (req.method === 'OPTIONS') {
res.writeHead(204);
return res.end();
}
const url = new URL(req.url, 'http://localhost');
const p = url.pathname;
let m;

if (p === '/gateway/tools/transcode-voice' && req.method === 'POST') {
const body = await readJson(req);
let b64 = String(body.audio_base64 || '');
if (b64.includes(',')) b64 = b64.split(',').pop();
const buf = Buffer.from(b64, 'base64');
if (!buf.length) return json(res, 400, { error: 'audio vuoto' });
const ext = path.extname(String(body.filename || '')) || '.audio';
const tmp = path.join(VOICE_DIR, `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`);
fs.writeFileSync(tmp, buf);
try {
const out = await transcodeToOggBuffer(tmp);
try { fs.unlinkSync(tmp); } catch {}
return json(res, 200, {
ok: true,
audio_base64: out.toString('base64'),
filename: 'voice-message.ogg',
content_type: 'audio/ogg'
});
} catch (e) {
try { fs.unlinkSync(tmp); } catch {}
return json(res, 500, { error: e.message });
}
}

if ((m = p.match(/^\/gateway\/([^/]+)\/connect$/)) && req.method === 'POST') {
const botId = m[1];
const body = await readJson(req);
if (!body.token) return json(res, 400, { error: 'manca token' });
connectGateway(botId, body.token)
.then(() => json(res, 200, { ok: true }))
.catch(e => json(res, 500, { error: e.message }));
return;
}

if ((m = p.match(/^\/gateway\/([^/]+)\/presence$/)) && req.method === 'POST') {
const botId = m[1];
const body = await readJson(req);
if (!['online', 'idle', 'dnd', 'invisible'].includes(body.status)) {
return json(res, 400, { error: 'status non valido' });
}
try {
setPresence(botId, body.status, body.activity || null);
return json(res, 200, { ok: true });
} catch (e) {
return json(res, 500, { error: e.message });
}
}

if ((m = p.match(/^\/gateway\/([^/]+)\/disconnect$/)) && req.method === 'POST') {
const botId = m[1];
disconnectGateway(botId);
return json(res, 200, { ok: true });
}

if (p === '/gateway/status' && req.method === 'GET') {
const list = [...sessions.entries()].map(([id, s]) => ({
id,
user: s.user,
presence: s.presence,
connected: s.ws.readyState === WebSocket.OPEN,
voicePlaying: !!s.voiceConnection?.playing
}));
return json(res, 200, { sessions: list });
}

const archMatch = p.match(/^\/(?:gateway\/)?archive\/(\d+)$/);
if (archMatch && req.method === 'GET') {
return json(res, 200, { messages: loadArchive(archMatch[1]) });
}

if (p === '/i18n/languages' && req.method === 'GET') {
try {
return json(res, 200, { languages: listLocales() });
} catch (e) {
return json(res, 500, { error: e.message });
}
}

if ((m = p.match(/^\/i18n\/locales\/([a-zA-Z0-9_-]+)$/)) && req.method === 'GET') {
try {
const data = readLocale(m[1]);
if (!data) return json(res, 404, { error: 'locale not found' });
return json(res, 200, data);
} catch (e) {
return json(res, 500, { error: 'invalid json: ' + e.message });
}
}

if ((m = p.match(/^\/gateway\/([^/]+)\/voice\/join$/)) && req.method === 'POST') {
const botId = m[1];
const body = await readJson(req);
joinVoice(botId, body)
.then(state => json(res, 200, { ok: true, state }))
.catch(e => json(res, 500, { error: e.message }));
return;
}

if ((m = p.match(/^\/gateway\/([^/]+)\/voice\/leave$/)) && req.method === 'POST') {
const botId = m[1];
leaveVoice(botId)
.then(state => json(res, 200, { ok: true, state }))
.catch(e => json(res, 500, { error: e.message }));
return;
}

if ((m = p.match(/^\/gateway\/([^/]+)\/voice\/status$/)) && req.method === 'GET') {
const botId = m[1];
const s = sessions.get(botId);
return json(res, 200, {
connected: !!s && s.ws.readyState === WebSocket.OPEN,
voice: s?.voice?.state || null,
hasVoiceServer: !!s?.voice?.server,
voiceTransportReady: !!s?.voiceConnection?.ready,
playing: !!s?.voiceConnection?.playing
});
}

if ((m = p.match(/^\/gateway\/([^/]+)\/voice\/play$/)) && req.method === 'POST') {
const botId = m[1];
const body = await readJson(req);
playVoice(botId, body)
.then(info => json(res, 200, info))
.catch(e => json(res, 500, { error: e.message }));
return;
}

if ((m = p.match(/^\/gateway\/([^/]+)\/voice\/stop$/)) && req.method === 'POST') {
const botId = m[1];
const s = sessions.get(botId);
if (s) stopPlayback(s);
return json(res, 200, { ok: true });
}

if (p.startsWith('/discord/')) {
return proxyDiscord(req, res, p.slice('/discord'.length) + url.search);
}

serveStatic(res, p);
}).listen(PORT, '127.0.0.1', () => {
console.log(`bridge attivo su http://127.0.0.1:${PORT}`);
if (!WebSocket) {
console.warn('modulo ws non installato: gateway disabilitato. esegui: npm i ws');
}
});