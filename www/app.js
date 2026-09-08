document.documentElement.classList.add('i18n-loading');
import { configureRuntime, executeScript, clearConsole, isRunning } from './runtime.js';
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
  clock: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>',
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
// per-boot bridge secret injected into index.html; required by every
// /gateway/* and /discord/* call, never visible to user-script workers
const BRIDGE_NONCE = (document.querySelector('meta[name="x-bridge-nonce"]') || {}).getAttribute ? document.querySelector('meta[name="x-bridge-nonce"]').getAttribute('content') : null;
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
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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
let giOnClose = null;
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
  if (giOnClose) { const f = giOnClose; giOnClose = null; f(); }
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
// promise wrapper around the shared input modal (closeInputModal runs after
// the callback, so nested callers must defer — hence setTimeout(…, 0))
function promptInput(title, desc, placeholder, initial = '') {
  return new Promise((resolve) => {
    setTimeout(() => {
      giOnClose = () => resolve(null);
      showInputModal(title, desc, placeholder, (v) => resolve(String(v == null ? '' : v).trim()));
      const inp = document.getElementById('gi-input');
      inp.value = initial;
      inp.focus();
    }, 0);
  });
}
// context menu opened by a ⋯ button; closes on any click outside or scroll
function openCtxMenu(anchorBtn, items) {
  closeCtxMenu();
  const menu = document.createElement('div');
  menu.className = 'ctx-menu';
  for (const it of items) {
    const b = document.createElement('button');
    b.type = 'button';
    if (it.danger) b.classList.add('danger');
    b.textContent = it.label;
    b.onclick = (e) => { e.stopPropagation(); closeCtxMenu(); it.action(); };
    menu.appendChild(b);
  }
  document.body.appendChild(menu);
  const r = anchorBtn.getBoundingClientRect();
  const mw = menu.offsetWidth, mh = menu.offsetHeight;
  let left = Math.min(r.left, window.innerWidth - mw - 8);
  let top = r.bottom + 4;
  if (top + mh > window.innerHeight - 8) top = Math.max(8, r.top - mh - 4);
  menu.style.left = Math.max(8, left) + 'px';
  menu.style.top = top + 'px';
}
function closeCtxMenu() {
  const existing = document.querySelector('.ctx-menu');
  if (existing) existing.remove();
}
// single persistent outside-click handler: clicks inside the menu or on a
// trigger button never close it (menu items close themselves)
function ctxMenuOutside(e) {
  if (e.target && e.target.closest && e.target.closest('.ctx-menu, .ctx-menu-trigger')) return;
  closeCtxMenu();
}
document.addEventListener('click', ctxMenuOutside, true);
document.addEventListener('touchstart', ctxMenuOutside, true);
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
  scheduler: 'scheduler',
  members: 'members',
  scripts: 'scripts',
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
  if (tab === 'scheduler') loadJobs();
  if (tab === 'members') refreshMembersCount();
  if (tab === 'scripts') loadScripts();
  if (tab === 'settings') loadScriptPermissions();
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
    headers: { 'X-Bot-Token': tok, 'X-Client-Nonce': BRIDGE_NONCE, 'Content-Type': 'application/json' },
    body: opts.body,
  });
  if (!r.ok) {
    let msg = 'HTTP ' + r.status;
    try {
      const j = await r.json();
      if (j.message) msg = j.message;
      if (j.error) msg = j.error;
    } catch {}
    if (r.status === 403 && String(msg).includes('nonce')) {
      handleStalePage();
      throw new Error(t('errors.stale_page'));
    }
    throw new Error(msg);
  }
  return r.status === 204 ? null : r.json();
}
// a bridge restart rotates the per-boot nonce: from that moment every
// authenticated call 403s. detect the stale page once, warn, then reload so
// the fresh nonce injected into index.html takes over automatically
let stalePageReloading = false;
function handleStalePage() {
  if (stalePageReloading) return;
  stalePageReloading = true;
  fetch('/', { cache: 'no-store' })
    .then(r => {
      if (r.ok) {
        try { tt(t('errors.stale_page')); } catch {}
        setTimeout(() => location.reload(), 1200);
      } else {
        stalePageReloading = false;
      }
    })
    .catch(() => { stalePageReloading = false; });
}
async function apiUpload(path, fd, token) {
  const r = await fetch(API + path, {
    method: 'POST',
    headers: { 'X-Bot-Token': token, 'X-Client-Nonce': BRIDGE_NONCE },
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
    headers: { 'X-Client-Nonce': BRIDGE_NONCE, 'Content-Type': 'application/json' },
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
  const r = await fetch(GATEWAY + path, { headers: { 'X-Client-Nonce': BRIDGE_NONCE } });
  if (!r.ok) {
    let msg = 'HTTP ' + r.status;
    try { const j = await r.json(); if (j.error) msg = j.error; } catch {}
    if (r.status === 403 && String(msg).includes('nonce')) {
      handleStalePage();
      throw new Error(t('errors.stale_page'));
    }
    throw new Error(msg);
  }
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
      if (componentsOn && componentsOn.checked) {
        payload.components = buildComponentsPayload();
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
  if (!isVoice && !payload.content && !payload.embeds && !(payload.components && payload.components.length) && !fileToSend) {
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
        headers: { 'X-Client-Nonce': BRIDGE_NONCE, 'Content-Type': 'application/json' },
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

/* ===== interactive components builder (send tab) ===== */
const COMP_STYLES = [['primary', 'send.components_style_primary'], ['secondary', 'send.components_style_secondary'], ['success', 'send.components_style_success'], ['danger', 'send.components_style_danger'], ['link', 'send.components_style_link']];
let compRows = []; // [{type:'buttons', buttons:[{label,style,custom_id,url,emoji,disabled}]}, {type:'select', custom_id, placeholder, options:[{label,value,description,emoji,default}]}]

const componentsOn = document.getElementById('components-on');
const componentsBuilder = document.getElementById('components-builder');
if (componentsOn) componentsOn.addEventListener('change', () => {
  componentsBuilder.classList.toggle('hidden', !componentsOn.checked);
  renderComponentsBuilder();
});
const compAddRow = document.getElementById('comp-add-row');
if (compAddRow) compAddRow.onclick = () => {
  compRows.push({ type: 'buttons', buttons: [] });
  renderComponentsBuilder();
};

function renderComponentsBuilder() {
  if (!componentsBuilder) return;
  if (!compRows.length) {
    componentsBuilder.innerHTML = `<span class="muted small">${esc(t('send.components_empty'))}</span>`;
    return;
  }
  componentsBuilder.innerHTML = compRows.map((row, ri) => {
    const head = `
      <div class="comp-row-head">
        <span class="muted small">${esc(t('send.components_row').replace('{n}', ri + 1))}</span>
        <select data-ri="${ri}" data-act="type">
          <option value="buttons"${row.type === 'buttons' ? ' selected' : ''}>${esc(t('send.components_type_buttons'))}</option>
          <option value="select"${row.type === 'select' ? ' selected' : ''}>${esc(t('send.components_type_select'))}</option>
        </select>
        <button class="btn btn-ghost btn-small" data-ri="${ri}" data-act="del-row">${esc(t('send.components_remove'))}</button>
      </div>`;
    let body = '';
    if (row.type === 'buttons') {
      body = row.buttons.map((b, bi) => `
        <div class="comp-item">
          <div class="comp-grid">
            <label>${esc(t('send.components_label'))}<input type="text" maxlength="80" data-ri="${ri}" data-bi="${bi}" data-field="label" value="${esc(b.label)}"></label>
            <label>${esc(t('send.components_style'))}<select data-ri="${ri}" data-bi="${bi}" data-field="style">${COMP_STYLES.map(([v, k]) => `<option value="${v}"${b.style === v ? ' selected' : ''}>${esc(t(k))}</option>`).join('')}</select></label>
            ${b.style === 'link'
              ? `<label class="comp-full">${esc(t('send.components_url'))}<input type="text" placeholder="https://" data-ri="${ri}" data-bi="${bi}" data-field="url" value="${esc(b.url)}"></label>`
              : `<label class="comp-full">${esc(t('send.components_id'))}<input type="text" maxlength="100" data-ri="${ri}" data-bi="${bi}" data-field="custom_id" value="${esc(b.custom_id)}"></label>`}
            <label>${esc(t('send.components_emoji'))}<input type="text" maxlength="32" data-ri="${ri}" data-bi="${bi}" data-field="emoji" value="${esc(b.emoji)}"></label>
            <label style="justify-content:flex-end"><span class="check-row"><input type="checkbox" data-ri="${ri}" data-bi="${bi}" data-field="disabled"${b.disabled ? ' checked' : ''}> ${esc(t('send.components_disabled'))}</span></label>
          </div>
          <div class="btn-row" style="margin-top:6px">
            <button class="btn btn-ghost btn-small" data-ri="${ri}" data-bi="${bi}" data-act="del-btn">${esc(t('send.components_remove'))}</button>
          </div>
        </div>`).join('');
      body += `<div class="btn-row" style="margin-top:6px"><button class="btn btn-ghost btn-small" data-ri="${ri}" data-act="add-btn"${row.buttons.length >= 5 ? ' disabled' : ''}>${esc(t('send.components_add_button'))}</button></div>`;
    } else {
      body = `
        <div class="comp-grid">
          <label>${esc(t('send.components_id'))}<input type="text" maxlength="100" data-ri="${ri}" data-field="custom_id" value="${esc(row.custom_id)}"></label>
          <label>${esc(t('send.components_placeholder'))}<input type="text" maxlength="100" data-ri="${ri}" data-field="placeholder" value="${esc(row.placeholder)}"></label>
        </div>
        ${row.options.map((o, oi) => `
          <div class="comp-item">
            <div class="comp-grid">
              <label>${esc(t('send.components_label'))}<input type="text" maxlength="100" data-ri="${ri}" data-oi="${oi}" data-field="label" value="${esc(o.label)}"></label>
              <label>${esc(t('send.components_value'))}<input type="text" maxlength="100" data-ri="${ri}" data-oi="${oi}" data-field="value" value="${esc(o.value)}"></label>
              <label class="comp-full">${esc(t('send.components_description'))}<input type="text" maxlength="100" data-ri="${ri}" data-oi="${oi}" data-field="description" value="${esc(o.description)}"></label>
              <label>${esc(t('send.components_emoji'))}<input type="text" maxlength="32" data-ri="${ri}" data-oi="${oi}" data-field="emoji" value="${esc(o.emoji)}"></label>
              <label style="justify-content:flex-end"><span class="check-row"><input type="checkbox" data-ri="${ri}" data-oi="${oi}" data-field="default"${o.default ? ' checked' : ''}> ${esc(t('send.components_default'))}</span></label>
            </div>
            <div class="btn-row" style="margin-top:6px">
              <button class="btn btn-ghost btn-small" data-ri="${ri}" data-oi="${oi}" data-act="del-opt">${esc(t('send.components_remove'))}</button>
            </div>
          </div>`).join('')}
        <div class="btn-row" style="margin-top:6px">
          <button class="btn btn-ghost btn-small" data-ri="${ri}" data-act="add-opt"${row.options.length >= 25 ? ' disabled' : ''}>${esc(t('send.components_add_option'))}</button>
        </div>`;
    }
    return `<div class="comp-row">${head}${body}</div>`;
  }).join('');

  componentsBuilder.querySelectorAll('[data-act]').forEach(el => {
    el.addEventListener('click', (e) => {
      if (el.tagName === 'SELECT') return;
      e.preventDefault();
      const ri = +el.dataset.ri;
      const row = compRows[ri];
      if (!row) return;
      switch (el.dataset.act) {
        case 'type': break;
        case 'del-row': compRows.splice(ri, 1); break;
        case 'add-btn': row.buttons.push({ label: '', style: 'primary', custom_id: '', url: '', emoji: '', disabled: false }); break;
        case 'del-btn': row.buttons.splice(+el.dataset.bi, 1); break;
        case 'add-opt': row.options.push({ label: '', value: '', description: '', emoji: '', default: false }); break;
        case 'del-opt': row.options.splice(+el.dataset.oi, 1); break;
      }
      renderComponentsBuilder();
    });
    if (el.tagName === 'SELECT') {
      el.addEventListener('change', () => {
        compRows[+el.dataset.ri].type = el.value;
        renderComponentsBuilder();
      });
    }
  });
  componentsBuilder.querySelectorAll('input[data-field], select[data-field]').forEach(inp => {
    inp.addEventListener('input', () => {
      const row = compRows[+inp.dataset.ri];
      if (!row) return;
      if (inp.dataset.bi !== undefined) {
        const b = row.buttons[+inp.dataset.bi];
        if (!b) return;
        b[inp.dataset.field] = inp.type === 'checkbox' ? inp.checked : inp.value;
        if (inp.dataset.field === 'style') renderComponentsBuilder();
      } else if (inp.dataset.oi !== undefined) {
        const o = row.options[+inp.dataset.oi];
        if (!o) return;
        o[inp.dataset.field] = inp.type === 'checkbox' ? inp.checked : inp.value;
      } else {
        row[inp.dataset.field] = inp.value;
      }
    });
    if (inp.type === 'checkbox') inp.addEventListener('change', () => {
      const row = compRows[+inp.dataset.ri];
      if (!row) return;
      if (inp.dataset.bi !== undefined) { const b = row.buttons[+inp.dataset.bi]; if (b) b[inp.dataset.field] = inp.checked; }
      else if (inp.dataset.oi !== undefined) { const o = row.options[+inp.dataset.oi]; if (o) o[inp.dataset.field] = inp.checked; }
    });
  });
}

// model → discord payload; throws translated errors on invalid structures
function buildComponentsPayload() {
  const rows = [];
  for (const row of compRows) {
    if (rows.length >= 5) throw new Error(t('send.components_too_many_rows'));
    if (row.type === 'buttons') {
      const btns = row.buttons.filter(b => b.label.trim() || b.emoji.trim() || (b.style === 'link' ? b.url.trim() : b.custom_id.trim()));
      if (!btns.length) continue;
      if (btns.length > 5) throw new Error(t('send.components_too_many_buttons'));
      rows.push({ type: 1, components: btns.map(b => {
        const c = { type: 2, style: ({ primary: 1, secondary: 2, success: 3, danger: 4, link: 5 })[b.style] || 1 };
        if (b.label.trim()) c.label = b.label.trim().slice(0, 80);
        if (b.emoji.trim()) c.emoji = { name: b.emoji.trim() };
        if (b.style === 'link') {
          if (!b.url.trim()) throw new Error(t('send.components_link_needs_url'));
          c.url = b.url.trim();
        } else {
          if (!b.custom_id.trim()) throw new Error(t('send.components_needs_id').replace('{label}', c.label || ''));
          c.custom_id = b.custom_id.trim().slice(0, 100);
        }
        if (b.disabled) c.disabled = true;
        return c;
      }) });
    } else {
      const opts = row.options.filter(o => o.label.trim() || o.value.trim());
      if (!opts.length) continue;
      if (opts.length > 25) throw new Error(t('send.components_too_many_options'));
      const sel = {
        type: 3,
        custom_id: (row.custom_id || 'select_' + (rows.length + 1)).trim().slice(0, 100),
        options: opts.map(o => {
          const oc = { label: o.label.trim().slice(0, 100) || ' ', value: o.value.trim().slice(0, 100) || ' ' };
          if (o.description.trim()) oc.description = o.description.trim().slice(0, 100);
          if (o.emoji.trim()) oc.emoji = { name: o.emoji.trim() };
          if (o.default) oc.default = true;
          return oc;
        })
      };
      if (row.placeholder.trim()) sel.placeholder = row.placeholder.trim().slice(0, 100);
      rows.push({ type: 1, components: [sel] });
    }
  }
  return rows;
}


/* ===== interactions panel (send tab) ===== */
const interactionAcked = new Set();
const interactionsList = document.getElementById('interactions-list');

function interactionsEmpty() {
  if (interactionsList) interactionsList.innerHTML = `<span class="muted small">${esc(t('send.interactions_empty'))}</span>`;
}

async function refreshInteractions() {
  if (!interactionsList) return;
  if (!selBot || !selToken) return interactionsEmpty();
  let items = [];
  try {
    const res = await gatewayGet('/interactions/' + selBot.id);
    items = res.interactions || [];
  } catch {
    // no gateway session for this bot is an expected, quiet state
    return interactionsEmpty();
  }
  if (!items.length) return interactionsEmpty();
  interactionsList.innerHTML = items.map(it => {
    const user = it.user ? (it.user.global_name || it.user.username || it.user.id) : t('common.unknown');
    const when = new Date(it.received_at).toLocaleTimeString();
    const done = interactionAcked.has(it.id);
    const vals = it.data && it.data.values && it.data.values.length
      ? `<div class="muted small">${esc(t('send.interactions_values'))}: ${esc(it.data.values.join(', '))}</div>` : '';
    const msg = it.message && it.message.content
      ? `<div class="muted small">${esc(t('send.interactions_msg'))}: ${esc(it.message.content.slice(0, 60))}</div>` : '';
    const cid = it.data && it.data.custom_id ? esc(it.data.custom_id) : '(select)';
    return `<div class="session-item${done ? ' it-done' : ''}">
      <div style="flex:1;min-width:0">
        <div class="bold small">${esc(user)} → <span class="mono">${cid}</span></div>
        ${vals}${msg}
        <div class="muted small mono" style="font-size:11px">${esc(when)} · ${esc(it.id)}</div>
      </div>
      <div class="btn-row" style="flex-wrap:wrap;justify-content:flex-end">
        <button class="btn btn-ghost btn-small" data-iid="${esc(it.id)}" data-act="reply">${esc(t('send.interactions_reply'))}</button>
        <button class="btn btn-ghost btn-small" data-iid="${esc(it.id)}" data-act="edit">${esc(t('send.interactions_edit'))}</button>
        <button class="btn btn-ghost btn-small" data-iid="${esc(it.id)}" data-act="ack">${esc(t('send.interactions_ack'))}</button>
        <button class="btn btn-ghost btn-small" data-iid="${esc(it.id)}" data-act="followup">${esc(t('send.interactions_followup'))}</button>
      </div>
    </div>`;
  }).join('');
  interactionsList.querySelectorAll('[data-act]').forEach(btn => {
    btn.onclick = async () => {
      const it = items.find(x => x.id === btn.dataset.iid);
      if (!it) return;
      await respondToInteraction(it, btn.dataset.act);
    };
  });
}

async function respondToInteraction(it, action) {
  if (!selBot) return;
  try {
    if (action === 'ack') {
      await gateway('/interactions/' + selBot.id + '/callback', { id: it.id, token: it.token, type: 6 });
    } else if (action === 'reply') {
      const content = await promptInput(t('send.interactions_reply_title'), t('send.interactions_reply_desc'), '');
      if (!content) return;
      await gateway('/interactions/' + selBot.id + '/callback', { id: it.id, token: it.token, type: 4, data: { content } });
    } else if (action === 'edit') {
      const content = await promptInput(t('send.interactions_edit_title'), t('send.interactions_edit_desc'), it.message ? (it.message.content || '') : '');
      if (!content) return;
      await gateway('/interactions/' + selBot.id + '/callback', { id: it.id, token: it.token, type: 7, data: { content } });
    } else if (action === 'followup') {
      const content = await promptInput(t('send.interactions_followup_title'), t('send.interactions_followup_desc'), '');
      if (!content) return;
      const r = await fetch('/gateway/webhook/' + it.application_id + '/' + it.token + '?wait=true', {
        method: 'POST',
        headers: { 'X-Client-Nonce': BRIDGE_NONCE, 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.message || j.error || ('HTTP ' + r.status));
    }
    interactionAcked.add(it.id);
    tt(t('send.interactions_done'));
    refreshInteractions();
  } catch (e) {
    tt(friendlyError(e.message, 'interaction'));
  }
}

const interactionsRefreshBtn = document.getElementById('interactions-refresh');
if (interactionsRefreshBtn) interactionsRefreshBtn.onclick = refreshInteractions;
const interactionsClearBtn = document.getElementById('interactions-clear');
if (interactionsClearBtn) interactionsClearBtn.onclick = async () => {
  if (!selBot) return;
  try {
    await fetch('/gateway/interactions/' + selBot.id, { method: 'DELETE', headers: { 'X-Client-Nonce': BRIDGE_NONCE } });
  } catch {}
  interactionAcked.clear();
  refreshInteractions();
};
// poll while the send tab is visible and a bot is selected
setInterval(() => {
  const panel = document.getElementById('snd');
  if (panel && !panel.classList.contains('hidden') && selBot) refreshInteractions();
}, 3000);
const prevBotOnchange = botSel.onchange;
botSel.onchange = async () => {
  await prevBotOnchange();
  refreshInteractions();
};

/* ===== bridge health chip (header + sidebar) ===== */
function setBridgeChip(state) {
  for (const id of ['bridge-chip', 'bridge-chip-side']) {
    const chip = document.getElementById(id);
    if (!chip) continue;
    chip.dataset.state = state;
    chip.textContent = t('bridge.' + state);
  }
}
// unauthenticated liveness endpoint, works even when the page nonce went
// stale: when the chip flips back to online it also arms the stale-page
// reload, so the UI heals itself after a bridge restart without manual refresh
let bridgeWasDown = false;
setInterval(async () => {
  try {
    const r = await fetch('/bridge/health', { cache: 'no-store' });
    const up = r.ok;
    setBridgeChip(up ? 'online' : 'offline');
    if (up && bridgeWasDown) handleStalePage();
    bridgeWasDown = !up;
  } catch {
    setBridgeChip('offline');
    bridgeWasDown = true;
  }
}, 5000);

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

/* ===== webhook profile editor (GET/PATCH via the bridge proxy) ===== */
let wpWebhook = null;   // { id, token } of the webhook being edited
let wpCurrent = null;   // fetched profile: { id, name, avatar, channel_id, ... }
let wpNewAvatar;        // undefined = unchanged, null = reset, string = data uri
const wpModal = document.getElementById('webhook-profile-modal');
const wpFile = document.getElementById('wp-avatar-file');

function wpShowError(msg) {
  const el = document.getElementById('wp-error');
  if (!el) return;
  if (msg) { el.textContent = msg; el.classList.remove('hidden'); }
  else el.classList.add('hidden');
}

function wpAvatarUrl(av) {
  return av && wpWebhook ? 'https://cdn.discordapp.com/avatars/' + wpWebhook.id + '/' + av + '.png?size=128' : '';
}

// local file → resized data uri (max 1024px); png keeps transparency, jpg for photos
async function resizeImageFile(file, max = 1024) {
  const dataUrl = await new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = () => reject(new Error(t('send.webhook_profile_read_error')));
    fr.readAsDataURL(file);
  });
  const img = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error(t('send.webhook_profile_read_error')));
    i.src = dataUrl;
  });
  let w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
  const scale = Math.min(1, max / Math.max(w || 1, h || 1));
  w = Math.max(1, Math.round((w || 1) * scale));
  h = Math.max(1, Math.round((h || 1) * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);
  const keepAlpha = /image\/(png|webp|gif)/.test(file.type || '');
  const out = keepAlpha ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.92);
  if (out.length > 256 * 1024) { // discord avatar limit: 256 kb
    const smaller = canvas.toDataURL('image/jpeg', 0.8);
    if (smaller.length > 256 * 1024) throw new Error(t('send.webhook_profile_too_big'));
    return smaller;
  }
  return out;
}

function wpRenderPreview() {
  const img = document.getElementById('wp-avatar');
  const empty = document.getElementById('wp-avatar-empty');
  const note = document.getElementById('wp-avatar-note');
  if (!img || !empty) return;
  let av = '';
  if (wpNewAvatar === null) av = '';
  else if (typeof wpNewAvatar === 'string') av = wpNewAvatar;
  else av = wpAvatarUrl(wpCurrent && wpCurrent.avatar);
  if (av) { img.src = av; img.classList.remove('hidden'); empty.classList.add('hidden'); }
  else { img.removeAttribute('src'); img.classList.add('hidden'); empty.classList.remove('hidden'); }
  const nameInput = document.getElementById('wp-name-input');
  const shown = (nameInput && nameInput.value.trim()) || (wpCurrent && wpCurrent.name) || '—';
  const nameEl = document.getElementById('wp-name');
  if (nameEl) nameEl.textContent = shown;
  if (note) note.textContent = wpNewAvatar === null ? t('send.webhook_profile_will_reset')
    : typeof wpNewAvatar === 'string' ? t('send.webhook_profile_will_change') : '';
}

document.getElementById('webhook-profile-btn').onclick = async () => {
  const id = webhookSel ? webhookSel.value : '';
  const opt = webhookSel && webhookSel.selectedOptions ? webhookSel.selectedOptions[0] : null;
  const tok = opt && opt.dataset.token;
  if (!id || !tok) { tt(t('send.error_no_webhook')); return; }
  wpWebhook = { id, token: tok };
  wpCurrent = null;
  wpNewAvatar = undefined;
  wpShowError('');
  document.getElementById('wp-name-input').value = '';
  document.getElementById('wp-id').textContent = id;
  document.getElementById('wp-channel').textContent = '';
  wpRenderPreview();
  wpModal.classList.remove('hidden');
  try {
    const r = await fetch('/gateway/webhook/' + id + '/' + tok, { headers: { 'X-Client-Nonce': BRIDGE_NONCE } });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || j.message || ('HTTP ' + r.status));
    wpCurrent = j;
    document.getElementById('wp-name-input').value = j.name || '';
    document.getElementById('wp-id').textContent = j.id || id;
    document.getElementById('wp-channel').textContent = j.channel_id ? 'channel ' + j.channel_id : '';
    wpRenderPreview();
  } catch (e) {
    wpModal.classList.add('hidden');
    tt(friendlyError(e.message, 'webhook'));
  }
};

document.getElementById('wp-save').onclick = async () => {
  if (!wpWebhook) return;
  const body = {};
  const name = document.getElementById('wp-name-input').value.trim();
  if (name && wpCurrent && name !== wpCurrent.name) body.name = name;
  if (wpNewAvatar !== undefined) body.avatar = wpNewAvatar;
  if (!Object.keys(body).length) { wpModal.classList.add('hidden'); return; }
  const btn = document.getElementById('wp-save');
  btn.disabled = true;
  wpShowError('');
  try {
    const r = await fetch('/gateway/webhook/' + wpWebhook.id + '/' + wpWebhook.token, {
      method: 'PATCH',
      headers: { 'X-Client-Nonce': BRIDGE_NONCE, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.message || j.error || ('HTTP ' + r.status));
    tt(t('send.webhook_profile_saved'));
    wpModal.classList.add('hidden');
    const chan = getChannelId();
    if (chan) loadWebhooks(chan);
  } catch (e) {
    wpShowError(friendlyError(e.message, 'webhook'));
  } finally { btn.disabled = false; }
};

['wp-close', 'wp-cancel'].forEach(id => {
  const b = document.getElementById(id);
  if (b) b.onclick = () => wpModal.classList.add('hidden');
});
document.getElementById('wp-avatar-pick').onclick = () => wpFile.click();
document.getElementById('wp-avatar-reset').onclick = () => { wpNewAvatar = null; wpRenderPreview(); };
if (wpFile) wpFile.onchange = async () => {
  const f = wpFile.files && wpFile.files[0];
  wpFile.value = '';
  if (!f) return;
  try {
    wpNewAvatar = await resizeImageFile(f, 1024);
    wpRenderPreview();
  } catch (e) {
    wpShowError(e.message);
  }
};
const wpNameInput = document.getElementById('wp-name-input');
if (wpNameInput) wpNameInput.addEventListener('input', wpRenderPreview);


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
// light poll while the voice tab is active so join/leave of other members shows up
setInterval(() => {
  const panel = document.getElementById('voice');
  if (panel && !panel.classList.contains('hidden')) {
    updateVoiceMembers();
  }
}, 5000);
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
let voiceSessionPending = false;
async function updateVoiceStatus() {
  const el = document.getElementById('voice-status');
  if (!el) return;
  // make sure a gateway session exists so GUILD_CREATE seeds the bridge cache
  // and VOICE_STATE_UPDATE deltas arrive; reused if already open
  if (voiceBot && !voiceSessionPending) {
    voiceSessionPending = true;
    gateway('/' + voiceBot.id + '/connect', { token: voiceToken })
      .then(r => { if (r && r.created) setTimeout(updateVoiceMembers, 2500); })
      .catch(() => {})
      .finally(() => { voiceSessionPending = false; });
  }
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
// explicit per-user REST sweep: no guild-level voice-state endpoint exists, so
// each known member is polled individually (cheap on small servers, no
// gateway session required)
async function guildVoiceStatesRest(guildId, token) {
  const ids = await guildMemberIds(guildId, token);
  const results = await Promise.all(ids.map(async (uid) => {
    const old = selToken;
    try {
      selToken = token;
      return await api('/guilds/' + guildId + '/voice-states/' + uid);
    } catch { return null; }
    finally { selToken = old; }
  }));
  return results.filter(Boolean).filter(s => s && s.channel_id);
}
// cached list of member ids of a guild (refreshed every 5 minutes)
const guildMemberIdsCache = new Map();
async function guildMemberIds(guildId, token) {
  const cached = guildMemberIdsCache.get(guildId);
  if (cached && (Date.now() - cached.at) < 300000) return cached.ids;
  const old = selToken;
  try {
    selToken = token;
    const ids = [];
    let url = '/guilds/' + guildId + '/members?limit=1000';
    for (let i = 0; i < 4; i++) {
      const batch = await api(url);
      if (!Array.isArray(batch) || !batch.length) break;
      ids.push(...batch.map(m => m.user && m.user.id).filter(Boolean));
      if (batch.length < 1000) break;
      url = '/guilds/' + guildId + '/members?limit=1000&after=' + ids[ids.length - 1];
    }
    guildMemberIdsCache.set(guildId, { at: Date.now(), ids: [...new Set(ids)] });
    return guildMemberIdsCache.get(guildId).ids;
  } finally { selToken = old; }
}
async function updateVoiceMembers() {
  const list = document.getElementById('voice-members-list');
  if (!list) return;
  const botUserId = (voiceBot && voiceToken) ? clientIdFromToken(voiceToken) : null;
  if (!voiceBot || !voiceGuild) {
    list.innerHTML = `<span class="muted small">${esc(t('voice.no_members'))}</span>`;
    return;
  }
  let states = null;
  // bridge gateway cache first (VOICE_STATE_UPDATE deltas + GUILD_CREATE seed,
  // re-verified against the per-user REST endpoint server-side), then the
  // explicit per-user REST sweep as fallback
  try {
    const res = await gatewayGet('/' + voiceBot.id + '/voice/states?guild_id=' + voiceGuild);
    states = res.states || [];
  } catch {}
  if (!states || !states.length) {
    try {
      const list = await guildVoiceStatesRest(voiceGuild, voiceToken);
      states = list;
    } catch {}
  }
  const members = (states || []).filter(s => s.channel_id && (s.guild_id || voiceGuild) === voiceGuild && s.user_id !== botUserId);
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
let channelsCurrent = [];

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
    channelsCurrent = sorted;
    list.innerHTML = sorted.map(c => {
      const icon = CHANNEL_TYPE_ICONS[c.type] || '#';
      const cat = c.parent_id ? sorted.find(x => x.id === c.parent_id) : null;
      return `
        <div class="session-item">
          <div style="flex:1;min-width:0">
            <div class="bold small">${icon} ${esc(c.name)}${cat ? ` <span class="muted small">(${esc(cat.name)})</span>` : ''}</div>
            <div class="muted small mono" style="font-size:11px">${esc(c.id)} · type ${c.type}${c.nsfw ? ' · nsfw' : ''}</div>
          </div>
          <button class="btn btn-ghost btn-small ch-menu-btn ctx-menu-trigger" data-id="${c.id}" aria-haspopup="menu">⋯</button>
        </div>
      `;
    }).join('');

    const actionFor = (key) => ({
      rename: () => channelRename(sorted.find(x => x.id === key)),
      move: () => channelMove(sorted.find(x => x.id === key)),
      permissions: () => openChannelPerms(sorted.find(x => x.id === key)),
      clone: () => channelClone(key),
      backup: () => channelBackup(key),
      delete: () => channelDelete(key)
    });

    list.querySelectorAll('.ch-menu-btn').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        openCtxMenu(btn, [
          { label: t('channels.rename'), action: actionFor(id).rename },
          { label: t('channels.move'), action: actionFor(id).move },
          { label: t('perms.title'), action: actionFor(id).permissions },
          { label: t('channels.clone'), action: actionFor(id).clone },
          { label: t('channels.backup'), action: actionFor(id).backup },
          { label: t('channels.delete'), danger: true, action: actionFor(id).delete }
        ]);
      };
    });
    if (channelsGuild) loadRolesManage();
  } catch (e) {
    list.innerHTML = '<span class="muted small">' + esc(t('common.error')) + ': ' + esc(e.message) + '</span>';
  } finally {
    selToken = old;
  }
}

