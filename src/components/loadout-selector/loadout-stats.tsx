import { Badge } from '@/components/ui/badge';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import type { LoadoutSelection } from '@/lib/schemas/loadout';

export function LoadoutStats({ selection }: { selection: LoadoutSelection }) {
  const uniqueDomains = [
    ...new Set([
      ...selection.activeCards.map(c => c.domain),
      ...selection.vaultCards.map(c => c.domain),
    ]),
  ];

  return (
    <div className="flex flex-wrap gap-2">
      <SmartTooltip content="Active cards ready to use">
        <Badge
          variant="outline"
          className="gap-1 border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/30"
        >
          ⚡ {selection.activeCards.length} Active
        </Badge>
      </SmartTooltip>
      <SmartTooltip content="Cards stored in vault">
        <Badge
          variant="outline"
          className="gap-1 border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/30"
        >
          📦 {selection.vaultCards.length} Vault
        </Badge>
      </SmartTooltip>
      {uniqueDomains.length > 0 && (
        <SmartTooltip content={`Domains: ${uniqueDomains.join(', ')}`}>
          <Badge variant="outline" className="gap-1">
            🌐 {uniqueDomains.length} Domain
            {uniqueDomains.length !== 1 ? 's' : ''}
          </Badge>
        </SmartTooltip>
      )}
    </div>
  );
}
