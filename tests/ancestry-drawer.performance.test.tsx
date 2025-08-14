import { zodResolver } from '@hookform/resolvers/zod';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

import * as React from 'react';

import {
  AncestryDrawer,
  type AncestryFormValues,
} from '@/components/characters/ancestry-drawer';
import { IdentityDraftSchema } from '@/features/characters/storage';

// Mock the lazy-loaded components and other dependencies
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

function TestWrapper() {
  const form = useForm<AncestryFormValues>({
    resolver: zodResolver(
      IdentityDraftSchema.pick({
        ancestry: true,
        ancestryDetails: true,
      })
    ) as never,
    mode: 'onChange',
    defaultValues: {
      ancestry: 'Human',
      ancestryDetails: {
        type: 'homebrew',
        homebrew: {
          name: '',
          description: '',
          heightRange: '',
          lifespan: '',
          physicalCharacteristics: '',
          primaryFeature: { name: '', description: '' },
          secondaryFeature: { name: '', description: '' },
        },
      },
    },
  });

  const [open, setOpen] = React.useState(false);

  const submit = form.handleSubmit(values => {
    console.log('Submitted:', values);
    setOpen(false);
  });

  const onCancel = () => setOpen(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Drawer</button>
      <AncestryDrawer
        open={open}
        onOpenChange={setOpen}
        form={form}
        submit={submit}
        onCancel={onCancel}
      />
    </>
  );
}

describe('AncestryDrawer Performance', () => {
  it('should handle fast typing in homebrew ancestry fields without lag', async () => {
    render(<TestWrapper />);

    // Open drawer
    fireEvent.click(screen.getByText('Open Drawer'));
    await waitFor(() =>
      expect(screen.getByText('Edit Ancestry')).toBeDefined()
    );

    // Wait for homebrew content to be available (should already be active due to default values)
    await waitFor(() =>
      expect(screen.getByText('Homebrew Ancestry')).toBeDefined()
    );

    // Test rapid typing in homebrew name field
    const nameField = screen.getByPlaceholderText('Custom ancestry name');

    // Measure typing performance
    const startTime = performance.now();
    const testText = 'DragonbornVariant';

    let renderCount = 0;
    const originalRender = React.Component.prototype.render;
    React.Component.prototype.render = function (...args) {
      renderCount++;
      return originalRender.apply(this, args);
    };

    // Type each character rapidly
    for (let i = 0; i < testText.length; i++) {
      await act(async () => {
        fireEvent.change(nameField, {
          target: { value: testText.substring(0, i + 1) },
        });
      });

      // Should not take more than 50ms per character
      const elapsed = performance.now() - startTime;
      const avgPerChar = elapsed / (i + 1);
      expect(avgPerChar).toBeLessThan(50);
    }

    React.Component.prototype.render = originalRender;

    const totalTime = performance.now() - startTime;
    console.log(`Total typing time: ${totalTime}ms, Renders: ${renderCount}`);

    // Should complete all typing in reasonable time
    expect(totalTime).toBeLessThan(1000);
    expect(screen.getByDisplayValue('DragonbornVariant')).toBeDefined();
  });
});
