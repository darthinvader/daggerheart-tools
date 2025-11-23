import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useMeasureReady } from '../src/hooks/use-measure-ready';

describe('useMeasureReady', () => {
  it('returns false when inactive', () => {
    const { result } = renderHook(() => useMeasureReady(false, 300));
    expect(result.current).toBe(false);
  });

  it('starts false and becomes true after delay when active', async () => {
    const { result } = renderHook(() => useMeasureReady(true, 50));
    expect(result.current).toBe(false);

    await waitFor(() => expect(result.current).toBe(true), { timeout: 200 });
  });

  it('resets to false when becoming inactive', () => {
    const { result, rerender } = renderHook(
      ({ active }) => useMeasureReady(active, 50),
      { initialProps: { active: true } }
    );

    rerender({ active: false });
    expect(result.current).toBe(false);
  });
});
