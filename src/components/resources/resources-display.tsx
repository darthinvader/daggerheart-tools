import { Minus, Plus } from 'lucide-react';

import { useCallback, useMemo, useState } from 'react';

import { EditableSection } from '@/components/shared/editable-section';
import { LabeledCounter } from '@/components/shared/labeled-counter';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { cn } from '@/lib/utils';

import { RESOURCE_CONFIG } from './constants';
import {
  computeAutoResources,
  handleAutoToggleUpdate,
  isResourceAutoDisabled,
  updateResourceValue,
} from './resources-utils';

export interface ResourceValue {
  current: number;
  max: number;
}

export interface ResourcesState {
  hp: ResourceValue;
  stress: ResourceValue;
  hope: ResourceValue;
  armorScore: ResourceValue;
  autoCalculateHp?: boolean;
  autoCalculateArmor?: boolean;
}

export interface AutoCalculateContext {
  classHp?: number;
  classTier?: number;
  armorScore?: number;
}

interface ResourcesDisplayProps {
  resources: ResourcesState;
  onChange?: (resources: ResourcesState) => void;
  className?: string;
  readOnly?: boolean;
  autoContext?: AutoCalculateContext;
}

interface QuickResourceCardProps {
  resourceKey: keyof ResourcesState;
  label: string;
  emoji: string;
  color: string;
  resource: ResourceValue;
  onChange?: (key: keyof ResourcesState, current: number) => void;
  readOnly?: boolean;
}

function QuickResourceCard({
  resourceKey,
  label,
  emoji,
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
    <div className="flex flex-col items-center rounded-lg border p-3">
      <span className="text-2xl">{emoji}</span>
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className={cn('text-xl font-bold', color)}>
        {resource.current}/{resource.max}
      </span>
      {!readOnly && onChange && (
        <div className="mt-2 flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={handleDecrement}
            disabled={resource.current <= 0}
          >
            <Minus className="size-3" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={handleIncrement}
            disabled={resource.current >= resource.max}
          >
            <Plus className="size-3" />
          </Button>
        </div>
      )}
    </div>
  );
}

function ResourcesDetailedDisplay({
  resources,
  onChange,
  readOnly,
}: {
  resources: ResourcesState;
  onChange?: (key: keyof ResourcesState, current: number) => void;
  readOnly?: boolean;
}) {
  const displayableResources = RESOURCE_CONFIG.filter(
    ({ key }) => resources[key] !== undefined
  );

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {displayableResources.map(({ key, label, emoji, color }) => (
        <QuickResourceCard
          key={key}
          resourceKey={key}
          label={label}
          emoji={emoji}
          color={color}
          resource={resources[key] ?? { current: 0, max: 0 }}
          onChange={onChange}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
}

interface ResourcesEditorProps {
  resources: ResourcesState;
  onChange: (resources: ResourcesState) => void;
  autoContext?: AutoCalculateContext;
}

function ResourcesEditor({
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

export function ResourcesDisplay({
  resources,
  onChange,
  className,
  readOnly = false,
  autoContext,
}: ResourcesDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<ResourcesState>(resources);

  const handleEditToggle = useCallback(() => {
    setIsEditing(prev => !prev);
  }, []);

  const handleSave = useCallback(() => {
    onChange?.(draft);
  }, [draft, onChange]);

  const handleCancel = useCallback(() => {
    setDraft(resources);
  }, [resources]);

  const handleOpen = useCallback(() => {
    setDraft(resources);
    setIsEditing(true);
  }, [resources]);

  const handleQuickChange = useCallback(
    (key: keyof ResourcesState, current: number) => {
      const existingResource = resources[key];
      if (!existingResource || typeof existingResource === 'boolean') return;
      const updated = { ...resources, [key]: { ...existingResource, current } };
      onChange?.(updated);
    },
    [resources, onChange]
  );

  return (
    <EditableSection
      title="Resources"
      emoji="💪"
      isEditing={isEditing}
      onEditToggle={isEditing ? handleEditToggle : handleOpen}
      showEditButton={!readOnly}
      modalSize="lg"
      className={cn(className)}
      editTitle="Manage Resources"
      editDescription="Track your character's HP, Stress, Hope, Armor, and Evasion."
      onSave={handleSave}
      onCancel={handleCancel}
      editContent={
        <ResourcesEditor
          resources={draft}
          onChange={setDraft}
          autoContext={autoContext}
        />
      }
    >
      <ResourcesDetailedDisplay
        resources={resources}
        onChange={handleQuickChange}
        readOnly={readOnly}
      />
    </EditableSection>
  );
}
