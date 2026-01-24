import { Badge } from '@/components/ui/badge';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { Globe, ICON_SIZE_MD, Package, Zap } from '@/lib/icons';
import type { LoadoutSelection } from '@/lib/schemas/loadout';

export function LoadoutStats({ selection }: { selection: LoadoutSelection }) {
  const activeCards = selection?.activeCards ?? [];
  const vaultCards = selection?.vaultCards ?? [];

  const uniqueDomains = [
    ...new Set([
      ...activeCards.map(c => c.domain),
      ...vaultCards.map(c => c.domain),
    ]),
  ];

  return (
    <div className="flex flex-wrap gap-2">
      <SmartTooltip content="Active cards ready to use">
        <Badge
          variant="outline"
          className="gap-1 border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/30"
        >
          <Zap size={ICON_SIZE_MD} className="inline-block" />
          {activeCards.length} Active
        </Badge>
      </SmartTooltip>
      <SmartTooltip content="Cards stored in vault">
        <Badge
          variant="outline"
          className="gap-1 border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/30"
        >
          <Package size={ICON_SIZE_MD} className="inline-block" />
          {vaultCards.length} Vault
        </Badge>
      </SmartTooltip>
      {uniqueDomains.length > 0 && (
        <SmartTooltip content={`Domains: ${uniqueDomains.join(', ')}`}>
          <Badge variant="outline" className="gap-1">
            <Globe size={ICON_SIZE_MD} className="inline-block" />
            {uniqueDomains.length} Domain
            {uniqueDomains.length !== 1 ? 's' : ''}
          </Badge>
        </SmartTooltip>
      )}
    </div>
  );
}
