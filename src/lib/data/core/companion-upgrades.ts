export const COMPANION_UPGRADES = {
  INTELLIGENT: {
    name: 'Intelligent',
    description: 'Your companion can speak and understand complex instructions',
    benefit: 'Can communicate verbally and follow complex multi-step plans',
  },
  LIGHT_IN_THE_DARK: {
    name: 'Light in the Dark',
    description: 'Your companion provides comfort and hope in dire situations',
    benefit:
      'Once per rest, your companion can grant you or an ally within Close range a Hope',
  },
  CREATURE_COMFORT: {
    name: 'Creature Comfort',
    description: 'Your companion has a soothing presence that aids recovery',
    benefit:
      'When you rest, you and allies within Close range of your companion clear an additional Stress',
  },
  ARMORED: {
    name: 'Armored',
    description: 'Your companion has natural or worn armor protection',
    benefit: 'Your companion gains +2 to their damage thresholds',
  },
  VICIOUS: {
    name: 'Vicious',
    description: 'Your companion fights with enhanced ferocity',
    benefit: 'Your companion gains +1 bonus to damage rolls',
  },
  RESILIENT: {
    name: 'Resilient',
    description: 'Your companion has enhanced stamina and fortitude',
    benefit: 'Your companion gains +1 Hit Point and +1 Stress',
  },
  BONDED: {
    name: 'Bonded',
    description: 'The connection between you and your companion deepens',
    benefit:
      'When you spend Hope to help your companion or vice versa, roll a d8 instead of d6',
  },
  AWARE: {
    name: 'Aware',
    description: 'Your companion has heightened senses and alertness',
    benefit:
      'Your companion gains advantage on Instinct rolls and can act as a lookout',
  },
} as const;
