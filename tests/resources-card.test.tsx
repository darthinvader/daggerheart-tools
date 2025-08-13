import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  ResourcesCard,
  type ResourcesCardProps,
} from '../src/components/characters/resources-card';

describe('ResourcesCard', () => {
  const baseProps: ResourcesCardProps = {
    resources: {
      hp: { current: 10, max: 20 },
      stress: { current: 0, max: 6 },
      hope: { current: 0, max: 3 },
    },
    updateHp: () => {},
    updateHpMax: () => {},
    updateStress: () => {},
    updateStressMax: () => {},
    updateHope: () => {},
    updateHopeMax: () => {},
  };

  it('does not render thresholds inline (moved to ThresholdsCard)', () => {
    render(<ResourcesCard {...baseProps} />);
    expect(screen.queryByText(/Major ≤/)).toBeNull();
    expect(screen.queryByText(/Severe ≤/)).toBeNull();
  });
});
