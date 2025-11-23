import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { characterKeys, storage } from '../src/lib/storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('read', () => {
    it('returns fallback when key does not exist', () => {
      const result = storage.read('nonexistent', 'default');
      expect(result).toBe('default');
    });

    it('reads and parses stored value', () => {
      localStorage.setItem('test-key', JSON.stringify({ value: 42 }));
      const result = storage.read('test-key', { value: 0 });
      expect(result).toEqual({ value: 42 });
    });

    it('validates with schema when provided', () => {
      const schema = z.object({ count: z.number() });
      localStorage.setItem('test-key', JSON.stringify({ count: 5 }));

      const result = storage.read('test-key', { count: 0 }, schema);
      expect(result).toEqual({ count: 5 });
    });

    it('returns fallback when schema validation fails', () => {
      const schema = z.object({ count: z.number() });
      localStorage.setItem('test-key', JSON.stringify({ count: 'invalid' }));

      const result = storage.read('test-key', { count: 0 }, schema);
      expect(result).toEqual({ count: 0 });
    });

    it('returns fallback on JSON parse error', () => {
      localStorage.setItem('test-key', 'invalid json');
      const result = storage.read('test-key', 'default');
      expect(result).toBe('default');
    });

    it('handles localStorage being unavailable', () => {
      const originalGetItem = Storage.prototype.getItem;
      Storage.prototype.getItem = vi.fn(() => {
        throw new Error('Storage unavailable');
      });

      const result = storage.read('test-key', 'fallback');
      expect(result).toBe('fallback');

      Storage.prototype.getItem = originalGetItem;
    });
  });

  describe('write', () => {
    it('stores value as JSON', () => {
      storage.write('test-key', { data: 'value' });
      const stored = localStorage.getItem('test-key');
      expect(stored).toBe(JSON.stringify({ data: 'value' }));
    });

    it('handles primitive values', () => {
      storage.write('number', 42);
      storage.write('string', 'hello');
      storage.write('boolean', true);

      expect(JSON.parse(localStorage.getItem('number') ?? '')).toBe(42);
      expect(JSON.parse(localStorage.getItem('string') ?? '')).toBe('hello');
      expect(JSON.parse(localStorage.getItem('boolean') ?? '')).toBe(true);
    });

    it('handles localStorage being unavailable', () => {
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn(() => {
        throw new Error('Storage unavailable');
      });

      expect(() => storage.write('test-key', 'value')).not.toThrow();

      Storage.prototype.setItem = originalSetItem;
    });
  });
});

describe('characterKeys', () => {
  it('generates consistent keys for character data', () => {
    const charId = 'char-123';
    expect(characterKeys.identity(charId)).toBe(
      'dh:characters:char-123:identity:v1'
    );
    expect(characterKeys.conditions(charId)).toBe(
      'dh:characters:char-123:conditions:v1'
    );
    expect(characterKeys.resources(charId)).toBe(
      'dh:characters:char-123:resources:v1'
    );
  });

  it('generates unique keys for different character IDs', () => {
    const key1 = characterKeys.identity('char-1');
    const key2 = characterKeys.identity('char-2');
    expect(key1).not.toBe(key2);
  });

  it('includes all expected character data keys', () => {
    const charId = 'test-id';
    expect(characterKeys.identity(charId)).toContain('identity');
    expect(characterKeys.conditions(charId)).toContain('conditions');
    expect(characterKeys.resources(charId)).toContain('resources');
    expect(characterKeys.traits(charId)).toContain('traits');
    expect(characterKeys.class(charId)).toContain('class');
    expect(characterKeys.domains(charId)).toContain('domains');
    expect(characterKeys.equipment(charId)).toContain('equipment');
    expect(characterKeys.inventory(charId)).toContain('inventory');
    expect(characterKeys.level(charId)).toContain('level');
    expect(characterKeys.progression(charId)).toContain('progression');
    expect(characterKeys.features(charId)).toContain('features');
    expect(characterKeys.customFeatures(charId)).toContain('custom-features');
    expect(characterKeys.thresholds(charId)).toContain('thresholds');
    expect(characterKeys.leveling(charId)).toContain('leveling');
    expect(characterKeys.experience(charId)).toContain('experience');
    expect(characterKeys.experiences(charId)).toContain('experiences');
  });
});
