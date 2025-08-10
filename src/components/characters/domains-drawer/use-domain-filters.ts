import * as React from 'react';

import { useDebouncedValue } from '@/hooks/use-debounced-value';

export type DomainFilters = {
  domainFilter: string;
  levelFilter: string;
  typeFilter: string;
  search: string;
  debouncedSearch: string;
  setDomainFilter: (v: string) => void;
  setLevelFilter: (v: string) => void;
  setTypeFilter: (v: string) => void;
  setSearch: (v: string) => void;
};

export function useDomainFilters(
  initial?: Partial<
    Pick<
      DomainFilters,
      'domainFilter' | 'levelFilter' | 'typeFilter' | 'search'
    >
  >
): DomainFilters {
  const [domainFilter, _setDomainFilter] = React.useState<string>(
    initial?.domainFilter ?? 'All'
  );
  const [levelFilter, _setLevelFilter] = React.useState<string>(
    initial?.levelFilter ?? 'All'
  );
  const [typeFilter, _setTypeFilter] = React.useState<string>(
    initial?.typeFilter ?? 'All'
  );
  const [search, _setSearch] = React.useState<string>(initial?.search ?? '');

  const setDomainFilter = React.useCallback((v: string) => {
    React.startTransition(() => _setDomainFilter(v));
  }, []);
  const setLevelFilter = React.useCallback((v: string) => {
    React.startTransition(() => _setLevelFilter(v));
  }, []);
  const setTypeFilter = React.useCallback((v: string) => {
    React.startTransition(() => _setTypeFilter(v));
  }, []);
  const setSearch = React.useCallback((v: string) => {
    React.startTransition(() => _setSearch(v));
  }, []);

  const debouncedSearch = useDebouncedValue(search, 200);

  return {
    domainFilter,
    levelFilter,
    typeFilter,
    search,
    debouncedSearch,
    setDomainFilter,
    setLevelFilter,
    setTypeFilter,
    setSearch,
  };
}
