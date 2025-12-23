import { Input } from '@/components/ui/input';

import { SearchIcon } from './community-icons';

interface CommunitySearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function CommunitySearch({ value, onChange }: CommunitySearchProps) {
  return (
    <div className="relative">
      <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
        <SearchIcon />
      </span>
      <Input
        type="text"
        placeholder="Search communities..."
        value={value}
        onChange={e => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
