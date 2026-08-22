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
  "source": "shortcut"
}
```

One file per day is deliberate. Creating a new file needs no blob SHA, which keeps the Shortcut to a single PUT with no lookup step.

Active energy from Apple Watch overreads meaningfully for resistance training, commonly 20 to 40 percent. It is recorded for trend interest and is not used to set calorie targets. Weight trend does that.
