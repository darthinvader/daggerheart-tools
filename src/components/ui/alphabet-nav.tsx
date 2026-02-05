/**
 * Alphabet Navigation Component
 *
 * A-Z quick navigation for large alphabetically sorted lists.
 * Allows users to jump directly to a letter section.
 */
import { cn } from '@/lib/utils';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

interface AlphabetNavProps {
  /** Letters that have items (will be clickable) */
  availableLetters: Set<string>;
  /** Currently active/visible letter */
  activeLetter?: string;
  /** Callback when a letter is clicked */
  onLetterClick: (letter: string) => void;
  /** Additional class name */
  className?: string;
  /** Show as compact vertical sidebar on mobile */
  variant?: 'horizontal' | 'vertical';
}

export function AlphabetNav({
  availableLetters,
  activeLetter,
  onLetterClick,
  className,
  variant = 'horizontal',
}: AlphabetNavProps) {
  if (variant === 'vertical') {
    return (
      <div
        className={cn(
          'bg-background/80 fixed top-1/2 right-1 z-40 flex -translate-y-1/2 flex-col gap-0.5 rounded-full px-1 py-2 shadow-lg backdrop-blur-sm',
          className
        )}
      >
        {ALPHABET.map(letter => {
          const isAvailable = availableLetters.has(letter);
          const isActive = activeLetter === letter;

          return (
            <button
              key={letter}
              onClick={() => isAvailable && onLetterClick(letter)}
              disabled={!isAvailable}
              className={cn(
                'text-xs font-medium transition-colors',
                'flex size-5 items-center justify-center rounded-full',
                isAvailable
                  ? isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  : 'text-muted-foreground/40 cursor-not-allowed'
              )}
              aria-label={`Jump to ${letter}`}
            >
              {letter}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-muted/50 flex flex-wrap items-center justify-center gap-1 rounded-lg border p-2',
        className
      )}
    >
      {ALPHABET.map(letter => {
        const isAvailable = availableLetters.has(letter);
        const isActive = activeLetter === letter;

        return (
          <button
            key={letter}
            onClick={() => isAvailable && onLetterClick(letter)}
            disabled={!isAvailable}
            className={cn(
              'text-sm font-medium transition-colors',
              'flex size-7 items-center justify-center rounded sm:size-8',
              isAvailable
                ? isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-background text-foreground hover:bg-accent hover:text-accent-foreground shadow-sm'
                : 'text-muted-foreground/40 cursor-not-allowed'
            )}
            aria-label={`Jump to ${letter}`}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Get the first letter of a name, normalized to uppercase.
 * Non-alphabetic characters return '#'.
 */
export function getFirstLetter(name: string): string {
  const first = name.trim().charAt(0).toUpperCase();
  return /[A-Z]/.test(first) ? first : '#';
}

/**
 * Group items by their first letter.
 */
export function groupByLetter<T>(
  items: T[],
  getName: (item: T) => string
): Map<string, T[]> {
  const groups = new Map<string, T[]>();

  // Initialize all letters
  for (const letter of ALPHABET) {
    groups.set(letter, []);
  }
  groups.set('#', []); // For non-alphabetic

  // Group items
  for (const item of items) {
    const letter = getFirstLetter(getName(item));
    const group = groups.get(letter) ?? [];
    group.push(item);
    groups.set(letter, group);
  }

  return groups;
}

/**
 * Get set of letters that have items.
 */
export function getAvailableLetters<T>(
  items: T[],
  getName: (item: T) => string
): Set<string> {
  const letters = new Set<string>();
  for (const item of items) {
    letters.add(getFirstLetter(getName(item)));
  }
  return letters;
}
