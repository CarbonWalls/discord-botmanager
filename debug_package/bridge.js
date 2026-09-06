const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawn } = require('child_process');

// Support Electron bundled ffmpeg via env var, fallback to ffmpeg-static
let ffmpegPath;
if (process.env.FFMPEG_PATH && fs.existsSync(process.env.FFMPEG_PATH)) {
  ffmpegPath = process.env.FFMPEG_PATH;
} else {
  try { ffmpegPath = require('ffmpeg-static'); } catch (e) { ffmpegPath = 'ffmpeg'; }
}

let WebSocket;
try { WebSocket = require('ws'); } catch (e) { WebSocket = null; }

const { createAudioPlayer, createAudioResource, AudioPlayerStatus, StreamType, joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
const { Davey } = require('@snazzah/davey');

// Configuration - support Electron env vars
const PORT = parseInt(process.env.PORT, 10) || 8787;
const WWW = process.env.WWW_DIR || path.join(__dirname, 'www');
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data', 'messages');
const VOICE_DIR = process.env.VOICE_DIR || path.join(__dirname, 'data', 'voice');
const LOCALES_DIR = process.env.LOCALES_DIR || path.join(WWW, 'locales');
const API = 'https://discord.com/api/v10';
const GATEWAY_URL = 'wss://gateway.discord.gg/?v=10&encoding=json';
const INTENTS = (1 << 0) | (1 << 9) | (1 << 15) | (1 << 7);

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

function cleanupVoice(session) {
if (session.voiceConnection) {
try { session.voiceConnection.destroy(); } catch {}
session.voiceConnection = null;
}
if (session.voiceGatewayAdapter) {
session.voiceGatewayAdapter.destroyVoiceAdapter();
session.voiceGatewayAdapter = null;
}
if (session.audioPlayer) {
try { session.audioPlayer.stop(); } catch {}
session.audioPlayer = null;
}
session.voice = session.voice || {};
session.voice.state = null;
session.voice.server = null;
session.voice.pendingServer = null;
}

function stopPlayback(session) {
if (session.audioPlayer) {
try { session.audioPlayer.stop(); } catch {}
}
}

/* ===== @discordjs/voice gateway adapter ===== */
function createVoiceGatewayAdapter(session) {
let voiceAdapterMethods = null;
let libraryMethods = null;

function adapterCreator(methods) {
libraryMethods = methods;
return {
sendPayload: (payload) => {
if (!session.ws || session.ws.readyState !== WebSocket.OPEN) return false;
try {
session.ws.send(JSON.stringify(payload));
return true;
} catch {
return false;
}
},
destroy: () => {
voiceAdapterMethods = null;
libraryMethods = null;
}
};
}

// Called by our gateway handler when VOICE_SERVER_UPDATE arrives
function onVoiceServerUpdate(data) {
if (libraryMethods?.onVoiceServerUpdate) {
libraryMethods.onVoiceServerUpdate(data);
}
}

// Called by our gateway handler when VOICE_STATE_UPDATE arrives
function onVoiceStateUpdate(data) {
if (libraryMethods?.onVoiceStateUpdate) {
libraryMethods.onVoiceStateUpdate(data);
}
}

function destroyVoiceAdapter() {
if (voiceAdapterMethods?.destroy) voiceAdapterMethods.destroy();
voiceAdapterMethods = null;
libraryMethods = null;
}

return { adapterCreator, onVoiceServerUpdate, onVoiceStateUpdate, destroyVoiceAdapter };
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

// If already in the same channel, just update mute/deaf state and return
if (current && current.guild_id === guild_id && current.channel_id === channel_id) {
s.ws.send(JSON.stringify({ op: 4, d: { guild_id, channel_id, self_mute, self_deaf } }));
scheduleVoiceAutoLeave(s, opts.auto_leave_seconds);
return current;
}

// Create voice gateway adapter if not exists
if (!s.voiceGatewayAdapter) {
const adapter = createVoiceGatewayAdapter(s);
s.voiceGatewayAdapter = adapter;
}

const adapter = s.voiceGatewayAdapter;

// Prevent concurrent join attempts for same bot
if (s._voiceJoining) {
throw new Error('voice join already in progress');
}
s._voiceJoining = true;

try {
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

// Now create the @discordjs/voice connection
try {
const { joinVoiceChannel, VoiceConnectionStatus, entersState } = require('@discordjs/voice');

s.voiceConnection = joinVoiceChannel({
channelId: state.channel_id,
guildId: state.guild_id,
adapterCreator: adapter.adapterCreator,
selfMute: self_mute,
selfDeaf: self_deaf
});

await entersState(s.voiceConnection, VoiceConnectionStatus.Ready, 20000);

console.log(`[voice] @discordjs/voice connection ready for bot ${botId} in guild ${state.guild_id}`);
} catch (e) {
console.error('[voice] @discordjs/voice join error:', e.message);
if (s.voiceGatewayAdapter) {
s.voiceGatewayAdapter.destroyVoiceAdapter();
s.voiceGatewayAdapter = null;
}
if (s.voiceConnection) {
try { s.voiceConnection.destroy(); } catch {}
s.voiceConnection = null;
}
throw e;
}
} finally {
s._voiceJoining = false;
}

scheduleVoiceAutoLeave(s, opts.auto_leave_seconds);
return state;
}

async function leaveVoice(botId, timeoutMs = 10000) {
const s = sessions.get(botId);
if (!s || s.ws.readyState !== WebSocket.OPEN) throw new Error('gateway non connesso');
clearVoiceAutoLeave(s);
const guild_id = s.voice?.state?.guild_id;
if (!guild_id || !s.voice?.state?.channel_id) return null;

// Prevent concurrent leave attempts
if (s._voiceLeaving) {
throw new Error('voice leave already in progress');
}
s._voiceLeaving = true;

try {
if (s.voiceConnection) {
try { s.voiceConnection.destroy(); } catch {}
s.voiceConnection = null;
}
if (s.voiceGatewayAdapter) {
s.voiceGatewayAdapter.destroyVoiceAdapter();
s.voiceGatewayAdapter = null;
}

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
} finally {
s._voiceLeaving = false;
}
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
if (!s.voiceConnection) throw new Error('voice connection mancante');

clearVoiceAutoLeave(s);

// Prevent concurrent playback attempts
if (s._voicePlaying) {
throw new Error('playback already in progress');
}
s._voicePlaying = true;

try {
const { AudioPlayerStatus, createAudioPlayer, createAudioResource, StreamType } = require('@discordjs/voice');
const { Readable } = require('stream');

if (!s.audioPlayer) {
s.audioPlayer = createAudioPlayer();
s.voiceConnection.subscribe(s.audioPlayer);
}

if (s.audioPlayer.state.status === AudioPlayerStatus.Playing) throw new Error('playback già attivo');

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

const packetStream = new Readable({
read() {
if (this._index < packets.length) {
this.push(packets[this._index++]);
} else {
this.push(null);
}
}
});
packetStream._index = 0;

const resource = createAudioResource(packetStream, {
inputType: StreamType.Opus,
inlineVolume: true
});

return new Promise((resolve, reject) => {
const cleanup = () => { s._voicePlaying = false; };
const onEnd = () => {
s.audioPlayer.removeListener('error', onError);
s.audioPlayer.removeListener('idle', onIdle);
cleanup();
resolve({ ok: true, packets: packets.length, duration_ms: packets.length * 20 });
};
const onError = (err) => {
s.audioPlayer.removeListener('idle', onIdle);
s.audioPlayer.removeListener('idle', onEnd);
cleanup();
reject(err);
};
const onIdle = () => {
s.audioPlayer.removeListener('error', onError);
s.audioPlayer.removeListener('idle', onEnd);
cleanup();
resolve({ ok: true, packets: packets.length, duration_ms: packets.length * 20 });
};
s.audioPlayer.once('error', onError);
s.audioPlayer.once('idle', onIdle);
s.audioPlayer.once('idle', onEnd);
s.audioPlayer.play(resource);
});
} finally {
if (!s.audioPlayer || s.audioPlayer.state.status !== AudioPlayerStatus.Playing) {
s._voicePlaying = false;
}
}
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
if (session.voiceGatewayAdapter?.onVoiceStateUpdate) {
session.voiceGatewayAdapter.onVoiceStateUpdate(data.d);
}
}
else if (data.t === 'VOICE_SERVER_UPDATE') {
session.voice = session.voice || {};
if (session.voice?.state?.guild_id === data.d.guild_id) {
session.voice.server = data.d;
} else {
session.voice.pendingServer = data.d;
}
if (session.voiceGatewayAdapter?.onVoiceServerUpdate) {
session.voiceGatewayAdapter.onVoiceServerUpdate(data.d);
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