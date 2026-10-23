// Theme switching. Four options: dark, light, sepia, gecko.
// Everything renders from CSS custom properties, so switching is one
// attribute on <html>. Gecko writes the same variables inline, overriding
// whatever the sheet set. Included by every page.
// The settings gear beside the date is the shared kit's gear (Feirzen/flag-hub
// kit/kit.js): it rolls out Look and Flag. Bulk Manager still paints its own looks.

const THEMES = {
  dark:  { label: 'Dark',  swatch: '#0F0F13' },
  light: { label: 'Light', swatch: '#F6F3EC' },
  sepia: { label: 'Sepia', swatch: '#2A211A' },
  gecko: { label: 'Gecko', swatch: 'conic-gradient(#F87171,#FBBF24,#34D399,#38BDF8,#A78BFA,#F87171)' }
};

const THEME_VARS = ['paper', 'card', 'ink', 'ink-2', 'ink-3', 'rule', 'track', 'signal', 'protein', 'burn', 'over', 'navbg'];
const THEME_KEY  = 'bulk-theme';
const GECKO_KEY  = 'bulk-gecko';
const TONE_KEY   = 'bulk-gecko-tone';   // any | light | dark
const LOCK_KEY   = 'bulk-gecko-lock';   // '1' keeps the saved palette, '0' rolls new colors each page
const lsGet = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
const geckoTone = () => ['light', 'dark'].includes(lsGet(TONE_KEY)) ? lsGet(TONE_KEY) : 'any';
const geckoLocked = () => lsGet(LOCK_KEY) !== '0';   // locked unless turned off: the palette stays put, like it always has

function currentTheme() {
  try { return THEMES[localStorage.getItem(THEME_KEY)] ? localStorage.getItem(THEME_KEY) : 'dark'; }
  catch (e) { return 'dark'; }
}

// One random hue drives the whole palette, with the accent pushed roughly
// opposite it so it still reads as an accent. Occasionally rolls light.
function makeGecko(tone = geckoTone()) {   // tone: any, light only, or dark only
  const h    = Math.floor(Math.random() * 360);
  const acc  = (h + 120 + Math.floor(Math.random() * 110)) % 360;
  const H    = (x, s, l, a) => `hsl(${x} ${s}% ${l}%${a ? ' / ' + a + '%' : ''})`;

  if (tone === 'light' || (tone !== 'dark' && Math.random() < 0.3)) {
    return {
      paper: H(h, 32, 95), card: H(h, 42, 99), track: H(h, 26, 91),
      rule: H(h, 22, 83), ink: H(h, 38, 11), 'ink-2': H(h, 18, 33),
      'ink-3': H(h, 14, 50), signal: H(acc, 66, 37),
      protein: 'hsl(158 72% 29%)', burn: 'hsl(32 88% 34%)', over: 'hsl(0 72% 44%)',
      navbg: H(h, 42, 99, 93)
    };
  }
  return {
    paper: H(h, 26, 7), card: H(h, 22, 12), track: H(h, 20, 19),
    rule: H(h, 18, 22), ink: H(h, 26, 95), 'ink-2': H(h, 14, 74),
    'ink-3': H(h, 12, 50), signal: H(acc, 74, 63),
    protein: 'hsl(158 66% 56%)', burn: 'hsl(38 92% 55%)', over: 'hsl(0 82% 73%)',
    navbg: H(h, 22, 12, 93)
  };
}

function paintGecko(vars) {
  THEME_VARS.forEach(v => document.documentElement.style.setProperty('--' + v, vars[v]));
  syncMeta();
}
function clearGecko() {
  THEME_VARS.forEach(v => document.documentElement.style.removeProperty('--' + v));
}

function syncMeta() {
  document.querySelectorAll('meta[name="theme-color"]').forEach(m => m.remove());
  const m = document.createElement('meta');
  m.name = 'theme-color';
  m.content = getComputedStyle(document.documentElement).getPropertyValue('--paper').trim() || '#0F0F13';
  document.head.appendChild(m);
}

function applyTheme(name, reroll) {
  const t = THEMES[name] ? name : 'dark';
  document.documentElement.setAttribute('data-theme', t);
  try { localStorage.setItem(THEME_KEY, t); } catch (e) {}

  if (t === 'gecko') {
    let vars = null;
    if (!reroll && geckoLocked()) {
      try { vars = JSON.parse(localStorage.getItem(GECKO_KEY) || 'null'); } catch (e) {}
    }
    if (!vars) {
      vars = makeGecko();
      try { localStorage.setItem(GECKO_KEY, JSON.stringify(vars)); } catch (e) {}
    }
    paintGecko(vars);
  } else {
    clearGecko();
    if (document.head) syncMeta();
  }
}

// Apply before paint so there is no flash of the wrong theme.
applyTheme(currentTheme(), false);

const GEAR_SVG = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';

// The gear has to exist before the kit (a deferred script) looks for it, so it's
// built when parsing finishes ('interactive'), which is before deferred scripts run.
function buildGear() {
  const header = document.querySelector('header');
  if (!header || document.querySelector('.themebtn')) return;

  const btn = document.createElement('button');
  btn.className = 'themebtn gear';
  btn.id = 'bmGear';
  btn.setAttribute('aria-label', 'Settings');
  btn.title = 'Settings';
  btn.innerHTML = GEAR_SVG;

  // Sits beside the date, whatever the page header layout is.
  const anchor = header.querySelector('.date');
  if (anchor && anchor.parentElement) {
    anchor.parentElement.style.display = 'flex';
    anchor.parentElement.style.alignItems = 'center';
    anchor.parentElement.style.gap = '9px';
    anchor.after(btn);
  } else {
    header.appendChild(btn);
  }
}

const KIT_TO_BM = { light: 'light', dark: 'dark', sepia: 'sepia', chameleon: 'gecko' };
window.KitConfig = {
  gear: '#bmGear',
  look: {
    labels: { chameleon: 'Gecko' },
    get: () => ({ theme: currentTheme() === 'gecko' ? 'chameleon' : currentTheme(), tone: geckoTone(), locked: currentTheme() === 'gecko' && geckoLocked() }),
    set: t => applyTheme(KIT_TO_BM[t] || 'dark', false),
    tone: t => { lsSet(TONE_KEY, t); applyTheme('gecko', true); },
    lock: on => lsSet(LOCK_KEY, on ? '1' : '0'),
    reroll: () => applyTheme('gecko', true),
  },
};

if (document.readyState === 'loading') {
  document.addEventListener('readystatechange', buildGear, { once: true });
} else {
  buildGear();
}
