import { zodResolver } from '@hookform/resolvers/zod';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

import * as React from 'react';

import {
  AncestryDrawer,
  type AncestryFormValues,
} from '@/components/characters/ancestry-drawer';
import { IdentityDraftSchema } from '@/features/characters/storage';

// Mock ancestry data to keep tests fast and deterministic
vi.mock('@/lib/data/characters/ancestries', () => ({
  ANCESTRIES: [
    {
      name: 'Human',
      description: 'Versatile and adaptable',
      heightRange: '5-6 feet',
      lifespan: '~80 years',
      physicalCharacteristics: ['Varied appearance'],
      primaryFeature: { name: 'Adaptable', description: 'Quick to learn' },
      secondaryFeature: {
        name: 'Resourceful',
        description: 'Makes the most of opportunities',
      },
    },
    {
      name: 'Elf',
      description: 'Graceful and long-lived',
      heightRange: '5-6 feet',
      lifespan: '~400 years',
      physicalCharacteristics: ['Pointed ears', 'Slender build'],
      primaryFeature: {
        name: 'Keen Senses',
        description: 'Enhanced perception',
      },
      secondaryFeature: { name: 'Graceful', description: 'Natural agility' },
    },
  ],
}));

function TestWrapper({
  onSubmitted,
  initialType = 'standard' as 'standard' | 'homebrew',
}: {
  onSubmitted: (values: AncestryFormValues) => void;
  initialType?: 'standard' | 'homebrew';
}) {
  const form = useForm<AncestryFormValues>({
    resolver: zodResolver(
      IdentityDraftSchema.pick({ ancestry: true, ancestryDetails: true })
    ) as never,
    mode: 'onChange',
    defaultValues: {
      ancestry: 'Human',
      ancestryDetails:
        initialType === 'homebrew'
          ? {
              type: 'homebrew',
              homebrew: {
                name: '',
                description: '',
                heightRange: '',
                lifespan: '',
                physicalCharacteristics: [],
                primaryFeature: { name: '', description: '' },
                secondaryFeature: { name: '', description: '' },
              },
            }
          : { type: 'standard' },
    },
  });

  const [open, setOpen] = React.useState(false);
  const submit = form.handleSubmit(values => {
    onSubmitted(values);
    setOpen(false);
  });

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Drawer</button>
      <AncestryDrawer
        open={open}
        onOpenChange={setOpen}
        form={form}
        submit={submit}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}

describe('AncestryDrawer Save Behavior', () => {
  it('commits Mixed ancestry values (name + details) on Save', async () => {
    const onSubmitted = vi.fn();
    render(<TestWrapper onSubmitted={onSubmitted} />);

    // Open the drawer
    fireEvent.click(screen.getByText('Open Drawer'));
    await waitFor(() =>
      expect(screen.getByText('Edit Ancestry')).toBeDefined()
    );

    // Ensure we're on the Select tab
    expect(screen.getByRole('tab', { name: 'Select' })).toBeDefined();

    // Switch mode to Mixed
    const mixedRadio = screen.getByLabelText('Mixed');
    await act(async () => fireEvent.click(mixedRadio));

    // Mixed section should appear
    await waitFor(() =>
      expect(screen.getByText('Mixed Ancestry')).toBeDefined()
    );

    // Set an optional mixed name
    const nameInput = screen.getByPlaceholderText('e.g., Elf-Orc');
    await act(async () =>
      fireEvent.change(nameInput, { target: { value: 'Half-Elf' } })
    );

    // Select primary = Human, secondary = Elf using list buttons
    const primarySection = screen
      .getByText('Primary Feature From')
      .closest('div') as HTMLElement;
    const secondarySection = screen
      .getByText('Secondary Feature From')
      .closest('div') as HTMLElement;

    // The first button is Human, the second is Elf based on mocked order
    await act(async () =>
      fireEvent.click(within(primarySection).getAllByRole('button')[0])
    );
    await act(async () =>
      fireEvent.click(within(secondarySection).getAllByRole('button')[1])
    );

    // Save
    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    );

    // Assert submitted payload
    expect(onSubmitted).toHaveBeenCalledTimes(1);
    const submitted = onSubmitted.mock.calls[0][0] as AncestryFormValues;
    expect(submitted.ancestry).toBe('Half-Elf');
    expect(submitted.ancestryDetails?.type).toBe('mixed');
    expect(submitted.ancestryDetails?.mixed).toEqual({
      name: 'Half-Elf',
      primaryFrom: 'Human',
      secondaryFrom: 'Elf',
    });
  });

  it('commits Homebrew ancestry values (ancestry equals homebrew name) on Save', async () => {
    const onSubmitted = vi.fn();
    render(<TestWrapper onSubmitted={onSubmitted} initialType="homebrew" />);

    // Open the drawer
    fireEvent.click(screen.getByText('Open Drawer'));
    await waitFor(() =>
      expect(screen.getByText('Edit Ancestry')).toBeDefined()
    );
    await waitFor(() =>
      expect(screen.getByText('Homebrew Ancestry')).toBeDefined()
    );

    // Fill required fields
    await act(async () =>
      fireEvent.change(screen.getByPlaceholderText('Custom ancestry name'), {
        target: { value: 'DragonbornVariant' },
      })
    );

    const featureNames = screen.getAllByPlaceholderText('Feature name');
    const featureDescs = screen.getAllByPlaceholderText('Feature description');

    await act(async () =>
      fireEvent.change(featureNames[0], { target: { value: 'Breath Mastery' } })
    );
    await act(async () =>
      fireEvent.change(featureDescs[0], {
        target: { value: 'Adapt breath weapon to any element' },
      })
    );
    await act(async () =>
      fireEvent.change(featureNames[1], {
        target: { value: 'Scaled Resilience' },
      })
    );
    await act(async () =>
      fireEvent.change(featureDescs[1], {
        target: { value: 'Resistance to chosen element' },
      })
    );

    // Save
    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    );

    // Assert submitted payload
    expect(onSubmitted).toHaveBeenCalledTimes(1);
    const submitted = onSubmitted.mock.calls[0][0] as AncestryFormValues;
    expect(submitted.ancestry).toBe('DragonbornVariant');
    expect(submitted.ancestryDetails?.type).toBe('homebrew');
    expect(submitted.ancestryDetails?.homebrew?.name).toBe('DragonbornVariant');
    expect(submitted.ancestryDetails?.homebrew?.primaryFeature).toEqual({
      name: 'Breath Mastery',
      description: 'Adapt breath weapon to any element',
    });
    expect(submitted.ancestryDetails?.homebrew?.secondaryFeature).toEqual({
      name: 'Scaled Resilience',
      description: 'Resistance to chosen element',
    });
  });
});
