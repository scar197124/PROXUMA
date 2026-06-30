# Proxuma IT Serverless Bridge Blueprint — v3.28.0

## Purpose

Proxuma IT remains offline-first by default. Future automatic Online Intel checks must not run directly from the GitHub Pages frontend and must not expose provider API keys in browser code.

The safe path is:

```text
User scans locally
→ User opens Online Intel
→ User explicitly arms consent
→ Frontend sends only the minimum lookup target to a serverless bridge
→ Serverless bridge contacts approved provider
→ Bridge sanitizes and summarizes response
→ Frontend displays result inside existing Online Intel / report surfaces
```

## Required guardrails

- No hidden lookup before consent.
- No API keys or secrets in `index.html`, `styles.css`, or `proxuma-it.js`.
- No telemetry or tracking payload.
- No bulk submission of local history.
- Lookup target must be minimized: root domain, normalized URL, or selected indicator only.
- User must be able to clear consent.
- Offline report must remain available if the bridge fails.

## Future serverless endpoint shape

```text
POST /api/proxuma-intel/domain
POST /api/proxuma-intel/certificate
POST /api/proxuma-intel/redirect
POST /api/proxuma-intel/reputation
```

Each endpoint should return a small sanitized object:

```json
{
  "ok": true,
  "provider": "example-provider",
  "checkedAt": "ISO timestamp",
  "targetType": "domain",
  "target": "example.com",
  "summary": "Plain-language finding",
  "signals": ["domain age: new", "registrar: visible"],
  "riskDelta": "informational only until calibrated",
  "rawStored": false
}
```

## Current build status

v3.28.0 is documentation and readiness only. No live bridge is connected.
