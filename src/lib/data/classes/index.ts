// Combined list for convenience
import { BARD } from './bard';
import { DRUID } from './druid';
import { GUARDIAN } from './guardian';
import { RANGER } from './ranger';
import { ROGUE } from './rogue';
import { SERAPH } from './seraph';
import { SORCERER } from './sorcerer';
import { WARRIOR } from './warrior';
import { WIZARD } from './wizard';

// Aggregated class data exports
// ======================================================================================

export * from './bard';
export * from './druid';
export * from './guardian';
export * from './ranger';
export * from './rogue';
export * from './seraph';
export * from './sorcerer';
export * from './warrior';
export * from './wizard';

export const ALL_CLASSES = [
  BARD,
  DRUID,
  GUARDIAN,
  RANGER,
  ROGUE,
  SERAPH,
  SORCERER,
  WARRIOR,
  WIZARD,
] as const;

export type GameClass = (typeof ALL_CLASSES)[number];
export type GameSubclass = GameClass['subclasses'][number];

// Helper functions for class/subclass lookups
export function getClassByName(name: string): GameClass | undefined {
  return ALL_CLASSES.find(c => c.name.toLowerCase() === name.toLowerCase());
}

export function getSubclassesForClass(className: string): GameSubclass[] {
  const gameClass = getClassByName(className);
  return gameClass ? [...gameClass.subclasses] : [];
}

export function getSubclassByName(
  className: string,
  subclassName: string
): GameSubclass | undefined {
  const subclasses = getSubclassesForClass(className);
  return subclasses.find(
    s => s.name.toLowerCase() === subclassName.toLowerCase()
  );
}

export function getDomainsForClass(className: string): string[] {
  const gameClass = getClassByName(className);
  return gameClass ? [...gameClass.domains] : [];
}

export function getAllClassNames(): string[] {
  return ALL_CLASSES.map(c => c.name);
}

export function getAllSubclassNames(): string[] {
  return ALL_CLASSES.flatMap(c => c.subclasses.map(s => s.name));
}

export function getClassForSubclass(
  subclassName: string
): GameClass | undefined {
  return ALL_CLASSES.find(c =>
    c.subclasses.some(s => s.name.toLowerCase() === subclassName.toLowerCase())
  );
}

export function validateClassName(name: string): boolean {
  return ALL_CLASSES.some(c => c.name.toLowerCase() === name.toLowerCase());
}

export function validateSubclassName(
  className: string,
  subclassName: string
): boolean {
  const subclass = getSubclassByName(className, subclassName);
  return subclass !== undefined;
}
