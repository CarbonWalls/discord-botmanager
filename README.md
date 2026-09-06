# bot manager

a self-hosted, local-first control panel for managing discord bots — token vault with encrypted backups, message sending (markdown, embeds, attachments, voice messages), live message archiving, presence control, voice channel playback, channel management, recurring jobs, member browsing and sandboxed automation scripts. everything runs on your machine; tokens are encrypted at rest and never leave the device.

> [!warning]
> this tool automates actions on discord using bot tokens. use it only on bots and servers you own or are authorized to moderate. bulk deletion, cloning channels, and automated messaging can violate server rules or discord's terms of service. you are responsible for how you use it.

---

## features

| module | what it does |
| --- | --- |
| 🔐 **vault** | stores bot tokens encrypted with a master password (aes-256-gcm + pbkdf2). test tokens, generate invite links, export/import encrypted backups, multi-select bots for bulk actions. |
| ✉️ **send** | send messages to any channel of any server the bot is in. full markdown preview, rich embeds builder, image/video attachments, voice messages (upload or browser recording). |
| 🗄 **archive** | live capture of `MESSAGE_CREATE` / `UPDATE` / `DELETE` events over the gateway, plus on-demand fetch via rest. deleted messages are flagged, not lost. |
| 🟢 **presence** | set online/idle/dnd/invisible status and custom activity over a persistent gateway websocket session. |
| 🔊 **voice** | join voice channels, self-mute/deafen, auto-leave timer, and play audio files directly into the channel (voice gateway + udp + opus, with DAVE end-to-end encryption). |
| 🧹 **cleaner** | wipe all messages from a channel (bulk-delete for recent ones, one-by-one for older than 14 days) or clone-and-recreate a channel. |
| #️⃣ **channels** | browse channels per server with icons/sorting, back up a channel's messages to json, clone or delete channels. |
| ⏰ **scheduler** | recurring jobs (send message, change presence) running in the bridge with live status dots. |
| 👥 **members** | full member list per server with search, role filters and profile links (needs the `guild members` intent). |
| 🧩 **scripts** | sandboxed user scripts (web worker): explicit per-call permission prompts showing which bot acts, revocable scopes, 10 calls/min, per-script storage in the vault. |
| ⚙️ **settings** | auto-lock timer, language (en/it/zh), theme (light/dark/system), master password change, script permission revocation, vault reset. |

---

## how it works

the app is two pieces that talk over local http: a static browser frontend (`www/`) and a small node backend (`bridge.js`) that proxies discord and owns the gateway/voice connections.

