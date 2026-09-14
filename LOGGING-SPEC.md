# Logging spec

The contract between Claude and this repo. Read before any write.

## Files

| Path | Written by | Notes |
|---|---|---|
| `config.json` | Claude, weekly | Targets, streak rules, schedule |
| `data/state.json` | Claude, every log | Derived. The widget reads only this |
| `data/nutrition/YYYY-MM.json` | Claude | One file per month |
| `data/body/measurements.json` | Claude | Scale weights, InBody scans, tape |
| `data/health/YYYY-MM-DD.json` | iOS Shortcut | One per day. Never edit |
| `data/workouts/program.json` | Claude, weekly | Current week's sessions |
| `data/workouts/log-YYYY-MM.json` | Claude | Completed sessions |
| `data/preferences/exercises.json` | Claude | Favorited and disliked exercises |
| `data/reviews/weekly-YYYY-MM-DD.md` | Claude, weekly task | Sunday review, narrative |
| `data/reviews/monthly-YYYY-MM.md` | Claude, monthly task | Month in review |
| `assets/exercises.js` | Claude, rarely | Form steps, common errors, load increments |
| `assets/exercise-knowledge.js` | Claude | Targets, where you feel it, substitution notes |
| `assets/exercise-images.js` | Claude | Demo image ids, plus verification state |

## Data conventions

**`body_mass_lb: 0` means no reading that day. It never means a real weight.** Zeros are expected and normal on days he did not step on the scale. Skip them entirely when averaging. A zero must never be treated as a data point, or the trend collapses toward zero and every calorie target derived from it is wrong.

The Shortcut fires at 11:55pm and filters on **today**, so each file holds the day named in its filename. The last five minutes of a day are not captured. This does not matter.

### Weight has two paths, and both count

Scale weight normally arrives through Apple Health and lands in the daily health files. It can also be typed straight in, which is what happens when the nightly sync does not run or when he sends a number in chat.

`data/body/measurements.json` therefore holds three arrays. Its `weights` array is a first-class source of bodyweight, not a fallback:

```json
{
  "weights": [{ "date": "2026-09-14", "lb": 168.2, "source": "scale" }],
  "inbody": [],
  "tape": []
}
```

**Any weight he sends gets appended to `weights`.** Never wait for the Shortcut. An earlier version of this spec said this file was InBody and tape only; that was wrong and cost the system three weeks of weight data.

When computing a trend, merge non-zero `body_mass_lb` values from `data/health/` with the `weights` array and dedupe by date. If both sources have the same date, the `weights` entry wins, because it was entered deliberately.

Active energy from Apple Watch overreads for resistance training, commonly 20 to 40 percent. Recorded for trend interest, never used to set targets.

## Nutrition entry

```json
{
  "time": "12:30",
  "description": "Grilled chicken salad, half breast, cheese",
  "calories": 420,
  "protein_g": 41,
  "confidence": "medium",
  "note": ""
}
```

`confidence` is `high` for a legible label, `medium` for a recognizable photo, `low` when portion or added fat is unclear. The dashboard flags `low` entries.

## state.json

Recomputed in full on every nutrition or workout write. Never patched in place.

```json
{
  "date": "2026-09-15",
  "updated_at": "2026-09-15T18:22:00Z",
  "calorie_goal": 3100,
  "calories_consumed": 1840,
  "protein_goal_g": 165,
  "protein_consumed_g": 112,
  "entries_today": 3,
  "streak_days": 6,
  "sessions_this_week": 2,
  "sessions_target": 3,
  "last_session_date": "2026-09-15",
  "days_since_lift": 0,
  "weight_trend_lb": 171.2,
  "weight_trend_change_lb": 0.4,
  "next_lift_day": "Wed",
  "provisional_targets": true
}
```

When the date rolls over, reset the consumed values to zero and recompute the streak against the completed previous day. `sessions_this_week` counts logged sessions since the most recent Monday.

**The dashboard does not trust this file for today's totals.** `index.html` derives calories, protein, streak, and next lift day from the month file and `config.json`, because `state.json` only refreshes when Claude writes and otherwise shows the last logged day forever. `state.json` exists for the Scriptable widget, which cannot do that work itself. Keep writing it, but a stale copy no longer breaks the dashboard.

