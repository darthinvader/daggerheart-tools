import type { ReactNode } from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { SearchIcon } from '../icons';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  icon?: ReactNode;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className,
  icon,
}: SearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
        {icon ?? <SearchIcon />}
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
