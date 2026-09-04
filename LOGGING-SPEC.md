# Logging spec

The contract between Claude and this repo. Read before any write.

## Files

| Path | Written by | Notes |
|---|---|---|
| `config.json` | Claude, weekly | Targets, streak rule, schedule |
| `data/state.json` | Claude, every log | Derived. The widget reads only this |
| `data/nutrition/YYYY-MM.json` | Claude | One file per month |
| `data/body/measurements.json` | Claude | InBody and tape only. Not scale weight |
| `data/health/YYYY-MM-DD.json` | iOS Shortcut | One per day. Never edit |
| `data/workouts/program.json` | Claude, weekly | Current week's sessions |
| `data/workouts/log-YYYY-MM.json` | Claude | Completed sessions |
| `assets/exercises.js` | Claude, rarely | Form steps, common errors, load increments |

## Data conventions

**`body_mass_lb: 0` means no reading that day. It never means a real weight.** He weighs in every other day, so zeros are expected and normal. Skip them entirely when averaging. A zero must never be treated as a data point, or the trend collapses toward zero and every calorie target derived from it is wrong.

The Shortcut fires at 11:55pm and filters on **today**, so each file holds the day named in its filename. The last five minutes of a day are not captured. This does not matter.

Scale weight arrives through Apple Health and lands in the daily health files. It is not logged separately and he should not need to send it. `data/body/measurements.json` holds InBody scans and tape measurements only.

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

Recomputed in full on every nutrition write. Never patched in place.

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
  "weight_trend_lb": 171.2,
  "weight_trend_change_lb": 0.4,
  "next_lift_day": "Wed",
  "provisional_targets": true
}
```

When the date rolls over, reset the consumed values to zero and recompute the streak against the completed previous day.

**The dashboard does not trust this file for today's totals.** `index.html` derives calories, protein, streak, and next lift day from the month file and `config.json`, because `state.json` only refreshes when Claude writes and otherwise shows the last logged day forever. `state.json` exists for the Scriptable widget, which cannot do that work itself. Keep writing it, but a stale copy no longer breaks the dashboard.

## Streak

A day counts when **both** hold: at least one meal was logged, and protein met or exceeded the target. Calories are excluded on purpose. Estimates are too noisy to gate a streak on, and a streak that breaks for reasons outside his control stops meaning anything.

Today in progress never breaks the streak. The count starts at today if today already qualifies, otherwise at yesterday.

## Weight trend

`weight_trend_lb` is the 7-day rolling average of **non-zero** `body_mass_lb` values from `data/health/`. With every-other-day weighing that is normally three or four real readings per window, which is enough. Below two readings in a window, leave it `null` rather than publishing a number built on one data point.

`weight_trend_change_lb` is this week's average minus last week's. This single number is what sets the calorie target at the weekly review. Nothing else does.

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

## Program

`data/workouts/program.json` drives the workout page. Written at the Sunday review.

```json
{
  "week_of": "2026-08-31",
  "sessions": [
    { "day": "Mon", "key": "A", "title": "Full Body A",
      "supersets": [[0, 1], [2, 3]],
      "exercises": [
        { "name": "Leg press", "scheme": "3 x 8-10", "sets": 3,
          "cue": "One line.", "subs": ["Goblet squat", "Hack squat"] }
      ] }
  ],
  "optional_addins": []
}
```

`day` must be one of `Mon` `Tue` `Wed` `Thu` `Fri` `Sat` `Sun`. Every exercise carries two or three `subs` because equipment at EOS Orem gets occupied. Every `name`, substitutions included, should have a matching key in `assets/exercises.js` or the form panel falls back to a generic note.

## Progression

The workout page suggests the next load itself, from the last logged session of that exercise. Average RPE across its sets decides:

| Last average RPE | Next session |
|---|---|
| 7 or below | Add one `load_step` |
| 7.1 to 8 | Same weight, one more rep per set |
| 8.1 to 9 | Repeat |
| Above 9 | Hold or drop five percent |

`load_step` lives per exercise in `assets/exercises.js`. It is 10 lb for machine and barbell lower body, 5 lb for dumbbell and upper body, and 0 for bodyweight work, which switches the advice to reps instead of load. **With no history the page shows no weight at all.** Inventing a starting number is worse than a blank field.

## Write rules

1. Nutrition writes touch the month file and `state.json` in the **same commit** via `push_files`. Never one without the other.
2. Read before write. The contents API needs the current blob SHA for updates.
3. Never write to `data/health/`. That is the Shortcut's.
4. Never ask permission to write. Logging is the system's purpose.
