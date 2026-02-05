/**
 * GM Moves Reference Library
 * Based on Daggerheart Chapter 3 - GM Mechanics (Making Moves section)
 *
 * GM moves span a gradient from softer (warning, opportunity) to harder
 * (direct consequences that change the scene). Use soft moves to give players
 * a chance to react, and hard moves when consequences should be immediate.
 *
 * Soft Moves: Give players information and opportunity to react (warnings)
 * Medium Moves: Increase tension with clear challenges (consequences)
 * Hard Moves: Change the scene immediately and directly (major impact)
 */

export interface GMMove {
  id: string;
  name: string;
  category: 'soft' | 'medium' | 'hard';
  description: string;
  examples?: string[];
}

export const GM_MOVES: GMMove[] = [
  // ============================================
  // SOFT MOVES - Warnings, information, opportunity to react
  // ============================================
  {
    id: 'show-world-reacts',
    name: 'Show How the World Reacts',
    category: 'soft',
    description:
      "Think about how the PC's move has affected the world and narrate that change in a way that creates new opportunities for the PCs to act. At its softest, describe them successfully breaking down a door, then give them a description of the next room and what danger they find there. This is your opportunity to make the world around the PCs feel real and alive.",
    examples: [
      'Describe them successfully breaking down a door, then give them a description of the next room and what danger they find there.',
      "The person they're negotiating with presents an option for compromise.",
      'An enemy they just hit attempts to retreat.',
      'Bystanders scatter and call for guards after a public display of magic.',
    ],
  },
  {
    id: 'ask-question-build-answer',
    name: 'Ask a Question and Build on the Answer',
    category: 'soft',
    description:
      "This is perhaps the most collaborative move - presenting the player with a question, and using their answer as truth to build the scene. Typically utilized when establishing information about a scene or when you're interested in a specific character or player's perspective on the current situation, this move can be a great way to get the whole table involved in worldbuilding during the game.",
    examples: [
      '"What do you see in this city that reminds you of home?"',
      '"What about this place tells you someone else was here before you?"',
      '"What memory does this smell trigger for your character?"',
      '"Who do you recognize in this crowd, and why does seeing them worry you?"',
    ],
  },
  {
    id: 'npc-act-motive',
    name: 'Make an NPC Act in Accordance with Their Motive',
    category: 'soft',
    description:
      "When a scene includes characters other than the PCs, you can spotlight what these NPCs are doing in response to the PCs' actions. You might show a friendly NPC helping the party in a fight, a group of townsfolk taking cover, or an enemy moving positions. Make sure their actions always flow from their motive.",
    examples: [
      'A friendly NPC provides cover fire during a fight.',
      'A group of townsfolk flee toward shelter when combat breaks out.',
      'An enemy commander signals for reinforcements.',
      'A merchant hides their most valuable wares when they sense trouble.',
    ],
  },
  {
    id: 'lean-on-goals',
    name: "Lean on the Character's Goals to Drive Them to Action",
    category: 'soft',
    description:
      "One of the most powerful ways to change a scene as a GM is to introduce something personal to the PCs. If the character is seeking out a specific object or creature, you might reveal where it is and why it's going to be so challenging to get there. Using a PC's desires to drive them forward is a great way to reinforce why this scene matters to them.",
    examples: [
      "Reveal the location of the artifact they seek, but it's in the hands of a powerful enemy.",
      "The person they've been searching for is spotted across the crowded marketplace.",
      'A letter arrives with news about their homeland.',
      'They overhear someone speaking the language of their lost community.',
    ],
  },

  // ============================================
  // MEDIUM MOVES - Consequences, tension, clear challenges
  // ============================================
  {
    id: 'signal-off-screen-threat',
    name: 'Signal an Imminent Off-Screen Threat',
    category: 'medium',
    description:
      'A rustle in the trees, an alarm bell being sounded, the clanging armor of reinforcements headed their way - this move creates a ticking clock for your PCs. They need to get moving now.',
    examples: [
      'A horn sounds in the distance - more enemies are on the way.',
      "The building begins to groan and creak - it won't hold much longer.",
      'They hear the flap of massive wings approaching from the mountains.',
      'Scouts spot dust clouds on the horizon - an army approaches.',
    ],
  },
  {
    id: 'reveal-unwelcome-truth',
    name: 'Reveal an Unwelcome Truth or Unexpected Danger',
    category: 'medium',
    description:
      "This versatile move is usually applicable in any scene - you're simply heightening the drama or tension. Maybe an unexpected person steps out of the shadows, or the characters receive bad news that makes them rethink their plans. A soft version might manifest as moving dangerous foes within striking range; a harder version might have an enemy pinning a PC against the wall, making them Restrained.",
    examples: [
      'A group of dangerous foes moves into striking range of the PCs.',
      'A guard captain appears just when the PCs think they have the upper hand.',
      'The "treasure" they sought turns out to be a trap.',
      'Their trusted contact has been working for the enemy all along.',
    ],
  },
  {
    id: 'force-group-split',
    name: 'Force the Group to Split Up',
    category: 'medium',
    description:
      'Usually the result of an environmental hazard or a trap, splitting up the party can force your players to think differently than they normally would about how to accomplish a task. This move can also make for some fun cutting back and forth between scenes as the two groups work independently before finding a way back to each other.',
    examples: [
      'The bridge collapses, leaving half the party on each side.',
      'A magical barrier separates the spellcasters from the martial characters.',
      'Prison cells slam shut, isolating each character.',
      'A flash flood sweeps some party members downstream.',
    ],
  },
  {
    id: 'mark-stress-consequence',
    name: 'Make a PC Mark Stress as a Consequence',
    category: 'medium',
    description:
      "This move is perfect for a success with Fear when you're not sure what other consequences apply - the PC can get it done, but it's not going to be easy. As a softer move, you can also make this an offer instead - maybe you give them the choice to only make it halfway across and not mark a Stress. When you have a player mark Stress, describe why the circumstance is stressful.",
    examples: [
      'The PC can charge across the battlefield, but they mark a Stress to do it.',
      'They push through the magical barrier, but the strain costs them.',
      'They recall the information, but the memory is painful.',
      'They hold the door, but their muscles scream in protest.',
    ],
  },
  {
    id: 'move-characters-dont-see',
    name: "Make a Move the Characters Don't See",
    category: 'medium',
    description:
      "This move is most useful when you have something happening behind the scenes that you're waiting to reveal. You might start a new countdown or tick down a current one, add more damage dice to an enemy's upcoming damage roll, adjust a narrative situation the PCs have yet to encounter, or create another consequence the players can't foresee. \"Everything is fine... for now.\"",
    examples: [
      'Start a countdown for reinforcements arriving.',
      "The villain receives word of the party's location.",
      'A spy begins following the party.',
      'The curse they thought they dispelled begins reforming.',
      "Tick down a countdown timer the players can see but don't fully understand.",
    ],
  },

  // ============================================
  // HARD MOVES - Major impact, immediate consequences
  // ============================================
  {
    id: 'show-collateral-damage',
    name: 'Show the Collateral Damage',
    category: 'hard',
    description:
      "This is a great move to use when the player tries to do something powerful and there's a consequence. That fireball that missed? Maybe it went wide, struck the side of the mountain, and now they hear rumbling from above. An avalanche is about to swallow them! Whenever a PC does something that significantly impacts the world around them, you can use this move to show them the natural ramifications of that event.",
    examples: [
      'The missed spell ignites the thatched roofs of nearby buildings.',
      'Their battle damages a support pillar and the ceiling begins to crack.',
      'Innocent bystanders are caught in the crossfire.',
      'The explosion destroys the very artifact they were trying to protect.',
    ],
  },
  {
    id: 'clear-temporary-condition',
    name: 'Clear a Temporary Condition or Effect',
    category: 'hard',
    description:
      "If there is a temporary condition or effect on an adversary or environment, you can choose to clear it. When you make this move, lead with the narrative, describing who or what causes the effect to end, then how it changes the PCs' situation. If a PC just started an effect, think twice before ending it - it will be more satisfying if they see it impact the scene first.",
    examples: [
      'The adversary hacks through the vines restraining them.',
      "A hail of arrows interrupts the caster's concentration.",
      'The magical darkness is dispelled by an enemy spellcaster.',
      'The creature shakes off the fear effect and roars with renewed fury.',
    ],
  },
  {
    id: 'shift-environment',
    name: 'Shift the Environment',
    category: 'hard',
    description:
      "You can change the environment the PCs are navigating to raise the stakes. If you're using an environment stat block, you could choose to utilize one of its actions. Otherwise, affect the area surrounding the PCs in a fun and engaging way - maybe the rope bridge they're crossing suddenly snaps, a river sweeps them off their feet, or a building falls toward the PCs after being struck with a spell that missed its target.",
    examples: [
      'The floor gives way beneath them.',
      "An angry crowd packs the marketplace, obscuring the person they're following.",
      'The volcano begins to erupt, raining ash and fire.',
      'The storm intensifies, making ranged attacks nearly impossible.',
    ],
  },
  {
    id: 'spotlight-adversary',
    name: 'Spotlight an Adversary',
    category: 'hard',
    description:
      "Heroes are molded when pitted against adversaries of equal mettle - this move allows your adversaries to act meaningfully in a scene. When you make this move, an adversary can move anywhere within Close range and perform an action. In battle, this often manifests as an attack. But this move isn't limited to violence - an adversary can demonstrate tactics, reveal motives, use one of their actions, or change the scene in an interesting way. You can spend Fear to spotlight additional adversaries during your GM turn.",
    examples: [
      'The adversary moves into Melee range and attacks.',
      'The enemy commander calls for a tactical retreat.',
      'The assassin reveals they were the "friendly" NPC all along.',
      'The creature uses its breath weapon to reshape the battlefield.',
    ],
  },
  {
    id: 'capture-important',
    name: 'Capture Someone or Something Important',
    category: 'hard',
    description:
      "Taking away something the party desperately wants or needs can quickly ratchet up the tension in a scene. You might knock a weapon from a PC's hand, capture a fellow party member or an ally of the group, or steal a powerful object from right under their noses. This move is an exciting, fiction-forward way to advance the story.",
    examples: [
      'An enemy disarms the warrior, sending their sword clattering away.',
      'The villain teleports away with the hostage.',
      'Thieves make off with the magical artifact during the chaos.',
      'A beloved NPC is dragged into the portal before it closes.',
    ],
  },
  {
    id: 'use-backstory-against',
    name: "Use a PC's Backstory Against Them",
    category: 'hard',
    description:
      "Integrating a player's backstory into your move can have a huge impact on the PC and make the story much more personal to them. Maybe someone from their past shows up, a mistake they made long ago catches up with them, or the scene parallels a past experience, giving them the chance to make a different choice. Grounding the move in a character's history ensures their next decisions matter all the more to them.",
    examples: [
      "The bounty hunter who's been tracking them finally catches up.",
      'They recognize the enemy commander as their former mentor.',
      'The village being attacked is where their family lives.',
      'The curse affecting the region was caused by their past actions.',
    ],
  },
  {
    id: 'take-away-opportunity',
    name: 'Take Away an Opportunity Permanently',
    category: 'hard',
    description:
      "When things are dire, sometimes the PCs lose an opportunity they once had. A softer version of this move might be to collapse the party's straightforward pathway through a cave system, forcing them to find another, more treacherous way to escape. A harder version of this move would be to kill a valuable NPC or destroy a powerful object the party desperately needs. These moves can be used to great effect when you want to twist the trajectory of the story in a new direction.",
    examples: [
      'The tunnel collapses, forcing them to find another route.',
      'The informant is assassinated before they can share what they know.',
      'The ship they needed sinks beneath the waves.',
      'The ritual completes and the window to stop it closes forever.',
    ],
  },
];

