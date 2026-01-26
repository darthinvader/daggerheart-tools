// Data file containing all ancestry definitions from the Daggerheart SRD
export const ANCESTRIES = [
  {
    name: 'Clank',
    description:
      'Clanks are sentient mechanical beings built from a variety of materials, including metal, wood, and stone. They can resemble humanoids, animals, or even inanimate objects. Like organic beings, their bodies come in a wide array of sizes. Because of their bespoke construction, many clanks have highly specialized physical configurations. Examples include clawed hands for grasping, wheels for movement, or built-in weaponry.',
    heightRange: 'Wide array of sizes',
    lifespan: 'Effectively immortal (as long as parts can be acquired)',
    physicalCharacteristics: [
      'Built from metal, wood, stone, or other materials',
      'Can resemble humanoids, animals, or inanimate objects',
      'Highly specialized physical configurations',
      'Customizable body modifications',
      'Minds deteriorate as magic loses potency over time',
    ],
    primaryFeature: {
      name: 'Purposeful Design',
      description:
        'Decide who made you and for what purpose. At character creation, choose one of your Experiences that best aligns with this purpose and gain a permanent +1 bonus to it.',
      type: 'primary',
    },
    secondaryFeature: {
      name: 'Efficient',
      description:
        'When you take a short rest, you can choose a long rest move instead of a short rest move.',
      type: 'secondary',
    },
  },
  {
    name: 'Drakona',
    description:
      "Drakona resemble wingless dragons in humanoid form and possess a powerful elemental breath. All drakona have thick scales that provide excellent natural armor against both attacks and the forces of nature. They are large in size, ranging from 5 feet to 7 feet on average, with long sharp teeth. New teeth grow throughout a Drakona's approximately 350-year lifespan, so they are never in danger of permanently losing an incisor.",
    heightRange: '5 to 7 feet',
    lifespan: 'Approximately 350 years',
    physicalCharacteristics: [
      'Wingless dragon-like humanoid form',
      'Thick protective scales',
      'Long sharp teeth that regrow',
      'Large size and build',
      'Elemental breath power inherited through generations',
    ],
    primaryFeature: {
      name: 'Scales',
      description:
        'Your scales act as natural protection. When you would take Severe damage, you can mark a Stress to mark 1 fewer Hit Points.',
      type: 'primary',
    },
    secondaryFeature: {
      name: 'Elemental Breath',
      description:
        'Choose an element for your breath (such as electricity, fire, or ice). You can use this breath against a target or group of targets within Very Close range, treating it as an Instinct weapon that deals d8 magic damage using your Proficiency.',
      type: 'secondary',
    },
  },
  {
    name: 'Dwarf',
    description:
      'Dwarves are most easily recognized as short humanoids with square frames, dense musculature, and thick hair. Their average height ranges from 4 to 5 ½ feet, and they are often broad in proportion to their stature. Their skin and nails contain a high amount of keratin, making them naturally resilient. This allows dwarves to embed gemstones into their bodies and decorate themselves with tattoos or piercings.',
    heightRange: '4 to 5½ feet',
    lifespan: 'Up to 250 years',
    physicalCharacteristics: [
      'Square frames and dense musculature',
      'Thick hair, often across the body',
      'High keratin content in skin and nails',
      'Broad proportions',
      'Facial hair growth in all genders',
      'Can embed gemstones and decorations',
    ],
    primaryFeature: {
      name: 'Thick Skin',
      description:
        'When you take Minor damage, you can mark 2 Stress instead of marking a Hit Point.',
      type: 'primary',
    },
    secondaryFeature: {
      name: 'Increased Fortitude',
      description: 'Spend 3 Hope to halve incoming physical damage.',
      type: 'secondary',
    },
  },
  {
    name: 'Elf',
    description:
      'Elves are typically tall humanoids with pointed ears and acutely attuned senses. Their ears vary in size and pointed shape, and as they age, the tips begin to droop. While elves come in a wide range of body types, they are all fairly tall, with heights ranging from about 6 to 6 ½ feet. All elves have the ability to drop into a celestial trance, rather than sleep.',
    heightRange: '6 to 6½ feet',
    lifespan: 'About 350 years',
    physicalCharacteristics: [
      'Tall humanoids with pointed ears',
      'Acutely attuned senses',
      'Ear tips droop with age',
      'Wide range of body types',
      'May possess mystic form traits',
      'Celestial trance instead of sleep',
    ],
    primaryFeature: {
      name: 'Quick Reactions',
      description: 'Mark a Stress to gain advantage on a reaction roll.',
      type: 'primary',
    },
    secondaryFeature: {
      name: 'Celestial Trance',
      description:
        'During a rest, you can drop into a trance to choose an additional downtime move.',
      type: 'secondary',
    },
  },
  {
    name: 'Faerie',
    description:
      'Faeries are winged humanoid creatures with insectile features. These characteristics cover a broad spectrum from humanoid to insectoid—some possess additional arms, compound eyes, lantern organs, chitinous exoskeletons, or stingers. Because of their close ties to the natural world, they also frequently possess attributes that allow them to blend in with various plants.',
    heightRange: '2 to 5 feet (some up to 7 feet)',
    lifespan: 'Approximately 50 years',
    physicalCharacteristics: [
      'Winged humanoids with insectile features',
      'Membranous wings',
      'May have additional arms, compound eyes, lantern organs',
      'Chitinous exoskeletons or stingers possible',
      'Plant-like camouflage attributes',
      'Undergo metamorphosis process',
    ],
    primaryFeature: {
      name: 'Luckbender',
      description:
        'Once per session, after you or a willing ally within Close range makes an action roll, you can spend 3 Hope to reroll the Duality Dice.',
      type: 'primary',
    },
    secondaryFeature: {
      name: 'Wings',
      description:
        'You can fly. While flying, you can mark a Stress after an adversary makes an attack against you to gain a +2 bonus to your Evasion against that attack.',
      type: 'secondary',
    },
  },
  {
    name: 'Faun',
    description:
      'Fauns resemble humanoid goats with curving horns, square pupils, and cloven hooves. Though their appearances may vary, most fauns have a humanoid torso and a goatlike lower body covered in dense fur. Faun faces can be more caprine or more humanlike, and they have a wide variety of ear and horn shapes.',
    heightRange: '4 to 6½ feet (height can change based on stance)',
    lifespan: 'Roughly 225 years',
    physicalCharacteristics: [
      'Humanoid goats with curving horns',
      'Square pupils and cloven hooves',
      'Humanoid torso, goatlike lower body',
      'Dense fur coverage',
      'Variety of ear and horn shapes',
      'Proportionately long limbs',
      'Become more goatlike with age',
    ],
    primaryFeature: {
      name: 'Caprine Leap',
      description:
        'You can leap anywhere within Close range as though you were using normal movement, allowing you to vault obstacles, jump across gaps, or scale barriers with ease.',
      type: 'primary',
    },
    secondaryFeature: {
      name: 'Kick',
      description:
        'When you succeed on an attack against a target within Melee range, you can mark a Stress to kick yourself off them, dealing an extra 2d6 damage and knocking back either yourself or the target to Very Close range.',
      type: 'secondary',
    },
  },
  {
    name: 'Firbolg',
    description:
      'Firbolgs are bovine humanoids typically recognized by their broad noses and long, drooping ears. Some have faces that are a blend of humanoid and bison, ox, cow, or other bovine creatures. Others, often referred to as minotaurs, have heads that entirely resemble cattle. They are tall and muscular creatures, with heights ranging from around 5 feet to 7 feet, and possess remarkable strength no matter their age.',
    heightRange: '5 to 7 feet',
    lifespan: 'About 150 years',
    physicalCharacteristics: [
      'Bovine humanoids with broad noses',
      'Long, drooping ears',
      'Blend of humanoid and bovine features',
      'Tall and muscular build',
      'Covered in fur (earth tones or pastels)',
      'Various horn styles',
      'Remarkable strength at any age',
    ],
    primaryFeature: {
      name: 'Charge',
      description:
        'When you succeed on an Agility Roll to move from Far or Very Far range into Melee range with one or more targets, you can mark a Stress to deal 1d12 physical damage to all targets within Melee range.',
      type: 'primary',
    },
    secondaryFeature: {
      name: 'Unshakable',
      description:
        "When you would mark a Stress, roll a d6. On a result of 6, don't mark it.",
      type: 'secondary',
    },
  },
  {
    name: 'Fungril',
    description:
      "Fungril resemble humanoid mushrooms. They can be either more humanoid or more fungal in appearance, and they come in an assortment of colors, from earth tones to bright reds, yellows, purples, and blues. Fungril display an incredible variety of bodies, faces, and limbs, as there's no single common shape among them.",
    heightRange: '2 to 7 feet',
    lifespan: 'About 300 years (some much longer)',
    physicalCharacteristics: [
      'Humanoid mushrooms',
      'Incredible variety in appearance',
      'Colors from earth tones to bright hues',
      'No single common shape',
      'Mycelial array for communication',
      'Can communicate nonverbally',
    ],
    primaryFeature: {
      name: 'Fungril Network',
      description:
        'Make an Instinct Roll (12) to use your mycelial array to speak with others of your ancestry. On a success, you can communicate across any distance.',
      type: 'primary',
    },
    secondaryFeature: {
      name: 'Death Connection',
      description:
        'While touching a corpse that died recently, you can mark a Stress to extract one memory from the corpse related to a specific emotion or sensation of your choice.',
      type: 'secondary',
    },
  },
  {
    name: 'Galapa',
    description:
      'Galapa resemble anthropomorphic turtles with large, domed shells into which they can retract. On average, they range from 4 feet to 6 feet in height, and their head and body shapes can resemble any type of turtle. Galapa come in a variety of earth tones—most often shades of green and brown—and possess unique patterns on their shells.',
    heightRange: '4 to 6 feet',
    lifespan: 'Approximately 150 years',
    physicalCharacteristics: [
      'Anthropomorphic turtles',
      'Large, domed shells',
      'Can retract into shell',
      'Various turtle-like head and body shapes',
      'Earth tone coloring',
      'Unique shell patterns',
      'Naturally slow movement',
    ],
    primaryFeature: {
      name: 'Shell',
      description:
        'Gain a bonus to your damage thresholds equal to your Proficiency.',
      type: 'primary',
    },
    secondaryFeature: {
      name: 'Retract',
      description:
        "Mark a Stress to retract into your shell. While in your shell, you have resistance to physical damage, you have disadvantage on action rolls, and you can't move.",
      type: 'secondary',
    },
  },
  {
    name: 'Giant',
    description:
      'Giants are towering humanoids with broad shoulders, long arms, and one to three eyes. Adult giants range from 6 ½ to 8 ½ feet tall and are naturally muscular, regardless of body type. They are easily recognized by their wide frames and elongated arms and necks. Though they can have up to three eyes, all giants are born with none and remain sightless for their first year of life.',
    heightRange: '6½ to 8½ feet',
    lifespan: 'About 75 years',
    physicalCharacteristics: [
      'Towering humanoids',
      'Broad shoulders and wide frames',
      'Long arms and necks',
      'One to three eyes',
      'Born sightless, eyes develop over first decade',
      'Naturally muscular regardless of body type',
    ],
    primaryFeature: {
      name: 'Endurance',
      description: 'Gain an additional Hit Point slot at character creation.',
      type: 'primary',
    },
    secondaryFeature: {
      name: 'Reach',
      description:
        'Treat any weapon, ability, spell, or other feature that has a Melee range as though it has a Very Close range instead.',
      type: 'secondary',
    },
  },
  {
    name: 'Goblin',
    description:
      'Goblins are small humanoids easily recognizable by their large eyes and massive membranous ears. With keen hearing and sharp eyesight, they perceive details both at great distances and in darkness, allowing them to move through less-optimal environments with ease. Their skin and eye colors are incredibly varied, with no one hue, either vibrant or subdued, more dominant than another.',
    heightRange: '3 to 4 feet',
    lifespan: 'Roughly 100 years',
    physicalCharacteristics: [
      'Small humanoids',
      'Large eyes and massive membranous ears',
      'Keen hearing and sharp eyesight',
      'Incredibly varied skin and eye colors',
      'Ears about the size of their head',
      'Use ear positions for nonverbal communication',
    ],
    primaryFeature: {
      name: 'Surefooted',
      description: 'You ignore disadvantage on Agility Rolls.',
      type: 'primary',
    },
    secondaryFeature: {
      name: 'Danger Sense',
      description:
        'Once per rest, mark a Stress to force an adversary to reroll an attack against you or an ally within Very Close range.',
      type: 'secondary',
    },
  },
  {
    name: 'Halfling',
    description:
      "Halflings are small humanoids with large hairy feet and prominent rounded ears. On average, halflings are 3 to 4 feet in height, and their ears, nose, and feet are larger in proportion to the rest of their body. Members of this ancestry live for around 150 years, and a halfling's appearance is likely to remain youthful even as they progress from adulthood into old age.",
    heightRange: '3 to 4 feet',
    lifespan: 'Around 150 years',
    physicalCharacteristics: [
      'Small humanoids',
      'Large hairy feet',
      'Prominent rounded ears',
      'Proportionately large ears, nose, and feet',
      'Youthful appearance throughout life',
      'Natural attunement to magnetic fields',
    ],
    primaryFeature: {
      name: 'Luckbringer',
      description:
        'At the start of each session, everyone in your party gains a Hope.',
      type: 'primary',
    },
    secondaryFeature: {
      name: 'Internal Compass',
      description: 'When you roll a 1 on your Hope Die, you can reroll it.',
      type: 'secondary',
    },
  },
  {
    name: 'Human',
    description:
      'Humans are most easily recognized by their dexterous hands, rounded ears, and bodies built for endurance. Their average height ranges from just under 5 feet to about 6 ½ feet. They have a wide variety of builds, with some being quite broad, others lithe, and many inhabiting the spectrum in between. Humans are physically adaptable and adjust to harsh climates with relative ease.',
    heightRange: 'Just under 5 to 6½ feet',
    lifespan: 'About 100 years',
    physicalCharacteristics: [
      'Dexterous hands',
      'Rounded ears',
      'Bodies built for endurance',
      'Wide variety of builds',
      'Physically adaptable',
      'Adjust to harsh climates easily',
      'Bodies change dramatically with age',
    ],
    primaryFeature: {
      name: 'High Stamina',
      description: 'Gain an additional Stress slot at character creation.',
      type: 'primary',
    },
    secondaryFeature: {
      name: 'Adaptability',
      description:
        'When you fail a roll that utilized one of your Experiences, you can mark a Stress to reroll.',
      type: 'secondary',
    },
  },
  {
    name: 'Infernis',
    description:
      'Infernis are humanoids who possess sharp canine teeth, pointed ears, and horns. They are the descendants of demons from the Circles Below. On average, infernis range in height from 5 feet to 7 feet and are known to have long fingers and pointed nails. Some have long, thin, and smooth tails that end in points, forks, or arrowheads.',
    heightRange: '5 to 7 feet',
    lifespan: 'Up to 350 years',
    physicalCharacteristics: [
      'Sharp canine teeth and pointed ears',
      'Horns (two, four, or crown of many)',
      'Long fingers and pointed nails',
      'May have long tails with various endings',
      'Skin, hair, and horns in varied colors',
      'Dread visage ability',
      'Descendants of demons',
    ],
    primaryFeature: {
      name: 'Fearless',
      description:
        'When you roll with Fear, you can mark 2 Stress to change it into a roll with Hope instead.',
      type: 'primary',
    },
    secondaryFeature: {
      name: 'Dread Visage',
      description:
        'You have advantage on rolls to intimidate hostile creatures.',
      type: 'secondary',
    },
  },
  {
    name: 'Katari',
    description:
      'Katari are feline humanoids with retractable claws, vertically slit pupils, and high, triangular ears. They can also have small, pointed canine teeth, soft fur, and long whiskers that assist their perception and navigation. Their ears can swivel nearly 180 degrees to detect sound, adding to their heightened senses.',
    heightRange: '3 to 6½ feet',
    lifespan: 'Around 150 years',
    physicalCharacteristics: [
      'Feline humanoids',
      'Retractable claws',
      'Vertically slit pupils',
      'High, triangular ears that swivel',
      'Soft fur and long whiskers',
      'About half have tails',
      'Wide range of fur patterns and colors',
    ],
    primaryFeature: {
      name: 'Feline Instincts',
      description:
        'When you make an Agility Roll, you can spend 2 Hope to reroll your Hope Die.',
      type: 'primary',
    },
    secondaryFeature: {
      name: 'Retracting Claws',
      description:
        'Make an Agility Roll to scratch a target within Melee range. On a success, they become temporarily Vulnerable.',
      type: 'secondary',
    },
  },
  {
    name: 'Orc',
    description:
      "Orcs are humanoids most easily recognized by their square features and boar-like tusks that protrude from their lower jaw. Tusks come in various sizes, and though they extend from the mouth, they aren't used for consuming food. Instead, many orcs choose to decorate their tusks with significant ornamentation. Orcs typically live for 125 years, and unless altered, their tusks continue to grow throughout the course of their lives.",
    heightRange: '5 to 6½ feet',
    lifespan: '125 years',
    physicalCharacteristics: [
      'Square features',
      'Boar-like tusks from lower jaw',
      'Pointed ears',
      'Muscular build',
      'Green, blue, pink, or gray skin and hair tones',
      'Tusks grow throughout life',
      'Tusks often decorated',
    ],
    primaryFeature: {
      name: 'Sturdy',
      description:
        'When you have 1 Hit Point remaining, attacks against you have disadvantage.',
      type: 'primary',
    },
    secondaryFeature: {
      name: 'Tusks',
      description:
        'When you succeed on an attack against a target within Melee range, you can spend a Hope to gore the target with your tusks, dealing an extra 1d6 damage.',
      type: 'secondary',
    },
  },
  {
    name: 'Ribbet',
    description:
      'Ribbets resemble anthropomorphic frogs with protruding eyes and webbed hands and feet. They have smooth (though sometimes warty) moist skin and eyes positioned on either side of their head. Some ribbets have hind legs more than twice the length of their torso, while others have short limbs. No matter their size, ribbets primarily move by hopping.',
    heightRange: '3 to 4½ feet',
    lifespan: 'Approximately 100 years',
    physicalCharacteristics: [
      'Anthropomorphic frogs',
      'Protruding eyes on sides of head',
      'Webbed hands and feet',
      'Smooth, sometimes warty moist skin',
      'Variable leg lengths',
      'Movement primarily by hopping',
      'Born from eggs, hatch as tadpoles',
    ],
    primaryFeature: {
      name: 'Amphibious',
      description: 'You can breathe and move naturally underwater.',
      type: 'primary',
    },
    secondaryFeature: {
      name: 'Long Tongue',
      description:
        'You can use your long tongue to grab onto things within Close range. Mark a Stress to use your tongue as a Finesse Close weapon that deals d12 physical damage using your Proficiency.',
      type: 'secondary',
    },
  },
  {
    name: 'Simiah',
    description:
      'Simiah resemble anthropomorphic monkeys and apes with long limbs and prehensile feet. While their appearance reflects all simian creatures, from the largest gorilla to the smallest marmoset, their size does not align with their animal counterparts, and they can be anywhere from 2 to 6 feet tall. All simiah can use their dexterous feet for nonverbal communication, work, and combat.',
    heightRange: '2 to 6 feet',
    lifespan: 'About 100 years',
    physicalCharacteristics: [
      'Anthropomorphic monkeys and apes',
      'Long limbs and prehensile feet',
      'Variety reflecting all simian creatures',
      'Dexterous feet for communication and work',
      'Some have prehensile tails',
      'Skilled climbers',
      'Can transition between movement styles',
    ],
    primaryFeature: {
      name: 'Natural Climber',
      description:
        'You have advantage on Agility Rolls that involve balancing and climbing.',
      type: 'primary',
    },
    secondaryFeature: {
      name: 'Nimble',
      description:
        'Gain a permanent +1 bonus to your Evasion at character creation.',
      type: 'secondary',
    },
  },
];
