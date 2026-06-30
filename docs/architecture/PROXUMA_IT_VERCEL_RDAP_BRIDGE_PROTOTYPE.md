# Proxuma IT v3.29.0 — Vercel RDAP Bridge Prototype

This build introduces the first serverless Online Intel prototype for Proxuma IT.

## What it is

A Vercel-compatible serverless endpoint:

```text
/api/proxuma-rdap?domain=example.com
```

The endpoint performs a server-side RDAP lookup and returns a sanitized domain registration summary.

## What it is not

- It is not called automatically by the static frontend.
- It does not add hidden online lookups.
- It does not store API keys in the browser.
- It does not change the offline scanner verdict by itself.
- It does not collect telemetry.

## Why this bridge matters

The Online Intel path should be:

```text
Static frontend → user consent → serverless bridge → provider lookup → sanitized result → Proxuma report
```

This avoids exposing provider logic, future API keys, or raw provider responses inside the browser.

## Current status

```text
Prototype: Ready
Frontend integration: Not enabled
Automatic calls: Off
API keys: None required for this RDAP prototype
User consent requirement: Preserved
```

## Deployment note

GitHub Pages will ignore the `/api` folder. To run this endpoint, the repository must also be deployed through Vercel or another serverless platform that supports Node-style API functions.

