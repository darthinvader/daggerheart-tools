/**
 * Alphabetical Content Grid State Hook
 *
 * Manages sorting, grouping, and navigation state for AlphabeticalContentGrid.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { getAvailableLetters, groupByLetter } from '../ui/alphabet-nav';

const INITIAL_LIMIT = 50;

interface UseAlphabeticalGridProps<T> {
  items: T[];
  getName: (item: T) => string;
}

export function useAlphabeticalGridState<T>({
  items,
  getName,
}: UseAlphabeticalGridProps<T>) {
  const [showAll, setShowAll] = useState(false);
  const [activeLetter, setActiveLetter] = useState<string | undefined>();
  const containerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Sort items alphabetically by name
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => getName(a).localeCompare(getName(b))),
    [items, getName]
  );

  // Group items by first letter
  const groupedItems = useMemo(
    () => groupByLetter(sortedItems, getName),
    [sortedItems, getName]
  );

  // Get available letters
  const availableLetters = useMemo(
    () => getAvailableLetters(sortedItems, getName),
    [sortedItems, getName]
  );

  // Get ordered letters that have items
  const orderedLetters = useMemo(() => {
    const letters = Array.from(availableLetters).sort();
    // Move '#' to the end if present
    const hashIndex = letters.indexOf('#');
    if (hashIndex !== -1) {
      letters.splice(hashIndex, 1);
      letters.push('#');
    }
    return letters;
  }, [availableLetters]);

  // Determine what to show based on showAll toggle
  const displayLimit = showAll ? Infinity : INITIAL_LIMIT;
  const totalCount = items.length;
  const needsShowAll = totalCount > INITIAL_LIMIT;

  // Scroll to a letter section
  const scrollToLetter = useCallback((letter: string) => {
    const element = letterRefs.current.get(letter);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveLetter(letter);
    }
  }, []);

  // Track active letter on scroll
  useEffect(() => {
    if (!showAll) return;

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const letter = entry.target.getAttribute('data-letter');
            if (letter) {
              setActiveLetter(letter);
              break;
            }
          }
        }
      },
      { rootMargin: '-100px 0px -80% 0px', threshold: 0 }
    );

    letterRefs.current.forEach(element => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [showAll]);

  // Register letter ref
  const setLetterRef = useCallback(
    (letter: string) => (el: HTMLDivElement | null) => {
      if (el) {
        letterRefs.current.set(letter, el);
      } else {
        letterRefs.current.delete(letter);
      }
    },
    []
  );

  return {
    // State
    showAll,
    setShowAll,
    activeLetter,

    // Refs
    containerRef,
    setLetterRef,

    // Data
    sortedItems,
    groupedItems,
    availableLetters,
    orderedLetters,
    displayLimit,
    totalCount,
    needsShowAll,

    // Actions
    scrollToLetter,
  };
}

export { INITIAL_LIMIT };
