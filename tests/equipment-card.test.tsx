import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { EquipmentCard } from '../src/components/characters/equipment-card';
import type { EquipmentLoadout } from '../src/lib/schemas/equipment';

const sampleEquipment: EquipmentLoadout = {
  primaryWeapon: {
    name: 'Longsword',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 6, count: 1, modifier: 0, type: 'phy' },
    burden: 'One-Handed',
    tier: '1',
    features: [
      {
        name: 'Versatile',
        description: 'Can be used one or two-handed',
        tags: [],
      },
    ],
    metadata: { id: 'w1', homebrew: false },
    tags: [],
    description: 'A reliable melee weapon.',
  },
  secondaryWeapon: undefined,
  armor: {
    name: 'Leather Armor',
    tier: '1',
    baseScore: 2,
    baseThresholds: { major: 10, severe: 5 },
    evasionModifier: 1,
    agilityModifier: 0,
    metadata: { id: 'a1', homebrew: true },
    tags: [],
    description: 'Light armor offering modest protection.',
    features: [{ name: 'Quiet', description: 'Reduces noise', tags: [] }],
  },
  items: [],
  consumables: {},
};

describe('EquipmentCard', () => {
  it('renders placeholders for empty slots', () => {
    render(<EquipmentCard equipment={{ items: [], consumables: {} }} />);
    expect(screen.getAllByText(/Select a weapon/i).length).toBe(2);
    expect(screen.getByText(/Select armor/i)).toBeInTheDocument();
  });

  it('shows names, tier badges, and homebrew badge when present', () => {
    render(<EquipmentCard equipment={sampleEquipment} />);

    // Primary shows name and T1 badge
    expect(screen.getByText('Longsword')).toBeInTheDocument();
    expect(screen.getAllByText(/T1/)[0]).toBeInTheDocument();

    // Armor shows name and Homebrew badge
    expect(screen.getByText('Leather Armor')).toBeInTheDocument();
    expect(screen.getAllByText(/Homebrew/i)[0]).toBeInTheDocument();
  });

  it('invokes onEdit with the correct section when tapping slots', () => {
    const onEdit = vi.fn();
    render(<EquipmentCard equipment={sampleEquipment} onEdit={onEdit} />);

    fireEvent.click(
      screen.getByRole('button', { name: /Edit primary weapon/ })
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: /secondary weapon|Select secondary weapon/i,
      })
    );
    fireEvent.click(
      screen.getByRole('button', { name: /Edit armor|Select armor/i })
    );

    expect(onEdit).toHaveBeenCalledWith('primary');
    expect(onEdit).toHaveBeenCalledWith('secondary');
    expect(onEdit).toHaveBeenCalledWith('armor');
  });
});
