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
.leaving {
  opacity: 0 !important;
  transform: translateY(-8px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.entering {
  opacity: 0 !important;
  transform: translateY(8px);
  animation: enter 0.3s ease forwards;
}
@keyframes enter {
  to { opacity: 1; transform: translateY(0); }
}
`;
(function injectCriticalCss() {
  const style = document.createElement('style');
  style.textContent = CRITICAL_CSS;
  document.head.appendChild(style);
})();

const ICONS = {
  chevron: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>',
  'chevron-left': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>',
  archive: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z"/></svg>',
  circle: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8"/></svg>',
  volume: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>',
  box: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.69V20c0 1.1 1.1 2 2 2h14c.9 0 2-.9 2-2V8.7c.57-.35 1-.97 1-1.69V4c0-1.1-.9-2-2-2zm-5 12H9v-2h6v2zm5-7H4V4h16v3z"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>',
  hash: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.54 5l-.42 2H7.96l.42-2h2.16zm3 0h2.16l-.42 2h-2.16l.42-2zM8.38 11H6.22l.42-2h2.16l-.42 2zm7.4-2h2.16l-.42 2h-2.16l.42-2zM9.22 17H7.06l.42-2h2.16l-.42 2zm3 0h2.16l-.42-2h-2.16l.42 2zM20.5 9h-1.94l.42-2h1.6c.55 0 1-.45 1-1s-.45-1-1-1h-1.98l.48-2.29c.11-.54-.23-1.07-.77-1.18-.54-.11-1.07.23-1.18.77L16.53 5h-2.16l.48-2.29c.11-.54-.23-1.07-.77-1.18-.54-.11-1.07.23-1.18.77L12.5 5h-2.16l.48-2.29c.11-.54-.23-1.07-.77-1.18-.54-.11-1.07.23-1.18.77L8.47 5H5c-.55 0-1 .45-1 1s.45 1 1 1h3.09l-.42 2H5.13c-.55 0-1 .45-1 1s.45 1 1 1h2.16l-.42 2H4.71c-.55 0-1 .45-1 1s.45 1 1 1h1.74l-.48 2.29c-.11.54.23 1.07.77 1.18.54.11 1.07-.23 1.18-.77L8.32 15h2.16l-.48 2.29c-.11.54.23 1.07.77 1.18.54.11 1.07-.23 1.18-.77l.39-2.7h2.16l-.48 2.29c-.11.54.23 1.07.77 1.18.54.11 1.07-.23 1.18-.77l.39-2.7H19c.55 0 1-.45 1-1s-.45-1-1-1h-2.6l.42-2h1.68c.55 0 1-.45 1-1s-.45-1-1-1z"/></svg>',
  trashSmall: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>'
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
      clone: 'error.perm_clone',
      roles: 'error.perm_roles',
      webhook: 'error.perm_webhook',
      voice_mod: 'error.perm_voice_mod'
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
  const body = document.getElementById('info-body');
  // Escape first, then turn http(s) URLs into clickable links. Electron's
  // setWindowOpenHandler routes target="_blank" to shell.openExternal (default browser).
  const safe = esc(String(text));
  body.innerHTML = safe.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
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
  const embedForm = document.getElementById('embed-form');
  if (e.target.checked) {
    embedForm.classList.remove('hidden');
    embedForm.classList.add('entering');
    setTimeout(() => embedForm.classList.remove('entering'), 300);
  } else {
    embedForm.classList.add('leaving');
    setTimeout(() => {
      embedForm.classList.add('hidden');
      embedForm.classList.remove('leaving');
    }, 200);
  }
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
  
  if (on) {
    voiceMessageForm.classList.remove('hidden');
    voiceMessageForm.classList.add('entering');
    setTimeout(() => voiceMessageForm.classList.remove('entering'), 300);
  } else {
    voiceMessageForm.classList.add('leaving');
    setTimeout(() => {
      voiceMessageForm.classList.add('hidden');
      voiceMessageForm.classList.remove('leaving');
    }, 200);
  }
  
  if (ta) ta.disabled = on;
  const embedOn = document.getElementById('embed-on');
  if (embedOn) {
    if (on) { embedOn.checked = false; embedOn.disabled = true; document.getElementById('embed-form')?.classList.add('hidden'); }
    else { embedOn.disabled = false; }
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
  channels: 'channels',
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
  if (tab === 'channels') loadChannelsList();
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

/* ===== sidebar collapse ===== */
const sidebarCollapseBtn = document.getElementById('sidebar-collapse');
if (sidebarCollapseBtn) {
  sidebarCollapseBtn.onclick = () => {
    document.querySelector('.app').classList.toggle('sidebar-collapsed');
    safeSetItem('sidebar-collapsed', document.querySelector('.app').classList.contains('sidebar-collapsed') ? '1' : '0');
  };
  if (safeGetItem('sidebar-collapsed') === '1') {
    document.querySelector('.app').classList.add('sidebar-collapsed');
  }
}

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
    updateMultiActionBar();
    const selRow = document.getElementById('select-all-row');
    if (selRow) selRow.classList.add('hidden');
    return;
  }
  c.innerHTML = V.bots.map((b, i) => `
    <div class="card" data-i="${i}">
      <label class="check-row">
        <input type="checkbox" class="bot-select" data-index="${i}" ${selectedBots.has(b.id) ? 'checked' : ''}>
        <div class="bot-item" style="flex:1">
          <div class="dot dot-idle"></div>
          <div class="bot-info">
            <div class="bot-name">${esc(b.name)}</div>
            <div class="bot-meta">${esc(t('vault.added'))} ${esc(fmtDate(b.createdAt))}</div>
          </div>
        </div>
      </label>
      <div class="btn-row" style="margin-top:12px">
        <button class="btn btn-ghost tb">${esc(t('vault.test'))}</button>
        <button class="btn btn-ghost ib">${esc(t('vault.invite'))}</button>
        <button class="btn btn-danger xb">${esc(t('vault.delete'))}</button>
      </div>
    </div>
  `).join('');
  c.querySelectorAll('.bot-select').forEach(cb => {
    cb.onchange = () => toggleBotSelection(parseInt(cb.dataset.index, 10));
  });
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
    const bot = V.bots[i];
    showConfirmModal(
      t('vault.remove_title'),
      t('vault.remove_desc').replace('{name}', bot.name),
      () => {
        selectedBots.delete(bot.id);
        V.bots.splice(i, 1);
        sv();
        rb();
        tt(t('vault.removed'));
      }
    );
  });
  populateAllBotSelects();
  updateMultiActionBar();
  const selRow = document.getElementById('select-all-row');
  if (selRow) selRow.classList.toggle('hidden', !V.bots.length);
}

/* ===== multi-bot actions (vault) ===== */
const selectedBots = new Set();

function updateMultiActionBar() {
  const bar = document.getElementById('multi-action-bar');
  if (!bar) return;
  if (selectedBots.size > 0) {
    bar.classList.remove('hidden');
    const c = document.getElementById('multi-action-count');
    if (c) c.textContent = t('vault.selected_count').replace('{n}', selectedBots.size);
  } else bar.classList.add('hidden');
}

function toggleBotSelection(index) {
  const bot = V.bots[index];
  if (!bot) return;
  if (selectedBots.has(bot.id)) selectedBots.delete(bot.id);
  else selectedBots.add(bot.id);
  updateMultiActionBar();
}

document.getElementById('select-all-bots').onchange = (e) => {
  if (e.target.checked) V.bots.forEach(b => selectedBots.add(b.id));
  else selectedBots.clear();
  rb();
};

document.getElementById('multi-clear-selection').onclick = () => {
  selectedBots.clear();
  const sa = document.getElementById('select-all-bots');
  if (sa) sa.checked = false;
  rb();
};

function reportMultiResult(success, failed) {
  tt(t('vault.multi_complete').replace('{success}', success).replace('{failed}', failed));
}

document.getElementById('multi-set-presence').onclick = () => {
  if (!selectedBots.size || !K) return;
  showInputModal(t('vault.multi_presence'), t('vault.presence_prompt'), 'online', async (status) => {
    status = (status || '').trim().toLowerCase();
    if (!['online', 'idle', 'dnd', 'invisible'].includes(status)) { tt(t('common.error')); return; }
    const btn = document.getElementById('multi-set-presence');
    btn.disabled = true;
    let success = 0, failed = 0;
    for (const botId of [...selectedBots]) {
      const bot = V.bots.find(b => b.id === botId);
      if (!bot) { failed++; continue; }
      try {
        const token = await db(bot, K);
        await gateway(`/${botId}/connect`, { token });
        await gateway(`/${botId}/presence`, { status });
        success++;
      } catch {
        failed++;
      }
      await new Promise(r => setTimeout(r, 800));
    }
    btn.disabled = false;
    reportMultiResult(success, failed);
    refreshSessions();
  });
};

document.getElementById('multi-send-message').onclick = () => {
  if (!selectedBots.size || !K) return;
  showInputModal(t('vault.multi_send'), t('vault.message_prompt'), 'hello', (content) => {
    if (!content || !content.trim()) return;
    // closeInputModal() runs right after this callback returns, so the second
    // prompt must open on the next tick or it gets hidden immediately
    setTimeout(async () => {
      const channelId = await requestChannelId();
      if (!channelId) return;
      const btn = document.getElementById('multi-send-message');
      btn.disabled = true;
      let success = 0, failed = 0;
      for (const botId of [...selectedBots]) {
        const bot = V.bots.find(b => b.id === botId);
        if (!bot) { failed++; continue; }
        const token = await db(bot, K);
        const old = selToken;
        selToken = token;
        try {
          await api('/channels/' + channelId + '/messages', {
            method: 'POST',
            body: JSON.stringify({ content: content.trim() })
          });
          success++;
        } catch {
          failed++;
        } finally {
          selToken = old;
        }
        await new Promise(r => setTimeout(r, 800));
      }
      btn.disabled = false;
      reportMultiResult(success, failed);
    }, 0);
  });
};

// promise wrapper over showInputModal so the two-step channel prompt does not
// nest two open modals into each other
function requestChannelId() {
  return new Promise(resolve => {
    showInputModal(t('vault.multi_send'), t('vault.channel_prompt'), 'channel_id', (v) => resolve((v || '').trim()));
  });
}

document.getElementById('multi-disconnect').onclick = () => {
  if (!selectedBots.size) return;
  showConfirmModal(t('vault.multi_disconnect'), t('vault.confirm_disconnect'), async () => {
    const btn = document.getElementById('multi-disconnect');
    btn.disabled = true;
    let success = 0, failed = 0;
    for (const botId of [...selectedBots]) {
      try {
        await gateway(`/${botId}/disconnect`);
        success++;
      } catch {
        failed++;
      }
      await new Promise(r => setTimeout(r, 400));
    }
    btn.disabled = false;
    reportMultiResult(success, failed);
    refreshSessions();
  });
};

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
  hideWebhookCard();
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
  const autoTarget = document.getElementById('auto-target');
  const manualTarget = document.getElementById('manual-target');
  const outgoing = curMode === 'auto' ? autoTarget : manualTarget;
  const incoming = m === 'auto' ? autoTarget : manualTarget;
  
  curMode = m;
  document.getElementById('mode-auto').classList.toggle('active', m === 'auto');
  document.getElementById('mode-manual').classList.toggle('active', m === 'manual');
  
  // Animate out the current panel
  outgoing.classList.add('leaving');
  
  setTimeout(() => {
    outgoing.classList.add('hidden');
    outgoing.classList.remove('leaving');
    
    // Show and animate in the new panel
    incoming.classList.remove('hidden');
    incoming.classList.add('entering');
    
    setTimeout(() => {
      incoming.classList.remove('entering');
    }, 300);
  }, 200);
  
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
  const useWebhook = !!(sendViaWebhook && sendViaWebhook.checked);
  if (useWebhook) {
    // the webhook proxy carries json only: attachments and voice notes
    // still go through the bot path
    if (isVoice || fileToSend) {
      err.textContent = t('send.webhook_no_files');
      err.classList.remove('hidden');
      return;
    }
    const wOpt = webhookSel && webhookSel.selectedOptions ? webhookSel.selectedOptions[0] : null;
    if (!webhookSel.value || !wOpt || !wOpt.dataset.token) {
      err.textContent = t('send.error_no_webhook');
      err.classList.remove('hidden');
      return;
    }
  }
  const b = document.getElementById('send-btn');
  b.disabled = true;
  b.textContent = t('send.sending');
  try {
    if (useWebhook) {
      const wOpt = webhookSel.selectedOptions[0];
      const r = await fetch(`/gateway/webhook/${webhookSel.value}/${wOpt.dataset.token}?wait=true`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!r.ok) {
        let msg = 'HTTP ' + r.status;
        try { const j = await r.json(); if (j.message) msg = j.message; } catch {}
        throw new Error(msg);
      }
    } else if (fileToSend) {
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

/* ===== webhooks (send tab) ===== */
let currentWebhooks = [];
const webhookCard = document.getElementById('webhook-card');
const webhookSel = document.getElementById('webhook-select');
const sendViaWebhook = document.getElementById('send-via-webhook');

function hideWebhookCard() {
  currentWebhooks = [];
  if (webhookCard) webhookCard.classList.add('hidden');
  if (webhookSel) webhookSel.innerHTML = '';
  if (sendViaWebhook) sendViaWebhook.checked = false;
}

async function loadWebhooks(chanId) {
  if (!webhookCard || !webhookSel) return;
  if (!chanId || !selToken) { hideWebhookCard(); return; }
  try {
    // requires manage webhooks: without it the card stays hidden, the bot
    // path keeps working as before
    currentWebhooks = await api('/channels/' + chanId + '/webhooks');
    webhookSel.innerHTML = '';
    setPlaceholderOption(webhookSel, 'send.webhook_none');
    currentWebhooks.forEach(w => {
      const o = document.createElement('option');
      o.value = w.id;
      o.textContent = w.name + ' (' + w.id + ')';
      o.dataset.token = w.token || '';
      webhookSel.appendChild(o);
    });
    translateSelectOptions(webhookSel);
    webhookCard.classList.remove('hidden');
  } catch {
    hideWebhookCard();
  }
}

document.getElementById('webhook-create-btn').onclick = () => {
  const chan = getChannelId();
  if (!chan || !selToken) { tt(t('send.error_no_channel')); return; }
  showInputModal(t('send.webhook_create'), t('send.webhook_name_prompt'), 'webhook', async (name) => {
    if (!name || !name.trim()) return;
    try {
      await api('/channels/' + chan + '/webhooks', {
        method: 'POST',
        body: JSON.stringify({ name: name.trim() })
      });
      tt(t('send.webhook_created'));
      loadWebhooks(chan);
    } catch (e) {
      tt(friendlyError(e.message, 'webhook'));
    }
  });
};

document.getElementById('webhook-delete-btn').onclick = () => {
  const id = webhookSel ? webhookSel.value : '';
  if (!id) return;
  const w = currentWebhooks.find(x => x.id === id);
  showConfirmModal(t('send.webhook_delete'), t('send.webhook_delete_confirm').replace('{name}', w?.name || id), async () => {
    try {
      await api('/webhooks/' + id, { method: 'DELETE' });
      tt(t('send.webhook_deleted'));
      loadWebhooks(getChannelId());
    } catch (e) {
      tt(friendlyError(e.message, 'webhook'));
    }
  });
};

document.getElementById('chan-select').addEventListener('change', () => loadWebhooks(getChannelId()));
document.getElementById('manual-chan').addEventListener('input', () => loadWebhooks(getChannelId()));
document.getElementById('mode-auto').addEventListener('click', () => loadWebhooks(getChannelId()));
document.getElementById('mode-manual').addEventListener('click', () => loadWebhooks(getChannelId()));


/* ===== logs ===== */
let logBot = null;
let logToken = null;
let logGuild = null;
let logChannel = null;
let allLogMsgs = [];
let currentFiltered = [];
const selectedLogs = new Set();
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
function resetLogFeed() {
  // drops stale results AND the selection so bulk actions can never hit a
  // channel different from the one the selection was made in
  allLogMsgs = [];
  currentFiltered = [];
  selectedLogs.clear();
  updateLogActionBar();
  renderLogs([]);
}

logBotSel.onchange = async () => {
  const id = logBotSel.value;
  logBot = V.bots.find(b => b.id === id) || null;
  logToken = logBot ? await db(logBot, K) : null;
  resetLogFeed();
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
  resetLogFeed();
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
  resetLogFeed();
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
    allLogMsgs = msgs.reverse().map(m => ({ ...m, _deleted: false }));
    selectedLogs.clear();
    updateLogActionBar();
    applyLogFilter();
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
    allLogMsgs = (res.messages || []).slice(-100);
    selectedLogs.clear();
    updateLogActionBar();
    applyLogFilter();
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
      <input type="checkbox" class="msg-check" data-msgid="${m.id}" ${selectedLogs.has(m.id) ? 'checked' : ''}>
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
  feed.querySelectorAll('.msg-check').forEach(el => {
    el.onchange = () => {
      if (el.checked) selectedLogs.add(el.dataset.msgid);
      else selectedLogs.delete(el.dataset.msgid);
      updateLogActionBar();
    };
  });
}

function applyLogFilter() {
  const q = (document.getElementById('log-search')?.value || '').toLowerCase().trim();
  let msgs = allLogMsgs;
  if (q) {
    msgs = msgs.filter(m =>
      (m.content || '').toLowerCase().includes(q) ||
      (m.author?.username || '').toLowerCase().includes(q)
    );
  }
  currentFiltered = msgs;
  renderLogs(msgs);
}

function updateLogActionBar() {
  const bar = document.getElementById('log-action-bar');
  if (!bar) return;
  if (selectedLogs.size > 0) {
    bar.classList.remove('hidden');
    const c = document.getElementById('log-action-count');
    if (c) c.textContent = t('logs.selected_count').replace('{n}', selectedLogs.size);
  } else bar.classList.add('hidden');
}

function exportLogs(fmt) {
  const msgs = currentFiltered;
  if (!msgs.length) { tt(t('logs.no_messages')); return; }
  let blob, filename;
  if (fmt === 'csv') {
    const rows = [['id', 'timestamp', 'author', 'content']];
    msgs.forEach(m => rows.push([m.id, m.timestamp || '', m.author?.username || '', (m.content || '').replace(/\r?\n/g, ' ')]));
    const csv = rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n');
    blob = new Blob([csv], { type: 'text/csv' }); filename = 'archive.csv';
  } else if (fmt === 'html') {
    const html = '<!DOCTYPE html><meta charset="utf-8"><body>' + msgs.map(m =>
      `<div><b>${esc(m.author?.username || '')}</b> <small>${esc(m.timestamp || '')}</small><p>${esc(m.content || '')}</p></div>`
    ).join('') + '</body>';
    blob = new Blob([html], { type: 'text/html' }); filename = 'archive.html';
  } else {
    blob = new Blob([JSON.stringify(msgs, null, 2)], { type: 'application/json' }); filename = 'archive.json';
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

async function bulkDeleteSelected() {
  if (!selectedLogs.size || !logChannel || !logToken) return;
  const old = selToken; selToken = logToken;
  const cutoff = Date.now() - 14 * 24 * 3600 * 1000;
  const young = [], oldIds = [];
  for (const m of allLogMsgs) {
    if (!selectedLogs.has(m.id)) continue;
    if (new Date(m.timestamp).getTime() > cutoff) young.push(m.id);
    else oldIds.push(m.id);
  }
  try {
    for (let i = 0; i < young.length; i += 100) {
      const batch = young.slice(i, i + 100);
      await api(`/channels/${logChannel}/messages/bulk-delete`, { method: 'POST', body: JSON.stringify({ messages: batch }) });
      await new Promise(r => setTimeout(r, 1200));
    }
    for (const id of oldIds) {
      try { await api(`/channels/${logChannel}/messages/${id}`, { method: 'DELETE' }); await new Promise(r => setTimeout(r, 400)); } catch {}
    }
    tt(t('logs.bulk_deleted'));
    selectedLogs.clear();
    updateLogActionBar();
    document.getElementById('fetch-logs-btn').click();
  } catch (e) { tt(friendlyError(e.message, 'delete')); }
  finally { selToken = old; }
}

function wireLogToolbar() {
  document.getElementById('log-search').addEventListener('input', applyLogFilter);
  document.getElementById('log-export-json').onclick = () => exportLogs('json');
  document.getElementById('log-export-csv').onclick = () => exportLogs('csv');
  document.getElementById('log-export-html').onclick = () => exportLogs('html');
  document.getElementById('log-bulk-delete').onclick = () => {
    showConfirmModal(t('logs.bulk_delete'), t('logs.bulk_confirm'), bulkDeleteSelected);
  };
  document.getElementById('log-copy-selected').onclick = () => {
    const texts = allLogMsgs.filter(m => selectedLogs.has(m.id)).map(m => m.content || '');
    navigator.clipboard.writeText(texts.join('\n'));
    tt(t('common.copied'));
  };
  document.getElementById('log-export-selected').onclick = () => {
    const sel = allLogMsgs.filter(m => selectedLogs.has(m.id));
    if (!sel.length) return;
    const blob = new Blob([JSON.stringify(sel, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'selected-messages.json'; a.click();
    URL.revokeObjectURL(url);
  };
  document.getElementById('log-clear-selection').onclick = () => {
    selectedLogs.clear();
    updateLogActionBar();
    applyLogFilter();
  };
}
wireLogToolbar();
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
function renderRolesManage(uid, member, roles, gid) {
  const listEl = document.getElementById('profile-roles-list');
  const manageEl = listEl ? listEl.closest('.profile-roles-manage') : null;
  const errEl = document.getElementById('role-error');
  if (!listEl || !manageEl || !errEl) return;
  errEl.classList.add('hidden');

  // without the member record we cannot know the current roles, so editing
  // would risk replacing them all: show nothing instead
  if (!gid || !member || !Array.isArray(member.roles) || !roles || !roles.length) {
    manageEl.classList.add('hidden');
    listEl.innerHTML = '';
    return;
  }

  const manageable = roles
    .filter(r => r.id !== gid && r.name !== '@everyone' && !r.managed)
    .sort((a, b) => (b.position || 0) - (a.position || 0));
  if (!manageable.length) {
    manageEl.classList.add('hidden');
    listEl.innerHTML = '';
    return;
  }

  manageEl.classList.remove('hidden');
  listEl.innerHTML = manageable.map(r => {
    const hasRole = member.roles.includes(r.id);
    const color = r.color ? '#' + r.color.toString(16).padStart(6, '0') : 'var(--text-muted)';
    return `<label class="check-row" style="margin-bottom:4px; padding:6px 10px;">
      <input type="checkbox" class="role-toggle" data-roleid="${r.id}" ${hasRole ? 'checked' : ''}>
      <span class="role-badge" style="border-color:${color};color:${color}">${esc(r.name)}</span>
    </label>`;
  }).join('');

  listEl.querySelectorAll('.role-toggle').forEach(cb => {
    cb.onchange = async () => {
      const roleId = cb.dataset.roleid;
      const currentRoles = [...member.roles];
      const newRoles = cb.checked
        ? [...currentRoles, roleId]
        : currentRoles.filter(r => r !== roleId);
      errEl.classList.add('hidden');
      cb.disabled = true;
      const old = selToken;
      selToken = logToken;
      try {
        await api(`/guilds/${gid}/members/${uid}`, {
          method: 'PATCH',
          body: JSON.stringify({ roles: newRoles })
        });
        member.roles = newRoles;
        tt(t('profile.roles_updated'));
      } catch (e) {
        cb.checked = !cb.checked; // revert
        errEl.textContent = friendlyError(e.message, 'roles');
        errEl.classList.remove('hidden');
      } finally {
        selToken = old;
        cb.disabled = false;
      }
    };
  });
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
        const color = r.color ? '#' + r.color.toString(16).padStart(6, '0') : 'var(--text-muted)';
        return `<span class="role-badge" style="border-color:${color};color:${color}">${esc(r.name)}</span>`;
      }).join('');
    }
  }

  const avatarUrl = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${uid}/${user.avatar}.png?size=128`
    : `https://cdn.discordapp.com/embed/avatars/${(BigInt(uid) >> 22n) % 6n}.png`;

  let bannerHtml = '';
  if (user?.banner) {
    bannerHtml = `<div class="profile-banner" style="background-image:url(https://cdn.discordapp.com/banners/${uid}/${user.banner}.png?size=512)"></div>`;
  } else if (user?.accent_color != null) {
    bannerHtml = `<div class="profile-banner" style="background:#${user.accent_color.toString(16).padStart(6, '0')}"></div>`;
  } else {
    bannerHtml = `<div class="profile-banner"></div>`;
  }

  container.innerHTML = `
    ${bannerHtml}
    <div class="profile-body">
      <div class="profile-header">
        <img src="${avatarUrl}" class="profile-avatar" onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
        <div class="profile-header-info">
          <div class="profile-name">${esc(displayName)}</div>
          <div class="profile-tag">@${esc(username)}</div>
          ${nick ? `<div class="profile-nick">${esc(t('profile.nick'))}: ${esc(nick)}</div>` : ''}
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
      <div class="profile-id-section">
        <div class="label">${esc(t('modal.user_id'))}</div>
        <div class="id-row">
          <code>${esc(uid)}</code>
          <button class="btn btn-ghost btn-small" id="copy-uid-inline" data-uid="${esc(uid)}">${esc(t('modal.copy'))}</button>
        </div>
      </div>
      <div class="profile-bio-note">${esc(t('profile.bio_note'))}</div>
    </div>
  `;

  const copyBtn = container.querySelector('#copy-uid-inline');
  if (copyBtn) {
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(copyBtn.dataset.uid);
      tt(t('common.copied'));
    };
  }
}

