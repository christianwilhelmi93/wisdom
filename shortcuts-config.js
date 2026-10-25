// ===== Shortcut setup constants. Paste iCloud share links here once the shortcuts are built on the iPhone =====
// (Shortcuts → long-press shortcut → Share → Copy iCloud Link). Empty = show the in-app builder guide instead.
const SHORTCUT_LINKS={wall:'',checkin:''};
const APP_BASE=location.origin+location.pathname.replace(/[^/]*$/,'');
const SC_URLS={wall:APP_BASE+'wallpaper/today.png',checkin:APP_BASE+'?checkin=1&src=sc'};
const BOOT_QS=location.search; // captured before the app strips query params
