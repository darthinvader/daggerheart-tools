import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { DomainCard } from '@/lib/schemas/domains';

type Props = {
  domainFilter: string;
  levelFilter: string;
  typeFilter: string;
  search: string;
  onDomainChange: (v: string) => void;
  onLevelChange: (v: string) => void;
  onTypeChange: (v: string) => void;
  onSearchChange: (v: string) => void;
  accessibleDomains?: string[];
  cardsForAnyTab?: DomainCard[];
};

export function DomainsFilterBar({
  domainFilter,
  levelFilter,
  typeFilter,
  search,
  onDomainChange,
  onLevelChange,
  onTypeChange,
  onSearchChange,
  accessibleDomains,
  cardsForAnyTab,
}: Props) {
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <FormItem>
          <FormLabel>Domain</FormLabel>
          <FormControl>
            <Select value={domainFilter} onValueChange={onDomainChange}>
              <SelectTrigger size="sm" className="min-w-28">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {(
                  accessibleDomains ?? [
                    ...new Set(
                      (cardsForAnyTab ?? []).map(c => String(c.domain))
                    ),
                  ]
                ).map(d => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel>Level</FormLabel>
          <FormControl>
            <Select value={levelFilter} onValueChange={onLevelChange}>
              <SelectTrigger size="sm" className="min-w-28">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(l => (
                  <SelectItem key={l} value={String(l)}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel>Type</FormLabel>
          <FormControl>
            <Select value={typeFilter} onValueChange={onTypeChange}>
              <SelectTrigger size="sm" className="min-w-28">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Spell">Spell</SelectItem>
                <SelectItem value="Ability">Ability</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      </div>
      <div>
        <FormItem>
          <FormLabel>Search</FormLabel>
          <FormControl>
            <Input
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search"
            />
          </FormControl>
        </FormItem>
      </div>
    </>
  );
}