function showView(view) {
  for (const v of ['profile', 'nick', 'timeout']) {
    const el = document.getElementById('modal-view-' + v);
    if (el) el.classList.toggle('hidden', v !== view);
  }
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
    details.innerHTML = '<div style="padding:24px" class="muted small">' + esc(t('common.loading')) + '</div>';

    let member = null;
    try { member = await fetchMember(gid, uid, logToken); } catch {}
    let user = null;
    try { user = await fetchUser(uid, logToken); } catch {}
    let roles = [];
    try { roles = await fetchGuildRoles(gid, logToken); } catch {}

    renderProfileDetails(details, uid, user, member, roles, gid);
    renderRolesManage(uid, member, roles, gid);
  } catch (e) {
    const details = document.getElementById('profile-details');
    if (details) {
      details.innerHTML = '<div style="padding:24px" class="muted small">' + esc(t('common.error')) + ': ' + esc(e.message) + '</div>';
    } else {
      tt(e.message);
    }
  }
}

document.getElementById('close-modal').onclick = () => document.getElementById('user-modal').classList.add('hidden');
document.getElementById('user-modal').onclick = (e) => {
  if (e.target === e.currentTarget) e.currentTarget.classList.add('hidden');
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
  refreshRateLimits();
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

/* ===== rate limit monitor ===== */
async function refreshRateLimits() {
  const el = document.getElementById('rate-limits-list');
  if (!el) return;
  try {
    const res = await gatewayGet('/rate-limits');
    const limits = res.limits || [];
    if (!limits.length) {
      el.innerHTML = '<span class="muted small">' + esc(t('presence.no_rate_limits')) + '</span>';
      return;
    }
    const now = Date.now() / 1000;
    el.innerHTML = limits.slice(0, 10).map(l => {
      const remaining = l.remaining;
      const resetIn = Math.max(0, (l.reset || 0) - now);
      const hot = remaining <= 2;
      return `
        <div class="session-item">
          <div class="dot ${hot ? 'dot-ko' : 'dot-ok'}"></div>
          <div style="flex:1;min-width:0">
            <div class="bold small" style="font-size:12px">${esc(String(l.bucket).slice(0, 40))}${l.bucket.length > 40 ? '…' : ''}</div>
            <div class="muted small"${hot ? ' style="color:var(--danger)"' : ''}>${remaining}/${l.limit || '?'} · reset ${resetIn.toFixed(1)}s</div>
          </div>
        </div>
      `;
    }).join('');
  } catch (e) {
    el.innerHTML = '<span class="muted small">' + esc(t('common.error')) + ': ' + esc(e.message) + '</span>';
  }
}

// keep the monitor fresh while the presence tab is open
setInterval(() => {
  const p = document.getElementById('presence');
  if (p && !p.classList.contains('hidden')) refreshRateLimits();
}, 5000);

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
    auto_leave_seconds: parseInt(document.getElementById('voice-auto-leave')?.value) || 0,
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
    updateVoiceMembers();
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
  updateVoiceMembers();
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
  updateVoiceMembers();
}

