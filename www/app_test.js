document.documentElement.classList.add('i18n-loading');

const CRITICAL_CSS = `
html.i18n-loading body { visibility: hidden; }
`;
(function injectCriticalCss() {
const style = document.createElement('style');
style.textContent = CRITICAL_CSS;
document.head.appendChild(style);
})();

const ICONS = {
chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>',
archive: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="5" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>',
circle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>',
trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
volume: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>',
settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>',
plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
record: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/></svg>',
stop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
attach: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.49"/></svg>',
info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
};

let T = {};
let currentLang = 'en';
let availableLangs = [];

let V = null; // vault
let K = null; // master key
let activeTab = 'vault';

let selBot = null;
let selToken = null;

let voiceBot = null;
let voiceToken = null;
let voiceGuild = null;
let voiceChannel = null;
let voiceCurrentlyInChannel = false;
let voiceCurrentlyPlaying = false;
let voiceOperationInProgress = false;
let voicePlayFile = null;
let voiceRecordStream = null;
let voiceRecordChunks = [];

let logBot = null;
let logToken = null;
let logGuild = null;
let logChannel = null;

let presenceBot = null;
let presenceToken = null;

let cleanBot = null;
let cleanToken = null;
let cleanGuild = null;
let cleanChannel = null;

const PORT = 8787;
const BASE = `http://127.0.0.1:${PORT}`;
const API = 'https://discord.com/api/v10';

async function api(path, opts = {}) {
const headers = { 'Content-Type': 'application/json' };
if (selToken) headers['X-Bot-Token'] = selToken;
const res = await fetch(BASE + path, { ...opts, headers });
if (!res.ok) throw new Error((await res.json()).error || `HTTP ${res.status}`);
return res.json();
}

function esc(s) { const map = {'&':'&','<':'<','>':'>','"':'"',"'":"'"}; return String(s).replace(/[&<>"']/g, c => map[c]); }

function t(key, params) {
let str = T[key] || key;
if (params) Object.entries(params).forEach(([k,v]) => { str = str.replace(new RegExp(`\\{${k}\\}`,'g'), v); });
return str;
}

function tt(msg, isError = false) {
const el = document.getElementById('toast');
if (!el) return;
el.textContent = msg;
el.className = isError ? 'toast error' : 'toast';
el.classList.remove('hidden');
setTimeout(() => el.classList.add('hidden'), 3000);
}

function showError(el, msg) { if (el) { el.textContent = msg; el.classList.remove('hidden'); } }
function hideError(el) { if (el) { el.classList.add('hidden'); el.textContent = ''; } }

async function initI18n() {
try {
const res = await fetch(BASE + '/i18n/languages');
const { languages } = await res.json();
availableLangs = languages;
const saved = localStorage.getItem('lang') || 'en';
currentLang = languages.some(l => l.code === saved) ? saved : 'en';
await loadLang(currentLang);
populateLangSelects();
document.documentElement.classList.remove('i18n-loading');
document.documentElement.lang = currentLang;
} catch (e) {
console.error('i18n init failed:', e);
T = {};
document.documentElement.classList.remove('i18n-loading');
}
}

async function loadLang(code) {
try {
const res = await fetch(BASE + '/i18n/locales/' + code);
T = await res.json();
currentLang = code;
localStorage.setItem('lang', code);
translatePage();
updateTabLabels();
} catch (e) { console.error('loadLang failed:', e); }
}

function populateLangSelects() {
const selects = document.querySelectorAll('#lang-select, #lang-setting');
selects.forEach(sel => {
const current = sel.value;
sel.innerHTML = '';
availableLangs.forEach(l => {
const opt = document.createElement('option');
opt.value = l.code;
opt.textContent = `${l.flag || ''} ${l.native || l.name}`;
sel.appendChild(opt);
});
sel.value = current || currentLang;
});
}

function translatePage() {
document.querySelectorAll('[data-i18n]').forEach(el => {
const key = el.dataset.i18n;
if (T[key]) el.textContent = T[key];
});
document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
const key = el.dataset.i18nPlaceholder;
if (T[key]) el.placeholder = T[key];
});
document.querySelectorAll('[data-i18n-html]').forEach(el => {
const key = el.dataset.i18nHtml;
if (T[key]) el.innerHTML = T[key];
});
document.querySelectorAll('[data-i18n-key]').forEach(el => {
const key = el.dataset.i18nKey;
if (T[key]) el.textContent = T[key];
});
}

function updateTabLabels() {
const tabMap = {
vault: 'nav.tokens',
send: 'nav.send',
logs: 'nav.archive',
presence: 'nav.presence',
voice: 'nav.voice',
cleaner: 'nav.cleaner',
settings: 'nav.settings'
};
document.querySelectorAll('.tab-btn').forEach(btn => {
const tab = btn.dataset.tab;
if (tabMap[tab] && T[tabMap[tab]]) {
const icon = btn.querySelector('svg');
btn.innerHTML = (icon ? icon.outerHTML : '') + T[tabMap[tab]];
}
});
}

async function gateway(path, body) {
const headers = { 'Content-Type': 'application/json' };
if (arguments.length > 1 && body && body.token) { headers['X-Bot-Token'] = body.token; delete body.token; }
const res = await fetch(BASE + path, { method: 'POST', headers, body: JSON.stringify(body) });
if (!res.ok) throw new Error((await res.json()).error || `HTTP ${res.status}`);
return res.json();
}

async function gatewayGet(path) {
const headers = {};
if (selToken) headers['X-Bot-Token'] = selToken;
const res = await fetch(BASE + path, { headers });
if (!res.ok) throw new Error((await res.json()).error || `HTTP ${res.status}`);
return res.json();
}

function lv() { try { return JSON.parse(localStorage.getItem('v')); } catch { return null; } }
function sv(v) { localStorage.setItem('v', JSON.stringify(v)); }

async function db(bot, key) {
const enc = bot.tokens[bot.tokens.findIndex(t => t.id === bot.id)] || bot.tokens[0];
return enc; // placeholder - actual decryption in app
}

// ===== Crypto helpers =====
async function deriveKey(password, salt) {
const enc = new TextEncoder().encode(password);
const base = await crypto.subtle.importKey('raw', enc, 'PBKDF2', false, ['deriveBits']);
return crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, base, 256);
}

