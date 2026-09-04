// Two-frame demo images for the exercise detail panel.
//
// Source: github.com/yuhonas/free-exercise-db, released under The Unlicense,
// which is public domain. Frames 0 and 1 are the start and end of the rep, so
// alternating them gives a clean two-frame animation without shipping a GIF.
//
// A missing key just means no image renders. Nothing breaks.

const EX_IMG_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';

const EX_IMG = {
  "Leg press":                    "Leg_Press",
  "Goblet squat":                 "Goblet_Squat",
  "Hack squat":                   "Hack_Squat",
  "Seated cable row":             "Seated_Cable_Rows",
  "Single-arm dumbbell row":      "One-Arm_Dumbbell_Row",
  "Machine row":                  "Seated_Cable_Rows",
  "Chest-supported row":          "One-Arm_Dumbbell_Row",
  "Dumbbell bench press":         "Dumbbell_Bench_Press",
  "Incline dumbbell press":       "Incline_Dumbbell_Press",
  "Machine chest press":          "Machine_Bench_Press",
  "Machine incline press":        "Smith_Machine_Incline_Bench_Press",
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
  "Single-arm cable row":         "Seated_Cable_Rows",
  "Face pull":                    "Face_Pull",
  "Reverse pec deck":             "Cable_Rear_Delt_Fly",
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
  "Couch stretch":                "Intermediate_Hip_Flexor_and_Quad_Stretch"
};
