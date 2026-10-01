# Health data

One file per day, written directly by an iOS Shortcut. Never edited by hand.

Filename: `YYYY-MM-DD.json`

```json
{
  "date": "2026-09-15",
  "active_energy_kcal": 612,
  "resting_energy_kcal": 1804,
  "steps": 9240,
  "body_mass_lb": 171.4,
  "synced_at": "2026-09-15T21:40:12-07:00",
  "source": "shortcut"
}
```

One file per day. The Shortcut reads today's totals and rewrites that day's file at most once an hour while the phone is in use, so the file is that day's running total as of `synced_at`. `body_mass_lb: 0` means no weigh-in that day. Setup and the reasoning behind it: `docs/health-shortcut.md`.

Active energy from Apple Watch overreads meaningfully for resistance training, commonly 20 to 40 percent. It is recorded for trend interest and is not used to set calorie targets. Weight trend does that.
