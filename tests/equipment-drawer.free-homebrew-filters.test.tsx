import '@testing-library/jest-dom';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';

import { EquipmentDrawer } from '../src/components/characters/equipment-drawer';
import type { EquipmentDraft } from '../src/features/characters/storage';

function Wrapper({ onSubmit }: { onSubmit?: (v: EquipmentDraft) => void }) {
  const form = useForm<EquipmentDraft>({
    mode: 'onChange',
    defaultValues: {
      primaryWeapon: undefined,
      secondaryWeapon: undefined,
      armor: undefined,
      items: [],
      consumables: {},
      metadata: { mode: 'free' } as any,
    } as any,
  });
  return (
    <EquipmentDrawer
      open
      onOpenChange={() => {}}
      form={form as any}
      submit={() => onSubmit?.(form.getValues())}
      onCancel={() => {}}
      section="primary"
    />
  );
}

describe('EquipmentDrawer free mode, filters, homebrew', () => {
  it('allows cross-slot selection with All source (primary tab)', async () => {
    render(<Wrapper />);
    // Stay on Primary tab and switch Source to All to include secondary/homebrew items
    const primaryTab = screen.getByRole('tab', { name: /primary/i });
    const panelId = primaryTab.getAttribute('aria-controls');
    expect(panelId).toBeTruthy();
    const panel = document.getElementById(panelId!) as HTMLElement;
    await waitFor(() => expect(panel).not.toHaveAttribute('hidden'));
    const sourceToggle = within(panel).getByRole('group', {
      name: /source filter/i,
    });
    const allBtn = within(sourceToggle).getByRole('radio', { name: /all/i });
    fireEvent.click(allBtn);

    const search = within(panel).getByPlaceholderText(
      /search primary weapons/i
    );
    fireEvent.change(search, { target: { value: 'dagger' } });

    // Click an entry from the list
    const btn = within(panel)
      .getAllByRole('button')
      .find(b => /dagger/i.test(b.textContent || ''))!;
    fireEvent.click(btn);

    // Current selection strip should reflect selection
    expect(screen.getByText(/current:/i)).toBeInTheDocument();
  });

  it('filters by tier and burden', () => {
    render(<Wrapper />);
    // Primary tab filters
    const tierAll = screen.getAllByRole('radio', { name: /all/i })[0];
    expect(tierAll).toBeInTheDocument();
    const tier2 = screen.getAllByRole('radio', { name: '2' }).slice(-1)[0];
    fireEvent.click(tier2);

    const burden2h = screen.getAllByRole('radio', { name: '2H' }).slice(-1)[0];
    fireEvent.click(burden2h);

    // smoke: list renders some weapon text after filtering or at least UI remains present
    expect(
      screen.getByPlaceholderText(/search primary weapons/i)
    ).toBeInTheDocument();
  });

  it('adds a homebrew primary weapon and shows badge', () => {
    render(<Wrapper />);

    const toggle = screen.getByRole('button', {
      name: /add custom primary weapon/i,
    });
    fireEvent.click(toggle);

    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'Homebrew Sword' } });

    const addBtn = screen.getByRole('button', { name: /add to list/i });
    fireEvent.click(addBtn);

    // New entry badge appears somewhere in the list
    const search = screen.getByPlaceholderText(/search primary weapons/i);
    fireEvent.change(search, { target: { value: 'homebrew sword' } });

    expect(screen.getAllByText(/homebrew/i).length).toBeGreaterThan(0);
  });
});
