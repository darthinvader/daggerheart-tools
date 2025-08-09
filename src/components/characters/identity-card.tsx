import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type IdentitySummary = {
  name: string;
  pronouns: string;
  ancestry: string;
  community: string;
};

export type IdentityCardProps = {
  identity: IdentitySummary;
  onEdit: () => void;
};

export function IdentityCard({ identity, onEdit }: IdentityCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Identity</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-muted-foreground text-sm">
          {identity.name ? (
            <div className="space-y-0.5">
              <div className="text-foreground font-medium">
                {identity.name}{' '}
                <span className="text-muted-foreground">
                  ({identity.pronouns})
                </span>
              </div>
              <div>
                {identity.ancestry} · {identity.community}
              </div>
            </div>
          ) : (
            <span>Name, pronouns, ancestry, community…</span>
          )}
        </div>
        <Button size="sm" variant="outline" onClick={onEdit}>
          Edit
        </Button>
      </CardContent>
    </Card>
  );
}
