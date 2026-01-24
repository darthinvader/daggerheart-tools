import { Button } from '@/components/ui/button';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { Backpack, Infinity as InfinityIcon, Package } from '@/lib/icons';
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
        enabled ? (
          <span className="flex items-center gap-1">
            <InfinityIcon className="inline-block size-4" /> Unlimited slots
            enabled - click to disable
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <Backpack className="inline-block size-4" /> Limited slots - click
            to enable unlimited
          </span>
        )
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
        enabled ? (
          <span className="flex items-center gap-1">
            <InfinityIcon className="inline-block size-4" /> Unlimited stacking
            enabled - click to disable
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <Package className="inline-block size-4" /> Limited stacking - click
            to enable unlimited
          </span>
        )
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
