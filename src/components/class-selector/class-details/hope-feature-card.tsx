import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Sparkle } from '@/lib/icons';
import { cn } from '@/lib/utils';

interface HopeFeatureCardProps {
  feature: {
    readonly name: string;
    readonly description: string;
    readonly hopeCost: number;
  };
}

export function HopeFeatureCard({ feature }: HopeFeatureCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-1.5">
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
          <p className="text-muted-foreground rounded-b border-x border-b border-yellow-500/30 bg-yellow-500/5 px-2.5 py-2 text-xs">
            {feature.description}
          </p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
