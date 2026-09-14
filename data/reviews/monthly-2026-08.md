# August 2026 in review

Generated 2026-09-14 by the monthly review task.

**August predates the program.** The bulk started 2026-09-01. `data/workouts/log-2026-08.json` holds zero sessions because there was no program to follow yet. That is not a missed month, it is a month that happened before the system existed.

What August actually contains: two days of nutrition logging (8/23 and 8/24), one day of Apple Health capture (8/29), no scale readings, no InBody scan, and no weekly reviews. So this review is short on purpose. The content worth reading is where September stands 14 days in.

---

## Sessions

| | August |
|---|---|
| Scheduled lift days | 0 (program began 9/1) |
| Sessions logged | 0 |
| Longest consecutive-lift-day run | n/a |

Nothing to score. The first logged session in the system is 2026-09-09.

**September to date**, for context: 2 sessions logged (Wed 9/9, Fri 9/11) against 5 completed scheduled lift days (9/2, 9/4, 9/7, 9/9, 9/11). Today, Mon 9/14, is in progress and does not break anything. Current training streak: **2 consecutive scheduled lift days**, and both of those were the two most recent.

## Lift progression

No exercise was trained in August.

Extending the window to the entire log, **no exercise has yet reached three sessions**, so there is no first-to-last load comparison and no Epley estimate to report. The two logged sessions are B (Hinge & Overhead) and C (Single-leg & Back), which share no movements. The first exercise to qualify will do so on its third pass through the rotation, roughly the week of 9/21.

Baselines now on record, from September:

| Exercise | Best working set | Est. 1RM (Epley) |
|---|---|---|
| Seated leg curl | 220 x 10 @ RPE 8 | 293 lb |
| Lat pulldown | 100 x 10 @ RPE 8 | 133 lb |
| Incline dumbbell press | 60 x 10 @ RPE 8 | 80 lb |

These are starting points, not progression. Treat them as the line October gets measured against.

## Weight

**No readings in August.** The `weights` array holds nothing for the month, and the single August health file carries `body_mass_lb: 0`, which per spec means no reading, not a weight of zero.

First real scale data landed 9/13:

| Date | Weight |
|---|---|
| 2026-09-13 | 168.6 lb |
| 2026-09-14 | 168.2 lb |

Two readings one day apart. No weekly rate can be computed from that, and none should be until there are enough points to fill a 7-day window, which is roughly 9/20. Both sit below the 170 lb assumed start in `config.json`. Worth noting, not worth acting on from two points.

## InBody

No scans on file. The `inbody` array is empty, so there is not even a baseline yet.

Scans arrive as photos uploaded in chat for transcription, so an absent scan means it has not been sent, not that it was skipped. The first scan becomes the baseline and every later scan is compared against it: lean body mass and skeletal muscle mass are the numbers that matter on a bulk, body fat percentage is secondary and will drift up somewhat by design.

## Steps and active energy

The nightly Apple Health sync captured **1 of 31 August days**.

| Date | Steps | Active energy |
|---|---|---|
| 2026-08-29 | 18,843 | 995 kcal |

One day is not an average and is not presented as one.

September is not better: **2 of 14 days** captured (9/8 and 9/14), and the 9/14 file carries zeros for steps and active energy with only a weight attached, so it is partial. That leaves 9/8 (11,645 steps, 514 kcal) as the only usable September activity day. Across the system's 45-day life the sync has produced 3 files.

**This is the one thing in the repo that is actually broken.** Every calorie target is set by the bodyweight trend, and the trend depends on this sync or on weights entered by hand. Right now it is running entirely on hand-entered weights, which is why there were none until 9/13. Calibration is scheduled for 9/28 and needs a real trend to work with.

## Nutrition

`data/nutrition/2026-08.json` holds two days, both from before the program started.

| | Calories | Protein |
|---|---|---|
| 8/23 | 2,695 | 191 g |
| 8/24 | 3,205 | 150 g |
| **Average** | **2,950** | **171 g** |

Protein averaged 171 g against a 165 g target across those two days, with no deliberate effort behind it and no tracking discipline in place. That is the single most encouraging number in the file: it suggests the protein side of this bulk is close to handled by habit.

Caveats that keep it honest: n = 2, 8/24 included a large restaurant meal, and `config.json` already notes that logged days ran above his normal diet, with habitual intake estimated near 2,500 kcal. Intake logging has been paused since 9/4 by design, so September holds no nutrition data and will not.

---

## Direction for the coming month

**Record the load on every set, in the app, during the session.**

The 9/11 session was backfilled from memory three days later. Single-arm cable row and standing calf raise carry `null` loads. Face pull has no sets at all. Those reps happened but are gone as data. If October logs the same way, next month's review will be as empty as this one, because progression needs three clean passes of the same movement before it means anything, and a `null` does not count as a pass.

Supporting item: weigh every other day. Two readings is not a trend, and 9/28 calibration needs one.

The training itself looks right. 9/9 showed the textbook first-session-back pattern, machine shoulder press falling 50x6 to 40x5 to 30x10 as fatigue arrived. 9/11 was cleaner, with incline dumbbell press holding 60x10 for all three sets at RPE 8, which is a well-picked load rather than a lucky one. Two consecutive scheduled lift days are on the board and they are the two most recent. Keep that going through October and the numbers will have something to say.

## Open items

- Face pull is flagged twice in the 9/11 notes as awkward: too heavy forces leaning back and pulling with the arms, lighter feels like nothing. That is normal for the movement and usually means the cable is set too low and the elbows are dropping. Worth either a form fix or a swap to reverse pec deck, which is listed as a substitution.
- Pallof press execution was called out as uncertain on 9/9.
- The monthly task is configured in `config.json` for the 2nd of the month but this run fired on the 14th. Worth checking the schedule.
