import { Shield } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { ARMOR_SLOT_STYLES } from './constants';
import type { ArmorSlot } from './types';

interface ArmorSlotIconProps {
  slot: ArmorSlot;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function ArmorSlotIcon({
  slot,
  size = 'md',
  onClick,
}: ArmorSlotIconProps) {
  const styles = ARMOR_SLOT_STYLES[slot.state];
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };
  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const content = (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        'flex items-center justify-center rounded-md border-2 transition-all',
        sizeClasses[size],
        styles.bg,
        styles.border,
        onClick && 'cursor-pointer hover:scale-110 hover:brightness-110'
      )}
      aria-label={`${slot.source}: ${styles.label}`}
    >
      <Shield className={cn(iconSizes[size], 'text-white')} />
    </button>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent>
        <div className="text-sm">
          <div className="font-medium">{slot.source}</div>
          <div className="text-muted-foreground">{styles.label}</div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
