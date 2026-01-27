import { HeartCrack } from 'lucide-react';

import { EditableSection } from '@/components/shared/editable-section';
import type { ThresholdsSettings } from '@/lib/schemas/character-state';
import { cn } from '@/lib/utils';

import { ThresholdsDisplay } from './thresholds-display';
import { ThresholdsEditor } from './thresholds-editor';
import { useThresholdsEditor } from './use-thresholds-editor';

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

function EmptyThresholds() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <HeartCrack className="size-10 opacity-50" />
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
  const {
    isEditing,
    draftSettings,
    autoThresholds,
    hasAutoContext,
    isAutoFromArmor,
    isDraftAutoFromArmor,
    effectiveMassiveDamage,
    displayMajor,
    displaySevere,
    displayMassiveDamage,
    handleEditToggle,
    handleSave,
    handleCancel,
    handleMajorChange,
    handleSevereChange,
    handleMassiveDamageChange,
    handleAutoChange,
    handleAutoMassiveDamageChange,
    handleShowMassiveDamageChange,
  } = useThresholdsEditor({ settings, onChange, autoContext });

  const hasSettings = settings !== null;

  return (
    <EditableSection
      title="Damage Thresholds"
      icon={HeartCrack}
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
          major={
            isDraftAutoFromArmor
              ? autoThresholds.major
              : draftSettings.values.major
          }
          severe={
            isDraftAutoFromArmor
              ? autoThresholds.severe
              : draftSettings.values.severe
          }
          massiveDamage={effectiveMassiveDamage}
          autoCalculate={draftSettings.auto ?? true}
          autoCalculateMassiveDamage={draftSettings.autoMajor ?? true}
          showMassiveDamage={draftSettings.enableCritical}
          onMajorChange={handleMajorChange}
          onSevereChange={handleSevereChange}
          onMassiveDamageChange={handleMassiveDamageChange}
          onAutoCalculateChange={handleAutoChange}
          onAutoCalculateMassiveDamageChange={handleAutoMassiveDamageChange}
          onShowMassiveDamageChange={handleShowMassiveDamageChange}
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
            major={displayMajor}
            severe={displaySevere}
            massiveDamage={displayMassiveDamage}
            showMassiveDamage={settings.enableCritical}
          />
        </div>
      ) : (
        <EmptyThresholds />
      )}
    </EditableSection>
  );
}
