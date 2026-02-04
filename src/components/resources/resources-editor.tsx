import { useMemo } from 'react';

import { LabeledCounter } from '@/components/shared/labeled-counter';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { SmartTooltip } from '@/components/ui/smart-tooltip';

import { RESOURCE_CONFIG } from './constants';
import type { AutoCalculateContext, ResourcesState } from './resources-display';
import {
  computeAutoResources,
  type ComputedAutoValues,
  handleAutoToggleUpdate,
  isResourceAutoDisabled,
  updateResourceValue,
} from './resources-utils';

type AutoToggleField = 'autoCalculateHp' | 'autoCalculateArmorScore';

interface ResourcesEditorProps {
  resources: ResourcesState;
  onChange: (resources: ResourcesState) => void;
  autoContext?: AutoCalculateContext;
}

interface AutoToggleItemProps {
  id: string;
  checked: boolean;
  onToggle: () => void;
  label: string;
  tooltip: string;
}

function AutoToggleItem({
  id,
  checked,
  onToggle,
  label,
  tooltip,
}: AutoToggleItemProps) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} checked={checked} onCheckedChange={onToggle} />
      <SmartTooltip content={tooltip}>
        <Label htmlFor={id} className="cursor-pointer">
          {label}
        </Label>
      </SmartTooltip>
    </div>
  );
}

function AutoCalculateToggles({
  resources,
  autoValues,
  onToggle,
}: {
  resources: ResourcesState;
  autoValues: ComputedAutoValues;
  onToggle: (field: AutoToggleField) => void;
}) {
  return (
    <div className="bg-muted/50 flex flex-wrap gap-4 rounded-lg border p-4">
      <AutoToggleItem
        id="auto-hp"
        checked={resources.autoCalculateHp ?? true}
        onToggle={() => onToggle('autoCalculateHp')}
        label="Auto HP"
        tooltip={`Auto HP: ${autoValues.maxHp} (class base; increase via level-up)`}
      />
      <AutoToggleItem
        id="auto-armor"
        checked={
          resources.autoCalculateArmorScore ??
          resources.autoCalculateArmor ??
          true
        }
        onToggle={() => onToggle('autoCalculateArmorScore')}
        label="Auto Armor Score"
        tooltip={`Auto Armor: ${autoValues.armorScore} (from equipped armor)`}
      />
    </div>
  );
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

  const handleAutoToggle = (field: AutoToggleField) => {
    onChange(handleAutoToggleUpdate(resources, field, autoValues));
  };

  return (
    <div className="space-y-6">
      {autoContext && (
        <AutoCalculateToggles
          resources={resources}
          autoValues={autoValues}
          onToggle={handleAutoToggle}
        />
      )}

      <div className="grid gap-6 sm:grid-cols-3">
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
              orientation="vertical"
            />
          );
        })}
      </div>
    </div>
  );
}
