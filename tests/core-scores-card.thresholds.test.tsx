import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CoreScoresCard } from '../src/components/characters/core-scores-card';

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

describe('CoreScoresCard thresholds row', () => {
  it('shows inline thresholds and calls updateHp on taps', () => {
    const updateHp = vi.fn();
    render(
      <CoreScoresCard
        scores={{ evasion: 10, proficiency: 1 }}
        updateEvasion={() => {}}
        updateProficiency={() => {}}
        id="abc"
        updateHp={updateHp}
      />
    );

    // Tap 2/3 buttons
    fireEvent.click(screen.getByRole('button', { name: /Apply 2 HP damage/i }));
    fireEvent.click(screen.getByRole('button', { name: /Apply 3 HP damage/i }));

    expect(updateHp).toHaveBeenCalledTimes(2);
    expect(updateHp).toHaveBeenNthCalledWith(1, -2);
    expect(updateHp).toHaveBeenNthCalledWith(2, -3);
  });
});
