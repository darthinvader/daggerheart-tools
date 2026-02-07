import type { DomainCard } from '../../schemas/domains';

// Codex Domain Cards — complete SRD-accurate data

export const BOOK_OF_AVA: DomainCard = {
  name: 'BOOK OF AVA',
  domain: 'Codex',
  level: 1,
  type: 'Grimoire',
  recallCost: 2,
  description: `Power Push: Make a Spellcast Roll against a target within Melee range. On a success, they're knocked back to Far range and take d10+2 magic damage using your Proficiency.

Tava's Armor: Spend a Hope to give a target you can touch a +1 bonus to their Armor Score until their next rest or you cast Tava's Armor again.

Ice Spike: Make a Spellcast Roll (12) to summon a large ice spike within Far range. If you use it as a weapon, make the Spellcast Roll against the target's Difficulty instead. On a success, deal d6 physical damage using your Proficiency.`,
};

export const BOOK_OF_ILLIAT: DomainCard = {
  name: 'BOOK OF ILLIAT',
  domain: 'Codex',
  level: 1,
  type: 'Grimoire',
  recallCost: 2,
  description: `Slumber: Make a Spellcast Roll against a target within Very Close range. On a success, they're Asleep until they take damage or the GM spends a Fear on their turn to clear this condition.

Arcane Barrage: Once per rest, spend any number of Hope and shoot magical projectiles that strike a target of your choice within Close range. Roll a number of d6s equal to the Hope spent and deal that much magic damage to the target.

Telepathy: Spend a Hope to open a line of mental communication with one target you can see. This connection lasts until your next rest or you cast Telepathy again.`,
};

export const BOOK_OF_TYFAR: DomainCard = {
  name: 'BOOK OF TYFAR',
  domain: 'Codex',
  level: 1,
  type: 'Grimoire',
  recallCost: 2,
  description: `Wild Flame: Make a Spellcast Roll against up to three adversaries within Melee range. Targets you succeed against take 2d6 magic damage and must mark a Stress as flames erupt from your hand.

Magic Hand: You conjure a magical hand with the same size and strength as your own within Far range.

Mysterious Mist: Make a Spellcast Roll (13) to cast a temporary thick fog that gathers in a stationary area within Very Close range. The fog heavily obscures this area and everything in it.`,
};

export const BOOK_OF_SITIL: DomainCard = {
  name: 'BOOK OF SITIL',
  domain: 'Codex',
  level: 2,
  type: 'Grimoire',
  recallCost: 2,
  description: `Adjust Appearance: You magically shift your appearance and clothing to avoid recognition.

Parallela: Spend 2 Hope to cast this spell on yourself or an ally within Close range. The next time the target makes an attack, they can hit an additional target within range that their attack roll would succeed against. You can only hold this spell on one creature at a time.

Illusion: Make a Spellcast Roll (14). On a success, create a temporary visual illusion no larger than you within Close range that lasts for as long as you look at it. It holds up to scrutiny until an observer is within Melee range.`,
};

export const BOOK_OF_VAGRAS: DomainCard = {
  name: 'BOOK OF VAGRAS',
  domain: 'Codex',
  level: 2,
  type: 'Grimoire',
  recallCost: 2,
  description: `Runic Lock: Make a Spellcast Roll (15) on an object you're touching that can close (such as a lock, chest, or box). Once per rest on a success, you can lock the object so it can only be opened by creatures of your choice. Someone with access to magic and an hour of time to study the spell can break it.

Arcane Door: When you have no adversaries within Melee range, make a Spellcast Roll (13). On a success, spend a Hope to create a portal from where you are to a point within Far range you can see. It closes once a creature has passed through it.

Reveal: Make a Spellcast Roll. If there is anything magically hidden within Close range, it is revealed.`,
};

export const BOOK_OF_KORVAX: DomainCard = {
  name: 'BOOK OF KORVAX',
  domain: 'Codex',
  level: 3,
  type: 'Grimoire',
  recallCost: 2,
  description: `Levitation: Make a Spellcast Roll to temporarily lift a target you can see up into the air and move them within Close range of their original position.

Recant: Spend a Hope to force a target within Melee range to make a Reaction Roll (15). On a failure, they forget the last minute of your conversation.

Rune Circle: Mark a Stress to create a temporary magical circle on the ground where you stand. All adversaries within Melee range, or who enter Melee range, take 2d12+4 magic damage and are knocked back to Very Close range.`,
};

export const BOOK_OF_NORAI: DomainCard = {
  name: 'BOOK OF NORAI',
  domain: 'Codex',
  level: 3,
  type: 'Grimoire',
  recallCost: 2,
  description: `Mystic Tether: Make a Spellcast Roll against a target within Far range. On a success, they're temporarily Restrained and must mark a Stress. If you target a flying creature, this spell grounds and temporarily Restrains them.

Fireball: Make a Spellcast Roll against a target within Very Far range. On a success, hurl a sphere of fire toward them that explodes on impact. The target and all creatures within Very Close range of them must make a Reaction Roll (13). Targets who fail take d20+5 magic damage using your Proficiency. Targets who succeed take half damage.`,
};

