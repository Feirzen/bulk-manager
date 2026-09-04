// Exercise reference used by workout.html: form steps, common errors, and the
// weight increment the progression suggester adds when a session came in easy.
// Keys must match the names in program.json, substitutions included, or the
// detail panel falls back to a generic note.

const EXERCISES = {

  "Leg press": {
    load_step: 10,
    form: [
      "Feet shoulder width on the platform, mid-foot, heels flat.",
      "Lower until your knees are near 90 degrees, controlled, about two seconds.",
      "Press through the whole foot. Stop just short of locking the knees."
    ],
    errors: [
      "Going so deep the hips curl off the pad. That is loaded lumbar flexion, the one thing to avoid.",
      "Slamming the knees straight at the top."
    ]
  },

  "Goblet squat": {
    load_step: 5,
    form: [
      "Hold one dumbbell vertically against your chest, elbows tucked in.",
      "Sit straight down between your hips, chest tall, heels planted.",
      "Drive up through mid-foot, squeeze glutes at the top without leaning back."
    ],
    errors: [
      "Letting the low back arch harder at the top to finish. Ribs stay down.",
      "Knees caving inward on the way up."
    ]
  },

  "Hack squat": {
    load_step: 10,
    form: [
      "Back and hips flat against the pad, feet mid-platform.",
      "Descend under control to about parallel.",
      "Press up without letting your hips peel away from the pad."
    ],
    errors: [
      "Hips rounding off the pad at the bottom.",
      "Feet too low, which pushes all the load onto the knees."
    ]
  },

  "Seated cable row": {
    load_step: 10,
    form: [
      "Chest tall, slight knee bend, torso close to vertical.",
      "Pull the handle to your lower ribs, elbows brushing your sides.",
      "Let the shoulder blades travel forward on the return for a full stretch."
    ],
    errors: [
      "Rocking the torso back and forth to move the weight.",
      "Shrugging. Shoulders stay down and back."
    ]
  },

  "Single-arm dumbbell row": {
    load_step: 5,
    form: [
      "One hand and knee on a bench, back flat and roughly parallel to the floor.",
      "Pull the dumbbell to your hip, elbow tight to the body.",
      "Lower all the way down, let the lat stretch."
    ],
    errors: [
      "Twisting the torso to get the weight higher.",
      "Letting the low back sag into an arch."
    ]
  },

  "Machine row": {
    load_step: 10,
    form: [
      "Chest against the pad, feet planted.",
      "Pull the handles back until your elbows pass your ribs.",
      "Control the return, do not let the stack yank your arms forward."
    ],
    errors: [
      "Pushing the chest off the pad to cheat the weight back.",
      "Cutting the range short at the front."
    ]
  },

  "Chest-supported row": {
    load_step: 5,
    form: [
      "Chest on an incline bench, dumbbells hanging straight down.",
      "Row to your ribs, not your chest, elbows about 45 degrees out.",
      "Full stretch at the bottom every rep."
    ],
    errors: [
      "Lifting the chest off the pad, which turns it into a cheat row.",
      "Bench set too upright, which turns it into a shrug."
    ]
  },

  "Dumbbell bench press": {
    load_step: 5,
    form: [
      "Lie flat, dumbbells at the outside of your chest, wrists stacked over elbows.",
      "Press up and slightly in, stopping short of clanking them together.",
      "Lower under control until you feel a stretch across the chest."
    ],
    errors: [
      "Big exaggerated back arch. A small natural arch is fine, a bridge is not, given your lordosis.",
      "Flaring elbows to 90 degrees, which grinds the shoulder."
    ]
  },

  "Incline dumbbell press": {
    load_step: 5,
    form: [
      "Bench at about 30 degrees. Feet flat, glutes and upper back on the bench.",
      "Dumbbells at upper chest level, press up and slightly together.",
      "Control the descent, feel the stretch, do not bounce."
    ],
    errors: [
      "Bench set too steep, which makes it a shoulder press.",
      "Arching the low back off the bench to press more weight."
    ]
  },

  "Machine chest press": {
    load_step: 10,
    form: [
      "Set the seat so the handles line up with mid-chest.",
      "Press out until your arms are nearly straight, no lockout slam.",
      "Return slowly until you feel the chest stretch."
    ],
    errors: [
      "Seat too high, which turns it into an incline press on the shoulders.",
      "Letting the stack drop back instead of controlling it."
    ]
  },

  "Machine incline press": {
    load_step: 10,
    form: [
      "Seat set so handles sit at upper chest.",
      "Press up and forward, stop just short of lockout.",
      "Slow return, chest stays on the pad."
    ],
    errors: [
      "Shrugging the shoulders up at the top.",
      "Cutting the return short and losing the stretch."
    ]
  },

  "Push-up": {
    load_step: 0,
    form: [
      "Hands slightly wider than shoulders, body in one straight line.",
      "Lower until your chest is a fist off the floor, elbows about 45 degrees.",
      "Press up and hold the plank position the whole time."
    ],
    errors: [
      "Hips sagging, which loads the low back. Squeeze glutes to hold the line.",
      "Head craning forward toward the floor."
    ]
  },

  "Barbell RDL": {
    load_step: 10,
    form: [
      "Stand tall holding the bar at thigh level, knees soft, not bent.",
      "Push the hips straight back, bar sliding down your legs, spine neutral.",
      "Stop when the hamstrings stretch, around mid-shin. Drive hips forward to stand."
    ],
    errors: [
      "Turning it into a squat by bending the knees. The hips go back, not down.",
      "Leaning back and over-arching at the top. Stand tall and stop there.",
      "Bar drifting away from the legs, which loads the low back."
    ]
  },

  "Trap bar deadlift": {
    load_step: 10,
    form: [
      "Stand inside the bar, feet hip width, grip the handles.",
      "Hips back and down, chest up, flat back, brace hard.",
      "Push the floor away, stand tall, squeeze glutes without leaning back."
    ],
    errors: [
      "Rounding the low back off the floor.",
      "Hyperextending at lockout. Stop at straight, not arched."
    ]
  },

  "Hip thrust": {
    load_step: 10,
    form: [
      "Upper back on a bench, feet flat, shins vertical at the top.",
      "Tuck your chin and ribs, drive the hips up by squeezing the glutes.",
      "Stop at a straight line from knee to shoulder, pause, lower under control."
    ],
    errors: [
      "Overshooting the top and arching the low back. This is the big one for you.",
      "Pushing through the toes instead of the whole foot."
    ]
  },

  "Glute bridge": {
    load_step: 5,
    form: [
      "Lie on your back, knees bent, feet flat and close to your glutes.",
      "Press through the heels and lift the hips by squeezing the glutes.",
      "Stop at a straight line, hold a second, lower slowly."
    ],
    errors: [
      "Arching the low back to get higher. Height is not the goal, the squeeze is.",
      "Letting the hamstrings cramp because the feet are too far out."
    ]
  },

  "Seated leg curl": {
    load_step: 10,
    form: [
      "Pad just above the ankles, thigh pad snug.",
      "Curl down hard, pause a beat at the bottom.",
      "Return slowly, do not let the stack pull you back."
    ],
    errors: [
      "Hips lifting off the seat.",
      "Rushing the return, which is where most of the growth is."
    ]
  },

  "Walking lunge": {
    load_step: 5,
    form: [
      "Dumbbells at your sides, torso upright, brace the core.",
      "Step forward, lower until the back knee is just off the floor.",
      "Drive through the front heel to step straight into the next rep."
    ],
    errors: [
      "Leaning the torso forward, which shifts load to the low back.",
      "Short steps, which puts everything on the knee instead of the glute."
    ]
  },

  "Bulgarian split squat": {
    load_step: 5,
    form: [
      "Back foot on a bench, front foot far enough forward that the shin stays near vertical.",
      "Lower straight down, torso tall.",
      "Drive through the front heel, no bouncing off the bottom."
    ],
    errors: [
      "Front foot too close, which jams the knee and tips you forward.",
      "Arching the low back to stay upright. Tuck the pelvis instead."
    ]
  },

  "Leg extension": {
    load_step: 10,
    form: [
      "Knees lined up with the machine pivot, pad above the ankles.",
      "Extend to straight, pause one second, squeeze the quad.",
      "Lower slowly to the start."
    ],
    errors: [
      "Slamming into full extension.",
      "Lifting the hips off the seat to move more weight."
    ]
  },

  "Overhead dumbbell press": {
    load_step: 5,
    form: [
      "Seated with back support, dumbbells at ear height, palms forward.",
      "Brace the core and tuck the ribs down before you press.",
      "Press straight overhead, lower under control to ear height."
    ],
    errors: [
      "Arching the low back to finish the rep. If it happens, the weight is too heavy. This matters more for you than most people.",
      "Pressing forward instead of straight up."
    ]
  },

  "Machine shoulder press": {
    load_step: 10,
    form: [
      "Seat set so handles start at about ear height.",
      "Back flat on the pad, press straight up.",
      "Stop just short of lockout, lower slowly."
    ],
    errors: [
      "Peeling the low back off the pad.",
      "Starting too low, which grinds the shoulder."
    ]
  },

  "Landmine press": {
    load_step: 5,
    form: [
      "Half-kneeling or standing, bar end at shoulder height.",
      "Brace, ribs down, press up and slightly forward along the bar path.",
      "Control the return to the shoulder."
    ],
    errors: [
      "Leaning back to press. The torso stays stacked.",
      "Letting the shoulder shrug up at the top."
    ]
  },

  "Lat pulldown": {
    load_step: 10,
    form: [
      "Thighs locked under the pad, grip slightly wider than shoulders.",
      "Lean back about 15 degrees and hold that angle.",
      "Pull the bar to your upper chest, elbows down, then control it all the way up."
    ],
    errors: [
      "Rocking back and forth through the set instead of holding one angle.",
      "Pulling behind the neck. No upside, real shoulder risk."
    ]
  },

  "Assisted pull-up": {
    load_step: -10,
    form: [
      "Set the assist so you can get 8 to 10 clean reps.",
      "Start from a full hang, pull the chest toward the bar.",
      "Lower all the way down every rep."
    ],
    errors: [
      "Kipping or swinging.",
      "Stopping halfway down, which cuts the hardest part."
    ]
  },

  "Single-arm cable row": {
    load_step: 5,
    form: [
      "Split stance or seated, one handle, torso stable.",
      "Let the shoulder blade travel forward at the front for a full stretch.",
      "Pull to your hip, elbow close, squeeze, control the return."
    ],
    errors: [
      "Rotating the torso to pull further.",
      "Cutting the stretch short at the front."
    ]
  },

  "Face pull": {
    load_step: 5,
    form: [
      "Rope at about eye height, thumbs pointing back.",
      "Pull toward your eyebrows, elbows high and wide.",
      "Finish with the rope split around your face, hold a beat."
    ],
    errors: [
      "Going too heavy and turning it into a row.",
      "Elbows dropping below the shoulders."
    ]
  },

  "Reverse pec deck": {
    load_step: 5,
    form: [
      "Chest on the pad, arms nearly straight with a soft elbow bend.",
      "Sweep the arms back and slightly down, squeeze the rear delts.",
      "Return slowly, do not let the stack snap."
    ],
    errors: [
      "Bending the elbows to turn it into a row.",
      "Shrugging the traps to move more weight."
    ]
  },

  "Rear delt dumbbell fly": {
    load_step: 5,
    form: [
      "Hinge at the hips, flat back, or use a chest-supported incline bench.",
      "Light dumbbells, sweep out and back with a soft elbow bend.",
      "Pause at the top, lower slowly."
    ],
    errors: [
      "Going too heavy and swinging with the low back. Use the bench version if that happens.",
      "Turning the palms up, which recruits the traps."
    ]
  },

  "Dumbbell curl": {
    load_step: 5,
    form: [
      "Stand tall, arms at your sides, palms forward.",
      "Curl up without the elbows drifting forward.",
      "Lower all the way to straight, slowly."
    ],
    errors: [
      "Swinging the hips and leaning back to start the rep.",
      "Stopping halfway down."
    ]
  },

  "Cable curl": {
    load_step: 5,
    form: [
      "Low pulley, step back so there is tension at the bottom.",
      "Elbows pinned at your sides, curl up.",
      "Control the return, keep the tension."
    ],
    errors: [
      "Standing too close, which kills tension at the bottom.",
      "Elbows drifting forward at the top."
    ]
  },

  "Hammer curl": {
    load_step: 5,
    form: [
      "Neutral grip, palms facing each other, hold it the whole rep.",
      "Curl up with the elbows fixed at your sides.",
      "Lower slowly to straight."
    ],
    errors: [
      "Rotating to a palms-up grip, which makes it a regular curl.",
      "Using the shoulders to swing the weight up."
    ]
  },

  "Triceps pushdown": {
    load_step: 5,
    form: [
      "High pulley, rope or bar, elbows locked to your ribs.",
      "Push down until the arms are straight, squeeze.",
      "Let it come up only until the forearms are near parallel, then go again."
    ],
    errors: [
      "Elbows flaring forward, which turns it into a chest press.",
      "Leaning over the weight and using bodyweight."
    ]
  },

  "Overhead dumbbell extension": {
    load_step: 5,
    form: [
      "Seated with back support, one dumbbell held overhead in both hands.",
      "Ribs down and braced, lower behind the head with elbows pointing forward.",
      "Extend back to straight without the elbows flaring."
    ],
    errors: [
      "Arching the low back to get under the weight. Use back support and lighter dumbbells.",
      "Elbows drifting out wide."
    ]
  },

  "Dip machine": {
    load_step: 10,
    form: [
      "Seat set so the handles start near your ribs.",
      "Press down until the arms are straight, torso upright.",
      "Control the return, do not let the stack lift you."
    ],
    errors: [
      "Leaning forward, which shifts it to the chest.",
      "Shrugging at the bottom."
    ]
  },

  "Standing calf raise": {
    load_step: 10,
    form: [
      "Balls of the feet on the platform, heels hanging free.",
      "Drop the heels for a full stretch, then rise up as high as you can.",
      "Pause a beat at the top every rep."
    ],
    errors: [
      "Bouncing through the stretch instead of pausing.",
      "Bending the knees to cheat the rep."
    ]
  },

  "Seated calf raise": {
    load_step: 10,
    form: [
      "Pad on the lower thighs, balls of the feet on the platform.",
      "Full stretch down, drive up to a hard squeeze.",
      "Slow on the way down."
    ],
    errors: [
      "Short choppy reps.",
      "Pad set too far back on the knee."
    ]
  },

  "Leg press calf raise": {
    load_step: 10,
    form: [
      "Feet low on the platform, balls of the feet only, knees soft.",
      "Push the platform away with the toes, full range.",
      "Keep the safeties engaged."
    ],
    errors: [
      "Locking the knees and turning it into a press.",
      "Letting the platform crash back into the stretch."
    ]
  },

  "Cable lateral raise": {
    load_step: 5,
    form: [
      "Low pulley behind you, handle in the opposite hand.",
      "Lead with the elbow, raise to shoulder height.",
      "Lower slowly, keep tension the whole way."
    ],
    errors: [
      "Going heavy and swinging with the torso.",
      "Raising above shoulder height, which brings in the traps."
    ]
  },

  "Dumbbell lateral raise": {
    load_step: 5,
    form: [
      "Light dumbbells, soft elbow bend, torso still.",
      "Raise out to the sides to shoulder height, lead with the elbows.",
      "Lower under control."
    ],
    errors: [
      "Using momentum from the hips.",
      "Shrugging instead of abducting."
    ]
  },

  "Dead bug": {
    load_step: 0,
    form: [
      "On your back, arms straight up, knees and hips at 90 degrees.",
      "Press your low back flat into the floor and keep it there.",
      "Lower one arm and the opposite leg slowly, only as far as you can hold the flat back."
    ],
    errors: [
      "Low back lifting off the floor. The moment it does, shorten the range.",
      "Rushing. This is a slow, deliberate anti-extension drill."
    ]
  },

  "Bird dog": {
    load_step: 0,
    form: [
      "Hands under shoulders, knees under hips, spine neutral.",
      "Extend one arm and the opposite leg to a straight line.",
      "Hold two seconds, return under control, switch."
    ],
    errors: [
      "Hips rotating open. Keep them square to the floor.",
      "Lifting the leg too high and arching the low back."
    ]
  },

  "Plank": {
    load_step: 0,
    form: [
      "Elbows under shoulders, feet hip width.",
      "Tuck the pelvis under and squeeze the glutes.",
      "Hold one straight line from head to heels, breathe normally."
    ],
    errors: [
      "Hips sagging into a low back arch, which is the exact pattern you are working against.",
      "Holding forever with bad position. Stop the set when the position breaks."
    ]
  },

  "Side plank": {
    load_step: 0,
    form: [
      "Elbow under the shoulder, feet stacked or staggered.",
      "Lift the hips to a straight line, squeeze the down-side glute.",
      "Hold, then switch sides."
    ],
    errors: [
      "Hips sagging toward the floor.",
      "Rolling the chest forward."
    ]
  },

  "Pallof press": {
    load_step: 5,
    form: [
      "Stand side-on to a cable at chest height, handle at your sternum.",
      "Brace, then press the handle straight out.",
      "Resist the cable trying to rotate you, return slowly."
    ],
    errors: [
      "Letting the torso twist toward the cable.",
      "Going heavy enough that you have to lean away."
    ]
  },

  "Couch stretch": {
    load_step: 0,
    form: [
      "Back shin vertical against a couch, bench, or wall, top of the foot up.",
      "Front foot flat on the floor, knee bent, torso upright.",
      "Squeeze the back glute to tuck the pelvis. Hold 45 seconds, switch."
    ],
    errors: [
      "Leaning forward, which removes the hip flexor stretch entirely.",
      "Skipping the glute squeeze. Without the pelvic tuck you are just stretching the quad."
    ]
  },

  "Incline treadmill walk": {
    load_step: 0,
    form: [
      "Incline 8 to 12 percent, speed 3.0 to 3.5 mph.",
      "Hands off the rails, upright posture.",
      "20 to 30 minutes, conversational pace."
    ],
    errors: [
      "Holding the rails, which cuts the work in half.",
      "Going hard enough that it eats into lifting recovery."
    ]
  }

};
