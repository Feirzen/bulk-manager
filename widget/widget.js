// Scriptable widget for bulk-manager.
// Paste into a new Scriptable script named "Bulk", then add a medium widget
// to the home screen and set its script to "Bulk".
//
// Note on refresh: iOS decides when widgets reload, usually no more often than
// every ~15 minutes. Tapping the widget opens the script and shows current data
// immediately, which is the reliable way to force a fresh read.

const URL_STATE = 'https://raw.githubusercontent.com/Feirzen/bulk-manager/main/data/state.json';

const INK = new Color('#141B26');
const MUTED = new Color('#8B939E');
const SIGNAL = new Color('#2B50D4');
const PROTEIN = new Color('#0F8A6A');
const OVER = new Color('#C4342A');
const TRACK = new Color('#DFE1E4');

let s;
try {
  s = await new Request(URL_STATE + '?t=' + Date.now()).loadJSON();
} catch (e) {
  s = null;
}

const w = new ListWidget();
w.backgroundColor = new Color('#FFFFFF');
w.setPadding(14, 15, 14, 15);
w.url = 'https://feirzen.github.io/bulk-manager/';

if (!s) {
  const t = w.addText('Cannot reach the log');
  t.font = Font.mediumSystemFont(13);
  t.textColor = INK;
  const u = w.addText('Check your connection, then tap to retry.');
  u.font = Font.systemFont(11);
  u.textColor = MUTED;
  Script.setWidget(w);
  Script.complete();
}

const goal = s.calorie_goal || 0;
const eaten = s.calories_consumed || 0;
const remain = goal - eaten;
const over = remain < 0;

// Header row
const head = w.addStack();
head.centerAlignContent();
const lbl = head.addText('CALORIES ' + (over ? 'OVER' : 'LEFT'));
lbl.font = new Font('IBMPlexMono-Medium', 9);
lbl.textColor = MUTED;
head.addSpacer();
const streak = head.addText('\u25CF ' + (s.streak_days || 0) + 'd');
streak.font = new Font('IBMPlexMono-SemiBold', 10);
streak.textColor = (s.streak_days || 0) > 0 ? PROTEIN : MUTED;

w.addSpacer(3);

// Big number
const big = w.addText(Math.abs(remain).toLocaleString());
big.font = new Font('IBMPlexMono-SemiBold', 38);
big.textColor = over ? OVER : INK;

const sub = w.addText(eaten.toLocaleString() + ' of ' + goal.toLocaleString() + ' kcal');
sub.font = new Font('IBMPlexMono-Regular', 10);
sub.textColor = MUTED;

w.addSpacer(8);

// Bars
function bar(frac, color) {
  const track = w.addStack();
  track.backgroundColor = TRACK;
  track.cornerRadius = 3;
  track.size = new Size(0, 6);
  const fill = track.addStack();
  fill.backgroundColor = color;
  fill.cornerRadius = 3;
  fill.size = new Size(Math.max(2, Math.min(frac, 1) * 290), 6);
  fill.addSpacer();
  track.addSpacer();
}

bar(goal ? eaten / goal : 0, over ? OVER : SIGNAL);
w.addSpacer(7);

const pGoal = s.protein_goal_g || 0;
const pNow = s.protein_consumed_g || 0;
const prow = w.addStack();
const pl = prow.addText('PROTEIN');
pl.font = new Font('IBMPlexMono-Medium', 9);
pl.textColor = MUTED;
prow.addSpacer();
const pv = prow.addText(pNow + ' / ' + pGoal + ' g');
pv.font = new Font('IBMPlexMono-SemiBold', 11);
pv.textColor = pNow >= pGoal && pGoal > 0 ? PROTEIN : INK;
w.addSpacer(3);
bar(pGoal ? pNow / pGoal : 0, PROTEIN);

w.refreshAfterDate = new Date(Date.now() + 15 * 60 * 1000);

if (config.runsInWidget) {
  Script.setWidget(w);
} else {
  w.presentMedium();
}
Script.complete();
