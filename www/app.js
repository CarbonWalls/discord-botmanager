document.documentElement.classList.add('i18n-loading');

const CRITICAL_CSS = `
html.i18n-loading body {
  visibility: hidden;
}

.app.locked .main {
  margin-left: 0 !important;
}

.app.locked .mobile-header {
  display: none !important;
}

input[type="file"] {
  display: block;
  width: 100%;
  padding: 10px 12px;
  border: 1px dashed var(--border, #dee2e6);
  border-radius: 8px;
  background: var(--bg-input, #fff);
  color: var(--text, #212529);
  cursor: pointer;
}

input[type="file"]::file-selector-button {
  margin-right: 10px;
  border: none;
  background: var(--primary, #2563eb);
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.check-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  margin-bottom: 12px;
  background: var(--bg-input, #fff);
  border: 1px solid var(--border, #dee2e6);
  border-radius: 8px;
  cursor: pointer;
}

.check-row input[type="checkbox"] {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid var(--border, #dee2e6);
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
}

.check-row input[type="checkbox"]:checked {
  background: var(--primary, #2563eb);
  border-color: var(--primary, #2563eb);
}

.check-row input[type="checkbox"]:checked::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.profile-details {
  overflow: visible;
}

.profile-header {
  overflow: visible;
  margin-top: 12px;
}

.profile-header.has-banner {
  margin-top: -40px;
}

@media (max-width: 640px) {
  .modal {
    padding: 12px;
  }

  .modal-content {
    padding: 16px;
    max-height: 88vh;
  }

  .profile-header.has-banner {
    margin-top: -32px;
  }

  .profile-avatar {
    width: 64px !important;
    height: 64px !important;
  }

  .profile-grid {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions .btn {
    width: 100%;
  }
}
`;

(function injectCriticalCss() {
  const style = document.createElement('style');
  style.textContent = CRITICAL_CSS;
  document.head.appendChild(style);
})();

const ICONS = {
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>',
  archive: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="5" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>',
  circle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>',
  box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  trashSmall: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>',
  volume: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>'
};

function injectIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach(el => {
    const name = el.getAttribute('data-icon');
    if (ICONS[name]) el.innerHTML = ICONS[name];
  });
}

injectIcons();

let storageOk = true;

function safeGetItem(key) {
  try { return localStorage.getItem(key); } catch { storageOk = false; return null; }
}

function safeSetItem(key, val) {
  try { localStorage.setItem(key, val); } catch { storageOk = false; }
}

function safeRemoveItem(key) {
  try { localStorage.removeItem(key); } catch { storageOk = false; }
}

if (typeof crypto === 'undefined' || !crypto.subtle) {
  const btn = document.getElementById('sb');
  const err = document.getElementById('em');

  if (btn) btn.disabled = true;

  if (err) {
    err.textContent = 'Web Crypto API unavailable. Use localhost or HTTPS.';
    err.classList.remove('hidden');
  }

  document.documentElement.classList.remove('i18n-loading');

  throw new Error('crypto.subtle not supported');
}

const API = '/discord';
const GATEWAY = '/gateway';
const ITERS = 100000;
const VER = 'vault-ok';
const INVITE_PERMS = 70368744295424;

let V = null;
let K = null;
let ALM = parseInt(safeGetItem('alm') || '5', 10);
let ALT = null;

let presenceCache = {};

try {
  presenceCache = JSON.parse(safeGetItem('presenceCache') || '{}');
} catch {
  presenceCache = {};
}

function savePresenceCache() {
  safeSetItem('presenceCache', JSON.stringify(presenceCache));
}

const b64 = (b) => btoa(String.fromCharCode(...new Uint8Array(b)));
const b64d = (s) => Uint8Array.from(atob(s), c => c.charCodeAt(0));

async function dk(pw, s, iterations = ITERS) {
  const e = new TextEncoder();
  const km = await crypto.subtle.importKey('raw', e.encode(pw), 'PBKDF2', false, ['deriveKey']);

  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: s, iterations, hash: 'SHA-256' },
    km,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

async function enc(d, k) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const e = new TextEncoder().encode(d);
  const c = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, k, e);

  return {
    iv: b64(iv),
    tag: b64(c.slice(c.byteLength - 16)),
    data: b64(c.slice(0, c.byteLength - 16))
  };
}

async function dec(b, k) {
  const iv = b64d(b.iv);
  const tag = b64d(b.tag);
  const data = b64d(b.data);

  const c = new Uint8Array(data.length + tag.length);

  c.set(data);
  c.set(tag, data.length);

  const d = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, k, c);

  return new TextDecoder().decode(d);
}

async function mk(pw) {
  const s = crypto.getRandomValues(new Uint8Array(16));
  const k = await dk(pw, s);

  return {
    file: {
      version: 1,
      kdf: { algo: 'pbkdf2-sha256', iters: ITERS, salt: b64(s) },
      verifier: await enc(VER, k),
      bots: []
    },
    key: k
  };
}

async function unl(f, pw) {
  const iters = Number((f && f.kdf && f.kdf.iters) || ITERS) || ITERS;
  const k = await dk(pw, b64d(f.kdf.salt), iters);

  if (await dec(f.verifier, k) !== VER) throw new Error('password errata');
  return k;
}

async function eb(n, token, k) {
  const b = await enc(token, k);

  return {
    id: Array.from(crypto.getRandomValues(new Uint8Array(8))).map(x => x.toString(16).padStart(2, '0')).join(''),
    name: n,
    createdAt: Date.now(),
    ...b
  };
}

async function db(r, k) {
  const { id, name, createdAt, ...b } = r;
  return dec(b, k);
}

function lkt(token) {
  return /^[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{4,}\.[A-Za-z0-9_-]{20,}$/.test(token.trim());
}

function sv() {
  safeSetItem('v', JSON.stringify(V));
}

function dv() {
  safeRemoveItem('v');
}

function lv() {
  try {
    const r = safeGetItem('v');
    return r ? JSON.parse(r) : null;
  } catch {
    return null;
  }
}

/* ===== i18n strict ===== */

let i18nStrings = {};
let currentLang = safeGetItem('lang') || 'en';

function t(key) {
  const val = i18nStrings?.[key];

  if (typeof val === 'string') return val;

  console.error('[i18n missing]', key);

  return `[missing:${key}]`;
}

function localeTag() {
  if (currentLang === 'zh') return 'zh-CN';
  return currentLang || 'en';
}

function fmtDate(ts) {
  return new Date(ts).toLocaleDateString(localeTag());
}

function fmtDateTime(ts) {
  return new Date(ts).toLocaleString(localeTag());
}

async function fetchJson(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.json();
}

function normalizeLocale(obj) {
  if (!obj || typeof obj !== 'object') return { meta: {}, strings: {} };

  if (obj.strings && typeof obj.strings === 'object') {
    return { meta: obj.meta || {}, strings: obj.strings };
  }

  const { meta, strings, ...rest } = obj;

  return { meta: meta || {}, strings: strings || rest };
}

function translateSelectOptions(select) {
  if (!select) return;

  for (const opt of select.options) {
    if (!opt.dataset.i18nKey) continue;

    const txt = t(opt.dataset.i18nKey);

    if (opt.textContent !== txt) {
      opt.textContent = txt;
    }
  }

  select.dispatchEvent(new Event('i18n:options'));
}

function translateStaticDom() {
  document.title = t('app.title');

  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.getAttribute('data-i18n-html'));
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
  });

  document.querySelectorAll('select').forEach(translateSelectOptions);

  updateUnlockTexts();

  window.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang: currentLang } }));
}

async function loadLanguageList() {
  const sel = document.getElementById('lang-select');
  if (!sel) return;

  let languages = [];

  try {
    const res = await fetchJson('/i18n/languages');

    if (res && Array.isArray(res.languages) && res.languages.length) {
      languages = res.languages;
    }
  } catch {}

  if (!languages.length) {
    languages = [{ code: 'en', name: 'english', native: 'english' }];
  }

  if (!languages.some(l => l.code === currentLang)) {
    currentLang = languages.some(l => l.code === 'en') ? 'en' : languages[0].code;
  }

  sel.innerHTML = '';

  languages.forEach(l => {
    const o = document.createElement('option');

    o.value = l.code;

    const label = l.native || l.name || l.code;

    o.textContent = l.flag ? `${l.flag} ${label}` : label;

    sel.appendChild(o);
  });

  sel.value = currentLang;

  sel.onchange = () => applyLanguage(sel.value);
}

async function applyLanguage(code, skipSave) {
  currentLang = code || 'en';

  if (!skipSave) safeSetItem('lang', currentLang);

  try {
    const raw = await fetchJson('/i18n/locales/' + encodeURIComponent(currentLang));
    const norm = normalizeLocale(raw);

    i18nStrings = norm.strings || {};
  } catch {
    i18nStrings = {};
  }

  document.documentElement.lang = currentLang;

  translateStaticDom();

  const sel = document.getElementById('lang-select');

  if (sel && sel.value !== currentLang) sel.value = currentLang;
}

async function initI18n() {
  try {
    await loadLanguageList();
    await applyLanguage(currentLang, true);
  } finally {
    document.documentElement.classList.remove('i18n-loading');
  }
}

/* ===== ui helpers ===== */

function tt(m) {
  const e = document.getElementById('tt');

  if (!e) return;

  e.textContent = m;
  e.className = 'toast';

  setTimeout(() => e.classList.add('hidden'), 2600);
}

function arm(m) {
  if (ALT) clearTimeout(ALT);

  if (m > 0) {
    ALT = setTimeout(() => {
      K = null;
      su();
    }, m * 60000);
  }
}

function clientIdFromToken(token) {
  const p = token.split('.')[0];
  return atob(p + '='.repeat((4 - p.length % 4) % 4));
}

function inviteUrl(token) {
  return 'https://discord.com/oauth2/authorize?client_id=' + clientIdFromToken(token) + '&scope=bot&permissions=' + INVITE_PERMS;
}

function friendlyError(msg, action) {
  const m = String(msg || '').toLowerCase();

  if (m.includes('missing permission') || m.includes('permissions')) {
    const map = {
      nick: 'error.perm_nick',
      timeout: 'error.perm_timeout',
      ban: 'error.perm_ban',
      kick: 'error.perm_kick',
      delete: 'error.perm_delete',
      send: 'error.perm_send',
      clone: 'error.perm_clone'
    };

    return t(map[action] || 'error.perm_generic');
  }

  if (m.includes('hierarchy')) return t('error.hierarchy');
  if (m.includes('owner')) return t('error.owner');
  if (m.includes('bulk-delete')) return t('error.bulk_delete');

  return msg;
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function readFileAsDataURL(fileOrBlob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();

    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error('file read failed'));

    r.readAsDataURL(fileOrBlob);
  });
}

function setPlaceholderOption(select, key, value = '') {
  if (!select) return;

  select.innerHTML = '';

  const o = document.createElement('option');

  if (value) o.value = value;

  o.dataset.i18nKey = key;
  o.textContent = t(key);

  select.appendChild(o);

  translateSelectOptions(select);
}

function updateUnlockTexts() {
  const hasVault = !!V;

  const ut = document.getElementById('ut');
  const ud = document.getElementById('ud');
  const cf = document.getElementById('cf');
  const sb = document.getElementById('sb');

  if (ut) ut.textContent = t(hasVault ? 'unlock.unlock_title' : 'unlock.create_title');
  if (ud) ud.textContent = t(hasVault ? 'unlock.unlock_desc' : 'unlock.create_desc');
  if (cf) cf.classList.toggle('hidden', hasVault);
  if (sb) sb.textContent = t(hasVault ? 'unlock.unlock' : 'unlock.create');
}

