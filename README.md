# Wisdom — daily insights from the great books (PWA)
Static site, no build step. Open index.html via any HTTPS static host.
- `cards.js` 142 insight cards · `quotes.js` 50 short public-domain quotes
- `wallpaper.js` deterministic canvas renderer (1179×2556); `build_wallpapers.sh N` pre-renders `wallpaper/YYYY-MM-DD.png` + `wallpaper/today.png` with headless Chrome
- `.github/workflows/wallpaper.yml` redeploys to GitHub Pages daily so `/wallpaper/today.png` stays current (set Pages source = GitHub Actions)

## v3 (content + "bum to rich")
- `content/*.txt` batch files (pipe-delimited) → `content/validate.py` (field + duplicate checks) → `content/build_cards.py` → `cards.js` (1,098 cards; 697 Life / 401 Business). Per-book counts: `content/COUNTS.md`.
- `content/build_quotes.py` → `quotes.js` (365 quotes, one per day).
- `dream/` 30 AI-generated lock-screen backgrounds (see `dream/CREDITS.md`).
- Avatar: wealth ladder Broke → Mogul; stats Wealth / Discipline / Wisdom.

## Sunday check-in notification (iOS Shortcuts)
iOS PWAs can't schedule local notifications reliably, so use a personal automation:
1. Shortcuts → Automation → + → Time of Day → 19:00, Weekly, Sunday → Run Immediately.
2. Add **List** with a few lines, e.g. "Sunday check-in, boss. Two numbers, +50 XP.", "Weight + savings. Two taps.", "New week. Log it and level up."
3. Add **Get Random Item from List**, then **Show Notification** with that item.
4. Add **Open URLs**: `https://<your-host>/?checkin=1` (opens straight into the check-in screen).
(Alternatively skip the notification and just Open URLs.) Web Push was skipped: it needs a server.

## Shortcut setup pop-up
Shown on open until both shortcuts are activated or declined. Paste iCloud share links into `shortcuts-config.js` (`SHORTCUT_LINKS`) to turn the Install buttons into one-tap installs. Check-in activates itself when opened via `?checkin=1&src=sc`; the wallpaper step is self-confirmed.
