# bot manager

a self-hosted, local-first control panel for managing discord bots — token vault, message sending (markdown, embeds, attachments, voice messages), live message archiving, presence control, voice channel playback, and bulk channel cleaning. everything runs on your machine; tokens are encrypted at rest and never leave the device.

> [!warning]
> this tool automates actions on discord using bot tokens. use it only on bots and servers you own or are authorized to moderate. bulk deletion, cloning channels, and automated messaging can violate server rules or discord's terms of service. you are responsible for how you use it.

---

## features

| module | what it does |
| --- | --- |
| 🔐 **vault** | stores bot tokens encrypted with a master password (aes-256-gcm + pbkdf2). test tokens, generate invite links, delete entries. |
| ✉️ **send** | send messages to any channel of any server the bot is in. full markdown preview, rich embeds builder, image/video attachments, voice messages (upload or browser recording). |
| 🗄 **archive** | live capture of `MESSAGE_CREATE` / `UPDATE` / `DELETE` events over the gateway, plus on-demand fetch via rest. deleted messages are flagged, not lost. |
| 🟢 **presence** | set online/idle/dnd/invisible status and custom activity over a persistent gateway websocket session. |
| 🔊 **voice** | join voice channels, self-mute/deafen, auto-leave timer, and play audio files directly into the channel (raw voice gateway + udp + opus implementation). |
| 🧹 **cleaner** | wipe all messages from a channel (bulk-delete for recent ones, one-by-one for older than 14 days) or clone-and-recreate a channel. |
| ⚙️ **settings** | auto-lock timer, language (en/it/zh), theme (light/dark/system), master password change, vault reset. |

## screenshots

<!-- replace with real screenshots -->
| unlock screen | vault | send + preview |
| --- | --- | --- |
| ![unlock](docs/screens/unlock.png) | ![vault](docs/screens/vault.png) | ![send](docs/screens/send.png) |

---

## how it works

```
┌────────────────────────────┐        ┌─────────────────────────────┐
│  browser (www/)            │        │  bridge.js (node)           │
│  ─ encrypted vault (ls)    │  http  │  ─ static file server       │
│  ─ web crypto aes-256-gcm  │◄──────►│  ─ discord rest proxy       │
│  ─ vanilla js spa          │ :8787  │  ─ gateway sessions (ws)    │
└────────────────────────────┘        │  ─ voice (ws + udp + opus)  │
                                      │  ─ archive (data/messages/) │
                                      └─────────────────────────────┘
```

- **bridge.js** is a zero-framework node server bound to `127.0.0.1:8787`. it serves the frontend, proxies discord rest calls (injecting `Authorization: Bot <token>` from the `x-bot-token` header), holds gateway websocket sessions in memory, and implements the discord voice transport by hand (voice ws → ip discovery → udp → aes-256-gcm rtp).
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
- **ws** — gateway and voice websockets
- **ffmpeg-static** — audio transcoding for voice playback
- (optional) system **ffmpeg** on `PATH` — used by the `/gateway/tools/transcode-voice` endpoint

### discord developer portal setup

the gateway connects with these intents:

| intent | privileged? | needed for |
| --- | --- | --- |
| `guilds` (1 << 0) | no | server/channel lists |
| `voice states` (1 << 7) | no | voice join/leave |
| `guild voice states` (1 << 9) | no | voice state tracking |
| `guild messages` (1 << 15) | **yes** | archive capture |

enable **`guild messages`** (and **`message content`**, if you want message bodies in events) under *bot → privileged gateway intents* for each application, otherwise the archive will receive nothing.

the invite flow requests permission integer `70368744295424` (administrator-ish set: send, manage messages, manage channels, connect, speak…). you can also invite bots manually via the **invite** button in the vault.

---

## installation

```bash
git clone https://github.com/CarbonWalls/discord-botmanager.git
cd bot-manager
npm install ws ffmpeg-static
node bridge.js
```

then open **http://127.0.0.1:8787**.

expected output:

```
bridge attivo su http://127.0.0.1:8787
```

> if you see `modulo ws non installato`, run `npm i ws`. gateway features are disabled without it.

### project structure

```
bot-manager/
├── bridge.js              # node server: static, discord proxy, gateway, voice, archive, i18n
├── data/
│   ├── messages/          # per-channel archives: <channel_id>.json (created at runtime)
│   └── voice/             # temp files for transcoding (created at runtime)
└── www/
    ├── index.html         # spa markup (all tabs + modals)
    ├── app.js             # vault crypto, ui logic, gateway/voice client
    ├── styles.css         # theme + components
    └── locales/           # en.json, it.json, zh.json
```

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
2. **join** sends op 4 and waits for the voice state ack (12s timeout). self-mute/deafen changes re-send the state live.
3. **play** reads the audio file, transcodes it to 48 kHz stereo opus (64 kbps, 20 ms frames) with ffmpeg, then streams packets over udp with `aead_aes256_gcm_rtpsize` encryption.
4. **auto-leave** (minutes) schedules an automatic disconnect after joining.

