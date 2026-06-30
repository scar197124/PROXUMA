# Proxuma IT v3.52.2 Hosted Release Checklist

Use the deployed HTTPS URL, not a local ZIP preview.

## Core journey
- Open the landing page in a fresh private window.
- Paste a normal URL, suspicious URL, message, IP address, and QR payload.
- Confirm the result, risk heat, evidence, and recommended next step update.
- Save a session, reload, compare, export HTML, and export JSON.
- Reset the workspace and clear local data.

## Mobile
- Test portrait and landscape at 320 px and 390 px widths.
- Confirm long URLs wrap without horizontal page scrolling.
- Confirm every primary control is at least 44 px high and reachable without precision tapping.
- Test QR permission denial and camera-unavailable states.

## Accessibility
- Navigate from the browser chrome using only Tab, Shift+Tab, Enter, Space, and Escape.
- Confirm the skip link reaches the scanner.
- Confirm focus is always visible.
- Test 200% zoom and reduced motion.
- Confirm scan updates are announced without moving focus unexpectedly.

## Trust and privacy
- Confirm local scans make no network request.
- Confirm online tools remain locked until explicit consent.
- Confirm observed findings, local interpretation, and suggested actions remain visibly distinct.
- Confirm clearing local data removes history, notes, and saved sessions.

## GitHub Pages
- Confirm `index.html`, CSS, JavaScript, images, and 404 fallback load with relative paths.
- Hard refresh after deployment and test in a clean browser profile.
- Record browser, device, failure steps, expected result, and actual result for every defect.