async function channelRename(ch) {
  if (!ch) return;
  const name = await promptInput(t('channels.rename_title'), t('channels.rename_desc').replace('{name}', ch.name), t('channels.rename_placeholder'), ch.name);
  if (!name || name === ch.name) return;
  const old = selToken;
  selToken = channelsToken;
  try {
    await api('/channels/' + ch.id, { method: 'PATCH', body: JSON.stringify({ name }) });
    tt(t('channels.renamed'));
    await loadChannelsList();
  } catch (e) {
    tt(friendlyError(e.message, 'rename'));
  } finally { selToken = old; }
}

async function channelMove(ch) {
  if (!ch) return;
  const modal = document.getElementById('move-channel-modal');
  const catSel = document.getElementById('mc-category');
  const posIn = document.getElementById('mc-position');
  const old = selToken;
  selToken = channelsToken;
  let cats = [];
  try {
    cats = await api('/guilds/' + channelsGuild + '/channels');
  } catch (e) {
    tt(e.message);
    selToken = old;
    return;
  }
  selToken = old;
  cats = cats.filter(c => c.type === 4).sort((a, b) => (a.raw_position || 0) - (b.raw_position || 0));
  catSel.innerHTML = `<option value="">${esc(t('channels.move_no_category'))}</option>` +
    cats.map(c => `<option value="${esc(c.id)}"${c.id === ch.parent_id ? ' selected' : ''}>${esc(c.name)}</option>`).join('');
  posIn.value = ch.raw_position || 0;
  modal.classList.remove('hidden');
  const apply = async () => {
    modal.classList.add('hidden');
    const payload = { position: parseInt(posIn.value, 10) || 0 };
    const catVal = catSel.value || null;
    if (catVal !== (ch.parent_id || null)) payload.parent_id = catVal;
    const ot = selToken;
    selToken = channelsToken;
    try {
      await api('/channels/' + ch.id, { method: 'PATCH', body: JSON.stringify(payload) });
      tt(t('channels.moved'));
      await loadChannelsList();
    } catch (e) {
      tt(friendlyError(e.message, 'move'));
    } finally { selToken = ot; }
  };
  document.getElementById('mc-apply').onclick = apply;
  document.getElementById('mc-cancel').onclick = () => modal.classList.add('hidden');
  document.getElementById('mc-close').onclick = () => modal.classList.add('hidden');
}

