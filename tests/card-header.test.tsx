import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CardScaffold } from '../src/components/characters/identity/card-scaffold';
import { CharacterCardHeader } from '../src/components/characters/presenters/card-header';

describe('CharacterCardHeader', () => {
  it('renders title as button and calls onTitleClick when provided', () => {
    const onClick = vi.fn();
    render(
      <CharacterCardHeader
        title="Identity"
        subtitle="Tap the title to edit"
        onTitleClick={onClick}
      />
    );

    const button = screen.getByRole('button', {
      name: /open identity editor/i,
    });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    // Subtitle should render
    expect(screen.getByText(/tap the title to edit/i)).toBeInTheDocument();
  });

  it('renders static title when onTitleClick not provided', () => {
    render(<CharacterCardHeader title="Resources" />);
    // No button role when not clickable
    expect(
      screen.queryByRole('button', { name: /open resources editor/i })
    ).toBeNull();
    // Title text should still be present
    expect(screen.getByText('Resources')).toBeInTheDocument();
  });
});

describe('CardScaffold', () => {
  it('renders clickable title when onTitleClick provided', () => {
    const onClick = vi.fn();
    render(
      <CardScaffold
        title="Identity"
        subtitle="Tap the title to edit"
        onTitleClick={onClick}
      >
        <div>content</div>
      </CardScaffold>
    );

    const button = screen.getByRole('button', {
      name: /open identity editor/i,
    });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/tap the title to edit/i)).toBeInTheDocument();
  });

  it('renders static title when not clickable', () => {
    render(
      <CardScaffold title="Resources">
        <div>content</div>
      </CardScaffold>
    );

    expect(
      screen.queryByRole('button', { name: /open resources editor/i })
    ).toBeNull();
    expect(screen.getByText('Resources')).toBeInTheDocument();
  });
});
