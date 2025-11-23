import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useCoarsePointer } from '../src/hooks/use-coarse-pointer';

describe('useCoarsePointer', () => {
  it('returns false when pointer is fine (mouse)', () => {
    const mockMql = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    vi.spyOn(window, 'matchMedia').mockReturnValue(
      mockMql as unknown as MediaQueryList
    );

    const { result } = renderHook(() => useCoarsePointer());
    expect(result.current).toBe(false);
  });

  it('returns true when pointer is coarse (touch)', () => {
    const mockMql = {
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    vi.spyOn(window, 'matchMedia').mockReturnValue(
      mockMql as unknown as MediaQueryList
    );

    const { result } = renderHook(() => useCoarsePointer());
    expect(result.current).toBe(true);
  });

  it('updates when pointer type changes', () => {
    const listeners = new Set<() => void>();
    const mockMql = {
      matches: false,
      addEventListener: vi.fn((_, handler) => listeners.add(handler)),
      removeEventListener: vi.fn((_, handler) => listeners.delete(handler)),
    };

    vi.spyOn(window, 'matchMedia').mockReturnValue(
      mockMql as unknown as MediaQueryList
    );

    const { result, rerender } = renderHook(() => useCoarsePointer());
    expect(result.current).toBe(false);

    mockMql.matches = true;
    listeners.forEach(handler => handler());
    rerender();

    expect(result.current).toBe(true);
  });
});
