Wildlands Online — startup and records patch

This patch is based on the existing realistic-landscape game files. It changes only index.html:
- Tries jsDelivr for Three.js, then falls back to unpkg if the first CDN fails.
- Loads the all-time XP records independently of the 3D module, using GET /api/xp-records only. It does not POST, reset, or rewrite records.
- Keeps the existing game code, backpack, inventory, island logic, and normal Enter the Island handler.

Install: replace only index.html in GitHub and let Render redeploy. Do NOT replace server.js or delete xp-records.json/player-saves.json. If the server endpoint itself has lost data, this client patch cannot recover it; check Render persistent disk/logs before changing server files.
