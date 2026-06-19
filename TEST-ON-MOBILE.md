# Test Proxuma IT on a phone without GitHub

## Mac and iPhone/Android on the same Wi-Fi

1. Open Terminal.
2. Change into this project folder.
3. Run:

   ```bash
   python3 -m http.server 8000 --bind 0.0.0.0
   ```

4. Find your Mac's Wi-Fi IP address:

   ```bash
   ipconfig getifaddr en0
   ```

5. On the phone, open Safari or Chrome and visit:

   ```text
   http://YOUR-MAC-IP:8000
   ```

   Example: `http://192.168.1.25:8000`

6. Keep Terminal open while testing. Press Control+C when finished.

## What to verify

- Portrait mode does not crop the page horizontally.
- “Turn findings into actions” fits within the screen.
- The five workflow steps become two columns, then one column on very narrow phones.
- Session, explanation, filter, and export controls are full width.
- Rotate to landscape and back to portrait; the page should reflow without needing a refresh.

## Notes

- Both devices must be on the same Wi-Fi network.
- macOS may ask whether Python can accept incoming connections; choose Allow.
- Layout and most app behavior can be tested over local HTTP.
- Camera access may be blocked by mobile browsers on a plain HTTP LAN address because camera APIs usually require HTTPS or localhost.
