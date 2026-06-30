# Proxuma IT v3.52.2

Proxuma IT is a browser-based, trust-centered investigation interface for reviewing suspicious links, text, QR content, and related evidence.

## Current workflow

**Scan → Result → Scan Details → Investigation → Review & Trust**

## What works in this build

- Local browser-based scanning and evidence presentation
- Scan Metrics and Supporting Evidence views
- Deep Analysis and Case File investigation views
- Focus reading workspaces for detailed review
- Review & Trust workflow tools
- Mobile-friendly page scrolling and compact navigation rails
- QR input support using the bundled local `jsQR` decoder
- Optional, consent-gated online-intelligence workflow

## Capability boundary

This is a client-side product prototype. Current scans use the local analysis engine. Deep Scan is planned, not active. Online checks are optional and separate from local scanning. Findings should be treated as guidance until the scanner logic, external data sources, and security boundaries receive independent validation.

## Run locally

Open `index.html` in a modern browser. For more reliable browser behavior, serve the folder through a small local web server.

Example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## GitHub Pages

1. Upload the **contents** of this folder to the repository root.
2. In GitHub, open **Settings → Pages**.
3. Choose **Deploy from a branch**.
4. Select the `main` branch and `/ (root)`.
5. Save and test the published site on desktop and mobile.

GitHub Pages serves the static interface but cannot execute `api/proxuma-rdap.js`. That optional endpoint requires a compatible serverless host such as Vercel.

## Repository structure

- `index.html` — application markup
- `assets/css/styles.css` — responsive UI and focus-workspace styling
- `assets/js/proxuma-it.js` — primary scanning and application logic
- `assets/js/` — supporting workflow, focus, consistency, and grouped-panel modules
- `assets/images/` — required interface images
- `assets/vendor/` — bundled local QR decoder and its license
- `api/proxuma-rdap.js` — optional serverless RDAP bridge
- `SECURITY.md` — security and responsible-use guidance
- `CAPABILITY_MATRIX.md` — truthful capability, evidence, privacy, and limitation map
- `CONTRIBUTING.md` — contribution guidance
- `docs/` — current deployment and architecture documentation
- `tests/` — current release regression test

## Release

**v3.52.2 — Guided Results + Indexing Foundation**

This release adds a guided result summary, explicit Observed / Interpreted / Not verified boundaries, confidence and recommended-action cues, collapsible technical evidence, canonical metadata, robots.txt, and sitemap.xml without changing the local analysis engine.

The interface remains offline-first. Optional online intelligence is still explicit, consent-gated, and deployment-dependent.


## Search indexing

The build includes `robots.txt`, `sitemap.xml`, canonical metadata, and social preview metadata for `https://scar197124.github.io/Proxuma_IT/`. If the repository slug changes, update that base URL in `index.html`, `robots.txt`, and `sitemap.xml` before deployment.


## Clean repository policy

This public package intentionally excludes legacy tests, superseded build manifests, old handoff notes, archived release notes, and nested deployment archives. Preserve historical material in Git history or in a separate archival release rather than in the active repository tree.

Do not upload the ZIP file into the repository. Extract it, then commit the files with GitHub Desktop, Git, or a Git client.
