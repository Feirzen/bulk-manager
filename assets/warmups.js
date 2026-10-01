// Warm-up and cool-down options for workout.html. Tap one, read why it
// helps, log the minutes. Saved into the session's `cardio` array with a
// `position` of warm-up or cool-down (see LOGGING-SPEC.md).
//
// `kind` is `cardio` for machines and walking, `mobility` for floor work.
// Mobility entries are context like cardio: they never feed progression.

const WARM_GOAL = "What you're going for: 5 to 8 minutes at an easy effort, light sweat, could still hold a conversation. That raises muscle temperature and nerve conduction speed so the first working set moves better. Then do one or two light ramp-up sets of your first lift. Those specific sets do more for performance than the cardio does, so don't skip them.";

const COOL_GOAL = "Honest take: research doesn't show cool-downs cut soreness or speed recovery much. What they're actually good for is letting your heart rate come down, getting in some easy extra movement, and stretching while you're still warm. That last one is the real win for you, since warm tissue is the best time to work on tight hip flexors.";

const WARMUPS = [
  { name: 'Rower', kind: 'cardio', mins: 5,
    why: "Legs, hips, back and lats all at once, so it preps most of a full-body day in one go. Best before pulls and hinges.",
    how: "Damper 3 to 5. Legs, then hips, then arms. Finish tall with ribs down. Leaning way back at the finish is the exact arch you're training out." },
  { name: 'Bike', kind: 'cardio', mins: 6,
    why: "Heats up the quads and hips with zero load on your spine. The pick when your low back is cranky, or before a leg press day.",
    how: "Light resistance, 80 to 90 rpm. Upright or recumbent both work." },
  { name: 'Incline walk', kind: 'cardio', mins: 5,
    why: "Lowest skill option. The incline makes your glutes drive hip extension every stride, which is the movement tight hip flexors fight.",
    how: "6 to 10% incline around 3 mph. Don't hold the rails." },
  { name: 'Elliptical', kind: 'cardio', mins: 5,
    why: "Arms and legs together with no impact. Solid general option when the rower's taken.",
    how: "Easy resistance. Stand tall instead of leaning on the handles." },
  { name: 'Easy jog', kind: 'cardio', mins: 4,
    why: "Gets heart rate and temperature up fastest. Fine if you like it, but it's the most tiring option, so keep it short.",
    how: "Conversational pace. Stop well before you're breathing hard." },
  { name: 'Stair climber', kind: 'cardio', mins: 3,
    why: "Glutes and quads warm up quick. It gets hard fast, so treat it as a short primer, not a workout.",
    how: "Slow pace, full foot on each step, light hand on the rail for balance only." },
  { name: 'Anti-arch primer', kind: 'mobility', mins: 3,
    why: "Dead bugs, bird dogs, glute bridges. Wakes up your front core and glutes so your pelvis stays neutral once weight goes on. The one that directly serves the lordosis goal. Great right after any machine above.",
    how: "One round: 8 dead bugs per side, 6 bird dogs per side, 10 glute bridges. Low back stays flat on the dead bugs." }
];

const COOLDOWNS = [
  { name: 'Easy walk', kind: 'cardio', mins: 5,
    why: "Lets heart rate come down gradually and adds easy steps to the day. Zero recovery cost.",
    how: "Flat treadmill or a lap outside. Truly easy." },
  { name: 'Incline walk', kind: 'cardio', mins: 12,
    why: "Want bonus cardio? This is the cheapest place to get it. Low enough intensity that it won't eat into lifting recovery, and it's good heart health work.",
    how: "Effort where you could talk but would rather not. 10 to 15 minutes." },
  { name: 'Bike', kind: 'cardio', mins: 5,
    why: "Light movement for stiff legs after a leg-heavy day.",
    how: "Very light resistance. Just spin." },
  { name: 'Hip flexor stretch', kind: 'mobility', mins: 3,
    why: "Tight hip flexors pull the pelvis forward into the arch. Warm muscle stretches best, so right now is the best slot you'll get all day.",
    how: "Half-kneeling or couch stretch, 2 x 30 to 45s per side. Squeeze the back-leg glute and tuck your pelvis first, or you're just bending your low back." },
  { name: '90/90 breathing', kind: 'mobility', mins: 3,
    why: "Teaches the ribs-down, pelvis-tucked position your low back needs, and calms everything down after lifting.",
    how: "On your back, feet on a wall, hips and knees at 90. Long full exhale, ribs drop, low back flattens. 5 slow breaths, 2 or 3 rounds." }
];
