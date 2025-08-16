import { z } from 'zod';

// Lightweight, typed localStorage helpers with Zod validation support.
export const storage = {
  read<T>(key: string, fallback: T, schema?: z.ZodType<T>): T {
    try {
      const raw = globalThis.localStorage?.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return schema ? schema.parse(parsed) : (parsed as T);
    } catch {
      return fallback;
    }
  },
  write<T>(key: string, value: T) {
    try {
      globalThis.localStorage?.setItem(key, JSON.stringify(value));
    } catch {
      // noop
    }
  },
} as const;

// Centralized per-character storage keys to prevent drift.
export const characterKeys = {
  identity: (id: string) => `dh:characters:${id}:identity:v1`,
  conditions: (id: string) => `dh:characters:${id}:conditions:v1`,
  resources: (id: string) => `dh:characters:${id}:resources:v1`,
  traits: (id: string) => `dh:characters:${id}:traits:v1`,
  class: (id: string) => `dh:characters:${id}:class:v1`,
  domains: (id: string) => `dh:characters:${id}:domains:v1`,
  equipment: (id: string) => `dh:characters:${id}:equipment:v1`,
  inventory: (id: string) => `dh:characters:${id}:inventory:v1`,
  level: (id: string) => `dh:characters:${id}:level:v1`,
  progression: (id: string) => `dh:characters:${id}:progression:v1`,
  features: (id: string) => `dh:characters:${id}:features:v1`,
  customFeatures: (id: string) => `dh:characters:${id}:custom-features:v1`,
  thresholds: (id: string) => `dh:characters:${id}:thresholds:v1`,
  leveling: (id: string) => `dh:characters:${id}:leveling:v1`,
  // Experience total and experiences list
  experience: (id: string) => `dh:characters:${id}:experience:v1`,
  experiences: (id: string) => `dh:characters:${id}:experiences:v1`,
} as const;
