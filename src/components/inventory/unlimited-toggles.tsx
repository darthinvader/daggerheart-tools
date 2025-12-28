import { Infinity as InfinityIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { cn } from '@/lib/utils';

interface UnlimitedSlotsToggleProps {
  enabled: boolean;
  onChange: (value: boolean) => void;
}

export function UnlimitedSlotsToggle({
  enabled,
  onChange,
}: UnlimitedSlotsToggleProps) {
  return (
    <SmartTooltip
      content={
        enabled
          ? '♾️ Unlimited slots enabled - click to disable'
          : '🎒 Limited slots - click to enable unlimited'
      }
    >
      <Button
        variant={enabled ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange(!enabled)}
        className={cn(
          'gap-1.5',
          enabled &&
            'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
        )}
      >
        <InfinityIcon className="size-4" />
        Slots
      </Button>
    </SmartTooltip>
  );
}

interface UnlimitedQuantityToggleProps {
  enabled: boolean;
  onChange: (value: boolean) => void;
}

export function UnlimitedQuantityToggle({
  enabled,
  onChange,
}: UnlimitedQuantityToggleProps) {
  return (
    <SmartTooltip
      content={
        enabled
          ? '♾️ Unlimited stacking enabled - click to disable'
          : '📦 Limited stacking - click to enable unlimited'
      }
    >
      <Button
        variant={enabled ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange(!enabled)}
        className={cn(
          'gap-1.5',
          enabled &&
            'bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600'
        )}
      >
        <InfinityIcon className="size-4" />
        Stack
      </Button>
    </SmartTooltip>
  );
}
