// Shared data layer. Public repo, so reads need no token.
const REPO = 'Feirzen/bulk-manager';
const RAW = `https://raw.githubusercontent.com/${REPO}/main/`;
const WINDOW_DAYS = 14;

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

// Last N days, newest first.
function recentDates(n = WINDOW_DAYS) {
  const out = [], now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    out.push(isoDate(d));
  }
  return out;
}

// One fetch pass shared by every view: nutrition, workouts, and daily health
// across the rolling window, keyed by date.
async function loadWindow() {
  const dates = recentDates();
  const now = new Date();
  const prev = new Date(now);
  prev.setMonth(prev.getMonth() - 1);
  const months = [...new Set([monthKey(prev), monthKey(now)])];

  const [state, config, nutritionMonths, workoutMonths, healthDays] = await Promise.all([
    load('data/state.json', {}),
    load('config.json', {}),
    Promise.all(months.map(m => load(`data/nutrition/${m}.json`, { days: {} }))),
    Promise.all(months.map(m => load(`data/workouts/log-${m}.json`, { sessions: [] }))),
    Promise.all(dates.map(d => load(`data/health/${d}.json`)))
  ]);

  const nutrition = {};
  nutritionMonths.forEach(m => Object.assign(nutrition, m.days || {}));

  const workouts = {};
  workoutMonths.forEach(m => (m.sessions || []).forEach(s => {
    (workouts[s.date] = workouts[s.date] || []).push(s);
  }));

  const health = {};
  healthDays.filter(Boolean).forEach(h => { health[h.date] = h; });

  return { state, config, nutrition, workouts, health, dates };
}

// Weight readings, oldest first. A zero means no reading that day and is
// dropped entirely. It never means a real weight.
function weightSeries(health) {
  return Object.values(health)
    .filter(h => h && h.body_mass_lb > 0)
    .map(h => ({ date: h.date, lb: h.body_mass_lb }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// Trailing 7-day average at each reading. Needs two readings inside the
// window before it will publish a number.
function rollingTrend(series) {
  return series.map((pt, i) => {
    const cutoff = new Date(pt.date);
    cutoff.setDate(cutoff.getDate() - 6);
    const iso = isoDate(cutoff);
    const win = series.slice(0, i + 1).filter(p => p.date >= iso);
    if (win.length < 2) return null;
    return { date: pt.date, lb: win.reduce((a, p) => a + p.lb, 0) / win.length };
  }).filter(Boolean);
}

function dayTotals(entries) {
  return (entries || []).reduce(
    (a, e) => ({ cal: a.cal + (e.calories || 0), pro: a.pro + (e.protein_g || 0) }),
    { cal: 0, pro: 0 }
  );
}
