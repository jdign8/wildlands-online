# Wildlands Online

Browser-based 3D survival prototype. Open `index.html` through the Express app in `server.js` for the full Socket.IO-enabled experience.

## Recent survival update
- Crafting a campfire now also places a bed beside it.
- The day/night cycle runs continuously (about three minutes per full cycle).
- At nightfall, 50 additional tougher monsters spawn on the player's current island.
- Stand within a few steps of the bed and press **E** or **Interact / Eat** at night to sleep until morning. Sleeping restores some health but costs a little hunger and thirst.
- Regular wildlings and night monsters have more health and hit harder than before.

## Run locally
Install dependencies with `npm install`, then run `npm start`. The Render service should use the same Node.js start command configured in `package.json`.