/* ===== voice moderation ===== */
const voiceUserCache = {};
async function updateVoiceMembers() {
  const list = document.getElementById('voice-members-list');
  if (!list) return;
  const botUserId = (voiceBot && voiceToken) ? clientIdFromToken(voiceToken) : null;
  if (!voiceBot || !voiceGuild) {
    list.innerHTML = `<span class="muted small">${esc(t('voice.no_members'))}</span>`;
    return;
  }
  let states = null;
  // REST first (works even before the gateway cache fills up), then the
  // bridge cache as fallback
  const oldTok = selToken;
  try {
    selToken = voiceToken;
    states = await api('/guilds/' + voiceGuild + '/voice-states');
  } catch {
    try {
      const res = await gatewayGet('/' + voiceBot.id + '/voice/states');
      states = res.states || [];
    } catch {}
  } finally {
    selToken = oldTok;
  }
  const members = (states || []).filter(s => s.channel_id && s.user_id !== botUserId);
  // prefer the members actually in the channel selected in the dropdown
  const inChannel = voiceChannel ? members.filter(s => s.channel_id === voiceChannel) : [];
  const shown = inChannel.length ? inChannel : members;

  if (!shown.length) {
    list.innerHTML = `<span class="muted small">${esc(t('voice.no_members'))}</span>`;
    return;
  }

  // resolve usernames once per user; fall back to the raw id
  const oldTok2 = selToken;
  for (const s of shown) {
    if (!voiceUserCache[s.user_id]) {
      try {
        selToken = voiceToken;
        const u = await fetchUser(s.user_id, voiceToken);
        voiceUserCache[s.user_id] = u.global_name || u.username || s.user_id;
      } catch {
        voiceUserCache[s.user_id] = s.user_id;
      }
    }
  }
  selToken = oldTok2;

  list.innerHTML = shown.map(s => {
    const name = voiceUserCache[s.user_id] || s.user_id;
    const flags = [s.mute ? 'mute' : '', s.deaf ? 'deaf' : '', s.self_mute ? 'self-mute' : '', s.self_deaf ? 'self-deaf' : ''].filter(Boolean).join(' · ');
    return `<div class="session-item" data-uid="${esc(s.user_id)}">
      <div class="dot ${s.self_deaf || s.deaf ? 'dot-ko' : 'dot-ok'}"></div>
      <div style="flex:1;min-width:0">
        <div class="bold small">${esc(name)}</div>
        ${flags ? `<div class="muted small">${esc(flags)}</div>` : ''}
      </div>
      <button class="btn btn-ghost btn-small v-mute" data-uid="${esc(s.user_id)}" data-state="${s.mute ? '0' : '1'}">${esc(s.mute ? t('voice.unmute') : t('voice.mute'))}</button>
      <button class="btn btn-ghost btn-small v-deaf" data-uid="${esc(s.user_id)}" data-state="${s.deaf ? '0' : '1'}">${esc(s.deaf ? t('voice.undeafen') : t('voice.deafen'))}</button>
      <button class="btn btn-danger btn-small v-disconnect" data-uid="${esc(s.user_id)}">${esc(t('voice.disconnect'))}</button>
    </div>`;
  }).join('');

  list.querySelectorAll('.v-mute, .v-deaf, .v-disconnect').forEach(btn => {
    btn.onclick = async () => {
      const uid = btn.dataset.uid;
      const payload = {};
      if (btn.classList.contains('v-disconnect')) payload.channel_id = null;
      else if (btn.classList.contains('v-mute')) payload.mute = btn.dataset.state === '1';
      else if (btn.classList.contains('v-deaf')) payload.deaf = btn.dataset.state === '1';
      btn.disabled = true;
      const old = selToken;
      selToken = voiceToken;
      try {
        await api(`/guilds/${voiceGuild}/members/${uid}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });
        tt(t('voice.member_updated'));
        setTimeout(updateVoiceMembers, 600);
      } catch (e) {
        tt(friendlyError(e.message, 'voice_mod'));
      } finally {
        selToken = old;
        btn.disabled = false;
      }
    };
  });
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

/* ===== channels tab ===== */
let channelsBot = null;
let channelsToken = null;
let channelsGuild = null;

const channelsBotSel = document.getElementById('channels-bot-select');
const channelsGs = document.getElementById('channels-guild-select');

function populateChannelsBotSelect() {
  if (!channelsBotSel) return;
  const cur = channelsBotSel.value;
  channelsBotSel.innerHTML = '';
  setPlaceholderOption(channelsBotSel, 'select.bot');
  if (V) {
    V.bots.forEach(b => {
      const o = document.createElement('option');
      o.value = b.id;
      o.textContent = b.name;
      channelsBotSel.appendChild(o);
    });
  }
  if (cur) channelsBotSel.value = cur;
  translateSelectOptions(channelsBotSel);
}

channelsBotSel.onchange = async () => {
  const id = channelsBotSel.value;
  channelsBot = V.bots.find(b => b.id === id) || null;
  channelsToken = channelsBot ? await db(channelsBot, K) : null;
  channelsGs.disabled = true;
  setPlaceholderOption(channelsGs, 'select.bot_first');
  document.getElementById('channels-list').innerHTML = '<span class="muted small">' + esc(t('channels.no_channels')) + '</span>';
  if (channelsToken) loadChannelsGuilds();
};

async function loadChannelsGuilds() {
  channelsGs.disabled = false;
  setPlaceholderOption(channelsGs, 'select.loading');
  try {
    const old = selToken;
    selToken = channelsToken;
    const g = await api('/users/@me/guilds');
    selToken = old;
    channelsGs.innerHTML = '';
    setPlaceholderOption(channelsGs, 'select.choose_server');
    g.forEach(x => {
      const o = document.createElement('option');
      o.value = x.id;
      o.textContent = x.name;
      channelsGs.appendChild(o);
    });
    translateSelectOptions(channelsGs);
  } catch (e) {
    setPlaceholderOption(channelsGs, 'select.error');
    tt(e.message);
  }
}

channelsGs.onchange = async () => {
  channelsGuild = channelsGs.value;
  if (channelsGuild) await loadChannelsList();
};

const CHANNEL_TYPE_ICONS = { 2: '🔊', 4: '📁', 5: '📢', 13: '🔊', 15: '💬' };

async function loadChannelsList() {
  const list = document.getElementById('channels-list');
  const err = document.getElementById('channels-error');
  if (!list) return;
  if (err) err.classList.add('hidden');
  if (!channelsGuild || !channelsToken) {
    list.innerHTML = '<span class="muted small">' + esc(t('channels.no_channels')) + '</span>';
    return;
  }
  list.innerHTML = '<span class="muted small">' + esc(t('common.loading')) + '</span>';
  const old = selToken;
  selToken = channelsToken;
  try {
    const channels = await api('/guilds/' + channelsGuild + '/channels');
    const sorted = [...channels].sort((a, b) =>
      (a.raw_position || 0) - (b.raw_position || 0) || (a.type || 0) - (b.type || 0)
    );
    if (!sorted.length) {
      list.innerHTML = '<span class="muted small">' + esc(t('channels.no_channels')) + '</span>';
      return;
    }
    list.innerHTML = sorted.map(c => {
      const icon = CHANNEL_TYPE_ICONS[c.type] || '#';
      const cat = c.parent_id ? sorted.find(x => x.id === c.parent_id) : null;
      return `
        <div class="session-item">
          <div style="flex:1;min-width:0">
            <div class="bold small">${icon} ${esc(c.name)}${cat ? ` <span class="muted small">(${esc(cat.name)})</span>` : ''}</div>
            <div class="muted small mono" style="font-size:11px">${esc(c.id)} · type ${c.type}${c.nsfw ? ' · nsfw' : ''}</div>
          </div>
          <button class="btn btn-ghost btn-small ch-backup" data-id="${c.id}">${esc(t('channels.backup'))}</button>
          <button class="btn btn-ghost btn-small ch-clone" data-id="${c.id}">${esc(t('channels.clone'))}</button>
          <button class="btn btn-danger btn-small ch-delete" data-id="${c.id}">${esc(t('channels.delete'))}</button>
        </div>
      `;
    }).join('');

    list.querySelectorAll('.ch-backup').forEach(btn => {
      btn.onclick = async () => {
        const id = btn.dataset.id;
        btn.disabled = true;
        btn.textContent = t('channels.backing_up');
        try {
          const res = await gateway('/backup/channel/' + id, { token: channelsToken });
          tt(t('channels.backup_complete').replace('{count}', res.messageCount));
        } catch (e) {
          tt(e.message);
        } finally {
          btn.disabled = false;
          btn.textContent = t('channels.backup');
        }
      };
    });

    list.querySelectorAll('.ch-clone').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        showConfirmModal(t('channels.clone_title'), t('channels.clone_confirm'), async () => {
          btn.disabled = true;
          btn.textContent = t('channels.cloning');
          try {
            const orig = await api('/channels/' + id);
            const payload = {
              name: orig.name + '-copy',
              type: orig.type,
              topic: orig.topic || '',
              nsfw: orig.nsfw || false,
              rate_limit_per_user: orig.rate_limit_per_user || 0,
              parent_id: orig.parent_id || null,
              permission_overwrites: orig.permission_overwrites || []
            };
            if (orig.bitrate) payload.bitrate = orig.bitrate;
            if (orig.user_limit) payload.user_limit = orig.user_limit;
            const newCh = await api('/guilds/' + channelsGuild + '/channels', {
              method: 'POST',
              body: JSON.stringify(payload)
            });
            tt(t('channels.cloned') + ': ' + newCh.name);
            await loadChannelsList();
          } catch (e) {
            tt(friendlyError(e.message, 'clone'));
          } finally {
            btn.disabled = false;
            btn.textContent = t('channels.clone');
          }
        });
      };
    });

    list.querySelectorAll('.ch-delete').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        showConfirmModal(t('channels.delete_title'), t('channels.delete_confirm'), async () => {
          btn.disabled = true;
          btn.textContent = t('channels.deleting');
          try {
            await api('/channels/' + id, { method: 'DELETE' });
            tt(t('channels.deleted'));
            await loadChannelsList();
          } catch (e) {
            tt(friendlyError(e.message, 'delete'));
          } finally {
            btn.disabled = false;
            btn.textContent = t('channels.delete');
          }
        });
      };
    });
  } catch (e) {
    list.innerHTML = '<span class="muted small">' + esc(t('common.error')) + ': ' + esc(e.message) + '</span>';
  } finally {
    selToken = old;
  }
}

document.getElementById('channels-refresh').onclick = () => loadChannelsList();

/* ===== bot selects helper ===== */
function populateAllBotSelects() {
  populateBotSelect();
  populateLogBotSelect();
  populatePresenceBotSelect();
  populateVoiceBotSelect();
  populateCleanBotSelect();
  populateChannelsBotSelect();
}

/* ===== init ===== */
const storedVault = lv();
if (storedVault) {
  V = storedVault;
}

initI18n()
  .then(() => {
    initAllDropdowns();
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
  refreshTemplateSelect();
}

/* ===== template messaggi (send tab) ===== */
function getTemplates() { try { return JSON.parse(safeGetItem('tpl') || '[]'); } catch { return []; } }
function saveTemplates(x) { safeSetItem('tpl', JSON.stringify(x)); }

function captureSendState() {
  const g = id => document.getElementById(id).value;
  const fields = [];
  document.querySelectorAll('#e-fields .efield').forEach(f => {
    fields.push({
      name: f.querySelector('.ef-n').value,
      value: f.querySelector('.ef-v').value,
      inline: f.querySelector('.ef-i').checked
    });
  });
  return {
    content: ta.value,
    embedOn: document.getElementById('embed-on').checked,
    embed: {
      title: g('e-title'), url: g('e-url'), desc: g('e-desc'), color: g('e-color'),
      aname: g('e-aname'), aicon: g('e-aicon'), img: g('e-img'), thumb: g('e-thumb'),
      footer: g('e-footer'), ficon: g('e-ficon'), ts: g('e-ts'), fields
    }
  };
}

function applySendState(s) {
  ta.value = s.content || '';
  updatePreview();
  const em = s.embed || {};
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
  set('e-title', em.title); set('e-url', em.url); set('e-desc', em.desc);
  if (em.color) set('e-color', em.color);
  set('e-aname', em.aname); set('e-aicon', em.aicon); set('e-img', em.img);
  set('e-thumb', em.thumb); set('e-footer', em.footer); set('e-ficon', em.ficon);
  const ts = document.getElementById('e-ts');
  if (ts) {
    ts.value = em.ts || '';
    ts.dispatchEvent(new Event('change')); // keeps the custom dropdown label in sync
  }
  document.getElementById('e-fields').innerHTML = '';
  (em.fields || []).forEach(f => {
    addFieldRow();
    const rows = document.querySelectorAll('#e-fields .efield');
    const row = rows[rows.length - 1];
    row.querySelector('.ef-n').value = f.name || '';
    row.querySelector('.ef-v').value = f.value || '';
    row.querySelector('.ef-i').checked = !!f.inline;
  });
  const embedOn = document.getElementById('embed-on');
  if (embedOn.checked !== !!s.embedOn) {
    embedOn.checked = !!s.embedOn;
    embedOn.dispatchEvent(new Event('change'));
  }
  updatePreview();
}

function refreshTemplateSelect() {
  const sel = document.getElementById('tpl-select');
  if (!sel) return;
  const tpls = getTemplates();
  sel.innerHTML = '';
  setPlaceholderOption(sel, 'send.template_choose');
  tpls.forEach((x, i) => {
    const o = document.createElement('option');
    o.value = i;
    o.textContent = x.name;
    sel.appendChild(o);
  });
}

document.getElementById('tpl-save').onclick = () => {
  const nameEl = document.getElementById('tpl-name');
  const name = nameEl.value.trim();
  if (!name) { tt(t('send.template_need_name')); return; }
  const tpls = getTemplates();
  tpls.push({ name, state: captureSendState() });
  saveTemplates(tpls);
  nameEl.value = '';
  refreshTemplateSelect();
  tt(t('send.template_saved'));
};
document.getElementById('tpl-load').onclick = () => {
  const i = document.getElementById('tpl-select').value;
  const tpls = getTemplates();
  if (i === '' || !tpls[i]) return;
  applySendState(tpls[i].state);
  tt(t('send.template_loaded'));
};
document.getElementById('tpl-delete').onclick = () => {
  const i = document.getElementById('tpl-select').value;
  const tpls = getTemplates();
  if (i === '' || !tpls[i]) return;
  showConfirmModal(t('send.template_delete'), t('send.template_confirm_delete').replace('{name}', tpls[i].name), () => {
    tpls.splice(i, 1);
    saveTemplates(tpls);
    refreshTemplateSelect();
    tt(t('send.template_deleted'));
  });
};

/* ===== export / import vault ===== */
function exportVault() {
  if (!V) { tt(t('common.error')); return; }
  const blob = new Blob([JSON.stringify(V, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'vault-backup-' + new Date().toISOString().slice(0, 10) + '.json';
  a.click();
  URL.revokeObjectURL(url);
  tt(t('settings.vault_exported'));
}

let pendingImport = null;
document.getElementById('vault-export').onclick = exportVault;
document.getElementById('vault-import').onclick = () => document.getElementById('vault-import-file').click();
document.getElementById('vault-import-file').onchange = async (e) => {
  const f = e.target.files[0];
  if (!f) return;
  try {
    const parsed = JSON.parse(await f.text());
    if (!parsed || !parsed.kdf || !parsed.verifier || !Array.isArray(parsed.bots)) throw new Error('bad');
    pendingImport = parsed;
    document.getElementById('iv-pw').value = '';
    document.getElementById('iv-error').classList.add('hidden');
    document.getElementById('import-vault-modal').classList.remove('hidden');
  } catch {
    tt(t('settings.vault_import_invalid'));
  }
  e.target.value = '';
};

async function doImport(mode) {
  if (!pendingImport || !K) { tt(t('common.error')); return; }
  const pw = document.getElementById('iv-pw').value;
  const err = document.getElementById('iv-error');
  err.classList.add('hidden');
  const busy = mode === 'replace' ? document.getElementById('iv-replace') : document.getElementById('iv-merge');
  busy.disabled = true;
  try {
    const importedKey = await unl(pendingImport, pw);
    const recs = [];
    for (const b of pendingImport.bots) {
      const token = await db(b, importedKey);
      recs.push(await eb(b.name, token, K));
    }
    if (mode === 'replace') {
      V.bots = recs;
    } else {
      const names = new Set(V.bots.map(b => b.name));
      for (const r of recs) if (!names.has(r.name)) V.bots.push(r);
    }
    sv();
    rb();
    document.getElementById('import-vault-modal').classList.add('hidden');
    tt(mode === 'replace' ? t('settings.vault_replaced') : t('settings.vault_merged'));
  } catch {
    err.textContent = t('settings.vault_import_pw_wrong');
    err.classList.remove('hidden');
  } finally {
    busy.disabled = false;
  }
}
document.getElementById('iv-merge').onclick = () => doImport('merge');
document.getElementById('iv-replace').onclick = () => doImport('replace');
document.getElementById('iv-cancel').onclick = () => document.getElementById('import-vault-modal').classList.add('hidden');
document.getElementById('iv-close').onclick = () => document.getElementById('import-vault-modal').classList.add('hidden');
document.getElementById('import-vault-modal').onclick = (e) => {
  if (e.target === e.currentTarget) e.currentTarget.classList.add('hidden');
};