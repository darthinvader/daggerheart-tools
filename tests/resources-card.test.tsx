import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  ResourcesCard,
  type ResourcesCardProps,
} from '../src/components/characters/resources-card';

describe('ResourcesCard thresholds', () => {
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

  it('renders computed Major and Severe thresholds', () => {
    render(<ResourcesCard {...baseProps} />);
    // Major = floor(20/2) = 10, Severe = floor(20/4) = 5
    expect(screen.getByText(/Major ≤ 10/)).toBeInTheDocument();
    expect(screen.getByText(/Severe ≤ 5/)).toBeInTheDocument();
  });
});
