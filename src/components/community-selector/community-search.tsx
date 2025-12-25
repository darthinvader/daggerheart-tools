import { SearchInput } from '@/components/shared';

interface CommunitySearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function CommunitySearch({ value, onChange }: CommunitySearchProps) {
  return (
    <SearchInput
      value={value}
      onChange={onChange}
      placeholder="Search communities..."
    />
  );
}