async function decryptToken(enc, key) {
const iv = new Uint8Array(enc.iv);
const data = new Uint8Array(enc.data);
const auth = new Uint8Array(enc.auth);
const buf = new Uint8Array(data.length + auth.length);
buf.set(data, 0);
buf.set(auth, data.length);
const cryptoKey = await crypto.subtle.importKey('raw', key, { name: 'AES-GCM' }, false, ['decrypt']);
const dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv, additionalData: new TextEncoder().encode(enc.id) }, cryptoKey, buf);
return new TextDecoder().decode(dec);
}

async function unlockVault(password) {
const vault = lv();
if (!vault) return false;
const salt = new Uint8Array(vault.salt);
const key = await deriveKey(password, salt);
const verify = await decryptToken(vault.verify, key);
if (verify !== 'vault-ok') return false;
for (const bot of vault.bots) {
for (const t of bot.tokens) {
bot.token = await decryptToken(t, key);
}
}
K = key;
V = vault;
return true;
}

function lockVault() { V = null; K = null; activeTab = 'vault'; renderTabs(); renderVault(); }

async function createVault(password) {
const salt = crypto.getRandomValues(new Uint8Array(16));
const key = await deriveKey(password, salt);
const verify = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: crypto.getRandomValues(new Uint8Array(12)) }, await crypto.subtle.importKey('raw', key, { name: 'AES-GCM' }, false, ['encrypt']), new TextEncoder().encode('vault-ok'));
V = { salt: Array.from(salt), verify: { id: 'verify', iv: Array.from(new Uint8Array(12)), data: Array.from(new Uint8Array(verify.slice(0, -16))), auth: Array.from(new Uint8Array(verify.slice(-16))) }, bots: [] };
K = key;
sv(V);
}

async function addBot(name, token) {
const id = crypto.randomUUID();
const iv = crypto.getRandomValues(new Uint8Array(12));
const cryptoKey = await crypto.subtle.importKey('raw', K, { name: 'AES-GCM' }, false, ['encrypt']);
const enc = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, new TextEncoder().encode(token));
const auth = new Uint8Array(enc.slice(-16));
const data = new Uint8Array(enc.slice(0, -16));
V.bots.push({ id, name, tokens: [{ id, iv: Array.from(iv), data: Array.from(data), auth: Array.from(auth) }] });
sv(V);
}

function removeBot(id) { V.bots = V.bots.filter(b => b.id !== id); sv(V); renderVault(); }

function testBot(bot) {
selToken = bot.token;
return api('/discord/users/@me').then(u => { tt(`${t('vault.connected_as')} @${u.username}`); }).catch(e => { throw new Error(t('vault.invalid_token')); });
}

function inviteBot(bot) {
const url = `https://discord.com/oauth2/authorize?client_id=${bot.token.split('.')[0]}&scope=bot&permissions=8`;
window.open(url, '_blank');
}

// ===== UI Rendering =====
function renderTabs() {
const container = document.getElementById('main-tabs');
const tabs = ['vault','send','logs','presence','voice','cleaner','settings'];
container.innerHTML = '';
tabs.forEach(tab => {
const btn = document.createElement('button');
btn.className = 'tab-btn' + (tab === activeTab ? ' active' : '');
btn.dataset.tab = tab;
const iconMap = { vault:'lock', send:'send', logs:'archive', presence:'circle', voice:'volume', cleaner:'trash', settings:'settings' };
btn.innerHTML = `${ICONS[iconMap[tab]]} <span>${t('nav.'+tab)}</span>`;
btn.onclick = () => switchTab(tab);
container.appendChild(btn);
});
}

function switchTab(tab) {
if (!V && tab !== 'vault' && tab !== 'settings') { switchTab('vault'); return; }
activeTab = tab;
document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
document.querySelectorAll('.panel').forEach(p => p.classList.toggle('hidden', p.id !== 'panel-'+tab));
if (tab === 'vault') renderVault();
else if (tab === 'send') { renderSendBotSelect(); }
else if (tab === 'logs') { renderLogBotSelect(); }
else if (tab === 'presence') { renderPresenceBotSelect(); }
else if (tab === 'voice') { renderVoiceBotSelect(); }
else if (tab === 'cleaner') { renderCleanBotSelect(); }
else if (tab === 'settings') { renderSettings(); }
}

function renderVault() {
const container = document.getElementById('bot-cards');
if (!V || !V.bots.length) {
container.innerHTML = `<div class="muted center" style="padding:40px;">${t('vault.none')}</div>`;
return;
}
container.innerHTML = '';
V.bots.forEach(bot => {
const card = document.createElement('div');
card.className = 'bot-card';
card.innerHTML = `
<div class="bot-card-header">
<div class="bot-card-info">
<div class="bot-card-name"><span class="bot-card-dot ${bot.status || 'offline'}"></span>${esc(bot.name)}</div>
<div class="bot-card-meta">${bot.tokens[0]?.id ? 'ID: '+esc(bot.tokens[0].id.slice(0,20))+'...' : ''}</div>
</div>
<div class="bot-card-actions">
<button class="btn btn-ghost btn-sm" data-act="test">${t('vault.test')}</button>
<button class="btn btn-ghost btn-sm" data-act="invite">${t('vault.invite')}</button>
<button class="btn btn-danger btn-sm" data-act="delete">${t('vault.delete')}</button>
</div>
</div>`;
card.querySelector('[data-act="test"]').onclick = async () => { await testBot(bot); };
card.querySelector('[data-act="invite"]').onclick = () => inviteBot(bot);
card.querySelector('[data-act="delete"]').onclick = () => confirm(t('vault.remove_desc',{name:bot.name})) && (removeBot(bot.id), tt(t('vault.removed')));
container.appendChild(card);
});
}

function renderBotSelect(selId, placeholderKey, bots, current) {
const sel = document.getElementById(selId);
if (!sel) return;
const cur = sel.value || current;
sel.innerHTML = '';
const ph = document.createElement('option');
ph.value = '';
ph.dataset.i18nKey = placeholderKey;
ph.textContent = t(placeholderKey);
sel.appendChild(ph);
bots.forEach(b => {
const opt = document.createElement('option');
opt.value = b.id;
opt.textContent = b.name;
sel.appendChild(opt);
});
if (cur) sel.value = cur;
sel.onchange = () => { /* handled by callers */ };
}

