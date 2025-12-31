import { useMemo } from 'react';

import { LabeledCounter } from '@/components/shared/labeled-counter';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { SmartTooltip } from '@/components/ui/smart-tooltip';

import { RESOURCE_CONFIG } from './constants';
import type { AutoCalculateContext, ResourcesState } from './resources-display';
import {
  computeAutoResources,
  handleAutoToggleUpdate,
  isResourceAutoDisabled,
  updateResourceValue,
} from './resources-utils';

interface ResourcesEditorProps {
  resources: ResourcesState;
  onChange: (resources: ResourcesState) => void;
  autoContext?: AutoCalculateContext;
}

export function ResourcesEditor({
  resources,
  onChange,
  autoContext,
}: ResourcesEditorProps) {
  const autoValues = useMemo(
    () => computeAutoResources(autoContext ?? {}),
    [autoContext]
  );
  const hasAutoContext = Boolean(autoContext);

  const updateResource = (
    key: keyof ResourcesState,
    current: number,
    max?: number
  ) => {
    onChange(updateResourceValue(resources, key, current, max));
  };

  const handleAutoToggle = (
    field: 'autoCalculateHp' | 'autoCalculateArmor'
  ) => {
    onChange(handleAutoToggleUpdate(resources, field, autoValues));
  };

  return (
    <div className="space-y-6">
      {autoContext && (
        <div className="bg-muted/50 flex flex-wrap gap-4 rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="auto-hp"
              checked={resources.autoCalculateHp ?? true}
              onCheckedChange={() => handleAutoToggle('autoCalculateHp')}
            />
            <SmartTooltip
              content={`Auto HP: ${autoValues.maxHp} (class base + tier)`}
            >
              <Label htmlFor="auto-hp" className="cursor-pointer">
                Auto HP
              </Label>
            </SmartTooltip>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="auto-armor"
              checked={resources.autoCalculateArmor ?? true}
              onCheckedChange={() => handleAutoToggle('autoCalculateArmor')}
            />
            <SmartTooltip
              content={`Auto Armor: ${autoValues.armorScore} (from equipped armor)`}
            >
              <Label htmlFor="auto-armor" className="cursor-pointer">
                Auto Armor
              </Label>
            </SmartTooltip>
          </div>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        {RESOURCE_CONFIG.map(({ key, label }) => {
          const resource = resources[key];
          if (!resource || typeof resource === 'boolean') return null;
          const isAutoDisabled = isResourceAutoDisabled(
            key,
            resources,
            hasAutoContext
          );
          return (
            <LabeledCounter
              key={key}
              label={`${label}${isAutoDisabled ? ' (auto)' : ''}`}
              value={resource.current}
              onChange={val => updateResource(key, val)}
              min={0}
              maxValue={resource.max}
              onMaxChange={
                isAutoDisabled
                  ? undefined
                  : val => updateResource(key, resource.current, val)
              }
              maxLabel="Max"
            />
          );
        })}
      </div>
    </div>
  );
}
