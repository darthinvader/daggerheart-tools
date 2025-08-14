import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CommunityCard } from '@/components/characters/community-card';

function noop() {}

describe('CommunityCard', () => {
  it('renders a standard community with traits and feature', () => {
    render(<CommunityCard community="Highborne" onEdit={noop} />);
    expect(screen.getByText('Highborne')).toBeInTheDocument();
    // trait chips: at least one of the known traits should be present
    const traitMatches = screen.getAllByText(
      /amiable|candid|conniving|enterprising|ostentatious|unflappable/
    );
    expect(traitMatches.length).toBeGreaterThan(0);
    // feature name
    expect(screen.getByText('Privilege')).toBeInTheDocument();
  });

  it('renders a homebrew community with badge and feature', () => {
    render(
      <CommunityCard
        community="(ignored for homebrew)"
        onEdit={noop}
        communityDetails={{
          type: 'homebrew',
          homebrew: {
            name: 'Skyfarers Guild',
            commonTraits: ['daring', 'gregarious'],
            feature: {
              name: 'Skywise',
              description: 'You always know the winds.',
            },
          },
        }}
      />
    );
    expect(screen.getByText('Skyfarers Guild')).toBeInTheDocument();
    expect(screen.getByText('Homebrew')).toBeInTheDocument();
    expect(screen.getByText('Skywise')).toBeInTheDocument();
    expect(screen.getByText('You always know the winds.')).toBeInTheDocument();
  });

  it('renders empty-state when community not found', () => {
    render(<CommunityCard community="Unknown Community" onEdit={noop} />);
    expect(screen.getByText(/Select a community/)).toBeInTheDocument();
  });
});
