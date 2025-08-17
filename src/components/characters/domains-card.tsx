import { DomainCardItem } from '@/components/characters/domain-card-item';
import { CharacterCardHeader } from '@/components/characters/presenters/card-header';
// Title becomes tappable; no separate header icon
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
  summary?: LoadoutSummary;
  loadout?: DomainCard[]; // actual selected cards to render below summary
  recallUsed?: number; // optional read-only sum of recallCost for current loadout
};

export function DomainsCard({
  onEdit,
  summary,
  loadout,
  recallUsed,
}: DomainsCardProps) {
  const isInteractive = (t: EventTarget | null) => {
    if (!(t instanceof HTMLElement)) return false;
    return !!t.closest(
      'button, a, input, textarea, select, [role="button"], [role="link"], [contenteditable="true"], [data-no-open]'
    );
  };
  return (
    <Card>
      <CharacterCardHeader
        title="Domains & Loadout"
        subtitle="Tap the title to edit"
        titleClassName="text-lg sm:text-xl"
        onTitleClick={onEdit}
      />
      <CardContent
        role={onEdit ? 'button' : undefined}
        tabIndex={onEdit ? 0 : undefined}
        onClick={e => {
          if (!onEdit || isInteractive(e.target)) return;
          onEdit();
        }}
        onKeyDown={e => {
          if (!onEdit || isInteractive(e.target)) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onEdit();
          }
        }}
        className="hover:bg-accent/30 focus-visible:ring-ring cursor-pointer gap-4 rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
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