- **bridge.js** is a zero-framework node server bound to `127.0.0.1:8789`. it serves the frontend, proxies discord rest calls (injecting `Authorization: Bot <token>` from the `x-bot-token` header), holds gateway websocket sessions in memory, and implements the discord voice transport by hand (voice ws → ip discovery → udp → aes-256-gcm rtp).
- **www/** is a dependency-free single-page app. token encryption happens entirely in the browser with the web crypto api; the backend only ever sees tokens for the duration of an api call.

### security model

- master password → **pbkdf2-sha256, 100 000 iterations**, random 16-byte salt
- tokens encrypted with **aes-256-gcm**, random 12-byte iv per entry
- a verifier blob (`vault-ok`) confirms the password without storing it
- vault lives in `localStorage` (`v` key) — nothing is sent to any server
- auto-lock: never / 1 / 5 / 15 minutes of inactivity
- web crypto requires a secure context: the app must run on **localhost or https**

---

## requirements

- **node.js 18+** (global `fetch` is used)
- `npm install` pulls everything: **ws** (gateway/voice websockets), **ffmpeg-static** (audio transcoding), plus the voice stack (`@discordjs/voice`, `@snazzah/davey`, `opusscript`, `tweetnacl`, `fluent-ffmpeg`)
- (optional) system **ffmpeg** on `PATH` — used by the `/gateway/tools/transcode-voice` endpoint

---

## bot setup

### 1. create the application

- go to https://discord.com/developers/applications
- **new application** → give it a name (this becomes the default bot username)
- switch to the **bot** tab → **reset token** → copy the token. this is what you paste into the vault. if you lose it, you have to reset it: the bot stays in every server it's in, but the token you had is dead.
- under **authorization flow**, leave **public bot** off unless you actually want anyone to be able to invite it.
- under **privileged gateway intents**, toggle the ones listed in the next section.

### 2. intents the bot needs

the bridge always connects with `guilds` (1 << 0), `message content` (1 << 9), `guild messages` (1 << 15) and `guild voice states` (1 << 7) — and adds `guild members` (1 << 1) when the portal toggle is on.

| intent | privileged? | what it unlocks |
| --- | --- | --- |
| `message content` | **yes** | message bodies in gateway events and rest fetches. without it the archive captures `MESSAGE_CREATE` but `content` is empty. |
| `guild messages` | no (default on) | the archive's live capture. already enabled on new bots. |
| `guild members` | **yes** | the **members** tab (list/search/filter). the app handles a 4014 disconnect gracefully if this isn't approved — the bot still connects, the tab just shows a clear error. |
| `presence` | **yes** | receiving *other users'* presence updates. not strictly needed — the bot's own presence works regardless — and the app never requests it. leave it off. |

for bots in **<100 servers**, the toggles just work. for bots in 100+ servers, discord requires approval via the form in the portal — for personal use on your own servers this is usually instant or unnecessary.

### 3. invite the bot to your server

the cleanest way is the oauth2 url generator, not the in-app **invite** button (which requests a fixed, messaging-only set).

1. developer portal → **oauth2 → url generator**
2. **scopes**: check `bot` and `applications.commands`
3. **bot permissions**: select only what you actually need. a sensible full-feature set:

| category | permissions |
| --- | --- |
| text | view channels, send messages, manage messages, embed links, attach files, read message history, use external emojis, add reactions |
| voice | connect, speak, use voice activity, mute members, deafen members, move members |
| moderation | kick members, ban members, manage nicknames, moderate members (timeout), manage roles, manage channels, manage webhooks |
| general | view audit log |

4. copy the generated url, open it in your browser, pick the server, authorize.

> the in-app **invite** button in the vault uses permission integer `70368744295424` — that decodes to send messages, manage messages, read history, mention everyone, external emojis, send voice messages. fine for sending/archiving, but it has **no voice, no moderation, no channel management** — use the generator above (or the combined integer `1100517600470`) if you want every tab to work.

### 4. role position matters

for moderation actions (nick, kick, ban, timeout, role assignment, role removal) to work, the bot's highest role must sit **above** the target user's highest role in the server's role list. if actions fail with a `hierarchy` error, go to **server settings → roles** and drag the bot's role up.

the bot also cannot act on the server owner, and cannot ban/kick users with the `administrator` permission regardless of role position — that's a discord-side restriction, not an app bug.

### 5. verify it works

- add the bot to the vault, click **test** — the dot should turn green.
- go to **presence**, select the bot, set a status — the bot should come online in discord.
- open **archive**, pick a server and a text channel, click **load rest** — you should see messages. if bodies are empty, the `message content` intent is off.
- open **members**, pick the bot and server, fetch — the list should load (needs the `guild members` toggle; otherwise you get the explicit missing-intent error).
- open **voice**, join a channel, play a short audio file — you should hear it in discord (needs `connect` + `speak`).

---

## installation

### Web mode (original)

```bash
git clone https://codeberg.org/72ubdjsjksknsbxb/bot-manager.git
cd bot-manager
npm install
node bridge.js            # PORT=8789 by default, override with PORT=<port>
```

then open **http://127.0.0.1:8789**.

expected output:

```
bridge running on http://127.0.0.1:8789
```

> if you see `ws module not installed`, run `npm i ws`. gateway features are disabled without it.

### Electron desktop app

```bash
git clone https://codeberg.org/72ubdjsjksknsbxb/bot-manager.git
cd bot-manager
npm install
npm run build        # creates NSIS installer in dist/
# or
npm run build:portable   # creates portable .exe in dist/
```

The Electron app bundles everything and runs the bridge internally on `http://127.0.0.1:8789`.

> **Requires Node.js 18+** (global `fetch` is used)

### project structure

- `bridge.js` — node server: static file host, discord rest proxy, gateway sessions, voice transport, scheduler, archive, i18n
- `www/index.html` — spa markup (all tabs + modals)
- `www/app.js` — vault crypto, ui logic, gateway/voice client
- `www/runtime.js` + `www/runtime-worker.js` — user-script sandbox (permission proxy + isolated worker realm)
- `www/styles.css` — theme + components
- `www/locales/` — `en.json`, `it.json`, `zh.json`
- `data/messages/` — per-channel archives (`<channel_id>.json`) and channel backups (`backups/`), created at runtime
- `data/messages/scheduled-jobs.json` — persisted scheduler jobs
- `data/voice/` — temp files for transcoding (created at runtime)

---

## usage guide

### first run

1. open the app → **create vault**: choose a master password (min 8 chars). losing it means losing every stored token.
2. **tokens → add bot**: give it a name and paste the bot token.
3. **test** validates the token against `/users/@me`; the status dot turns green/red.

### send

- pick a bot → pick a server → pick a text channel, or switch to **manual id** and paste a channel id.
- content supports discord markdown, rendered live in the preview: `**bold**`, `*italic*`, `__underline__`, `~~strike~~`, `` `code` ``, code blocks, `> quotes`, lists, `||spoiler||` (click to reveal in preview), links, mentions.
- **embed**: title (+url), description, color, timestamp, author, image, thumbnail, footer, and inline fields.
- **attachment**: one image/video file, sent via multipart `payload_json`.
- **voice message**: upload an `.ogg/.opus` file or record directly in the browser (requires a browser that encodes ogg/opus). waveform can be generated from the audio (`auto`), constant, or flat; duration and waveform are required by discord.

### archive

- **load rest** fetches the last 50 messages via rest api.
- **load archive** reads events captured by the gateway while a presence session for that bot was connected (`data/messages/<channel_id>.json`, capped at 500 per channel).
- deleted messages stay visible with a `deleted` badge; edited ones show `(edited)`.
- clicking an author/avatar opens the **profile modal**: banner, avatar, roles, creation/join dates, and moderation actions (nickname, timeout, kick, ban) — subject to the bot's permissions and role hierarchy.

### presence

selecting a bot and applying a status opens a persistent gateway session (`/gateway/<id>/connect`). status survives page reloads as long as the node process runs. last used status/activity is cached in `localStorage`. **disconnect** closes the websocket.

### voice

1. pick bot → server → voice channel.
2. **join** sends op 4, waits for the matching voice state + server packets, then opens the voice websocket and runs the handshake (identify → ready → select protocol → udp discovery → DAVE key exchange). self-mute/deafen changes re-send the state live.
3. **play** reads the audio file, transcodes it to 48 kHz stereo opus (64 kbps, 20 ms frames) with ffmpeg, then streams packets over udp — DAVE end-to-end encrypted once the MLS group is ready, wrapped in transport encryption (`aead_aes256_gcm_rtpsize`, with `aead_xchacha20_poly1305_rtpsize` as fallback).
4. **auto-leave** (minutes) schedules an automatic disconnect after joining.

> voice uses discord's **DAVE** protocol for end-to-end encryption. the MLS group only forms once a second member is present, so a lone bot in an e2ee channel gets dropped by discord after a short idle — that's expected, not a bug. transport mode prefers `aead_aes256_gcm_rtpsize`.

### cleaner

- **delete all**: scans the whole channel, bulk-deletes batches < 14 days old (with rate-limit-friendly delays), deletes older messages individually. progress bar included.
- **clone**: recreates the channel with the same name/type/topic/permissions/position, then deletes the original. nuclear option for cleaning channels with pinned/history constraints.

### settings

- **auto lock**: 1 / 5 / 15 min or never.
- **language**: loaded from `www/locales/*.json` at runtime — no rebuild needed.
- **theme**: light / dark / system (`prefers-color-scheme` + `data-theme` override).
- **script permissions**: every scope a script was granted with "allow always", per script, with single and global revoke.
- **vault export / import**: encrypted backup of the whole vault (bots, scripts, script storage). import merges or replaces; script *permissions* are never exported, so they re-prompt on the importing device.
- **change master password**: decrypts every token with the old key and re-encrypts with a fresh salt/key.
- **reset vault**: wipes `localStorage` and returns to the creation screen.

### scripts

scripts are little automation snippets (javascript) that run in a sandboxed web worker with **no network access and no token**. the only way for a script to touch discord is `api.discord(botId, path, method, body)` — and every distinct call goes through a permission prompt that shows the script name, **which bot identity** it would act as, and the exact `METHOD /path`, plus the payload. "allow always" whitelists exactly that path + method (query strings normalized away); scopes are revocable in settings. limits: 10 api calls/minute, 30s hard timeout (paused while a prompt is open), per-script storage inside the vault (50 keys × 64kb). three built-in examples cover messaging, presence and storage; hotkeys (modifier + key) can trigger scripts while the app is unlocked.

---

## http api reference

all routes on `http://127.0.0.1:8789`. every `/gateway/*` and `/discord/*` route requires the per-boot `x-client-nonce` header — the bridge injects it into the page it serves, so the frontend works transparently. it exists so that third-party scripts running inside the app's sandboxed workers cannot reach the api at all. discord routes additionally need the `x-bot-token` header.

### gateway / sessions

| method | route | body | description |
| --- | --- | --- | --- |
| `POST` | `/gateway/:botId/connect` | `{ token }` | open (or reuse) a gateway session |
| `POST` | `/gateway/:botId/presence` | `{ status, activity? }` | update presence (op 3) |
| `POST` | `/gateway/:botId/disconnect` | – | close the session |
| `GET` | `/gateway/status` | – | list sessions (user, presence, voice playing) |
| `POST` | `/gateway/:botId/members/:guildId` | `{ token }` | member list via rest pagination; returns `{ members, hasIntent }`. needs no gateway session — the 403 gate is the portal intent |
| `GET` | `/gateway/rate-limits` | – | live rate-limit buckets observed by the bridge |

### scheduler

| method | route | body | description |
| --- | --- | --- | --- |
| `GET` | `/gateway/scheduler/jobs` | – | list jobs (tokens masked) |
| `POST` | `/gateway/scheduler/job/:id` | `{ name, type, intervalMs, payload }` | create/update; `type` = `send_message` \| `change_presence`, min interval 10s |
| `POST` | `/gateway/scheduler/job/:id/toggle` | – | pause/resume |
| `DELETE` | `/gateway/scheduler/job/:id` | – | delete |

### voice

| method | route | body | description |
| --- | --- | --- | --- |
| `POST` | `/gateway/:botId/voice/join` | `{ guild_id, channel_id, self_mute?, self_deaf?, auto_leave_seconds?, timeout_ms? }` | join/move channel |
| `POST` | `/gateway/:botId/voice/leave` | – | disconnect from voice |
| `GET` | `/gateway/:botId/voice/status` | – | current voice state + transport status |
| `POST` | `/gateway/:botId/voice/play` | `{ audio_base64, filename, guild_id?, channel_id? }` | transcode + stream audio |
| `POST` | `/gateway/:botId/voice/stop` | – | stop playback |
| `POST` | `/gateway/tools/transcode-voice` | `{ audio_base64, filename }` | standalone transcode → ogg/opus base64 |

### channels, backups, webhooks & archive

| method | route | body | description |
| --- | --- | --- | --- |
| `GET` | `/archive/:channelId` | – | stored gateway-captured messages for a channel |
| `POST` | `/gateway/backup/channel/:channelId` | `{ token }` | fetch full channel history via rest → `data/messages/backups/*.json` |
| `POST` | `/gateway/webhook/:webhookId/:token` | webhook payload | webhook execution through the bridge (webhook endpoints reject browser cors) |
| `GET` | `/i18n/languages` | – | available locale files + metadata |
| `GET` | `/i18n/locales/:code` | – | full locale json |

### discord proxy

any path under `/discord/...` is forwarded to `https://discord.com/api/v10/...` with the bot token attached, and rate-limit headers (`x-ratelimit-remaining`, `x-ratelimit-reset`, `x-ratelimit-bucket`) are passed through. observed buckets feed the **presence → rate limit monitor**.

```bash
NONCE=$(curl -s http://127.0.0.1:8789/ | grep -o 'x-bridge-nonce" content="[a-f0-9]*' | cut -d'"' -f3)
curl http://127.0.0.1:8789/discord/users/@me \
  -H "x-bot-token: YOUR_BOT_TOKEN" -H "x-client-nonce: $NONCE"
```

---

## adding a language

create `www/locales/<code>.json`:

```json
{
  "meta": { "code": "es", "name": "spanish", "native": "español", "flag": "🇪🇸" },
  "strings": {
    "app.title": "bot manager",
    "unlock.create_title": "crear bóveda"
  }
}
```

restart the bridge and the language appears automatically in **settings → language**. missing keys fall back to `[missing:key]` and log to the console, so you can spot gaps while translating. `en.json` is the complete reference.

## theming

colors are css custom properties in `www/styles.css` (`:root` for light, `[data-theme="dark"]` + `prefers-color-scheme` block for dark). the theme picker writes to `localStorage` and toggles `data-theme` on `<html>`; `auto` removes the attribute and defers to the os.

---

## troubleshooting

| symptom | cause / fix |
| --- | --- |
| `Web Crypto API unavailable` | you opened the app over plain http on a non-localhost address. use `127.0.0.1:8789` or serve over https. |
| `gateway connect timeout (30s)` | invalid token, no network, or the bot was banned from everywhere. test the token from the vault first. |
| archive stays empty | gateway **guild messages** intent missing (it's on by default — check the portal), or no presence session was connected while messages happened: live capture only records while the bot's gateway session runs. |
| message bodies empty in the archive | the **message content** privileged intent is off in the dev portal. |
| members tab shows a missing-intent error | expected without the **server members intent** toggle: the first connect attempt gets closed with 4014 and the bot silently falls back to a reduced-intent session. approve the intent in the portal, then restart the bridge so the next identify includes it. |
| everything suddenly returns `invalid session nonce` (403) | the bridge process was restarted while the page stayed open — it holds the old per-boot nonce. reload the page. |
| `DAVE mode not supported by server` | the voice channel isn't DAVE-capable or discord offered no usable mode; retry, or update `@snazzah/davey`. |
| `ffmpeg binary not found` | `ffmpeg-static` missing (`npm i ffmpeg-static`); the transcode endpoint additionally needs system `ffmpeg` on `PATH`. |
| recording tab unsupported | the browser can't encode ogg/opus via `MediaRecorder` (use chrome/edge/firefox desktop). |
| vault wiped after browser data cleanup | the vault lives in `localStorage` — clearing site data deletes it. keep your own token backups. |
| **how to completely reset the app** | see **[Resetting App Data](#resetting-app-data)** below. |

---

## resetting app data

To start completely fresh (as if newly installed):

### Web mode
1. Open the app at `http://127.0.0.1:8789`
2. Open DevTools (`F12`) → **Application** tab → **Local Storage** → `http://127.0.0.1:8789`
3. Right-click → **Clear** (or delete the `v` key specifically)
4. Also clear **Session Storage** and **IndexedDB** if present
5. Reload the page

### Electron desktop app
The app stores data in the OS user data directory:

| OS | Path |
|---|---|
| Windows | `%APPDATA%\Discord Manager\` |
| macOS | `~/Library/Application Support/Discord Manager/` |
| Linux | `~/.config/Discord Manager/` |

Delete the entire `Discord Manager` folder to reset everything (vault, settings, cached presence, message archives, voice temp files).

**Or from within the app:**
1. Open **Settings** → **Danger Zone** → **Reset Vault** (deletes tokens only)
2. For a full reset, close the app and delete the folder above

### Bridge server data
The bridge also stores message archives and voice temp files in:
- Web mode: `./data/messages/` and `./data/voice/` (relative to `bridge.js`)
- Electron: inside the user data folder above (`data/messages/`, `data/voice/`)

---

## roadmap ideas

- [x] scheduled messages / cron — shipped as the **scheduler** tab (interval jobs)
- [x] configurable port — `PORT=<port> node bridge.js`
- [x] per-bot bulk actions — multi-select in the vault
- [x] sandboxed automation scripts — the **scripts** tab
- [ ] multiple attachments per message
- [ ] export archive as json/csv/html
- [ ] per-bot notes and tag filtering in the vault
- [ ] configurable bind address (currently `127.0.0.1` only, by design)

## disclaimer

provided as-is, without warranty of any kind. automating discord accounts and mass-deleting content can break server rules and discord's terms of service. use responsibly, on bots and communities you control.