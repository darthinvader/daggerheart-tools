import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DynamicIcon,
  EquipmentSlotIcons,
  Power,
  Sparkles,
  Wrench,
} from '@/lib/icons';
import { cn } from '@/lib/utils';

import { getSlotIcon } from '../constants';
import type { CustomEquipment } from '../custom-slot-editor';

interface CustomEquipmentSummaryCardProps {
  slot: CustomEquipment;
  isActivated?: boolean;
  onToggleActivated?: () => void;
}

export function CustomEquipmentSummaryCard({
  slot,
  isActivated = true,
  onToggleActivated,
}: CustomEquipmentSummaryCardProps) {
  const hasContent = slot.name || slot.description || slot.features.length > 0;
  const slotIcon = getSlotIcon(
    slot.slotIconKey as keyof typeof EquipmentSlotIcons
  );

  return (
    <div
      className={cn(
        'relative flex h-full flex-col rounded-lg border p-4',
        !hasContent ? 'border-dashed opacity-60' : 'bg-card',
        !isActivated && 'opacity-50'
      )}
    >
      {onToggleActivated && hasContent && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-1 right-1 z-10 h-7 w-7 p-0"
          onClick={e => {
            e.stopPropagation();
            onToggleActivated();
          }}
          title={isActivated ? 'Deactivate equipment' : 'Activate equipment'}
          aria-label={
            isActivated ? 'Deactivate equipment' : 'Activate equipment'
          }
        >
          <Power
            className={cn(
              'h-4 w-4',
              isActivated ? 'text-green-500' : 'text-muted-foreground'
            )}
          />
        </Button>
      )}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DynamicIcon icon={slotIcon} className="h-5 w-5" />
          <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {slot.slotName}
          </span>
        </div>
        <Badge
          variant="outline"
          className="flex items-center gap-1 text-[10px]"
        >
          <Wrench className="h-3 w-3" /> Custom
        </Badge>
      </div>

      <h3
        className={`text-lg font-bold ${!slot.name ? 'text-muted-foreground italic' : ''}`}
      >
        {slot.name || 'Unnamed'}
      </h3>

      {hasContent && (
        <div className="mt-3 flex-1 space-y-2">
          {slot.description && (
            <p className="text-muted-foreground text-sm italic">
              "{slot.description}"
            </p>
          )}

          {slot.features.length > 0 && (
            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
                <Sparkles className="h-3 w-3" /> Features:
              </p>
              {slot.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-muted/50 rounded px-2 py-1.5 text-xs"
                >
                  <span className="font-semibold">{feature.name}</span>
                  {feature.description && (
                    <span className="text-muted-foreground">
                      {' '}
                      — {feature.description}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
