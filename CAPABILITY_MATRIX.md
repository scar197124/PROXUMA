# Proxuma IT Capability Matrix

Current release: **v3.50.0 — Validation Foundation**

This matrix states what the product actually inspects, where the evidence comes from, and where users should remain cautious.

| Capability | Input | What is inspected | Source | Output | Confidence / limitation | Privacy |
|---|---|---|---|---|---|---|
| URL and domain review | Pasted URL or domain | Protocol, hostname, root-domain shape, path, query, encoding, known lexical patterns, suspicious wording, lookalike indicators | Local JavaScript rules | Risk score, finding cards, target explanation, recommended action | Heuristic guidance; not proof of safety or maliciousness | Local by default |
| Message and snippet review | Pasted SMS, email text, or copied snippet | Pressure language, credential requests, suspicious links, risky file references, payment or urgency cues | Local JavaScript rules | Summary, findings, confidence, next action | Context-sensitive; may miss novel wording or benign edge cases | Local by default |
| QR content review | Camera-decoded or pasted QR payload | Decoded text or URL using the same local rules | Browser QR support or bundled local decoder | Same report model as pasted content | Camera support varies by browser; a decoded payload is not automatically safe | Local by default |
| IP and port clues | Pasted IP, host, or host:port | Address form, literal IP use, port clues, context markers | Local JavaScript rules | Findings and technical notes | Does not probe the host or verify ownership | Local by default |
| Link anatomy | Parsed URL | Protocol, host, root domain, path, query, encoded tokens | Browser URL parser plus local rules | Human-readable anatomy breakdown | Parsing explains structure; it does not establish reputation | Local by default |
| Local scan history | Completed local scans | Saved report summaries and pattern memory | Browser local storage | History, comparison, continuity views | Data remains tied to the current browser profile unless exported | Stored locally |
| Case and report export | Current report and notes | Existing local report data | Local export functions | Text and JSON case packets | Export reflects the current engine and user-entered notes | Created locally |
| Online RDAP lookup | User-triggered domain lookup with consent | Registration data available through configured provider | Optional serverless endpoint | External-intelligence note | Availability and completeness depend on provider and deployment host | Network request only after explicit action |
| Deep Scan | Any supported input | Not currently implemented as a distinct engine | Unavailable | Clearly marked as planned | Must not be interpreted as active functionality | No request made |

## Evidence labels

- **Observed:** directly parsed or detected from the submitted input.
- **Inferred:** interpretation produced by local heuristics.
- **User supplied:** notes, labels, or context entered by the user.
- **External intelligence:** data returned by an explicitly triggered online provider.
- **Unavailable:** a capability the interface names but does not currently perform.
- **Guidance:** a recommended action, not a verified fact.

## Safety boundary

Proxuma IT is an investigation aid, not a guarantee. A low-risk result does not prove that a target is safe, and a high-risk result does not prove malicious intent. Users should verify important decisions through trusted channels and independent security review.
