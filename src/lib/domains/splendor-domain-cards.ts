import type { DomainCard } from './domain-card.schema';

// Complete Splendor domain cards with full details from the SRD
export const SPLENDOR_DOMAIN_CARDS: DomainCard[] = [
  {
    name: 'BOLT BEACON',
    level: 1,
    domain: 'Splendor',
    type: 'Spell',
    recallCost: 1,
    description: `Make a Spellcast Roll against a target within Far range. On a success, spend a Hope to send a bolt of shimmering light toward them, dealing d8+2 magic damage using your Proficiency. The target becomes temporarily Vulnerable and glows brightly until this condition is cleared.`,
  },
  {
    name: 'MENDING TOUCH',
    level: 1,
    domain: 'Splendor',
    type: 'Spell',
    recallCost: 1,
    description: `You lay your hands upon a creature and channel healing magic to close their wounds. When you can take a few minutes to focus on the target you're helping, you can spend 2 Hope to clear a Hit Point or a Stress on them.

Once per long rest, when you spend this healing time learning something new about them or revealing something about yourself, you can clear 2 Hit Points or 2 Stress on them instead.`,
  },
  {
    name: 'REASSURANCE',
    level: 1,
    domain: 'Splendor',
    type: 'Ability',
    recallCost: 0,
    description: `Once per rest, after an ally attempts an action roll but before the consequences take place, you can offer assistance or words of support. When you do, your ally can reroll their dice.`,
  },
  {
    name: 'FINAL WORDS',
    level: 2,
    domain: 'Splendor',
    type: 'Spell',
    recallCost: 1,
    description: `You can infuse a corpse with a moment of life to speak with it. Make a Spellcast Roll (13). On a success with Hope, the corpse answers up to three questions. On a success with Fear, the corpse answers one question. The corpse answers truthfully, but it can't impart information it didn't know in life. On a failure, or once the corpse has finished answering your questions, the body turns to dust.`,
  },
  {
    name: 'HEALING HANDS',
    level: 2,
    domain: 'Splendor',
    type: 'Spell',
    recallCost: 1,
    description: `Make a Spellcast Roll (13) and target a creature other than yourself within Melee range. On a success, mark a Stress to clear 2 Hit Points or 2 Stress on the target. On a failure, mark a Stress to clear a Hit Point or a Stress on the target. You can't heal the same target again until your next long rest.`,
  },
  {
    name: 'SECOND WIND',
    level: 3,
    domain: 'Splendor',
    type: 'Ability',
    recallCost: 2,
    description: `Once per rest, when you succeed on an attack against an adversary, you can clear 3 Stress or a Hit Point. On a success with Hope, you also clear 3 Stress or a Hit Point on an ally within Close range of you.`,
  },
  {
    name: 'VOICE OF REASON',
    level: 3,
    domain: 'Splendor',
    type: 'Ability',
    recallCost: 1,
    description: `You speak with an unmatched power and authority. You have advantage on action rolls to de-escalate violent situations or convince someone to follow your lead.

Additionally, you're emboldened in moments of duress. When all of your Stress slots are marked, you gain a +1 bonus to your Proficiency for damage rolls.`,
  },
  {
    name: 'DIVINATION',
    level: 4,
    domain: 'Splendor',
    type: 'Spell',
    recallCost: 1,
    description: `Once per long rest, spend 3 Hope to reach out to the forces beyond and ask one "yes or no" question about an event, person, place, or situation in the near future. For a moment, the present falls away and you see the answer before you.`,
  },
  {
    name: 'LIFE WARD',
    level: 4,
    domain: 'Splendor',
    type: 'Spell',
    recallCost: 1,
    description: `Spend 3 Hope and choose an ally within Close range. They are marked with a glowing sigil of protection. When this ally would make a death move, they clear a Hit Point instead.

This effect ends when it saves the target from a death move, you cast Life Ward on another target, or you take a long rest.`,
  },
  {
    name: 'SHAPE MATERIAL',
    level: 5,
    domain: 'Splendor',
    type: 'Spell',
    recallCost: 1,
    description: `Spend a Hope to shape a section of natural material you're touching (such as stone, ice, or wood) to suit your purpose. The area of the material can be no larger than you. For example, you can form a rudimentary tool or create a door.

You can only affect the material within Close range of where you're touching it.`,
  },
  {
    name: 'SMITE',
    level: 5,
    domain: 'Splendor',
    type: 'Spell',
    recallCost: 2,
    description: `Once per rest, spend 3 Hope to charge your powerful smite. When you next successfully attack with a weapon, double the result of your damage roll. This attack deals magic damage regardless of the weapon's damage type.`,
  },
  {
    name: 'RESTORATION',
    level: 6,
    domain: 'Splendor',
    type: 'Spell',
    recallCost: 2,
    description: `After a long rest, place a number of tokens equal to your Spellcast trait on this card. Touch a creature and spend any number of tokens to clear 2 Hit Points or 2 Stress for each token spent.

You can also spend a token from this card when touching a creature to clear the Vulnerable condition or heal a physical or magical ailment (the GM might require additional tokens depending on the strength of the ailment).

When you take a long rest, clear all unspent tokens.`,
  },
  {
    name: 'ZONE OF PROTECTION',
    level: 6,
    domain: 'Splendor',
    type: 'Spell',
    recallCost: 2,
    description: `Make a Spellcast Roll (16). Once per long rest on a success, choose a point within Far range and create a visible zone of protection there for all allies within Very Close range of that point. When you do, place a d6 on this card with the 1 value facing up. When an ally in this zone takes damage, they reduce it by the die's value. You then increase the die's value by one. When the die's value would exceed 6, this effect ends.`,
  },
  {
    name: 'HEALING STRIKE',
    level: 7,
    domain: 'Splendor',
    type: 'Spell',
    recallCost: 1,
    description: `When you deal damage to an adversary, you can spend 2 Hope to clear a Hit Point on an ally within Close range.`,
  },
  {
    name: 'SPLENDOR-TOUCHED',
    level: 7,
    domain: 'Splendor',
    type: 'Ability',
    recallCost: 2,
    description: `When 4 or more of the domain cards in your loadout are from the Splendor domain, gain the following benefits:
• +3 bonus to your Severe damage threshold
• Once per long rest, when incoming damage would require you to mark a number of Hit Points, you can choose to mark that much Stress or spend that much Hope instead.`,
  },
  {
    name: 'SHIELD AURA',
    level: 8,
    domain: 'Splendor',
    type: 'Spell',
    recallCost: 2,
    description: `Mark a Stress to cast a protective aura on a target within Very Close range. When the target marks an Armor Slot, they reduce the severity of the attack by an additional threshold. If this spell causes a creature who would be damaged to instead mark no Hit Points, the effect ends.

You can only hold Shield Aura on one creature at a time.`,
  },
  {
    name: 'STUNNING SUNLIGHT',
    level: 8,
    domain: 'Splendor',
    type: 'Spell',
    recallCost: 2,
    description: `Make a Spellcast Roll to unleash powerful rays of burning sunlight against all adversaries in front of you within Far range. On a success, spend any number of Hope and force that many targets you succeeded against to make a Reaction Roll (14).

Targets who succeed take 3d20+3 magic damage. Targets who fail take 4d20+5 magic damage and are temporarily Stunned. While Stunned, they can't use reactions and can't take any other actions until they clear this condition.`,
  },
  {
    name: 'OVERWHELMING AURA',
    level: 9,
    domain: 'Splendor',
    type: 'Spell',
    recallCost: 2,
    description: `Make a Spellcast Roll (15) to magically empower your aura. On a success, spend 2 Hope to make your Presence equal to your Spellcast trait until your next long rest.

While this spell is active, an adversary must mark a Stress when they target you with an attack.`,
  },
  {
    name: 'SALVATION BEAM',
    level: 9,
    domain: 'Splendor',
    type: 'Spell',
    recallCost: 2,
    description: `Make a Spellcast Roll (16). On a success, mark any number of Stress to target a line of allies within Far range. You can clear Hit Points on the targets equal to the number of Stress marked, divided among them however you'd like.`,
  },
  {
    name: 'INVIGORATION',
    level: 10,
    domain: 'Splendor',
    type: 'Spell',
    recallCost: 3,
    description: `When you or an ally within Close range has used a feature that has an exhaustion limit (such as once per rest or once per session), you can spend any number of Hope and roll that many d6s. If any roll a 6, the feature can be used again.`,
  },
  {
    name: 'RESURRECTION',
    level: 10,
    domain: 'Splendor',
    type: 'Spell',
    recallCost: 2,
    description: `Make a Spellcast Roll (20). On a success, restore one creature who has been dead no longer than 100 years to full strength. Then roll a d6. On a result of 5 or lower, place this card in your vault permanently.

On a failure, you can't cast Resurrection again for a week.`,
  },
];

// Export just the card names for backward compatibility
export const SPLENDOR_DOMAIN_CARD_NAMES = SPLENDOR_DOMAIN_CARDS.map(
  card => card.name
);

export type SplendorDomainCardName =
  (typeof SPLENDOR_DOMAIN_CARD_NAMES)[number];