## Streaks

Two streaks, tracked separately, because they measure different things.

**Training streak is the live one.** It counts consecutive *scheduled lift days* (Mon, Wed, Fri) with a logged session. Missing one resets it. Optional add-ins and Saturday flex work neither break it nor count toward it, so an extra session is always free. A streak of 5 means the last five scheduled lift days all happened, which is roughly two weeks of showing up. Counting by week was considered and rejected: a week-based streak breaks on a single missed Friday and then reads as a total failure, which is the opposite of useful.

Today in progress never breaks a streak. If today is a lift day and nothing is logged yet, the count runs to the previous lift day.

**Nutrition streak is dormant, not deleted.** A day counted when both held: at least one meal logged, and protein met or exceeded the target. Calories were excluded on purpose, since estimates are too noisy to gate a streak on. The rules stay in `config.json` and resume working the moment nutrition logging restarts.

## Weight trend

`weight_trend_lb` is the 7-day rolling average of bodyweight readings, merged from both sources described above and deduped by date. With every-other-day weighing that is normally three or four real readings per window, which is enough. Below two readings in a window, leave it `null` rather than publishing a number built on one data point.

`weight_trend_change_lb` is this week's average minus last week's.

## Workout session

Parsed from a pasted `WORKOUT LOG` block.

```json
{
  "date": "2026-09-15",
  "title": "Full Body A",
  "feel": "solid",
  "exercises": [
    { "name": "Leg press",
      "sets": [{ "weight_lb": 185, "reps": 8, "rpe": 8 }] }
  ]
}
```

Missing RPE is fine, record `null`. A skipped day is a session with an empty `exercises` array and `"feel": "skipped"`, which keeps the calendar honest without punishing the streak.

An exercise may carry a `note` when it was substituted or run differently than programmed. A session may carry `notes` for the free-text field on the workout page.

### Cardio

Warm-up or cool-down conditioning goes in an optional `cardio` array on the session. It is context, not training volume, and never feeds progression or targets.

```json
"cardio": [
  { "name": "Elliptical", "distance_mi": 0.5, "position": "warm-up" }
]
```

Use `distance_mi` or `minutes`, whichever he actually reported. `position` is `warm-up`, `cool-down`, or `standalone`.

### Difficulty scale

The workout page never asks for a bare RPE number. It presents a five-point word scale per set and stores the RPE equivalent, so history stays comparable.

| Tapped | Stored `rpe` |
|---|---|
| Easy | 6 |
| Mod | 7 |
| Hard | 8 |
| V.Hard | 9 |
| Max | 10 |

Overall session `feel` is a 1 to 5 slider running rough to easy, stored as one of: `rough`, `tough`, `solid`, `good`, `easy`, or `skipped`.

The pasted block carries both forms so it stays readable and parseable:

```
WORKOUT LOG
2026-09-07 · Full Body A · overall: solid

Leg press
  185 x 9 @ hard (RPE 8)
  185 x 8 @ very hard (RPE 9)
```

A weight of `bw` means bodyweight. Store `weight_lb: null`.

### Timed exercises

Holds are logged by duration, not by weight and reps. A timed set stores `duration_s` and omits `weight_lb` and `reps` entirely.

```json
{ "name": "Plank", "sets": [{ "duration_s": 45, "rpe": 8 }] }
```

In the pasted block a timed set reads `45s @ hard (RPE 8)`:

```
Plank
  45s @ hard (RPE 8)
  40s @ very hard (RPE 9)
```

The workout page decides which form to render from the **exercise name**, using the `TIMED` set at the top of `workout.html`. The `scheme` string is only a fallback for a name with no entry in `assets/exercises.js`. Name over scheme is deliberate: swapping Plank for Pallof press leaves the scheme reading `30-45s`, and the seconds field must not follow it.

Add a new hold to `TIMED` in `workout.html` when one enters the program.

### Ratings

