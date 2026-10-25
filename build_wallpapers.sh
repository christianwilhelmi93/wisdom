#!/usr/bin/env bash
# Pre-renders wallpaper/YYYY-MM-DD.png for the next N days (default 45) and wallpaper/today.png
set -e; cd "$(dirname "$0")"; N=${1:-45}; CHROME=${CHROME:-$(command -v google-chrome || command -v chromium || command -v chromium-browser)}
TZ=${TZ:-Europe/Oslo}; export TZ; mkdir -p wallpaper
for i in $(seq 0 $N); do d=$(date -d "+$i day" +%F); [ -f wallpaper/$d.png ] && continue
 "$CHROME" --headless=new --no-sandbox --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1179,2556 \
  --virtual-time-budget=5000 --allow-file-access-from-files --screenshot="wallpaper/$d.png" "file://$PWD/render.html?d=$d" >/dev/null 2>&1; done
cp "wallpaper/$(date +%F).png" wallpaper/today.png
# prune old
find wallpaper -name '20*.png' -mtime +3 -newermt 1970-01-01 2>/dev/null | while read f; do b=$(basename $f .png); [[ "$b" < "$(date -d '-2 day' +%F)" ]] && rm -f "$f"; done; true
