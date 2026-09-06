// runtime.js — main-thread side of the user-script sandbox.
// owns: worker lifecycle, 30s hard timeout (paused while a permission prompt
// is open), rate limit (10 api calls/min per run), permission prompts with
// explicit bot identity, per-script storage inside the encrypted vault,
// script console. app.js injects all app dependencies here via
// configureRuntime() — no import cycles, no globals.

const TIMEOUT_MS = 30000;
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60000;
const STORAGE_VALUE_MAX = 65536;
const STORAGE_KEYS_MAX = 50;

let deps = null; // { V, sv, db, K, tt, t, esc, injectIcons, getScriptPermissions, addScriptPermission, getSelected }
let worker = null;
let timer = null;
let timerDeadline = 0;
let timerRemaining = 0;
let rlCount = 0;
let rlWindowStart = Date.now();

const logLines = [];

export function configureRuntime(d) { deps = d; }
export function getConsoleLines() { return logLines.slice(-200); }

function pushConsole(msg) {
  logLines.push('[' + new Date().toLocaleTimeString() + '] ' + msg);
  if (logLines.length > 200) logLines.shift();
  const box = document.getElementById('script-console');
  if (box) {
    const line = document.createElement('div');
    line.className = 'console-line';
    line.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg;
    box.appendChild(line);
    box.scrollTop = box.scrollHeight;
  }
}

export function clearConsole() {
  logLines.length = 0;
  const box = document.getElementById('script-console');
  if (box) box.innerHTML = '';
}

function armTimeout() {
  clearTimeout(timer);
  timerDeadline = Date.now() + TIMEOUT_MS;
  timer = setTimeout(onTimeout, TIMEOUT_MS);
}

function pauseTimeout() {
  if (!timer) return;
  timerRemaining = Math.max(0, timerDeadline - Date.now());
  clearTimeout(timer);
  timer = null;
}

function resumeTimeout() {
  if (timer || !worker) return;
  timerDeadline = Date.now() + timerRemaining;
  timer = setTimeout(onTimeout, timerRemaining);
}

function stopTimeout() {
  clearTimeout(timer);
  timer = null;
  timerRemaining = 0;
}

function onTimeout() {
  pushConsole(deps.t('scripts.terminated_timeout'));
  killWorker();
}

function killWorker() {
  if (worker) {
    try { worker.terminate(); } catch (e) { /* ignore */ }
    worker = null;
  }
  stopTimeout();
}

function readNonce() {
  const meta = document.querySelector('meta[name="x-bridge-nonce"]');
  return meta ? meta.getAttribute('content') : null;
}

function pathKey(path) {
  // exact path + method matching; query string normalized away
  return String(path || '').split('?')[0];
}

function performDiscordCall(d, nonce) {
  return (async () => {
    try {
      const bot = (deps.V().bots || []).find(b => b.id === d.botId);
      if (!bot) { reply(d.id, false, null, deps.t('scripts.bot_not_found') + ' (' + d.botId + ')'); return; }
      const token = await deps.db(bot, deps.K());
      const method = String(d.method || 'GET').toUpperCase();
      const r = await fetch('/discord' + pathKey(d.path), {
        method,
        headers: { 'X-Bot-Token': token, 'X-Client-Nonce': nonce, 'Content-Type': 'application/json' },
        body: method === 'GET' || method === 'HEAD' ? undefined : JSON.stringify(d.body || {})
      });
      let data = null;
      try { data = await r.json(); } catch (e) { data = null; }
      if (!r.ok) {
        reply(d.id, false, null, (data && (data.message || data.error)) || ('HTTP ' + r.status));
        return;
      }
      reply(d.id, true, data);
    } catch (err) {
      reply(d.id, false, null, err.message);
    }
  })();
}

function showPermissionPrompt(script, d) {
  return new Promise((resolve) => {
    const bot = (deps.V().bots || []).find(b => b.id === d.botId);
    const botName = bot ? bot.name : ('id: ' + d.botId);
    const t = deps.t, esc = deps.esc;
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="close-modal" data-x><i data-icon="x"></i></button>
        <h3>${esc(t('scripts.perm_title'))}</h3>
        <p class="muted small">${esc(t('scripts.perm_desc'))}</p>
        <div class="perm-details">
          <div><span class="muted small">${esc(t('scripts.perm_script'))}:</span> <strong>${esc(script.name)}</strong></div>
          <div><span class="muted small">${esc(t('scripts.perm_bot'))}:</span> <strong>${esc(botName)}</strong></div>
          <div><span class="muted small">${esc(t('scripts.perm_action'))}:</span> <code class="mono">${esc(String(d.method || 'GET').toUpperCase())} ${esc(pathKey(d.path))}</code></div>
        </div>
        ${d.body ? `<pre class="perm-body">${esc(JSON.stringify(d.body, null, 2))}</pre>` : ''}
        <div class="modal-actions">
          <button class="btn btn-ghost" data-deny>${esc(t('scripts.perm_deny'))}</button>
          <button class="btn btn-ghost" data-once>${esc(t('scripts.perm_allow_once'))}</button>
          <button class="btn btn-primary" data-always>${esc(t('scripts.perm_allow_always'))}</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    deps.injectIcons(modal);
    const done = (granted, always) => { modal.remove(); resolve({ granted, always: !!always }); };
    modal.querySelector('[data-deny]').onclick = () => done(false);
    modal.querySelector('[data-once]').onclick = () => done(true);
    modal.querySelector('[data-always]').onclick = () => done(true, true);
    modal.querySelector('[data-x]').onclick = () => done(false);
  });
}