export const BOOK_OF_EXOTA: DomainCard = {
  name: 'BOOK OF EXOTA',
  domain: 'Codex',
  level: 4,
  type: 'Grimoire',
  recallCost: 3,
  description: `Repudiate: You can interrupt a magical effect taking place. Make a reaction roll using your Spellcast trait. Once per rest on a success, the effect stops and any consequences are avoided.

Create Construct: Spend a Hope to choose a group of objects around you and create an animated construct from them that obeys basic commands. Make a Spellcast Roll to command them to take action. When necessary, they share your Evasion and traits and their attacks deal 2d10+3 physical damage. You can only maintain one construct at a time, and they fall apart when they take any amount of damage.`,
};

export const BOOK_OF_GRYNN: DomainCard = {
  name: 'BOOK OF GRYNN',
  domain: 'Codex',
  level: 4,
  type: 'Grimoire',
  recallCost: 2,
  description: `Arcane Deflection: Once per long rest, spend a Hope to negate the damage of an attack targeting you or an ally within Very Close range.

Time Lock: Target an object within Far range. That object stops in time and space exactly where it is until your next rest. If a creature tries to move it, make a Spellcast Roll against them to maintain this spell.

Wall of Flame: Make a Spellcast Roll (15). On a success, create a wall of magical flame between two points within Far range. All creatures in its path must choose a side to be on, and anything that subsequently passes through the wall takes 4d10+3 magic damage.`,
};

export const MANIFEST_WALL: DomainCard = {
  name: 'MANIFEST WALL',
  domain: 'Codex',
  level: 5,
  type: 'Spell',
  recallCost: 2,
  description: `Make a Spellcast Roll (15). Once per rest on a success, spend a Hope to create a temporary magical wall between two points within Far range. It can be up to 50 feet high and form at any angle. Creatures or objects in its path are shunted to a side of your choice. The wall stays up until your next rest or you cast Manifest Wall again.`,
};

export const TELEPORT: DomainCard = {
  name: 'TELEPORT',
  domain: 'Codex',
  level: 5,
  type: 'Spell',
  recallCost: 2,
  description: `Once per long rest, you can instantly teleport yourself and any number of willing targets within Close range to a place you've been before. Choose one of the following options, then make a Spellcast Roll (16):
\u2022 If you know the place very well, gain a +3 bonus.
\u2022 If you've visited the place frequently, gain a +1 bonus.
\u2022 If you've visited the place infrequently, gain no modifier.
\u2022 If you've only been there once, gain a \u22122 penalty.
On a success, you appear where you were intending to go. On a failure, you appear off course, with the range of failure determining how far off course.`,
};

export const BANISH: DomainCard = {
  name: 'BANISH',
  domain: 'Codex',
  level: 6,
  type: 'Spell',
  recallCost: 0,
  description: `Make a Spellcast Roll against a target within Close range. On a success, roll a number of d20s equal to your Spellcast trait. The target must make a reaction roll with a Difficulty equal to your highest result. On a success, the target must mark a Stress but isn't banished. Once per rest on a failure, they are banished from this realm.

When the PCs roll with Fear, the Difficulty gains a \u22121 penalty and the target makes another reaction roll. On a success, they return from banishment.`,
};

export const SIGIL_OF_RETRIBUTION: DomainCard = {
  name: 'SIGIL OF RETRIBUTION',
  domain: 'Codex',
  level: 6,
  type: 'Spell',
  recallCost: 2,
  description: `Mark an adversary within Close range with a sigil of retribution. The GM gains a Fear. When the marked adversary deals damage to you or your allies, place a d8 on this card. You can hold a number of d8s equal to your level. When you successfully attack the marked adversary, roll the dice on this card and add the total to your damage roll, then clear the dice. This effect ends when the marked adversary is defeated or you cast Sigil of Retribution again.`,
};

export const BOOK_OF_HOMET: DomainCard = {
  name: 'BOOK OF HOMET',
  domain: 'Codex',
  level: 7,
  type: 'Grimoire',
  recallCost: 0,
  description: `Pass Through: Make a Spellcast Roll (13). Once per rest on a success, you and all creatures touching you can pass through a wall or door within Close range. The effect ends once everyone is on the other side.

Plane Gate: Make a Spellcast Roll (14). Once per long rest on a success, open a gateway to a location in another dimension or plane of existence you've been to before. This gateway lasts until your next rest.`,
};

export const CODEX_TOUCHED: DomainCard = {
  name: 'CODEX-TOUCHED',
  domain: 'Codex',
  level: 7,
  type: 'Ability',
  recallCost: 2,
  description: `When 4 or more of the domain cards in your loadout are from the Codex domain, gain the following benefits:
\u2022 You can mark a Stress to add your Proficiency to a Spellcast Roll.
\u2022 Once per rest, replace this card with any card from your vault without paying its Recall Cost.`,
  metadata: {
    domainRequirement: {
      domain: 'Codex',
      minCards: 4,
    },
  },
};