const channelBusy = new Set();
async function channelBackup(id) {
  if (channelBusy.has(id)) return;
  channelBusy.add(id);
  try {
    const res = await gateway('/backup/channel/' + id, { token: channelsToken });
    tt(t('channels.backup_complete').replace('{count}', res.messageCount));
  } catch (e) {
    tt(e.message);
  } finally {
    channelBusy.delete(id);
  }
}

function channelClone(id) {
  showConfirmModal(t('channels.clone_title'), t('channels.clone_confirm'), async () => {
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
    }
  });
}

function channelDelete(id) {
  showConfirmModal(t('channels.delete_title'), t('channels.delete_confirm'), async () => {
    try {
      await api('/channels/' + id, { method: 'DELETE' });
      tt(t('channels.deleted'));
      await loadChannelsList();
    } catch (e) {
      tt(friendlyError(e.message, 'delete'));
    }
  });
}

document.getElementById('channels-refresh').onclick = () => loadChannelsList();

/* ===== role manager (channels tab) ===== */
// well-known discord permission bits used by both permission editors
const PERM_BITS = [
  [1n, 'create_invite'], [2n, 'kick_members'], [4n, 'ban_members'], [8n, 'administrator'],
  [16n, 'manage_channels'], [32n, 'manage_guild'], [64n, 'add_reactions'], [128n, 'view_audit_log'],
  [256n, 'priority_speaker'], [1024n, 'view_channel'], [2048n, 'send_messages'], [4096n, 'send_tts'],
  [8192n, 'manage_messages'], [16384n, 'embed_links'], [32768n, 'attach_files'],
  [65536n, 'read_history'], [131072n, 'mention_everyone'], [262144n, 'external_emojis'],
  [1048576n, 'connect'], [2097152n, 'speak'], [4194304n, 'mute_members'], [8388608n, 'deafen_members'],
  [16777216n, 'move_members'], [33554432n, 'use_vad'], [67108864n, 'change_nickname'],
  [134217728n, 'manage_nicknames'], [268435456n, 'manage_roles'], [536870912n, 'manage_webhooks'],
  [1073741824n, 'manage_expressions'], [2147483648n, 'use_commands'],
  [8589934592n, 'manage_events'], [1099511627776n, 'moderate_members']
];
function hasBit(bits, bit) { return (BigInt(bits) & bit) === bit; }

