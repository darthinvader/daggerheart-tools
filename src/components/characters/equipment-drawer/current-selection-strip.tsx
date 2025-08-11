import { Dice5, Hand, Ruler, Tag } from 'lucide-react';

// ... no React usage needed in this file

import { Badge } from '@/components/ui/badge';

export type CurrentSelectionStripProps = {
  kind: 'primary' | 'secondary' | 'armor';
  name: string;
  onClear: () => void;
  tags: Array<{
    label: string;
    icon?: 'trait' | 'range' | 'damage' | 'burden' | 'text';
  }>;
};

export function CurrentSelectionStrip({
  kind: _kind,
  name,
  onClear,
  tags,
}: CurrentSelectionStripProps) {
  return (
    <div className="bg-muted/30 rounded-md border px-3 py-2 text-xs">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 truncate">
          <span className="font-medium">Current:</span>{' '}
          <span className="truncate align-middle">{name}</span>
        </div>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground underline underline-offset-2"
          onClick={onClear}
        >
          Clear
        </button>
      </div>
      <div className="mt-1 flex flex-wrap gap-1">
        {tags.map((t, idx) => (
          <Badge
            key={`${t.label}-${idx}`}
            variant="outline"
            className="px-1 py-0 text-[10px]"
          >
            {t.icon === 'trait' ? (
              <Tag className="mr-1 inline size-3" aria-hidden />
            ) : null}
            {t.icon === 'range' ? (
              <Ruler className="mr-1 inline size-3" aria-hidden />
            ) : null}
            {t.icon === 'damage' ? (
              <Dice5 className="mr-1 inline size-3" aria-hidden />
            ) : null}
            {t.icon === 'burden' ? (
              <Hand className="mr-1 inline size-3" aria-hidden />
            ) : null}
            {t.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