function reply(id, ok, data, error) {
  if (worker) worker.postMessage({ t: 'result', id, ok, data, error });
}

function onWorkerMessage(e, script, nonce) {
  const d = e.data || {};

  if (d.t === 'toast') { deps.tt(String(d.msg)); return; }
  if (d.t === 'log') { pushConsole(String(d.msg)); return; }
  if (d.t !== 'call') return;

  (async () => {
    try {
      if (d.kind === 'ctx_get') {
        reply(d.id, true, deps.getSelected(d.name));
        return;
      }

      if (d.kind === 'storage_get') {
        const store = (deps.V().scriptStorage || {})[script.id] || {};
        reply(d.id, true, store[d.key] !== undefined ? store[d.key] : null);
        return;
      }

      if (d.kind === 'storage_set') {
        const V = deps.V();
        if (!V.scriptStorage) V.scriptStorage = {};
        if (!V.scriptStorage[script.id]) V.scriptStorage[script.id] = {};
        const store = V.scriptStorage[script.id];
        let size = 0;
        try { size = JSON.stringify(d.value).length; } catch (err) { reply(d.id, false, null, deps.t('scripts.storage_bad_value')); return; }
        if (size > STORAGE_VALUE_MAX) { reply(d.id, false, null, deps.t('scripts.storage_too_big')); return; }
        if (!(d.key in store) && Object.keys(store).length >= STORAGE_KEYS_MAX) { reply(d.id, false, null, deps.t('scripts.storage_too_many')); return; }
        store[d.key] = d.value;
        deps.sv();
        reply(d.id, true, { ok: true });
        return;
      }

      if (d.kind === 'storage_delete') {
        const V = deps.V();
        if (V.scriptStorage && V.scriptStorage[script.id]) {
          delete V.scriptStorage[script.id][d.key];
          deps.sv();
        }
        reply(d.id, true, { ok: true });
        return;
      }

      if (d.kind === 'discord') {
        // rate limit: fixed window per run
        if (Date.now() - rlWindowStart > RATE_WINDOW_MS) { rlCount = 0; rlWindowStart = Date.now(); }
        if (rlCount >= RATE_LIMIT) {
          reply(d.id, false, null, deps.t('scripts.rate_limited'));
          return;
        }
        rlCount++;

        // whitelist fast path (exact path + method, query normalized away)
        if (deps.getScriptPermissions(script.id).some(p => p.path === pathKey(d.path) && p.method === d.method)) {
          await performDiscordCall(d, nonce);
          return;
        }

        // pause the 30s timeout while the user decides
        pauseTimeout();
        let decision;
        try {
          decision = await showPermissionPrompt(script, d);
        } finally {
          resumeTimeout();
        }

        if (!decision.granted) {
          pushConsole(deps.t('scripts.perm_denied') + ': ' + d.method + ' ' + d.path);
          reply(d.id, false, null, deps.t('scripts.perm_denied'));
          return;
        }
        if (decision.always) deps.addScriptPermission(script.id, { path: pathKey(d.path), method: d.method });
        await performDiscordCall(d, nonce);
        return;
      }

      reply(d.id, false, null, deps.t('scripts.unknown_op') + ': ' + d.kind);
    } catch (err) {
      reply(d.id, false, null, err.message);
    }
  })();
}

export function isRunning() { return !!worker; }

export function executeScript(script) {
  if (!deps) { console.error('runtime not configured'); return; }
  const nonce = readNonce();
  if (!nonce) {
    pushConsole(deps.t('scripts.no_nonce'));
    return;
  }

  if (worker) {
    pushConsole(deps.t('scripts.run_superseded'));
    killWorker();
  }

  rlCount = 0;
  rlWindowStart = Date.now();

  worker = new Worker('/runtime-worker.js');
  worker.onmessage = (e) => onWorkerMessage(e, script, nonce);
  worker.onerror = (e) => {
    pushConsole(deps.t('scripts.worker_error') + ' ' + (e.message || '?'));
    killWorker();
  };

  armTimeout();
  worker.postMessage({ t: 'execute', code: script.code || '' });
  pushConsole('▶ ' + (script.name || 'script'));
}
