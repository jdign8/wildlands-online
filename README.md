# Wildlands Online — Biome and Health Fix

Based on the uploaded Combined Home + Guardian + Death Record update.

## Changes
- Uses an explicit biome-to-ground-material map so only islands tagged `snow` use the snowy ground material. Forest, mines and castle use grass; meadow, mountain, desert, volcanic, swamp, jungle and other biomes retain their distinct ground materials.
- Restores health continuously at 1 HP per second while health is below maximum and above zero. Hunger/thirst depletion still causes its existing damage, so survival penalties remain in effect.
- Retains the uploaded update's Oldstead Isle home, Guardian behavior, XP record handling, world-boss/team rewards, and server/package files.

## Install
Replace `index.html`, `server.js`, and `package.json` in the existing repository with these files, commit, and wait for Render to redeploy.

JavaScript syntax and ZIP integrity were checked. This has not been live-tested in Safari or on Render.
