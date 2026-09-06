// runtime-worker.js — sandboxed execution realm for user scripts.
// served by the bridge with Content-Security-Policy:
//   default-src 'none'; script-src 'self' 'unsafe-eval'; connect-src 'none'; worker-src 'none'
// connect-src 'none' means no fetch/xhr/websocket/eventsource/cache call can
// leave this worker, no matter what the user code does. the only way out is
// postMessage, and the main thread enforces permissions on every call.

'use strict';

// belt-and-suspenders on top of the CSP: neutralise every network handle this
// realm exposes, so user code gets a clean error instead of a browser-level
// block (and prototype-recovery tricks find nothing)
for (const name of ['fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'importScripts', 'Worker', 'SharedWorker', 'caches']) {
  try {
    if (name in self) { self[name] = undefined; Object.defineProperty(self, name, { value: undefined, writable: false, configurable: false }); }
  } catch (e) { /* ignore */ }
}
try {
  const proto = Object.getPrototypeOf(self); // WorkerGlobalScope.prototype
  for (const name of ['fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'importScripts']) {
    if (name in proto) Object.defineProperty(proto, name, { value: undefined, configurable: false, writable: false });
  }
} catch (e) { /* ignore */ }

const pending = new Map();

function reply(id, ok, data, error) {
  self.postMessage({ t: 'result', id, ok, data, error });
}

const api = {
  getSelectedBot() {
    return new Promise((resolve, reject) => {
      const id = 'r' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      pending.set(id, { resolve, reject });
      self.postMessage({ t: 'call', id, kind: 'ctx_get', name: 'bot' });
    });
  },
  getSelectedChannel() {
    return new Promise((resolve, reject) => {
      const id = 'r' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      pending.set(id, { resolve, reject });
      self.postMessage({ t: 'call', id, kind: 'ctx_get', name: 'channel' });
    });
  },
  getSelectedGuild() {
    return new Promise((resolve, reject) => {
      const id = 'r' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      pending.set(id, { resolve, reject });
      self.postMessage({ t: 'call', id, kind: 'ctx_get', name: 'guild' });
    });
  },
  // the one sanctioned network path: the main thread asks the user, applies the
  // whitelist and the rate limit, then performs the call with the bot token
  // that never entered this realm
  discord(botId, path, method, body) {
    return new Promise((resolve, reject) => {
      const id = 'r' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      pending.set(id, { resolve, reject });
      self.postMessage({ t: 'call', id, kind: 'discord', botId: String(botId || ''), path: String(path || ''), method: String(method || 'GET').toUpperCase(), body: body === undefined ? null : body });
    });
  }
};

const ui = {
  toast(msg) { self.postMessage({ t: 'toast', msg: String(msg) }); },
  log(msg) { self.postMessage({ t: 'log', msg: String(msg) }); }
};

const utils = {
  sleep(ms) { return new Promise(r => setTimeout(r, Math.max(0, Number(ms) || 0))); },
  now() { return Date.now(); },
  random(min, max) { return Math.floor(Math.random() * ((Number(max) - Number(min)) + 1)) + Number(min); }
};

const storage = {
  get(key) {
    return new Promise((resolve, reject) => {
      const id = 'r' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      pending.set(id, { resolve, reject });
      self.postMessage({ t: 'call', id, kind: 'storage_get', key: String(key) });
    });
  },
  set(key, value) {
    return new Promise((resolve, reject) => {
      const id = 'r' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      pending.set(id, { resolve, reject });
      self.postMessage({ t: 'call', id, kind: 'storage_set', key: String(key), value: value === undefined ? null : value });
    });
  },
  delete(key) {
    return new Promise((resolve, reject) => {
      const id = 'r' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      pending.set(id, { resolve, reject });
      self.postMessage({ t: 'call', id, kind: 'storage_delete', key: String(key) });
    });
  }
};

self.onmessage = (e) => {
  const d = e.data || {};
  if (d.t === 'result') {
    const p = pending.get(d.id);
    if (!p) return;
    pending.delete(d.id);
    if (d.ok) p.resolve(d.data);
    else p.reject(new Error(d.error || 'call failed'));
    return;
  }
  if (d.t === 'execute') {
    try {
      // user code runs here; its only I/O surface is api/ui/utils/storage
      const fn = new Function('api', 'ui', 'utils', 'storage', '"use strict";\n' + String(d.code || ''));
      fn(api, ui, utils, storage);
    } catch (err) {
      self.postMessage({ t: 'log', msg: 'errore script: ' + err.message });
    }
  }
};

self.addEventListener('unhandledrejection', (ev) => {
  const reason = ev && ev.reason ? (ev.reason.message || String(ev.reason)) : 'unknown';
  self.postMessage({ t: 'log', msg: 'promise rifiutata: ' + reason });
});
