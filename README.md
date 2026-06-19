# Proxuma IT v3.47.5

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
- `styles.css` — responsive UI and focus-workspace styling
- `proxuma-it.js` — primary scanning and application logic
- Supporting JavaScript modules — workflow, focus, consistency, and grouped-panel behavior
- `assets/` — required interface and QR-decoder assets
- `api/proxuma-rdap.js` — optional serverless RDAP bridge
- `SECURITY.md` — security and responsible-use guidance
- `CONTRIBUTING.md` — contribution guidance

## Release

**v3.47.5 — Content-First Investigation Restore**

Step 4 restores a compact stacked investigation rail beside a larger content-first reading surface. Scan Details gives more room to evidence and metrics, while controls use less vertical space across desktop and mobile.
