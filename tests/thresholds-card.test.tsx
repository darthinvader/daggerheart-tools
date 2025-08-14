import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ThresholdsCard } from '../src/components/characters/thresholds-card';

describe('ThresholdsCard', () => {
  it('renders thresholds with default values when no id provided', () => {
    render(<ThresholdsCard />);
    expect(screen.queryByText(/M:/)).not.toBeNull();
    // Use start-of-string anchor to avoid matching DS:
    expect(screen.queryByText(/^S:/)).not.toBeNull();
    expect(screen.queryByText(/MD:/)).not.toBeNull();
  });
});
