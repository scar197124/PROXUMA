# NEXT CHAT HANDOFF — Proxuma QR Safari Compatibility v12.9

Current package: PROXUMA main family package with Safari/Mac QR compatibility patch applied.

## What changed

The shared QR bridge no longer stops at “BarcodeDetector unavailable.” It now:

1. Uses native `BarcodeDetector` when supported.
2. Loads a `jsQR` compatibility decoder when native support is missing.
3. Keeps camera access user-triggered.
4. Sends decoded QR payloads into the existing Proxuma local scanner path.
5. Keeps manual paste fallback.

## Important

This patch was applied sideways from the locked Proxuma IT v2.70.1 Safari QR Compatibility Fallback pattern.

This is mainly for Proxuma Lite right now. Sense in this package does not appear to expose the same active QR camera scanner UI, though the Proxuma family trajectory says Sense may need the same patch if its QR scanner is active in another branch.

## Continue from here

Next task should be user testing on Mac/Safari:
- If Lite camera opens: lock this package as the Proxuma Lite QR Safari compatibility base.
- If Lite still fails: inspect console/camera permissions and verify the local/shared script path loaded correctly.
- After Lite is confirmed: patch the active Sense QR branch using the same pattern.
