import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import * as React from 'react';

import { useBaselineSnapshot } from '@/components/characters/hooks/use-baseline-snapshot';

function Wrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

describe('useBaselineSnapshot', () => {
  it('captures baseline on open and preserves it across changes', () => {
    let state = { a: 1 };
    const getValues = () => state;

    const { result, rerender } = renderHook(
      ({ open }: { open: boolean }) => useBaselineSnapshot(open, getValues),
      { wrapper: Wrapper, initialProps: { open: true } }
    );

    // After first render, baseline captured
    expect(result.current?.current).toEqual({ a: 1 });

    // Mutate state while still open
    state = { a: 2 } as any;
    // Close and reopen — baseline should recapture on next open
    rerender({ open: false });
    rerender({ open: true });

    expect(result.current?.current).toEqual({ a: 2 });
  });
});
