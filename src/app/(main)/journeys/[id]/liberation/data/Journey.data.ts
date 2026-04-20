// ─── Journey Data ─────────────────────────────────────────────────────────────
export const JOURNEY = {
  title: 'Feel More Vital',
  subtitle: "Gentle daily practices to reawaken your body's natural vitality",
  price: '€47',
  stats: '7 days · 3 exercises per day · Under 3 minutes each',
  reminders: [
    { id: 'early-bird', label: 'Early bird (7:30)', time: '07:30' },
    { id: 'regular', label: 'Regular (9:30)', time: '09:30' },
  ],
  preparations: [
    { id: 'quiet-space', label: 'Find a quiet, comfortable space' },
    { id: 'water', label: 'Have a glass of water nearby' },
    { id: 'notebook', label: 'Keep a notebook or journal close' },
  ],
  days: [
    {
      day: 1,
      title: 'Awakening',
      checkinPrompt: 'How are you feeling this morning?',
      exercises: [
        {
          type: 'Morning Exercise',
          title: 'Welcome the Light',
          quote: '🌿 "Hey friend, let\'s do something simple that lets your body sing again."',
          whatToDo:
            'Find the nearest source of light — a window, the sky, even a lamp. Look up toward it. Take 3 slow breaths. Then gently turn your head left… center… right. Drop your shoulders. Reach your arms up for a 10-second gratitude stretch.',
          steps: [
            'Look up toward the nearest light source',
            'Take 3 slow, deep breaths — thank the new day',
            'Gentle neck turns: slowly left, center, right',
            'Drop your shoulders and release tension',
            'Arms up for a 10-second gratitude stretch',
          ],
          whyThis:
            "Light is the oldest signal to your body that a new day has begun. This simple act resets your nervous system and tells your cells: we're alive.",
          duration: '2 min',
        },
        {
          type: 'Breath Exercise',
          title: 'The 4-7-8 Reset',
          quote: '🌬️ "Your breath is the most powerful tool you already own."',
          whatToDo:
            'Sit comfortably with your back straight. Inhale through your nose for 4 counts. Hold your breath for 7 counts. Exhale completely through your mouth for 8 counts. Repeat 3 times.',
          steps: [
            'Sit with your back straight, shoulders relaxed',
            'Inhale through your nose for 4 counts',
            'Hold your breath for 7 counts',
            'Exhale fully through your mouth for 8 counts',
            'Repeat the cycle 3 times',
          ],
          whyThis:
            'The 4-7-8 pattern activates your parasympathetic nervous system, reducing cortisol and bringing your body into a calm, ready state.',
          duration: '2 min',
        },
        {
          type: 'Body Exercise',
          title: 'Spine River',
          quote: '🌊 "Let your spine be water — fluid, alive, free."',
          whatToDo:
            'Stand or sit tall. Begin to slowly roll your spine forward, vertebra by vertebra, letting your head hang heavy. Pause at the bottom. Slowly roll back up, stacking each bone. Repeat 5 times with full breath.',
          steps: [
            'Stand or sit tall, feet grounded',
            'Exhale and slowly roll your spine forward',
            'Let your head hang heavy — release fully',
            'Pause and breathe at the bottom',
            'Inhale and slowly roll back up, vertebra by vertebra',
          ],
          whyThis:
            'Your spine carries the nervous system highway. Gentle movement here releases stored tension, improves circulation, and signals safety to your whole body.',
          duration: '3 min',
        },
      ],
    },
    {
      day: 2,
      title: 'Softening',
      checkinPrompt: 'What are you carrying into today?',
      exercises: [
        {
          type: 'Morning Exercise',
          title: 'Hand on Heart',
          quote: '🤍 "The simplest touch can change everything."',
          whatToDo:
            'Place one hand on your heart and one on your belly. Close your eyes. Feel the warmth. Take 5 slow breaths and say to yourself: I am here. I am okay. I am enough.',
          steps: [
            'Place right hand on heart, left hand on belly',
            'Close your eyes and feel the warmth',
            'Take 5 slow, deliberate breaths',
            'With each exhale say: I am here',
            'With each inhale say: I am enough',
          ],
          whyThis:
            "Self-touch activates the body's caregiving system, releasing oxytocin and reducing the stress response — often within seconds.",
          duration: '2 min',
        },
        {
          type: 'Breath Exercise',
          title: 'Sighing Release',
          quote: '😮‍💨 "A sigh is the body asking for permission to let go."',
          whatToDo:
            'Take a slow inhale through your nose. At the top, take one more sip of air. Then open your mouth and let out a long, audible sigh. Do this 5 times. Make the sigh sound as long and as loud as feels right.',
          steps: [
            'Inhale slowly through your nose',
            'At the top, take one extra sip of air',
            'Open your mouth and release a long audible sigh',
            'Let the sigh be as loud as it wants to be',
            'Repeat 5 times — feel each release',
          ],
          whyThis:
            'Physiological sighs are the fastest way to reset your nervous system. They deflate over-inflated air sacs in your lungs and drop your heart rate almost instantly.',
          duration: '2 min',
        },
        {
          type: 'Body Exercise',
          title: 'Gentle Hip Circles',
          quote: '🌀 "Your hips hold more stories than your mind knows."',
          whatToDo:
            'Stand with feet hip-width apart. Place hands on hips. Begin slow, large circles with your hips — like drawing a big circle on the ceiling. 5 times clockwise, 5 times counter-clockwise. Move slowly and breathe.',
          steps: [
            'Stand with feet hip-width apart',
            'Place hands on hips, bend knees slightly',
            'Make 5 slow circles clockwise',
            'Pause and feel any sensation',
            'Make 5 slow circles counter-clockwise',
          ],
          whyThis:
            'The hips are where we store unprocessed emotion and stress. Slow, intentional movement here can unlock surprising releases — emotional and physical.',
          duration: '3 min',
        },
      ],
    },
    {
      day: 3,
      title: 'Releasing',
      checkinPrompt: 'What would you like to release today?',
      exercises: [
        {
          type: 'Morning Exercise',
          title: 'The Shake',
          quote: '🫧 "Animals shake to release trauma. You can too."',
          whatToDo:
            'Stand with feet wider than hips. Begin to gently shake your whole body — starting with your hands, moving to your arms, shoulders, torso, hips, legs. Let it be loose and a little silly. Shake for 60 seconds.',
          steps: [
            'Stand with feet wider than hip-width',
            'Start shaking your hands gently',
            'Let the shake travel up your arms to shoulders',
            'Let your whole torso join — loose and free',
            'Add your hips and legs, shake for 60 seconds',
          ],
          whyThis:
            'Shaking is one of the most ancient mammalian stress-release mechanisms. It discharges adrenaline and cortisol stored in muscle tissue.',
          duration: '2 min',
        },
        {
          type: 'Breath Exercise',
          title: "Lion's Breath",
          quote: '🦁 "Roar out what no longer belongs in your body."',
          whatToDo:
            'Sit on your heels or in a chair. Inhale deeply through your nose. Lean forward slightly, open your mouth wide, stick your tongue out, and exhale with a loud "HA" sound. Let your eyes go wide. Do 5 rounds.',
          steps: [
            'Sit tall, inhale deeply through your nose',
            'Lean slightly forward on the exhale',
            'Open mouth wide and stick tongue out fully',
            'Exhale forcefully with a loud "HA"',
            'Let your eyes go wide — do 5 rounds',
          ],
          whyThis:
            "Lion's breath releases tension in the face, jaw, and throat — areas where we chronically hold stress and unexpressed emotion.",
          duration: '2 min',
        },
        {
          type: 'Body Exercise',
          title: 'Floor Melt',
          quote: '🌿 "Let gravity do the work. Just surrender."',
          whatToDo:
            'Lie on your back. Spread your arms and legs slightly. Close your eyes. With each exhale, imagine yourself getting heavier — sinking deeper into the floor. Stay for 3 minutes. Notice where tension softens.',
          steps: [
            'Lie on your back, limbs slightly spread',
            'Close your eyes and take 3 deep breaths',
            'With each exhale, let your body get heavier',
            'Scan from feet to head — soften each area',
            'Stay for 3 minutes, simply observing',
          ],
          whyThis:
            'Conscious relaxation activates the vagus nerve and shifts the body out of the sympathetic (fight/flight) state into deep restoration.',
          duration: '3 min',
        },
      ],
    },
    {
      day: 4,
      title: 'Grounding',
      checkinPrompt: 'Where do you feel most unsteady right now?',
      exercises: [
        {
          type: 'Morning Exercise',
          title: 'Root Stance',
          quote: '🌳 "You belong to the earth. Let it hold you."',
          whatToDo:
            'Stand barefoot if possible. Feet hip-width apart. Press all four corners of each foot into the floor. Bend your knees slightly. Take 10 breaths, feeling the ground beneath you with each one.',
          steps: [
            'Stand barefoot or in socks on the floor',
            'Feet hip-width, press all four foot corners down',
            'Bend knees slightly — feel rooted',
            'Take 10 long, slow breaths',
            'With each breath, feel more connected to the ground',
          ],
          whyThis:
            "Grounding postures activate proprioception — your body's sense of where it is in space — which is deeply calming to the nervous system.",
          duration: '2 min',
        },
        {
          type: 'Breath Exercise',
          title: 'Earth Breathing',
          quote: '🌍 "Breathe like you have nowhere to be."',
          whatToDo:
            'Sit on the floor if possible. Take a 6-count inhale, filling from the belly up. Hold for 2 counts. Take a 6-count exhale, emptying from chest down. Repeat 6 times. Feel each breath rooting you.',
          steps: [
            'Sit on the floor, cross-legged if comfortable',
            'Place hands palms-down on your knees',
            'Inhale for 6 counts, filling belly first',
            'Hold gently for 2 counts',
            'Exhale for 6 counts, empty chest first',
          ],
          whyThis:
            'Slow, diaphragmatic breathing activates the body\'s "rest and digest" system and lowers baseline anxiety levels with consistent practice.',
          duration: '2 min',
        },
        {
          type: 'Body Exercise',
          title: 'Tree Hold',
          quote: '🍃 "Balance is not stillness — it\'s constant, quiet adjustment."',
          whatToDo:
            "Stand on one foot. Place the other foot on your inner ankle or calf. Find a fixed point to look at. Hold for 30 seconds, then switch. Keep breathing. If you wobble, smile — that's the exercise working.",
          steps: [
            'Stand tall and find a fixed point to gaze at',
            'Shift weight to your right foot',
            'Place left foot on inner ankle or calf',
            'Hold for 30 seconds, breathing steadily',
            'Switch sides — notice any difference',
          ],
          whyThis:
            'Single-leg balance trains the neural pathways that regulate stability and presence — physically and emotionally.',
          duration: '3 min',
        },
      ],
    },
    {
      day: 5,
      title: 'Flowing',
      checkinPrompt: 'What would feel like freedom in your body today?',
      exercises: [
        {
          type: 'Morning Exercise',
          title: 'Morning Wave',
          quote: '🌊 "Move like water — purposeful, yet free."',
          whatToDo:
            'Stand with feet hip-width. Begin swaying gently side to side. Let your arms hang and sway with you. Gradually let the movement grow — arms, hips, head joining in. Move freely for 2 minutes with no rules.',
          steps: [
            'Stand with feet hip-width apart',
            'Begin a gentle side-to-side sway',
            'Let your arms hang loose and follow',
            'Allow the movement to grow organically',
            'Move freely for 2 minutes — no rules',
          ],
          whyThis:
            'Rhythmic, self-led movement activates the cerebellum and releases dopamine — creating feelings of aliveness and creative openness.',
          duration: '2 min',
        },
        {
          type: 'Breath Exercise',
          title: 'Wave Breath',
          quote: '🫁 "Let your breath move through you like a wave."',
          whatToDo:
            'Lie down or sit back. Imagine your breath as a wave. Inhale and let it roll from your belly up through your chest. Exhale and let it roll back down. Make the breath feel like water moving. 8 slow rounds.',
          steps: [
            'Lie back or sit reclined',
            'Place one hand on belly, one on chest',
            'Inhale — let the wave roll belly to chest',
            'Exhale — let the wave roll chest to belly',
            'Complete 8 slow, continuous wave breaths',
          ],
          whyThis:
            'Wave breathing coordinates the diaphragm, intercostal muscles, and parasympathetic nervous system into a synchronized, deeply restorative rhythm.',
          duration: '2 min',
        },
        {
          type: 'Body Exercise',
          title: 'Wrist & Hand Release',
          quote: '🙌 "Your hands have held so much. Let them rest."',
          whatToDo:
            'Extend arms in front of you. Make a gentle fist, then spread fingers wide. Repeat 5 times. Then circle wrists 5 times each direction. Finish by shaking hands loosely for 30 seconds.',
          steps: [
            'Extend arms forward at shoulder height',
            'Make a gentle fist — hold for 2 seconds',
            'Spread fingers wide — hold for 2 seconds',
            'Repeat 5 times, then circle wrists slowly',
            'Finish by shaking hands loose for 30 seconds',
          ],
          whyThis:
            'The hands and wrists accumulate enormous tension, especially in modern life. Releasing this area improves circulation and nervous system regulation throughout the upper body.',
          duration: '3 min',
        },
      ],
    },
    {
      day: 6,
      title: 'Radiating',
      checkinPrompt: 'What quality would you like to embody today?',
      exercises: [
        {
          type: 'Morning Exercise',
          title: 'Heart Expansion',
          quote: '💛 "The more you open, the more you can receive."',
          whatToDo:
            'Stand tall. Clasp hands behind your back. Gently squeeze shoulder blades together and lift your chest toward the sky. Hold for 5 breaths. Release and round forward. Repeat 3 times.',
          steps: [
            'Stand tall, clasp hands behind your back',
            'Squeeze shoulder blades together',
            'Lift your chest toward the sky',
            'Hold for 5 breaths, heart forward',
            'Release and round forward — repeat 3 times',
          ],
          whyThis:
            'Heart openers stretch the muscles across the chest and shoulders where we carry defensive armor. Opening this area physically signals the nervous system to shift from protection to connection.',
          duration: '2 min',
        },
        {
          type: 'Breath Exercise',
          title: 'Loving Kindness Breath',
          quote: '🌸 "Breathe in kindness for yourself first."',
          whatToDo:
            'Sit comfortably. Inhale and silently say: May I be well. Exhale and say: May I be at peace. Do 5 rounds for yourself, then 5 rounds imagining someone you love, then 5 rounds for all beings.',
          steps: [
            'Sit comfortably with eyes closed',
            'Inhale — silently say: May I be well',
            'Exhale — silently say: May I be at peace',
            'Do 5 rounds for yourself',
            'Then 5 rounds for a loved one, then all beings',
          ],
          whyThis:
            "Loving-kindness meditation has been shown to increase positive emotions, reduce self-criticism, and activate the vagus nerve — the body's primary compassion circuit.",
          duration: '2 min',
        },
        {
          type: 'Body Exercise',
          title: 'Shoulder Roll Release',
          quote: '🌤️ "Let your shoulders drop away from your ears."',
          whatToDo:
            'Sit or stand tall. Inhale and draw your shoulders up to your ears. Hold for 3 seconds. Exhale and drop them completely. Then roll shoulders backward in large, slow circles 5 times. Forward 5 times.',
          steps: [
            'Sit or stand tall with spine long',
            'Inhale — draw shoulders up to ears',
            'Hold for 3 seconds, really squeeze',
            'Exhale — drop shoulders completely',
            'Roll backward 5 times, then forward 5 times',
          ],
          whyThis:
            'We carry more tension in our shoulders than almost anywhere else. This release pattern breaks the tension-breath-tension cycle that keeps us in low-level stress.',
          duration: '3 min',
        },
      ],
    },
    {
      day: 7,
      title: 'Full Bloom',
      checkinPrompt: 'What has this week opened in you?',
      exercises: [
        {
          type: 'Morning Exercise',
          title: 'Full Body Thank You',
          quote: '🌺 "Seven days of showing up. That is everything."',
          whatToDo:
            'Stand with feet wide. Arms wide. Tilt your head back gently. Take 3 deep breaths and feel the full length of your body. Then bring hands to heart. Say thank you — to your body, for carrying you.',
          steps: [
            'Stand with feet wide apart, arms open wide',
            'Tilt head back gently and breathe',
            'Feel the full length and width of your body',
            'Take 3 deep, grateful breaths',
            'Bring hands to heart and say: thank you',
          ],
          whyThis:
            'Gratitude directed at the body activates the same neural pathways as self-compassion — reinforcing a positive relationship with the physical self that lasts far beyond this practice.',
          duration: '2 min',
        },
        {
          type: 'Breath Exercise',
          title: 'Completion Breath',
          quote: '🎋 "Breathe in who you are now. Exhale who you were."',
          whatToDo:
            'Take the longest, slowest inhale you can manage. Hold at the top. Then take the longest, fullest exhale you can. No rush. Do this 7 times — one for each day. Feel the difference between breath 1 and breath 7.',
          steps: [
            'Take the longest inhale you can manage',
            'Hold at the top — feel the fullness',
            'Take the longest exhale you can manage',
            'Notice the quiet that follows',
            'Repeat 7 times — one for each day',
          ],
          whyThis:
            'Slow, maximal breathing activates the full range of your respiratory muscles and gives your nervous system a complete reset — a fitting close to seven days of practice.',
          duration: '2 min',
        },
        {
          type: 'Body Exercise',
          title: 'The Bloom',
          quote: '🌸 "You have bloomed. You may not see it yet, but your body knows."',
          whatToDo:
            'Begin in a tight curl — arms wrapped around yourself, knees bent, head bowed. Slowly, with a long inhale, begin to unfurl. Arms open, spine lengthens, chin rises. At full extension hold and breathe. Curl back and repeat 5 times.',
          steps: [
            'Begin curled tight — arms wrapped, head bowed',
            'With a slow inhale, begin to unfurl',
            'Arms open wide, spine lengthens fully',
            'Chin rises, chest lifts — fully open',
            'Hold and breathe, then curl back — repeat 5 times',
          ],
          whyThis:
            'This movement mirrors the entire arc of your liberation. Moving from contracted to open trains your nervous system to associate expansion with safety.',
          duration: '3 min',
        },
      ],
    },
  ],
};
