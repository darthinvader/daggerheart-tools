import { describe, expect, it } from 'vitest';

import { rankAdvanced, rankBy, rankings } from '../src/utils/search/rank';

describe('search ranking utils', () => {
  describe('rankBy', () => {
    it('returns all items when query is empty', () => {
      const items = [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }];
      const result = rankBy(items, '', ['name']);
      expect(result).toEqual(items);
    });

    it('filters and ranks items by name', () => {
      const items = [
        { name: 'Alice' },
        { name: 'Bob' },
        { name: 'Alison' },
        { name: 'Charlie' },
      ];
      const result = rankBy(items, 'Ali', ['name']);
      expect(result.length).toBeGreaterThanOrEqual(2);
      expect(result[0]?.name).toMatch(/Ali/);
    });

    it('ranks exact matches higher', () => {
      const items = [
        { title: 'React Hooks' },
        { title: 'Intro to React' },
        { title: 'React' },
      ];
      const result = rankBy(items, 'React', ['title']);
      expect(result[0]?.title).toBe('React');
    });

    it('supports multiple keys', () => {
      const items = [
        { name: 'Alice', role: 'Admin' },
        { name: 'Bob', role: 'User' },
        { name: 'Charlie', role: 'Admin' },
      ];
      const result = rankBy(items, 'Admin', ['name', 'role']);
      expect(result.length).toBeGreaterThan(0);
      expect(
        result.some((item: { role: string }) => item.role === 'Admin')
      ).toBe(true);
    });

    it('supports function keys', () => {
      const items = [
        { firstName: 'Alice', lastName: 'Smith' },
        { firstName: 'Bob', lastName: 'Johnson' },
      ];
      const result = rankBy(items, 'Smith', [
        (item: { firstName: string; lastName: string }) =>
          `${item.firstName} ${item.lastName}`,
      ]);
      expect(result).toHaveLength(1);
      expect(result[0]?.lastName).toBe('Smith');
    });
  });

  describe('rankAdvanced', () => {
    it('returns all items when query is empty', () => {
      const items = [{ name: 'Alice' }, { name: 'Bob' }];
      const result = rankAdvanced(items, '', ['name']);
      expect(result).toEqual(items);
    });

    it('applies threshold filtering', () => {
      const items = [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Alison' }];
      const result = rankAdvanced(items, 'Alice', ['name'], rankings.EQUAL);
      expect(result).toHaveLength(1);
      expect(result[0]?.name).toBe('Alice');
    });

    it('includes partial matches with CONTAINS threshold', () => {
      const items = [{ name: 'Alice' }, { name: 'Alison' }, { name: 'Bob' }];
      const result = rankAdvanced(items, 'Ali', ['name'], rankings.CONTAINS);
      expect(result.length).toBeGreaterThanOrEqual(2);
    });

    it('returns empty array when no matches meet threshold', () => {
      const items = [{ name: 'Alice' }, { name: 'Bob' }];
      const result = rankAdvanced(items, 'xyz', ['name'], rankings.EQUAL);
      expect(result).toHaveLength(0);
    });
  });

  describe('rankings export', () => {
    it('exports match-sorter rankings', () => {
      expect(rankings).toBeDefined();
      expect(rankings.CONTAINS).toBeDefined();
      expect(rankings.EQUAL).toBeDefined();
      expect(rankings.STARTS_WITH).toBeDefined();
    });
  });
});
