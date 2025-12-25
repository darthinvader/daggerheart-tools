import { SearchInput } from '@/components/shared';

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
    <SearchInput value={value} onChange={onChange} placeholder={placeholder} />
  );
}