function renderSendBotSelect() {
renderBotSelect('send-bot', 'select.bot', V.bots, selBot ? selBot.id : '');
const sel = document.getElementById('send-bot');
sel.onchange = async () => {
selBot = V.bots.find(b => b.id === sel.value) || null;
selToken = selBot ? selBot.token : null;
document.getElementById('send-guild').disabled = !selBot;
document.getElementById('send-chan').disabled = !selBot;
if (selBot) await loadSendGuilds();
updateSendPreview();
};
if (selBot) loadSendGuilds();
updateSendPreview();
}

async function loadSendGuilds() {
if (!selBot || !selToken) return;
try {
const guilds = await gatewayGet('/discord/users/@me/guilds');
const sel = document.getElementById('send-guild');
const cur = sel.value;
sel.innerHTML = '<option data-i18n-key="select.choose_server">'+t('select.choose_server')+'</option>';
guilds.forEach(g => { const o = document.createElement('option'); o.value = g.id; o.textContent = g.name; sel.appendChild(o); });
sel.disabled = false;
if (cur) sel.value = cur;
loadSendChannels(sel.value);
} catch (e) { showError(document.getElementById('send-error'), e.message); }
}

function loadSendChannels(guildId) {
if (!guildId || !selToken) return;
gatewayGet('/discord/guilds/'+guildId+'/channels').then(channels => {
const sel = document.getElementById('send-chan');
const cur = sel.value;
sel.innerHTML = '<option data-i18n-key="select.choose_channel">'+t('select.choose_channel')+'</option>';
channels.filter(c => c.type === 0 || c.type === 5 || c.type === 13).forEach(c => { const o = document.createElement('option'); o.value = c.id; o.textContent = (c.type===5?'📁 ':'# ') + c.name; sel.appendChild(o); });
sel.disabled = false;
if (cur) sel.value = cur;
}).catch(e => showError(document.getElementById('send-error'), e.message));
}

document.getElementById('send-guild').onchange = e => loadSendChannels(e.target.value);

function updateSendPreview() {
const preview = document.getElementById('send-preview');
if (!preview) return;
const content = document.getElementById('send-content')?.value || '';
const hasEmbed = document.getElementById('send-embed-toggle')?.checked;
if (!content && !hasEmbed) { preview.className = 'preview empty'; preview.textContent = t('send.preview_empty'); return; }
preview.className = 'preview';
let html = esc(content).replace(/\n/g,'<br>').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\|\|(.+?)\|\|/g,'<span class="spoiler">$1</span>');
if (hasEmbed) {
const title = document.getElementById('e-title')?.value || '';
const desc = document.getElementById('e-desc')?.value || '';
const color = document.getElementById('e-color')?.value || '#2563eb';
html += `<div class="embed" style="border-left-color:${esc(color)}"><strong>${esc(title)}</strong><br>${esc(desc).replace(/\n/g,'<br>')}</div>`;
}
preview.innerHTML = html;
}

const send_content = document.getElementById('send-content'); if (send_content) send_content.addEventListener('input', updateSendPreview);
const send_embed_toggle = document.getElementById('send-embed-toggle'); if (send_embed_toggle) send_embed_toggle.addEventListener('change', e => {
document.getElementById('send-embed-form').classList.toggle('hidden', !e.target.checked);
updateSendPreview();
});
document.querySelectorAll('#e-title, #e-desc, #e-color').forEach(el => el?.addEventListener('input', updateSendPreview));

document.getElementById('send-mode')?.querySelectorAll('.seg-btn').forEach(btn => {
btn.onclick = () => {
document.getElementById('send-mode').querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
btn.classList.add('active');
document.getElementById('send-auto').classList.toggle('hidden', btn.dataset.mode !== 'auto');
document.getElementById('send-manual').classList.toggle('hidden', btn.dataset.mode === 'auto');
};
});

const send_attach_btn = document.getElementById('send-attach-btn'); if (send_attach_btn) send_attach_btn.onclick = () => document.getElementById('send-attachment').click();
const send_attachment = document.getElementById('send-attachment'); if (send_attachment) send_attachment.addEventListener('change', e => {
const f = e.target.files[0];
if (!f) return;
const wrap = document.getElementById('send-file-preview');
wrap.innerHTML = `<div class="file-preview"><img src="${URL.createObjectURL(f)}" alt=""><div class="file-preview-info"><div class="file-preview-name">${esc(f.name)}</div><div class="file-preview-meta">${(f.size/1024).toFixed(1)} KB</div></div><button class="file-preview-remove">${ICONS.x}</button></div>`;
wrap.querySelector('.file-preview-remove').onclick = () => { wrap.innerHTML = ''; document.getElementById('send-attachment').value = ''; };
wrap.classList.remove('hidden');
});

