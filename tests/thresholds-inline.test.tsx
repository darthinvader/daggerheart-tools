import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ThresholdsInline } from '../src/components/characters/thresholds-inline';

vi.mock('../src/features/characters/storage', () => ({
  readLevelFromStorage: () => 1,
  readEquipmentFromStorage: () => ({ armor: undefined }),
  readThresholdsSettingsFromStorage: () => ({
    auto: true,
    values: { major: 2, severe: 3, dsOverride: false, ds: 6 },
    enableCritical: false,
  }),
  writeThresholdsSettingsToStorage: vi.fn(),
}));

describe('ThresholdsInline', () => {
  it('renders compact interleaved row and applies damage on button taps', () => {
    const onDamage = vi.fn();
    render(<ThresholdsInline id="abc" onDamage={onDamage} />);
    // Buttons 1,2,3 present (4 is disabled by default until Critical enabled)
    expect(
      screen.queryByRole('button', { name: /Apply 1 HP damage/i })
    ).not.toBeNull();
    expect(
      screen.queryByRole('button', { name: /Apply 2 HP damage/i })
    ).not.toBeNull();
    expect(
      screen.queryByRole('button', { name: /Apply 3 HP damage/i })
    ).not.toBeNull();
    // 4 is optional/disabled by default when critical not enabled

    fireEvent.click(screen.getByRole('button', { name: /Apply 1 HP damage/i }));
    fireEvent.click(screen.getByRole('button', { name: /Apply 2 HP damage/i }));
    fireEvent.click(screen.getByRole('button', { name: /Apply 3 HP damage/i }));
    expect(onDamage).toHaveBeenCalledTimes(3);
    expect(onDamage).toHaveBeenNthCalledWith(1, -1);
    expect(onDamage).toHaveBeenNthCalledWith(2, -2);
    expect(onDamage).toHaveBeenNthCalledWith(3, -3);
  });
});
