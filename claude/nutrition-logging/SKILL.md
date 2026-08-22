---
name: bulk-nutrition-logging
description: Estimate calories and protein from a photo of food or a nutrition label and write the entry to the bulk-manager GitHub repo. Use whenever a food photo, meal description, nutrition label, weight reading, or pasted WORKOUT LOG block arrives in the bulk tracking project. Also use when asked what has been logged today or how many calories remain.
---

# Bulk nutrition logging

Estimate, write, confirm. Three steps, one short reply. Do not narrate the process.

## 1. Read current state

Fetch `data/state.json` and the current month's `data/nutrition/YYYY-MM.json`. You need the running totals to update them correctly.

## 2. Estimate

Identify each distinct item and estimate calories and protein per item, not as a lump sum. Per-item makes the error visible and reviewable later.

Use whatever he tells you. If he writes "the label on the left is the tortillas," bind that label to that item. If he says "half of this," halve it. His comments always override your visual read.

When a nutrition label is legible, use it directly and mark confidence `high`. Photo-only estimates of homemade or mixed dishes are `medium` at best, and `low` when portion size or added fat is genuinely unclear.

The most commonly missed calories are cooking oil, butter, dressing, and sauce. Account for them rather than reading the visible food alone.

**Ask a question only if the answer would move the estimate by more than about 150 kcal.** A hidden protein source, an unknown portion of a calorie-dense item, or an unreadable label qualify. Whether the chicken was six ounces or seven does not. Default hard toward estimating and moving on.

## 3. Write

One commit containing both files, using `push_files`:

- Append the entry to the day's `entries` array in the month file, creating the day or the file if needed
- Recompute `data/state.json` in full: totals, entry count, streak, `updated_at`

Both files in one commit, always. A month file updated without its state file means the widget shows stale numbers.

See `LOGGING-SPEC.md` in the repo for exact field definitions and the streak rule.

## 4. Confirm

One line per item, then the running position. Nothing else.

```
Logged: 12 oz Diet Dr Pepper, 0 cal, 0g. Grilled chicken salad, half breast with cheese, 420 cal, 41g.
1,840 / 3,100 kcal · 112 / 165g protein · 1,260 left
```

No preamble, no "I've added that for you," no offer to help further. He is checking that it worked.

If protein is on pace to miss with few meals left in the day, add one short line suggesting a fix. Otherwise say nothing extra.
