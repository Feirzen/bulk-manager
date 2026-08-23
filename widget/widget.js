// Bulk Manager widget for Scriptable.
//
// Setup:
//   1. Scriptable app, tap + to make a new script, name it exactly: Bulk
//   2. Paste all of this in, tap Done
//   3. Long-press the home screen, +, search Scriptable, pick the MEDIUM size
//   4. Long-press the placed widget, Edit Widget, set Script to "Bulk"
//      and set When Interacting to "Run Script"
//
// Refresh: iOS decides when widgets reload, usually no more than every ~15
// minutes. Tapping the widget opens the dashboard and forces a fresh read.

const RAW = 'https://raw.githubusercontent.com/Feirzen/bulk-manager/main/';
const SITE = 'https://feirzen.github.io/bulk-manager/';

const INK = new Color('#141B26');
const MUTED = new Color('#8B939E');
const SIGNAL = new Color('#2B50D4');
const PROT = new Color('#0F8A6A');
const OVER = new Color('#C4342A');
const TRACK = new Color('#DFE1E4');

// Menlo ships with iOS. IBM Plex does not, so the site's font is not available
// here. Menlo is the closest monospace with true tabular numerals.
const mono = n => new Font('Menlo-Regular', n);
const monoBold = n => new Font('Menlo-Bold', n);

const W = 300;

// ---------------------------------------------------------------- drawing

// The chart-recorder scale from the dashboard: a filled track, ticks every
// 500 kcal, and a hard marker at the goal.
function gaugeImage(eaten, goal) {
  const H = 24, TOP = 5, BAR = 11;
  const max = Math.max(goal * 1.15, eaten * 1.05, 1);
  const x = v => Math.min(v / max, 1) * W;

  const dc = new DrawContext();
  dc.size = new Size(W, H);
  dc.opaque = false;
  dc.respectScreenScale = true;

  dc.setFillColor(TRACK);
  dc.fillRect(new Rect(0, TOP, W, BAR));

  dc.setFillColor(eaten > goal ? OVER : SIGNAL);
  dc.fillRect(new Rect(0, TOP, x(Math.min(eaten, goal)), BAR));

  if (eaten > goal) {
    dc.setFillColor(OVER);
    dc.fillRect(new Rect(x(goal), TOP, x(eaten) - x(goal), BAR));
  }

  dc.setFillColor(MUTED);
  for (let v = 500; v <= max; v += 500) {
    const tall = v % 1000 === 0;
    dc.fillRect(new Rect(x(v), TOP + BAR + 2, 1, tall ? 5 : 3));
  }

  dc.setFillColor(INK);
  dc.fillRect(new Rect(Math.max(0, x(goal) - 1), TOP - 4, 2, BAR + 8));

  return dc.getImage();
}

function barImage(frac, color) {
  const H = 7;
  const dc = new DrawContext();
  dc.size = new Size(W, H);
  dc.opaque = false;
  dc.respectScreenScale = true;

  const round = (rect, c) => {
    const p = new Path();
    p.addRoundedRect(rect, H / 2, H / 2);
    dc.setFillColor(c);
    dc.addPath(p);
    dc.fillPath();
  };

  round(new Rect(0, 0, W, H), TRACK);
  const fill = Math.max(0, Math.min(frac, 1)) * W;
  if (fill > 1) round(new Rect(0, 0, Math.max(fill, H), H), color);

  return dc.getImage();
}

// ---------------------------------------------------------------- fetch

let state = null;
try {
  const req = new Request(RAW + 'data/state.json?t=' + Date.now());
  req.timeoutInterval = 10;
  state = await req.loadJSON();
} catch (e) {
  state = null;
}

// ---------------------------------------------------------------- build

const w = new ListWidget();
w.backgroundColor = new Color('#FFFFFF');
w.setPadding(13, 16, 13, 16);
w.url = SITE;

if (!state) {
  w.addSpacer();
  const a = w.addText('Cannot reach the log');
  a.font = Font.semiboldSystemFont(14);
  a.textColor = INK;
  w.addSpacer(3);
  const b = w.addText('Check your connection, then tap to retry.');
  b.font = Font.systemFont(11);
  b.textColor = MUTED;
  w.addSpacer();
} else {
  const goal = state.calorie_goal || 0;
  const eaten = state.calories_consumed || 0;
  const remain = goal - eaten;
  const over = remain < 0;

  const head = w.addStack();
  head.centerAlignContent();
  const lbl = head.addText('CALORIES ' + (over ? 'OVER' : 'LEFT'));
  lbl.font = mono(9);
  lbl.textColor = MUTED;
  head.addSpacer();
  const days = state.streak_days || 0;
  const st = head.addText((days > 0 ? '\u25CF ' : '\u25CB ') + days + 'd');
  st.font = monoBold(10);
  st.textColor = days > 0 ? PROT : MUTED;

  w.addSpacer(2);

  const big = w.addText(Math.abs(remain).toLocaleString());
  big.font = monoBold(32);
  big.textColor = over ? OVER : INK;

  const sub = w.addText(
    eaten.toLocaleString() + ' of ' + goal.toLocaleString() + ' kcal' +
    (state.provisional_targets ? '  \u00b7 provisional' : '')
  );
  sub.font = mono(9);
  sub.textColor = MUTED;

  w.addSpacer(5);
  w.addImage(gaugeImage(eaten, goal)).imageSize = new Size(W, 24);

  w.addSpacer();

  const pGoal = state.protein_goal_g || 0;
  const pNow = state.protein_consumed_g || 0;
  const met = pGoal > 0 && pNow >= pGoal;

  const prow = w.addStack();
  prow.centerAlignContent();
  const pl = prow.addText('PROTEIN');
  pl.font = mono(9);
  pl.textColor = MUTED;
  prow.addSpacer();
  const pv = prow.addText(pNow + ' / ' + pGoal + ' g' + (met ? '  \u2713' : ''));
  pv.font = monoBold(10);
  pv.textColor = met ? PROT : INK;

  w.addSpacer(3);
  w.addImage(barImage(pGoal ? pNow / pGoal : 0, PROT)).imageSize = new Size(W, 7);
}

w.refreshAfterDate = new Date(Date.now() + 15 * 60 * 1000);

if (config.runsInWidget) {
  Script.setWidget(w);
} else {
  w.presentMedium();
}
Script.complete();
