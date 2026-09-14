// Two-frame demo images for the exercise detail panel.
//
// Source: github.com/yuhonas/free-exercise-db, released under The Unlicense,
// which is public domain. Frames 0 and 1 are the start and end of the rep, so
// alternating them gives a clean two-frame animation without shipping a GIF.
//
// A missing key just means no image renders. Nothing breaks.
//
// EX_IMG_VERIFIED lists names whose image has actually been opened and
// confirmed to show the named movement. Verification is separate from EX_IMG
// on purpose: workout.html only ever reads EX_IMG[name] as a string, so the
// shape of that map must not change. The weekly review skips anything already
// listed here and checks only what is new.

const EX_IMG_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';

const EX_IMG = {
  "Leg press":                    "Leg_Press",
  "Goblet squat":                 "Goblet_Squat",
  "Hack squat":                   "Hack_Squat",
  "Seated cable row":             "Seated_Cable_Rows",
  "Single-arm dumbbell row":      "One-Arm_Dumbbell_Row",
  "Machine row":                  "Leverage_Iso_Row",
  "Chest-supported row":          "Dumbbell_Incline_Row",
  "Dumbbell bench press":         "Dumbbell_Bench_Press",
  "Incline dumbbell press":       "Incline_Dumbbell_Press",
  "Machine chest press":          "Machine_Bench_Press",
  "Machine incline press":        "Leverage_Incline_Chest_Press",
  "Push-up":                      "Pushups",
  "Barbell RDL":                  "Romanian_Deadlift",
  "Trap bar deadlift":            "Trap_Bar_Deadlift",
  "Hip thrust":                   "Barbell_Hip_Thrust",
  "Glute bridge":                 "Barbell_Glute_Bridge",
  "Seated leg curl":              "Seated_Leg_Curl",
  "Walking lunge":                "Dumbbell_Lunges",
  "Bulgarian split squat":        "Split_Squat_with_Dumbbells",
  "Leg extension":                "Leg_Extensions",
  "Overhead dumbbell press":      "Seated_Dumbbell_Press",
  "Machine shoulder press":       "Machine_Shoulder_Military_Press",
  "Lat pulldown":                 "Wide-Grip_Lat_Pulldown",
  "Assisted pull-up":             "Band_Assisted_Pull-Up",
  "Single-arm cable row":         "Seated_One-arm_Cable_Pulley_Rows",
  "Face pull":                    "Face_Pull",
  "Reverse pec deck":             "Reverse_Machine_Flyes",
  "Rear delt dumbbell fly":       "Seated_Bent-Over_Rear_Delt_Raise",
  "Dumbbell curl":                "Dumbbell_Bicep_Curl",
  "Cable curl":                   "Standing_Biceps_Cable_Curl",
  "Hammer curl":                  "Hammer_Curls",
  "Triceps pushdown":             "Triceps_Pushdown",
  "Overhead dumbbell extension":  "Seated_Triceps_Press",
  "Dip machine":                  "Dip_Machine",
  "Standing calf raise":          "Standing_Calf_Raises",
  "Seated calf raise":            "Seated_Calf_Raise",
  "Leg press calf raise":         "Calf_Press_On_The_Leg_Press_Machine",
  "Cable lateral raise":          "Side_Lateral_Raise",
  "Dumbbell lateral raise":       "Side_Lateral_Raise",
  "Dead bug":                     "Dead_Bug",
  "Plank":                        "Plank",
  "Side plank":                   "Side_Bridge",
  "Pallof press":                 "Pallof_Press",
  "Couch stretch":                "Kneeling_Hip_Flexor"
};

// Checked by eye on 2026-09-14. Every URL above returned 200 and every image
// below was opened and confirmed to show the named movement.
const EX_IMG_VERIFIED = new Set([
  "Leg press", "Goblet squat", "Hack squat", "Seated cable row",
  "Single-arm dumbbell row", "Machine row", "Chest-supported row",
  "Dumbbell bench press", "Incline dumbbell press", "Machine chest press",
  "Machine incline press", "Push-up", "Barbell RDL", "Trap bar deadlift",
  "Hip thrust", "Glute bridge", "Seated leg curl", "Walking lunge",
  "Bulgarian split squat", "Leg extension", "Overhead dumbbell press",
  "Machine shoulder press", "Lat pulldown", "Assisted pull-up",
  "Single-arm cable row", "Face pull", "Reverse pec deck",
  "Rear delt dumbbell fly", "Dumbbell curl", "Cable curl", "Hammer curl",
  "Triceps pushdown", "Overhead dumbbell extension", "Dip machine",
  "Standing calf raise", "Seated calf raise", "Leg press calf raise",
  "Cable lateral raise", "Dumbbell lateral raise", "Dead bug", "Plank",
  "Side plank", "Pallof press", "Couch stretch"
]);

// Known imperfections, recorded so a later pass does not rediscover them.
//
// Fixed 2026-09-14, all six were showing the wrong movement or wrong equipment:
//   Machine row           was Seated_Cable_Rows          -> Leverage_Iso_Row
//   Chest-supported row   was One-Arm_Dumbbell_Row       -> Dumbbell_Incline_Row
//   Machine incline press was Smith_Machine_Incline...   -> Leverage_Incline_Chest_Press
//   Reverse pec deck      was Cable_Rear_Delt_Fly        -> Reverse_Machine_Flyes
//   Single-arm cable row  was Seated_Cable_Rows          -> Seated_One-arm_Cable_Pulley_Rows
//   Couch stretch         was Intermediate_Hip_Flexor... -> Kneeling_Hip_Flexor
//
// The single-arm cable row fix matters most: the old image showed the
// two-handed version, which is exactly the mistake made on 2026-09-11.
//
// Accepted compromise:
//   Cable lateral raise uses the dumbbell image. The source database has no
//   standing cable version. Same movement, wrong implement.
//
// No image available (source database has no equivalent). These render with no
// picture, which is the intended fallback:
const EX_IMG_NONE = ["Bird dog", "Landmine press"];
