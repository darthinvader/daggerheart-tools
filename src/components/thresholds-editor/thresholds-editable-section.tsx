import { useCallback, useMemo, useState } from 'react';

import { EditableSection } from '@/components/shared/editable-section';
import type { ThresholdsSettings } from '@/lib/schemas/character-state';
import { cn } from '@/lib/utils';

import { ThresholdsDisplay } from './thresholds-display';
import { ThresholdsEditor } from './thresholds-editor';

export interface ThresholdsAutoContext {
  armorThresholdsMajor?: number;
  armorThresholdsSevere?: number;
  level?: number;
}

interface ThresholdsEditableSectionProps {
  settings: ThresholdsSettings;
  onChange?: (settings: ThresholdsSettings) => void;
  autoContext?: ThresholdsAutoContext;
  baseHp?: number;
  className?: string;
  readOnly?: boolean;
}

function computeAutoThresholds(ctx: ThresholdsAutoContext) {
  const level = ctx.level ?? 1;
  const levelBonus = Math.max(0, level - 1);
  return {
    major: (ctx.armorThresholdsMajor ?? 5) + levelBonus,
    severe: (ctx.armorThresholdsSevere ?? 11) + levelBonus,
  };
}

function EmptyThresholds() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <span className="text-4xl opacity-50">💔</span>
      <p className="text-muted-foreground mt-2">No thresholds configured</p>
      <p className="text-muted-foreground text-sm">
        Click edit to configure damage thresholds
      </p>
    </div>
  );
}

export function ThresholdsEditableSection({
  settings,
  onChange,
  autoContext,
  baseHp = 6,
  className,
  readOnly = false,
}: ThresholdsEditableSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftSettings, setDraftSettings] =
    useState<ThresholdsSettings>(settings);

  const hasAutoContext = Boolean(autoContext);
  const autoThresholds = useMemo(
    () => computeAutoThresholds(autoContext ?? {}),
    [autoContext]
  );

  // Determine if auto from armor is enabled
  const isAutoFromArmor = hasAutoContext && (settings.auto ?? true);

  const handleEditToggle = useCallback(() => {
    if (!isEditing) {
      setDraftSettings(settings);
    }
    setIsEditing(prev => !prev);
  }, [isEditing, settings]);

  const handleSave = useCallback(() => {
    onChange?.(draftSettings);
  }, [draftSettings, onChange]);

  const handleCancel = useCallback(() => {
    setDraftSettings(settings);
  }, [settings]);

  const handleMinorChange = useCallback((value: number) => {
    setDraftSettings(prev => ({
      ...prev,
      values: { ...prev.values, major: value },
    }));
  }, []);

  const handleSevereChange = useCallback((value: number) => {
    setDraftSettings(prev => ({
      ...prev,
      values: { ...prev.values, severe: value },
    }));
  }, []);

  const handleMajorChange = useCallback((value: number) => {
    setDraftSettings(prev => ({
      ...prev,
      values: { ...prev.values, critical: value },
    }));
  }, []);

  const handleAutoChange = useCallback(
    (value: boolean) => {
      setDraftSettings(prev => ({
        ...prev,
        auto: value,
        // When enabling auto, set values from armor
        ...(value && hasAutoContext
          ? {
              values: {
                ...prev.values,
                major: autoThresholds.major,
                severe: autoThresholds.severe,
              },
            }
          : {}),
      }));
    },
    [hasAutoContext, autoThresholds]
  );

  const handleAutoMajorChange = useCallback((value: boolean) => {
    setDraftSettings(prev => ({
      ...prev,
      autoMajor: value,
    }));
  }, []);

  const handleShowMajorChange = useCallback((value: boolean) => {
    setDraftSettings(prev => ({
      ...prev,
      enableCritical: value,
    }));
  }, []);

  // Use auto values when enabled
  const effectiveSevere = isAutoFromArmor
    ? autoThresholds.severe
    : draftSettings.values.severe;

  const effectiveCritical =
    (draftSettings.autoMajor ?? true)
      ? effectiveSevere * 2
      : (draftSettings.values.critical ?? effectiveSevere * 2);

  const displayMajor = isAutoFromArmor
    ? autoThresholds.major
    : settings.values.major;
  const displaySevere = isAutoFromArmor
    ? autoThresholds.severe
    : settings.values.severe;

  const displayCritical =
    (settings.autoMajor ?? true)
      ? displaySevere * 2
      : (settings.values.critical ?? displaySevere * 2);

  const hasSettings = settings !== null;

  // Determine if we're in draft auto mode
  const isDraftAutoFromArmor = hasAutoContext && (draftSettings.auto ?? true);

  return (
    <EditableSection
      title="Damage Thresholds"
      emoji="💔"
      isEditing={isEditing}
      onEditToggle={handleEditToggle}
      onSave={handleSave}
      onCancel={handleCancel}
      showEditButton={!readOnly}
      modalSize="md"
      className={cn(className)}
      editTitle="Configure Damage Thresholds"
      editDescription="Set damage thresholds to determine how much damage marks HP."
      editContent={
        <ThresholdsEditor
          minor={
            isDraftAutoFromArmor
              ? autoThresholds.major
              : draftSettings.values.major
          }
          severe={
            isDraftAutoFromArmor
              ? autoThresholds.severe
              : draftSettings.values.severe
          }
          major={effectiveCritical}
          autoCalculate={draftSettings.auto ?? true}
          autoCalculateMajor={draftSettings.autoMajor ?? true}
          showMajor={draftSettings.enableCritical}
          onMinorChange={handleMinorChange}
          onSevereChange={handleSevereChange}
          onMajorChange={handleMajorChange}
          onAutoCalculateChange={handleAutoChange}
          onAutoCalculateMajorChange={handleAutoMajorChange}
          onShowMajorChange={handleShowMajorChange}
          baseHp={baseHp}
          autoLabel={hasAutoContext ? 'Auto from Armor' : undefined}
          autoTooltip={
            hasAutoContext
              ? `Auto Thresholds: Major ${autoThresholds.major}+, Severe ${autoThresholds.severe}+ (from armor + level)`
              : undefined
          }
        />
      }
    >
      {hasSettings ? (
        <div>
          {isAutoFromArmor && (
            <p className="text-muted-foreground mb-2 text-xs">
              Auto from armor
            </p>
          )}
          <ThresholdsDisplay
            minor={displayMajor}
            severe={displaySevere}
            major={displayCritical}
            showMajor={settings.enableCritical}
          />
        </div>
      ) : (
        <EmptyThresholds />
      )}
    </EditableSection>
  );
}
