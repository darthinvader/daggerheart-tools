import { Badge } from '@/components/ui/badge';

import type { CustomEquipment } from '../custom-slot-editor';

interface CustomEquipmentSummaryCardProps {
  slot: CustomEquipment;
}

export function CustomEquipmentSummaryCard({
  slot,
}: CustomEquipmentSummaryCardProps) {
  const hasContent = slot.name || slot.description || slot.features.length > 0;

  return (
    <div
      className={`rounded-lg border p-4 ${!hasContent ? 'border-dashed opacity-60' : 'bg-card'}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{slot.slotIcon}</span>
          <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {slot.slotName}
          </span>
        </div>
        <Badge variant="outline" className="text-[10px]">
          🔧 Custom
        </Badge>
      </div>

      <h3
        className={`text-lg font-bold ${!slot.name ? 'text-muted-foreground italic' : ''}`}
      >
        {slot.name || 'Unnamed'}
      </h3>

      {hasContent && (
        <div className="mt-3 space-y-2">
          {slot.description && (
            <p className="text-muted-foreground text-sm italic">
              "{slot.description}"
            </p>
          )}

          {slot.features.length > 0 && (
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium">
                ✨ Features:
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
