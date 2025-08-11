import { fireEvent, render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';

import { EquipmentDrawer } from '../src/components/characters/equipment-drawer';
import type { EquipmentDraft } from '../src/features/characters/storage';

function Wrapper({ initial }: { initial: Partial<EquipmentDraft> }) {
  const form = useForm<EquipmentDraft>({
    defaultValues: {
      primaryWeapon: undefined,
      secondaryWeapon: undefined,
      armor: undefined,
      items: [],
      consumables: {},
      ...(initial as EquipmentDraft),
    },
  });
  return (
    <FormProvider {...form}>
      <EquipmentDrawer
        open
        onOpenChange={() => {}}
        form={form}
        submit={() => {}}
        onCancel={() => {}}
        section="primary"
      />
    </FormProvider>
  );
}

describe('EquipmentDrawer', () => {
  it('renders Current selection strip and clears it', async () => {
    render(
      <Wrapper
        initial={{
          primaryWeapon: {
            name: 'Test Sword',
            tier: '1',
            trait: 'Blade',
            range: 'Melee',
            damage: { diceType: 6, count: 1, modifier: 0, type: 'phy' },
            burden: 'One-Handed',
            features: [],
          } as any,
        }}
      />
    );

    // Shows Current and Clear
    expect(screen.getByText('Current:')).toBeInTheDocument();
    const clear = screen.getByRole('button', { name: 'Clear' });
    expect(clear).toBeInTheDocument();

    // Clear removes the strip
    fireEvent.click(clear);
    expect(screen.queryByText('Current:')).not.toBeInTheDocument();
  });
});
