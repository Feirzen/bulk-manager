// Theme switching. Four options: dark, light, sepia, gecko.
// Everything renders from CSS custom properties, so switching is one
// attribute on <html>. Gecko is generated fresh each time it is picked and
// writes the same variables inline, overriding whatever the sheet set.
// Included by every page. Auto-injects its own button into <header>.

const THEMES = {
  dark:  { label: 'Dark',  swatch: '#0F0F13' },
  light: { label: 'Light', swatch: '#F6F3EC' },
  sepia: { label: 'Sepia', swatch: '#2A211A' },
  gecko: { label: 'Gecko', swatch: 'conic-gradient(#F87171,#FBBF24,#34D399,#38BDF8,#A78BFA,#F87171)' }
};

const THEME_VARS = ['paper', 'card', 'ink', 'ink-2', 'ink-3', 'rule', 'track', 'signal', 'protein', 'burn', 'over', 'navbg'];
const THEME_KEY  = 'bulk-theme';
const GECKO_KEY  = 'bulk-gecko';

function currentTheme() {
  try { return THEMES[localStorage.getItem(THEME_KEY)] ? localStorage.getItem(THEME_KEY) : 'dark'; }
  catch (e) { return 'dark'; }
}

// One random hue drives the whole palette, with the accent pushed roughly
// opposite it so it still reads as an accent. Occasionally rolls light.
function makeGecko() {
  const h    = Math.floor(Math.random() * 360);
  const acc  = (h + 120 + Math.floor(Math.random() * 110)) % 360;
  const H    = (x, s, l, a) => `hsl(${x} ${s}% ${l}%${a ? ' / ' + a + '%' : ''})`;

  if (Math.random() < 0.3) {
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
    if (!reroll) {
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

function buildThemeButton() {
  const header = document.querySelector('header');
  if (!header || document.querySelector('.themebtn')) return;

  const btn = document.createElement('button');
  btn.className = 'themebtn';
  btn.setAttribute('aria-label', 'Change theme');
  btn.innerHTML = '<span class="dot"></span>';

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

  btn.onclick = () => {
    if (document.querySelector('.thememenu')) return closeMenu();

    const scrim = document.createElement('div');
    scrim.className = 'themescrim';
    scrim.onclick = closeMenu;

    const menu = document.createElement('div');
    menu.className = 'thememenu';
    menu.innerHTML = Object.entries(THEMES).map(([k, t]) =>
      `<button data-t="${k}"${k === currentTheme() ? ' class="sel"' : ''}>
         <span class="swat" style="background:${t.swatch}"></span>${t.label}
         ${k === 'gecko' && k === currentTheme() ? '<span style="margin-left:auto;font-size:11px;opacity:.65">reroll</span>' : ''}
       </button>`).join('');

    document.body.appendChild(scrim);
    document.body.appendChild(menu);
    const r = btn.getBoundingClientRect();
    menu.style.top = (r.bottom + 8) + 'px';

    menu.querySelectorAll('button').forEach(b => b.onclick = () => {
      const t = b.dataset.t;
      applyTheme(t, t === 'gecko' && t === currentTheme());
      closeMenu();
    });
  };

  function closeMenu() {
    document.querySelectorAll('.thememenu,.themescrim').forEach(x => x.remove());
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', buildThemeButton);
} else {
  buildThemeButton();
}