/* ===== modals ===== */

let giCallback = null;
let gcCallback = null;
let infoCopyText = null;

function showInputModal(title, desc, placeholder, cb) {
  document.getElementById('gi-title').textContent = title;
  document.getElementById('gi-desc').textContent = desc;
  document.getElementById('gi-input').placeholder = placeholder;
  document.getElementById('gi-input').value = '';

  giCallback = cb;

  document.getElementById('generic-input-modal').classList.remove('hidden');
}

function closeInputModal() {
  document.getElementById('generic-input-modal').classList.add('hidden');
  giCallback = null;
}

function showConfirmModal(title, desc, cb) {
  document.getElementById('gc-title').textContent = title;
  document.getElementById('gc-desc').textContent = desc;

  gcCallback = cb;

  document.getElementById('generic-confirm-modal').classList.remove('hidden');
}

function closeConfirmModal() {
  document.getElementById('generic-confirm-modal').classList.add('hidden');
  gcCallback = null;
}

function showInfoModal(title, desc, text) {
  document.getElementById('info-title').textContent = title;
  document.getElementById('info-desc').textContent = desc;
  document.getElementById('info-body').textContent = text;

  infoCopyText = text;

  document.getElementById('info-modal').classList.remove('hidden');
}

function closeInfoModal() {
  document.getElementById('info-modal').classList.add('hidden');
  infoCopyText = null;
}

document.getElementById('gi-close').onclick = closeInputModal;
document.getElementById('gi-cancel').onclick = closeInputModal;

document.getElementById('gi-ok').onclick = () => {
  if (giCallback) giCallback(document.getElementById('gi-input').value);
  closeInputModal();
};

document.getElementById('generic-input-modal').onclick = (e) => {
  if (e.target === e.currentTarget) closeInputModal();
};

document.getElementById('gc-close').onclick = closeConfirmModal;
document.getElementById('gc-cancel').onclick = closeConfirmModal;

document.getElementById('gc-ok').onclick = () => {
  if (gcCallback) gcCallback();
  closeConfirmModal();
};

document.getElementById('generic-confirm-modal').onclick = (e) => {
  if (e.target === e.currentTarget) closeConfirmModal();
};

document.getElementById('info-close').onclick = closeInfoModal;

document.getElementById('info-copy').onclick = () => {
  if (infoCopyText) {
    navigator.clipboard.writeText(infoCopyText);
    tt(t('common.copied'));
  }
};

document.getElementById('info-modal').onclick = (e) => {
  if (e.target === e.currentTarget) closeInfoModal();
};

/* ===== markdown / embed / preview ===== */

