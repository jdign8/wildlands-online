Wildlands Online — Menu Scroll and Account Registration Fix

Changes:
- Main menu overlay now scrolls vertically on touch devices and desktop when its contents exceed the screen height.
- Start card stays naturally sized and can be reached all the way to the bottom, including the account panel and Enter button.
- Express JSON request parsing is now registered before the account registration/login routes. Previously those routes could receive an empty req.body, causing Create Account to fail.

Deploy the included index.html, server.js and package.json together. Keep accounts.json and achievements.json on persistent Render storage if you want account data to survive redeploys.

Checks performed: Node syntax check for server.js and the inline game module; ZIP integrity check. Not live-tested on Render/iPad.
