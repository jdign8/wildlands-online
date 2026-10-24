# Wildlands Online — Combined Home + Guardian + Death Record Update

This update combines the existing Island Guardian behavior (peaceful until the player attacks) and the all-time XP Top Five codename prompt (only checked when the player dies) with the Oldstead Isle house update.

## New Oldstead Isle home features
- Repair the rundown house for 40 wood and 20 stone.
- Once rebuilt, monsters no longer spawn on Oldstead Isle; existing nearby monsters are cleared.
- Enter the rebuilt house by pressing E / Interact near it.
- Sleep in the bed at night to recover health and pass the night.
- Use the food chest to deposit all carried `food` or withdraw all stored food.
- Return to the Oldstead Repairer and interact again to buy a second bed for 1 coin.

## Install
Replace `index.html` and `server.js` in your GitHub repository with the files in this folder, commit the changes, and wait for Render to redeploy. Keep `package.json` as included.

Note: JavaScript syntax and ZIP integrity were checked. The game has not been live-tested in a browser. XP record storage on Render may require a persistent disk to survive server restarts/redeploys.
