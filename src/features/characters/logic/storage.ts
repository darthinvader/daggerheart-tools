type Section =
  | 'identity'
  | 'resources'
  | 'traits'
  | 'class'
  | 'domains'
  | 'equipment';

const VERSION = 'v1';

export function storageKey(section: Section, id: string) {
  return `dh:characters:${id}:${section}:${VERSION}`;
}

export function loadJSON<T>(key: string): T | undefined {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return undefined;
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

export function saveJSON<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
