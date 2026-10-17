# Wildlands Online — Visuals & Weapons Update (v0.7)

A browser-based 3D survival prototype with iPad touch controls and a Node.js multiplayer server.

## Deploy on Render

- Build command: `npm install`
- Start command: `node server.js` (or `npm start`)
- Keep `index.html`, `server.js`, `package.json`, and `README.md` in the repository root.

## New in v0.7

- More natural, irregular island shorelines and warmer beach/grass colours.
- Rounded layered tree canopies, flower patches, and more recognisable player/wildling bodies with arms, legs, eyes, hair and backpacks.
- A weapons bench in the backpack with four swords: Wooden (10 damage), Stone (20), Iron (35), and Crystal (50).
- Crafting costs: Wooden = 4 wood; Stone = 4 wood + 3 stone; Iron = 5 wood + 5 stone; Crystal = 5 wood + 8 stone and level 3. Crafting equips the new sword. Select a sword and tap Equip sword to switch to one you already own.
- The equipped sword appears in the player's hand and increases damage to wildlings.
- Backpack content scrolls on small screens so it stays separate from iPad touch controls.
- Retains the three islands, freshwater springs, drink action, and raft travel.

## Controls

- iPad: movement arrows at lower left; drag the right side to look. Tap Gather/Hit, Eat/Rest, Campfire, Jump, Drink, or Sail. Use the weapons bench inside the backpack to craft/equip swords.
- Desktop: WASD to move, mouse to look, click to gather/attack, E to eat/rest, C to craft a campfire, Space to jump.
- Sail only works close to the shoreline raft.

## Prototype notes

This is a prototype and has not been fully tested on a live deployment. Sword damage is applied locally to wildlings; multiplayer PvP still uses the server's fixed damage and should be updated separately for weapon-specific PvP. Multiplayer movement and island travel are not fully server-authoritative, and each browser client generates its own world layout. Free hosting can sleep when idle, and local save files may not persist across redeploys. Display-name based saves are not secure accounts. Three.js is loaded from jsDelivr, so the browser needs an internet connection.
