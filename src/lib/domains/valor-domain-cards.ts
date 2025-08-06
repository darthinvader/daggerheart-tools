import type { DomainCard } from './domain-card.schema';

// Complete Valor domain cards with full details from the SRD
export const VALOR_DOMAIN_CARDS: DomainCard[] = [
  {
    name: 'BARE BONES',
    level: 1,
    domain: 'Valor',
    type: 'Ability',
    recallCost: 0,
    description: `When you choose not to equip armor, you have a base Armor Score of 3 + your Strength and use the following as your base damage thresholds:
• Tier 1: 9/19
• Tier 2: 11/24
• Tier 3: 13/31
• Tier 4: 15/38`,
  },
  {
    name: 'FORCEFUL PUSH',
    level: 1,
    domain: 'Valor',
    type: 'Ability',
    recallCost: 0,
    description: `Make an attack with your primary weapon against a target within Melee range. On a success, you deal damage and knock them back to Close range. On a success with Hope, add a d6 to your damage roll.

Additionally, you can spend a Hope to make them temporarily Vulnerable.`,
  },
  {
    name: 'I AM YOUR SHIELD',
    level: 1,
    domain: 'Valor',
    type: 'Ability',
    recallCost: 1,
    description: `When an ally within Very Close range would take damage, you can mark a Stress to stand in the way and make yourself the target of the attack instead. When you take damage from this attack, you can mark any number of Armor Slots.`,
  },
  {
    name: 'BODY BASHER',
    level: 2,
    domain: 'Valor',
    type: 'Ability',
    recallCost: 1,
    description: `You use the full force of your body in a fight. On a successful attack using a weapon with a Melee range, gain a bonus to your damage roll equal to your Strength.`,
  },
  {
    name: 'BOLD PRESENCE',
    level: 2,
    domain: 'Valor',
    type: 'Ability',
    recallCost: 0,
    description: `When you make a Presence Roll, you can spend a Hope to add your Strength to the roll.

Additionally, once per rest when you would gain a condition, you can describe how your bold presence aids you in the situation and avoid gaining the condition.`,
  },
  {
    name: 'CRITICAL INSPIRATION',
    level: 3,
    domain: 'Valor',
    type: 'Ability',
    recallCost: 1,
    description: `Once per rest, when you critically succeed on an attack, all allies within Very Close range can clear a Stress or gain a Hope.`,
  },
  {
    name: 'LEAN ON ME',
    level: 3,
    domain: 'Valor',
    type: 'Ability',
    recallCost: 1,
    description: `Once per long rest, when you console or inspire an ally who failed an action roll, you can both clear 2 Stress.`,
  },
  {
    name: 'GOAD THEM ON',
    level: 4,
    domain: 'Valor',
    type: 'Ability',
    recallCost: 1,
    description: `Describe how you taunt a target within Close range, then make a Presence Roll against them. On a success, the target must mark a Stress, and the next time the GM spotlights them, they must target you with an attack, which they make with disadvantage.`,
  },
  {
    name: 'SUPPORT TANK',
    level: 4,
    domain: 'Valor',
    type: 'Ability',
    recallCost: 2,
    description: `When an ally within Close range fails a roll, you can spend 2 Hope to allow them to reroll either their Hope or Fear Die.`,
  },
  {
    name: 'ARMORER',
    level: 5,
    domain: 'Valor',
    type: 'Ability',
    recallCost: 1,
    description: `While you're wearing armor, gain a +1 bonus to your Armor Score.

During a rest, when you choose to repair your armor as a downtime move, your allies also clear an Armor Slot.`,
  },
  {
    name: 'ROUSING STRIKE',
    level: 5,
    domain: 'Valor',
    type: 'Ability',
    recallCost: 1,
    description: `Once per rest, when you critically succeed on an attack, you and all allies who can see or hear you can clear a Hit Point or 1d4 Stress.`,
  },
  {
    name: 'INEVITABLE',
    level: 6,
    domain: 'Valor',
    type: 'Ability',
    recallCost: 1,
    description: `When you fail an action roll, your next action roll has advantage.`,
  },
  {
    name: 'RISE UP',
    level: 6,
    domain: 'Valor',
    type: 'Ability',
    recallCost: 2,
    description: `Gain a bonus to your Severe threshold equal to your Proficiency.

When you mark 1 or more Hit Points from an attack, clear a Stress.`,
  },
  {
    name: 'SHRUG IT OFF',
    level: 7,
    domain: 'Valor',
    type: 'Ability',
    recallCost: 1,
    description: `When you would take damage, you can mark a Stress to reduce the severity of the damage by one threshold. When you do, roll a d6. On a result of 3 or lower, place this card in your vault.`,
  },
  {
    name: 'VALOR-TOUCHED',
    level: 7,
    domain: 'Valor',
    type: 'Ability',
    recallCost: 1,
    description: `When 4 or more of the domain cards in your loadout are from the Valor domain, gain the following benefits:
• +1 bonus to your Armor Score
• When you mark 1 or more Hit Points without marking an Armor Slot, clear an Armor Slot.`,
  },
  {
    name: 'FULL SURGE',
    level: 8,
    domain: 'Valor',
    type: 'Ability',
    recallCost: 1,
    description: `Once per long rest, mark 3 Stress to push your body to its limits. Gain a +2 bonus to all of your character traits until your next rest.`,
  },
  {
    name: 'GROUND POUND',
    level: 8,
    domain: 'Valor',
    type: 'Ability',
    recallCost: 2,
    description: `Spend 2 Hope to strike the ground where you stand and make a Strength Roll against all targets within Very Close range. Targets you succeed against are thrown back to Far range and must make a Reaction Roll (17). Targets who fail take 4d10+8 damage. Targets who succeed take half damage.`,
  },
  {
    name: 'HOLD THE LINE',
    level: 9,
    domain: 'Valor',
    type: 'Ability',
    recallCost: 1,
    description: `Describe the defensive stance you take and spend a Hope. If an adversary moves within Very Close range, they're pulled into Melee range and Restrained. This condition lasts until you move or fail a roll with Fear, or the GM spends 2 Fear on their turn to clear it.`,
  },
  {
    name: 'LEAD BY EXAMPLE',
    level: 9,
    domain: 'Valor',
    type: 'Ability',
    recallCost: 3,
    description: `When you deal damage to an adversary, you can mark a Stress and describe how you encourage your allies. The next PC to make an attack against that adversary can clear a Stress or gain a Hope.`,
  },
  {
    name: 'UNBREAKABLE',
    level: 10,
    domain: 'Valor',
    type: 'Ability',
    recallCost: 4,
    description: `When you mark your last Hit Point, instead of making a death move, you can roll a d6 and clear a number of Hit Points equal to the result. Then place this card in your vault.`,
  },
  {
    name: 'UNYIELDING ARMOR',
    level: 10,
    domain: 'Valor',
    type: 'Ability',
    recallCost: 1,
    description: `When you would mark an Armor Slot, roll a number of d6s equal to your Proficiency. If any roll a 6, reduce the severity by one threshold without marking an Armor Slot.`,
  },
];

// Export just the names for backward compatibility
export const VALOR_DOMAIN_CARD_NAMES = VALOR_DOMAIN_CARDS.map(
  card => card.name
);

export type ValorDomainCardName = (typeof VALOR_DOMAIN_CARD_NAMES)[number];
