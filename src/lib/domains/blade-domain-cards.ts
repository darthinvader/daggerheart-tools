import type { DomainCard } from './domain-card.schema';

// Complete Blade domain cards with full details from the SRD
export const BLADE_DOMAIN_CARDS: DomainCard[] = [
  {
    name: 'GET BACK UP',
    level: 1,
    domain: 'Blade',
    type: 'Ability',
    recallCost: 1,
    description: `When you take Severe damage, you can mark a Stress to reduce the severity by one threshold.`,
  },
  {
    name: 'NOT GOOD ENOUGH',
    level: 1,
    domain: 'Blade',
    type: 'Ability',
    recallCost: 1,
    description: `When you roll your damage dice, you can reroll any 1s or 2s.`,
  },
  {
    name: 'WHIRLWIND',
    level: 1,
    domain: 'Blade',
    type: 'Ability',
    recallCost: 0,
    description: `When you make a successful attack against a target within Very Close range, you can spend a Hope to use the attack against all other targets within Very Close range. All additional adversaries you succeed against with this ability take half damage.`,
  },
  {
    name: "A SOLDIER'S BOND",
    level: 2,
    domain: 'Blade',
    type: 'Ability',
    recallCost: 1,
    description: `Once per long rest, when you compliment someone or ask them about something they're good at, you can both gain 3 Hope.`,
  },
  {
    name: 'RECKLESS',
    level: 2,
    domain: 'Blade',
    type: 'Ability',
    recallCost: 1,
    description: `Mark a Stress to gain advantage on an attack.`,
  },
  {
    name: 'SCRAMBLE',
    level: 3,
    domain: 'Blade',
    type: 'Ability',
    recallCost: 1,
    description: `Once per rest, when a creature within Melee range would deal damage to you, you can avoid the attack and safely move out of Melee range of the enemy.`,
  },
  {
    name: 'VERSATILE FIGHTER',
    level: 3,
    domain: 'Blade',
    type: 'Ability',
    recallCost: 1,
    description: `You can use a different character trait for an equipped weapon, rather than the trait the weapon calls for.

When you deal damage, you can mark a Stress to use the maximum result of one of your damage dice instead of rolling it.`,
  },
  {
    name: 'DEADLY FOCUS',
    level: 4,
    domain: 'Blade',
    type: 'Ability',
    recallCost: 2,
    description: `Once per rest, you can apply all your focus toward a target of your choice. Until you attack another creature, you defeat the target, or the battle ends, gain a +1 bonus to your Proficiency.`,
  },
  {
    name: 'FORTIFIED ARMOR',
    level: 4,
    domain: 'Blade',
    type: 'Ability',
    recallCost: 0,
    description: `While you are wearing armor, gain a +2 bonus to your damage thresholds.`,
  },
  {
    name: "CHAMPION'S EDGE",
    level: 5,
    domain: 'Blade',
    type: 'Ability',
    recallCost: 1,
    description: `When you critically succeed on an attack, you can spend up to 3 Hope and choose one of the following options for each Hope spent:
• You clear a Hit Point.
• You clear an Armor Slot.
• The target must mark an additional Hit Point.

You can't choose the same option more than once.`,
  },
  {
    name: 'VITALITY',
    level: 5,
    domain: 'Blade',
    type: 'Ability',
    recallCost: 0,
    description: `When you choose this card, permanently gain two of the following benefits:
• One Stress slot
• One Hit Point slot
• +2 bonus to your damage thresholds

Then place this card in your vault permanently.`,
  },
  {
    name: 'BATTLE-HARDENED',
    level: 6,
    domain: 'Blade',
    type: 'Ability',
    recallCost: 2,
    description: `Once per long rest when you would make a Death Move, you can spend a Hope to clear a Hit Point instead.`,
  },
  {
    name: 'RAGE UP',
    level: 6,
    domain: 'Blade',
    type: 'Ability',
    recallCost: 1,
    description: `Before you make an attack, you can mark a Stress to gain a bonus to your damage roll equal to twice your Strength.

You can Rage Up twice per attack.`,
  },
  {
    name: 'BLADE-TOUCHED',
    level: 7,
    domain: 'Blade',
    type: 'Ability',
    recallCost: 1,
    description: `When 4 or more of the domain cards in your loadout are from the Blade domain, gain the following benefits:
• +2 bonus to your attack rolls
• +4 bonus to your Severe damage threshold`,
  },
  {
    name: 'GLANCING BLOW',
    level: 7,
    domain: 'Blade',
    type: 'Ability',
    recallCost: 1,
    description: `When you fail an attack, you can mark a Stress to deal weapon damage using half your Proficiency.`,
  },
  {
    name: 'BATTLE CRY',
    level: 8,
    domain: 'Blade',
    type: 'Ability',
    recallCost: 2,
    description: `Once per long rest, while you're charging into danger, you can muster a rousing call that inspires your allies. All allies who can hear you each clear a Stress and gain a Hope. Additionally, your allies gain advantage on attack rolls until you or an ally rolls a failure with Fear.`,
  },
  {
    name: 'FRENZY',
    level: 8,
    domain: 'Blade',
    type: 'Ability',
    recallCost: 3,
    description: `Once per long rest, you can go into a Frenzy until there are no more adversaries within sight.

While Frenzied, you can't use Armor Slots, and you gain a +10 bonus to your damage rolls and a +8 bonus to your Severe damage threshold.`,
  },
  {
    name: 'GORE AND GLORY',
    level: 9,
    domain: 'Blade',
    type: 'Ability',
    recallCost: 2,
    description: `When you critically succeed on a weapon attack, gain an additional Hope or clear an additional Stress.

Additionally, when you deal enough damage to defeat an enemy, gain a Hope or clear a Stress.`,
  },
  {
    name: "REAPER'S STRIKE",
    level: 9,
    domain: 'Blade',
    type: 'Ability',
    recallCost: 3,
    description: `Once per long rest, spend a Hope to make an attack roll. The GM tells you which targets within range it would succeed against. Choose one of these targets and force them to mark 5 Hit Points.`,
  },
  {
    name: 'BATTLE MONSTER',
    level: 10,
    domain: 'Blade',
    type: 'Ability',
    recallCost: 0,
    description: `When you make a successful attack against an adversary, you can mark 4 Stress to force the target to mark a number of Hit Points equal to the number of Hit Points you currently have marked instead of rolling for damage.`,
  },
  {
    name: 'ONSLAUGHT',
    level: 10,
    domain: 'Blade',
    type: 'Ability',
    recallCost: 3,
    description: `When you successfully make an attack with your weapon, you never deal damage beneath a target's Major damage threshold (the target always marks a minimum of 2 Hit Points).

Additionally, when a creature within your weapon's range deals damage to an ally with an attack that doesn't include you, you can mark a Stress to force them to make a Reaction Roll (15). On a failure, the target must mark a Hit Point.`,
  },
];

// Just the card names for backward compatibility and easy import
export const BLADE_DOMAIN_CARD_NAMES = BLADE_DOMAIN_CARDS.map(
  card => card.name
);
