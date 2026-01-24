export interface RulesTag {
  label: string;
  description: string;
  tone?: 'info' | 'warning' | 'success';
}

export interface RuleSection {
  id: string;
  title: string;
  iconKey: string;
  summary: string;
  bullets: string[];
  details?: string[];
  mechanics?: string[];
  math?: string[];
  examples?: string[];
  tips?: string[];
  cautions?: string[];
  tags?: RulesTag[];
}

export interface RulesPage {
  id: string;
  title: string;
  iconKey: string;
  description: string;
  gradient: string;
  quickFacts?: Array<{ label: string; value: string; tooltip?: string }>;
  sections: RuleSection[];
}

export interface RulesIndexCard {
  to: string;
  title: string;
  description: string;
  iconKey: string;
  gradient: string;
  accent: string;
  tint: string;
}

export const RULES_INDEX_CARDS: RulesIndexCard[] = [
  {
    to: '/rules/character-creation',
    title: 'Character Creation',
    description:
      'Step-by-step flow for building heroes: class, heritage, traits, and starting gear.',
    iconKey: 'characterCreation',
    gradient: 'from-pink-500 to-rose-600',
    accent: 'text-pink-600 dark:text-pink-400',
    tint: 'bg-pink-500/10',
  },
  {
    to: '/rules/core-mechanics',
    title: 'Core Mechanics',
    description:
      'Spotlight, moves, Duality Dice, Hope/Fear, and the action roll loop.',
    iconKey: 'rolling',
    gradient: 'from-indigo-500 to-violet-600',
    accent: 'text-indigo-600 dark:text-indigo-400',
    tint: 'bg-indigo-500/10',
  },
  {
    to: '/rules/combat',
    title: 'Combat & Consequences',
    description:
      'Narrative combat flow, damage, thresholds, conditions, and death moves.',
    iconKey: 'combat',
    gradient: 'from-amber-500 to-orange-600',
    accent: 'text-amber-600 dark:text-amber-400',
    tint: 'bg-amber-500/10',
  },
  {
    to: '/rules/downtime-advancement',
    title: 'Downtime & Advancement',
    description:
      'Healing, recovery, leveling up, and how gear and gold fit in.',
    iconKey: 'camping',
    gradient: 'from-emerald-500 to-teal-600',
    accent: 'text-emerald-600 dark:text-emerald-400',
    tint: 'bg-emerald-500/10',
  },
  {
    to: '/rules/gm-guide',
    title: 'GM Guide',
    description:
      'Principles, best practices, pitfalls, and Fear economy guidance.',
    iconKey: 'navigation',
    gradient: 'from-sky-500 to-cyan-600',
    accent: 'text-sky-600 dark:text-sky-400',
    tint: 'bg-sky-500/10',
  },
  {
    to: '/rules/adversaries-environments',
    title: 'Adversaries & Environments',
    description: 'Stat blocks, roles, features, and encounter building points.',
    iconKey: 'adversaries',
    gradient: 'from-red-500 to-rose-600',
    accent: 'text-red-600 dark:text-red-400',
    tint: 'bg-red-500/10',
  },
  {
    to: '/rules/campaign-frames',
    title: 'Campaign Frames',
    description:
      'Start a campaign with frames, complexity ratings, and session zero tools.',
    iconKey: 'worldbuilding',
    gradient: 'from-violet-500 to-fuchsia-600',
    accent: 'text-violet-600 dark:text-violet-400',
    tint: 'bg-violet-500/10',
  },
];

