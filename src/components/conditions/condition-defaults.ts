/**
 * Default styling and descriptions for built-in Daggerheart conditions.
 * Shared across all condition displays (detailed, quick view, etc.)
 * so every condition badge gets consistent icon, color, and tooltip.
 */

export interface ConditionDefaults {
  icon?: string;
  color?: string;
  description?: string;
}

export const DEFAULT_CONDITION_STYLE: Record<string, ConditionDefaults> = {
  // Core SRD conditions
  Hidden: {
    icon: 'Eye',
    color: '#22c55e',
    description: 'Cannot be targeted; attack from hidden has advantage',
  },
  Restrained: {
    icon: 'Ban',
    color: '#f97316',
    description: 'Cannot move; attacks against have advantage',
  },
  Vulnerable: {
    icon: 'AlertTriangle',
    color: '#ef4444',
    description: 'Attacks against deal +1d6 damage',
  },
  Cloaked: {
    icon: 'Moon',
    color: '#a855f7',
    description: 'Heavily obscured; attacks against have disadvantage',
  },

  // Common status effects
  Bleeding: {
    icon: 'Heart',
    color: '#ef4444',
    description: 'Take damage at the start of each turn',
  },
  Blinded: {
    icon: 'Eye',
    color: '#6b7280',
    description: 'Cannot see; attacks have disadvantage',
  },
  Burning: {
    icon: 'Flame',
    color: '#f97316',
    description: 'Take fire damage at the start of each turn',
  },
  Charmed: {
    icon: 'Star',
    color: '#ec4899',
    description: 'Cannot attack the source; social rolls affected',
  },
  Cursed: {
    icon: 'Skull',
    color: '#a855f7',
    description: 'Suffers a persistent magical affliction',
  },
  Dazed: {
    icon: 'Zap',
    color: '#eab308',
    description: 'Disadvantage on rolls until end of next turn',
  },
  Frightened: {
    icon: 'AlertTriangle',
    color: '#eab308',
    description: 'Disadvantage on rolls against source of fear',
  },
  Frozen: {
    icon: 'Snowflake',
    color: '#06b6d4',
    description: 'Speed reduced; may be unable to act',
  },
  Poisoned: {
    icon: 'CloudRain',
    color: '#22c55e',
    description: 'Disadvantage on attack rolls and ability checks',
  },
  Prone: {
    icon: 'Target',
    color: '#6b7280',
    description: 'Disadvantage on ranged attacks; stand up costs movement',
  },
  Slowed: {
    icon: 'Clock',
    color: '#3b82f6',
    description: 'Can only move within Close range on your turn',
  },
  Stunned: {
    icon: 'Zap',
    color: '#eab308',
    description: 'Cannot take actions or move until end of next turn',
  },
  Weakened: {
    icon: 'Shield',
    color: '#ef4444',
    description: 'Disadvantage on attack rolls',
  },
  Exhausted: {
    icon: 'Wind',
    color: '#6b7280',
    description: 'Disadvantage on all rolls; reduced movement',
  },
  Paralyzed: {
    icon: 'Ban',
    color: '#a855f7',
    description: 'Cannot move or take actions; attacks against auto-hit',
  },
  Silenced: {
    icon: 'Ban',
    color: '#3b82f6',
    description: 'Cannot speak or cast spells with verbal components',
  },
  Incapacitated: {
    icon: 'Skull',
    color: '#ef4444',
    description: 'Cannot take actions or reactions',
  },
  Deafened: {
    icon: 'Ban',
    color: '#6b7280',
    description: 'Cannot hear; may affect awareness rolls',
  },
  Dizzied: {
    icon: 'Zap',
    color: '#eab308',
    description: 'Disoriented; disadvantage on Finesse and Agility rolls',
  },
  Entranced: {
    icon: 'Star',
    color: '#a855f7',
    description: 'Fixated on a target; cannot act until snapped out',
  },
  Horrified: {
    icon: 'Skull',
    color: '#a855f7',
    description: 'Overwhelmed by dread; disadvantage on all rolls',
  },
  Invisible: {
    icon: 'Eye',
    color: '#06b6d4',
    description: 'Cannot be seen; attacks against have disadvantage',
  },
  Petrified: {
    icon: 'Shield',
    color: '#6b7280',
    description: 'Turned to stone; cannot act, immune to most damage',
  },
  Glowing: {
    icon: 'Sun',
    color: '#eab308',
    description: 'Emits light; cannot hide, visible in darkness',
  },
};
