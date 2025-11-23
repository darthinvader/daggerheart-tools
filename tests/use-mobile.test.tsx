import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useIsMobile } from '../src/hooks/use-mobile';

describe('useIsMobile', () => {
  it('returns a boolean value', () => {
    const { result } = renderHook(() => useIsMobile());
    expect(typeof result.current).toBe('boolean');
  });

  it('hook can be re-rendered without errors', () => {
    const { result, rerender } = renderHook(() => useIsMobile());
    const initial = result.current;
    rerender();
    expect(typeof result.current).toBe('boolean');
    expect(result.current).toBe(initial);
  });
});