export const RULES_PAGES: Record<string, RulesPage> = {
  'character-creation': {
    id: 'character-creation',
    title: 'Character Creation',
    iconKey: 'characterCreation',
    description:
      'Build a hero by collaborating on tone, choosing a class and heritage, and setting your starting kit.',
    gradient: 'from-pink-500 via-rose-500 to-orange-500',
    quickFacts: [
      {
        label: 'Start at Level',
        value: '1',
        tooltip:
          'Most campaigns begin at level 1 unless your table agrees otherwise.',
      },
      {
        label: 'Trait Modifiers',
        value: '+2, +1, +1, 0, 0, −1',
        tooltip:
          'Distribute these across the six traits at character creation.',
      },
      {
        label: 'Stress',
        value: '6',
        tooltip: 'All classes begin with 6 Stress slots.',
      },
    ],
    sections: [
      {
        id: 'session-zero',
        title: 'Session Zero & Concept',
        iconKey: 'socialContract',
        summary:
          'Agree on tone, safety tools, and party goals before finalizing characters.',
        bullets: [
          'Discuss the campaign premise and what everyone wants from play.',
          'Share character concepts early so roles and connections can mesh.',
          'Use safety tools to set boundaries and table expectations.',
        ],
        details: [
          'Confirm scheduling, session length, and how the group handles absences.',
          'Create initial bonds or shared history so the party starts connected.',
          'Align on tone (heroic, gritty, whimsical) and how dark themes are handled.',
        ],
        mechanics: [
          'Session zero is where optional rules and campaign frames are chosen.',
          'Establish what “rulings over rules” means for your table.',
          'Agree on how to resolve disputes: pause, discuss, move on.',
        ],
        examples: [
          '“We want a heroic tone with occasional horror, and no graphic torture.”',
          '“We’re okay with character death, but want clear warnings.”',
        ],
        tips: [
          'Bring one bold idea and one flexible backup so the party can align quickly.',
        ],
      },
      {
        id: 'class-subclass',
        title: 'Choose Class & Subclass',
        iconKey: 'safetyTools',
        summary:
          'Class defines your core role; subclass sharpens the fantasy and mechanics.',
        bullets: [
          'Pick the class that fits how you want to solve problems and fight.',
          'Select a subclass for a focused playstyle within that class.',
          'Record your class features from the character sheet.',
        ],
        details: [
          'Subclass choices often grant a foundation card or defining ability.',
          'Spellcasting and other special traits are tied to class/subclass choices.',
          'Class features are always on unless they specify costs or limits.',
        ],
        mechanics: [
          'Some subclasses grant a Spellcast trait or similar roll option.',
          'Class features can require Hope/Stress or trigger on roll outcomes.',
        ],
        examples: [
          'A guardian might start with an Evasion value and a frontline feature.',
          'A wizard subclass may grant a signature spellcasting technique.',
        ],
        tags: [
          {
            label: 'Class Feature',
            description: 'Always-on abilities unique to your class.',
          },
          {
            label: 'Subclass',
            description: 'Specialization that unlocks unique moves and flavor.',
          },
        ],
      },
      {
        id: 'heritage',
        title: 'Heritage: Ancestry & Community',
        iconKey: 'worldInfo',
        summary:
          'Heritage blends lineage and upbringing to shape your character’s identity.',
        bullets: [
          'Choose an ancestry for physical traits and two unique features.',
          'Choose a community that sets your culture, values, and a feature.',
          'Record both under Heritage on your sheet.',
        ],
        details: [
          'Languages are assumed to be shared unless your table decides otherwise.',
          'Heritage should inform relationships, goals, and how you view the world.',
          'Flavor is flexible as long as mechanics remain unchanged.',
        ],
        mechanics: [
          'Ancestry and community features can grant rerolls, bonuses, or traits.',
          'Community often shapes roleplay hooks and starting contacts.',
        ],
        tips: [
          'Let ancestry and community inform your looks, voice, and social ties.',
        ],
      },
      {
        id: 'traits',
        title: 'Assign Traits',
        iconKey: 'coreStats',
        summary:
          'Traits drive action rolls for Agility, Strength, Finesse, Instinct, Presence, and Knowledge.',
        bullets: [
          'Distribute the starting modifiers across six traits.',
          'Consider weapon choice and spellcasting when assigning bonuses.',
          'Negative modifiers count as negative values for effects.',
        ],
        details: [
          'Trait lists include verbs to inspire what actions fit each trait.',
          'If a rule uses a trait value to place tokens, negative values usually place 0.',
          'Rearranging traits later is possible if the table agrees.',
        ],
        math: ['Starting modifiers: +2, +1, +1, 0, 0, −1 across six traits.'],
        tags: [
          {
            label: 'Trait Roll',
            description: 'Action roll that uses a specific trait modifier.',
          },
        ],
      },
      {
        id: 'vitals',
        title: 'Vitals: Evasion, HP, Stress',
        iconKey: 'hitPoints',
        summary:
          'Record survivability stats tied to your class and armor choices.',
        bullets: [
          'Evasion sets the Difficulty for adversary attacks against you.',
          'HP tracks harm; thresholds determine how many HP you mark.',
          'Stress tracks strain and fuels abilities.',
        ],
        details: [
          'Evasion is set by class and modified by gear, domains, or conditions.',
          'If you must mark Stress with no slots left, mark 1 HP instead.',
          'Filling Stress makes you Vulnerable until you clear at least 1 Stress.',
        ],
        mechanics: [
          'Adversaries roll against your Evasion to hit you.',
          'Thresholds come from armor and increase by level.',
        ],
        math: [
          'Damage thresholds: Minor < Major, Major ≤ damage < Severe, Severe ≤ damage.',
        ],
        tags: [
          {
            label: 'Evasion',
            description: 'Target number an adversary must meet to hit you.',
          },
          {
            label: 'Thresholds',
            description: 'Minor/Major/Severe damage thresholds from armor.',
          },
        ],
      },
      {
        id: 'starting-gear',
        title: 'Starting Equipment',
        iconKey: 'inventory',
        summary:
          'Choose weapons, armor, and items that define your early playstyle.',
        bullets: [
          'Pick a two-handed primary weapon or a one-handed primary + secondary.',
          'Equip one armor set to reduce incoming damage.',
          'Record Proficiency, damage dice, and armor slots.',
        ],
        details: [
          'Proficiency starts at 1, so your damage dice begin as 1dX + modifier.',
          'Armor slots can be spent to reduce incoming damage each time you’re hit.',
          'Starting weapons are typically Tier 1 options.',
        ],
        mechanics: [
          'Weapons list damage dice, range, and burden/traits.',
          'Armor provides thresholds and slots used to reduce damage.',
        ],
        tips: ['Flavor gear freely as long as the mechanics stay the same.'],
      },
    ],
  },
  'core-mechanics': {
    id: 'core-mechanics',
    title: 'Core Mechanics',
    iconKey: 'rolling',
    description:
      'Learn the spotlight loop, Duality Dice, Hope/Fear, and how action rolls resolve.',
    gradient: 'from-indigo-500 via-violet-500 to-fuchsia-500',
    quickFacts: [
      {
        label: 'Duality Dice',
        value: '2d12',
        tooltip: 'One Hope die and one Fear die rolled together.',
      },
      {
        label: 'Hope Cap',
        value: '6',
        tooltip: 'You can hold up to 6 Hope at a time.',
      },
      {
        label: 'Critical Success',
        value: 'Doubles',
        tooltip: 'Matching dice count as a critical success.',
      },
    ],
    sections: [
      {
        id: 'flow',
        title: 'Flow of the Game',
        iconKey: 'actionTokens',
        summary: 'A fast conversation loop drives every scene.',
        bullets: [
          'GM narrates the situation and stakes.',
          'Players and GM ask questions and clarify details.',
          'Choose a move, roll if the outcome is uncertain.',
          'Resolve the outcome and repeat as the scene changes.',
        ],
        details: [
          'If the action is trivial or impossible, no roll is needed—just narrate.',
          'Every roll should change the situation in some meaningful way.',
          'The fiction leads; mechanics step in only when outcomes are uncertain.',
        ],
        mechanics: [
          'GM can answer questions directly or call for a roll when uncertain.',
          'Players can influence details by answering GM questions.',
        ],
        examples: [
          '“Give me an Agility roll, Difficulty 11, because it’s raining.”',
        ],
      },
      {
        id: 'spotlight',
        title: 'The Spotlight & Moves',
        iconKey: 'experiences',
        summary: 'The spotlight shifts to whoever is acting in the fiction.',
        bullets: [
          'When you’re in the spotlight, describe your move.',
          'Low-stakes moves can succeed automatically.',
          'High-stakes moves call for an action roll.',
        ],
        details: [
          'There is no fixed initiative order; spotlight moves with the narrative.',
          'Combat uses the same flow as any other scene.',
          'Optional spotlight trackers add structure for tactical tables.',
        ],
        mechanics: [
          'GM moves often trigger after a Fear roll or failed action.',
          'Spotlight can shift to adversaries when Fear is spent.',
        ],
        tags: [
          {
            label: 'Move',
            description: 'Any meaningful action that advances the story.',
          },
          {
            label: 'Spotlight',
            description: 'Focus of the scene—who acts next in the fiction.',
          },
        ],
      },
      {
        id: 'duality',
        title: 'Duality Dice: Hope & Fear',
        iconKey: 'domainCards',
        summary: 'Hope and Fear shape outcomes beyond success or failure.',
        bullets: [
          'Roll 2d12: one Hope die and one Fear die.',
          'Higher Hope means gain Hope even if you fail.',
          'Higher Fear gives the GM a Fear and adds complications.',
        ],
        details: [
          'Critical success (doubles) counts as Hope and clears 1 Stress.',
          'Hope carries between sessions but caps at 6.',
          'Fear is a GM resource used to intensify scenes and adversary actions.',
        ],
        mechanics: [
          'Hope is spent for Help an Ally, Experiences, Tag Team, or Hope Features.',
          'Fear is spent to spotlight adversaries or power fear moves/features.',
        ],
        tips: ['Use Hope often; it fuels powerful abilities and teamwork.'],
        tags: [
          {
            label: 'Hope',
            description:
              'Player resource gained on Hope rolls and spent for boosts.',
            tone: 'success',
          },
          {
            label: 'Fear',
            description: 'GM resource gained on Fear rolls and spent on moves.',
            tone: 'warning',
          },
        ],
      },
      {
        id: 'action-rolls',
        title: 'Action Rolls',
        iconKey: 'hopeAndFear',
        summary: 'Four-step resolution keeps rolls fast and clear.',
        bullets: [
          'Pick the trait and Difficulty with the GM.',
          'Add modifiers, advantages, and experiences.',
          'Roll and total the dice, then call Hope or Fear.',
          'Resolve outcome and narrate consequences.',
        ],
        details: [
          'Advantage and disadvantage dice stack; take the highest result.',
          'Experiences add a flat bonus when relevant to the action.',
          'Difficulty can be public or hidden, based on table preference.',
        ],
        mechanics: [
          'Use character tokens to track bonus modifiers.',
          'Some features add dice or modify outcomes after the roll.',
        ],
        math: [
          'Action Total = Hope Die + Fear Die + Trait + bonuses + advantage die (if any).',
        ],
        tags: [
          {
            label: 'Difficulty',
            description: 'Target number you must meet or beat.',
          },
        ],
      },
      {
        id: 'hope-uses',
        title: 'Spending Hope',
        iconKey: 'hope',
        summary: 'Hope powers teamwork and signature abilities.',
        bullets: [
          'Help an ally to add an advantage die.',
          'Use Experiences to add their bonus to a roll.',
          'Trigger Hope Features for class-defining power.',
        ],
        details: [
          'Tag Team Rolls combine efforts for scene-defining moments (cost 3 Hope).',
          'Some effects only trigger on a success with Hope.',
          'Hope gained on a roll can be spent immediately on that roll’s effects.',
        ],
        mechanics: [
          'Help an Ally adds a d6 advantage die to their roll.',
          'Using multiple Experiences costs multiple Hope.',
        ],
        math: ['Tag Team cost: 3 Hope. Hope cap: 6.'],
        tips: ['If you roll with Hope, you can often spend it immediately.'],
      },
      {
        id: 'stress-hp',
        title: 'Stress & Thresholds',
        iconKey: 'stress',
        summary:
          'Stress is strain; thresholds determine how much harm you take.',
        bullets: [
          'Stress can be marked to power features or accept consequences.',
          'Damage compares to thresholds to mark 1–3 HP.',
          'At zero HP, make a death move.',
        ],
        details: [
          'Marking your last Stress makes you Vulnerable until you clear 1 Stress.',
          'Major and Severe thresholds come from armor + level.',
          'Optional Massive damage doubles Severe for a 4 HP hit.',
        ],
        mechanics: [
          'If you must mark Stress without slots, mark 1 HP instead.',
          'Downtime clears Stress and HP based on your chosen move.',
        ],
        math: [
          'If damage ≥ Severe threshold → mark 3 HP.',
          'If damage ≥ Major threshold → mark 2 HP.',
          'If damage < Major threshold → mark 1 HP.',
        ],
        cautions: [
          'If you must mark Stress with no slots left, mark 1 HP instead.',
        ],
      },
    ],
  },
  combat: {
    id: 'combat',
    title: 'Combat & Consequences',
    iconKey: 'combat',
    description:
      'Combat is narrative and fluid—spotlight passes through bold actions, not rigid rounds.',
    gradient: 'from-amber-500 via-orange-500 to-rose-500',
    quickFacts: [
      {
        label: 'Initiative',
        value: 'None',
        tooltip: 'Combat follows the spotlight rather than turn order.',
      },
      {
        label: 'Damage',
        value: 'Threshold-based',
        tooltip: 'Damage marks 1–3 HP based on thresholds.',
      },
    ],
    sections: [
      {
        id: 'narrative-combat',
        title: 'Narrative Combat Flow',
        iconKey: 'scenes',
        summary: 'Combat works like any other scene—describe, roll, respond.',
        bullets: [
          'No fixed number of actions per turn.',
          'Spotlight moves based on the fiction and consequences.',
          'GM moves often trigger on Fear or failed rolls.',
        ],
        details: [
          'Fights remain collaborative; players can set up combos and teamwork.',
          'Adversaries may act without dice unless a feature calls for it.',
          'Use narrative cues to keep every character engaged in the scene.',
        ],
        mechanics: [
          'GM can spend Fear to spotlight adversaries out of sequence.',
          'Combat ends when the story goal is resolved, not only when foes fall.',
        ],
      },
      {
        id: 'attacks',
        title: 'Attacks & Damage Rolls',
        iconKey: 'weapons',
        summary: 'Attack rolls set whether damage is dealt.',
        bullets: [
          'Make an attack roll against a target’s Difficulty or Evasion.',
          'On a hit, roll weapon or spell damage dice.',
          'Critical successes add extra damage and clear 1 Stress.',
        ],
        details: [
          'Damage dice are based on your weapon/spell and Proficiency.',
          'Physical vs magic damage can matter for resistances or features.',
          'Some abilities modify attacks after the roll result is known.',
        ],
        mechanics: [
          'Adversaries use Difficulty instead of Evasion.',
          'Attacks can target groups in Very Close range with one roll.',
        ],
        math: ['Damage roll = weapon/spell dice + modifiers (per feature).'],
      },
      {
        id: 'armor-thresholds',
        title: 'Armor & Thresholds',
        iconKey: 'thresholds',
        summary: 'Armor mitigates damage through thresholds and armor slots.',
        bullets: [
          'Compare damage to Minor/Major/Severe thresholds.',
          'Spend armor slots to reduce incoming damage.',
          'Higher level increases your thresholds.',
        ],
        details: [
          'If damage is reduced to 0 or less, you mark no HP.',
          'Armor slots can run out, requiring repairs during downtime.',
          'Thresholds reflect survivability, not “hit chance.”',
        ],
        mechanics: [
          'Armor slots are spent after damage is known to reduce severity.',
          'Armor thresholds increase by your current level.',
        ],
        tags: [
          {
            label: 'Armor Slot',
            description: 'Spend to reduce damage as armor absorbs the hit.',
          },
        ],
      },
      {
        id: 'conditions',
        title: 'Conditions & Vulnerable',
        iconKey: 'conditions',
        summary: 'Conditions add narrative and mechanical pressure.',
        bullets: [
          'Conditions change how you act or how others act against you.',
          'When you fill Stress, you become Vulnerable until cleared.',
          'Many conditions end when fictionally resolved.',
        ],
        details: [
          'Conditions should align with the story (poisoned, burning, pinned, etc.).',
          'Use conditions to spotlight tradeoffs rather than punish players.',
          'Some conditions are cleared by downtime or specific moves.',
        ],
        mechanics: [
          'Vulnerable typically means certain threats hit harder or trigger worse outcomes.',
        ],
      },
      {
        id: 'range-targets',
        title: 'Range, Targets, & Groups',
        iconKey: 'distances',
        summary: 'Ranges are narrative distances; groups can be hit together.',
        bullets: [
          'Ranges: Melee, Very Close, Close, Far, Very Far.',
          'A group within Very Close can be targeted with one roll.',
          'Cover, sight, and darkness change risk and Difficulty.',
        ],
        details: [
          'Ranges are flexible descriptions, not grid squares.',
          'Targets can be objects if the fiction supports it.',
          'Use terrain to drive dramatic choices and movement.',
        ],
        mechanics: [
          'Single-target vs group targeting changes how many rolls are needed.',
        ],
      },
      {
        id: 'death',
        title: 'Death & Last Moves',
        iconKey: 'death',
        summary: 'Reaching 0 HP triggers a death move that shapes the story.',
        bullets: [
          'When your last HP is marked, make a death move.',
          'Some moves let you return at a cost or in a changed form.',
          'Death is story-forward, not a “game over.”',
        ],
        details: [
          'Death moves give the player narrative agency in a final moment.',
          'The GM should telegraph lethal consequences before they happen.',
          'Fictional logic can override mechanics when it makes sense.',
        ],
        mechanics: [
          'A death move is triggered the moment your final HP is marked.',
        ],
        cautions: [
          'Some narrative outcomes can bypass death moves if the fiction demands it.',
        ],
      },
    ],
  },
  'downtime-advancement': {
    id: 'downtime-advancement',
    title: 'Downtime & Advancement',
    iconKey: 'camping',
    description:
      'Recover between scenes, clear stress, and grow your character over time.',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    sections: [
      {
        id: 'downtime',
        title: 'Downtime Moves',
        iconKey: 'longRest',
        summary: 'Downtime restores resources and advances personal goals.',
        bullets: [
          'Clear marked HP and Stress based on your downtime move.',
          'Repair armor and reset limited-use abilities.',
          'Use downtime to pursue bonds and long-term projects.',
        ],
        details: [
          'Downtime can be brief scenes or montages between big moments.',
          'Some features refresh on a short rest, others on a long rest.',
          'Narrative actions in downtime can shift relationships and stakes.',
        ],
        mechanics: [
          'Short rest: light recovery and limited refreshes.',
          'Long rest: full recovery and more significant reset points.',
        ],
      },
      {
        id: 'leveling',
        title: 'Leveling Up',
        iconKey: 'levelUp',
        summary: 'Leveling unlocks new cards, traits, and survivability.',
        bullets: [
          'Increase level and gain new domain cards or features.',
          'Choose improvements: traits, HP, Stress, or thresholds.',
          'Adjust gear and loadout to match your new strengths.',
        ],
        details: [
          'Higher level increases armor thresholds for tougher characters.',
          'New domain cards expand tactical and narrative options.',
          'Growth should reflect the story arcs you’re living through.',
        ],
        mechanics: [
          'Some classes gain features or upgrades at specific levels.',
        ],
      },
      {
        id: 'equipment-gold',
        title: 'Equipment & Gold',
        iconKey: 'gold',
        summary: 'Gold and loot fuel new tools and narrative rewards.',
        bullets: [
          'Use gold for gear upgrades or narrative investments.',
          'Loot can be shared, traded, or used to influence the story.',
          'Equipment tiers scale with level for bigger impact.',
        ],
        details: [
          'Loot is often a story reward, not only a power boost.',
          'Trade and crafting can be handled as downtime scenes.',
          'The GM can tailor rewards to match the party’s goals.',
        ],
        mechanics: ['Tiered gear adds higher damage or stronger features.'],
      },
      {
        id: 'optional',
        title: 'Optional Rules',
        iconKey: 'crafting',
        summary: 'Table options let you tune risk and pacing.',
        bullets: [
          'Massive damage can add a higher damage threshold.',
          'Spotlight trackers can add turn structure if desired.',
        ],
        details: [
          'Optional rules should be agreed on during session zero.',
          'If a rule adds friction, consider dropping or simplifying it.',
        ],
        mechanics: ['Massive damage typically equals double Severe threshold.'],
        tips: [
          'Use optional rules only if they improve the fun at your table.',
        ],
      },
    ],
  },
  'gm-guide': {
    id: 'gm-guide',
    title: 'GM Guide',
    iconKey: 'navigation',
    description:
      'Principles and practices for running cinematic, player-driven adventures.',
    gradient: 'from-sky-500 via-cyan-500 to-emerald-500',
    sections: [
      {
        id: 'gm-principles',
        title: 'GM Principles',
        iconKey: 'domainCards',
        summary: 'Guiding truths for every ruling and scene.',
        bullets: [
          'Begin and end with the fiction.',
          'Collaborate and ask questions.',
          'Make every roll meaningful.',
          'Play to find out what happens.',
        ],
        details: [
          'Rulings over rules: prioritize what makes sense in the story.',
          'Hold on gently—adjust the fiction as you learn what works.',
          'Fill the world with life, wonder, and danger.',
        ],
        mechanics: [
          'Use rolls to resolve uncertainty, not to gate obvious facts.',
        ],
      },
      {
        id: 'best-practices',
        title: 'Best Practices',
        iconKey: 'features',
        summary: 'Concrete habits that keep play moving.',
        bullets: [
          'Keep the story moving forward (fail forward).',
          'Cut to action when momentum lags.',
          'Tell players what their characters would know.',
          'Ground NPCs in motives.',
        ],
        details: [
          'Bring mechanics to life with strong narrative framing.',
          'Reframe ideas instead of rejecting them outright.',
          'Use moments and montages to control pacing.',
        ],
        mechanics: [
          'Use Fear to escalate tension, then let PCs recover momentum.',
        ],
      },
      {
        id: 'pitfalls',
        title: 'Pitfalls to Avoid',
        iconKey: 'hazards',
        summary: 'Common friction points and how to dodge them.',
        bullets: [
          'Avoid undermining heroes; they are competent.',
          'Don’t force one solution; invite creative approaches.',
          'Prevent scene drag by reframing or cutting ahead.',
        ],
        details: [
          'Avoid overplanning—prepare situations, not scripts.',
          'Don’t hoard Fear; spending it drives dramatic tension.',
          'Be clear when a roll is or isn’t required.',
        ],
        cautions: ['Hoarding Fear can stall tension—spend it to drive scenes.'],
      },
      {
        id: 'fear-economy',
        title: 'Fear Economy & GM Moves',
        iconKey: 'environments',
        summary: 'Fear fuels adversity and dramatic momentum.',
        bullets: [
          'Gain Fear when players roll with Fear or during downtime.',
          'Spend Fear to spotlight adversaries and trigger Fear moves.',
          'Use consequences to shift the spotlight and raise stakes.',
        ],
        details: [
          'Fear can power adversary Experiences and special actions.',
          'Big scenes often start with more Fear to spike tension.',
          'Consequences should be clear and fictionally grounded.',
        ],
        mechanics: [
          'Fear is a shared GM pool; spend it to spotlight or trigger features.',
        ],
        tags: [
          {
            label: 'Fear Pool',
            description: 'GM resource used to power threats and complications.',
            tone: 'warning',
          },
        ],
      },
      {
        id: 'session-zero',
        title: 'Session Zero & Safety',
        iconKey: 'adversaryDesign',
        summary: 'Set expectations and support player trust.',
        bullets: [
          'Use safety tools and check-ins during play.',
          'Align on tone, themes, and boundaries early.',
          'Invite players to co-author parts of the world.',
        ],
        details: [
          'Revisit boundaries if the campaign tone changes.',
          'Use questions to give players narrative authority.',
          'Trust grows when you follow through on table promises.',
        ],
      },
    ],
  },
  'adversaries-environments': {
    id: 'adversaries-environments',
    title: 'Adversaries & Environments',
    iconKey: 'adversaries',
    description:
      'Stat blocks define enemies and hazards with roles, features, and tactics.',
    gradient: 'from-red-500 via-rose-500 to-amber-500',
    sections: [
      {
        id: 'stat-blocks',
        title: 'Stat Block Breakdown',
        iconKey: 'statBlocks',
        summary: 'Every adversary block is a quick play kit.',
        bullets: [
          'Tier indicates intended PC level range.',
          'Difficulty replaces Evasion for rolls against them.',
          'HP, Stress, and thresholds work like PCs.',
          'Attack line shows modifier, range, and damage.',
        ],
        details: [
          'Name, description, and motives guide roleplay and tactics.',
          'Experiences can raise Difficulty or modify adversary rolls.',
          'Features list actions, reactions, and passives.',
        ],
        mechanics: [
          'Adversaries use Difficulty instead of Evasion.',
          'Experience bonuses cost Fear to apply to rolls.',
        ],
      },
      {
        id: 'roles',
        title: 'Adversary Roles',
        iconKey: 'roleplay',
        summary: 'Roles describe how adversaries behave in fights.',
        bullets: [
          'Bruiser, Horde, Leader, Minion, Ranged, Skulk, Social, Solo, Standard, Support.',
          'Mix roles to create dynamic encounter pacing.',
        ],
        details: [
          'Bruisers soak damage; Solos anchor big fights.',
          'Leaders and Supports change battlefield momentum.',
          'Social adversaries create conflict through conversation.',
        ],
      },
      {
        id: 'features',
        title: 'Features: Actions, Reactions, Passives',
        iconKey: 'domainCards',
        summary: 'Features are the heart of an adversary’s toolkit.',
        bullets: [
          'Actions require spotlight; reactions trigger off events.',
          'Passives are always on or trigger automatically.',
          'Some features cost Stress or Fear to activate.',
        ],
        details: [
          'Spotlight features can chain multiple adversaries in a turn.',
          'Some stat blocks use tokens to track special effects.',
          'Use features to showcase the adversary’s identity and threats.',
        ],
        mechanics: [
          'Reactions trigger immediately without spending Fear unless noted.',
          'Passives apply automatically when their conditions are met.',
        ],
      },
      {
        id: 'fear-features',
        title: 'Fear Features',
        iconKey: 'encounterDesign',
        summary: 'Scene-defining moves paid for with Fear.',
        bullets: [
          'Spend Fear for big area effects or reinforcements.',
          'Use these to swing momentum in climactic moments.',
        ],
        details: [
          'Fear features can be actions, reactions, or passives.',
          'Use them when you want the scene to pivot dramatically.',
        ],
      },
      {
        id: 'battle-points',
        title: 'Battle Points',
        iconKey: 'scaling',
        summary: 'A quick budgeting method for balanced encounters.',
        bullets: [
          'Base points: (3 × number of PCs) + 2.',
          'Spend points by role to build the encounter.',
          'Adjust up or down for desired difficulty.',
        ],
        details: [
          'Add points for lower-tier adversaries to balance the field.',
          'Subtract points if adding bonus damage to speed the fight.',
          'Avoid over-stacking solos unless you reduce the budget.',
        ],
        math: ['Battle Points = (3 × PC count) + 2.'],
        tips: ['Don’t count summoned adversaries against the point total.'],
      },
    ],
  },
  'campaign-frames': {
    id: 'campaign-frames',
    title: 'Campaign Frames',
    iconKey: 'worldbuilding',
    description:
      'Use frames to launch a campaign with shared tone, themes, and mechanics.',
    gradient: 'from-violet-500 via-fuchsia-500 to-pink-500',
    sections: [
      {
        id: 'what-is',
        title: 'What Is a Campaign Frame?',
        iconKey: 'lore',
        summary: 'A frame is a structured starter kit for a full campaign.',
        bullets: [
          'Provides pitch, tone, themes, and touchstones.',
          'Includes background, principles, and an inciting incident.',
          'May add custom mechanics or setting distinctions.',
        ],
        details: [
          'Frames include guidance for ancestries, communities, and classes.',
          'Use the frame to align expectations before characters are built.',
          'Treat frames as flexible inspirations, not rigid scripts.',
        ],
      },
      {
        id: 'complexity',
        title: 'Complexity Rating',
        iconKey: 'settings',
        summary: 'Higher complexity frames need more GM prep.',
        bullets: [
          'Lower complexity stays close to core Daggerheart play.',
          'Higher complexity may require custom rules or content.',
        ],
        details: [
          'Choose a rating that fits your GM comfort level and time.',
          'Complex frames often introduce new mechanics or tone shifts.',
        ],
      },
      {
        id: 'using-frame',
        title: 'Using a Frame',
        iconKey: 'conditions',
        summary: 'Follow the shared steps to align the table.',
        bullets: [
          'Pitch the campaign to the players.',
          'Provide foundations and principles.',
          'Guide character creation and relationships.',
          'Build the map together and run session zero.',
          'Launch with the inciting incident.',
        ],
        details: [
          'Share distinctions and special mechanics before play begins.',
          'Use touchstones to align tone and expectations quickly.',
          'Let players add locations and factions to the campaign map.',
        ],
      },
      {
        id: 'session-zero',
        title: 'Session Zero Questions',
        iconKey: 'communication',
        summary: 'Questions sharpen themes and set expectations.',
        bullets: [
          'Use frame questions to seed bonds and motivations.',
          'Invite players to add setting details.',
          'Confirm boundaries and desired tone.',
        ],
        details: [
          'Questions can be revisited as characters evolve.',
          'Use answers to build NPCs, factions, and plot hooks.',
        ],
      },
    ],
  },
};
