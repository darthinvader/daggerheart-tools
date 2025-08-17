import { type KeyOption, matchSorter, rankings } from 'match-sorter';

type RankKey<T> = keyof T | ((item: T) => string);

export function rankBy<T>(items: T[], query: string, keys: RankKey<T>[]): T[] {
  if (!query.trim()) return items;
  return matchSorter(items, query, {
    keys: keys as unknown as Array<KeyOption<T>>,
  });
}

// Re-export rankings so callers can specify thresholds without importing match-sorter directly
export { rankings };

// Advanced variant mirroring match-sorter's full options we care about (keys + threshold)
export function rankAdvanced<T>(
  items: T[],
  query: string,
  keys: Array<KeyOption<T> | ((item: T) => string) | keyof T>,
  threshold: number = rankings.CONTAINS
): T[] {
  const q = query.trim();
  if (!q) return items;
  // match-sorter types threshold via a union of known ranking constants
  const t = threshold as unknown as (typeof rankings)['CASE_SENSITIVE_EQUAL'];
  return matchSorter(items, q, {
    keys: keys as Array<KeyOption<T>>,
    threshold: t,
  });
}
