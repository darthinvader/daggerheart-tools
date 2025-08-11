import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { QuickJump } from '../src/components/layout/quick-jump';

function mountWithSections(ids: string[]) {
  // Create section elements in DOM with offsets
  const heights: Record<string, number> = {};
  let offset = 0;
  ids.forEach(id => {
    const div = document.createElement('div');
    div.id = id;
    div.style.position = 'absolute';
    div.style.top = `${offset}px`;
    div.style.height = '200px';
    document.body.appendChild(div);
    heights[id] = offset;
    offset += 220;
  });
  // Fake header
  const header = document.createElement('div');
  header.id = 'sheet-header';
  header.style.height = '56px';
  document.body.appendChild(header);
  return heights;
}

describe('QuickJump', () => {
  let ioSpy: any;
  beforeEach(() => {
    // Mock IntersectionObserver
    ioSpy = {
      observe: vi.fn(),
      disconnect: vi.fn(),
      unobserve: vi.fn(),
      takeRecords: vi.fn(),
    };
    (globalThis as any).IntersectionObserver = vi.fn(() => ioSpy);
  });
  afterEach(() => {
    document.body.innerHTML = '';
    // Reset hash to avoid leaking state across tests
    window.location.hash = '';
  });

  it('highlights the clicked item and scrolls', () => {
    mountWithSections(['a', 'b']);
    render(
      <QuickJump
        items={[
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B' },
        ]}
      />
    );

    const a = screen.getByText('A');
    const b = screen.getByText('B');
    expect(a).toBeInTheDocument();
    expect(b).toBeInTheDocument();

    // Click B; should set aria-current on B
    fireEvent.click(b);
    expect(b).toHaveAttribute('aria-current', 'true');
  });

  it('updates URL hash on click without native jump', () => {
    mountWithSections(['a', 'b']);
    render(
      <QuickJump
        items={[
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B' },
        ]}
      />
    );
    const b = screen.getByText('B');
    // Click B; hash should update to #b
    fireEvent.click(b);
    expect(window.location.hash).toBe('#b');
    expect(b).toHaveAttribute('aria-current', 'true');
  });

  it('activates from initial hash on mount', () => {
    // Set initial location hash
    window.location.hash = '#b';
    mountWithSections(['a', 'b', 'c']);
    render(
      <QuickJump
        items={[
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B' },
          { id: 'c', label: 'C' },
        ]}
      />
    );
    expect(screen.getByText('B')).toHaveAttribute('aria-current', 'true');
  });

  it('responds to hashchange events', () => {
    mountWithSections(['a', 'b']);
    render(
      <QuickJump
        items={[
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B' },
        ]}
      />
    );
    // Initially A is active
    expect(screen.getByText('A')).toHaveAttribute('aria-current', 'true');
    // Change hash and dispatch event
    act(() => {
      window.location.hash = '#b';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    return waitFor(() =>
      expect(screen.getByText('B')).toHaveAttribute('aria-current', 'true')
    );
  });
});
