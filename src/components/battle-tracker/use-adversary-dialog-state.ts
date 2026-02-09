/**
 * Hook for managing AddAdversaryDialogEnhanced state
 *
 * Extracts state management to reduce component complexity.
 */
import { useCallback, useMemo, useState } from 'react';

import type { Adversary } from '@/lib/schemas/adversaries';

interface UseAdversaryDialogStateProps {
  adversaries: Adversary[];
  onAdd: (adversary: Adversary) => void;
  onOpenChange: (open: boolean) => void;
}

// --- Pure helper functions extracted to reduce cyclomatic complexity ---

function matchesSearch(adv: Adversary, search: string): boolean {
  if (search === '') return true;
  const lowerSearch = search.toLowerCase();
  return (
    adv.name.toLowerCase().includes(lowerSearch) ||
    adv.description.toLowerCase().includes(lowerSearch)
  );
}

function matchesFilter(value: string, filter: string): boolean {
  return filter === 'All' || value === filter;
}

function filterAdversaries(
  adversaries: Adversary[],
  search: string,
  tierFilter: string,
  roleFilter: string
): Adversary[] {
  return adversaries.filter(
    adv =>
      matchesSearch(adv, search) &&
      matchesFilter(adv.tier, tierFilter) &&
      matchesFilter(adv.role, roleFilter)
  );
}

function countActiveFilters(tierFilter: string, roleFilter: string): number {
  return (tierFilter !== 'All' ? 1 : 0) + (roleFilter !== 'All' ? 1 : 0);
}

function sumSelections(selections: Map<string, number>): number {
  let total = 0;
  selections.forEach(count => {
    total += count;
  });
  return total;
}

function applySelectionDelta(
  prev: Map<string, number>,
  name: string,
  delta: number
): Map<string, number> {
  const next = new Map(prev);
  const newCount = (next.get(name) ?? 0) + delta;
  if (newCount <= 0) {
    next.delete(name);
  } else {
    next.set(name, newCount);
  }
  return next;
}

function removeFromMap(
  prev: Map<string, number>,
  name: string
): Map<string, number> {
  const next = new Map(prev);
  next.delete(name);
  return next;
}

function addSelectionsToEncounter(
  selections: Map<string, number>,
  allAdversaries: Adversary[],
  onAdd: (adversary: Adversary) => void
): void {
  selections.forEach((count, name) => {
    const adv = allAdversaries.find(a => a.name === name);
    if (!adv) return;
    for (let i = 0; i < count; i++) {
      onAdd(adv);
    }
  });
}

function setSelectionCount(
  prev: Map<string, number>,
  name: string,
  count: number
): Map<string, number> {
  const next = new Map(prev);
  next.set(name, count);
  return next;
}

// --- Main hook ---

export function useAdversaryDialogState({
  adversaries,
  onAdd,
  onOpenChange,
}: UseAdversaryDialogStateProps) {
  // Search & filter state
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('All');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  // UI state
  const [showHelp, setShowHelp] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewingAdversary, setViewingAdversary] = useState<Adversary | null>(
    null
  );
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);

  // Selection state
  const [selections, setSelections] = useState<Map<string, number>>(new Map());
  const [customAdversaries, setCustomAdversaries] = useState<Adversary[]>([]);

  // Combine SRD adversaries with custom ones
  const allAdversaries = useMemo(
    () => [...customAdversaries, ...adversaries],
    [adversaries, customAdversaries]
  );

  const filtered = useMemo(
    () => filterAdversaries(allAdversaries, search, tierFilter, roleFilter),
    [allAdversaries, search, tierFilter, roleFilter]
  );

  const activeFilters = countActiveFilters(tierFilter, roleFilter);

  const totalSelected = useMemo(() => sumSelections(selections), [selections]);

  // Actions
  const clearFilters = useCallback(() => {
    setTierFilter('All');
    setRoleFilter('All');
    setSearch('');
  }, []);

  const updateSelection = useCallback((name: string, delta: number) => {
    setSelections(prev => applySelectionDelta(prev, name, delta));
  }, []);

  const removeSelection = useCallback((name: string) => {
    setSelections(prev => removeFromMap(prev, name));
  }, []);

  const clearAllSelections = useCallback(() => {
    setSelections(new Map());
  }, []);

  const handleAddSelected = useCallback(() => {
    addSelectionsToEncounter(selections, allAdversaries, onAdd);
    setSelections(new Map());
    onOpenChange(false);
  }, [selections, allAdversaries, onAdd, onOpenChange]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setSelections(new Map());
        setViewingAdversary(null);
      }
      onOpenChange(open);
    },
    [onOpenChange]
  );

  const handleAddCustomAdversary = useCallback((adversary: Adversary) => {
    setCustomAdversaries(prev => [adversary, ...prev]);
    setSelections(prev => setSelectionCount(prev, adversary.name, 1));
    setShowCustomBuilder(false);
  }, []);

  const toggleExpand = useCallback(
    (name: string) => setExpandedId(prev => (prev === name ? null : name)),
    []
  );

  const toggleFilters = useCallback(() => setShowFilters(prev => !prev), []);

  const toggleHelp = useCallback(() => setShowHelp(prev => !prev), []);

  return {
    // Filter state
    search,
    setSearch,
    tierFilter,
    setTierFilter,
    roleFilter,
    setRoleFilter,
    showFilters,
    toggleFilters,
    activeFilters,
    clearFilters,

    // UI state
    showHelp,
    toggleHelp,
    expandedId,
    toggleExpand,
    viewingAdversary,
    setViewingAdversary,
    showCustomBuilder,
    setShowCustomBuilder,

    // Selection state
    selections,
    totalSelected,
    updateSelection,
    removeSelection,
    clearAllSelections,

    // Computed
    filtered,

    // Actions
    handleAddSelected,
    handleOpenChange,
    handleAddCustomAdversary,
  };
}
