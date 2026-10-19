# Wildlands Online

Browser-based 3D survival prototype. Open `index.html` through the Express app in `server.js` for the full Socket.IO-enabled experience.

## Recent survival update
- Crafting a campfire now also places a bed beside it.
- The day/night cycle runs continuously (about three minutes per full cycle).
- At nightfall, 50 additional tougher monsters spawn on the player's current island, except Dragonfall Isle, which is reserved for the dragon boss and has no wildlings or night monsters.
- Stand within a few steps of the bed and press **E** or **Interact / Eat** at night to sleep until morning. Sleeping restores some health but costs a little hunger and thirst.
- Regular wildlings and night monsters have more health and hit harder than before.

## Run locally
Install dependencies with `npm install`, then run `npm start`. The Render service should use the same Node.js start command configured in `package.json`.

## New islands and trading update
- The world now has eleven islands, including Crownspire Mountain, Coincrest Village, Dragonfall Isle, and Emberpeak Volcano Isle.
- Crownspire Mountain has one narrow switchback trail; movement is constrained to that route, and a treasure chest waits at the summit. The chest rewards iron, rare crystals, coins, food and XP.
- At Coincrest Village, talk to Bram at the Wood Exchange and trade 30 wood for 1 coin.
- Talk to Ada at the Armoury to buy upgrades: stone armour costs 3 coins (+25 max health), iron armour costs 7 coins (+50 max health), and crystal armour costs 12 coins (+80 max health). Better armour also reduces incoming damage, and each type has a matching player visual.
- Coins and armour are included in the saved inventory/progress.
- The cave at the base of Crownspire Mountain is now enterable: stand by the entrance and press **E** / **Interact**. Explore the lit crystal chamber, mine two crystal and two iron deposits, then walk to the doorway and press **E** to return outside.
- Coincrest Village now has a Medicine House. Talk to Mira the Healer and buy medicine for 1 coin to restore health to your current maximum; medicine cannot be bought if health is already full.


## Kingsfall Castle Isle update
- Added a ninth island, Kingsfall Castle Isle, with a huge stone castle, towers, banners, courtyard, and castle villagers.
- Added a circular gladiator arena. Talk to Arena Master Tor, then enter the sand ring and press E / Interact to start a fight against three tougher wildlings. Defeating them awards 8 coins and 100 XP once per run.


## Dragonfall Isle update
- Coincrest Village now has a glowing Dragon Portal that requires 50 stone to activate.
- Activating it teleports you to Dragonfall Isle, a scorched volcanic island that cannot be reached by boat.
- A giant dragon boss with 420 HP, powerful close-range fire attacks, and a large model is the strongest monster.
- The island is sealed until the dragon is defeated. Victory awards 50 coins, 25 crystals, 40 iron, 100 stone, 20 food, 20 water, 1000 XP, and full health.
- After victory, use the portal on Dragonfall Isle to return to Coincrest Village.


## Emberpeak Volcano Isle and Dragonfall safety update
- Added Emberpeak Volcano Isle, with a towering dark volcano, crater, glowing lava, charred terrain and scattered basalt rocks.
- The volcano erupts during the night cycle, with a rising lava plume, glowing crater, and erupting rocks visible even from other islands.
- If you stand too close to the crater on Emberpeak at night, volcanic bursts deal damage; move away from the crater to stay safe.
- Dragonfall Isle is a boss-only challenge. No night monsters or wildlings spawn there; only the giant dragon remains. Any non-boss enemies are cleared while you are on Dragonfall.


Latest update: removed the Wooden Shelter recipe, added Oldstead Isle with a rundown central house and a shoreline repairer (repair price: 40 wood + 20 stone), and hardened crafting so failed recipe checks roll back inventory/XP.


Latest update: adds Verdant Wilds, Ashenfall Isle, Murkmire Isle, Sunscorch Desert, Cloverfield Isle, Skyreach Isles, Stormwatch Isle and Coralgrave Isle. Crafting now validates outputs before spending and restores inventory and crafting state if a special craft fails. Wooden Shelter remains removed.


## Island exploration and farm update
- Increased every island's shoreline and walkable ground size.
- Added exploration treasure chests across the islands, with the jungle temple's reward chest placed inside the temple chamber.
- Rebuilt Coralgrave Isle's wreck as a larger broken ship with a hull, deck, ribs, mast and torn sail.
- Added harvestable wheat fields to Cloverfield Isle. Gather wheat and sell 5 wheat to Tilly for 3 coins.
- Reduced crystal cluster counts on several islands so crystals feel rarer.
- Improved water colour, ambient lighting and distance atmosphere without changing ore visuals.


## Stylized terrain redesign
- Added layered, beveled cliff sides and shoreline shelves rather than flat circular island edges.
- Added low rolling hills, sandy footpaths, shoreline rock groups and biome-themed ground plants.
- Adjusted atmosphere and water material to better reveal the terrain.
- Ore visuals and ore materials were not changed.
