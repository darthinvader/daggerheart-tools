/**
 * Character utility functions for calculations and game logic
 */
import type { PlayerCharacter } from './schemas/character';

export function calculateEvasion(character: PlayerCharacter): number {
  let evasion = character.evasion;

  if (character.armor) {
    for (const feature of character.armor.features) {
      if (feature === 'Flexible') evasion += 1;
      if (feature === 'Heavy') evasion -= 1;
    }
  }

  return Math.max(0, evasion);
}

export function canUseDeathMove(character: PlayerCharacter): boolean {
  return character.hitPoints.marked === character.hitPoints.maxSlots - 1;
}

export function isStressed(character: PlayerCharacter): boolean {
  return character.stress.marked >= character.stress.maxSlots;
}

export function getCurrentHP(character: PlayerCharacter): number {
  return (
    character.hitPoints.maxSlots -
    character.hitPoints.marked +
    character.hitPoints.temporaryBonus
  );
}
