import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export type SourceFilter = 'default' | 'homebrew' | 'all';

export function SourceFilterToggle({
  label = 'Source:',
  value,
  onChange,
  counts,
  size = 'lg',
}: {
  label?: string;
  value: SourceFilter;
  onChange: (v: SourceFilter) => void;
  counts: { default: number; homebrew: number; all: number };
  size?: 'sm' | 'lg';
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <ToggleGroup
        type="single"
        aria-label="Source filter"
        variant="outline"
        size={size}
        value={value}
        onValueChange={v => v && onChange(v as SourceFilter)}
      >
        <ToggleGroupItem value="default">
          Default ({counts.default})
        </ToggleGroupItem>
        <ToggleGroupItem value="homebrew">
          Homebrew ({counts.homebrew})
        </ToggleGroupItem>
        <ToggleGroupItem value="all">All ({counts.all})</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
