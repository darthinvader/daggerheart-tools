import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
};

export function DomainsCard({
  onEdit,
  disabled = false,
  summary,
}: DomainsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Domains & Loadout</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4">
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
        <Button
          size="sm"
          variant="outline"
          onClick={onEdit}
          disabled={disabled}
        >
          Edit
        </Button>
      </CardContent>
    </Card>
  );
}
