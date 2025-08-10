import { act, renderHook } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';

import { useLoadoutLists } from '../src/components/characters/domains-drawer/use-loadout-lists';

type DomainCard = {
  name: string;
  domain: string;
  type: 'Spell' | 'Talent';
  level: number;
  description: string;
  hopeCost: number;
  recallCost: number;
};

function useHarness(
  initial?: Partial<{ loadout: DomainCard[]; vault: DomainCard[] }>
) {
  const form = useForm<{ loadout: DomainCard[]; vault: DomainCard[] }>({
    defaultValues: { loadout: [], vault: [], ...(initial ?? {}) },
    mode: 'onChange',
  });
  return useLoadoutLists(form as any);
}

describe('useLoadoutLists', () => {
  const spell: DomainCard = {
    name: 'Arcane Blast',
    domain: 'Arcana',
    type: 'Spell',
    level: 1,
    description: 'Boom',
    hopeCost: 0,
    recallCost: 0,
  };

  it('adds to loadout and vault, enforces uniqueness', () => {
    const { result } = renderHook(() => useHarness());

    expect(result.current.currentLoadout).toHaveLength(0);
    expect(result.current.currentVault).toHaveLength(0);

    act(() => result.current.addToLoadout(spell));

    expect(result.current.currentLoadout).toHaveLength(1);
    expect(result.current.currentVault).toHaveLength(1);

    // adding again should not duplicate
    act(() => result.current.addToLoadout(spell));
    expect(result.current.currentLoadout).toHaveLength(1);
    expect(result.current.currentVault).toHaveLength(1);
  });

  it('removes from loadout and vault correctly', () => {
    const { result } = renderHook(() =>
      useHarness({ loadout: [spell], vault: [spell] })
    );

    act(() => result.current.removeFromLoadout(spell));
    expect(result.current.currentLoadout).toHaveLength(0);
    expect(result.current.currentVault).toHaveLength(1);

    act(() => result.current.removeFromVault(spell));
    expect(result.current.currentVault).toHaveLength(0);
    // also ensures it is removed from loadout if present (already removed, so still 0)
    expect(result.current.currentLoadout).toHaveLength(0);
  });
});
