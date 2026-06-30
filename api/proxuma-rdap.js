// Proxuma IT v3.52.2 — Optional Vercel RDAP bridge
// Serverless-only endpoint. Do not call this automatically from the frontend.
// Purpose: user-consented domain registration context through a backend boundary.

function setSecurityHeaders(res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
}

function normalizeDomain(raw) {
  const input = String(raw || '').trim().toLowerCase();
  if (!input) return '';
  let candidate = input;
  try {
    if (/^https?:\/\//i.test(candidate)) {
      candidate = new URL(candidate).hostname;
    }
  } catch (_err) {
    return '';
  }
  candidate = candidate.replace(/^www\./, '').replace(/\.$/, '');
  return candidate;
}

function isValidDomain(domain) {
  if (!domain || domain.length > 253) return false;
  if (domain.includes('..') || domain.includes(',') || domain.includes('_')) return false;
  if (!/^[a-z0-9.-]+$/.test(domain)) return false;
  const labels = domain.split('.');
  if (labels.length < 2) return false;
  return labels.every((label) => label.length > 0 && label.length <= 63 && !label.startsWith('-') && !label.endsWith('-'));
}

function pickEventDate(events, actionNames) {
  if (!Array.isArray(events)) return null;
  const wanted = actionNames.map((name) => String(name).toLowerCase());
  const match = events.find((event) => wanted.includes(String(event.eventAction || '').toLowerCase()));
  return match && match.eventDate ? match.eventDate : null;
}

function summarizeRdap(domain, rdap) {
  const events = Array.isArray(rdap.events) ? rdap.events : [];
  const nameservers = Array.isArray(rdap.nameservers)
    ? rdap.nameservers.map((ns) => ns.ldhName || ns.unicodeName).filter(Boolean).slice(0, 6)
    : [];
  const status = Array.isArray(rdap.status) ? rdap.status.slice(0, 8) : [];

  return {
    provider: 'rdap.org',
    domain,
    rdapHandle: rdap.handle || null,
    objectClassName: rdap.objectClassName || null,
    registrarName: rdap.registrarName || null,
    created: pickEventDate(events, ['registration', 'created']),
    updated: pickEventDate(events, ['last changed', 'last update of rdap database', 'updated']),
    expires: pickEventDate(events, ['expiration', 'expires']),
    status,
    nameservers,
    notice: 'RDAP data is provider-supplied and should be treated as supporting context, not a final safety verdict.'
  };
}

module.exports = async function handler(req, res) {
  setSecurityHeaders(res);

  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.end(JSON.stringify({ ok: false, error: 'Method not allowed. Use GET with ?domain=example.com.' }));
    return;
  }

  const domain = normalizeDomain(req.query && req.query.domain);
  if (!isValidDomain(domain)) {
    res.statusCode = 400;
    res.end(JSON.stringify({ ok: false, error: 'Invalid domain. Supply a normal domain like example.com.' }));
    return;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 7000);

  try {
    const response = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
      method: 'GET',
      headers: { 'Accept': 'application/rdap+json, application/json' },
      signal: controller.signal
    });

    const text = await response.text();
    let rdap = null;
    try { rdap = JSON.parse(text); } catch (_err) { rdap = null; }

    if (!response.ok) {
      res.statusCode = response.status;
      res.end(JSON.stringify({ ok: false, domain, status: response.status, error: 'RDAP lookup failed or no RDAP record was returned.' }));
      return;
    }

    res.statusCode = 200;
    res.end(JSON.stringify({ ok: true, type: 'rdap-domain-summary', result: summarizeRdap(domain, rdap || {}) }));
  } catch (err) {
    const aborted = err && err.name === 'AbortError';
    res.statusCode = aborted ? 504 : 502;
    res.end(JSON.stringify({ ok: false, domain, error: aborted ? 'RDAP lookup timed out.' : 'RDAP lookup bridge error.' }));
  } finally {
    clearTimeout(timer);
  }
};

module.exports._test = { normalizeDomain, isValidDomain, summarizeRdap };
