import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import * as React from 'react';

import { useDrawerAutosaveOnClose } from '@/components/characters/hooks/use-drawer-autosave';

function Wrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

describe('useDrawerAutosaveOnClose', () => {
  it('runs submit on close when valid and within limit and not skipped', async () => {
    const submit = vi.fn(async () => {});
    const trigger = vi.fn(async () => true);
    const skipRef = { current: false } as React.MutableRefObject<boolean>;

    const { rerender } = renderHook(
      ({ open }: { open: boolean }) =>
        useDrawerAutosaveOnClose({
          open,
          trigger,
          creationComplete: false,
          currentLoadoutCount: 2,
          startingLimit: 3,
          submit,
          skipRef,
        }),
      { wrapper: Wrapper, initialProps: { open: true } }
    );

    // Close
    rerender({ open: false });

    // Wait microtask
    await Promise.resolve();

    expect(trigger).toHaveBeenCalled();
    expect(submit).toHaveBeenCalled();
  });

  it('does not run when skipped', async () => {
    const submit = vi.fn();
    const trigger = vi.fn(async () => true);
    const skipRef = { current: true } as React.MutableRefObject<boolean>;

    const { rerender } = renderHook(
      ({ open }: { open: boolean }) =>
        useDrawerAutosaveOnClose({
          open,
          trigger,
          creationComplete: false,
          currentLoadoutCount: 2,
          startingLimit: 3,
          submit,
          skipRef,
        }),
      { wrapper: Wrapper, initialProps: { open: true } }
    );

    rerender({ open: false });
    await Promise.resolve();

    expect(submit).not.toHaveBeenCalled();
  });
});
