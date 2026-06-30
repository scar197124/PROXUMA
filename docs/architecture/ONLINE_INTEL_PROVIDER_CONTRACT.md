# Online Intel Provider Contract — v3.28.0

Future providers must follow this contract before being connected to Proxuma IT.

## Provider slot types

- Domain age / RDAP
- Certificate transparency
- Redirect expansion
- Reputation lookup
- Threat feed check

## Minimum provider response

Every provider response should be reduced to:

- Provider name
- Check type
- Lookup target
- Timestamp
- Plain-language summary
- Evidence signals
- Confidence limits
- Privacy note

## Forbidden frontend behavior

- No frontend API key.
- No hidden `fetch()` from the static app.
- No automatic provider lookup on page load.
- No provider call before consent.
- No sending local scan history unless the user explicitly exports/shares it.

## Result handling

Provider findings should be appended to the existing Online Intel notes/case packet flow, not added as a new large public card unless a future release intentionally redesigns the report layout.
