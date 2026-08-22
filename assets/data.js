// Shared data layer. Public repo, so reads need no token.
const REPO = 'Feirzen/bulk-manager';
const RAW = `https://raw.githubusercontent.com/${REPO}/main/`;

// Cache-bust: raw.githubusercontent holds a ~5 min CDN cache without it.
async function load(path, fallback = null) {
  try {
    const r = await fetch(RAW + path + '?t=' + Date.now(), { cache: 'no-store' });
    if (!r.ok) return fallback;
    return await r.json();
  } catch (e) {
    return fallback;
  }
}

const pad = n => String(n).padStart(2, '0');
const isoDate = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const monthKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;

function prettyDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined,
    { weekday: 'short', month: 'short', day: 'numeric' });
}