The block may carry a `RATINGS` line. It is emitted only for ratings that differ from what `data/preferences/exercises.json` already holds, so a repeated favorite does not resend every session.

```
RATINGS: +Leg press, +Lat pulldown, -Face pull
```

`+` means favorite, `-` means disliked. On seeing one, update `data/preferences/exercises.json` in the same commit as the session. A name may appear in only one array; moving it from one to the other is a legitimate change of mind, not an error.

```json
{
  "favorites": ["Leg press"],
  "disliked": ["Face pull"],
  "notes": { "Face pull": "Never feels like it is doing anything." }
}
```

Programming honors this file. Favorites appear more often. Disliked exercises get replaced by a different movement training the same pattern, and are never quietly reintroduced. If a disliked exercise is the only sensible option for a pattern he needs, program the closest alternative and say why in the weekly review rather than overriding him silently.

## Program

`data/workouts/program.json` drives the workout page. Written at the Sunday review.

```json
{
  "week_of": "2026-08-31",
  "sessions": [
    { "day": "Mon", "key": "A", "title": "Full Body A",
      "focus": "One line. What this day is actually training.",
      "supersets": [[0, 1], [2, 3]],
      "exercises": [
        { "name": "Leg press", "scheme": "3 x 8-10", "sets": 3,
          "cue": "One line.", "subs": ["Goblet squat", "Hack squat"] }
      ] }
  ],
  "optional_addins": []
}
```

`day` must be one of `Mon` `Tue` `Wed` `Thu` `Fri` `Sat` `Sun`. `key` must be unique across sessions and add-ins, because the workout page uses it to address a session directly and to key its autosave slot. Every exercise carries two or three `subs` because equipment at EOS Orem gets occupied. Every `name`, substitutions included, should have a matching key in `assets/exercises.js` or the form panel falls back to a generic note.

## Exercise knowledge

`assets/exercise-knowledge.js` is separate from `assets/exercises.js` on purpose: the latter holds form steps, common errors and `load_step` and is already correct, so either file can be rewritten without risking the other.

```js
'Leg press': {
  targets: { primary: ['Quadriceps'], secondary: ['Adductors'] },
  feel: 'One line. Where the work should show up if you are doing it right.',
  vs: {
    'Hack squat': { v: 'like', n: 'How this substitution differs.' }
  }
}
```

`v` is `like` (swap freely), `close` (same pattern, meaningful difference in emphasis), or `diff` (trains something else, know what you are giving up). `vs` belongs only on exercises that appear as a primary in `program.json`, keyed by substitution name. The page shows the note under the swap button before he taps it, and again in the detail panel after.

Any newly programmed exercise gets an entry at the weekly review. A missing entry degrades quietly rather than breaking the page.

## Workout page behavior

Two things the page does on its own that the spec depends on.

**Autosave.** Everything typed is mirrored to device storage on every keystroke, difficulty tap and swap, and restored on load. iOS evicts background tabs and reloads them, which used to wipe a whole session. Slots are keyed by date and session key, so two sessions in one day never collide, and slots older than three days are swept on boot. A half-logged session also wins over the calendar at boot: reopening the page mid-workout lands back in that workout, not on whatever day it is.

**Any session is openable.** The week view can launch any session including the optional add-ins, not only the one whose day it is. This is what makes an add-in usable on an off day.

Neither writes to the repo. The site is static and public, so there is nothing to post to without shipping a credential.

## Reviews

`data/reviews/` holds narrative output from the two scheduled tasks. Weekly files are named for the Sunday they cover and stay under 400 words. Monthly files carry the same content as the month-in-review email. Each review reads the previous one, which is the only reason the tasks can notice a trend rather than restating a snapshot.

## Write rules

1. Nutrition writes touch the month file and `state.json` in the **same commit** via `push_files`. Never one without the other.
2. A session write updates the month log and `state.json` together, and `data/preferences/exercises.json` too when the block carried a `RATINGS` line.
3. Read before write. The contents API needs the current blob SHA for updates.
4. Never write to `data/health/`. That is the Shortcut's.
5. Never ask permission to write. Logging is the system's purpose.