// Helper function to get moves by category
export function getGMMovesByCategory(category: GMMove['category']): GMMove[] {
  return GM_MOVES.filter(move => move.category === category);
}

// Get a move by its ID
export function getGMMoveById(id: string): GMMove | undefined {
  return GM_MOVES.find(move => move.id === id);
}

// Get all categories with their moves
export function getGMMovesGroupedByCategory(): Record<
  GMMove['category'],
  GMMove[]
> {
  return {
    soft: getGMMovesByCategory('soft'),
    medium: getGMMovesByCategory('medium'),
    hard: getGMMovesByCategory('hard'),
  };
}

// Category metadata for UI display
export const GM_MOVE_CATEGORIES: {
  id: GMMove['category'];
  label: string;
  description: string;
  whenToUse: string;
  color: string;
  badgeColor: string;
}[] = [
  {
    id: 'soft',
    label: 'Soft Moves',
    description:
      'Give players information and opportunity to react. These moves warn, set up tension, or offer chances to respond before consequences happen.',
    whenToUse:
      'Use on failures with Hope, when you want to telegraph danger, or when setting up future complications.',
    color: 'text-emerald-600 dark:text-emerald-400',
    badgeColor:
      'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40',
  },
  {
    id: 'medium',
    label: 'Medium Moves',
    description:
      'Increase tension with clear challenges but allow for reaction. These add pressure and consequences without dramatically changing the scene.',
    whenToUse:
      'Use on successes with Fear or when you want to introduce complications that the players can still address.',
    color: 'text-amber-600 dark:text-amber-400',
    badgeColor:
      'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40',
  },
  {
    id: 'hard',
    label: 'Hard Moves',
    description:
      'Change the scene immediately and directly. These moves have consequences that happen without allowing PCs to intercede.',
    whenToUse:
      'Use on failures with Fear, when the PCs give you a golden opportunity, or during climactic moments.',
    color: 'text-red-600 dark:text-red-400',
    badgeColor:
      'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/40',
  },
];

