# GitHub Push Checklist — Proxuma IT v3.19.6

Before pushing:

- [ ] Upload the contents of the release folder, not the outer ZIP wrapper.
- [ ] Confirm `index.html`, `proxuma-it.js`, `styles.css`, `assets/`, `README.md`, `CHANGELOG.md`, `SECURITY.md`, and `LICENSE` are at repo root.
- [ ] Confirm there is no `index.md` replacing or competing with `index.html`.
- [ ] Confirm no old ZIP files are committed unless intentionally kept in a releases folder.
- [ ] Run `node --check proxuma-it.js`.
- [ ] Run the included tests in `tests/`.
- [ ] Open locally and test a trusted site, a suspicious site, Local Check, copy report, JSON export, and manual QR text paste.
- [ ] After GitHub Pages deploys, repeat one trusted scan, one suspicious scan, and manual QR paste in the live site.

Known note:

- Camera QR scanning is browser-dependent. Manual QR text paste is the reliable fallback until the full local decoder bundle is embedded.