export const BOOK_OF_VYOLA: DomainCard = {
  name: 'BOOK OF VYOLA',
  domain: 'Codex',
  level: 8,
  type: 'Grimoire',
  recallCost: 2,
  description: `Memory Delve: Make a Spellcast Roll against a target within Far range. On a success, peer into the target's mind and ask the GM a question. The GM describes any memories the target has pertaining to the answer.

Shared Clarity: Once per long rest, spend a Hope to choose two willing creatures. When one of them would mark Stress, they can choose between the two of them who marks it. This spell lasts until their next rest.`,
};

export const SAFE_HAVEN: DomainCard = {
  name: 'SAFE HAVEN',
  domain: 'Codex',
  level: 8,
  type: 'Spell',
  recallCost: 3,
  description: `When you have a few minutes of calm to focus, you can spend 2 Hope to summon your Safe Haven, a large interdimensional home where you and your allies can take shelter. When you do, a magical door appears somewhere within Close range. Only creatures of your choice can enter. Once inside, you can make the entrance invisible. You and anyone else inside can always exit. Once you leave, the doorway must be summoned again.

When you take a rest within your own Safe Haven, you can choose an additional downtime move.`,
};

export const BOOK_OF_RONIN: DomainCard = {
  name: 'BOOK OF RONIN',
  domain: 'Codex',
  level: 9,
  type: 'Grimoire',
  recallCost: 4,
  description: `Transform: Make a Spellcast Roll (15). On a success, transform into an inanimate object no larger than twice your normal size. You can remain in this shape until you take damage.

Eternal Enervation: Once per long rest, make a Spellcast Roll against a target within Close range. On a success, they become permanently Vulnerable. They can't clear this condition by any means.`,
};

export const DISINTEGRATION_WAVE: DomainCard = {
  name: 'DISINTEGRATION WAVE',
  domain: 'Codex',
  level: 9,
  type: 'Spell',
  recallCost: 4,
  description: `Make a Spellcast Roll (18). Once per long rest on a success, the GM tells you which adversaries within Far range have a Difficulty of 18 or lower. Mark a Stress for each one you wish to hit with this spell. They are killed and can't come back to life by any means.`,
};

export const BOOK_OF_YARROW: DomainCard = {
  name: 'BOOK OF YARROW',
  domain: 'Codex',
  level: 10,
  type: 'Grimoire',
  recallCost: 2,
  description: `Timejammer: Make a Spellcast Roll (18). On a success, time temporarily slows to a halt for everyone within Far range except for you. It resumes the next time you make an action roll that targets another creature.

Magic Immunity: Spend 5 Hope to become immune to magic damage until your next rest.`,
};

export const TRANSCENDENT_UNION: DomainCard = {
  name: 'TRANSCENDENT UNION',
  domain: 'Codex',
  level: 10,
  type: 'Spell',
  recallCost: 1,
  description: `Once per long rest, spend 5 Hope to cast this spell on two or more willing creatures. Until your next rest, when a creature connected by this union would mark Stress or Hit Points, the connected creatures can choose who marks it.`,
};

// Card names for backward compatibility
export const CODEX_DOMAIN_CARD_NAMES = [
  'BOOK OF AVA',
  'BOOK OF ILLIAT',
  'BOOK OF TYFAR',
  'BOOK OF SITIL',
  'BOOK OF VAGRAS',
  'BOOK OF KORVAX',
  'BOOK OF NORAI',
  'BOOK OF EXOTA',
  'BOOK OF GRYNN',
  'MANIFEST WALL',
  'TELEPORT',
  'BANISH',
  'SIGIL OF RETRIBUTION',
  'BOOK OF HOMET',
  'CODEX-TOUCHED',
  'BOOK OF VYOLA',
  'SAFE HAVEN',
  'BOOK OF RONIN',
  'DISINTEGRATION WAVE',
  'BOOK OF YARROW',
  'TRANSCENDENT UNION',
] as const;

export type CodexDomainCardName = (typeof CODEX_DOMAIN_CARD_NAMES)[number];

// Export array for domain card system
export const CODEX_DOMAIN_CARDS: DomainCard[] = [
  BOOK_OF_AVA,
  BOOK_OF_ILLIAT,
  BOOK_OF_TYFAR,
  BOOK_OF_SITIL,
  BOOK_OF_VAGRAS,
  BOOK_OF_KORVAX,
  BOOK_OF_NORAI,
  BOOK_OF_EXOTA,
  BOOK_OF_GRYNN,
  MANIFEST_WALL,
  TELEPORT,
  BANISH,
  SIGIL_OF_RETRIBUTION,
  BOOK_OF_HOMET,
  CODEX_TOUCHED,
  BOOK_OF_VYOLA,
  SAFE_HAVEN,
  BOOK_OF_RONIN,
  DISINTEGRATION_WAVE,
  BOOK_OF_YARROW,
  TRANSCENDENT_UNION,
];
