Wildlands Online — Account & Achievement Repair

This update is based on the previous Monster Attack Fix and keeps its gameplay changes.

Account improvements:
- Login sessions are saved by the server so a Render restart does not automatically invalidate a signed-in player's token.
- The browser remembers the signed-in token and username on that device, then restores the session on the next visit.
- Login and registration now show a clear in-progress/error status.

Achievement improvements:
- The achievement list now contains 30 achievements (the original 20 plus 10 new ones).
- The server accepts all 30 achievement IDs.
- Guardian and dragon achievements are triggered by their actual combat/travel events.
- Fish, chest, crafting, kill, and island visit progress is saved locally per account on the same browser/device.
- Achievement count updates from the actual list length.

Deploy index.html, server.js and package.json together. On Render, use a persistent disk for accounts.json, achievements.json and sessions.json if you need account data and login sessions to survive service restarts/redeploys. Existing account data files must be preserved; do not delete them.

Checks performed: Node syntax checks for server.js and the inline game module; ZIP integrity. A live API smoke test could not run in this environment because the server dependencies (Express and Socket.IO) are not installed here. Not live-tested on Render or iPad Safari.
