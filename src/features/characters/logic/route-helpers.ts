import * as React from 'react';

import type { DomainsDraft } from '@/features/characters/storage';
import { ALL_CLASSES } from '@/lib/data/classes';

// Build combobox items for class selection once
export function getClassItems() {
  return ALL_CLASSES.map(c => ({ value: c.name, label: c.name }));
}

export function getSubclassItems(className: string) {
  const found = ALL_CLASSES.find(c => c.name === className);
  if (!found) return [] as { value: string; label: string }[];
  const subclasses = (
    (found as unknown as { subclasses?: { name: string }[] }).subclasses ?? []
  ).map(s => s.name);
  return subclasses.map(name => ({ value: name, label: name }));
}

export function accessibleDomainsFor(className: string): string[] {
  const found = ALL_CLASSES.find(c => c.name === className);
  return (found && (found as unknown as { domains?: string[] }).domains) || [];
}

export function normalizeDomainLoadout(domainsDraft: DomainsDraft) {
  return domainsDraft.loadout.map(c => ({
    ...c,
    description: c.description ?? '',
  }));
}

// Warm up heavy drawer chunks during idle to make opening feel instant
export function useWarmupModules(tasks: Array<() => Promise<unknown>>) {
  React.useEffect(() => {
    let disposer: undefined | (() => void);
    let isMounted = true;
    const start = async () => {
      const { prefetchOnIdle } = await import('@/features/characters/prefetch');
      return prefetchOnIdle(() => {
        // Trigger dynamic imports lazily
        for (const t of tasks) void t();
      });
    };
    const promise = start();
    promise.then(fn => {
      if (typeof fn === 'function') {
        if (isMounted) {
          disposer = fn;
        } else {
          // Already unmounted, clean up immediately
          fn();
        }
      }
    });
    return () => {
      isMounted = false;
      if (disposer) disposer();
    };
  }, [tasks]);
}