let rolesManageCurrent = [];

async function loadRolesManage() {
  const list = document.getElementById('roles-manage-list');
  const err = document.getElementById('roles-manage-error');
  if (!list) return;
  if (err) err.classList.add('hidden');
  if (!channelsGuild || !channelsToken) {
    list.innerHTML = '<span class="muted small">' + esc(t('roles.no_roles')) + '</span>';
    return;
  }
  list.innerHTML = '<span class="muted small">' + esc(t('common.loading')) + '</span>';
  const old = selToken;
  selToken = channelsToken;
  try {
    rolesCacheClear(channelsGuild);
    rolesManageCurrent = await api('/guilds/' + channelsGuild + '/roles');
    const roles = rolesManageCurrent
      .filter(r => r.name !== '@everyone')
      .sort((a, b) => (b.position || 0) - (a.position || 0));
    if (!roles.length) {
      list.innerHTML = '<span class="muted small">' + esc(t('roles.no_roles')) + '</span>';
      return;
    }
    list.innerHTML = roles.map(r => {
      const color = r.color ? '#' + r.color.toString(16).padStart(6, '0') : 'var(--text-muted)';
      return `
        <div class="session-item">
          <span class="role-dot" style="background:${color}"></span>
          <div style="flex:1;min-width:0">
            <div class="bold small" style="color:${r.color ? color : 'var(--text)'}">${esc(r.name)}</div>
            <div class="muted small">${r.hoist ? esc(t('roles.hoist')) + ' · ' : ''}${hasBit(r.permissions, 8n) ? '⚠ admin' : ''}</div>
          </div>
          <button class="btn btn-ghost btn-small r-menu-btn ctx-menu-trigger" data-id="${esc(r.id)}" aria-haspopup="menu">⋯</button>
        </div>`;
    }).join('');

    list.querySelectorAll('.r-menu-btn').forEach(btn => {
      btn.onclick = () => {
        const role = rolesManageCurrent.find(x => x.id === btn.dataset.id);
        if (!role) return;
        openCtxMenu(btn, [
          { label: t('roles.rename'), action: () => roleRename(role) },
          { label: t('roles.color'), action: () => roleColor(role) },
          { label: t('roles.hoist'), action: () => roleToggle(role, 'hoist') },
          { label: t('roles.mentionable'), action: () => roleToggle(role, 'mentionable') },
          { label: t('roles.permissions'), action: () => openRolePerms(role) },
          { label: t('roles.delete'), danger: true, action: () => roleDelete(role) }
        ]);
      };
    });
  } catch (e) {
    list.innerHTML = '<span class="muted small">' + esc(t('common.error')) + ': ' + esc(e.message) + '</span>';
  } finally {
    selToken = old;
  }
}
// invalidate the 60s roles cache so the manager always shows fresh data
function rolesCacheClear(gid) { delete rolesCache[gid]; }

async function rolePatch(role, payload, okKey) {
  const old = selToken;
  selToken = channelsToken;
  try {
    await api('/guilds/' + channelsGuild + '/roles/' + role.id, { method: 'PATCH', body: JSON.stringify(payload) });
    tt(t(okKey));
    await loadRolesManage();
  } catch (e) {
    tt(friendlyError(e.message, 'roles'));
  } finally { selToken = old; }
}

async function roleRename(role) {
  const name = await promptInput(t('roles.rename'), t('channels.rename_desc').replace('{name}', role.name), t('channels.rename_placeholder'), role.name);
  if (!name || name === role.name) return;
  await rolePatch(role, { name }, 'roles.renamed');
}