function inline(s) {
  let h = esc(s);

  h = h.replace(/&lt;@!?(\d+)&gt;/g, '<span class="pill">@$1</span>');
  h = h.replace(/&lt;@&amp;(\d+)&gt;/g, '<span class="pill">@role</span>');
  h = h.replace(/&lt;#(\d+)&gt;/g, '<span class="pill">#channel</span>');
  h = h.replace(/\*\*\*([\s\S]+?)\*\*\*/g, '<b><i>$1</i></b>');
  h = h.replace(/\*\*([\s\S]+?)\*\*/g, '<b>$1</b>');
  h = h.replace(/__([\s\S]+?)__/g, '<u>$1</u>');
  h = h.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<i>$2</i>');
  h = h.replace(/(^|[^_\w])_([^_\n]+)_(?!_)/g, '$1<i>$2</i>');
  h = h.replace(/~~([\s\S]+?)~~/g, '<s>$1</s>');
  h = h.replace(/\|\|([\s\S]+?)\|\|/g, '<span class="spoiler">$1</span>');
  h = h.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  h = h.replace(/(^|[^"=])(https?:\/\/[^\s<]+)/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>');

  return h;
}

function renderMD(src) {
  if (!src) return '';

  const store = [];

  src = src.replace(/```(\w*)\n?([\s\S]*?)```/g, (m, l, c) => {
    store.push('<pre><code>' + esc(c.replace(/\n$/, '')) + '</code></pre>');
    return '\u0001' + (store.length - 1) + '\u0001';
  });

  src = src.replace(/`([^`\n]+)`/g, (m, c) => {
    store.push('<code>' + esc(c) + '</code>');
    return '\u0001' + (store.length - 1) + '\u0001';
  });

  const lines = src.split('\n');

  let out = '';
  let buf = [];
  let quote = null;
  let m;

  const flush = () => {
    if (buf.length) {
      out += '<div>' + buf.map(inline).join('<br>') + '</div>';
      buf = [];
    }
  };

  const flushQ = () => {
    if (quote !== null) {
      out += '<div class="quote">' + quote.map(inline).join('<br>') + '</div>';
      quote = null;
    }
  };

  for (const ln of lines) {
    if (/^\u0001\d+\u0001\s*$/.test(ln)) {
      flush();
      flushQ();
      out += store[ln.trim().slice(1, -1)];
      continue;
    }

    if ((m = ln.match(/^(#{1,6})\s+(.*)/))) {
      flush();
      flushQ();
      out += '<div class="h' + m[1].length + '">' + inline(m[2]) + '</div>';
      continue;
    }

    if ((m = ln.match(/^>\s?(.*)/))) {
      flush();
      (quote = quote || []).push(m[1]);
      continue;
    }

    if ((m = ln.match(/^(\s*)[-*]\s+(.*)/))) {
      flush();
      flushQ();
      out += '<div class="li" style="padding-left:' + (Math.floor(m[1].length / 2) * 18) + 'px">• ' + inline(m[2]) + '</div>';
      continue;
    }

    if ((m = ln.match(/^(\s*)(\d+)\.\s+(.*)/))) {
      flush();
      flushQ();
      out += '<div class="li" style="padding-left:' + (Math.floor(m[1].length / 2) * 18) + 'px">' + m[2] + '. ' + inline(m[3]) + '</div>';
      continue;
    }

    if (ln.trim() === '') {
      flush();
      flushQ();
      continue;
    }

    flushQ();
    buf.push(ln);
  }

  flush();
  flushQ();

  out = out.replace(/\u0001(\d+)\u0001/g, (x, i) => store[i]);

  return out;
}

function buildEmbed() {
  const g = id => document.getElementById(id).value.trim();

  const em = {};

  if (g('e-title')) em.title = g('e-title');
  if (g('e-url')) em.url = g('e-url');
  if (g('e-desc')) em.description = g('e-desc');

  em.color = parseInt(g('e-color').slice(1), 16);

  if (g('e-aname')) {
    em.author = { name: g('e-aname') };
    if (g('e-aicon')) em.author.icon_url = g('e-aicon');
  }

  if (g('e-img')) em.image = { url: g('e-img') };
  if (g('e-thumb')) em.thumbnail = { url: g('e-thumb') };

  if (g('e-footer')) {
    em.footer = { text: g('e-footer') };
    if (g('e-ficon')) em.footer.icon_url = g('e-ficon');
  }

  if (document.getElementById('e-ts').value === 'now') em.timestamp = new Date().toISOString();

  const fields = [];

  document.querySelectorAll('#e-fields .efield').forEach(f => {
    const n = f.querySelector('.ef-n').value.trim();
    const v = f.querySelector('.ef-v').value.trim();

    if (n && v) {
      fields.push({
        name: n,
        value: v,
        inline: f.querySelector('.ef-i').checked
      });
    }
  });

  if (fields.length) em.fields = fields;

  return (em.title || em.description || em.image || em.thumbnail || em.footer || em.author || em.fields) ? em : null;
}

function embedHtml(em) {
  const col = '#' + (em.color || 0).toString(16).padStart(6, '0');

  let h = '<div class="embed" style="border-left-color:' + col + '">';

  if (em.author) {
    h += '<div class="embed-author">' + (em.author.icon_url ? '<img class="embed-author-icon" src="' + esc(em.author.icon_url) + '" onerror="this.remove()">' : '') + esc(em.author.name) + '</div>';
  }

  if (em.title) {
    h += em.url
      ? '<a class="embed-title" href="' + esc(em.url) + '" target="_blank">' + esc(em.title) + '</a>'
      : '<div class="embed-title">' + esc(em.title) + '</div>';
  }

  if (em.description) h += '<div class="embed-desc">' + renderMD(em.description) + '</div>';

  if (em.fields) {
    h += '<div class="embed-fields">' + em.fields.map(f => '<div class="embed-field" style="flex:' + (f.inline ? '1' : '0 0 100%') + '"><div class="embed-fn">' + esc(f.name) + '</div><div class="embed-fv">' + renderMD(f.value) + '</div></div>').join('') + '</div>';
  }

  if (em.image) h += '<img class="embed-img" src="' + esc(em.image.url) + '" onerror="this.remove()">';
  if (em.thumbnail) h += '<img class="embed-thumb" src="' + esc(em.thumbnail.url) + '" onerror="this.remove()">';

  if (em.footer || em.timestamp) {
    h += '<div class="embed-footer">' + (em.footer ? esc(em.footer.text) : '') + (em.footer && em.timestamp ? ' · ' : '') + (em.timestamp ? fmtDateTime(em.timestamp) : '') + '</div>';
  }

  return h + '</div>';
}

const ta = document.getElementById('msg-content');

function updatePreview() {
  let h = renderMD(ta.value);

  if (document.getElementById('embed-on').checked && !document.getElementById('voice-message-on').checked) {
    const em = buildEmbed();
    if (em) h += embedHtml(em);
  }

  document.getElementById('preview').innerHTML = h || '<span class="muted">' + esc(t('send.preview_empty')) + '</span>';
}

ta.addEventListener('input', updatePreview);
document.getElementById('embed-form').addEventListener('input', updatePreview);

document.getElementById('embed-on').addEventListener('change', (e) => {
  document.getElementById('embed-form').classList.toggle('hidden', !e.target.checked);
  updatePreview();
});

function addFieldRow() {
  const d = document.createElement('div');

  d.className = 'efield';

  d.innerHTML = `
    <input class="ef-n" maxlength="256" style="margin-bottom:6px" data-i18n-placeholder="send.embed_field_name" placeholder="${esc(t('send.embed_field_name'))}">
    <textarea class="ef-v" maxlength="1024" style="min-height:56px;margin-bottom:6px" data-i18n-placeholder="send.embed_field_value" placeholder="${esc(t('send.embed_field_value'))}"></textarea>
    <div class="btn-row">
      <label style="display:flex;align-items:center;gap:6px;flex:1">
        <input type="checkbox" class="ef-i">
        <span data-i18n="send.embed_field_inline"></span>
      </label>
      <button class="btn btn-danger btn-small ef-x"><i data-icon="x"></i></button>
    </div>
  `;

  injectIcons(d);

  d.querySelector('.ef-x').onclick = () => {
    d.remove();
    updatePreview();
  };

  document.getElementById('e-fields').appendChild(d);

  translateStaticDom();
  updatePreview();
}

document.getElementById('e-addfield').onclick = addFieldRow;

const MARK = '*_~`';

function setVal(v, s, e) {
  ta.value = v;
  ta.setSelectionRange(s, e);
  updatePreview();
}

ta.addEventListener('beforeinput', (e) => {
  if (ta.disabled) return;

  const s = ta.selectionStart;
  const en = ta.selectionEnd;
  const v = ta.value;

  if (e.inputType === 'deleteContentBackward' && s === en && s > 0 && v[s] === v[s - 1] && MARK.includes(v[s])) {
    e.preventDefault();
    setVal(v.slice(0, s - 1) + v.slice(s + 1), s - 1, s - 1);
    return;
  }

  if (e.inputType !== 'insertText' || !e.data || e.data.length !== 1) return;

  const ch = e.data;

  if (!MARK.includes(ch)) return;

  if (s !== en) {
    e.preventDefault();
    setVal(v.slice(0, s) + ch + v.slice(s, en) + ch + v.slice(en), s + 1, en + 1);
    return;
  }

  const prev = v[s - 1] || '';
  const next = v[s] || '';

  if (next === ch && prev !== ch) {
    e.preventDefault();
    ta.setSelectionRange(s + 1, s + 1);
    return;
  }

  if (prev === ch && next === ch) {
    e.preventDefault();
    ta.setSelectionRange(s + 1, s + 1);
    return;
  }

  if ((prev === '' || /\s/.test(prev)) && (next === '' || /\s/.test(next))) {
    e.preventDefault();
    setVal(v.slice(0, s) + ch + ch + v.slice(s), s + 1, s + 1);
  }
});

const fileInput = document.getElementById('file-upload');
const filePreview = document.getElementById('file-preview');
const filePreviewImg = document.getElementById('file-preview-img');

fileInput.addEventListener('change', () => {
  const f = fileInput.files[0];

  if (f && f.type.startsWith('image/')) {
    filePreviewImg.src = URL.createObjectURL(f);
    filePreview.style.display = 'block';
  } else {
    filePreview.style.display = 'none';
  }
});

/* ===== voice message ===== */

let voiceMessageMode = 'upload';
let voiceRecordedBlob = null;
let voiceRecordedDuration = 0;
let voiceMediaRecorder = null;
let voiceRecordStream = null;
let voiceRecordStart = 0;
let voiceRecordTimer = null;

const voiceMessageOn = document.getElementById('voice-message-on');
const voiceMessageForm = document.getElementById('voice-message-form');
const voiceFileInput = document.getElementById('voice-file');
const voiceFilePreview = document.getElementById('voice-file-preview');
const voiceRecordBtn = document.getElementById('voice-record-btn');
const voiceRecordStop = document.getElementById('voice-record-stop');
const voiceRecordStatus = document.getElementById('voice-record-status');
const voiceRecordPreview = document.getElementById('voice-record-preview');
const voiceFilenameInput = document.getElementById('voice-filename');

function syncVoiceMessageState() {
  const on = !!(voiceMessageOn && voiceMessageOn.checked);

  if (voiceMessageForm) voiceMessageForm.classList.toggle('hidden', !on);

  if (ta) ta.disabled = on;

  const embedOn = document.getElementById('embed-on');

  if (embedOn) {
    if (on) {
      embedOn.checked = false;
      embedOn.disabled = true;
      document.getElementById('embed-form')?.classList.add('hidden');
    } else {
      embedOn.disabled = false;
    }
  }

  if (fileInput) fileInput.disabled = on;

  updatePreview();
}

if (voiceMessageOn) {
  voiceMessageOn.addEventListener('change', syncVoiceMessageState);
}

function setVoiceMessageMode(mode) {
  voiceMessageMode = mode;

  const uploadBtn = document.getElementById('voice-mode-upload');
  const recordBtn = document.getElementById('voice-mode-record');
  const uploadForm = document.getElementById('voice-upload-form');
  const recordForm = document.getElementById('voice-record-form');

  if (uploadBtn) uploadBtn.classList.toggle('active', mode === 'upload');
  if (recordBtn) recordBtn.classList.toggle('active', mode === 'record');
  if (uploadForm) uploadForm.classList.toggle('hidden', mode !== 'upload');
  if (recordForm) recordForm.classList.toggle('hidden', mode !== 'record');
}

if (document.getElementById('voice-mode-upload')) {
  document.getElementById('voice-mode-upload').onclick = () => setVoiceMessageMode('upload');
}

if (document.getElementById('voice-mode-record')) {
  document.getElementById('voice-mode-record').onclick = () => setVoiceMessageMode('record');
}

if (voiceFileInput && voiceFilePreview) {
  voiceFileInput.addEventListener('change', () => {
    const f = voiceFileInput.files[0];

    if (!f) {
      voiceFilePreview.classList.add('hidden');
      voiceFilePreview.removeAttribute('src');
      return;
    }

    voiceFilePreview.src = URL.createObjectURL(f);
    voiceFilePreview.classList.remove('hidden');

    if (voiceFilenameInput && !voiceFilenameInput.value.trim()) {
      voiceFilenameInput.value = f.name || 'voice-message.ogg';
    }
  });
}

function bytesToB64(bytes) {
  let bin = '';

  for (const b of bytes) bin += String.fromCharCode(b);

  return btoa(bin);
}

function silentWaveform() {
  return bytesToB64(new Uint8Array(256).fill(0));
}

function constantWaveform() {
  return bytesToB64(new Uint8Array(256).fill(18));
}

function getAudioDuration(blob) {
  return new Promise(resolve => {
    const url = URL.createObjectURL(blob);
    const a = new Audio();

    a.preload = 'metadata';

    a.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(Number(a.duration) || 0);
    };

    a.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(0);
    };

    a.src = url;
  });
}

async function blobToWaveform(blob) {
  try {
    const arr = await blob.arrayBuffer();
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const audio = await ctx.decodeAudioData(arr);
    const data = audio.getChannelData(0);

    const peaks = new Uint8Array(256);
    const block = Math.max(1, Math.floor(data.length / 256));

    for (let i = 0; i < 256; i++) {
      let max = 0;

      const start = i * block;
      const end = Math.min(start + block, data.length);
      const step = Math.max(1, Math.floor(block / 50));

      for (let j = start; j < end; j += step) {
        const v = Math.abs(data[j] || 0);
        if (v > max) max = v;
      }

      peaks[i] = Math.min(31, Math.round(max * 31));
    }

    await ctx.close();

    return bytesToB64(peaks);
  } catch {
    return constantWaveform();
  }
}

async function prepareVoiceFile() {
  if (!voiceMessageOn || !voiceMessageOn.checked) return null;

  let blob = null;
  let filename = voiceFilenameInput?.value.trim() || 'voice-message.ogg';

  if (voiceMessageMode === 'record') {
    if (!voiceRecordedBlob) {
      throw new Error(t('send.voice_need_recording'));
    }

    blob = voiceRecordedBlob;
  } else {
    const f = voiceFileInput?.files?.[0];

    if (!f) {
      throw new Error(t('send.voice_need_file'));
    }

    blob = f;
  }

  const type = blob.type || 'audio/ogg';
  const file = new File([blob], filename, { type });

  const isOgg = /\.ogg$/i.test(file.name)
    || /\.opus$/i.test(file.name)
    || String(file.type).toLowerCase().includes('ogg');

  if (!isOgg) {
    throw new Error(t('send.voice_need_ogg'));
  }

  const duration = await getAudioDuration(file);

  const waveformMode = document.getElementById('voice-waveform-mode')?.value || 'constant';

  let waveform;

  if (waveformMode === 'auto') {
    waveform = await blobToWaveform(file);
  } else if (waveformMode === 'none') {
    waveform = silentWaveform();
  } else {
    waveform = constantWaveform();
  }

  return { file, duration, waveform };
}

function updateVoiceRecordUi(recording) {
  if (!voiceRecordBtn || !voiceRecordStop || !voiceRecordStatus) return;

  voiceRecordBtn.classList.toggle('hidden', recording);
  voiceRecordStop.classList.toggle('hidden', !recording);

  if (!recording) {
    clearInterval(voiceRecordTimer);
    voiceRecordTimer = null;
  }
}

async function startVoiceRecording() {
  try {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      throw new Error(t('send.voice_record_unsupported'));
    }

    const mime = [
      'audio/ogg; codecs=opus',
      'audio/ogg',
      'audio/webm; codecs=opus'
    ].find(x => MediaRecorder.isTypeSupported(x));

    if (!mime) {
      throw new Error(t('send.voice_record_unsupported'));
    }

    voiceRecordStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    voiceMediaRecorder = new MediaRecorder(voiceRecordStream, { mimeType: mime });

    const chunks = [];

    voiceMediaRecorder.ondataavailable = e => {
      if (e.data && e.data.size) chunks.push(e.data);
    };

    voiceMediaRecorder.onstop = () => {
      voiceRecordedBlob = new Blob(chunks, { type: mime });
      voiceRecordedDuration = (Date.now() - voiceRecordStart) / 1000;

      if (voiceRecordPreview) {
        voiceRecordPreview.src = URL.createObjectURL(voiceRecordedBlob);
        voiceRecordPreview.classList.remove('hidden');
      }

      if (voiceRecordStream) {
        voiceRecordStream.getTracks().forEach(track => track.stop());
        voiceRecordStream = null;
      }

      if (voiceRecordStatus) {
        voiceRecordStatus.textContent = t('send.voice_ready');
      }

      updateVoiceRecordUi(false);
    };

    voiceMediaRecorder.start();

    voiceRecordStart = Date.now();

    voiceRecordTimer = setInterval(() => {
      if (voiceRecordStatus) {
        const secs = Math.round((Date.now() - voiceRecordStart) / 1000);
        voiceRecordStatus.textContent = `${t('send.voice_recording')} ${secs}s`;
      }
    }, 500);

    updateVoiceRecordUi(true);
  } catch (e) {
    tt(e.message);
    updateVoiceRecordUi(false);
  }
}

function stopVoiceRecording() {
  if (voiceMediaRecorder && voiceMediaRecorder.state !== 'inactive') {
    voiceMediaRecorder.stop();
  }

  clearInterval(voiceRecordTimer);

  updateVoiceRecordUi(false);
}

if (voiceRecordBtn) voiceRecordBtn.onclick = startVoiceRecording;
if (voiceRecordStop) voiceRecordStop.onclick = stopVoiceRecording;

/* ===== navigation ===== */

function su() {
  document.getElementById('unlock').classList.remove('hidden');
  document.getElementById('main-content').classList.add('hidden');
  document.getElementById('sidebar').classList.add('hidden');
  document.querySelector('.app').classList.add('locked');
}

function sm() {
  document.getElementById('unlock').classList.add('hidden');
  document.getElementById('main-content').classList.remove('hidden');
  document.getElementById('sidebar').classList.remove('hidden');
  document.querySelector('.app').classList.remove('locked');

  rb();
  populateAllBotSelects();
  refreshSessions();
}

const TAB_MAP = {
  vault: 'vs',
  send: 'snd',
  logs: 'logs',
  presence: 'presence',
  voice: 'voice',
  cleaner: 'cleaner',
  settings: 'ss'
};

function switchTab(tab) {
  const targetId = TAB_MAP[tab];

  Object.values(TAB_MAP).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden', id !== targetId);
  });

  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tab);
  });

  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('backdrop').classList.remove('show');

  if (tab === 'presence') refreshSessions();
  if (tab === 'voice') updateVoiceStatus();
}

document.querySelectorAll('.nav-btn').forEach(b => {
  if (b.id !== 'lk-side') b.onclick = () => switchTab(b.dataset.tab);
});

document.getElementById('menu-toggle').onclick = () => {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('backdrop').classList.toggle('show');
};

document.getElementById('backdrop').onclick = () => {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('backdrop').classList.remove('show');
};

/* ===== api ===== */

let selBot = null;
let selToken = null;
let curMode = 'auto';

async function api(path, opts = {}, overrideToken = null) {
  const tok = overrideToken || selToken;

  const r = await fetch(API + path, {
    method: opts.method || 'GET',
    headers: { 'X-Bot-Token': tok, 'Content-Type': 'application/json' },
    body: opts.body,
  });

  if (!r.ok) {
    let msg = 'HTTP ' + r.status;

    try {
      const j = await r.json();
      if (j.message) msg = j.message;
    } catch {}

    throw new Error(msg);
  }

  return r.status === 204 ? null : r.json();
}

