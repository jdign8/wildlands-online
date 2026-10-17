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

## New islands and trading update
- The world now has eight islands, including Crownspire Mountain and Coincrest Village.
- Crownspire Mountain has one narrow switchback trail; movement is constrained to that route, and a treasure chest waits at the summit. The chest rewards iron, rare crystals, coins, food and XP.
- At Coincrest Village, talk to Bram at the Wood Exchange and trade 30 wood for 1 coin.
- Talk to Ada at the Armoury to buy upgrades: stone armour costs 3 coins (+25 max health), iron armour costs 7 coins (+50 max health), and crystal armour costs 12 coins (+80 max health). Better armour also reduces incoming damage, and each type has a matching player visual.
- Coins and armour are included in the saved inventory/progress.
- The cave at the base of Crownspire Mountain is now enterable: stand by the entrance and press **E** / **Interact**. Explore the lit crystal chamber, mine two crystal and two iron deposits, then walk to the doorway and press **E** to return outside.
