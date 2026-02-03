// Shared utilities for computing entity updates/differences

/**
 * Compares two objects and returns only the changed fields.
 * Uses JSON.stringify for arrays/objects, direct comparison for primitives.
 *
 * @param current - The current state of the entity
 * @param base - The base/original state to compare against
 * @param excludeKeys - Keys to always exclude from comparison (like 'id', 'createdAt', etc.)
 * @returns An object containing only the fields that have changed
 */
export function getEntityUpdates<T extends Record<string, unknown>>(
  current: T,
  base: T,
  excludeKeys: ReadonlyArray<keyof T> = []
): Partial<T> {
  const updates: Partial<T> = {};
  const excludeSet = new Set(excludeKeys);

  for (const key of Object.keys(current) as Array<keyof T>) {
    if (excludeSet.has(key)) continue;

    const currentValue = current[key];
    const baseValue = base[key];

    // Skip if identical reference
    if (currentValue === baseValue) continue;

    // For arrays and objects, compare by JSON serialization
    if (typeof currentValue === 'object' && currentValue !== null) {
      if (JSON.stringify(currentValue) !== JSON.stringify(baseValue)) {
        updates[key] = currentValue;
      }
    } else if (currentValue !== baseValue) {
      // Primitive comparison
      updates[key] = currentValue;
    }
  }

  return updates;
}

/** Standard keys to exclude when computing entity updates */
export const ENTITY_SYSTEM_KEYS = ['id', 'createdAt', 'updatedAt'] as const;
