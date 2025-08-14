import { DomainCardItem } from '@/components/characters/domain-card-item';
import { CharacterCardHeader } from '@/components/characters/presenters/card-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { DomainCard } from '@/lib/schemas/domains';

export type LoadoutSummary = {
  total: number;
  byDomain: Array<{ domain: string; count: number }>;
  sample?: string[];
  byType?: Array<{ type: string; count: number }>;
};

export type DomainsCardProps = {
  onEdit?: () => void;
  disabled?: boolean;
  summary?: LoadoutSummary;
  loadout?: DomainCard[]; // actual selected cards to render below summary
  recallUsed?: number; // optional read-only sum of recallCost for current loadout
};

export function DomainsCard({
  onEdit,
  disabled = false,
  summary,
  loadout,
  recallUsed,
}: DomainsCardProps) {
  return (
    <Card>
      <CharacterCardHeader
        title="Domains & Loadout"
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={onEdit}
            disabled={disabled}
          >
            Edit
          </Button>
        }
      />
      <CardContent className="gap-4">
        <div className="text-sm">
          {summary ? (
            <div>
              <div className="font-medium">
                {summary.total} card{summary.total === 1 ? '' : 's'} active
              </div>
              <div className="text-muted-foreground text-xs">
                {summary.byDomain
                  .filter(d => d.count > 0)
                  .map(d => `${d.domain} ${d.count}`)
                  .join(' · ') || 'No active cards'}
              </div>
              {summary.byType && summary.byType.length > 0 ? (
                <div className="text-muted-foreground mt-1 text-xs">
                  {summary.byType
                    .filter(t => t.count > 0)
                    .map(t => `${t.type} ${t.count}`)
                    .join(' · ')}
                </div>
              ) : null}
              {typeof recallUsed === 'number' ? (
                <div className="text-muted-foreground mt-1 text-xs">
                  Recall used: <span className="font-medium">{recallUsed}</span>
                </div>
              ) : null}
              {summary.sample && summary.sample.length > 0 ? (
                <div className="text-muted-foreground mt-1 line-clamp-1 text-xs">
                  {summary.sample.join(', ')}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="text-muted-foreground">
              Loadout, Vault, selection…
            </div>
          )}
        </div>
      </CardContent>
      {loadout && loadout.length > 0 && (
        <div className="divide-border mx-4 mt-1 mb-4 rounded-md border">
          {loadout.map(card => (
            <DomainCardItem
              key={`sheet:${card.name}`}
              card={card}
              context="loadout"
              hideActions
            />
          ))}
        </div>
      )}
    </Card>
  );
}
