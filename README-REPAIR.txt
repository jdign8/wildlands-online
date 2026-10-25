Wildlands Online — targeted startup and XP records repair

Included files: index.html and server.js. package.json is unchanged.

What changed:
- index.html now tries a backup Three.js CDN if jsDelivr fails. This addresses the failure mode where the module never initializes and the Enter button handler is never attached.
- server.js now provides GET/POST /api/xp-records and persists the all-time top five in xp-records.json. Existing xp-records.json is loaded if present; this ZIP intentionally does not include or replace that data file.
- The existing backpack/inventory markup and game code are otherwise kept from the supplied index.html.

Deploy: replace index.html and server.js in the project, commit/push, then wait for Render to redeploy. Do not delete xp-records.json or player-saves.json.

Validation performed: Node syntax check for server.js and extracted module script; checked that the inventory, Enter button, and records panel remain in index.html. Live Render/iPad runtime testing has not been possible from this ZIP build, so please verify after redeploy.
