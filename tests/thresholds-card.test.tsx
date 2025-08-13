import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ThresholdsCard } from '../src/components/characters/thresholds-card';

describe('ThresholdsCard', () => {
  it('renders thresholds with default values when no id provided', () => {
    render(<ThresholdsCard />);
    expect(screen.queryByText(/M:/)).not.toBeNull();
    expect(screen.queryByText(/S:/)).not.toBeNull();
    expect(screen.queryByText(/DS:/)).not.toBeNull();
  });
});
