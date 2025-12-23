import { Input } from '@/components/ui/input';

import { SearchIcon } from './ancestry-icons';

interface AncestrySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function AncestrySearch({
  value,
  onChange,
  placeholder = 'Search ancestries...',
}: AncestrySearchProps) {
  return (
    <div className="relative">
      <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
        <SearchIcon />
      </span>
      <Input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10"
      />
    </div>
  );
}
