# Wildlands Online — Hearthstone Survival Expansion

This update preserves the existing game and adds a first pass of the new survival expansion.

## New features
- Hearthstone Village is now a monster-threatened village.
- Bram the Builder offers a main base for exactly 100 wood, plus a base upgrade for 20 wood and 10 stone.
- Village farm plots can be planted with 2 wheat and harvested after growing for about 25 seconds.
- Cooking converts 5 berries or 5 wheat into 3 food.
- Adopt a guard dog for 10 food; it follows the player.
- Buy a mount for 25 wood and 5 food; choose option 5 at Bram to mount/dismount. While mounted, movement speed increases and the mount stays under the player.
- A village quest exchanges 10 stone for 8 coins and 80 XP.
- Existing islands, fishing/rare fish, crafting, weapons and armour, Crownspire Cave, dragon trial, Island Guardian, Oldstead repaired house, bed/chest, second-bed purchase and death-time leaderboard prompt are retained.

## Controls
Use E / Interact near Bram the Builder, farm plots, villagers and objects. Bram presents a numbered menu; enter the number of the option you want.

## Important notes
- Riding is implemented as a faster movement mode with the mount positioned under the player; it is a simple arcade mount, not a fully animated horse with separate riding animations.
- The new base is a defensive structure players can build and upgrade, but enemy AI does not yet target/damage the base structures themselves.
- JavaScript syntax and ZIP integrity were checked. The game was not live-tested in a browser.

## Deploy
Replace `index.html` and `server.js` in the existing repository with these files, commit the changes, and let Render redeploy.

## Combined follow-up
- Clan features are intentionally excluded.
- Rare mackerel and super-rare shark fishing/selling are retained.
- Existing Island Guardian and Dragon boss encounters, plus existing craftable sword and armour tiers, are retained.
