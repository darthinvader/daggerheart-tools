import * as React from 'react';

export interface ComparisonItem<T = unknown> {
  id: string;
  name: string;
  /** Full item data for rendering detailed comparison */
  data: T;
}

export interface CompareContextValue {
  compareItems: ComparisonItem[];
  addToCompare: (item: ComparisonItem) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
  maxItems: number;
}

export const CompareContext = React.createContext<CompareContextValue | null>(
  null
);

/**
 * Hook to access compare functionality
 */
export function useCompare(): CompareContextValue {
  const ctx = React.useContext(CompareContext);
  if (!ctx) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return ctx;
}
