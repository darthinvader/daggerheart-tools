import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import DomainCardItem from '@/components/characters/domain-card-item';

const CARD = {
  name: 'Shield Bash',
  level: 1,
  domain: 'Valor',
  type: 'Ability',
  description: 'Strike with your shield.',
} as const;

describe('DomainCardItem (vault) a11y/tap targets', () => {
  it('has stacked 44x44 buttons with ARIA labels and group role', () => {
    const onAdd = vi.fn();
    const onRemoveLoadout = vi.fn();
    const onRemoveVault = vi.fn();

    render(
      <DomainCardItem
        card={CARD as any}
        context="vault"
        inLoadout={false}
        onAddToLoadout={onAdd}
        onRemoveFromLoadout={onRemoveLoadout}
        onRemoveFromVault={onRemoveVault}
      />
    );

    const group = screen.getByRole('group', { name: /vault actions/i });
    expect(group).toBeInTheDocument();

    const addBtn = screen.getByRole('button', { name: /add to loadout/i });
    const removeVaultBtn = screen.getByRole('button', {
      name: /remove from vault/i,
    });

    // Class checks for sizing and stacking
    expect(addBtn.className).toMatch(/min-h-\[44px\]/);
    expect(addBtn.className).toMatch(/w-full/);

    expect(removeVaultBtn.className).toMatch(/min-h-\[44px\]/);
    expect(removeVaultBtn.className).toMatch(/w-full/);
  });
});
