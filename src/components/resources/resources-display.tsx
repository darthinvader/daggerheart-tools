import { Minus, Plus } from 'lucide-react';

import { useCallback, useMemo, useState } from 'react';

import { EditableSection } from '@/components/shared/editable-section';
import { LabeledCounter } from '@/components/shared/labeled-counter';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { cn } from '@/lib/utils';

export interface ResourceValue {
  current: number;
  max: number;
}

export interface ResourcesState {
  hp: ResourceValue;
  stress: ResourceValue;
  hope: ResourceValue;
  armorScore: ResourceValue;
  evasion?: ResourceValue;
  autoCalculateHp?: boolean;
  autoCalculateArmor?: boolean;
  autoCalculateEvasion?: boolean;
}

export const DEFAULT_RESOURCES_STATE: ResourcesState = {
  hp: { current: 10, max: 10 },
  stress: { current: 0, max: 6 },
  hope: { current: 2, max: 6 },
  armorScore: { current: 0, max: 0 },
  evasion: { current: 10, max: 10 },
  autoCalculateHp: true,
  autoCalculateArmor: true,
  autoCalculateEvasion: true,
};

export interface AutoCalculateContext {
  classHp?: number;
  classTier?: number;
  armorScore?: number;
  classEvasion?: number;
}

function computeAutoResources(ctx: AutoCalculateContext) {
  const baseHp = ctx.classHp ?? 6;
  const tierBonus = (ctx.classTier ?? 1) - 1;
  return {
    maxHp: baseHp + tierBonus,
    armorScore: ctx.armorScore ?? 0,
    evasion: ctx.classEvasion ?? 10,
  };
}

const RESOURCE_CONFIG = [
  {
    key: 'hp' as const,
    label: 'Hit Points',
    emoji: '❤️',
    color: 'text-red-500',
  },
  {
    key: 'stress' as const,
    label: 'Stress',
    emoji: '😰',
    color: 'text-yellow-500',
  },
  { key: 'hope' as const, label: 'Hope', emoji: '✨', color: 'text-blue-500' },
  {
    key: 'armorScore' as const,
    label: 'Armor Score',
    emoji: '🛡️',
    color: 'text-slate-500',
  },
  {
    key: 'evasion' as const,
    label: 'Evasion',
    emoji: '🏃',
    color: 'text-purple-500',
  },
];

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
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
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

  const updateResource = (
    key: keyof ResourcesState,
    current: number,
    max?: number
  ) => {
    const existingResource = resources[key];
    if (!existingResource || typeof existingResource === 'boolean') return;
    const newMax = max ?? existingResource.max;
    const clampedCurrent = Math.min(current, newMax);
    onChange({ ...resources, [key]: { current: clampedCurrent, max: newMax } });
  };

  const handleAutoToggle = (
    field: 'autoCalculateHp' | 'autoCalculateArmor' | 'autoCalculateEvasion'
  ) => {
    const newValue = !resources[field];
    const updates: Partial<ResourcesState> = { [field]: newValue };
    if (newValue) {
      if (field === 'autoCalculateHp') {
        updates.hp = {
          current: Math.min(resources.hp.current, autoValues.maxHp),
          max: autoValues.maxHp,
        };
      } else if (field === 'autoCalculateArmor') {
        updates.armorScore = {
          current: autoValues.armorScore,
          max: autoValues.armorScore,
        };
      } else if (field === 'autoCalculateEvasion') {
        updates.evasion = {
          current: autoValues.evasion,
          max: autoValues.evasion,
        };
      }
    }
    onChange({ ...resources, ...updates });
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
          <div className="flex items-center gap-2">
            <Checkbox
              id="auto-evasion"
              checked={resources.autoCalculateEvasion ?? true}
              onCheckedChange={() => handleAutoToggle('autoCalculateEvasion')}
            />
            <SmartTooltip
              content={`Auto Evasion: ${autoValues.evasion} (from class)`}
            >
              <Label htmlFor="auto-evasion" className="cursor-pointer">
                Auto Evasion
              </Label>
            </SmartTooltip>
          </div>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        {RESOURCE_CONFIG.map(({ key, label }) => {
          const resource = resources[key];
          if (!resource || typeof resource === 'boolean') return null;
          const isAutoDisabled =
            (key === 'hp' && resources.autoCalculateHp && autoContext) ||
            (key === 'armorScore' &&
              resources.autoCalculateArmor &&
              autoContext) ||
            (key === 'evasion' &&
              resources.autoCalculateEvasion &&
              autoContext);
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
      modalSize="md"
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