const send_btn = document.getElementById('send-btn'); if (send_btn) send_btn.onclick = async () => {
if (!selBot || !selToken) return tt(t('send.error_no_bot'), true);
const content = document.getElementById('send-content').value.trim();
const hasEmbed = document.getElementById('send-embed-toggle').checked;
const isVoice = document.getElementById('send-voice-msg').checked;
const file = document.getElementById('send-attachment').files[0];
if (!content && !hasEmbed && !isVoice && !file) return tt(t('send.error_empty'), true);

const err = document.getElementById('send-error');
hideError(err);
const btn = document.getElementById('send-btn');
btn.disabled = true;

try {
let channelId;
if (document.getElementById('send-auto').classList.contains('hidden')) {
channelId = document.getElementById('send-manual-chan').value.trim();
if (!channelId) throw new Error(t('send.error_no_channel'));
} else {
channelId = document.getElementById('send-chan').value;
if (!channelId) throw new Error(t('send.error_no_channel'));
}

const payload = { content: content || undefined };
if (hasEmbed) {
const embed = { title: document.getElementById('e-title').value || undefined, description: document.getElementById('e-desc').value || undefined, color: parseInt(document.getElementById('e-color').value.slice(1), 16) };
if (document.getElementById('e-url').value) embed.url = document.getElementById('e-url').value;
if (document.getElementById('e-ts').value === 'now') embed.timestamp = new Date().toISOString();
if (document.getElementById('e-aname').value) embed.author = { name: document.getElementById('e-aname').value, icon_url: document.getElementById('e-aicon').value || undefined };
if (document.getElementById('e-img').value) embed.image = { url: document.getElementById('e-img').value };
if (document.getElementById('e-thumb').value) embed.thumbnail = { url: document.getElementById('e-thumb').value };
if (document.getElementById('e-footer').value) embed.footer = { text: document.getElementById('e-footer').value, icon_url: document.getElementById('e-ficon').value || undefined };
payload.embeds = [embed];
}

if (file) {
const form = new FormData();
form.append('payload_json', JSON.stringify(payload));
form.append('file', file);
const res = await fetch(BASE + '/discord/channels/' + channelId + '/messages', { method: 'POST', headers: { 'X-Bot-Token': selToken }, body: form });
if (!res.ok) throw new Error((await res.json()).error || 'Upload failed');
} else if (isVoice) {
await handleVoiceMessage(selBot.id, channelId);
} else {
await gateway('/discord/channels/' + channelId + '/messages', payload);
}
tt(t('send.sent'));
} catch (e) { showError(err, e.message); }
finally { btn.disabled = false; }

async function handleVoiceMessage(botId, channelId) {
const file = document.getElementById('voice-file')?.files[0];
const recordBlob = document.getElementById('voice-record-preview')?.src?.startsWith('blob:') ? await fetch(document.getElementById('voice-record-preview').src).then(r => r.blob()) : null;
const audioFile = file || recordBlob;
if (!audioFile) throw new Error(t('send.voice_need_file'));
const isOgg = audioFile.name.endsWith('.ogg') || audioFile.name.endsWith('.opus') || audioFile.type.includes('ogg');
let audioBase64, filename = audioFile.name;
if (!isOgg) {
document.getElementById('voice-play-status').textContent = t('voice.play_transcoding');
const dataUrl = await readFileAsDataURL(audioFile);
const res = await gateway('/gateway/tools/transcode-voice', { audio_base64: dataUrl, filename: audioFile.name });
audioBase64 = res.audio_base64;
filename = res.filename;
} else {
audioBase64 = await readFileAsDataURL(audioFile);
}
await gateway('/discord/channels/' + channelId + '/messages', { flags: 8192, attachments: [{ id: 0, filename, content_type: 'audio/ogg', description: 'voice-message' }] });
// Note: actual voice message sending needs the voice message endpoint
}

function readFileAsDataURL(file) { return new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result.split(',')[1]); fr.readAsDataURL(file); }); }

function renderLogBotSelect() {
renderBotSelect('log-bot', 'select.bot', V.bots, logBot ? logBot.id : '');
document.getElementById('log-bot').onchange = async () => {
logBot = V.bots.find(b => b.id === document.getElementById('log-bot').value) || null;
logToken = logBot ? logBot.token : null;
document.getElementById('log-guild').disabled = true;
document.getElementById('log-chan').disabled = true;
if (logToken) await loadLogGuilds();
};
if (logBot) loadLogGuilds();
}

async function loadLogGuilds() {
if (!logToken) return;
try {
const guilds = await gatewayGet('/discord/users/@me/guilds');
const sel = document.getElementById('log-guild');
sel.innerHTML = '<option data-i18n-key="select.choose_server">'+t('select.choose_server')+'</option>';
guilds.forEach(g => { const o = document.createElement('option'); o.value = g.id; o.textContent = g.name; sel.appendChild(o); });
sel.disabled = false;
loadLogChannels(sel.value);
} catch (e) { showError(document.getElementById('log-error'), e.message); }
}

function loadLogChannels(guildId) {
if (!guildId || !logToken) return;
gatewayGet('/discord/guilds/'+guildId+'/channels').then(channels => {
const sel = document.getElementById('log-chan');
sel.innerHTML = '<option data-i18n-key="select.choose_channel">'+t('select.choose_channel')+'</option>';
channels.filter(c => c.type === 0 || c.type === 5 || c.type === 13).forEach(c => { const o = document.createElement('option'); o.value = c.id; o.textContent = (c.type===5?'📁 ':'# ') + c.name; sel.appendChild(o); });
sel.disabled = false;
}).catch(e => showError(document.getElementById('log-error'), e.message));
}

const log_guild = document.getElementById('log-guild'); if (log_guild) log_guild.onchange = e => loadLogChannels(e.target.value);
const log_chan = document.getElementById('log-chan'); if (log_chan) log_chan.onchange = e => { logChannel = e.target.value; document.getElementById('log-rest').disabled = !logChannel; document.getElementById('log-archive').disabled = !logChannel; };

const log_rest = document.getElementById('log-rest'); if (log_rest) log_rest.onclick = async () => {
if (!logChannel) return;
hideError(document.getElementById('log-error'));
const btn = document.getElementById('log-rest');
btn.disabled = true;
btn.textContent = t('common.loading');
try {
const old = selToken; selToken = logToken;
const msgs = await gatewayGet('/channels/' + logChannel + '/messages?limit=50');
selToken = old;
renderLogs(msgs.reverse().map(m => ({ ...m, _deleted: false })));
} catch (e) { showError(document.getElementById('log-error'), e.message); }
finally { btn.disabled = false; btn.textContent = t('logs.load_rest'); }
};

const log_archive = document.getElementById('log-archive'); if (log_archive) log_archive.onclick = async () => {
if (!logChannel) return;
hideError(document.getElementById('log-error'));
const btn = document.getElementById('log-archive');
btn.disabled = true;
btn.textContent = t('common.loading');
try {
const msgs = loadArchive(logChannel);
renderLogs(msgs.reverse().map(m => ({ ...m, _archived: true })));
} catch (e) { showError(document.getElementById('log-error'), e.message); }
finally { btn.disabled = false; btn.textContent = t('logs.load_archive'); }
};

function loadArchive(channelId) { try { return JSON.parse(localStorage.getItem('archive_'+channelId) || '[]'); } catch { return []; } }

function renderLogs(msgs) {
const feed = document.getElementById('log-feed');
feed.innerHTML = '';
msgs.forEach(m => {
const div = document.createElement('div');
div.className = 'log-msg' + (m._deleted ? ' deleted' : '');
const badge = m._deleted ? `<span class="log-msg-badge deleted">${t('logs.deleted')}</span>` : (m._edited ? `<span class="log-msg-badge edited">${t('logs.edited')}</span>` : '');
div.innerHTML = `<div class="log-msg-header"><span class="log-msg-author">${esc(m.author?.username || 'Unknown')}</span>${badge}<span class="log-msg-time">${m.timestamp ? new Date(m.timestamp).toLocaleString() : ''}</span></div><div class="log-msg-content">${esc(m.content || '')}</div>`;
feed.appendChild(div);
});
feed.scrollTop = feed.scrollHeight;
}

