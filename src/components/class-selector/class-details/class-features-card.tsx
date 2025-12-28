import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface ClassFeaturesCardProps {
  features: ReadonlyArray<{
    readonly name: string;
    readonly description: string;
  }>;
}

export function ClassFeaturesCard({ features }: ClassFeaturesCardProps) {
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
        {features.map((feature, idx) => (
          <Collapsible
            key={idx}
            open={openItems[idx]}
            onOpenChange={() => toggleItem(idx)}
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded border bg-green-500/5 px-2.5 py-1.5 text-left text-sm hover:bg-green-500/10">
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
            <CollapsibleContent>
              <p className="text-muted-foreground bg-muted/20 rounded-b border-x border-b px-2.5 py-2 text-xs">
                {feature.description}
              </p>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
