# Daily Bulletin — auto-updating news website

A simple website that shows fresh current-affairs headlines (India, World,
Business, Technology, Sports) and refreshes itself automatically every day
at **9:00 AM IST** — no server, no paid API, no manual work once it's set up.

## How it works

- `fetch-news.mjs` — a small script that pulls headlines from **Google News
  RSS** (free, no API key required) and saves them into `news.json`.
- `index.html` — the website. It reads `news.json` and displays it.
- `.github/workflows/update-news.yml` — a **GitHub Actions** schedule that
  runs `fetch-news.mjs` automatically every day at 9:00 AM IST and saves the
  new headlines back into the repo.

Because GitHub Pages serves your repo as a live website, once this is set
up you never have to touch it again — GitHub runs the update for you daily.

## Setup (10 minutes, one time)

1. **Create a GitHub account** if you don't have one — [github.com](https://github.com).
2. **Create a new repository** (e.g. `daily-bulletin`), and upload all the
   files in this folder to it (`index.html`, `news.json`, `fetch-news.mjs`,
   and the `.github` folder — keep the folder structure intact).
3. **Turn on GitHub Pages**:
   - Go to your repo → **Settings** → **Pages**
   - Under "Build and deployment", set Source to **Deploy from a branch**
   - Branch: `main`, folder: `/ (root)` → Save
   - GitHub will give you a live URL like
     `https://yourusername.github.io/daily-bulletin/`
4. **Turn on the daily auto-update**:
   - Go to your repo → **Actions** tab → you should see "Update Daily News"
   - Click **Enable workflow** if prompted
   - Click **Run workflow** once manually to test it — it will fetch
     headlines and commit an updated `news.json`
5. Open your GitHub Pages URL — you should see today's headlines.

From here on, GitHub automatically runs the fetch every day at 9:00 AM IST
and your page reflects the new content the next time it loads.

## Customizing

- **Change sections**: edit the `FEEDS` array at the top of `fetch-news.mjs`
  (add/remove topics like `NATION`, `WORLD`, `BUSINESS`, `TECHNOLOGY`,
  `SPORTS`, `ENTERTAINMENT`, `SCIENCE`, `HEALTH`).
- **Change language/region**: edit `LANG`, `COUNTRY`, `CEID` in the same
  file (e.g. `hi-IN` / `IN` / `IN:hi` for Hindi headlines).
- **Change the update time**: edit the `cron` line in
  `.github/workflows/update-news.yml`. Cron times are in UTC — 9:00 AM IST
  is `30 3 * * *` (3:30 AM UTC).
- **Design**: all styling is in the `<style>` block inside `index.html` —
  colors are defined once at the top under `:root`.

## Running it locally (optional, to test before deploying)

```bash
node fetch-news.mjs      # fetches fresh news.json
# then just open index.html in a browser
```

## Notes

- Google News RSS is free and doesn't require an API key, which is why this
  uses it. If you'd rather use NewsAPI.org, GNews, or NewsData.io for more
  control (custom keywords, more sources), swap the fetch logic in
  `fetch-news.mjs` — the rest of the site doesn't need to change.
- If a section shows no stories on a given day, it usually means that RSS
  feed briefly failed to respond — it will refill on the next scheduled run.