function renderPresenceBotSelect() {
renderBotSelect('presence-bot', 'select.bot', V.bots, presenceBot ? presenceBot.id : '');
document.getElementById('presence-bot').onchange = () => {
presenceBot = V.bots.find(b => b.id === document.getElementById('presence-bot').value) || null;
presenceToken = presenceBot ? presenceBot.token : null;
document.getElementById('presence-apply').disabled = !presenceBot;
document.getElementById('presence-disc').disabled = !presenceBot;
};
if (presenceBot) { document.getElementById('presence-apply').disabled = false; document.getElementById('presence-disc').disabled = false; }
}

const presence_apply = document.getElementById('presence-apply'); if (presence_apply) presence_apply.onclick = async () => {
if (!presenceBot || !presenceToken) return;
hideError(document.getElementById('presence-error'));
const btn = document.getElementById('presence-apply');
btn.disabled = true;
try {
await gateway(`/${presenceBot.id}/presence`, { status: document.getElementById('presence-status').value, activity: document.getElementById('presence-activity').value });
tt(t('presence.updated'));
updatePresenceSessions();
} catch (e) { showError(document.getElementById('presence-error'), e.message); }
finally { btn.disabled = false; }
};

const presence_disc = document.getElementById('presence-disc'); if (presence_disc) presence_disc.onclick = async () => {
if (!presenceBot) return;
hideError(document.getElementById('presence-error'));
await gateway(`/${presenceBot.id}/disconnect`);
tt(t('presence.disconnected'));
updatePresenceSessions();
};

async function updatePresenceSessions() {
const el = document.getElementById('presence-sessions');
try {
const { sessions } = await gatewayGet('/gateway/status');
const botSessions = sessions.filter(s => !presenceBot || s.id === presenceBot.id);
if (!botSessions.length) { el.textContent = t('presence.no_sessions'); el.className = 'muted small'; return; }
el.className = '';
el.innerHTML = botSessions.map(s => `<div style="padding:8px;background:var(--bg-input);border-radius:var(--radius);margin-bottom:8px;"><strong>${esc(s.user?.username||'Unknown')}</strong> <span class="muted">${esc(s.presence)}</span> ${s.connected ? '<span style="color:var(--success)">●</span>' : '<span style="color:var(--danger)">●</span>'}</div>`).join('');
} catch (e) { el.textContent = e.message; }
}

function renderVoiceBotSelect() {
renderBotSelect('voice-bot', 'select.bot', V.bots, voiceBot ? voiceBot.id : '');
document.getElementById('voice-bot').onchange = async () => {
voiceBot = V.bots.find(b => b.id === document.getElementById('voice-bot').value) || null;
voiceToken = voiceBot ? voiceBot.token : null;
document.getElementById('voice-guild').disabled = true;
document.getElementById('voice-chan').disabled = true;
if (voiceToken) loadVoiceGuilds().then(() => updateVoiceStatus());
updateVoiceStatus();
};
if (voiceBot) { loadVoiceGuilds().then(() => updateVoiceStatus()); }
}

async function loadVoiceGuilds() {
if (!voiceToken) return;
try {
const guilds = await gatewayGet('/discord/users/@me/guilds');
const sel = document.getElementById('voice-guild');
sel.innerHTML = '<option data-i18n-key="select.choose_server">'+t('select.choose_server')+'</option>';
guilds.forEach(g => { const o = document.createElement('option'); o.value = g.id; o.textContent = g.name; sel.appendChild(o); });
sel.disabled = false;
loadVoiceChannels(sel.value);
} catch (e) { showError(document.getElementById('voice-error'), e.message); }
}

function loadVoiceChannels(guildId) {
if (!guildId || !voiceToken) return;
gatewayGet('/discord/guilds/'+guildId+'/channels').then(channels => {
const sel = document.getElementById('voice-chan');
sel.innerHTML = '<option data-i18n-key="select.choose_channel">'+t('select.choose_channel')+'</option>';
channels.filter(c => c.type === 2).forEach(c => { const o = document.createElement('option'); o.value = c.id; o.textContent = '🔊 ' + c.name; sel.appendChild(o); });
sel.disabled = false;
}).catch(e => showError(document.getElementById('voice-error'), e.message));
}

const voice_guild = document.getElementById('voice-guild'); if (voice_guild) voice_guild.onchange = e => loadVoiceChannels(e.target.value);

const voice_join = document.getElementById('voice-join'); if (voice_join) voice_join.onclick = async () => {
if (!voiceBot || !voiceChannel) return;
voiceOperationInProgress = true;
const btn = document.getElementById('voice-join');
btn.disabled = true;
hideError(document.getElementById('voice-error'));
try {
await ensureVoiceJoined();
tt(voiceCurrentlyInChannel ? t('voice.updated') : t('voice.joined'));
await updateVoiceStatus();
} catch (e) { showError(document.getElementById('voice-error'), e.message); }
finally { btn.disabled = false; voiceOperationInProgress = false; updateVoiceControls(); }
};

const voice_leave = document.getElementById('voice-leave'); if (voice_leave) voice_leave.onclick = async () => {
if (!voiceBot) return;
voiceOperationInProgress = true;
const btn = document.getElementById('voice-leave');
btn.disabled = true;
hideError(document.getElementById('voice-error'));
try {
await gateway(`/${voiceBot.id}/voice/leave`);
tt(t('voice.left'));
await updateVoiceStatus();
} catch (e) { showError(document.getElementById('voice-error'), e.message); }
finally { btn.disabled = false; voiceOperationInProgress = false; updateVoiceControls(); }
};

const voice_refresh = document.getElementById('voice-refresh'); if (voice_refresh) voice_refresh.onclick = () => updateVoiceStatus();
['voice-mute','voice-deaf'].forEach(id => {
document.getElementById(id)?.addEventListener('change', async () => {
if (!voiceCurrentlyInChannel) return;
try { await ensureVoiceJoined(); await updateVoiceStatus(); } catch (e) { showError(document.getElementById('voice-error'), e.message); }
});
});