async function roleColor(role) {
  const raw = await promptInput(t('roles.color'), role.name, t('roles.color_placeholder'), role.color ? '#' + role.color.toString(16).padStart(6, '0') : '');
  if (raw == null) return;
  const v = raw.trim();
  if (v === '') return rolePatch(role, { color: 0 }, 'roles.updated');
  if (!/^#?[0-9a-fA-F]{6}$/.test(v)) { tt(t('error.invalid_color')); return; }
  await rolePatch(role, { color: parseInt(v.replace('#', ''), 16) }, 'roles.updated');
}

async function roleToggle(role, key) {
  await rolePatch(role, { [key]: !role[key] }, 'roles.updated');
}

function roleDelete(role) {
  showConfirmModal(t('roles.delete'), t('roles.delete_confirm'), async () => {
    const old = selToken;
    selToken = channelsToken;
    try {
      await api('/guilds/' + channelsGuild + '/roles/' + role.id, { method: 'DELETE' });
      tt(t('roles.deleted'));
      await loadRolesManage();
    } catch (e) {
      tt(friendlyError(e.message, 'roles'));
    } finally { selToken = old; }
  });
}

document.getElementById('roles-refresh').onclick = () => loadRolesManage();

document.getElementById('role-create').onclick = async () => {
  const name = await promptInput(t('roles.create'), '', t('channels.rename_placeholder'), '');
  if (!name) return;
  const old = selToken;
  selToken = channelsToken;
  try {
    await api('/guilds/' + channelsGuild + '/roles', { method: 'POST', body: JSON.stringify({ name }) });
    tt(t('roles.created'));
    await loadRolesManage();
  } catch (e) {
    tt(friendlyError(e.message, 'roles'));
  } finally { selToken = old; }
};

/* ===== role permission editor ===== */
let rpmRole = null;
function renderPermBitsGrid(gridEl, checkedAllow, checkedDeny) {
  gridEl.innerHTML = PERM_BITS.map(([bit, key]) => `
    <label class="perm-cell">
      <input type="checkbox" class="perm-allow-bit" data-bit="${bit}" ${checkedAllow && hasBit(checkedAllow, bit) ? 'checked' : ''}>
      <input type="checkbox" class="perm-deny-bit" data-bit="${bit}" ${checkedDeny && hasBit(checkedDeny, bit) ? 'checked' : ''}>
      <span>${esc(t('perms.bit_' + key))}</span>
    </label>`).join('');
  gridEl.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.onchange = () => {
      if (!cb.checked) return;
      const row = cb.closest('.perm-cell');
      const other = cb.classList.contains('perm-allow-bit')
        ? row.querySelector('.perm-deny-bit')
        : row.querySelector('.perm-allow-bit');
      if (other && other.checked) other.checked = false;
      updatePermConflict();
    };
  });
  updatePermConflict();
}
function updatePermConflict() {
  const el = document.getElementById('perm-conflict');
  if (!el) return;
  const rows = document.querySelectorAll('#perm-bits-grid .perm-cell');
  let conflict = false;
  rows.forEach(row => {
    const a = row.querySelector('.perm-allow-bit').checked;
    const d = row.querySelector('.perm-deny-bit').checked;
    if (a && d) conflict = true;
  });
  el.classList.toggle('hidden', !conflict);
}

function openRolePerms(role) {
  rpmRole = role;
  document.getElementById('rpm-role-name').textContent = role.name;
  renderPermBitsGrid(document.getElementById('role-perms-grid'), role.permissions, null);
  const warn = document.getElementById('rpm-warn');
  warn.classList.add('hidden');
  warn.textContent = '';
  warn.style.color = '';
  document.getElementById('role-perms-modal').classList.remove('hidden');
}
document.getElementById('rpm-close').onclick = () => document.getElementById('role-perms-modal').classList.add('hidden');
document.getElementById('rpm-cancel').onclick = () => document.getElementById('role-perms-modal').classList.add('hidden');
document.getElementById('role-perms-modal').onclick = (e) => {
  if (e.target === e.currentTarget) e.currentTarget.classList.add('hidden');
};
document.getElementById('rpm-save').onclick = async () => {
  if (!rpmRole) return;
  let bits = 0n;
  document.querySelectorAll('#role-perms-grid .perm-allow-bit').forEach(cb => { if (cb.checked) bits |= BigInt(cb.dataset.bit); });
  const btn = document.getElementById('rpm-save');
  btn.disabled = true;
  const old = selToken;
  selToken = channelsToken;
  try {
    await api('/guilds/' + channelsGuild + '/roles/' + rpmRole.id, { method: 'PATCH', body: JSON.stringify({ permissions: bits.toString() }) });
    tt(t('roles.updated'));
    document.getElementById('role-perms-modal').classList.add('hidden');
    await loadRolesManage();
  } catch (e) {
    tt(friendlyError(e.message, 'roles'));
  } finally {
    selToken = old;
    btn.disabled = false;
  }
};
// admin warning surfaces live while editing role permissions
document.addEventListener('change', (e) => {
  if (e.target && e.target.closest && e.target.closest('#role-perms-grid')) {
    const admin = document.querySelector('#role-perms-grid .perm-allow-bit[data-bit="8"]');
    const warn = document.getElementById('rpm-warn');
    if (admin && admin.checked) {
      warn.textContent = t('roles.admin_warn');
      warn.style.color = 'var(--danger)';
      warn.classList.remove('hidden');
    } else {
      warn.classList.add('hidden');
    }
  }
});

/* ===== channel permission overwrites editor ===== */
let permChannel = null;
let permOverwrites = [];

async function openChannelPerms(ch) {
  if (!ch) return;
  permChannel = ch;
  document.getElementById('pm-channel').textContent = '#' + ch.name;
  document.getElementById('perm-form').classList.add('hidden');
  const errEl = document.getElementById('perm-error');
  errEl.classList.add('hidden');
  document.getElementById('perm-modal').classList.remove('hidden');
  const listEl = document.getElementById('perm-overwrites-list');
  const emptyEl = document.getElementById('perm-empty');
  listEl.innerHTML = '<span class="muted small">' + esc(t('common.loading')) + '</span>';
  emptyEl.classList.add('hidden');
  const old = selToken;
  selToken = channelsToken;
  try {
    const fresh = await api('/channels/' + ch.id);
    permOverwrites = Array.isArray(fresh.permission_overwrites) ? [...fresh.permission_overwrites] : [];
    renderPermOverwrites();
    await populatePermRoleSelect();
  } catch (e) {
    listEl.innerHTML = '';
    errEl.textContent = e.message;
    errEl.classList.remove('hidden');
  } finally { selToken = old; }
}

async function overwriteTargetName(ow) {
  if (ow.type === '0' || ow.type === 0) {
    try {
      const roles = await fetchGuildRoles(channelsGuild, channelsToken);
      const r = roles.find(x => x.id === ow.id);
      if (r) return r.name;
    } catch {}
    return ow.id;
  }
  try {
    const m = await api('/guilds/' + channelsGuild + '/members/' + ow.id);
    if (m && m.user) return m.user.global_name || m.user.username;
  } catch {}
  if (ow.id === channelsGuild) return t('perms.everyone');
  return ow.id;
}

async function renderPermOverwrites() {
  const listEl = document.getElementById('perm-overwrites-list');
  const emptyEl = document.getElementById('perm-empty');
  if (!permOverwrites.length) {
    listEl.innerHTML = '';
    emptyEl.classList.remove('hidden');
    return;
  }
  emptyEl.classList.add('hidden');
  listEl.innerHTML = '<span class="muted small">' + esc(t('common.loading')) + '</span>';
  const rows = [];
  for (const ow of permOverwrites) {
    const name = await overwriteTargetName(ow);
    rows.push(`
      <div class="session-item" data-owid="${esc(ow.id)}" data-owtype="${esc(String(ow.type))}">
        <span class="role-badge">${ow.type === '0' || ow.type === 0 ? esc(t('perms.target_role')) : esc(t('perms.target_member'))}</span>
        <div style="flex:1;min-width:0" class="bold small">${esc(name)}</div>
        <div class="muted small mono" style="font-size:11px">✓${(BigInt(ow.allow || 0)).toString(16)} ✗${(BigInt(ow.deny || 0)).toString(16)}</div>
        <button class="btn btn-ghost btn-small ow-edit">${esc(t('perms.edit'))}</button>
        <button class="btn btn-ghost btn-small ow-remove">${esc(t('perms.remove'))}</button>
      </div>`);
  }
  listEl.innerHTML = rows.join('');
  listEl.querySelectorAll('.ow-edit').forEach(btn => {
    btn.onclick = () => {
      const row = btn.closest('.session-item');
      const ow = permOverwrites.find(o => String(o.id) === row.dataset.owid && String(o.type) === row.dataset.owtype);
      if (ow) showPermForm(ow);
    };
  });
  listEl.querySelectorAll('.ow-remove').forEach(btn => {
    btn.onclick = () => {
      const row = btn.closest('.session-item');
      permOverwrites = permOverwrites.filter(o => !(String(o.id) === row.dataset.owid && String(o.type) === row.dataset.owtype));
      savePermOverwrites();
    };
  });
}

async function populatePermRoleSelect() {
  const sel = document.getElementById('perm-role-select');
  let roles = [];
  try { roles = await fetchGuildRoles(channelsGuild, channelsToken); } catch {}
  sel.innerHTML = `<option value="">—</option>` + roles
    .filter(r => r.id !== channelsGuild)
    .sort((a, b) => (b.position || 0) - (a.position || 0))
    .map(r => `<option value="${esc(r.id)}">${esc(r.name)}</option>`).join('');
}

function showPermForm(existing) {
  const form = document.getElementById('perm-form');
  const roleSel = document.getElementById('perm-role-select');
  const memberIn = document.getElementById('perm-member-id');
  form.classList.remove('hidden');
  form.dataset.editId = existing ? existing.id : '';
  form.dataset.editType = existing ? String(existing.type) : '';
  roleSel.value = existing && String(existing.type) === '0' ? existing.id : '';
  memberIn.value = existing && String(existing.type) === '1' ? existing.id : '';
  const everyoneRow = roleSel.querySelector(`option[value="${channelsGuild}"]`);
  if (everyoneRow) everyoneRow.textContent = t('perms.everyone');
  renderPermBitsGrid(document.getElementById('perm-bits-grid'), existing?.allow, existing?.deny);
}
document.getElementById('perm-add').onclick = () => showPermForm(null);
document.getElementById('perm-form-cancel').onclick = () => document.getElementById('perm-form').classList.add('hidden');