async function apiUpload(path, fd, token) {
  const r = await fetch(API + path, {
    method: 'POST',
    headers: { 'X-Bot-Token': token },
    body: fd
  });

  if (!r.ok) {
    let msg = 'HTTP ' + r.status;

    try {
      const j = await r.json();
      if (j.message) msg = j.message;
    } catch {}

    throw new Error(msg);
  }

  return r.json();
}

async function gateway(path, body = {}) {
  const r = await fetch(GATEWAY + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!r.ok) {
    let msg = 'HTTP ' + r.status;

    try {
      const j = await r.json();
      if (j.error) msg = j.error;
    } catch {}

    throw new Error(msg);
  }

  return r.json();
}

async function gatewayGet(path) {
  const r = await fetch(GATEWAY + path);

  if (!r.ok) throw new Error('HTTP ' + r.status);

  return r.json();
}

/* ===== vault ===== */

function rb() {
  const c = document.getElementById('bl');

  if (!c) return;

  if (!V || V.bots.length === 0) {
    c.innerHTML = '<div class="muted center" style="padding:40px 20px">' + esc(t('vault.none')) + '</div>';
    populateAllBotSelects();
    return;
  }

  c.innerHTML = V.bots.map((b, i) => `
    <div class="card" data-i="${i}">
      <div class="bot-item">
        <div class="dot dot-idle"></div>
        <div class="bot-info">
          <div class="bot-name">${esc(b.name)}</div>
          <div class="bot-meta">${esc(t('vault.added'))} ${esc(fmtDate(b.createdAt))}</div>
        </div>
      </div>

      <div class="btn-row" style="margin-top:12px">
        <button class="btn btn-ghost tb">${esc(t('vault.test'))}</button>
        <button class="btn btn-ghost ib">${esc(t('vault.invite'))}</button>
        <button class="btn btn-danger xb">${esc(t('vault.delete'))}</button>
      </div>
    </div>
  `).join('');

  c.querySelectorAll('.tb').forEach((btn, i) => btn.onclick = async () => {
    const t2 = await db(V.bots[i], K);

    btn.disabled = true;
    btn.textContent = t('vault.testing');

    try {
      const m = await api('/users/@me', {}, t2);

      btn.closest('.card').querySelector('.dot').className = 'dot dot-ok';

      tt(t('vault.connected_as') + (m.global_name || m.username));
    } catch (e) {
      btn.closest('.card').querySelector('.dot').className = 'dot dot-ko';
      tt(e.message);
    } finally {
      btn.disabled = false;
      btn.textContent = t('vault.test');
    }
  });

  c.querySelectorAll('.ib').forEach((btn, i) => btn.onclick = async () => {
    try {
      const t2 = await db(V.bots[i], K);

      showInfoModal(
        t('vault.invite_title'),
        t('vault.invite_desc'),
        inviteUrl(t2)
      );
    } catch (e) {
      tt(e.message);
    }
  });

  c.querySelectorAll('.xb').forEach((btn, i) => btn.onclick = () => {
    const n = V.bots[i].name;

    showConfirmModal(
      t('vault.remove_title'),
      t('vault.remove_desc').replace('{name}', n),
      () => {
        V.bots.splice(i, 1);
        sv();
        rb();
        tt(t('vault.removed'));
      }
    );
  });

  populateAllBotSelects();
}

/* ===== send tab ===== */

const botSel = document.getElementById('bot-select');
const gs = document.getElementById('guild-select');

function populateBotSelect() {
  if (!botSel) return;

  const cur = botSel.value;

  botSel.innerHTML = '';

  setPlaceholderOption(botSel, 'select.bot');

  if (V) {
    V.bots.forEach(b => {
      const o = document.createElement('option');
      o.value = b.id;
      o.textContent = b.name;
      botSel.appendChild(o);
    });
  }

  if (cur) botSel.value = cur;

  translateSelectOptions(botSel);
}

function resetTargets() {
  gs.disabled = true;
  setPlaceholderOption(gs, 'select.bot_first');

  const cs = document.getElementById('chan-select');

  cs.disabled = true;
  setPlaceholderOption(cs, 'select.server');
}

async function loadGuilds() {
  gs.disabled = false;

  setPlaceholderOption(gs, 'select.loading');

  try {
    const g = await api('/users/@me/guilds');

    gs.innerHTML = '';

    setPlaceholderOption(gs, 'select.choose_server');

    g.forEach(x => {
      const o = document.createElement('option');
      o.value = x.id;
      o.textContent = x.name;
      gs.appendChild(o);
    });

    if (!g.length) tt(t('send.no_servers'));

    const cs = document.getElementById('chan-select');

    cs.disabled = true;

    setPlaceholderOption(cs, 'select.server');
  } catch (e) {
    setPlaceholderOption(gs, 'select.error');
    tt(e.message);
  }
}

botSel.onchange = async () => {
  const id = botSel.value;

  selBot = V.bots.find(b => b.id === id) || null;
  selToken = selBot ? await db(selBot, K) : null;

  resetTargets();

  if (selToken && curMode === 'auto') loadGuilds();
};

gs.onchange = async () => {
  const gid = gs.value;
  const cs = document.getElementById('chan-select');

  if (!gid) {
    cs.disabled = true;
    setPlaceholderOption(cs, 'select.server');
    return;
  }

  cs.disabled = false;

  setPlaceholderOption(cs, 'select.loading');

  try {
    const ch = await api('/guilds/' + gid + '/channels');
    const tx = ch.filter(c => c.type === 0);

    cs.innerHTML = '';

    setPlaceholderOption(cs, 'select.choose_channel');

    tx.forEach(c => {
      const o = document.createElement('option');
      o.value = c.id;
      o.textContent = '#' + c.name;
      cs.appendChild(o);
    });

    translateSelectOptions(cs);
  } catch (e) {
    setPlaceholderOption(cs, 'select.error');
    tt(e.message);
  }
};

function setMode(m) {
  curMode = m;

  document.getElementById('mode-auto').classList.toggle('active', m === 'auto');
  document.getElementById('mode-manual').classList.toggle('active', m === 'manual');
  document.getElementById('auto-target').classList.toggle('hidden', m !== 'auto');
  document.getElementById('manual-target').classList.toggle('hidden', m !== 'manual');

  if (m === 'auto' && selToken) loadGuilds();
}

document.getElementById('mode-auto').onclick = () => setMode('auto');
document.getElementById('mode-manual').onclick = () => setMode('manual');

function getChannelId() {
  if (curMode === 'manual') return document.getElementById('manual-chan').value.trim();
  return document.getElementById('chan-select').value;
}

document.getElementById('preview').addEventListener('click', (e) => {
  if (e.target.classList.contains('spoiler')) e.target.classList.toggle('revealed');
});

