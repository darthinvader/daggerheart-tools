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

  const filtered = useMemo(() => {
    return allAdversaries.filter(adv => {
      const matchesSearch =
        search === '' ||
        adv.name.toLowerCase().includes(search.toLowerCase()) ||
        adv.description.toLowerCase().includes(search.toLowerCase());
      const matchesTier = tierFilter === 'All' || adv.tier === tierFilter;
      const matchesRole = roleFilter === 'All' || adv.role === roleFilter;
      return matchesSearch && matchesTier && matchesRole;
    });
  }, [allAdversaries, search, tierFilter, roleFilter]);

  const activeFilters =
    (tierFilter !== 'All' ? 1 : 0) + (roleFilter !== 'All' ? 1 : 0);

  const totalSelected = useMemo(() => {
    let total = 0;
    selections.forEach(count => {
      total += count;
    });
    return total;
  }, [selections]);

  // Actions
  const clearFilters = useCallback(() => {
    setTierFilter('All');
    setRoleFilter('All');
    setSearch('');
  }, []);

  const updateSelection = useCallback((name: string, delta: number) => {
    setSelections(prev => {
      const next = new Map(prev);
      const current = next.get(name) ?? 0;
      const newCount = current + delta;
      if (newCount <= 0) {
        next.delete(name);
      } else {
        next.set(name, newCount);
      }
      return next;
    });
  }, []);

  const removeSelection = useCallback((name: string) => {
    setSelections(prev => {
      const next = new Map(prev);
      next.delete(name);
      return next;
    });
  }, []);

  const clearAllSelections = useCallback(() => {
    setSelections(new Map());
  }, []);

  const handleAddSelected = useCallback(() => {
    selections.forEach((count, name) => {
      const adv = allAdversaries.find(a => a.name === name);
      if (adv) {
        for (let i = 0; i < count; i++) {
          onAdd(adv);
        }
      }
    });
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
    setSelections(prev => {
      const next = new Map(prev);
      next.set(adversary.name, 1);
      return next;
    });
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
