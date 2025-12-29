import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CardSearchFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  domainFilter: string;
  onDomainFilterChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  availableDomains: string[];
}

export function CardSearchFilters({
  search,
  onSearchChange,
  domainFilter,
  onDomainFilterChange,
  typeFilter,
  onTypeFilterChange,
  availableDomains,
}: CardSearchFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Input
        placeholder="Search cards..."
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        className="min-w-[150px] flex-1"
      />
      <Select value={domainFilter} onValueChange={onDomainFilterChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Domain" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Domains</SelectItem>
          {availableDomains.map(d => (
            <SelectItem key={d} value={d}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Types</SelectItem>
          <SelectItem value="Spell">Spell</SelectItem>
          <SelectItem value="Ability">Ability</SelectItem>
          <SelectItem value="Grimoire">Grimoire</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
