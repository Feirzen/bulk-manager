# Logging spec

The contract between Claude and this repo. Read before any write.

## Files

| Path | Written by | Notes |
|---|---|---|
| `config.json` | Claude, weekly | Targets, streak rule, schedule |
| `data/state.json` | Claude, every log | Derived. The widget reads only this |
| `data/nutrition/YYYY-MM.json` | Claude | One file per month |
| `data/body/measurements.json` | Claude | Weights, InBody, tape |
| `data/health/YYYY-MM-DD.json` | iOS Shortcut | One per day. Never edit |
| `data/workouts/program.json` | Claude, weekly | Current week's sessions |
| `data/workouts/log-YYYY-MM.json` | Claude | Completed sessions |

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

## Streak

A day counts when **both** hold: at least one meal was logged, and protein met or exceeded the target. Calories are excluded on purpose. Estimates are too noisy to gate a streak on, and a streak that breaks for reasons outside his control stops meaning anything.

`weight_trend_lb` is the 7-day rolling average, not the latest reading. `weight_trend_change_lb` is this week's average minus last week's.

## Workout session

Parsed from a pasted `WORKOUT LOG` block.

```json
{
  "date": "2026-09-15",
  "title": "Full Body A",
  "feel": "strong",
  "exercises": [
    { "name": "Trap bar deadlift",
      "sets": [{ "weight_lb": 185, "reps": 5, "rpe": 7 }] }
  ]
}
```

Missing RPE is fine, record `null`. A skipped day is a session with an empty `exercises` array and `"feel": "skipped"`, which keeps the calendar honest without punishing the streak.

## Write rules

1. Nutrition writes touch the month file and `state.json` in the **same commit** via `push_files`. Never one without the other.
2. Read before write. The contents API needs the current blob SHA for updates.
3. Never write to `data/health/`. That is the Shortcut's.
4. Never ask permission to write. Logging is the system's purpose.
