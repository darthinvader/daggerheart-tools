import { Badge } from '@/components/ui/badge';
import { getCardRecallCost } from '@/lib/data/domains';
import type { DomainCard } from '@/lib/schemas/domains';
import { cn } from '@/lib/utils';

interface DomainCardListItemProps {
  card: DomainCard;
  isSelected: boolean;
  onClick: () => void;
}

export function DomainCardListItem({
  card,
  isSelected,
  onClick,
}: DomainCardListItemProps) {
  return (
    <div
      className={cn(
        'cursor-pointer rounded-lg border p-3 transition-colors',
        isSelected ? 'border-primary bg-primary/10' : 'hover:bg-muted/50'
      )}
      onClick={onClick}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium">{card.name}</span>
        <Badge variant="outline">Lvl {card.level}</Badge>
        <Badge variant="secondary">{String(card.domain)}</Badge>
        <Badge>{String(card.type)}</Badge>
        <Badge variant="outline">
          Recall: {getCardRecallCost(card)} Stress
        </Badge>
      </div>
      <p className="text-muted-foreground mt-2 text-sm whitespace-pre-wrap">
        {card.description}
      </p>
    </div>
  );
}
