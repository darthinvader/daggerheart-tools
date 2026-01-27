import type { CharacterResources, RestEffects } from './types';

export function rollD6(): number {
  return Math.floor(Math.random() * 6) + 1;
}

export function calculateShortRestEffects(
  resources: CharacterResources,
  hopeSpent: number
): RestEffects {
  // Each Hope spent recovers 1d6 HP
  const hpRecovered = Array.from({ length: hopeSpent }, rollD6).reduce(
    (sum, roll) => sum + roll,
    0
  );

  // Cap recovery at max HP
  const actualHpRecovered = Math.min(
    hpRecovered,
    resources.hp.max - resources.hp.current
  );

  return {
    hopeRecovered: 0,
    stressCleared: 1, // Short rest clears 1 stress
    armorRepaired: 0, // Armor repair requires a roll, handled separately
    hpRecovered: actualHpRecovered,
    downtime: false,
  };
}

export function calculateLongRestEffects(
  resources: CharacterResources
): RestEffects {
  return {
    hopeRecovered: resources.hope.max - resources.hope.current,
    stressCleared: resources.stress.current,
    armorRepaired: resources.armor.max - resources.armor.current,
    hpRecovered: resources.hp.max - resources.hp.current,
    downtime: true,
  };
}

export function applyRestEffects(
  resources: CharacterResources,
  effects: RestEffects
): CharacterResources {
  return {
    hope: {
      ...resources.hope,
      current: Math.min(
        resources.hope.max,
        resources.hope.current + effects.hopeRecovered
      ),
    },
    stress: {
      ...resources.stress,
      current: Math.max(0, resources.stress.current - effects.stressCleared),
    },
    hp: {
      ...resources.hp,
      current: Math.min(
        resources.hp.max,
        resources.hp.current + effects.hpRecovered
      ),
    },
    armor: {
      ...resources.armor,
      current: Math.min(
        resources.armor.max,
        resources.armor.current + effects.armorRepaired
      ),
    },
  };
}

export function formatRestTime(isoString: string | null): string {
  if (!isoString) return 'Never';
  const date = new Date(isoString);
  return date.toLocaleString();
}

export function getTimeSinceRest(isoString: string | null): string {
  if (!isoString) return 'Never rested';
  const then = new Date(isoString).getTime();
  const now = Date.now();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 60) return `${diffMins} minutes ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days ago`;
}

export function tryRepairArmor(roll: number): {
  success: boolean;
  threshold: number;
} {
  const threshold = 10; // Standard difficulty
  return { success: roll >= threshold, threshold };
}
