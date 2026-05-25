# Proxuma QR Safari Compatibility Patch v12.9

Status: applied to the shared Proxuma QR bridge.

## Purpose

Proxuma Lite and any app using the shared `html5-qrcode.local.js` bridge were showing an unsupported/fallback message on Safari/Mac because the bridge depended on browser-native `BarcodeDetector`.

This patch preserves the native `BarcodeDetector` path when available and adds a Safari-compatible `jsQR` decoder path when `BarcodeDetector` is unavailable.

## Rules preserved

- Camera permission is requested only after the user opens/starts the QR scanner.
- Decoded QR payloads stay in the browser and feed into the existing Proxuma offline scanner.
- No threat-intelligence API calls were added.
- Manual paste remains the fallback.
- Proxuma Lite UI and scan logic remain otherwise unchanged.
- Proxuma IT v2.70.1 remains the reference pattern for this fix.

## Files patched

- `shared/html5-qrcode.local.js`
- `lite/shared/html5-qrcode.local.js`
- `shield/shared/html5-qrcode.local.js`

## Next recommended step

Test Proxuma Lite on Mac/Safari:
1. Open Proxuma Lite.
2. Click Show QR Scanner.
3. Confirm the camera loads instead of showing the unsupported message.
4. Scan a QR code and confirm the decoded payload drops into the scan input.

After Lite is confirmed, apply/verify the same QR compatibility pattern for Proxuma Sense if/when Sense has an active QR camera scanner.
