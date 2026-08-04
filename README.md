# Iron Log — Workout Journal

A single-page workout journal. No build tools, no backend — just one HTML file that saves your sessions in your browser.

## Features
- Log a session: date, notes, and any number of exercises, each with any number of weight × reps sets
- History ledger, newest first, expandable per session
- Auto-detected PR badges when a lift's top set beats your prior best
- Quick stats: total sessions, sessions this week, consecutive weekly streak
- Data is stored in your browser's local storage — nothing leaves your device, no account needed

## Host it on GitHub Pages (free)

1. Create a new repository on GitHub (e.g. `workout-journal`).
2. Upload `index.html` to the repo (drag-and-drop on the GitHub web UI works fine, or:)
   ```bash
   git init
   git add index.html README.md
   git commit -m "Add workout journal"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to "Deploy from a branch," pick the `main` branch and `/ (root)` folder, then **Save**.
5. GitHub will give you a URL like `https://<your-username>.github.io/<repo-name>/` — that's your journal, live in a minute or two.

## Syncing across devices (GitHub as your database)

The app can read and write your log as a JSON file in a GitHub repo, so the same data shows up on your phone and laptop. There's no separate backend — it talks to GitHub's API directly from your browser.

### 1. Generate a token
1. In GitHub, go to **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. Set **Repository access** to "Only select repositories" and pick the repo you'll store data in.
3. Under **Permissions → Repository permissions**, set **Contents** to **Read and write**. Leave everything else as "No access."
4. Generate the token and copy it — GitHub only shows it once.

### 2. Connect the app
1. Open the app and tap the ⚙ icon.
2. Fill in your GitHub username, the repo name, the branch (usually `main`), a file path for your data (e.g. `data/workouts.json`), and the token.
3. Tap **Save & connect**. The app will create the data file on your first save if it doesn't exist yet.
4. Repeat this on each device — the token has to be entered per device/browser, since it's only ever stored locally, never synced itself.

### A note on the token
The token lives only in that browser's local storage and is sent only to `api.github.com` — never to any third party. Still, treat it like a password: if a device is shared or lost, revoke the token from GitHub's settings.

**If your data is sensitive** (e.g. you'd rather it not be publicly visible), use a **private** repo for the data file — it can be a *different* repo from the one hosting your site on GitHub Pages, since Pages requires a public repo on the free plan but the data repo doesn't. Point the app at a private repo and your workouts stay out of public view; the site itself contains no personal data either way, since it's just the empty app shell.

### If you edit from two devices before syncing
The app merges by session ID rather than overwriting, so logging on your phone while offline and later syncing your laptop won't wipe either set of entries — worst case you'd see the same session appear twice, which you can delete.

## Installing it as an app (PWA)

Iron Log is a full Progressive Web App — it can be installed to a home screen or desktop and works offline off the last-synced data.

### Files this adds
```
index.html
manifest.webmanifest
service-worker.js
icons/
  icon-192.png
  icon-512.png
  icon-512-maskable.png
  apple-touch-icon.png
  favicon.ico, favicon-16.png, favicon-32.png
```
Upload the whole `icons/` folder along with the other files to the same repo — the paths in `index.html` and `manifest.webmanifest` are relative, so this works whether your site is hosted at the root (`username.github.io`) or in a subfolder (`username.github.io/repo-name`).

### Installing
- **Android / Desktop Chrome or Edge:** open the site, then either use the browser's install icon in the address bar, or tap the ⤓ button that appears next to the ⚙ icon in the app header once the browser detects it's installable.
- **iOS Safari:** Apple doesn't support the automatic install prompt. Open the site in Safari, tap the Share icon, then **Add to Home Screen**.
- Once installed, it opens in its own window without browser chrome, and keeps a dark status bar to match the app's theme.

### Offline behavior
The service worker caches the app shell (HTML, manifest, icons) on first visit, so the app still opens without a connection. Your workout data itself still needs a connection to sync with GitHub — offline, you'll see the last-synced copy and any new entries save locally until you're back online, exactly as described above. Google Fonts aren't cached, so on a fresh offline load the app falls back to your system font instead of Oswald/Inter/IBM Plex Mono.

### Updating the app later
Browsers check for a new `service-worker.js` in the background; when you push changes, users typically see the update after closing and reopening the app once or twice. If you want to force an immediate update, bump the `CACHE_NAME` value at the top of `service-worker.js` when you change `index.html`.

