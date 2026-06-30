# Proxuma IT Online Provider Architecture v3.26.0

## Rule
No API keys in the GitHub Pages frontend. No automatic fetch calls. Online intelligence must remain explicit and consent-gated.

## Future flow
Frontend → user consent → serverless function → provider API → summarized result → user-visible report.

## Provider slots
1. Domain Age / RDAP
2. Certificate Transparency
3. Redirect Expansion
4. Reputation Lookup
5. Threat Feed Check

## Current status
Inactive architecture. User-opened lookup links and user-entered findings notes remain the only online-adjacent behavior.
