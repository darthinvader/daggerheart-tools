import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AncestryCard } from '@/components/characters/ancestry-card';

function noop() {}

describe('AncestryCard', () => {
  it('renders a standard ancestry with primary/secondary features', () => {
    render(<AncestryCard ancestry="Elf" onEdit={noop} />);
    expect(screen.getByText('Elf')).toBeInTheDocument();
    expect(screen.getByText('Primary')).toBeInTheDocument();
    expect(screen.getByText('Secondary')).toBeInTheDocument();
    expect(screen.getByText('Quick Reactions')).toBeInTheDocument();
    expect(screen.getByText('Celestial Trance')).toBeInTheDocument();
  });

  it('renders a homebrew ancestry with badge and features', () => {
    render(
      <AncestryCard
        ancestry="(ignored)"
        onEdit={noop}
        ancestryDetails={{
          type: 'homebrew',
          homebrew: {
            name: 'Sunborn',
            primaryFeature: {
              name: 'Solar Boon',
              description: 'Gain power in daylight.',
            },
            secondaryFeature: {
              name: 'Sun Shield',
              description: 'Protect allies with light.',
            },
          },
        }}
      />
    );
    expect(screen.getByText('Sunborn')).toBeInTheDocument();
    expect(screen.getByText('Homebrew')).toBeInTheDocument();
    expect(screen.getByText('Solar Boon')).toBeInTheDocument();
    expect(screen.getByText('Sun Shield')).toBeInTheDocument();
  });

  it('renders mixed ancestry details from selected ancestries', () => {
    render(
      <AncestryCard
        ancestry="(ignored)"
        onEdit={noop}
        ancestryDetails={{
          type: 'mixed',
          mixed: {
            name: 'Half-Elf',
            primaryFrom: 'Elf',
            secondaryFrom: 'Human',
          },
        }}
      />
    );
    expect(screen.getByText('Half-Elf')).toBeInTheDocument();
    expect(screen.getByText('Primary')).toBeInTheDocument();
    expect(screen.getByText('Secondary')).toBeInTheDocument();
    // from text is appended in descriptions; spot-check feature names exist
    expect(screen.getByText('Quick Reactions')).toBeInTheDocument();
    expect(screen.getByText('Adaptability')).toBeInTheDocument();
  });

  it('renders empty-state when ancestry not found', () => {
    render(<AncestryCard ancestry="Unknown Ancestry" onEdit={noop} />);
    expect(screen.getByText(/Select an ancestry/)).toBeInTheDocument();
  });
});
