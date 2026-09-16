# Stand — installing it on your iPhone

Five files. Host them together in one folder, open the address in Safari, add it
to your home screen. That's the whole process.

```
index.html              the app
sw.js                   offline cache
manifest.webmanifest    name, colours, icon
icon-192.png
icon-512.png
apple-touch-icon.png    the home screen icon
```

## Host it

All three of these are free and give you HTTPS, which the app needs — service
workers and durable storage are disabled on plain HTTP.

**Netlify Drop** — the fastest. Go to app.netlify.com/drop and drag the folder
onto the page. You get a URL in about ten seconds. No account needed to start.

**Cloudflare Pages** — same idea, slightly more setup, better if you want a
custom domain later.

**GitHub Pages** — push the folder to a repo, then Settings → Pages → deploy
from branch, root. Takes a minute to go live. Best if you want to keep editing.

## Install it

1. Open the URL in **Safari** on your iPhone. It has to be Safari — Chrome on
   iOS can't install home screen apps.
2. Wait for your library to appear, so the service worker caches the PDF
   libraries. This is the one time it needs a connection.
3. Share button → **Add to Home Screen**.
4. Open it from the icon, not from Safari. Launched from the icon it runs
   full-screen with no browser bar, and iOS treats its storage as durable.

## Storage

Scores live in IndexedDB on your phone. Nothing is uploaded and there is no
server — the host only ever serves the app itself.

Space available is a share of your free disk, typically hundreds of megabytes at
minimum, so a large library is fine. The app asks iOS for persistent storage on
first launch, which installed home screen apps are normally granted; that's what
stops iOS clearing your scores when space runs low.

If storage ever does fill up, adding a PDF fails with a message naming the
reason rather than failing silently.

Deleting the app from your home screen deletes its scores with it. Anything you
want to keep, export first with the share button in the viewer — that writes a
flattened PDF with your markings burned in.

## Fast page turns

High-resolution scans are slow to draw, so Stand draws each page once and keeps
a screen-sized picture of it alongside the score. After that, turning to that
page is near-instant, including after closing and reopening the app.

Pages are prepared in the background: a newly added score while you're in the
library, and the rest of an open score once you pause on a page. Leave a new
score for a minute before a gig and every page is ready. Portrait and landscape
are prepared separately.

These pictures are only a speed-up. They're capped at about 300 MB (less on a
nearly full phone), the least recently opened scores are dropped first, and
they're cleared automatically whenever a new PDF needs the space. Removing a
score removes its pictures. Your markings are never part of them.

## Changing the app later

Edit `index.html`, then bump `CACHE` in `sw.js` (`stand-v1` → `stand-v2`) and
re-upload. Without the bump, phones keep serving the cached copy and won't see
your changes.
