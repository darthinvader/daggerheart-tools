export const COMPANION_UPGRADES = {
  INTELLIGENT: {
    name: 'Intelligent',
    description:
      'Your companion gains a permanent +1 bonus to a Companion Experience of your choice.',
    benefit: '+1 to a Companion Experience',
  },
  LIGHT_IN_THE_DARK: {
    name: 'Light in the Dark',
    description: 'Use this as an additional Hope slot your character can mark.',
    benefit: 'Additional Hope slot',
  },
  CREATURE_COMFORT: {
    name: 'Creature Comfort',
    description:
      'Once per rest, when you take time during a quiet moment to give your companion love and attention, you can gain a Hope or you can both clear a Stress.',
    benefit: 'Gain a Hope or both clear a Stress',
  },
  ARMORED: {
    name: 'Armored',
    description:
      'When your companion takes damage, you can mark one of your Armor Slots instead of marking one of their Stress.',
    benefit: 'Mark your Armor Slot for companion damage',
  },
  VICIOUS: {
    name: 'Vicious',
    description:
      "Increase your companion's damage dice or range by one step (d6 to d8, Close to Far, etc.).",
    benefit: 'Increase damage dice or range by one step',
  },
  RESILIENT: {
    name: 'Resilient',
    description: 'Your companion gains an additional Stress slot.',
    benefit: 'Additional Stress slot',
  },
  BONDED: {
    name: 'Bonded',
    description:
      'When you mark your last Hit Point, your companion rushes to your side to comfort you. Roll a number of d6s equal to the unmarked Stress slots they have and mark them. If any roll a 6, your companion helps you up. Clear your last Hit Point and return to the scene.',
    benefit: 'Companion rush on last HP, d6s for rescue',
  },
  AWARE: {
    name: 'Aware',
    description: 'Your companion gains a permanent +2 bonus to their Evasion.',
    benefit: '+2 Evasion',
  },
} as const;