async function savePermOverwrites() {
  const errEl = document.getElementById('perm-error');
  errEl.classList.add('hidden');
  const btn = document.getElementById('perm-form-save');
  btn.disabled = true;
  const old = selToken;
  selToken = channelsToken;
  try {
    await api('/channels/' + permChannel.id, {
      method: 'PATCH',
      body: JSON.stringify({ permission_overwrites: permOverwrites })
    });
    tt(t('perms.saved'));
    document.getElementById('perm-form').classList.add('hidden');
    await renderPermOverwrites();
  } catch (e) {
    errEl.textContent = friendlyError(e.message, 'perms');
    errEl.classList.remove('hidden');
  } finally { selToken = old; btn.disabled = false; }
}
document.getElementById('perm-form-save').onclick = () => {
  const form = document.getElementById('perm-form');
  const roleSel = document.getElementById('perm-role-select');
  const memberIn = document.getElementById('perm-member-id').value.trim();
  let id = roleSel.value;
  let type = '0';
  if (memberIn) { id = memberIn; type = '1'; }
  if (!id) { tt(t('perms.empty')); return; }
  let allow = 0n, deny = 0n;
  document.querySelectorAll('#perm-bits-grid .perm-cell').forEach(row => {
    const bit = BigInt(row.querySelector('.perm-allow-bit').dataset.bit);
    if (row.querySelector('.perm-allow-bit').checked) allow |= bit;
    if (row.querySelector('.perm-deny-bit').checked) deny |= bit;
  });
  const entry = { id, type, allow: allow.toString(), deny: deny.toString() };
  const editId = form.dataset.editId, editType = form.dataset.editType;
  if (editId && editType) {
    permOverwrites = permOverwrites.map(o => (String(o.id) === editId && String(o.type) === editType) ? entry : o);
  } else {
    permOverwrites = permOverwrites.filter(o => !(String(o.id) === id && String(o.type) === type));
    permOverwrites.push(entry);
  }
  savePermOverwrites();
};
document.getElementById('pm-close').onclick = () => document.getElementById('perm-modal').classList.add('hidden');
document.getElementById('perm-modal').onclick = (e) => {
  if (e.target === e.currentTarget) e.currentTarget.classList.add('hidden');
};

/* ===== scheduler tab ===== */
let editingJobId = null;

function populateJobBotSelect() {
  const sel = document.getElementById('job-bot-select');
  if (!sel) return;
  sel.innerHTML = '';
  setPlaceholderOption(sel, 'select.bot');
  if (V) {
    V.bots.forEach(b => {
      const o = document.createElement('option');
      o.value = b.id;
      o.textContent = b.name;
      sel.appendChild(o);
    });
  }
  translateSelectOptions(sel);
}

function populateJobPayloadFields() {
  const type = document.getElementById('job-type').value;
  const container = document.getElementById('job-payload-fields');
  container.innerHTML = '';

  if (type === 'send_message') {
    container.innerHTML = `
      <div class="field">
        <label class="label" data-i18n="scheduler.bot"></label>
        <select id="job-bot-select"></select>
      </div>
      <div class="field">
        <label class="label" data-i18n="scheduler.channel_id"></label>
        <input type="text" id="job-channel-id" class="mono" data-i18n-placeholder="scheduler.channel_id_placeholder">
      </div>
      <div class="field">
        <label class="label" data-i18n="scheduler.message_content"></label>
        <textarea id="job-content" rows="3" data-i18n-placeholder="scheduler.message_content_placeholder"></textarea>
      </div>
    `;
  } else if (type === 'change_presence') {
    container.innerHTML = `
      <div class="field">
        <label class="label" data-i18n="scheduler.bot"></label>
        <select id="job-bot-select"></select>
      </div>
      <div class="field">
        <label class="label" data-i18n="scheduler.presence_status"></label>
        <select id="job-status">
          <option value="online" data-i18n-key="presence.online"></option>
          <option value="idle" data-i18n-key="presence.idle"></option>
          <option value="dnd" data-i18n-key="presence.dnd"></option>
          <option value="invisible" data-i18n-key="presence.invisible"></option>
        </select>
      </div>
    `;
  }
  populateJobBotSelect();
  translateStaticDom();
}

document.getElementById('job-type').onchange = populateJobPayloadFields;

document.getElementById('scheduler-add').onclick = () => {
  editingJobId = null;
  document.getElementById('job-name').value = '';
  document.getElementById('job-interval').value = '60';
  document.getElementById('job-type').value = 'send_message';
  populateJobPayloadFields();
  document.getElementById('scheduler-form').classList.remove('hidden');
};

document.getElementById('job-cancel').onclick = () => {
  document.getElementById('scheduler-form').classList.add('hidden');
  editingJobId = null;
};

document.getElementById('job-save').onclick = async () => {
  const err = document.getElementById('job-error');
  err.classList.add('hidden');
  const name = document.getElementById('job-name').value.trim();
  const type = document.getElementById('job-type').value;
  const intervalSec = parseInt(document.getElementById('job-interval').value, 10);

  const showErr = k => { err.textContent = t(k); err.classList.remove('hidden'); };

  if (!name) return showErr('scheduler.error_need_name');
  if (!intervalSec || intervalSec < 10) return showErr('scheduler.error_invalid_interval');

  const payload = {};
  if (type === 'send_message') {
    const botSel = document.getElementById('job-bot-select');
    const bot = V.bots.find(b => b.id === botSel.value);
    const channelId = document.getElementById('job-channel-id').value.trim();
    const content = document.getElementById('job-content').value;
    if (!bot) return showErr('scheduler.error_no_bot');
    if (!channelId || !content.trim()) return showErr('scheduler.error_incomplete');
    try {
      payload.token = await db(bot, K);
    } catch (e) {
      return showErr('scheduler.error_no_bot');
    }
    payload.botId = bot.id;
    payload.channelId = channelId;
    payload.content = content;
  } else if (type === 'change_presence') {
    const botSel = document.getElementById('job-bot-select');
    const bot = V.bots.find(b => b.id === botSel.value);
    if (!bot) return showErr('scheduler.error_no_bot');
    payload.botId = bot.id;
    payload.status = document.getElementById('job-status').value;
  }

  const id = editingJobId || 'job-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
  const btn = document.getElementById('job-save');
  btn.disabled = true;
  btn.textContent = t('common.saving');

  try {
    await gateway('/scheduler/job/' + id, {
      name,
      type,
      intervalMs: intervalSec * 1000,
      active: true,
      payload
    });
    tt(t('scheduler.job_saved'));
    document.getElementById('scheduler-form').classList.add('hidden');
    editingJobId = null;
    loadJobs();
  } catch (e) {
    err.textContent = e.message;
    err.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.textContent = t('common.save');
  }
};

function jobTypeLabel(type) {
  return type === 'send_message' ? t('scheduler.type_send') : t('scheduler.type_presence');
}

async function loadJobs() {
  const list = document.getElementById('scheduler-list');
  if (!list) return;
  try {
    const res = await gatewayGet('/scheduler/jobs');
    const jobs = res.jobs || [];

    if (!jobs.length) {
      list.innerHTML = '<span class="muted small">' + esc(t('scheduler.no_jobs')) + '</span>';
      return;
    }

    list.innerHTML = jobs.map(j => {
      const statusColor = j.lastStatus === 'success' ? 'dot-ok' : (j.lastStatus && String(j.lastStatus).startsWith('error')) ? 'dot-ko' : 'dot-idle';
      const statusText = j.lastStatus === 'success' ? t('scheduler.status_success') : (j.lastStatus || t('scheduler.never_run'));
      const lastRun = j.lastRun ? fmtDateTime(j.lastRun) : t('scheduler.never');
      return `
        <div class="session-item">
          <div class="dot ${statusColor}"></div>
          <div style="flex:1;min-width:0">
            <div class="bold small">${esc(j.name)}</div>
            <div class="muted small">${esc(jobTypeLabel(j.type))} · ${Math.round(j.intervalMs / 1000)}s · ${esc(statusText)}</div>
            <div class="muted small">${esc(t('scheduler.last_run'))}: ${esc(lastRun)} · ${esc(t('scheduler.run_count'))}: ${j.runCount || 0}</div>
          </div>
          <button class="btn btn-ghost btn-small job-toggle" data-id="${j.id}">${j.active ? t('scheduler.disable') : t('scheduler.enable')}</button>
          <button class="btn btn-danger btn-small job-delete" data-id="${j.id}">${esc(t('common.delete'))}</button>
        </div>
      `;
    }).join('');

    list.querySelectorAll('.job-toggle').forEach(btn => {
      btn.onclick = async () => {
        btn.disabled = true;
        try {
          await gateway('/scheduler/job/' + btn.dataset.id + '/toggle');
          tt(t('scheduler.job_toggled'));
          await loadJobs();
        } catch (e) {
          tt(e.message);
        } finally {
          btn.disabled = false;
        }
      };
    });

    list.querySelectorAll('.job-delete').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        showConfirmModal(t('scheduler.delete_job'), t('scheduler.delete_confirm'), async () => {
          btn.disabled = true;
          try {
            await fetch('/gateway/scheduler/job/' + id, { method: 'DELETE', headers: { 'X-Client-Nonce': BRIDGE_NONCE } });
            tt(t('scheduler.job_deleted'));
            await loadJobs();
          } catch (e) {
            tt(e.message);
          } finally {
            btn.disabled = false;
          }
        });
      };
    });
  } catch (e) {
    list.innerHTML = '<span class="muted small">' + esc(t('common.error')) + ': ' + esc(e.message) + '</span>';
  }
}

// refresh the job list while the scheduler tab is open
setInterval(() => {
  const tab = document.getElementById('scheduler');
  if (tab && !tab.classList.contains('hidden')) loadJobs();
}, 10000);

/* ===== members tab ===== */
let membersBot = null;
let membersToken = null;
let membersGuild = null;
let allMembers = [];
let allRoles = [];

const membersBotSel = document.getElementById('members-bot-select');
const membersGs = document.getElementById('members-guild-select');

function populateMembersBotSelect() {
  if (!membersBotSel) return;
  const cur = membersBotSel.value;
  membersBotSel.innerHTML = '';
  setPlaceholderOption(membersBotSel, 'select.bot');
  if (V) {
    V.bots.forEach(b => {
      const o = document.createElement('option');
      o.value = b.id;
      o.textContent = b.name;
      membersBotSel.appendChild(o);
    });
  }
  if (cur) membersBotSel.value = cur;
  translateSelectOptions(membersBotSel);
}

