# Discord Manager - UI Debugging Package for External LLM

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  Electron Main Process (electron/main.js)                       │
│  - Spawns bridge.js as child process                            │
│  - Loads UI via mainWindow.loadURL('http://127.0.0.1:8787/')    │
│  - Disables native menu: Menu.setApplicationMenu(null)          │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP/WebSocket
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  Bridge Server (bridge.js) - Node.js HTTP Server on :8787       │
│  - Serves static files from WWW_DIR (www/)                      │
│  - Proxies Discord REST API calls                               │
│  - Manages Discord Gateway WebSocket connections                │
│  - Handles voice (join/leave/play/stop)                         │
│  - Serves /i18n/languages and /i18n/locales/:code endpoints     │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  Frontend (www/index.html + www/app.js + www/styles.css)        │
│  - Modern tab-based SPA                                         │
│  - Loads translations from /i18n/locales/:code                  │
│  - Calls bridge endpoints for all Discord operations            │
└─────────────────────────────────────────────────────────────────┘
```

## Key Files to Review

### 1. Bridge.js - Static File Serving (lines 100-140)
```javascript
function serveStatic(res, pathname) {
  const rel = pathname === '/' ? 'index.html' : pathname.slice(1);
  const file = path.normalize(path.join(WWW, rel));
  if (!file.startsWith(WWW + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    return send(res, 404, 'text/plain', '404');
  }
  send(res, 200, MIME[path.extname(file)] || 'application/octet-stream', fs.readFileSync(file));
}
```

### 2. Bridge.js - i18n Endpoints (lines 780-810)
```javascript
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
```

### 3. App.js - i18n Initialization (lines 110-180)
```javascript
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
```

### 4. HTML Structure - Key Elements
The new `index.html` expects these elements to exist:
- `#main-tabs` - tab navigation container
- `.panel` sections with IDs: `panel-unlock`, `panel-vault`, `panel-send`, `panel-logs`, `panel-presence`, `panel-voice`, `panel-cleaner`, `panel-settings`
- `#lang-select` and `#lang-setting` - language dropdowns
- `#theme-toggle` - theme toggle button
- `#lock-btn` - lock vault button
- `#add-bot-btn` - add bot button in sidebar
- Various form elements with `data-i18n` attributes

## Common Failure Points

### 1. **CRITICAL**: `app.js` uses `BASE = 'http://127.0.0.1:8787'` but in Electron, the bridge runs on the same port. Check if bridge is actually running on 8787.

### 2. **CRITICAL**: The `api()` function in app.js sends `X-Bot-Token` header, but for i18n endpoints it doesn't need auth. Check if bridge CORS allows requests.

### 3. **CRITICAL**: `serveStatic` in bridge.js only serves files under `WWW` directory. If `WWW_DIR` env var points wrong, 404s occur.

### 4. **CRITICAL**: The new `app.js` calls `initI18n()` which fetches `/i18n/languages` BEFORE showing UI. If this fails, `document.documentElement.classList.remove('i18n-loading')` still runs but `T` is empty → all translations missing.

### 5. **CRITICAL**: In Electron dev mode, `WWW_DIR` is set to `getWwwPath()` which resolves to `discord-manager/www`. But if the bridge process cwd is different, path resolution fails.

### 6. The new `app.js` has `initAll()` calling `initI18n()` then `initUnlock()`. If vault exists, it shows unlock form; if not, create vault form. Check if `lv()` (localStorage.getItem('v')) works in Electron context.

## Debugging Checklist for External LLM

1. **Open DevTools in Electron** (F12) → Console tab → Look for:
   - Failed fetches to `http://127.0.0.1:8787/i18n/languages`
   - CORS errors
   - 404s for static files (CSS, JS)
   - JavaScript errors in app.js

2. **Network tab** → Check:
   - `/i18n/languages` returns 200 with `{languages: [...]}`
   - `/i18n/locales/en` returns full translation object
   - `styles.css` loads with 200
   - `app.js` loads with 200

3. **Application tab** → Local Storage → Check if `v` (vault) exists

4. **Bridge console logs** (in terminal running Electron):
   - `[Bridge] bridge attivo su http://127.0.0.1:8787`
   - Any `[Bridge Error]` lines

## Quick Test Commands

```bash
# Test bridge endpoints directly (run while Electron app is open)
curl http://127.0.0.1:8787/i18n/languages
curl http://127.0.0.1:8787/i18n/locales/en
curl http://127.0.0.1:8787/styles.css | head -20
```

## Files to Provide to External LLM

If you need to share code, the minimal set is:
1. `bridge.js` (full - it's the backend)
2. `www/app.js` (full - frontend logic)
3. `www/index.html` (structure)
4. `www/styles.css` (if styling issues)
5. `electron/main.js` (Electron setup)
6. `www/locales/en.json` (translation keys)

## Suspected Root Cause

The new `app.js` was a **complete rewrite** but `bridge.js` wasn't updated to match. Specifically:
- Old `app.js` used different element IDs and flow
- New `app.js` expects different API response formats
- Bridge's `serveStatic` might not handle the new file structure
- The `initI18n()` flow might fail silently if bridge endpoints changed

**Recommendation**: Have the external LLM compare the OLD `app.js` (in `www-backup-*/`) with the NEW `app.js` and verify `bridge.js` supports all endpoints the new frontend calls.