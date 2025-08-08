import type { DomainCard } from '../../schemas/domains/domain-card.schema';

// Complete Bone domain cards with full details from the SRD
export const BONE_DOMAIN_CARDS: DomainCard[] = [
  {
    name: 'DEFT MANEUVERS',
    level: 1,
    domain: 'Bone',
    type: 'Ability',
    recallCost: 0,
    description: `Once per rest, mark a Stress to sprint anywhere within Far range without making an Agility Roll to get there.

If you end this movement within Melee range of an adversary and immediately make an attack against them, gain a +1 bonus to the attack roll.`,
  },
  {
    name: 'I SEE IT COMING',
    level: 1,
    domain: 'Bone',
    type: 'Ability',
    recallCost: 1,
    description: `When you're targeted by an attack made from beyond Melee range, you can mark a Stress to roll a d4 and gain a bonus to your Evasion equal to the result against the attack.`,
  },
  {
    name: 'UNTOUCHABLE',
    level: 1,
    domain: 'Bone',
    type: 'Ability',
    recallCost: 1,
    description: `Gain a bonus to your Evasion equal to half your Agility.`,
  },
  {
    name: 'FEROCITY',
    level: 2,
    domain: 'Bone',
    type: 'Ability',
    recallCost: 2,
    description: `When you cause an adversary to mark 1 or more Hit Points, you can spend 2 Hope to increase your Evasion by the number of Hit Points they marked. This bonus lasts until after the next attack made against you.`,
  },
  {
    name: 'STRATEGIC APPROACH',
    level: 2,
    domain: 'Bone',
    type: 'Ability',
    recallCost: 1,
    description: `After a long rest, place a number of tokens equal to your Knowledge on this card (minimum 1). The first time you move within Close range of an adversary and make an attack against them, you can spend one token to choose one of the following options:

• You make the attack with advantage.
• You clear a Stress on an ally within Melee range of the adversary.
• You add a d8 to your damage roll.

When you take a long rest, clear all unspent tokens.`,
  },
  {
    name: 'BRACE',
    level: 3,
    domain: 'Bone',
    type: 'Ability',
    recallCost: 1,
    description: `When you mark an Armor Slot to reduce incoming damage, you can mark a Stress to mark an additional Armor Slot.`,
  },
  {
    name: 'TACTICIAN',
    level: 3,
    domain: 'Bone',
    type: 'Ability',
    recallCost: 1,
    description: `When you Help an Ally, they can spend a Hope to add one of your Experiences to their roll alongside your advantage die.

When making a Tag Team Roll, you can roll a d20 as your Hope Die.`,
  },
  {
    name: 'BOOST',
    level: 4,
    domain: 'Bone',
    type: 'Ability',
    recallCost: 1,
    description: `Mark a Stress to boost off a willing ally within Close range, fling yourself into the air, and perform an aerial attack against a target within Far range. You have advantage on the attack, add a d10 to the damage roll, and end your move within Melee range of the target.`,
  },
  {
    name: 'REDIRECT',
    level: 4,
    domain: 'Bone',
    type: 'Ability',
    recallCost: 1,
    description: `When an attack made against you from beyond Melee range fails, roll a number of d6s equal to your Proficiency. If any roll a 6, you can mark a Stress to redirect the attack to damage an adversary within Very Close range instead.`,
  },
  {
    name: 'KNOW THY ENEMY',
    level: 5,
    domain: 'Bone',
    type: 'Ability',
    recallCost: 1,
    description: `When observing a creature, you can make an Instinct Roll against them. On a success, spend a Hope and ask the GM for one set of information about the target from the following options:

• Their unmarked Hit Points and Stress.
• Their Difficulty and damage thresholds.
• Their tactics and standard attack damage dice.
• Their features and Experiences.

Additionally on a success, you can mark a Stress to remove a Fear from the GM's Fear Pool.`,
  },
  {
    name: 'SIGNATURE MOVE',
    level: 5,
    domain: 'Bone',
    type: 'Ability',
    recallCost: 1,
    description: `Name and describe your signature combat move. Once per rest, when you perform this signature move as part of an action you're taking, you can roll a d20 as your Hope Die. On a success, clear a Stress.`,
  },
  {
    name: 'RAPID RIPOSTE',
    level: 6,
    domain: 'Bone',
    type: 'Ability',
    recallCost: 0,
    description: `When an attack made against you from within Melee range fails, you can mark a Stress and seize the opportunity to deal the weapon damage of one of your active weapons to the attacker.`,
  },
  {
    name: 'RECOVERY',
    level: 6,
    domain: 'Bone',
    type: 'Ability',
    recallCost: 1,
    description: `During a short rest, you can choose a long rest downtime move instead. You can spend a Hope to let an ally do the same.`,
  },
  {
    name: 'BONE-TOUCHED',
    level: 7,
    domain: 'Bone',
    type: 'Ability',
    recallCost: 2,
    description: `When 4 or more of the domain cards in your loadout are from the Bone domain, gain the following benefits:

• +1 bonus to Agility
• Once per rest, you can spend 3 Hope to cause an attack that succeeded against you to fail instead.`,
  },
  {
    name: 'CRUEL PRECISION',
    level: 7,
    domain: 'Bone',
    type: 'Ability',
    recallCost: 1,
    description: `When you make a successful attack with a weapon, gain a bonus to your damage roll equal to either your Finesse or Agility.`,
  },
  {
    name: 'BREAKING BLOW',
    level: 8,
    domain: 'Bone',
    type: 'Ability',
    recallCost: 3,
    description: `When you make a successful attack, you can mark a Stress to make the next successful attack against that same target deal an extra 2d12 damage.`,
  },
  {
    name: 'WRANGLE',
    level: 8,
    domain: 'Bone',
    type: 'Ability',
    recallCost: 1,
    description: `Make an Agility Roll against all targets within Close range. Spend a Hope to move targets you succeed against, and any willing allies within Close range, to another point within Close range.`,
  },
  {
    name: 'ON THE BRINK',
    level: 9,
    domain: 'Bone',
    type: 'Ability',
    recallCost: 1,
    description: `When you have 2 or fewer Hit Points unmarked, you don't take Minor damage.`,
  },
  {
    name: 'SPLINTERING STRIKE',
    level: 9,
    domain: 'Bone',
    type: 'Ability',
    recallCost: 3,
    description: `Spend a Hope and make an attack against all adversaries within your weapon's range. Once per long rest, on a success against any targets, add up the damage dealt, then redistribute that damage however you wish between the targets you succeeded against. When you deal damage to a target, roll an additional damage die and add its result to the damage you deal to that target.`,
  },
  {
    name: 'DEATHRUN',
    level: 10,
    domain: 'Bone',
    type: 'Ability',
    recallCost: 1,
    description: `Spend 3 Hope to run a straight path through the battlefield to a point within Far range, making an attack against all adversaries within your weapon's range along that path. Choose the order in which you deal damage to the targets you succeeded against. For the first, roll your weapon damage with a +1 bonus to your Proficiency. Then remove a die from your damage roll and deal the remaining damage to the next target. Continue to remove a die for each subsequent target until you have no more damage dice or adversaries. You can't target the same adversary more than once per attack.`,
  },
  {
    name: 'SWIFT STEP',
    level: 10,
    domain: 'Bone',
    type: 'Ability',
    recallCost: 2,
    description: `When an attack made against you fails, clear a Stress. If you can't clear a Stress, gain a Hope.`,
  },
];

// Export just the names for backward compatibility
export const BONE_DOMAIN_CARD_NAMES = BONE_DOMAIN_CARDS.map(card => card.name);

export type BoneDomainCardName = (typeof BONE_DOMAIN_CARD_NAMES)[number];
