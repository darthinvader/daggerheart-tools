import type { LucideIcon } from 'lucide-react';
import { Minus, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { RESOURCE_CONFIG } from './constants';
import type { ResourcesState, ResourceValue } from './resources-display';

interface QuickResourceCardProps {
  resourceKey: keyof ResourcesState;
  label: string;
  icon: LucideIcon;
  color: string;
  resource: ResourceValue;
  onChange?: (key: keyof ResourcesState, current: number) => void;
  readOnly?: boolean;
}

function QuickResourceCard({
  resourceKey,
  label,
  icon: Icon,
  color,
  resource,
  onChange,
  readOnly,
}: QuickResourceCardProps) {
  const handleDecrement = () => {
    if (resource.current > 0) onChange?.(resourceKey, resource.current - 1);
  };
  const handleIncrement = () => {
    if (resource.current < resource.max)
      onChange?.(resourceKey, resource.current + 1);
  };
  return (
    <div className="flex flex-col items-center rounded-lg border p-2 sm:p-3">
      <Icon className="size-4 sm:size-6" />
      <span className="text-muted-foreground text-[10px] sm:text-xs">
        {label}
      </span>
      <span className={cn('text-base font-bold sm:text-xl', color)}>
        {resource.current}/{resource.max}
      </span>
      {!readOnly && onChange && (
        <div className="mt-1 flex items-center gap-0.5 sm:mt-2 sm:gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-6 sm:size-7"
            onClick={handleDecrement}
            disabled={resource.current <= 0}
          >
            <Minus className="size-2.5 sm:size-3" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-6 sm:size-7"
            onClick={handleIncrement}
            disabled={resource.current >= resource.max}
          >
            <Plus className="size-2.5 sm:size-3" />
          </Button>
        </div>
      )}
    </div>
  );
}

interface ResourcesDetailedDisplayProps {
  resources: ResourcesState;
  onChange?: (key: keyof ResourcesState, current: number) => void;
  readOnly?: boolean;
}

export function ResourcesDetailedDisplay({
  resources,
  onChange,
  readOnly,
}: ResourcesDetailedDisplayProps) {
  const displayableResources = RESOURCE_CONFIG.filter(
    ({ key }) => resources[key] !== undefined
  );

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      {displayableResources.map(({ key, label, icon, color }) => (
        <QuickResourceCard
          key={key}
          resourceKey={key}
          label={label}
          icon={icon}
          color={color}
          resource={resources[key] as ResourceValue}
          onChange={onChange}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
}
