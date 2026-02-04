import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Power } from '@/lib/icons';
import { cn } from '@/lib/utils';

interface ClassFeaturesCardProps {
  features: ReadonlyArray<{
    readonly name: string;
    readonly description: string;
  }>;
  disabledFeatures?: Set<string>;
  onToggleFeature?: (featureName: string) => void;
}

export function ClassFeaturesCard({
  features,
  disabledFeatures,
  onToggleFeature,
}: ClassFeaturesCardProps) {
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  if (!features.length) return null;

  const toggleItem = (idx: number) => {
    setOpenItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 px-1 text-sm font-medium">
        <span>⭐</span>
        <span>Class Features</span>
        <Badge variant="secondary" className="text-xs">
          {features.length}
        </Badge>
      </div>
      <div className="space-y-1">
        {features.map((feature, idx) => {
          const isDisabled = disabledFeatures?.has(feature.name);
          return (
            <Collapsible
              key={idx}
              open={openItems[idx]}
              onOpenChange={() => toggleItem(idx)}
            >
              <div
                className={cn(
                  'flex w-full items-center gap-1 rounded border bg-green-500/5',
                  isDisabled && 'opacity-50'
                )}
              >
                <CollapsibleTrigger className="flex flex-1 items-center justify-between px-2.5 py-1.5 text-left text-sm hover:bg-green-500/10">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{feature.name}</span>
                    <Badge
                      variant="outline"
                      className="border-green-500/30 bg-green-500/10 text-[10px] text-green-700"
                    >
                      ✓
                    </Badge>
                  </div>
                  <span
                    className={cn(
                      'text-muted-foreground text-xs transition-transform',
                      openItems[idx] && 'rotate-180'
                    )}
                  >
                    ▼
                  </span>
                </CollapsibleTrigger>
                {onToggleFeature && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mr-1 h-7 w-7 p-0"
                    onClick={e => {
                      e.stopPropagation();
                      onToggleFeature(feature.name);
                    }}
                    title={
                      isDisabled ? 'Activate feature' : 'Deactivate feature'
                    }
                  >
                    <Power
                      className={cn(
                        'h-4 w-4',
                        !isDisabled ? 'text-green-500' : 'text-muted-foreground'
                      )}
                    />
                  </Button>
                )}
              </div>
              <CollapsibleContent>
                <p className="text-muted-foreground bg-muted/20 rounded-b border-x border-b px-2.5 py-2 text-xs">
                  {feature.description}
                </p>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
}
