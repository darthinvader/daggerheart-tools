import { Slash, Zap } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { useCoarsePointer } from '@/hooks/use-coarse-pointer';
import { ICON_SIZE_MD, Sparkle } from '@/lib/icons';
import { cn } from '@/lib/utils';

interface HopeFeatureCardProps {
  feature: {
    readonly name: string;
    readonly description: string;
    readonly hopeCost: number;
  };
  /** Whether this feature's bonuses are activated */
  isActivated?: boolean;
  /** Callback when the activate/deactivate button is clicked */
  onToggleActivated?: () => void;
}

export function HopeFeatureCard({
  feature,
  isActivated = true,
  onToggleActivated,
}: HopeFeatureCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isCoarse = useCoarsePointer();

  return (
    <div className="group relative space-y-1.5">
      {/* Activate/Deactivate button */}
      {onToggleActivated && (
        <div
          className={cn(
            'absolute top-0 right-0 z-10 transition-opacity',
            isCoarse ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}
        >
          <SmartTooltip
            content={isActivated ? 'Deactivate bonuses' : 'Activate bonuses'}
          >
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'size-6',
                isActivated
                  ? 'text-amber-600 hover:text-amber-700'
                  : 'text-muted-foreground'
              )}
              aria-pressed={isActivated}
              onClick={e => {
                e.stopPropagation();
                onToggleActivated();
              }}
            >
              {isActivated ? (
                <Zap size={ICON_SIZE_MD} />
              ) : (
                <Slash size={ICON_SIZE_MD} />
              )}
            </Button>
          </SmartTooltip>
        </div>
      )}

      <div className="flex items-center gap-2 px-1 text-sm font-medium">
        <Sparkle className="size-4" />
        <span>Hope Feature</span>
      </div>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded border border-yellow-500/30 bg-yellow-500/5 px-2.5 py-1.5 text-left text-sm hover:bg-yellow-500/10">
          <div className="flex items-center gap-2">
            <span className="font-medium">{feature.name}</span>
            <Badge variant="outline" className="text-[10px]">
              {feature.hopeCost} Hope
            </Badge>
          </div>
          <span
            className={cn(
              'text-muted-foreground text-xs transition-transform',
              isOpen && 'rotate-180'
            )}
          >
            ▼
          </span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p className="text-muted-foreground rounded-b border-x border-b border-yellow-500/30 bg-yellow-500/5 px-2.5 py-2 text-xs whitespace-pre-line">
            {feature.description}
          </p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
