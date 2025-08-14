import { Badge } from '@/components/ui/badge';

export function TraitChips({
  traits,
  prefix = '🏷️',
}: {
  traits?: string[];
  prefix?: string;
}) {
  if (!traits?.length) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {traits.map(t => (
        <Badge key={t} variant="outline">
          {prefix} {t}
        </Badge>
      ))}
    </div>
  );
}
