import { AlertTriangle, Sparkle, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { ICON_SIZE_MD } from '@/lib/icons';

const CostIcons = {
  recall: Zap,
  hope: Sparkle,
  stress: AlertTriangle,
} as const;
import { cn } from '@/lib/utils';
import type { ActivationCost, CardCosts } from '@/lib/utils/card-costs';
import { formatActivationCost, getTotalHopeCost } from '@/lib/utils/card-costs';

interface CardCostBadgesProps {
  costs: CardCosts;
  compact?: boolean;
}

function RecallCostBadge({
  cost,
  compact,
}: {
  cost: number;
  compact?: boolean;
}) {
  const isFree = cost === 0;

  return (
    <SmartTooltip
      content={
        <p className="text-sm">
          <strong>Recall Cost:</strong>{' '}
          {isFree
            ? 'Free to recall'
            : `Mark ${cost} Stress to recall from vault`}
        </p>
      }
    >
      <Badge
        variant={isFree ? 'secondary' : 'default'}
        className={cn(
          'cursor-help font-mono',
          !isFree && 'bg-rose-500 hover:bg-rose-600',
          compact && 'px-1.5 text-xs'
        )}
      >
        <CostIcons.recall size={ICON_SIZE_MD} className="mr-0.5 inline-block" />
        {isFree ? 'Free' : cost}
      </Badge>
    </SmartTooltip>
  );
}

function ActivationCostBadge({
  costs,
  compact,
}: {
  costs: ActivationCost[];
  compact?: boolean;
}) {
  const hopeCosts = costs.filter(c => c.type === 'Hope');
  if (hopeCosts.length === 0) return null;

  const totalHope = getTotalHopeCost(hopeCosts);
  const displayValue = totalHope === 'variable' ? 'X' : totalHope;

  return (
    <SmartTooltip
      content={
        <div className="space-y-1 text-sm">
          <p>
            <strong>Activation Cost:</strong>
          </p>
          {hopeCosts.map((cost, i) => (
            <p key={i}>• Spend {formatActivationCost(cost)}</p>
          ))}
        </div>
      }
    >
      <Badge
        variant="outline"
        className={cn(
          'cursor-help border-amber-500/50 font-mono text-amber-600',
          compact && 'px-1.5 text-xs'
        )}
      >
        <CostIcons.hope size={ICON_SIZE_MD} className="mr-0.5 inline-block" />
        {displayValue}
      </Badge>
    </SmartTooltip>
  );
}

function StressCostBadge({
  costs,
  compact,
}: {
  costs: ActivationCost[];
  compact?: boolean;
}) {
  const stressCosts = costs.filter(c => c.type === 'Stress');
  if (stressCosts.length === 0) return null;

  const totalStress = stressCosts.reduce(
    (sum, c) => sum + (c.amount === 'any' ? 0 : c.amount),
    0
  );

  return (
    <SmartTooltip
      content={
        <div className="space-y-1 text-sm">
          <p>
            <strong>Stress Cost:</strong>
          </p>
          {stressCosts.map((cost, i) => (
            <p key={i}>• Mark {formatActivationCost(cost)}</p>
          ))}
        </div>
      }
    >
      <Badge
        variant="outline"
        className={cn(
          'cursor-help border-purple-500/50 font-mono text-purple-600',
          compact && 'px-1.5 text-xs'
        )}
      >
        <CostIcons.stress size={ICON_SIZE_MD} className="mr-0.5 inline-block" />
        {totalStress}
      </Badge>
    </SmartTooltip>
  );
}

export function CardCostBadges({
  costs,
  compact = false,
}: CardCostBadgesProps) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-wrap items-center justify-end',
        compact ? 'gap-0.5' : 'gap-1'
      )}
    >
      <RecallCostBadge cost={costs.recallCost} compact={compact} />
      <ActivationCostBadge costs={costs.activationCosts} compact={compact} />
      <StressCostBadge costs={costs.activationCosts} compact={compact} />
    </div>
  );
}

export { ActivationCostBadge, RecallCostBadge, StressCostBadge };
