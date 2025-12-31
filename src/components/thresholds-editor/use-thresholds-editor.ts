import { useCallback, useMemo, useState } from 'react';

import type { ThresholdsSettings } from '@/lib/schemas/character-state';

import type { ThresholdsAutoContext } from './thresholds-editable-section';

export function computeAutoThresholds(ctx: ThresholdsAutoContext) {
  const level = ctx.level ?? 1;
  const levelBonus = Math.max(0, level - 1);
  return {
    major: (ctx.armorThresholdsMajor ?? 5) + levelBonus,
    severe: (ctx.armorThresholdsSevere ?? 11) + levelBonus,
  };
}

interface UseThresholdsEditorParams {
  settings: ThresholdsSettings;
  onChange?: (settings: ThresholdsSettings) => void;
  autoContext?: ThresholdsAutoContext;
}

export function useThresholdsEditor({
  settings,
  onChange,
  autoContext,
}: UseThresholdsEditorParams) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftSettings, setDraftSettings] =
    useState<ThresholdsSettings>(settings);

  const hasAutoContext = Boolean(autoContext);
  const autoThresholds = useMemo(
    () => computeAutoThresholds(autoContext ?? {}),
    [autoContext]
  );

  const isAutoFromArmor = hasAutoContext && (settings.auto ?? true);
  const isDraftAutoFromArmor = hasAutoContext && (draftSettings.auto ?? true);

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

  const effectiveSevere = isDraftAutoFromArmor
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

  return {
    isEditing,
    draftSettings,
    autoThresholds,
    hasAutoContext,
    isAutoFromArmor,
    isDraftAutoFromArmor,
    effectiveCritical,
    displayMajor,
    displaySevere,
    displayCritical,
    handleEditToggle,
    handleSave,
    handleCancel,
    handleMinorChange,
    handleSevereChange,
    handleMajorChange,
    handleAutoChange,
    handleAutoMajorChange,
    handleShowMajorChange,
  };
}
