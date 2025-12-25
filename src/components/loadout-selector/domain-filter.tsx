import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DOMAIN_COLORS, DOMAIN_EMOJIS } from '@/lib/schemas/loadout';
import { cn } from '@/lib/utils';

interface DomainFilterProps {
  domains: string[];
  selectedDomains: string[];
  onToggle: (domain: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export function DomainFilter({
  domains,
  selectedDomains,
  onToggle,
  onSelectAll,
  onClearAll,
}: DomainFilterProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Filter by Domain</span>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onSelectAll}>
            Select All
          </Button>
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            Clear
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {domains.map(domain => {
          const isSelected = selectedDomains.includes(domain);
          const colorClass = DOMAIN_COLORS[domain] ?? 'text-foreground';

          return (
            <Badge
              key={domain}
              variant={isSelected ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer transition-all hover:opacity-80',
                isSelected ? '' : colorClass
              )}
              onClick={() => onToggle(domain)}
              role="button"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onToggle(domain);
                }
              }}
            >
              {DOMAIN_EMOJIS[domain]} {domain}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
