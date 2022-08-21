# Spotistatus

## Before installation

1. Install `Node.js` 16 LTS
2. Install `Git`

## Installation

Clone repository:

```bash
git clone https://github.com/ttcpip/spotistatus.git
```

Install dependencies:

```bash
npm ci
```

Create `.env` file using [this template](#env-file-env-template)

Build, run the app and follow the instructions:

```bash
npm run build && node dist/main.js
```

After successful login, you can exit the app (e.g. via CTRL+C) and start it with a proccess manager, e.g. [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/):

```bash
npm i pm2 -g && pm2 start dist/main.js -n spotistatus2 --time
```

## Env file (`.env`) template

Replace every **\_SET_YOUR_VALUE_HERE\_** with correct value, see [Env vars](#env-vars)

```env
LOG_LEVEL=silly
LOG_FILE_PATH=
SHOULD_LOG_TO_FILE=false

LOG_ERR_TG_BOT_TOKEN=
LOG_ERR_TG_CHAT_ID=0

TG_API_ID=_SET_YOUR_VALUE_HERE_
TG_API_HASH=_SET_YOUR_VALUE_HERE_

SPOTIFY_REDIRECT_URL=http://localhost/callback
SPOTIFY_CLIENT_ID=_SET_YOUR_VALUE_HERE_
SPOTIFY_CLIENT_SECRET=_SET_YOUR_VALUE_HERE_

DEFAULT_TG_STATUS=_SET_YOUR_VALUE_HERE_

PULL_PLAYING_TRACK_TIMEOUT_MS=7500
SET_TG_STATUS_MIN_INTERVAL_MS=13500
```

## Env vars

| Env variable                      | Description                                                           |
| :-------------------------------- | :-------------------------------------------------------------------- |
| **LOG_LEVEL**                     | Log level for all the log transports                                  |
| **LOG_FILE_PATH**                 | Log file path                                                         |
| **SHOULD_LOG_TO_FILE**            | `true`/`false`                                                        |
| **LOG_ERR_TG_BOT_TOKEN**          | [Getting telegram bot credentials](#getting-telegram-bot-credentials) |
| **LOG_ERR_TG_CHAT_ID**            | [Getting telegram chat id](#getting-telegram-bot-credentials)         |
| **TG_API_ID**                     | [Getting telegram app credentials](#getting-telegram-app-credentials) |
| **TG_API_HASH**                   | -                                                                     |
| **SPOTIFY_REDIRECT_URL**          | [Getting spotify app credentials](#getting-spotify-app-credentials)   |
| **SPOTIFY_CLIENT_ID**             | -                                                                     |
| **SPOTIFY_CLIENT_SECRET**         | -                                                                     |
| **DEFAULT_TG_STATUS**             | Telegram status to set when nothing is playing on spotify             |
| **PULL_PLAYING_TRACK_TIMEOUT_MS** | Minimum timeout to pull currently playing track from spotify          |
| **SET_TG_STATUS_MIN_INTERVAL_MS** | Minimum interval for updating telegram status                         |

### Getting telegram bot credentials

1. Create new bot at https://t.me/BotFather via `/newbot` command
2. Copy the bot's token

### Getting telegram chat id

1. Create or join the chat
2. Invite https://t.me/getmyid_bot to the chat and send `/id` command

### Getting telegram app credentials:

1. Create new app at https://my.telegram.org/apps
2. Copy `api_id` and `api_hash`

### Getting spotify app credentials:

1. Create new app at https://developer.spotify.com/dashboard/applications
2. Click **SHOW CLIENT SECRET** and copy `Client ID` and `Client Secret`
3. Click **EDIT SETTINGS** and add `http://localhost/callback` to **Redirect URIs**, click **SAVE**
4. Click **USERS AND ACCESS**, then **ADD NEW USER**, then write Name and email, click **ADD**
