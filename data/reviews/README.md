# Reviews

Narrative output from the two scheduled tasks.

| Pattern | Written by | Cadence |
|---|---|---|
| `weekly-YYYY-MM-DD.md` | Weekly training review task | Sundays, dated the Sunday it covers |
| `monthly-YYYY-MM.json` | Month in review task | 2nd of the month. Structured, rendered by `index.html` |
| `monthly-YYYY-MM.md` | Month in review task | Same review as prose, for the next run to read |

Weekly files stay under 400 words. The monthly email is a short teaser that links to `index.html?m=YYYY-MM`. Schema in `LOGGING-SPEC.md` under Reviews.

Each review reads the previous one. That is the only reason the tasks can notice a trend across weeks rather than restating a snapshot every time, so this directory is load-bearing, not an archive.
