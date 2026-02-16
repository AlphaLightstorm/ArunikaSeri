# Link Hub — Single Page Link Landing

Professional, mobile-first link hub for creators.  
Features: profile image, per-link thumbnails, add/edit/delete links, localStorage persistence, export/import JSON, click counters.

## How to use
1. Edit profile: click Edit Profile to change name, tagline, description, and upload avatar.
2. Add links: click Add Link, set label, URL, and optional thumbnail.
3. Export/Import: use Export to copy JSON backup; Import to restore.
4. Local persistence: changes are saved to browser localStorage. To make edits public across devices, integrate Firebase (instructions below).

## Deploy to GitHub Pages
1. Create a new public repository on GitHub.
2. Add `index.html` and `README.md` to the repo.
3. Push to `main` branch.
4. In the repository Settings → Pages, select branch `main` and folder `/ (root)`. Save.
5. Your site will be available at `https://<your-username>.github.io/<repo>/`.

## Optional: Make edits public across visitors
- Use Firebase Firestore for `links` and Storage for images.
- Steps: create Firebase project → enable Firestore and Storage → add web app → paste config into the commented Firebase hooks in `index.html` → implement `syncToServer()` and `loadFromServer()` to push/pull `profile` and `links`.
- I can add the exact Firebase code if you want.

## Tips
- Compress thumbnails and avatar before uploading (WebP or compressed JPEG).
- Add an `og:image` in `assets/` for nicer link previews.
- For custom domain, add domain in Pages settings and follow GitHub DNS instructions.