document.getElementById('send-btn').onclick = async () => {
  const err = document.getElementById('send-error');

  err.classList.add('hidden');

  const chan = getChannelId();
  const isVoice = !!(voiceMessageOn && voiceMessageOn.checked);

  const payload = {};

  let fileToSend = fileInput.files[0] || null;

  try {
    if (isVoice) {
      const prepared = await prepareVoiceFile();

      if (!prepared) throw new Error(t('send.voice_need_file'));

      fileToSend = prepared.file;

      payload.flags = 8192;

      payload.attachments = [{
        id: 0,
        filename: prepared.file.name,
        duration_secs: Number(prepared.duration.toFixed(3)) || 1,
        waveform: prepared.waveform
      }];
    } else {
      const content = ta.value;

      if (content.trim()) payload.content = content;

      if (document.getElementById('embed-on').checked) {
        const em = buildEmbed();
        if (em) payload.embeds = [em];
      }
    }
  } catch (e) {
    err.textContent = e.message;
    err.classList.remove('hidden');
    return;
  }

  if (!selToken) {
    err.textContent = t('send.error_no_bot');
    err.classList.remove('hidden');
    return;
  }

  if (!isVoice && !payload.content && !payload.embeds && !fileToSend) {
    err.textContent = t('send.error_empty');
    err.classList.remove('hidden');
    return;
  }

  if (!chan) {
    err.textContent = t('send.error_no_channel');
    err.classList.remove('hidden');
    return;
  }

  const b = document.getElementById('send-btn');

  b.disabled = true;
  b.textContent = t('send.sending');

  try {
    if (fileToSend) {
      const fd = new FormData();

      fd.append('payload_json', JSON.stringify(payload));
      fd.append('files[0]', fileToSend);

      await apiUpload('/channels/' + chan + '/messages', fd, selToken);

      fileInput.value = '';
      filePreview.style.display = 'none';

      if (voiceFileInput) voiceFileInput.value = '';

      if (voiceFilePreview) {
        voiceFilePreview.classList.add('hidden');
        voiceFilePreview.removeAttribute('src');
      }

      voiceRecordedBlob = null;

      if (voiceRecordPreview) {
        voiceRecordPreview.classList.add('hidden');
        voiceRecordPreview.removeAttribute('src');
      }
    } else {
      await api('/channels/' + chan + '/messages', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    }

    tt(t('send.sent'));

    ta.value = '';

    updatePreview();
  } catch (e) {
    err.textContent = friendlyError(e.message, 'send');
    err.classList.remove('hidden');
  } finally {
    b.disabled = false;
    b.textContent = t('send.send');
  }
};

/* ===== logs ===== */

let logBot = null;
let logToken = null;
let logGuild = null;
let logChannel = null;

const logBotSel = document.getElementById('log-bot-select');
const logGs = document.getElementById('log-guild-select');
const logCs = document.getElementById('log-chan-select');

function populateLogBotSelect() {
  if (!logBotSel) return;

  const cur = logBotSel.value;

  logBotSel.innerHTML = '';

  setPlaceholderOption(logBotSel, 'select.bot');

  if (V) {
    V.bots.forEach(b => {
      const o = document.createElement('option');
      o.value = b.id;
      o.textContent = b.name;
      logBotSel.appendChild(o);
    });
  }

  if (cur) logBotSel.value = cur;

  translateSelectOptions(logBotSel);
}

logBotSel.onchange = async () => {
  const id = logBotSel.value;

  logBot = V.bots.find(b => b.id === id) || null;
  logToken = logBot ? await db(logBot, K) : null;

  logGs.disabled = true;
  setPlaceholderOption(logGs, 'select.bot_first');

  logCs.disabled = true;
  setPlaceholderOption(logCs, 'select.server');

  document.getElementById('fetch-logs-btn').disabled = true;
  document.getElementById('fetch-archive-btn').disabled = true;

  if (logToken) loadLogGuilds();
};

async function loadLogGuilds() {
  logGs.disabled = false;

  setPlaceholderOption(logGs, 'select.loading');

  try {
    const old = selToken;

    selToken = logToken;

    const g = await api('/users/@me/guilds');

    selToken = old;

    logGs.innerHTML = '';

    setPlaceholderOption(logGs, 'select.choose_server');

    g.forEach(x => {
      const o = document.createElement('option');
      o.value = x.id;
      o.textContent = x.name;
      logGs.appendChild(o);
    });

    translateSelectOptions(logGs);
  } catch (e) {
    setPlaceholderOption(logGs, 'select.error');
    tt(e.message);
  }
}

logGs.onchange = async () => {
  logGuild = logGs.value;

  if (!logGuild) {
    logCs.disabled = true;
    setPlaceholderOption(logCs, 'select.server');
    return;
  }

  logCs.disabled = false;

  setPlaceholderOption(logCs, 'select.loading');

  try {
    const old = selToken;

    selToken = logToken;

    const ch = await api('/guilds/' + logGuild + '/channels');

    selToken = old;

    const tx = ch.filter(c => c.type === 0 || c.type === 5 || c.type === 15);

    logCs.innerHTML = '';

    setPlaceholderOption(logCs, 'select.choose_channel');

    tx.forEach(c => {
      const o = document.createElement('option');
      o.value = c.id;
      o.textContent = '#' + c.name;
      logCs.appendChild(o);
    });

    translateSelectOptions(logCs);
  } catch (e) {
    setPlaceholderOption(logCs, 'select.error');
    tt(e.message);
  }
};

logCs.onchange = () => {
  logChannel = logCs.value;

  document.getElementById('fetch-logs-btn').disabled = !logChannel;
  document.getElementById('fetch-archive-btn').disabled = !logChannel;
};

document.getElementById('fetch-logs-btn').onclick = async () => {
  const err = document.getElementById('log-error');

  err.classList.add('hidden');

  const btn = document.getElementById('fetch-logs-btn');

  btn.disabled = true;
  btn.textContent = t('common.loading');

  try {
    const old = selToken;

    selToken = logToken;

    const msgs = await api('/channels/' + logChannel + '/messages?limit=50');

    selToken = old;

    renderLogs(msgs.reverse().map(m => ({ ...m, _deleted: false })));
  } catch (e) {
    err.textContent = e.message;
    err.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.textContent = t('logs.load_rest');
  }
};

document.getElementById('fetch-archive-btn').onclick = async () => {
  const err = document.getElementById('log-error');

  err.classList.add('hidden');

  const btn = document.getElementById('fetch-archive-btn');

  btn.disabled = true;
  btn.textContent = t('common.loading');

  try {
    const res = await gatewayGet('/archive/' + logChannel);

    renderLogs((res.messages || []).slice(-100));
  } catch (e) {
    err.textContent = e.message;
    err.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.textContent = t('logs.load_archive');
  }
};

function renderLogs(msgs) {
  const feed = document.getElementById('log-feed');

  if (!feed) return;

  if (!msgs.length) {
    feed.innerHTML = '<div class="muted center" style="padding:40px 20px">' + esc(t('logs.no_messages')) + '</div>';
    return;
  }

  feed.innerHTML = msgs.map(m => {
    const author = m.author || { id: 'unknown', username: t('common.unknown'), avatar: null };

    const avatar = author.avatar
      ? `https://cdn.discordapp.com/avatars/${author.id}/${author.avatar}.png?size=64`
      : `https://cdn.discordapp.com/embed/avatars/${(BigInt(author.id || '0') >> 22n) % 6n}.png`;

    const time = fmtDateTime(m.timestamp || Date.now());

    let content = m.content ? renderMD(m.content) : '';

    if (m.attachments && m.attachments.length) {
      content += '<div class="attachments">' + m.attachments.map(a => {
        if (a.content_type && a.content_type.startsWith('image/')) return `<img src="${a.url}" class="embed-img">`;
        if (a.content_type && a.content_type.startsWith('video/')) return `<video src="${a.url}" controls class="embed-img"></video>`;
        if (a.content_type && a.content_type.startsWith('audio/')) return `<audio src="${a.url}" controls></audio>`;
        return `<a href="${a.url}" target="_blank" class="embed-title">${esc(a.filename)}</a>`;
      }).join('') + '</div>';
    }

    if (m.embeds && m.embeds.length) content += m.embeds.map(embedHtml).join('');

    let replyHtml = '';

    if (m.referenced_message) {
      const ref = m.referenced_message;

      replyHtml = `<div class="reply-ref"><span class="pill">@${esc((ref.author || { username: '?' }).username)}</span> ${esc((ref.content || '').slice(0, 100))}</div>`;
    }

    const deletedClass = m._deleted ? ' msg-deleted' : '';

    const deletedBadge = m._deleted
      ? '<span class="pill" style="background:var(--danger-subtle);color:var(--danger);margin-left:6px">' + esc(t('logs.deleted')) + '</span>'
      : '';

    return `<div class="msg-item${deletedClass}">
      <img src="${avatar}" class="msg-avatar" data-uid="${author.id}" data-uname="${esc(author.username)}" data-guild="${logGuild}">
      <div class="msg-body">
        <div class="msg-header">
          ${(() => {
            const serverNick = (m.member && m.member.nick) ? m.member.nick : null;
            const displayName = serverNick || author.global_name || author.username;

            return `<span class="msg-author" data-uid="${author.id}" data-uname="${esc(author.username)}" data-guild="${logGuild}">${esc(displayName)}</span>`;
          })()}
          <span class="msg-time">${esc(time)}</span>${deletedBadge}
          ${m.edited_timestamp ? '<span class="msg-edited">' + esc(t('logs.edited')) + '</span>' : ''}
          ${!m._deleted ? `<button class="msg-delete" data-msgid="${m.id}" data-chanid="${logChannel}"><i data-icon="trashSmall"></i></button>` : ''}
        </div>
        ${replyHtml}
        <div class="msg-content">${content || (m._deleted ? '<span class="muted">' + esc(t('logs.content_unavailable')) + '</span>' : '')}</div>
      </div>
    </div>`;
  }).join('');

  injectIcons(feed);

  feed.querySelectorAll('.msg-author, .msg-avatar').forEach(el => {
    el.onclick = () => openUserModal(el.dataset.uid, el.dataset.uname, el.dataset.guild);
  });

  feed.querySelectorAll('.msg-delete').forEach(el => {
    el.onclick = () => deleteMessage(el.dataset.chanid, el.dataset.msgid);
  });
}

function deleteMessage(chanId, msgId) {
  showConfirmModal(
    t('logs.delete_title'),
    t('logs.delete_desc'),
    async () => {
      const old = selToken;

      selToken = logToken;

      try {
        await api(`/channels/${chanId}/messages/${msgId}`, { method: 'DELETE' });

        tt(t('logs.deleted_message'));

        document.getElementById('fetch-logs-btn').click();
      } catch (e) {
        tt(friendlyError(e.message, 'delete'));
      } finally {
        selToken = old;
      }
    }
  );
}

function snowflakeToDate(id) {
  try {
    const ts = (BigInt(id) >> 22n) + 1420070400000n;
    return new Date(Number(ts));
  } catch {
    return null;
  }
}

const rolesCache = {};

async function fetchGuildRoles(gid, token) {
  const now = Date.now();

  if (rolesCache[gid] && now - rolesCache[gid].fetchedAt < 60000) {
    return rolesCache[gid].roles;
  }

  const old = selToken;

  selToken = token;

  try {
    const roles = await api('/guilds/' + gid + '/roles');

    rolesCache[gid] = { roles, fetchedAt: now };

    return roles;
  } finally {
    selToken = old;
  }
}

async function fetchMember(gid, uid, token) {
  const old = selToken;

  selToken = token;

  try {
    return await api('/guilds/' + gid + '/members/' + uid);
  } finally {
    selToken = old;
  }
}

async function fetchUser(uid, token) {
  const old = selToken;

  selToken = token;

  try {
    return await api('/users/' + uid);
  } finally {
    selToken = old;
  }
}

function renderProfileDetails(container, uid, user, member, roles, gid) {
  const displayName = user?.global_name || user?.username || t('common.unknown');
  const username = user?.username || t('common.unknown');
  const nick = member?.nick || null;

  const createdAt = snowflakeToDate(uid);
  const joinedAt = member?.joined_at ? new Date(member.joined_at) : null;

  let rolesHtml = '<span class="muted small">' + esc(t('profile.no_roles')) + '</span>';

  if (member && member.roles && member.roles.length) {
    const memberRoles = roles.filter(r => member.roles.includes(r.id) && r.id !== gid);

    if (memberRoles.length) {
      rolesHtml = memberRoles.map(r => {
        const color = r.color ? '#' + r.color.toString(16).padStart(6, '0') : 'var(--muted)';

        return `<span class="role-badge" style="border-color:${color};color:${color}">${esc(r.name)}</span>`;
      }).join('');
    }
  }

  const avatarUrl = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${uid}/${user.avatar}.png?size=128`
    : `https://cdn.discordapp.com/embed/avatars/${(BigInt(uid) >> 22n) % 6n}.png`;

  let bannerHtml = '';

  if (user?.banner) {
    const bannerUrl = `https://cdn.discordapp.com/banners/${uid}/${user.banner}.png?size=512`;
    bannerHtml = `<div class="profile-banner" style="background-image:url(${bannerUrl})"></div>`;
  } else if (user?.accent_color != null) {
    const color = '#' + user.accent_color.toString(16).padStart(6, '0');
    bannerHtml = `<div class="profile-banner" style="background:${color}"></div>`;
  }

  container.innerHTML = `
    ${bannerHtml}
    <div class="profile-header ${bannerHtml ? 'has-banner' : ''}">
      <img src="${avatarUrl}" class="profile-avatar" onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
      <div>
        <div class="bold" style="font-size:15px">${esc(displayName)}</div>
        <div class="muted small">@${esc(username)}</div>
        ${nick ? `<div class="muted small">${esc(t('profile.nick'))}: ${esc(nick)}</div>` : ''}
      </div>
    </div>

    <div class="profile-grid">
      <div class="profile-item">
        <div class="label">${esc(t('profile.created'))}</div>
        <div class="small">${createdAt ? esc(fmtDateTime(createdAt)) : esc(t('common.unknown'))}</div>
      </div>

      <div class="profile-item">
        <div class="label">${esc(t('profile.joined'))}</div>
        <div class="small">${joinedAt ? esc(fmtDateTime(joinedAt)) : esc(t('common.unknown'))}</div>
      </div>

      <div class="profile-item">
        <div class="label">${esc(t('profile.roles'))}</div>
        <div class="role-list">${rolesHtml}</div>
      </div>
    </div>

    <div class="muted small" style="font-style:italic;margin-top:8px">${esc(t('profile.bio_note'))}</div>
  `;
}

/* ===== user modal ===== */

function showView(view) {
  ['profile', 'nick', 'timeout'].forEach(v => document.getElementById('modal-view-' + v).classList.add('hidden'));

  document.getElementById('modal-view-' + view).classList.remove('hidden');
}

async function openUserModal(uid, uname, gid) {
  try {
    const uidEl = document.getElementById('modal-uid');

    if (uidEl) uidEl.textContent = uid;

    const nickInput = document.getElementById('nick-input');

    if (nickInput) nickInput.value = '';

    const timeoutInput = document.getElementById('timeout-input');

    if (timeoutInput) timeoutInput.value = '';

    showView('profile');

    document.getElementById('user-modal').classList.remove('hidden');

    const details = document.getElementById('profile-details');

    if (!details) return;

    details.innerHTML = '<div class="muted small">' + esc(t('common.loading')) + '</div>';

    let member = null;

    try {
      member = await fetchMember(gid, uid, logToken);
    } catch {}

    let user = null;

    try {
      user = await fetchUser(uid, logToken);
    } catch {}

    let roles = [];

    try {
      roles = await fetchGuildRoles(gid, logToken);
    } catch {}

    renderProfileDetails(details, uid, user, member, roles, gid);
  } catch (e) {
    const details = document.getElementById('profile-details');

    if (details) {
      details.innerHTML = '<div class="muted small">' + esc(t('common.error')) + ': ' + esc(e.message) + '</div>';
    } else {
      tt(e.message);
    }
  }
}

document.getElementById('close-modal').onclick = () => document.getElementById('user-modal').classList.add('hidden');

document.getElementById('user-modal').onclick = (e) => {
  if (e.target === e.currentTarget) e.currentTarget.classList.add('hidden');
};

document.getElementById('copy-uid').onclick = () => {
  navigator.clipboard.writeText(document.getElementById('modal-uid').textContent);
  tt(t('common.copied'));
};

document.getElementById('btn-nick').onclick = () => showView('nick');
document.getElementById('nick-cancel').onclick = () => showView('profile');
document.getElementById('btn-timeout').onclick = () => showView('timeout');
document.getElementById('timeout-cancel').onclick = () => showView('profile');

document.getElementById('nick-save').onclick = async () => {
  const nick = document.getElementById('nick-input').value;
  const uid = document.getElementById('modal-uid').textContent;

  const oldToken = selToken;

  selToken = logToken;

  const btn = document.getElementById('nick-save');

  btn.disabled = true;
  btn.textContent = t('common.saving');

  try {
    await api(`/guilds/${logGuild}/members/${uid}`, {
      method: 'PATCH',
      body: JSON.stringify({ nick })
    });

    tt(t('profile.nick_changed'));

    document.getElementById('close-modal').click();
  } catch (e) {
    tt(friendlyError(e.message, 'nick'));
  } finally {
    selToken = oldToken;

    btn.disabled = false;
    btn.textContent = t('common.save');
  }
};

document.getElementById('timeout-save').onclick = async () => {
  const mins = document.getElementById('timeout-input').value;

  if (!mins || mins <= 0) {
    tt(t('error.invalid_duration'));
    return;
  }

  const uid = document.getElementById('modal-uid').textContent;

  const oldToken = selToken;

  selToken = logToken;

  const btn = document.getElementById('timeout-save');

  btn.disabled = true;
  btn.textContent = t('common.applying');

  try {
    const until = new Date(Date.now() + parseInt(mins, 10) * 60000).toISOString();

    await api(`/guilds/${logGuild}/members/${uid}`, {
      method: 'PATCH',
      body: JSON.stringify({ communication_disabled_until: until })
    });

    tt(t('profile.timeout_applied'));

    document.getElementById('close-modal').click();
  } catch (e) {
    tt(friendlyError(e.message, 'timeout'));
  } finally {
    selToken = oldToken;

    btn.disabled = false;
    btn.textContent = t('common.apply');
  }
};

async function modAction(action) {
  const uid = document.getElementById('modal-uid').textContent;

  const oldToken = selToken;

  selToken = logToken;

  const btn = document.getElementById(action === 'ban' ? 'btn-ban' : 'btn-kick');

  btn.disabled = true;

  try {
    if (action === 'ban') {
      await api(`/guilds/${logGuild}/bans/${uid}`, {
        method: 'PUT',
        body: JSON.stringify({ delete_message_seconds: 0 })
      });

      tt(t('profile.user_banned'));
    } else if (action === 'kick') {
      await api(`/guilds/${logGuild}/members/${uid}`, { method: 'DELETE' });

      tt(t('profile.user_kicked'));
    }

    document.getElementById('close-modal').click();
  } catch (e) {
    tt(friendlyError(e.message, action));
  } finally {
    selToken = oldToken;

    btn.disabled = false;
  }
}

document.getElementById('btn-ban').onclick = () => modAction('ban');
document.getElementById('btn-kick').onclick = () => modAction('kick');

/* ===== presence ===== */

const presenceBotSel = document.getElementById('presence-bot-select');

function populatePresenceBotSelect() {
  if (!presenceBotSel) return;

  const cur = presenceBotSel.value;

  presenceBotSel.innerHTML = '';

  setPlaceholderOption(presenceBotSel, 'select.bot');

  if (V) {
    V.bots.forEach(b => {
      const o = document.createElement('option');
      o.value = b.id;
      o.textContent = b.name;
      presenceBotSel.appendChild(o);
    });
  }

  if (cur) presenceBotSel.value = cur;

  translateSelectOptions(presenceBotSel);
}

let presenceBot = null;
let presenceToken = null;

presenceBotSel.onchange = async () => {
  const id = presenceBotSel.value;

  presenceBot = V.bots.find(b => b.id === id) || null;
  presenceToken = presenceBot ? await db(presenceBot, K) : null;

  document.getElementById('set-presence').disabled = !presenceToken;
  document.getElementById('disconnect-presence').disabled = !presenceToken;

  if (presenceBot && presenceCache[presenceBot.id]) {
    const c = presenceCache[presenceBot.id];

    document.getElementById('presence-status').value = c.status || 'online';
    document.getElementById('presence-activity').value = c.activity || '';
  }
};

document.getElementById('set-presence').onclick = async () => {
  const status = document.getElementById('presence-status').value;
  const activity = document.getElementById('presence-activity').value.trim() || null;

  const btn = document.getElementById('set-presence');
  const err = document.getElementById('presence-error');

  err.classList.add('hidden');

  btn.disabled = true;
  btn.textContent = t('common.applying');

  try {
    await gateway(`/${presenceBot.id}/connect`, { token: presenceToken });
    await gateway(`/${presenceBot.id}/presence`, { status, activity });

    presenceCache[presenceBot.id] = { status, activity };

    savePresenceCache();

    tt(t('presence.updated'));

    refreshSessions();
  } catch (e) {
    err.textContent = t('common.error') + ': ' + e.message;
    err.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.textContent = t('presence.apply');
  }
};

document.getElementById('disconnect-presence').onclick = async () => {
  const btn = document.getElementById('disconnect-presence');

  btn.disabled = true;
  btn.textContent = t('common.disconnecting');

  try {
    await gateway(`/${presenceBot.id}/disconnect`);

    delete presenceCache[presenceBot.id];

    savePresenceCache();

    tt(t('presence.reset'));

    refreshSessions();
  } catch (e) {
    tt(e.message);
  } finally {
    btn.disabled = false;
    btn.textContent = t('presence.disconnect');
  }
};

async function refreshSessions() {
  try {
    const res = await gatewayGet('/status');
    const list = res.sessions || [];
    const el = document.getElementById('sessions-list');

    if (!el) return;

    if (!list.length) {
      el.innerHTML = '<span class="muted small">' + esc(t('presence.no_sessions')) + '</span>';
      return;
    }

    el.innerHTML = list.map(s => {
      const status = ({
        online: t('presence.online'),
        idle: t('presence.idle'),
        dnd: t('presence.dnd'),
        invisible: t('presence.invisible')
      })[s.presence] || s.presence;

      return `
        <div class="session-item">
          <div class="dot dot-ok"></div>
          <div>
            <div class="bold" style="font-size:13px">@${esc(s.user ? s.user.username : t('common.unknown'))}</div>
            <div class="muted small">${esc(s.id.slice(0, 12))}…</div>
          </div>
          <div class="status-tag">${esc(status)}</div>
        </div>
      `;
    }).join('');
  } catch (e) {
    document.getElementById('sessions-list').innerHTML = '<span class="muted small">' + esc(t('common.error')) + ': ' + esc(e.message) + '</span>';
  }
}

/* ===== voice tab ===== */

let voiceBot = null;
let voiceToken = null;
let voiceGuild = null;
let voiceChannel = null;

let voiceCurrentlyInChannel = false;
let voiceCurrentlyPlaying = false;

let voicePlayFile = null;

const voiceBotSel = document.getElementById('voice-bot-select');
const voiceGs = document.getElementById('voice-guild-select');
const voiceCs = document.getElementById('voice-chan-select');

const voicePlayInput = document.getElementById('voice-play-file');
const voicePlayBtn = document.getElementById('voice-play');
const voiceStopBtn = document.getElementById('voice-stop');
const voicePlayStatus = document.getElementById('voice-play-status');

function populateVoiceBotSelect() {
  if (!voiceBotSel) return;

  const cur = voiceBotSel.value;

  voiceBotSel.innerHTML = '';

  setPlaceholderOption(voiceBotSel, 'select.bot');

  if (V) {
    V.bots.forEach(b => {
      const o = document.createElement('option');
      o.value = b.id;
      o.textContent = b.name;
      voiceBotSel.appendChild(o);
    });
  }

  if (cur) voiceBotSel.value = cur;

  translateSelectOptions(voiceBotSel);
}

voiceBotSel.onchange = async () => {
  const id = voiceBotSel.value;

  voiceBot = V.bots.find(b => b.id === id) || null;
  voiceToken = voiceBot ? await db(voiceBot, K) : null;

  voiceGs.disabled = true;
  setPlaceholderOption(voiceGs, 'select.bot_first');

  voiceCs.disabled = true;
  setPlaceholderOption(voiceCs, 'select.server');

  if (voiceToken) loadVoiceGuilds();

  updateVoiceStatus();
  updateVoiceControls();
};

async function loadVoiceGuilds() {
  voiceGs.disabled = false;

  setPlaceholderOption(voiceGs, 'select.loading');

  try {
    const old = selToken;

    selToken = voiceToken;

    const g = await api('/users/@me/guilds');

    selToken = old;

    voiceGs.innerHTML = '';

    setPlaceholderOption(voiceGs, 'select.choose_server');

    g.forEach(x => {
      const o = document.createElement('option');
      o.value = x.id;
      o.textContent = x.name;
      voiceGs.appendChild(o);
    });

    translateSelectOptions(voiceGs);
  } catch (e) {
    setPlaceholderOption(voiceGs, 'select.error');
    tt(e.message);
  }
}

voiceGs.onchange = async () => {
  voiceGuild = voiceGs.value;

  if (!voiceGuild) {
    voiceCs.disabled = true;
    setPlaceholderOption(voiceCs, 'select.server');
    return;
  }

  voiceCs.disabled = false;

  setPlaceholderOption(voiceCs, 'select.loading');

  try {
    const old = selToken;

    selToken = voiceToken;

    const ch = await api('/guilds/' + voiceGuild + '/channels');

    selToken = old;

    const voiceChannels = ch.filter(c => c.type === 2 || c.type === 13);

    voiceCs.innerHTML = '';

    setPlaceholderOption(voiceCs, 'select.choose_channel');

    voiceChannels.forEach(c => {
      const o = document.createElement('option');
      o.value = c.id;
      o.textContent = (c.type === 13 ? '🎙 ' : '🔊 ') + c.name;
      voiceCs.appendChild(o);
    });

    translateSelectOptions(voiceCs);
  } catch (e) {
    setPlaceholderOption(voiceCs, 'select.error');
    tt(e.message);
  }
};

voiceCs.onchange = () => {
  voiceChannel = voiceCs.value;

  updateVoiceControls();
};

function updateVoiceControls() {
  const joinBtn = document.getElementById('voice-join');
  const leaveBtn = document.getElementById('voice-leave');

  if (joinBtn) {
    joinBtn.disabled = !voiceBot || !voiceChannel;
    joinBtn.textContent = voiceCurrentlyInChannel ? t('voice.update') : t('voice.join');
  }

  if (leaveBtn) {
    leaveBtn.disabled = !voiceBot || (!voiceChannel && !voiceCurrentlyInChannel);
  }

  if (voicePlayBtn) {
    voicePlayBtn.disabled = !voiceBot || !voiceChannel || !voicePlayFile;
  }

  if (voiceStopBtn) {
    voiceStopBtn.disabled = !voiceBot || !voiceCurrentlyPlaying;
  }
}

async function ensureVoiceJoined() {
  if (!voiceBot || !voiceGuild || !voiceChannel) {
    throw new Error(t('voice.not_in_channel'));
  }

  await gateway(`/${voiceBot.id}/connect`, { token: voiceToken });

  await gateway(`/${voiceBot.id}/voice/join`, {
    guild_id: voiceGuild,
    channel_id: voiceChannel,
    self_mute: document.getElementById('voice-self-mute').checked,
    self_deaf: document.getElementById('voice-self-deaf').checked,
    auto_leave_seconds: 0,
    timeout_ms: 12000
  });
}

document.getElementById('voice-join').onclick = async () => {
  const err = document.getElementById('voice-error');

  err.classList.add('hidden');

  const btn = document.getElementById('voice-join');

  btn.disabled = true;

  try {
    const wasIn = voiceCurrentlyInChannel;

    await ensureVoiceJoined();

    tt(wasIn ? t('voice.updated') : t('voice.joined'));

    await updateVoiceStatus();
  } catch (e) {
    err.textContent = e.message;
    err.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    updateVoiceControls();
  }
};

document.getElementById('voice-leave').onclick = async () => {
  const err = document.getElementById('voice-error');

  err.classList.add('hidden');

  if (!voiceBot) return;

  const btn = document.getElementById('voice-leave');

  btn.disabled = true;

  try {
    await gateway(`/${voiceBot.id}/voice/leave`, {});

    tt(t('voice.left'));

    await updateVoiceStatus();
  } catch (e) {
    err.textContent = e.message;
    err.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    updateVoiceControls();
  }
};

document.getElementById('voice-refresh').onclick = () => updateVoiceStatus();

['voice-self-mute', 'voice-self-deaf'].forEach(id => {
  const el = document.getElementById(id);

  if (!el) return;

  el.addEventListener('change', async () => {
    if (!voiceCurrentlyInChannel) return;

    try {
      await ensureVoiceJoined();
      await updateVoiceStatus();
    } catch (e) {
      const err = document.getElementById('voice-error');

      if (err) {
        err.textContent = e.message;
        err.classList.remove('hidden');
      }
    }
  });
});

if (voicePlayInput) {
  voicePlayInput.addEventListener('change', () => {
    voicePlayFile = voicePlayInput.files?.[0] || null;

    updateVoiceControls();
  });
}

if (voicePlayBtn) {
  voicePlayBtn.onclick = async () => {
    const err = document.getElementById('voice-error');

    err.classList.add('hidden');

    if (!voiceBot || !voiceChannel || !voicePlayFile) {
      if (voicePlayStatus) voicePlayStatus.textContent = t('voice.play_select_file');
      return;
    }

    voicePlayBtn.disabled = true;

    if (voicePlayStatus) voicePlayStatus.textContent = t('voice.play_preparing');

    try {
      await ensureVoiceJoined();

      const audioBase64 = await readFileAsDataURL(voicePlayFile);

      const res = await gateway(`/${voiceBot.id}/voice/play`, {
        guild_id: voiceGuild,
        channel_id: voiceChannel,
        filename: voicePlayFile.name,
        audio_base64: audioBase64,
        self_mute: document.getElementById('voice-self-mute').checked,
        self_deaf: document.getElementById('voice-self-deaf').checked
      });

      if (voicePlayStatus) {
        voicePlayStatus.textContent = `${t('voice.play_playing')} · ${Math.round((res.duration_ms || 0) / 1000)}s`;
      }

      voiceCurrentlyPlaying = true;

      updateVoiceControls();

      setTimeout(() => {
        voiceCurrentlyPlaying = false;
        updateVoiceControls();
        updateVoiceStatus();
      }, (res.duration_ms || 0) + 1500);
    } catch (e) {
      if (voicePlayStatus) voicePlayStatus.textContent = t('common.error') + ': ' + e.message;

      if (err) {
        err.textContent = e.message;
        err.classList.remove('hidden');
      }
    } finally {
      updateVoiceControls();
    }
  };
}

if (voiceStopBtn) {
  voiceStopBtn.onclick = async () => {
    if (!voiceBot) return;

    try {
      await gateway(`/${voiceBot.id}/voice/stop`);

      voiceCurrentlyPlaying = false;

      if (voicePlayStatus) voicePlayStatus.textContent = t('voice.play_stopped');

      updateVoiceControls();
      updateVoiceStatus();
    } catch (e) {
      const err = document.getElementById('voice-error');

      if (err) {
        err.textContent = e.message;
        err.classList.remove('hidden');
      }
    }
  };
}

async function updateVoiceStatus() {
  const el = document.getElementById('voice-status');

  if (!el) return;

  if (!voiceBot) {
    el.textContent = '';

    voiceCurrentlyInChannel = false;
    voiceCurrentlyPlaying = false;

    updateVoiceControls();

    return;
  }

  try {
    const res = await gatewayGet('/' + voiceBot.id + '/voice/status');

    voiceCurrentlyInChannel = !!(res.voice && res.voice.channel_id);
    voiceCurrentlyPlaying = !!res.playing;

    if (!res.connected) {
      el.textContent = t('voice.not_connected');
      updateVoiceControls();
      return;
    }

    if (!voiceCurrentlyInChannel) {
      el.textContent = t('voice.not_in_channel');
      updateVoiceControls();
      return;
    }

    el.innerHTML = `
      <div><b>${esc(t('voice.in_channel'))}</b>${voiceCurrentlyPlaying ? ' · ' + esc(t('voice.play_playing')) : ''}</div>
      <div class="mono small">channel: ${esc(res.voice.channel_id)}</div>
      <div class="mono small">guild: ${esc(res.voice.guild_id || '')}</div>
      <div class="mono small">session: ${esc(res.voice.session_id || '')}</div>
      <div class="muted small">${res.voice.self_mute ? 'self-mute · ' : ''}${res.voice.self_deaf ? 'self-deaf' : ''}</div>
    `;
  } catch (e) {
    el.textContent = t('common.error') + ': ' + e.message;

    voiceCurrentlyInChannel = false;
    voiceCurrentlyPlaying = false;
  }

  updateVoiceControls();
}

/* ===== cleaner ===== */

let cleanBot = null;
let cleanToken = null;
let cleanGuild = null;
let cleanChannel = null;

const cleanBotSel = document.getElementById('clean-bot-select');
const cleanGs = document.getElementById('clean-guild-select');
const cleanCs = document.getElementById('clean-chan-select');

function populateCleanBotSelect() {
  if (!cleanBotSel) return;

  const cur = cleanBotSel.value;

  cleanBotSel.innerHTML = '';

  setPlaceholderOption(cleanBotSel, 'select.bot');

  if (V) {
    V.bots.forEach(b => {
      const o = document.createElement('option');
      o.value = b.id;
      o.textContent = b.name;
      cleanBotSel.appendChild(o);
    });
  }

  if (cur) cleanBotSel.value = cur;

  translateSelectOptions(cleanBotSel);
}

cleanBotSel.onchange = async () => {
  const id = cleanBotSel.value;

  cleanBot = V.bots.find(b => b.id === id) || null;
  cleanToken = cleanBot ? await db(cleanBot, K) : null;

  cleanGs.disabled = true;
  setPlaceholderOption(cleanGs, 'select.bot_first');

  cleanCs.disabled = true;
  setPlaceholderOption(cleanCs, 'select.server');

  document.getElementById('clean-target').textContent = '';

  if (cleanToken) loadCleanGuilds();
};

async function loadCleanGuilds() {
  cleanGs.disabled = false;

  setPlaceholderOption(cleanGs, 'select.loading');

  try {
    const old = selToken;

    selToken = cleanToken;

    const g = await api('/users/@me/guilds');

    selToken = old;

    cleanGs.innerHTML = '';

    setPlaceholderOption(cleanGs, 'select.choose_server');

    g.forEach(x => {
      const o = document.createElement('option');
      o.value = x.id;
      o.textContent = x.name;
      cleanGs.appendChild(o);
    });

    translateSelectOptions(cleanGs);
  } catch (e) {
    setPlaceholderOption(cleanGs, 'select.error');
    tt(e.message);
  }
}

cleanGs.onchange = async () => {
  cleanGuild = cleanGs.value;

  if (!cleanGuild) {
    cleanCs.disabled = true;
    setPlaceholderOption(cleanCs, 'select.server');
    document.getElementById('clean-target').textContent = '';
    return;
  }

  cleanCs.disabled = false;

  setPlaceholderOption(cleanCs, 'select.loading');

  try {
    const old = selToken;

    selToken = cleanToken;

    const ch = await api('/guilds/' + cleanGuild + '/channels');

    selToken = old;

    const tx = ch.filter(c => c.type === 0 || c.type === 5 || c.type === 15);

    cleanCs.innerHTML = '';

    setPlaceholderOption(cleanCs, 'select.choose_channel');

    tx.forEach(c => {
      const o = document.createElement('option');
      o.value = c.id;
      o.textContent = '#' + c.name;
      cleanCs.appendChild(o);
    });

    translateSelectOptions(cleanCs);
  } catch (e) {
    setPlaceholderOption(cleanCs, 'select.error');
    tt(e.message);
  }
};

cleanCs.onchange = async () => {
  cleanChannel = cleanCs.value;

  if (!cleanChannel) {
    document.getElementById('clean-target').textContent = '';
    return;
  }

  try {
    const old = selToken;

    selToken = cleanToken;

    const ch = await api('/channels/' + cleanChannel);

    selToken = old;

    document.getElementById('clean-target').textContent = '#' + ch.name + ' (' + cleanChannel + ')';
  } catch (e) {
    document.getElementById('clean-target').textContent = cleanChannel;
  }
};

document.getElementById('clean-messages').onclick = async () => {
  if (!cleanChannel || !cleanToken) {
    tt(t('cleaner.select_channel'));
    return;
  }

  showConfirmModal(
    t('cleaner.delete_all_title'),
    t('cleaner.confirm_delete_all'),
    async () => {
      const progress = document.getElementById('clean-progress');
      const fill = progress.querySelector('.progress-fill');
      const text = document.getElementById('clean-progress-text');
      const btn = document.getElementById('clean-messages');

      progress.classList.remove('hidden');
      text.classList.remove('hidden');

      btn.disabled = true;
      btn.textContent = t('cleaner.deleting');

      fill.style.width = '0%';

      const old = selToken;

      selToken = cleanToken;

      try {
        let before = null;
        let total = 0;
        let deleted = 0;

        let young = [];
        let old1 = [];

        while (true) {
          const url = '/channels/' + cleanChannel + '/messages?limit=100' + (before ? '&before=' + before : '');
          const msgs = await api(url);

          if (!msgs.length) break;

          const cutoff = Date.now() - 14 * 24 * 3600 * 1000;

          for (const m of msgs) {
            total++;

            if (new Date(m.timestamp).getTime() > cutoff) young.push(m.id);
            else old1.push(m.id);
          }

          before = msgs[msgs.length - 1].id;

          text.textContent = `${t('cleaner.scanning')}: ${total} ${t('cleaner.messages')}...`;

          if (msgs.length < 100) break;
        }

        for (let i = 0; i < young.length; i += 100) {
          const batch = young.slice(i, i + 100);

          await api(`/channels/${cleanChannel}/messages/bulk-delete`, {
            method: 'POST',
            body: JSON.stringify({ messages: batch })
          });

          deleted += batch.length;

          fill.style.width = ((deleted / total) * 100) + '%';
          text.textContent = `${t('cleaner.deleted_progress')}: ${deleted}/${total}`;

          await new Promise(r => setTimeout(r, 1200));
        }

        for (const id of old1) {
          try {
            await api(`/channels/${cleanChannel}/messages/${id}`, { method: 'DELETE' });

            deleted++;

            fill.style.width = ((deleted / total) * 100) + '%';
            text.textContent = `${t('cleaner.deleted_progress')}: ${deleted}/${total}`;

            await new Promise(r => setTimeout(r, 500));
          } catch (e) {
            // skip
          }
        }

        tt(`${deleted} ${t('cleaner.messages_deleted')}`);
      } catch (e) {
        tt(friendlyError(e.message, 'delete'));
      } finally {
        selToken = old;

        btn.disabled = false;
        btn.textContent = t('cleaner.delete_all');

        setTimeout(() => {
          progress.classList.add('hidden');
          text.classList.add('hidden');
        }, 2000);
      }
    }
  );
};

document.getElementById('clone-channel').onclick = async () => {
  if (!cleanChannel || !cleanToken) {
    tt(t('cleaner.select_channel'));
    return;
  }

  showConfirmModal(
    t('cleaner.clone_title'),
    t('cleaner.confirm_clone'),
    async () => {
      const btn = document.getElementById('clone-channel');

      btn.disabled = true;
      btn.textContent = t('cleaner.cloning');

      const old = selToken;

      selToken = cleanToken;

      try {
        const orig = await api('/channels/' + cleanChannel);

        const payload = {
          name: orig.name,
          type: orig.type,
          topic: orig.topic || '',
          nsfw: orig.nsfw || false,
          rate_limit_per_user: orig.rate_limit_per_user || 0,
          parent_id: orig.parent_id || null,
          permission_overwrites: orig.permission_overwrites || [],
        };

        if (orig.bitrate) payload.bitrate = orig.bitrate;
        if (orig.user_limit) payload.user_limit = orig.user_limit;
        if (orig.position !== undefined) payload.position = orig.position;

        const newCh = await api('/guilds/' + cleanGuild + '/channels', {
          method: 'POST',
          body: JSON.stringify(payload)
        });

        await api('/channels/' + cleanChannel, { method: 'DELETE' });

        tt(t('cleaner.channel_cloned') + ': #' + newCh.name);

        const options = cleanCs.querySelectorAll('option');

        options.forEach(o => {
          if (o.value === cleanChannel) o.remove();
        });

        document.getElementById('clean-target').textContent = '';

        cleanChannel = null;
      } catch (e) {
        tt(friendlyError(e.message, 'clone'));
      } finally {
        selToken = old;

        btn.disabled = false;
        btn.textContent = t('cleaner.clone');
      }
    }
  );
};

/* ===== bot selects helper ===== */

function populateAllBotSelects() {
  populateBotSelect();
  populateLogBotSelect();
  populatePresenceBotSelect();
  populateVoiceBotSelect();
  populateCleanBotSelect();
}

/* ===== init ===== */

const storedVault = lv();

if (storedVault) {
  V = storedVault;
}

initAllDropdowns();

initI18n()
  .then(() => {
    updateUnlockTexts();
    updatePreview();
    syncVoiceMessageState();
    updateVoiceControls();
  })
  .catch(() => {
    document.documentElement.classList.remove('i18n-loading');
  });

window.addEventListener('i18n:changed', () => {
  if (V && K) {
    rb();
    populateAllBotSelects();

    if (!document.getElementById('presence').classList.contains('hidden')) {
      refreshSessions();
    }

    if (!document.getElementById('voice').classList.contains('hidden')) {
      updateVoiceStatus();
    }
  }

  updatePreview();
});

document.getElementById('sb').onclick = async () => {
  const pw = document.getElementById('pw').value;
  const pw2 = document.getElementById('pw2').value;
  const er = document.getElementById('em');

  er.classList.add('hidden');

  if (!V) {
    if (pw.length < 8) {
      er.textContent = t('error.min_password');
      er.classList.remove('hidden');
      return;
    }

    if (pw !== pw2) {
      er.textContent = t('error.password_mismatch');
      er.classList.remove('hidden');
      return;
    }
  }

  const b = document.getElementById('sb');

  b.disabled = true;
  b.textContent = t('common.wait');

  try {
    if (V) K = await unl(V, pw);
    else {
      const r = await mk(pw);

      V = r.file;
      K = r.key;

      sv();
    }

    arm(ALM);

    sm();
    updateUnlockTexts();
  } catch (e) {
    er.textContent = e.message;
    er.classList.remove('hidden');
  } finally {
    b.disabled = false;
    b.textContent = V ? t('unlock.unlock') : t('unlock.create');
  }
};

document.getElementById('ab').onclick = () => {
  document.getElementById('af').classList.remove('hidden');
  document.getElementById('ab').classList.add('hidden');
};

document.getElementById('ca').onclick = () => {
  document.getElementById('af').classList.add('hidden');
  document.getElementById('ab').classList.remove('hidden');

  document.getElementById('bn').value = '';
  document.getElementById('bt').value = '';

  document.getElementById('fe').classList.add('hidden');
};

document.getElementById('sv').onclick = async () => {
  const n = document.getElementById('bn').value.trim();
  const tk = document.getElementById('bt').value.trim();
  const e = document.getElementById('fe');

  if (!n) {
    e.textContent = t('vault.need_name');
    e.classList.remove('hidden');
    return;
  }

  if (!lkt(tk)) {
    e.textContent = t('vault.invalid_token');
    e.classList.remove('hidden');
    return;
  }

  const b = document.getElementById('sv');

  b.disabled = true;

  try {
    const bt = await eb(n, tk, K);

    V.bots.push(bt);

    sv();
    rb();

    tt(t('vault.added_bot'));

    document.getElementById('ca').click();
  } catch (er) {
    e.textContent = t('common.error');
    e.classList.remove('hidden');
  } finally {
    b.disabled = false;
  }
};

document.getElementById('als').querySelectorAll('.seg-btn').forEach(b => b.onclick = () => {
  document.querySelectorAll('#als .seg-btn').forEach(x => x.classList.remove('active'));

  b.classList.add('active');

  ALM = parseInt(b.dataset.v, 10);

  safeSetItem('alm', ALM);

  if (K) arm(ALM);
});

document.getElementById('lk-side').onclick = () => {
  K = null;

  if (ALT) clearTimeout(ALT);

  su();

  tt(t('vault.locked'));
};

document.getElementById('ds').onclick = () => {
  showConfirmModal(
    t('settings.reset_vault'),
    t('settings.reset_vault_confirm'),
    () => {
      V = null;
      K = null;

      dv();

      presenceCache = {};

      savePresenceCache();

      if (ALT) clearTimeout(ALT);

      updateUnlockTexts();
      su();

      tt(t('settings.vault_deleted'));
    }
  );
};

document.querySelectorAll('#als .seg-btn').forEach(b => {
  b.classList.remove('active');

  if (parseInt(b.dataset.v, 10) === ALM) b.classList.add('active');
});

/* ===== theme ===== */

function applyTheme(theme) {
  if (theme === 'auto') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;

  safeSetItem('theme', theme);

  document.querySelectorAll('#theme-seg .seg-btn').forEach(b => b.classList.toggle('active', b.dataset.v === theme));
}

document.querySelectorAll('#theme-seg .seg-btn').forEach(b => b.onclick = () => applyTheme(b.dataset.v));

applyTheme(safeGetItem('theme') || 'auto');

/* ===== change master password ===== */

document.getElementById('cpw-open').onclick = () => {
  ['cpw-old', 'cpw-new', 'cpw-new2'].forEach(id => document.getElementById(id).value = '');

  document.getElementById('cpw-error').classList.add('hidden');

  document.getElementById('change-pw-modal').classList.remove('hidden');
};

document.getElementById('cpw-close').onclick = () => document.getElementById('change-pw-modal').classList.add('hidden');
document.getElementById('cpw-cancel').onclick = () => document.getElementById('change-pw-modal').classList.add('hidden');

document.getElementById('change-pw-modal').onclick = (e) => {
  if (e.target === e.currentTarget) e.currentTarget.classList.add('hidden');
};

document.getElementById('cpw-save').onclick = async () => {
  const err = document.getElementById('cpw-error');

  err.classList.add('hidden');

  const oldPw = document.getElementById('cpw-old').value;
  const newPw = document.getElementById('cpw-new').value;
  const newPw2 = document.getElementById('cpw-new2').value;

  if (newPw.length < 8) {
    err.textContent = t('error.min_password');
    err.classList.remove('hidden');
    return;
  }

  if (newPw !== newPw2) {
    err.textContent = t('error.password_mismatch');
    err.classList.remove('hidden');
    return;
  }

  const btn = document.getElementById('cpw-save');

  btn.disabled = true;
  btn.textContent = t('settings.reencrypting');

  try {
    const oldKey = await unl(V, oldPw);

    const tokens = [];

    for (const b of V.bots) tokens.push(await db(b, oldKey));

    const salt = crypto.getRandomValues(new Uint8Array(16));
    const newKey = await dk(newPw, salt);

    const newBots = [];

    for (let i = 0; i < V.bots.length; i++) {
      const { id, name, createdAt } = V.bots[i];

      newBots.push({
        id,
        name,
        createdAt,
        ...(await enc(tokens[i], newKey))
      });
    }

    V = {
      ...V,
      kdf: { algo: 'pbkdf2-sha256', iters: ITERS, salt: b64(salt) },
      verifier: await enc(VER, newKey),
      bots: newBots
    };

    K = newKey;

    sv();

    arm(ALM);

    document.getElementById('change-pw-modal').classList.add('hidden');

    tt(t('settings.master_password_changed'));
  } catch (e) {
    err.textContent = e.message === 'password errata'
      ? t('settings.current_pw_wrong')
      : e.message;

    err.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.textContent = t('common.save');
  }
};

/* ===== dropdown ===== */

function makeDropdown(select) {
  if (select.dataset.dropdownified) return;

  select.dataset.dropdownified = '1';

  const wrapper = document.createElement('div');

  wrapper.className = 'dropdown';

  const btn = document.createElement('button');

  btn.type = 'button';
  btn.className = 'dropdown-btn';

  const label = document.createElement('span');

  label.className = 'dropdown-label';

  const arrow = document.createElement('i');

  arrow.setAttribute('data-icon', 'chevron');

  btn.appendChild(label);
  btn.appendChild(arrow);

  const menu = document.createElement('div');

  menu.className = 'dropdown-menu';

  wrapper.appendChild(btn);
  wrapper.appendChild(menu);

  select.parentNode.replaceChild(wrapper, select);

  wrapper.appendChild(select);

  select.style.display = 'none';

  function syncLabel() {
    const opt = select.options[select.selectedIndex];

    label.textContent = opt ? opt.textContent : '';

    btn.disabled = select.disabled;
  }

  function renderMenu() {
    menu.innerHTML = '';

    for (const opt of select.options) {
      const item = document.createElement('button');

      item.type = 'button';
      item.className = 'dropdown-item' + (opt.selected ? ' selected' : '');

      if (opt.disabled) item.disabled = true;

      item.textContent = opt.textContent;

      item.onclick = () => {
        select.value = opt.value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        syncLabel();
        menu.classList.remove('open');
      };

      menu.appendChild(item);
    }

    injectIcons(menu);
  }

  btn.onclick = () => {
    if (btn.disabled) return;

    document.querySelectorAll('.dropdown-menu.open').forEach(m => {
      if (m !== menu) m.classList.remove('open');
    });

    renderMenu();

    menu.classList.toggle('open');
  };

  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) menu.classList.remove('open');
  });

  select.addEventListener('change', syncLabel);
  select.addEventListener('i18n:options', syncLabel);

  const observer = new MutationObserver(() => {
    syncLabel();

    if (menu.classList.contains('open')) renderMenu();
  });

  observer.observe(select, {
    childList: true,
    attributes: true,
    attributeFilter: ['disabled']
  });

  syncLabel();

  return wrapper;
}

function initAllDropdowns() {
  document.querySelectorAll('select').forEach(makeDropdown);
}