> the voice stack requires the `aead_aes256_gcm_rtpsize` encryption mode; if discord negotiates something else, join/play will report it.

### cleaner

- **delete all**: scans the whole channel, bulk-deletes batches < 14 days old (with rate-limit-friendly delays), deletes older messages individually. progress bar included.
- **clone**: recreates the channel with the same name/type/topic/permissions/position, then deletes the original. nuclear option for cleaning channels with pinned/history constraints.

### settings

- **auto lock**: 1 / 5 / 15 min or never.
- **language**: loaded from `www/locales/*.json` at runtime — no rebuild needed.
- **theme**: light / dark / system (`prefers-color-scheme` + `data-theme` override).
- **change master password**: decrypts every token with the old key and re-encrypts with a fresh salt/key.
- **reset vault**: wipes `localStorage` and returns to the creation screen.

---

## http api reference

all routes on `http://127.0.0.1:8787`. discord routes need the `x-bot-token` header.

### gateway / sessions

| method | route | body | description |
| --- | --- | --- | --- |
| `POST` | `/gateway/:botId/connect` | `{ token }` | open (or reuse) a gateway session |
| `POST` | `/gateway/:botId/presence` | `{ status, activity? }` | update presence (op 3) |
| `POST` | `/gateway/:botId/disconnect` | – | close the session |
| `GET` | `/gateway/status` | – | list sessions (user, presence, voice playing) |

### voice

| method | route | body | description |
| --- | --- | --- | --- |
| `POST` | `/gateway/:botId/voice/join` | `{ guild_id, channel_id, self_mute?, self_deaf?, auto_leave_seconds?, timeout_ms? }` | join/move channel |
| `POST` | `/gateway/:botId/voice/leave` | – | disconnect from voice |
| `GET` | `/gateway/:botId/voice/status` | – | current voice state + transport status |
| `POST` | `/gateway/:botId/voice/play` | `{ audio_base64, filename, guild_id?, channel_id? }` | transcode + stream audio |
| `POST` | `/gateway/:botId/voice/stop` | – | stop playback |
| `POST` | `/gateway/tools/transcode-voice` | `{ audio_base64, filename }` | standalone transcode → ogg/opus base64 |

### archive & i18n

| method | route | description |
| --- | --- | --- |
| `GET` | `/archive/:channelId` | stored gateway-captured messages for a channel |
| `GET` | `/i18n/languages` | available locale files + metadata |
| `GET` | `/i18n/locales/:code` | full locale json |

### discord proxy

any path under `/discord/...` is forwarded to `https://discord.com/api/v10/...` with the bot token attached, and rate-limit headers (`x-ratelimit-remaining`, `x-ratelimit-reset`) are passed through.

```bash
curl http://127.0.0.1:8787/discord/users/@me \
  -H "x-bot-token: YOUR_BOT_TOKEN"
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
| `Web Crypto API unavailable` | you opened the app over plain http on a non-localhost address. use `127.0.0.1:8787` or serve over https. |
| `timeout connessione gateway (30s)` | invalid token, no network, or the bot was banned from everywhere. test the token from the vault first. |
| archive stays empty | the **guild messages** privileged intent is off in the dev portal. |
| `modalità voice non supportata` | discord negotiated a mode other than `aead_aes256_gcm_rtpsize`; retry or update. |
| `crypto is not defined` / `dgram is not defined` during voice playback | add `const crypto = require('crypto')` and `const dgram = require('dgram')` at the top of `bridge.js` if they're missing in your copy. |
| `ffmpeg binary not found` | `ffmpeg-static` missing (`npm i ffmpeg-static`); the transcode endpoint additionally needs system `ffmpeg` on `PATH`. |
| recording tab unsupported | the browser can't encode ogg/opus via `MediaRecorder` (use chrome/edge/firefox desktop). |
| vault wiped after browser data cleanup | the vault lives in `localStorage` — clearing site data deletes it. keep your own token backups. |

---

## roadmap ideas

- [ ] multiple attachments per message
- [ ] scheduled messages / cron
- [ ] export archive as json/csv/html
- [ ] per-bot notes and tag filtering in the vault
- [ ] configurable port / bind address

## disclaimer

provided as-is, without warranty of any kind. automating discord accounts and mass-deleting content can break server rules and discord's terms of service. use responsibly, on bots and communities you control.