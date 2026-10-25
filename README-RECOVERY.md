# Wildlands Online — startup recovery

## Root cause found
The recent grass/terrain-detail update created instanced grass meshes before the code declared `world` and `decorations`. The grass block called `world.add(mesh)` and `decorations.push(mesh)` while those `const` bindings were still in their temporal dead zone. That throws a `ReferenceError` during module startup, preventing the rest of the game module from running and leaving the Enter button without its click handler.

## Repair
The only game-code change in this recovery is moving the existing grass-instancing block to immediately after `world` and `decorations` are declared. The grass detail, terrain tint, expanded islands, crafting, village, boats, fishing, bosses, saves, XP records, and existing game logic are retained. The server and package files are included from the latest supplied project files so the ZIP can replace the corresponding app files together.

## Deploy
1. Back up the current GitHub files and do not delete existing `player-saves.json` or `xp-records.json`.
2. Replace `index.html`, `server.js`, and `package.json` with the matching files in this ZIP. Keep existing save/record JSON files.
3. Commit and push to GitHub, then wait for Render to finish deploying.
4. Open the site and refresh Safari. Try **Private world** then **ENTER THE ISLAND**.

## Checks performed
- Extracted the HTML module and passed it through `node --check`.
- Passed `server.js` through `node --check`.
- Verified ZIP integrity.
- Verified the `world` and `decorations` declarations now occur before the grass block uses them.

This is a source-level repair based on the supplied code; it has not been run on the live Render deployment or an iPad browser in this environment.
