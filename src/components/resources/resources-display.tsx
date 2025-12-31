import { Swords } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import {
  type ArmorState,
  DamageCalculator,
  type DamageResult,
  type HealthState,
} from '@/components/damage-calculator';
import {
  type DeathMoveState,
  DeathStatusIndicator,
} from '@/components/death-move';
import { EditableSection } from '@/components/shared/editable-section';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import { ResourcesDetailedDisplay } from './resources-detailed-display';
import { ResourcesEditor } from './resources-editor';

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
  autoCalculateEvasion?: boolean;
  autoCalculateArmorScore?: boolean;
  autoCalculateThresholds?: boolean;
  // Legacy field kept for backward compatibility
  autoCalculateArmor?: boolean;
}

export interface AutoCalculateContext {
  // Class-derived values
  classHp?: number;
  classEvasion?: number;
  classTier?: number;
  // Armor-derived values
  armorScore?: number;
  armorEvasionModifier?: number;
  armorThresholdsMajor?: number;
  armorThresholdsSevere?: number;
  // Level for threshold calculations
  level?: number;
}

export interface ThresholdsConfig {
  major: number;
  severe: number;
  critical?: number;
  enableCritical?: boolean;
}

interface ResourcesDisplayProps {
  resources: ResourcesState;
  onChange?: (resources: ResourcesState) => void;
  className?: string;
  readOnly?: boolean;
  autoContext?: AutoCalculateContext;
  deathState?: DeathMoveState;
  onTriggerDeathMove?: () => void;
  onWakeUp?: () => void;
  thresholds?: ThresholdsConfig;
  onApplyDamage?: (result: DamageResult) => void;
}

interface DamageCalculatorModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  armorState: ArmorState;
  healthState: HealthState | undefined;
  onApplyDamage: (result: DamageResult) => void;
}

function DamageCalculatorModal({
  isOpen,
  onOpenChange,
  armorState,
  healthState,
  onApplyDamage,
}: DamageCalculatorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-lg sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Swords className="size-5" />
            Damage Calculator
          </DialogTitle>
        </DialogHeader>
        {healthState && (
          <DamageCalculator
            armor={armorState}
            health={healthState}
            onApplyDamage={onApplyDamage}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function useResourcesDisplayState(
  resources: ResourcesState,
  onChange: ((resources: ResourcesState) => void) | undefined,
  onTriggerDeathMove: (() => void) | undefined,
  onApplyDamage: ((result: DamageResult) => void) | undefined
) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<ResourcesState>(resources);
  const [isDamageModalOpen, setIsDamageModalOpen] = useState(false);

  const handleEditToggle = useCallback(() => setIsEditing(prev => !prev), []);
  const handleSave = useCallback(() => onChange?.(draft), [draft, onChange]);
  const handleCancel = useCallback(() => setDraft(resources), [resources]);
  const handleOpen = useCallback(() => {
    setDraft(resources);
    setIsEditing(true);
  }, [resources]);

  const handleQuickChange = useCallback(
    (key: keyof ResourcesState, current: number) => {
      const existingResource = resources[key];
      if (!existingResource || typeof existingResource === 'boolean') return;
      onChange?.({ ...resources, [key]: { ...existingResource, current } });
      if (key === 'hp' && current <= 0) onTriggerDeathMove?.();
    },
    [resources, onChange, onTriggerDeathMove]
  );

  const handleDamageApply = useCallback(
    (result: DamageResult) => {
      onApplyDamage?.(result);
      setIsDamageModalOpen(false);
    },
    [onApplyDamage]
  );

  return {
    isEditing,
    draft,
    setDraft,
    isDamageModalOpen,
    setIsDamageModalOpen,
    handleEditToggle,
    handleSave,
    handleCancel,
    handleOpen,
    handleQuickChange,
    handleDamageApply,
  };
}

export function ResourcesDisplay({
  resources,
  onChange,
  className,
  readOnly = false,
  autoContext,
  deathState,
  onTriggerDeathMove,
  onWakeUp,
  thresholds,
  onApplyDamage,
}: ResourcesDisplayProps) {
  const {
    isEditing,
    draft,
    setDraft,
    isDamageModalOpen,
    setIsDamageModalOpen,
    handleEditToggle,
    handleSave,
    handleCancel,
    handleOpen,
    handleQuickChange,
    handleDamageApply,
  } = useResourcesDisplayState(
    resources,
    onChange,
    onTriggerDeathMove,
    onApplyDamage
  );

  // Extract primitive values for stable memo dependencies
  const armorCurrent = resources.armorScore.current;
  const armorMax = resources.armorScore.max;
  const hpCurrent = resources.hp.current;
  const hpMax = resources.hp.max;

  // Build armor and health state for damage calculator
  const armorState: ArmorState = useMemo(
    () => ({ current: armorCurrent, max: armorMax }),
    [armorCurrent, armorMax]
  );

  const healthState: HealthState | undefined = useMemo(() => {
    if (!thresholds) return undefined;
    return {
      current: hpCurrent,
      max: hpMax,
      thresholds: {
        major: thresholds.major,
        severe: thresholds.severe,
        critical: thresholds.critical,
      },
      enableCritical: thresholds.enableCritical,
    };
  }, [hpCurrent, hpMax, thresholds]);

  const showDeathIndicator =
    deathState &&
    (deathState.deathMovePending ||
      deathState.isUnconscious ||
      resources.hp.current <= 0);

  return (
    <>
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
        <div className="space-y-4">
          <ResourcesDetailedDisplay
            resources={resources}
            onChange={handleQuickChange}
            readOnly={readOnly}
          />
          {!readOnly && healthState && onApplyDamage && (
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => setIsDamageModalOpen(true)}
            >
              <Swords className="mr-2 size-4" />
              Take Damage
            </Button>
          )}
          {showDeathIndicator && (
            <DeathStatusIndicator
              state={deathState}
              onTriggerDeathMove={onTriggerDeathMove}
              onWakeUp={onWakeUp}
            />
          )}
        </div>
      </EditableSection>

      <DamageCalculatorModal
        isOpen={isDamageModalOpen}
        onOpenChange={setIsDamageModalOpen}
        armorState={armorState}
        healthState={healthState}
        onApplyDamage={handleDamageApply}
      />
    </>
  );
}
