import { del, get, keys, set } from 'idb-keyval';

export const idb = {
  async get<T>(key: string): Promise<T | undefined> {
    return get<T>(key);
  },
  async set<T>(key: string, value: T): Promise<void> {
    await set(key, value);
  },
  async del(key: string): Promise<void> {
    await del(key);
  },
  async keys(): Promise<string[]> {
    return (await keys()).map(String);
  },
};