membersBotSel.onchange = async () => {
  const id = membersBotSel.value;
  membersBot = V.bots.find(b => b.id === id) || null;
  membersToken = membersBot ? await db(membersBot, K) : null;
  membersGs.disabled = true;
  setPlaceholderOption(membersGs, 'select.bot_first');
  document.getElementById('members-fetch').disabled = true;
  if (membersToken) loadMembersGuilds();
};

async function loadMembersGuilds() {
  membersGs.disabled = false;
  setPlaceholderOption(membersGs, 'select.loading');
  try {
    const old = selToken;
    selToken = membersToken;
    const g = await api('/users/@me/guilds');
    selToken = old;
    membersGs.innerHTML = '';
    setPlaceholderOption(membersGs, 'select.choose_server');
    g.forEach(x => {
      const o = document.createElement('option');
      o.value = x.id;
      o.textContent = x.name;
      membersGs.appendChild(o);
    });
    translateSelectOptions(membersGs);
  } catch (e) {
    setPlaceholderOption(membersGs, 'select.error');
    tt(e.message);
  }
}

membersGs.onchange = async () => {
  membersGuild = membersGs.value;
  document.getElementById('members-fetch').disabled = !membersGuild;
};

document.getElementById('members-fetch').onclick = async () => {
  const err = document.getElementById('members-error');
  err.classList.add('hidden');
  if (!membersBot || !membersGuild || !membersToken) return;

  const btn = document.getElementById('members-fetch');
  btn.disabled = true;
  btn.textContent = t('common.loading');

  try {
    const r = await fetch('/gateway/' + membersBot.id + '/members/' + membersGuild, {
      method: 'POST',
      headers: { 'X-Client-Nonce': BRIDGE_NONCE, 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: membersToken })
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      if (r.status === 403) {
        err.textContent = t('members.missing_intent');
        err.classList.remove('hidden');
        return;
      }
      throw new Error(data.error || 'HTTP ' + r.status);
    }
    allMembers = data.members || [];
    showMembersSnapshotNote(data.hasIntent === false);
    try {
      const old = selToken;
      selToken = membersToken;
      allRoles = await api('/guilds/' + membersGuild + '/roles');
      selToken = old;
    } catch {
      allRoles = [];
    }
    const roleFilter = document.getElementById('members-role-filter');
    roleFilter.innerHTML = '<option value="" data-i18n-key="members.all_roles">' + esc(t('members.all_roles')) + '</option>';
    allRoles.filter(r => r.name !== '@everyone').forEach(r => {
      const o = document.createElement('option');
      o.value = r.id;
      o.textContent = r.name;
      roleFilter.appendChild(o);
    });
    translateSelectOptions(roleFilter);

    filterMembers();
  } catch (e) {
    err.textContent = e.message;
    err.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.textContent = t('members.fetch');
  }
};

function showMembersSnapshotNote(show) {
  const note = document.getElementById('members-note');
  if (note) note.classList.toggle('hidden', !show);
}

function refreshMembersCount() {
  if (allMembers.length) filterMembers();
}

function filterMembers() {
  const search = document.getElementById('members-search').value.toLowerCase();
  const roleFilter = document.getElementById('members-role-filter').value;
  const list = document.getElementById('members-list');
  const count = document.getElementById('members-count');

  let filtered = allMembers;
  if (search) {
    filtered = filtered.filter(m =>
      m.user && (
        m.user.username.toLowerCase().includes(search) ||
        (m.user.global_name || '').toLowerCase().includes(search) ||
        (m.nick || '').toLowerCase().includes(search)
      )
    );
  }
  if (roleFilter) filtered = filtered.filter(m => (m.roles || []).includes(roleFilter));

  if (!filtered.length) {
    list.innerHTML = '<span class="muted small">' + esc(t('members.no_members')) + '</span>';
    count.textContent = '';
    return;
  }

  list.innerHTML = filtered.slice(0, 100).map(m => {
    const displayName = m.nick || m.user.global_name || m.user.username;
    const avatar = m.user.avatar
      ? `https://cdn.discordapp.com/avatars/${m.user.id}/${m.user.avatar}.png?size=64`
      : `https://cdn.discordapp.com/embed/avatars/${(BigInt(m.user.id) >> 22n) % 6n}.png`;
    return `
      <div class="session-item" data-uid="${m.user.id}">
        <img src="${avatar}" class="msg-avatar" data-uid="${m.user.id}" data-uname="${esc(m.user.username)}" data-guild="${membersGuild}" alt="">
        <div style="flex:1;min-width:0">
          <div class="bold small">${esc(displayName)}</div>
          <div class="muted small">@${esc(m.user.username)} · ${(m.roles || []).length} ${esc(t('members.roles'))}</div>
        </div>
      </div>
    `;
  }).join('');

  count.textContent = `${filtered.length} ${t('members.members_found')}` + (filtered.length > 100 ? ' · ' + t('members.showing_first_100') : '');

  list.querySelectorAll('.msg-avatar').forEach(el => {
    el.onclick = () => openUserModal(el.dataset.uid, el.dataset.uname, el.dataset.guild);
  });
}

document.getElementById('members-search').oninput = filterMembers;
document.getElementById('members-role-filter').onchange = filterMembers;

/* ===== scripts tab (user scripts, sandboxed) ===== */
const SCRIPTS_MAX = 50;
let editingScriptId = null;

function getSelected(kind) {
  if (kind === 'bot') {
    const id = botSel && botSel.value;
    const b = V.bots.find(x => x.id === id);
    return b ? { id: b.id, name: b.name } : null;
  }
  const el = kind === 'channel' ? document.getElementById('chan-select') : document.getElementById('guild-select');
  if (!el || !el.value) return null;
  const opt = el.options[el.selectedIndex];
  return { id: el.value, name: opt ? opt.textContent : el.value };
}

function getScriptPermissions(scriptId) {
  const s = (V.scripts || []).find(x => x.id === scriptId);
  return s && Array.isArray(s.permissions) ? s.permissions : [];
}

function addScriptPermission(scriptId, perm) {
  const s = (V.scripts || []).find(x => x.id === scriptId);
  if (!s) return;
  if (!Array.isArray(s.permissions)) s.permissions = [];
  if (!s.permissions.some(p => p.path === perm.path && p.method === perm.method)) {
    s.permissions.push(perm);
    sv();
    loadScriptPermissions();
  }
}

configureRuntime({
  V: () => V,
  K: () => K,
  sv: () => sv(),
  db,
  tt,
  t,
  esc,
  injectIcons,
  getScriptPermissions,
  addScriptPermission,
  getSelected
});

function runScript(script) {
  executeScript(script);
}

function loadScripts() {
  const list = document.getElementById('scripts-list');
  if (!list) return;
  const scripts = V.scripts || [];

  if (!scripts.length) {
    list.innerHTML = '<span class="muted small">' + esc(t('scripts.no_scripts')) + '</span>';
    return;
  }

  list.innerHTML = scripts.map(s => `
    <div class="session-item">
      <div style="width:12px;height:12px;border-radius:50%;background:${esc(s.color || '#4d6bfe')};flex-shrink:0"></div>
      <div style="flex:1;min-width:0">
        <div class="bold small">${esc(s.name)}</div>
        <div class="muted small">${s.hotkey ? esc(t('scripts.hotkey')) + ': ' + esc(s.hotkey) : esc(t('scripts.no_hotkey'))}${(s.permissions || []).length ? ' · ' + (s.permissions.length) + ' ' + esc(t('settings.permissions')) : ''}</div>
      </div>
      <button class="btn btn-ghost btn-small script-run" data-id="${s.id}">${esc(t('scripts.run'))}</button>
      <button class="btn btn-ghost btn-small script-edit" data-id="${s.id}">${esc(t('common.edit'))}</button>
      <button class="btn btn-danger btn-small script-delete" data-id="${s.id}">${esc(t('common.delete'))}</button>
    </div>
  `).join('');

  list.querySelectorAll('.script-run').forEach(btn => {
    btn.onclick = () => {
      const script = (V.scripts || []).find(s => s.id === btn.dataset.id);
      if (script) runScript(script);
    };
  });

  list.querySelectorAll('.script-edit').forEach(btn => {
    btn.onclick = () => {
      const script = (V.scripts || []).find(s => s.id === btn.dataset.id);
      if (!script) return;
      editingScriptId = script.id;
      document.getElementById('script-name').value = script.name;
      document.getElementById('script-color').value = script.color || '#4d6bfe';
      document.getElementById('script-hotkey').value = script.hotkey || '';
      document.getElementById('script-code').value = script.code || '';
      document.getElementById('script-form').classList.remove('hidden');
      document.getElementById('script-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
  });

  list.querySelectorAll('.script-delete').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      const script = (V.scripts || []).find(s => s.id === id);
      showConfirmModal(
        t('scripts.delete_script'),
        t('scripts.delete_confirm').replace('{name}', script ? script.name : ''),
        () => {
          V.scripts = (V.scripts || []).filter(s => s.id !== id);
          if (V.scriptStorage) delete V.scriptStorage[id];
          sv();
          loadScripts();
          loadScriptPermissions();
          tt(t('scripts.script_deleted'));
        }
      );
    };
  });
}

const SCRIPT_EXAMPLES = {
  hello: `// invia un messaggio nel canale selezionato della tab invio
async function main() {
  const channel = await api.getSelectedChannel();
  if (!channel) { ui.toast('nessun canale selezionato'); return; }
  const bot = await api.getSelectedBot();
  if (!bot) { ui.toast('nessun bot selezionato'); return; }
  ui.log('invio in #' + channel.name + ' come @' + bot.name);
  const result = await api.discord(
    bot.id,
    '/channels/' + channel.id + '/messages',
    'POST',
    { content: 'ciao da uno script!' }
  );
  ui.toast('inviato: ' + result.id);
}
main().catch(e => ui.log('errore: ' + e.message));`,
  presence: `// imposta lo stato del bot selezionato (richiede il gateway connesso)
async function main() {
  const bot = await api.getSelectedBot();
  if (!bot) { ui.toast('nessun bot selezionato'); return; }
  ui.log('cambio stato per @' + bot.name);
  await api.discord(bot.id, '/users/@me', 'PATCH', { status: 'dnd' });
  ui.toast('stato aggiornato');
}
main().catch(e => ui.log('errore: ' + e.message));`,
  storage: `// contatore di esecuzioni persistito (nel vault, per-script)
async function main() {
  const count = (await storage.get('run_count')) || 0;
  ui.log('esecuzioni: ' + count);
  await storage.set('run_count', count + 1);
  ui.toast('contatore incrementato');
}
main().catch(e => ui.log('errore: ' + e.message));`
};