// Quick reference for when to make GM moves
export const WHEN_TO_MAKE_MOVES = [
  {
    trigger: 'They Roll with Fear on an Action Roll',
    description:
      'If a PC rolls with Fear, play returns to you to make a GM move. Whether their roll failed or succeeded, your move should generally build on the action the player just attempted.',
  },
  {
    trigger: 'They Fail an Action Roll',
    description:
      "When a PC fails an action roll, play returns to you to describe the failure and what comes next. If it's a failure with Fear, consider choosing a harsher consequence.",
  },
  {
    trigger: 'They Do Something That Would Have Consequences',
    description:
      'Sometimes a PC makes a move that, regardless of whether they succeed or fail, has inevitable consequences. You can make a move to reflect that outcome.',
  },
  {
    trigger: 'They Give You a Golden Opportunity',
    description:
      "Sometimes a PC's decision gives you the perfect opportunity for a dramatic move - they move too close to a waiting predator or get distracted while watching for intruders.",
  },
  {
    trigger: 'They Look to You for What Happens Next',
    description:
      "When players aren't sure what to do or reach a lull in the action, they'll look to you. This is usually a sign that you should make a move to keep the story moving.",
  },
];

// Quick reference for resolving action rolls
export const ROLL_RESOLUTION_GUIDE = [
  {
    result: 'Critical Success',
    shorthand: 'Yes, and more!',
    description:
      'They get what they want and a little extra. Gain a Hope and clear a Stress. Let the player describe their success.',
  },
  {
    result: 'Success with Hope',
    shorthand: 'Yes, and...',
    description:
      'They get what they want. Gain a Hope. Let the player describe their success, then show how the world reacts.',
  },
  {
    result: 'Success with Fear',
    shorthand: 'Yes, but...',
    description:
      "They get what they want, but it comes at a cost. GM gains a Fear. Introduce a complication but don't negate their success.",
  },
  {
    result: 'Failure with Hope',
    shorthand: 'No, but...',
    description:
      "Things don't go according to plan, but they gain a Hope. Introduce a minor complication or consequence.",
  },
  {
    result: 'Failure with Fear',
    shorthand: 'No, and...',
    description:
      "It doesn't go well! GM gains a Fear. Introduce a major complication or consequence.",
  },
];