async function ensureVoiceJoined() {
if (!voiceBot || !voiceGuild || !voiceChannel) throw new Error(t('voice.not_in_channel'));
await gateway(`/${voiceBot.id}/connect`, { token: voiceToken });
await gateway(`/${voiceBot.id}/voice/join`, {
guild_id: voiceGuild,
channel_id: voiceChannel,
self_mute: document.getElementById('voice-mute').checked,
self_deaf: document.getElementById('voice-deaf').checked,
auto_leave_seconds: parseInt(document.getElementById('voice-autoleave').value) || 0,
timeout_ms: 12000
});
}

async function updateVoiceStatus() {
const el = document.getElementById('voice-status');
if (!el) return;
if (!voiceBot) { el.innerHTML = '<div class="muted center">'+t('voice.select_bot')+'</div>'; updateVoiceControls(); return; }
try {
const s = await gatewayGet(`/${voiceBot.id}/voice/status`);
voiceCurrentlyInChannel = !!s.voice?.channel_id;
voiceGuild = s.voice?.guild_id || null;
voiceChannel = s.voice?.channel_id || null;
el.innerHTML = `
<div class="status-row"><span class="status-dot ${s.connected ? 'online' : 'offline'}"></span><span>${s.connected ? t('common.connected') : t('common.disconnected')}</span></div>
${s.voice?.channel_id ? `<div class="status-row"><span>${t('voice.in_channel')}</span><code class="mono">${esc(s.voice.channel_id)}</code></div>` : ''}
${s.voiceTransportReady ? `<div class="status-row"><span class="status-dot online"></span><span>${t('voice.transport_ready')}</span></div>` : ''}
${s.playing ? `<div class="status-row"><span class="status-dot online"></span><span>${t('voice.play_playing')}</span></div>` : ''}
`;
} catch (e) { el.innerHTML = '<div class="muted">'+e.message+'</div>'; }
updateVoiceControls();
}

function updateVoiceControls() {
const joinBtn = document.getElementById('voice-join');
const leaveBtn = document.getElementById('voice-leave');
const playBtn = document.getElementById('voice-play');
const stopBtn = document.getElementById('voice-stop');

if (joinBtn) {
joinBtn.disabled = !voiceBot || !voiceChannel || voiceOperationInProgress;
joinBtn.textContent = voiceCurrentlyInChannel ? t('voice.update') : t('voice.join');
joinBtn.innerHTML = (voiceCurrentlyInChannel ? '' : '') + joinBtn.textContent;
}
if (leaveBtn) leaveBtn.disabled = !voiceBot || (!voiceChannel && !voiceCurrentlyInChannel) || voiceOperationInProgress;
if (playBtn) playBtn.disabled = !voiceBot || !voiceChannel || !voicePlayFile || voiceOperationInProgress || voiceCurrentlyPlaying;
if (stopBtn) stopBtn.disabled = !voiceBot || !voiceCurrentlyPlaying || voiceOperationInProgress;
}

const voice_play_file = document.getElementById('voice-play-file'); if (voice_play_file) voice_play_file.addEventListener('change', async e => {
voicePlayFile = e.target.files?.[0] || null;
const preview = document.getElementById('voice-play-preview');
const audio = document.getElementById('voice-play-audio');
if (voicePlayFile) {
audio.src = URL.createObjectURL(voicePlayFile);
preview.classList.remove('hidden');
} else {
audio.removeAttribute('src');
preview.classList.add('hidden');
}
updateVoiceControls();
});

const voice_play = document.getElementById('voice-play'); if (voice_play) voice_play.onclick = async () => {
if (!voiceBot || !voiceChannel || !voicePlayFile) return;
voiceOperationInProgress = true;
const btn = document.getElementById('voice-play');
const statusEl = document.getElementById('voice-play-status');
btn.disabled = true;
statusEl.textContent = t('voice.play_preparing');
updateVoiceControls();
try {
await ensureVoiceJoined();
let audioBase64, filename = voicePlayFile.name;
const isOgg = /\.ogg$/i.test(filename) || /\.opus$/i.test(filename) || voicePlayFile.type?.includes('ogg');
if (!isOgg) {
statusEl.textContent = t('voice.play_transcoding');
const dataUrl = await readFileAsDataURL(voicePlayFile);
const res = await gateway('/gateway/tools/transcode-voice', { audio_base64: dataUrl, filename });
audioBase64 = res.audio_base64;
filename = res.filename || 'voice-message.ogg';
} else {
audioBase64 = await readFileAsDataURL(voicePlayFile);
}
voiceCurrentlyPlaying = true;
updateVoiceControls();
statusEl.textContent = t('voice.play_playing');
const res = await gateway(`/${voiceBot.id}/voice/play`, {
guild_id: voiceGuild,
channel_id: voiceChannel,
filename,
audio_base64: audioBase64,
self_mute: document.getElementById('voice-mute').checked,
self_deaf: document.getElementById('voice-deaf').checked
});
statusEl.textContent = `${t('voice.play_playing')} · ${Math.round((res.duration_ms||0)/1000)}s`;
setTimeout(() => { voiceCurrentlyPlaying = false; updateVoiceControls(); updateVoiceStatus(); }, (res.duration_ms||0)+1500);
} catch (e) {
statusEl.textContent = t('common.error') + ': ' + e.message;
showError(document.getElementById('voice-error'), e.message);
} finally {
btn.disabled = false;
voiceOperationInProgress = false;
updateVoiceControls();
}
};

const voice_stop = document.getElementById('voice-stop'); if (voice_stop) voice_stop.onclick = async () => {
if (!voiceBot) return;
voiceOperationInProgress = true;
try {
await gateway(`/${voiceBot.id}/voice/stop`);
voiceCurrentlyPlaying = false;
document.getElementById('voice-play-status').textContent = t('voice.play_stopped');
updateVoiceControls();
updateVoiceStatus();
} catch (e) { showError(document.getElementById('voice-error'), e.message); }
finally { voiceOperationInProgress = false; }
};

document.getElementById('voice-mode')?.querySelectorAll('.seg-btn').forEach(btn => {
btn.onclick = () => {
document.getElementById('voice-mode').querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
btn.classList.add('active');
document.getElementById('voice-upload').classList.toggle('hidden', btn.dataset.mode !== 'upload');
document.getElementById('voice-record').classList.toggle('hidden', btn.dataset.mode !== 'record');
};
});

const voice_file = document.getElementById('voice-file'); if (voice_file) voice_file.addEventListener('change', e => {
const f = e.target.files[0];
if (f) {
const audio = document.getElementById('voice-file-preview');
audio.src = URL.createObjectURL(f);
audio.classList.remove('hidden');
}
});

