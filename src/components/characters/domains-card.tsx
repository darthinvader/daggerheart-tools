import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type DomainsCardProps = {
  onEdit?: () => void;
  disabled?: boolean;
};

export function DomainsCard({ onEdit, disabled = true }: DomainsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Domains & Loadout</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          Loadout, Vault, selection…
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
