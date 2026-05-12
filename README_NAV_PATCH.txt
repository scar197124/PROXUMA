PROXUMA NAV HOME PATCH

Canonical home target:
https://scar197124.github.io/PROXUMA/

Patched file:
- Proxuma-sense_INDEX_PATCHED.html

What changed:
- In Proxuma Sense, the top navigation button formerly labeled "Proxuma" and wired to show the internal ecosystem panel now becomes "Home".
- That Home button now sends users back to:
  https://scar197124.github.io/PROXUMA/

Upload instruction:
- In the Proxuma-sense repo, replace the active Sense index.html with this patched file.
- Rename Proxuma-sense_INDEX_PATCHED.html to index.html before upload if needed.

Do not change Shield right now because Shield is already routing home correctly.
Do not push the old gateway-style Proxuma page into Lite root unless you intentionally want the root to be a gateway.
