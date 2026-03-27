// api/vitals/index.js
// Vercel serverless endpoint to receive vitals from ESPs and serve them to frontend

const MAX_ENTRIES = 100000;
let buffer = new Array(MAX_ENTRIES); // pre-allocate for performance
let len = 0; // number of stored entries (<= MAX_ENTRIES)
let writePos = 0; // next write index
let idCounter = 0;

function makeEntry(data) {
  return {
    id: ++idCounter,
    patientId: data.patientId || null,
    metrics: data.metrics || data, // support both flat and nested `metrics`
    ts: Date.now(),
  };
}

function pushEntry(entry) {
  buffer[writePos] = entry;
  writePos = (writePos + 1) % MAX_ENTRIES;
  if (len < MAX_ENTRIES) len++;
}

function getEntries({ patientId = null, limit = 100, offset = 0, since = 0 } = {}) {
  // Collect entries in reverse chronological order up to `limit`, applying patientId filter and since timestamp
  const res = [];
  if (len === 0) return res;

  // Determine the true start index (oldest available) and iterate backwards
  let available = len;
  let idx = (writePos - 1 + MAX_ENTRIES) % MAX_ENTRIES; // newest

  while (available > 0 && res.length < limit + offset) {
    const e = buffer[idx];
    if (e) {
      if ((!patientId || e.patientId === patientId) && (!since || e.ts >= since)) {
        res.push(e);
      }
    }
    idx = (idx - 1 + MAX_ENTRIES) % MAX_ENTRIES;
    available--;
  }

  // res is newest->oldest; apply offset and limit and return in chronological order (oldest->newest)
  const sliced = res.slice(offset, offset + limit).reverse();
  return sliced;
}

export default function handler(req, res) {
  // Simple CORS for browser + devices
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    let body = req.body;
    // Some deployments may not parse body automatically; try to parse if string
    if (!body) {
      try {
        body = JSON.parse(req.rawBody || '{}');
      } catch (err) {
        return res.status(400).json({ error: 'Invalid JSON' });
      }
    }

    if (!body.patientId) {
      return res.status(400).json({ error: 'patientId is required' });
    }

    const entry = makeEntry(body);
    pushEntry(entry);

    return res.status(201).json({ ok: true, storedId: entry.id });
  }

  if (req.method === 'GET') {
    const { patientId, limit = '100', offset = '0', since = '0' } = req.query || {};
    const l = Math.min(10000, Math.max(1, parseInt(limit, 10) || 100));
    const o = Math.max(0, parseInt(offset, 10) || 0);
    const s = Math.max(0, parseInt(since, 10) || 0);

    const entries = getEntries({ patientId: patientId || null, limit: l, offset: o, since: s });
    return res.status(200).json({ totalStored: len, returned: entries.length, entries });
  }

  res.setHeader('Allow', 'GET,POST,OPTIONS');
  return res.status(405).end('Method Not Allowed');
}