let mediaRecorder = null;
const voice_record_start = document.getElementById('voice-record-start'); if (voice_record_start) voice_record_start.onclick = async () => {
try {
const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 48000, channelCount: 1 } });
mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/ogg;codecs=opus' });
voiceRecordChunks = [];
mediaRecorder.ondataavailable = e => { if (e.data.size) voiceRecordChunks.push(e.data); };
mediaRecorder.onstop = () => {
const blob = new Blob(voiceRecordChunks, { type: 'audio/ogg;codecs=opus' });
const audio = document.getElementById('voice-record-preview');
audio.src = URL.createObjectURL(blob);
audio.classList.remove('hidden');
document.getElementById('voice-record-status').textContent = t('send.voice_ready');
document.getElementById('voice-record-start').classList.remove('hidden');
document.getElementById('voice-record-stop').classList.add('hidden');
document.getElementById('voice-record-status').classList.remove('recording');
stream.getTracks().forEach(t => t.stop());
};
mediaRecorder.start(100);
document.getElementById('voice-record-start').classList.add('hidden');
document.getElementById('voice-record-stop').classList.remove('hidden');
document.getElementById('voice-record-status').textContent = t('send.voice_recording');
document.getElementById('voice-record-status').classList.add('recording');
} catch (e) { showError(document.getElementById('voice-error'), t('send.voice_record_unsupported')); }
};

const voice_record_stop = document.getElementById('voice-record-stop'); if (voice_record_stop) voice_record_stop.onclick = () => {
if (mediaRecorder && mediaRecorder.state === 'recording') mediaRecorder.stop();
};

function renderCleanBotSelect() {
renderBotSelect('clean-bot', 'select.bot', V.bots, cleanBot ? cleanBot.id : '');
document.getElementById('clean-bot').onchange = async () => {
cleanBot = V.bots.find(b => b.id === document.getElementById('clean-bot').value) || null;
cleanToken = cleanBot ? cleanBot.token : null;
document.getElementById('clean-guild').disabled = true;
document.getElementById('clean-chan').disabled = true;
if (cleanToken) loadCleanGuilds();
};
if (cleanBot) loadCleanGuilds();
}

async function loadCleanGuilds() {
if (!cleanToken) return;
try {
const guilds = await gatewayGet('/discord/users/@me/guilds');
const sel = document.getElementById('clean-guild');
sel.innerHTML = '<option data-i18n-key="select.choose_server">'+t('select.choose_server')+'</option>';
guilds.forEach(g => { const o = document.createElement('option'); o.value = g.id; o.textContent = g.name; sel.appendChild(o); });
sel.disabled = false;
loadCleanChannels(sel.value);
} catch (e) { showError(document.getElementById('clean-error'), e.message); }
}

function loadCleanChannels(guildId) {
if (!guildId || !cleanToken) return;
gatewayGet('/discord/guilds/'+guildId+'/channels').then(channels => {
const sel = document.getElementById('clean-chan');
sel.innerHTML = '<option data-i18n-key="select.choose_channel">'+t('select.choose_channel')+'</option>';
channels.filter(c => c.type === 0 || c.type === 5 || c.type === 13).forEach(c => { const o = document.createElement('option'); o.value = c.id; o.textContent = (c.type===5?'📁 ':'# ') + c.name; sel.appendChild(o); });
sel.disabled = false;
}).catch(e => showError(document.getElementById('clean-error'), e.message));
}

const clean_guild = document.getElementById('clean-guild'); if (clean_guild) clean_guild.onchange = e => loadCleanChannels(e.target.value);
const clean_chan = document.getElementById('clean-chan'); if (clean_chan) clean_chan.onchange = e => {
cleanChannel = e.target.value;
const target = document.getElementById('clean-target');
target.textContent = cleanChannel ? `${document.getElementById('clean-guild').selectedOptions[0]?.text} / ${e.target.selectedOptions[0]?.text}` : '';
};

const clean_clone = document.getElementById('clean-clone'); if (clean_clone) clean_clone.onclick = async () => {
if (!cleanBot || !cleanChannel) return;
if (!confirm(t('cleaner.clone_confirm'))) return;
hideError(document.getElementById('clean-error'));
const btn = document.getElementById('clean-clone');
btn.disabled = true;
try {
await gateway(`/discord/channels/${cleanChannel}`, { method: 'DELETE' });
const ch = await gatewayGet(`/discord/channels/${cleanChannel}`);
await gateway(`/discord/guilds/${cleanGuild}/channels`, { method: 'POST', body: { name: ch.name, type: ch.type, parent_id: ch.parent_id, permission_overwrites: ch.permission_overwrites } });
tt(t('cleaner.cloned'));
} catch (e) { showError(document.getElementById('clean-error'), e.message); }
finally { btn.disabled = false; }
};

const clean_delete = document.getElementById('clean-delete'); if (clean_delete) clean_delete.onclick = async () => {
if (!cleanBot || !cleanChannel) return;
if (!confirm(t('cleaner.delete_confirm'))) return;
hideError(document.getElementById('clean-error'));
const btn = document.getElementById('clean-delete');
const prog = document.getElementById('clean-progress');
const progText = document.getElementById('clean-progress-text');
btn.disabled = true;
prog.classList.remove('hidden');
progText.classList.remove('hidden');
try {
let total = 0;
while (true) {
const msgs = await gatewayGet(`/channels/${cleanChannel}/messages?limit=100`);
if (!msgs.length) break;
const ids = msgs.map(m => m.id);
const chunks = [];
for (let i = 0; i < ids.length; i += 100) chunks.push(ids.slice(i, i + 100));
for (const chunk of chunks) {
await gateway(`/discord/channels/${cleanChannel}/messages/bulk-delete`, { method: 'POST', body: { messages: chunk } });
total += chunk.length;
progText.textContent = `${t('cleaner.deleted')} ${total}`;
}
if (msgs.length < 100) break;
}
tt(`${t('cleaner.deleted')} ${total}`);
} catch (e) { showError(document.getElementById('clean-error'), e.message); }
finally { btn.disabled = false; prog.classList.add('hidden'); progText.classList.add('hidden'); }
};

