import { useCallback, useState } from 'react';

import { EditableSection } from '@/components/shared/editable-section';
import type { ThresholdsSettings } from '@/lib/schemas/character-state';
import { cn } from '@/lib/utils';

import { ThresholdsDisplay } from './thresholds-display';
import { ThresholdsEditor } from './thresholds-editor';

interface ThresholdsEditableSectionProps {
  settings: ThresholdsSettings;
  onChange?: (settings: ThresholdsSettings) => void;
  baseHp?: number;
  className?: string;
  readOnly?: boolean;
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
  baseHp = 6,
  className,
  readOnly = false,
}: ThresholdsEditableSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftSettings, setDraftSettings] =
    useState<ThresholdsSettings>(settings);

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
      values: { ...prev.values, ds: value },
    }));
  }, []);

  const handleAutoChange = useCallback((value: boolean) => {
    setDraftSettings(prev => ({
      ...prev,
      auto: value,
    }));
  }, []);

  const handleShowMajorChange = useCallback((value: boolean) => {
    setDraftSettings(prev => ({
      ...prev,
      enableCritical: value,
    }));
  }, []);

  const hasSettings = settings !== null;

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
          minor={draftSettings.values.major}
          severe={draftSettings.values.severe}
          major={draftSettings.values.ds}
          autoCalculate={draftSettings.auto}
          showMajor={draftSettings.enableCritical}
          onMinorChange={handleMinorChange}
          onSevereChange={handleSevereChange}
          onMajorChange={handleMajorChange}
          onAutoCalculateChange={handleAutoChange}
          onShowMajorChange={handleShowMajorChange}
          baseHp={baseHp}
        />
      }
    >
      {hasSettings ? (
        <ThresholdsDisplay
          minor={settings.values.major}
          severe={settings.values.severe}
          major={settings.values.ds}
          showMajor={settings.enableCritical}
        />
      ) : (
        <EmptyThresholds />
      )}
    </EditableSection>
  );
}
