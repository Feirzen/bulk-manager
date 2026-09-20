// Exercise knowledge layer.
//
// Deliberately separate from exercises.js. That file holds form steps, common
// errors and load_step and is already correct; this one adds what a movement
// trains, where you should feel it, and how each listed substitution actually
// compares to the primary. Keeping them apart means either can be rewritten
// without risking the other.
//
// Shape:
//   targets  { primary: [...], secondary: [...] }
//   feel     one line. Where the work should show up if you are doing it right.
//   vs       only on exercises that appear as a primary in program.json.
//            Keyed by substitution name.
//            v: 'like'  swap freely, trains the same thing
//               'close' same pattern, meaningful difference in emphasis
//               'diff'  trains something else. Know what you are giving up.
//
// The weekly review adds entries for any newly programmed exercise.

const EX_KNOW = {

  /* ---------------- Session A: Quads & Press ---------------- */

  'Leg press': {
    targets: { primary: ['Quadriceps', 'Gluteus maximus'], secondary: ['Adductors', 'Hamstrings'] },
    feel: 'Front of the thighs, and the glutes at the bottom of each rep. Nothing at all in your low back.',
    vs: {
      'Goblet squat': { v: 'close', n: 'Same knee-dominant pattern, but you hold the load in front, so your trunk and upper back work to stay upright. Lighter absolute load. Better carryover to real life, harder to load heavy.' },
      'Hack squat': { v: 'like', n: 'Nearly identical stimulus with a slightly deeper knee bend and more quad bias. Free swap.' }
    }
  },
  'Goblet squat': {
    targets: { primary: ['Quadriceps', 'Gluteus maximus'], secondary: ['Spinal erectors', 'Upper back', 'Core'] },
    feel: 'Quads and glutes, plus a real bracing demand through the trunk holding the bell up.'
  },
  'Hack squat': {
    targets: { primary: ['Quadriceps'], secondary: ['Gluteus maximus', 'Adductors'] },
    feel: 'Heavy quad burn, especially just above the knee. Back stays supported throughout.'
  },

  'Seated cable row': {
    targets: { primary: ['Mid-trapezius', 'Rhomboids', 'Latissimus dorsi'], secondary: ['Biceps', 'Rear deltoid'] },
    feel: 'Between the shoulder blades as you finish the pull. Biceps should be a supporting cast, not the star.',
    vs: {
      'Single-arm dumbbell row': { v: 'close', n: 'Same horizontal pull, one side at a time, so you catch left-right differences. Requires you to brace against rotation, which is useful but means less load.' },
      'Machine row': { v: 'like', n: 'Chest pad takes your low back out of it entirely. Given your lordosis this is arguably the better default, not a downgrade.' },
      'Chest-supported row': { v: 'like', n: 'Same horizontal pull with the torso braced against a pad, so there is nothing for your low back to do. The safest version of this slot for you.' }
    }
  },
  'Single-arm dumbbell row': {
    targets: { primary: ['Latissimus dorsi', 'Mid-trapezius'], secondary: ['Biceps', 'Obliques', 'Rear deltoid'] },
    feel: 'Lat on the working side, from armpit down the ribs. Obliques quietly working to stop your torso twisting.'
  },
  'Machine row': {
    targets: { primary: ['Mid-trapezius', 'Rhomboids', 'Latissimus dorsi'], secondary: ['Biceps'] },
    feel: 'Squeeze between the shoulder blades. Chest stays glued to the pad the whole set.'
  },

  'Dumbbell bench press': {
    targets: { primary: ['Pectoralis major'], secondary: ['Anterior deltoid', 'Triceps'] },
    feel: 'Across the chest, with a stretch at the bottom. Front of the shoulders will share the load.',
    vs: {
      'Machine chest press': { v: 'close', n: 'Fixed path removes the stabilizing demand, so you can push closer to failure safely. Less carryover to free-weight pressing, but no spotter needed.' },
      'Push-up': { v: 'diff', n: 'Same muscles, but load is capped at your bodyweight and the serratus does real work holding the shoulder blades. Fine as a finisher, not a replacement for a loaded press.' },
      'Incline dumbbell press': { v: 'close', n: 'Same press with the bench tilted, which moves the work to the upper chest and drops the load you can handle. A fine swap, just know you are training a different region of the same muscle.' }
    }
  },
  'Machine chest press': {
    targets: { primary: ['Pectoralis major'], secondary: ['Anterior deltoid', 'Triceps'] },
    feel: 'Chest, with the burn concentrated near the lockout. Minimal balance demand.'
  },
  'Push-up': {
    targets: { primary: ['Pectoralis major'], secondary: ['Triceps', 'Serratus anterior', 'Core'] },
    feel: 'Chest and triceps, plus the whole trunk working to keep you in one straight line.'
  },

  'Dead bug': {
    targets: { primary: ['Rectus abdominis', 'Transverse abdominis'], secondary: ['Obliques', 'Hip flexors'] },
    feel: 'Deep in the abs, and your low back pressed flat against the floor. This is the anti-lordosis piece of your program, so the flat back is the whole point.',
    vs: {
      'Pallof press': { v: 'close', n: 'Also anti-extension bracing, but standing and with an anti-rotation demand added. Works the same problem from a more upright position.' },
      'Plank': { v: 'close', n: 'Same bracing job held statically instead of moving limbs. Easier to cheat by letting the hips sag, which is exactly the position you are trying to avoid.' },
      'Bird dog': { v: 'like', n: 'The same anti-extension job from hands and knees instead of on your back. Adds a rotational component because the hips want to tip when a leg goes out. Swap freely.' }
    }
  },
  'Pallof press': {
    targets: { primary: ['Obliques', 'Transverse abdominis'], secondary: ['Rectus abdominis', 'Gluteus medius'] },
    feel: 'Sides of the abs fighting the cable trying to twist you. If you feel nothing, stand further from the stack.',
    vs: {
      'Side plank': { v: 'close', n: 'Same obliques, held statically on the floor instead of resisting a cable standing up. No equipment needed, less adjustable.' },
      'Dead bug': { v: 'close', n: 'Drops the anti-rotation demand and keeps the anti-extension one, lying down where you can actually feel whether your low back is flat. Use it when the cable station is busy or the Pallof still feels unclear.' }
    }
  },
  'Plank': {
    targets: { primary: ['Rectus abdominis', 'Transverse abdominis'], secondary: ['Shoulders', 'Gluteus maximus'] },
    feel: 'Abs and glutes. Tuck the pelvis under. If it lands in your low back, your hips have dropped.',
    vs: {
      'Side plank': { v: 'close', n: 'Rotates the same bracing job onto the obliques and the side of the hip. Worth doing precisely because it hits what a front plank misses.' },
      'Pallof press': { v: 'close', n: 'Standing and anti-rotation rather than anti-extension. Harder to cheat, and it carries over to real positions better than lying on the floor.' }
    }
  },
  'Side plank': {
    targets: { primary: ['Obliques', 'Quadratus lumborum'], secondary: ['Gluteus medius', 'Shoulder'] },
    feel: 'Down the side of your torso and into the top hip. Hips stacked, not rolled back.'
  },

  'Dumbbell curl': {
    targets: { primary: ['Biceps brachii'], secondary: ['Brachialis', 'Forearm flexors'] },
    feel: 'Front of the upper arm. If your shoulders are burning, you are swinging.',
    vs: {
      'Cable curl': { v: 'like', n: 'Constant tension through the whole range instead of falling off at the top. Slightly better stimulus per rep, same muscle.' },
      'Hammer curl': { v: 'close', n: 'Neutral grip shifts work toward the brachialis and brachioradialis. Builds arm thickness rather than peak. Both are worth doing.' }
    }
  },
  'Cable curl': {
    targets: { primary: ['Biceps brachii'], secondary: ['Brachialis'] },
    feel: 'Constant burn in the biceps with no rest at the top of the rep.'
  },
  'Hammer curl': {
    targets: { primary: ['Brachialis', 'Brachioradialis'], secondary: ['Biceps brachii'] },
    feel: 'Outer upper arm and the top of the forearm. Different spot than a normal curl, which is the point.',
    vs: {
      'Dumbbell curl': { v: 'close', n: 'Supinated grip moves the emphasis onto the biceps proper. Neither is better, they build different parts of the arm.' },
      'Cable curl': { v: 'close', n: 'Biceps rather than brachialis, with constant tension. Use a rope attachment to keep the neutral grip and it becomes a near-straight swap.' }
    }
  },

  /* ---------------- Session B: Hinge & Overhead ---------------- */

  'Barbell RDL': {
    targets: { primary: ['Hamstrings', 'Gluteus maximus'], secondary: ['Spinal erectors', 'Lats'] },
    feel: 'A deep stretch up the back of the thighs on the way down. Erectors will work isometrically, which is fine. Sharp low back sensation is not fine, stop the set.',
    vs: {
      'Hip thrust': { v: 'close', n: 'Both hinge, but the thrust loads the glutes at full hip extension with almost no spinal loading. Given your lordosis it is the safer heavy option, though you lose the hamstring stretch.' },
      'Seated leg curl': { v: 'diff', n: 'Isolates the hamstrings at the knee rather than the hip, and takes your spine out of it completely. Good hamstring work, but it is not a hinge and trains no bracing.' }
    }
  },
  'Hip thrust': {
    targets: { primary: ['Gluteus maximus'], secondary: ['Hamstrings', 'Quadriceps'] },
    feel: 'Glutes, hard, at the top. Ribs stay down so it does not turn into a low back arch.',
    vs: {
      'Glute bridge': { v: 'like', n: 'The same movement off the floor instead of off a bench. Shorter range and a lower ceiling on load, but identical intent. Free swap if the bench is taken.' },
      'Barbell RDL': { v: 'close', n: 'Also hip extension, but loaded as a stretch through the hamstrings with the spine holding a neutral position under load. More hamstring, more technical, more demand on your low back. Use it when you want the hinge pattern itself.' },
      'Seated leg curl': { v: 'diff', n: 'Bends the knee instead of extending the hip, so it trains hamstrings with no glute and no hip extension at all. Fine as a hamstring exercise, but it is not a substitute for the pattern this slot exists to train.' }
    }
  },
  'Seated leg curl': {
    targets: { primary: ['Hamstrings'], secondary: ['Gastrocnemius'] },
    feel: 'Back of the thigh, concentrated behind the knee. Zero spinal involvement.'
  },

  'Overhead dumbbell press': {
    targets: { primary: ['Anterior deltoid', 'Lateral deltoid'], secondary: ['Triceps', 'Upper trapezius', 'Core'] },
    feel: 'Front and side of the shoulders. Ribs down. If your back arches to finish the rep, the weight is too heavy.',
    vs: {
      'Machine shoulder press': { v: 'close', n: 'Back support removes the bracing demand, which is why you can usually press more. Worth knowing that the number on the machine is not comparable to your dumbbell number.' },
      'Landmine press': { v: 'close', n: 'Angled press, much friendlier to the shoulder joint and far harder to arch your back on. Hits more upper chest and serratus than a strict overhead press.' }
    }
  },
  'Machine shoulder press': {
    targets: { primary: ['Anterior deltoid'], secondary: ['Lateral deltoid', 'Triceps'] },
    feel: 'Front of the shoulders and triceps at lockout, back flat on the pad.',
    vs: {
      'Overhead dumbbell press': { v: 'close', n: 'Same vertical press, but nothing stabilises the weight for you, so each side works independently and the load drops. Better long term, harder to load honestly while your shoulders are still waking up.' },
      'Landmine press': { v: 'close', n: 'Presses on an arc rather than straight overhead, which keeps the ribs down and asks less of shoulder mobility. The friendliest option on a day your low back wants to arch to finish the rep.' }
    }
  },
  'Landmine press': {
    targets: { primary: ['Anterior deltoid', 'Upper pectoralis'], secondary: ['Serratus anterior', 'Triceps', 'Core'] },
    feel: 'Front shoulder and upper chest, with the serratus working under the armpit as you reach.'
  },

  'Lat pulldown': {
    targets: { primary: ['Latissimus dorsi'], secondary: ['Biceps', 'Lower trapezius', 'Rhomboids'] },
    feel: 'Down the sides of your back, from armpit toward the waist. Lean back slightly and hold it.',
    vs: {
      'Assisted pull-up': { v: 'like', n: 'Same vertical pull, same muscles, you are just moving your body instead of the bar. Better long term, and the assist lets you scale it honestly.' },
      'Chest-supported row': { v: 'diff', n: 'Horizontal pull, not vertical. Hits mid-back and rhomboids more than lats. A fine exercise, but not the same job.' }
    }
  },
  'Assisted pull-up': {
    targets: { primary: ['Latissimus dorsi'], secondary: ['Biceps', 'Lower trapezius', 'Core'] },
    feel: 'Lats and biceps, with a real stretch at the bottom of each rep.'
  },
  'Chest-supported row': {
    targets: { primary: ['Mid-trapezius', 'Rhomboids'], secondary: ['Latissimus dorsi', 'Rear deltoid', 'Biceps'] },
    feel: 'Between the shoulder blades. Pad takes your low back entirely out of the movement.'
  },

  'Triceps pushdown': {
    targets: { primary: ['Triceps brachii'], secondary: ['Forearm extensors'] },
    feel: 'Back of the upper arm. Elbows pinned to your ribs so only the forearm moves.',
    vs: {
      'Overhead dumbbell extension': { v: 'close', n: 'Trains the same muscle in a stretched position, which biases the long head. Complementary rather than redundant, so alternating them is smart.' },
      'Dip machine': { v: 'close', n: 'Triceps plus chest and front delt. Lets you load heavier but it stops being an isolation exercise.' }
    }
  },
  'Overhead dumbbell extension': {
    targets: { primary: ['Triceps brachii, long head'], secondary: ['Forearm extensors'] },
    feel: 'A stretch deep in the back of the arm near the armpit. Ribs down, do not arch to get under the weight.',
    vs: {
      'Triceps pushdown': { v: 'close', n: 'Same muscle in a shortened rather than stretched position. Easier on the shoulder, less long-head emphasis.' }
    }
  },
  'Dip machine': {
    targets: { primary: ['Triceps brachii'], secondary: ['Lower pectoralis', 'Anterior deltoid'] },
    feel: 'Triceps and lower chest. Keep the torso fairly upright to keep the emphasis on the arms.'
  },

  /* ---------------- Session C: Single-leg & Back ---------------- */

  'Walking lunge': {
    targets: { primary: ['Quadriceps', 'Gluteus maximus'], secondary: ['Adductors', 'Gluteus medius', 'Hamstrings'] },
    feel: 'Front leg quad and glute, plus the hip of the front leg working to keep you from wobbling.',
    vs: {
      'Bulgarian split squat': { v: 'like', n: 'Same single-leg job with the rear foot elevated, which increases the stretch on the front leg and takes balance mostly out of it. Brutal, and arguably better.' },
      'Leg extension': { v: 'diff', n: 'Pure quad isolation sitting down. You lose the glute work, the hip stability and the single-leg balance entirely. Fine when your back is cranky, not an equal swap.' }
    }
  },
  'Bulgarian split squat': {
    targets: { primary: ['Quadriceps', 'Gluteus maximus'], secondary: ['Adductors', 'Gluteus medius'] },
    feel: 'Deep in the front-leg quad and glute, with a stretch across the front of the rear hip.'
  },
  'Leg extension': {
    targets: { primary: ['Quadriceps'], secondary: [] },
    feel: 'Isolated quad burn, strongest near lockout. Nothing else involved.'
  },

  'Incline dumbbell press': {
    targets: { primary: ['Upper pectoralis major', 'Anterior deltoid'], secondary: ['Triceps'] },
    feel: 'Upper chest near the collarbone. Bench at 30 degrees. Higher than that and it becomes a shoulder press.',
    vs: {
      'Machine incline press': { v: 'like', n: 'Same angle and emphasis without the balance demand. Straight swap when the dumbbells you need are taken.' },
      'Dumbbell bench press': { v: 'close', n: 'Flat drops the upper-chest emphasis and moves work to the mid chest. Good press either way, different region.' }
    }
  },
  'Machine incline press': {
    targets: { primary: ['Upper pectoralis major'], secondary: ['Anterior deltoid', 'Triceps'] },
    feel: 'Upper chest, back supported, fixed path.'
  },

  'Single-arm cable row': {
    targets: { primary: ['Latissimus dorsi', 'Mid-trapezius'], secondary: ['Rear deltoid', 'Biceps', 'Obliques'] },
    feel: 'Working-side lat, with a full stretch as the shoulder blade travels forward at the front of the rep.',
    vs: {
      'Machine row': { v: 'close', n: 'Both sides at once, so you lose the ability to catch a strength difference between sides, but you can load it heavier.' },
      'Chest-supported row': { v: 'close', n: 'More mid-back and rhomboid, less lat stretch. Pad support makes it the safest row for your back.' }
    }
  },

  'Face pull': {
    targets: { primary: ['Rear deltoid', 'External rotators'], secondary: ['Mid-trapezius', 'Rhomboids'] },
    feel: 'Back of the shoulders and between the blades. Should feel like posture work, never heavy.',
    vs: {
      'Reverse pec deck': { v: 'close', n: 'Hits the rear delt well but drops most of the external rotation, which is the part that actually helps your posture.' },
      'Rear delt dumbbell fly': { v: 'close', n: 'Same rear delt emphasis, needs strict form to avoid turning into a shrug. No rotation component either.' }
    }
  },
  'Reverse pec deck': {
    targets: { primary: ['Rear deltoid'], secondary: ['Mid-trapezius', 'Rhomboids'] },
    feel: 'Back of the shoulders. Keep the elbows soft so the arms do not take over.',
    vs: {
      'Rear delt dumbbell fly': { v: 'like', n: 'Same rear delt, free weights instead of a machine. Needs stricter form to stop it becoming a shrug, and the pad makes the machine easier to load honestly.' },
      'Face pull': { v: 'close', n: 'Adds external rotation, which is the part that actually helps posture, so it trains slightly more than this does. It stays available for exactly that reason: light, rope at eye height, elbows high.' }
    }
  },
  'Rear delt dumbbell fly': {
    targets: { primary: ['Rear deltoid'], secondary: ['Mid-trapezius'] },
    feel: 'Back of the shoulders. If your upper traps light up, the weight is too heavy.'
  },

  'Standing calf raise': {
    targets: { primary: ['Gastrocnemius'], secondary: ['Soleus'] },
    feel: 'Upper calf, with a full stretch at the bottom and a pause at the top. No bouncing.',
    vs: {
      'Seated calf raise': { v: 'diff', n: 'Bent knee takes the gastrocnemius out and targets the soleus underneath. Genuinely a different muscle, not a shortcut.' },
      'Leg press calf raise': { v: 'like', n: 'Straight-leg calf work same as standing, just loaded through the sled. Free swap when the calf machine is taken.' }
    }
  },
  'Seated calf raise': {
    targets: { primary: ['Soleus'], secondary: [] },
    feel: 'Lower calf, closer to the achilles. Different spot than the standing version.'
  },
  'Leg press calf raise': {
    targets: { primary: ['Gastrocnemius'], secondary: ['Soleus'] },
    feel: 'Upper calf. Push through the balls of the feet, do not let the knees bend.'
  },

  /* ---------------- Add-in P: Hips & Posture ---------------- */

  'Couch stretch': {
    targets: { primary: ['Hip flexors', 'Rectus femoris'], secondary: ['Quadriceps'] },
    feel: 'Front of the rear hip and down the thigh. Squeeze the back glute to tuck the pelvis. That tuck is the stretch, and it is the piece that directly addresses your lordosis.'
  },
  'Glute bridge': {
    targets: { primary: ['Gluteus maximus'], secondary: ['Hamstrings', 'Core'] },
    feel: 'Glutes at the top. Stop at a straight line from knee to shoulder. Arching past it defeats the purpose.',
    vs: {
      'Hip thrust': { v: 'like', n: 'Loaded version of the same movement with a longer range. Straight upgrade once bodyweight gets easy.' }
    }
  },
  'Bird dog': {
    targets: { primary: ['Spinal erectors', 'Transverse abdominis'], secondary: ['Gluteus maximus', 'Rear deltoid'] },
    feel: 'Deep trunk bracing, plus the glute of the extended leg. Hips stay square. Slow beats far.',
    vs: {
      'Dead bug': { v: 'close', n: 'Same anti-extension bracing on your back instead of hands and knees. Easier to keep the low back flat, so a good regression.' },
      'Pallof press': { v: 'close', n: 'Standing anti-rotation instead of quadruped anti-extension. Trains the same bracing problem higher up the chain, which is why it stays on the list even though you do not like it.' }
    }
  },

  /* ---------------- Add-in S: Arms & Shoulders ---------------- */

  'Cable lateral raise': {
    targets: { primary: ['Lateral deltoid'], secondary: ['Upper trapezius'] },
    feel: 'Side of the shoulder. Lead with the elbow, stop at shoulder height.',
    vs: {
      'Dumbbell lateral raise': { v: 'close', n: 'Same muscle, but tension falls off at the bottom where a cable keeps it constant. Easier to find a free pair, slightly worse stimulus.' }
    }
  },
  'Dumbbell lateral raise': {
    targets: { primary: ['Lateral deltoid'], secondary: ['Upper trapezius'] },
    feel: 'Side of the shoulder, hardest near the top of the range.'
  }
};