function renderSettings() {
document.getElementById('lang-setting').value = currentLang;
document.getElementById('lang-setting').onchange = e => loadLang(e.target.value);
document.querySelectorAll('#autolock-seg .seg-btn').forEach(btn => {
btn.classList.toggle('active', btn.dataset.v === localStorage.getItem('autolock'));
btn.onclick = () => { document.querySelectorAll('#autolock-seg .seg-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); localStorage.setItem('autolock', btn.dataset.v); };
});
document.querySelectorAll('#theme-seg .seg-btn').forEach(btn => {
btn.classList.toggle('active', btn.dataset.v === (document.documentElement.dataset.theme || 'auto'));
btn.onclick = () => { document.querySelectorAll('#theme-seg .seg-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); document.documentElement.dataset.theme = btn.dataset.v; localStorage.setItem('theme', btn.dataset.v); };
});
const changepw_btn = document.getElementById('changepw-btn'); if (changepw_btn) changepw_btn.onclick = () => showModal('modal-changepw');
const reset_vault = document.getElementById('reset-vault'); if (reset_vault) reset_vault.onclick = () => confirmModal(t('settings.reset_confirm'), () => { localStorage.removeItem('v'); lockVault(); location.reload(); });
}

const changepw_form = document.getElementById('changepw-form'); if (changepw_form) changepw_form.onsubmit = async e => {
e.preventDefault();
const old = document.getElementById('cpw-old').value;
const neu = document.getElementById('cpw-new').value;
const neu2 = document.getElementById('cpw-new2').value;
const err = document.getElementById('changepw-error');
if (neu !== neu2) return showError(err, t('error.password_mismatch'));
if (neu.length < 8) return showError(err, t('error.min_password'));
hideError(err);
try {
await unlockVault(old);
await createVault(neu);
for (const bot of V.bots) {
for (const tok of bot.tokens) {
const plain = await decryptToken(tok, K);
const iv = crypto.getRandomValues(new Uint8Array(12));
const ck = await crypto.subtle.importKey('raw', K, { name: 'AES-GCM' }, false, ['encrypt']);
const enc = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, ck, new TextEncoder().encode(plain));
tok.iv = Array.from(iv);
tok.data = Array.from(new Uint8Array(enc.slice(0, -16)));
tok.auth = Array.from(new Uint8Array(enc.slice(-16)));
}
}
sv(V);
closeModal('modal-changepw');
tt(t('settings.password_changed'));
} catch (e) { showError(err, e.message); }
};

function showModal(id) { document.getElementById(id).classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); document.body.style.overflow = ''; }
function confirmModal(msg, fn) { const m = document.getElementById('modal-generic'); document.getElementById('modal-title').textContent = t('common.confirm'); document.getElementById('modal-desc').textContent = msg; document.getElementById('modal-body').innerHTML = ''; document.getElementById('modal-confirm').onclick = () => { closeModal('modal-generic'); fn(); }; showModal('modal-generic'); }
document.querySelectorAll('.modal-close, .modal-backdrop').forEach(el => el.onclick = () => closeModal(el.closest('.modal').id));
document.querySelectorAll('.modal-box [data-i18n="common.cancel"]').forEach(btn => btn.onclick = () => closeModal(btn.closest('.modal').id));

const lock_btn = document.getElementById('lock-btn'); if (lock_btn) lock_btn.onclick = () => { lockVault(); tt(t('vault.locked')); };
const menu_toggle = document.getElementById('menu-toggle'); if (menu_toggle) menu_toggle.onclick = () => document.getElementById('sidebar').classList.toggle('open');
const backdrop = document.getElementById('backdrop'); if (backdrop) backdrop.onclick = () => document.getElementById('sidebar').classList.remove('open');
const theme_toggle = document.getElementById('theme-toggle'); if (theme_toggle) theme_toggle.onclick = () => { const themes = ['light','dark','auto']; const cur = document.documentElement.dataset.theme || 'auto'; const next = themes[(themes.indexOf(cur)+1)%3]; document.documentElement.dataset.theme = next; localStorage.setItem('theme', next); document.querySelectorAll('#theme-seg .seg-btn').forEach(b => b.classList.toggle('active', b.dataset.v === next)); };
const add_bot_btn = document.getElementById('add-bot-btn'); if (add_bot_btn) add_bot_btn.onclick = () => { const n = prompt(t('vault.name_placeholder')); if (!n) return; const tkn = prompt(t('vault.token_placeholder')); if (!tkn) return; addBot(n, tkn).then(() => { renderVault(); tt(t('vault.added_bot')); }); };

function initUnlock() {
const form = document.getElementById('unlock-form');
const pw = document.getElementById('pw');
const pw2 = document.getElementById('pw2');
const pw2Field = document.getElementById('pw2-field');
const btn = document.getElementById('submit-btn');
const err = document.getElementById('unlock-error');
const title = document.getElementById('unlock-title');
const desc = document.getElementById('unlock-desc');
const vault = lv();
if (vault) {
title.textContent = t('unlock.unlock_title');
desc.textContent = t('unlock.unlock_desc');
btn.textContent = t('unlock.unlock');
pw2Field.classList.add('hidden');
} else {
title.textContent = t('unlock.create_title');
desc.textContent = t('unlock.create_desc');
btn.textContent = t('unlock.create');
pw2Field.classList.remove('hidden');
}

form.onsubmit = async e => {
e.preventDefault();
hideError(err);
const p = pw.value;
if (!vault && p !== pw2.value) return showError(err, t('error.password_mismatch'));
if (p.length < 8) return showError(err, t('error.min_password'));
btn.disabled = true;
try {
if (vault) { if (!await unlockVault(p)) return showError(err, t('error.invalid_password')); }
else { await createVault(p); }
initApp();
} catch (e) { showError(err, e.message); }
finally { btn.disabled = false; }
};
}

function initApp() {
document.getElementById('panel-unlock').classList.add('hidden');
document.getElementById('main-content').classList.remove('hidden');
document.querySelector('.sidebar').classList.remove('hidden');
renderTabs();
switchTab('vault');
applyTheme();
updatePresenceSessions();
setInterval(() => { if (activeTab === 'presence') updatePresenceSessions(); if (activeTab === 'voice') updateVoiceStatus(); }, 30000);
}

function applyTheme() {
const saved = localStorage.getItem('theme') || 'auto';
document.documentElement.dataset.theme = saved;
document.querySelectorAll('#theme-seg .seg-btn').forEach(b => b.classList.toggle('active', b.dataset.v === saved));
}

async function initAll() {
await initI18n();
initUnlock();
}

initAll();
}