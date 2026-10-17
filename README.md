# Wildlands Online — iPad Edition — Expanded Island Update

A browser-based 3D survival game prototype with touch controls and a Node.js multiplayer server.

## Deploy on Render

- Build command: `npm install`
- Start command: `npm start`

The server serves the game at `/` and the Socket.IO multiplayer connection from the same origin.

## iPad controls

- Use the on-screen arrows at the lower left to move.
- Drag the right side of the game view to look around. The action buttons stay along the bottom, while the backpack is positioned above them to avoid overlap.
- Tap the right side to gather or attack.
- Use the action buttons for Eat/Rest, Campfire, and Jump.

## Prototype notes

This is a work in progress and has not been fully tested on a live deployment. Free hosting can sleep when idle, and local save files may not persist across redeploys. Display-name based saves are not secure accounts. Do not use private passwords that you use elsewhere.

The island is now larger, with a wider shoreline, more resources, and more wildlings spread across the expanded area. Three.js is loaded from jsDelivr, so the browser needs an internet connection.
