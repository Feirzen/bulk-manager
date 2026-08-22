# bulk-manager

Lean bulk tracking. JSON in a repo, a dashboard, a workout page, and a home screen widget.

**Dashboard:** https://feirzen.github.io/bulk-manager/
**Workout:** https://feirzen.github.io/bulk-manager/workout.html

## How data gets in

| Input | Path |
|---|---|
| Food photo | Photo to Claude, Claude estimates and commits |
| Weight | Shortcut into Apple Health, picked up by the daily sync |
| Activity, steps, active energy | iOS Shortcut, direct to the repo, no Claude |
| Workout results | Log on the workout page, tap copy, paste to Claude |

One habit: paste things to Claude. Everything else runs itself.

## Layout

```
index.html          Dashboard: Today, Nutrition, Exercise
workout.html        Session logger and copy-out (placeholder)
assets/             Shared CSS and fetch helper
widget/widget.js    Scriptable widget
data/               All state
claude/             Project instructions and the logging skill
LOGGING-SPEC.md     Schema contract
docs/               Setup guides
```

No build step. Static files reading JSON at runtime, so data updates appear without waiting on a Pages deploy.

## Design note

Targets are set by bodyweight trend, not by logged intake. Photo estimates and watch calorie readings are recorded for context and deliberately excluded from the math that sets the number.