document.getElementById('scripts-add').onclick = () => {
  if ((V.scripts || []).length >= SCRIPTS_MAX) { tt(t('scripts.too_many')); return; }
  editingScriptId = null;
  document.getElementById('script-name').value = '';
  document.getElementById('script-color').value = '#4d6bfe';
  document.getElementById('script-hotkey').value = '';
  document.getElementById('script-code').value = '';
  document.getElementById('script-examples').value = '';
  document.getElementById('script-error').classList.add('hidden');
  document.getElementById('script-form').classList.remove('hidden');
};

document.getElementById('script-cancel').onclick = () => {
  document.getElementById('script-form').classList.add('hidden');
  editingScriptId = null;
};

document.getElementById('script-save').onclick = () => {
  const err = document.getElementById('script-error');
  err.classList.add('hidden');
  const name = document.getElementById('script-name').value.trim();
  const color = document.getElementById('script-color').value;
  const hotkey = document.getElementById('script-hotkey').value.trim().toLowerCase();
  const code = document.getElementById('script-code').value;

  if (!name) { err.textContent = t('scripts.error_need_name'); err.classList.remove('hidden'); return; }
  if (!code.trim()) { err.textContent = t('scripts.error_need_code'); err.classList.remove('hidden'); return; }
  if (hotkey && !/^(ctrl\+)?(shift\+)?(alt\+)?[a-z0-9]$/.test(hotkey)) {
    err.textContent = t('scripts.error_bad_hotkey');
    err.classList.remove('hidden');
    return;
  }

  if (!Array.isArray(V.scripts)) V.scripts = [];

  if (editingScriptId) {
    const script = V.scripts.find(s => s.id === editingScriptId);
    if (script) {
      script.name = name;
      script.color = color;
      script.hotkey = hotkey;
      script.code = code;
    }
  } else {
    if (V.scripts.length >= SCRIPTS_MAX) { tt(t('scripts.too_many')); return; }
    V.scripts.push({
      id: 'script-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
      name, color, hotkey, code,
      permissions: [],
      createdAt: Date.now(),
      runCount: 0
    });
  }

  sv();
  loadScripts();
  loadScriptPermissions();
  document.getElementById('script-form').classList.add('hidden');
  editingScriptId = null;
  tt(t('scripts.script_saved'));
};

document.getElementById('script-run').onclick = () => {
  const name = document.getElementById('script-name').value.trim();
  const code = document.getElementById('script-code').value;
  if (!name || !code.trim()) { tt(t('scripts.error_need_name_and_code')); return; }
  // run the editor buffer without saving: a temp id gets fresh permissions
  runScript({ id: 'temp-' + Date.now(), name, code, permissions: [] });
};

document.getElementById('script-insert-example').onclick = () => {
  const ex = document.getElementById('script-examples').value;
  if (ex && SCRIPT_EXAMPLES[ex]) document.getElementById('script-code').value = SCRIPT_EXAMPLES[ex];
};

/* ===== channel id fetcher (scripts tab) ===== */
const cfBotSel = document.getElementById('cf-bot');
const cfGuildSel = document.getElementById('cf-guild');
const cfChanSel = document.getElementById('cf-chan');
const cfIdInput = document.getElementById('cf-id');
let cfToken = null;

function populateAllBotSelectsCf() {
  if (!cfBotSel) return;
  cfBotSel.innerHTML = `<option value="">${esc(t('select.bot'))}</option>` +
    ((V && V.bots) || []).map(b => `<option value="${esc(b.id)}">${esc(b.name)}</option>`).join('');
}
populateAllBotSelectsCf();

if (cfBotSel) cfBotSel.onchange = async () => {
  const b = (V.bots || []).find(x => x.id === cfBotSel.value);
  cfGuildSel.innerHTML = '';
  cfChanSel.innerHTML = '';
  cfChanSel.disabled = true;
  cfIdInput.value = '';
  cfToken = null;
  if (!b) { cfGuildSel.disabled = true; return; }
  setPlaceholderOption(cfGuildSel, 'select.loading');
  cfGuildSel.disabled = false;
  try {
    cfToken = await db(b, K);
    const guilds = await api('/users/@me/guilds', {}, cfToken);
    cfGuildSel.innerHTML = `<option value="">${esc(t('scripts.cf_pick_guild'))}</option>` +
      guilds.map(g => `<option value="${esc(g.id)}">${esc(g.name)}</option>`).join('');
  } catch (e) {
    cfGuildSel.innerHTML = `<option value="">${esc(t('common.error'))}</option>`;
    tt(friendlyError(e.message, 'scripts'));
  }
};
if (cfGuildSel) cfGuildSel.onchange = async () => {
  cfChanSel.innerHTML = '';
  cfIdInput.value = '';
  if (!cfGuildSel.value || !cfToken) { cfChanSel.disabled = true; return; }
  setPlaceholderOption(cfChanSel, 'select.loading');
  cfChanSel.disabled = false;
  try {
    const chs = await api('/guilds/' + cfGuildSel.value + '/channels', {}, cfToken);
    cfChanSel.innerHTML = `<option value="">${esc(t('scripts.cf_pick_channel'))}</option>` +
      chs.map(c => {
        const icon = CHANNEL_TYPE_ICONS[c.type] || '#';
        return `<option value="${esc(c.id)}">${icon} ${esc(c.name)}</option>`;
      }).join('');
  } catch (e) {
    cfChanSel.innerHTML = `<option value="">${esc(t('common.error'))}</option>`;
    tt(friendlyError(e.message, 'scripts'));
  }
};
if (cfChanSel) cfChanSel.onchange = () => { cfIdInput.value = cfChanSel.value || ''; };
if (cfIdInput) document.getElementById('cf-insert').onclick = () => {
  if (!cfIdInput.value) return;
  const codeTa = document.getElementById('script-code');
  const pos = codeTa.selectionStart !== undefined && codeTa.selectionStart !== null ? codeTa.selectionStart : codeTa.value.length;
  const before = codeTa.value.slice(0, pos);
  const after = codeTa.value.slice(codeTa.selectionEnd || pos);
  codeTa.value = before + cfIdInput.value + after;
  const newPos = pos + cfIdInput.value.length;
  codeTa.focus();
  try { codeTa.setSelectionRange(newPos, newPos); } catch {}
};

document.getElementById('console-clear').onclick = () => clearConsole();

// hotkeys fire only when unlocked and nothing is typing
document.addEventListener('keydown', (e) => {
  if (!V || !K) return;
  const tag = (document.activeElement && document.activeElement.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
  for (const script of (V.scripts || [])) {
    if (!script.hotkey) continue;
    const parts = script.hotkey.split('+');
    const key = parts[parts.length - 1];
    if (e.ctrlKey === parts.includes('ctrl') &&
        e.shiftKey === parts.includes('shift') &&
        e.altKey === parts.includes('alt') &&
        e.key.toLowerCase() === key) {
      e.preventDefault();
      runScript(script);
      return;
    }
  }
});

/* ===== settings: script permissions ===== */
function loadScriptPermissions() {
  const list = document.getElementById('script-permissions-list');
  if (!list) return;
  const scripts = (V.scripts || []).filter(s => (s.permissions || []).length > 0);

  if (!scripts.length) {
    list.innerHTML = '<span class="muted small">' + esc(t('settings.no_script_permissions')) + '</span>';
    return;
  }

  list.innerHTML = scripts.map(s => `
    <div class="session-item">
      <div style="flex:1;min-width:0">
        <div class="bold small">${esc(s.name)}</div>
        <div class="muted small">${(s.permissions || []).map(p => esc(p.method + ' ' + p.path)).join(' · ')}</div>
      </div>
      <button class="btn btn-danger btn-small revoke-perms" data-id="${s.id}">${esc(t('settings.revoke'))}</button>
    </div>
  `).join('');

  list.querySelectorAll('.revoke-perms').forEach(btn => {
    btn.onclick = () => {
      const script = (V.scripts || []).find(s => s.id === btn.dataset.id);
      if (script) {
        script.permissions = [];
        sv();
        loadScriptPermissions();
        loadScripts();
        tt(t('settings.permissions_revoked'));
      }
    };
  });
}

document.getElementById('revoke-all-permissions').onclick = () => {
  if (!(V.scripts || []).some(s => (s.permissions || []).length)) return;
  showConfirmModal(t('settings.revoke_all'), t('settings.revoke_all_confirm'), () => {
    (V.scripts || []).forEach(s => { s.permissions = []; });
    sv();
    loadScriptPermissions();
    loadScripts();
    tt(t('settings.all_permissions_revoked'));
  });
};

window.addEventListener('i18n:changed', () => {
  if (V && K) {
    loadScripts();
    loadScriptPermissions();
  }
});

/* ===== bot selects helper ===== */
function populateAllBotSelects() {
  populateBotSelect();
  populateLogBotSelect();
  populatePresenceBotSelect();
  populateVoiceBotSelect();
  populateCleanBotSelect();
  populateChannelsBotSelect();
  populateMembersBotSelect();
  populateAllBotSelectsCf();
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
  // script permissions are deliberately excluded: an exported backup must not
  // carry pre-approved api scopes, re-prompt on the importing installation
  const snapshot = JSON.parse(JSON.stringify(V));
  (snapshot.scripts || []).forEach(s => { delete s.permissions; });
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
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
      // scripts and per-script storage travel with the vault; permissions do
      // not survive an export, but sanitize anyway for hand-made files
      V.scripts = (pendingImport.scripts || []).map(s => ({
        ...s,
        permissions: []
      }));
      V.scriptStorage = pendingImport.scriptStorage || {};
    } else {
      const names = new Set(V.bots.map(b => b.name));
      for (const r of recs) if (!names.has(r.name)) V.bots.push(r);
      const ids = new Set((V.scripts || []).map(s => s.id));
      for (const s of (pendingImport.scripts || [])) {
        if (!ids.has(s.id)) V.scripts.push({ ...s, permissions: [] });
      }
      if (pendingImport.scriptStorage) {
        V.scriptStorage = { ...(pendingImport.scriptStorage || {}), ...(V.scriptStorage || {}) };
      }
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