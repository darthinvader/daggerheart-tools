import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useDebouncedValue } from '../src/hooks/use-debounced-value';

describe('useDebouncedValue', () => {
  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebouncedValue('initial', 200));
    expect(result.current).toBe('initial');
  });

  it('eventually updates to new value after delay', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 50),
      { initialProps: { value: 'first' } }
    );

    expect(result.current).toBe('first');
    rerender({ value: 'second' });

    await waitFor(() => expect(result.current).toBe('second'), {
      timeout: 200,
    });
  });
});
