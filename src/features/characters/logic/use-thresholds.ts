import * as React from 'react';

import { computeAutoThresholds } from '@/features/characters/logic/progression';
import {
  computeDsValue,
  validateThresholdsManual,
} from '@/features/characters/logic/thresholds-util';
import {
  type ThresholdsSettings,
  readEquipmentFromStorage,
  readLevelFromStorage,
  readThresholdsSettingsFromStorage,
  writeThresholdsSettingsToStorage,
} from '@/features/characters/storage';

export type UseThresholdsArgs = {
  id?: string;
  refreshKey?: unknown; // pass drawer open state to re-read when opening
};

// Default settings for thresholds
const DEFAULT_SETTINGS: ThresholdsSettings = {
  auto: true,
  autoMajor: true,
  values: { major: 2, severe: 3, critical: 0, dsOverride: false, ds: 6 },
  enableCritical: false,
};

// Compute display value for major threshold
function computeDisplayMajor(
  isAuto: boolean,
  autoMajor: number,
  manualInput: string
): string {
  if (isAuto) return String(autoMajor);
  return manualInput === '' ? '—' : manualInput;
}

// Compute display value for severe threshold
function computeDisplaySevere(
  isAuto: boolean,
  autoSevere: number,
  manualInput: string
): string {
  if (isAuto) return String(autoSevere);
  return manualInput === '' ? '—' : manualInput;
}

// Compute display value for DS
function computeDisplayDs(
  isAuto: boolean,
  autoSevere: number,
  dsOverride: boolean,
  dsInput: string,
  severeInput: string
): string {
  if (isAuto) return String(autoSevere * 2);
  if (dsOverride) return dsInput || '—';
  const severeNum = Number(severeInput);
  return Number.isFinite(severeNum) ? String(severeNum * 2) : '—';
}

// Build manual settings object for persistence
function buildManualSettings(
  majorInput: string,
  severeInput: string,
  dsInput: string,
  settings: ThresholdsSettings
): ThresholdsSettings {
  const mj = Math.max(0, Number.parseInt(majorInput, 10));
  const sv = Math.max(0, Number.parseInt(severeInput, 10));
  const ds = computeDsValue(sv, settings.values.dsOverride ?? false, dsInput);
  return {
    auto: false,
    autoMajor: settings.autoMajor ?? false,
    values: {
      major: mj,
      severe: sv,
      critical: settings.values.critical ?? 0,
      dsOverride: settings.values.dsOverride ?? false,
      ds,
    },
    enableCritical: settings.enableCritical ?? false,
  };
}

export function useThresholdsSettings({ id, refreshKey }: UseThresholdsArgs) {
  const [settings, setSettings] =
    React.useState<ThresholdsSettings>(DEFAULT_SETTINGS);
  const [auto, setAuto] = React.useState({ major: 2, severe: 3 });
  const [majorInput, setMajorInput] = React.useState('');
  const [severeInput, setSevereInput] = React.useState('');
  const [dsInput, setDsInput] = React.useState('');

  // Load settings and compute auto thresholds
  React.useEffect(() => {
    if (!id) {
      setAuto({ major: 2, severe: 3 });
      return;
    }
    const lvl = readLevelFromStorage(id);
    const equip = readEquipmentFromStorage(id);
    setAuto(computeAutoThresholds(equip?.armor, lvl));
    const persisted = readThresholdsSettingsFromStorage(id);
    if (persisted) setSettings(persisted);
  }, [id, refreshKey]);

  // Sync manual inputs from settings when switching to manual
  React.useEffect(() => {
    if (!settings.auto) {
      setMajorInput(String(settings.values.major ?? ''));
      setSevereInput(String(settings.values.severe ?? ''));
      const dsVal = settings.values.dsOverride
        ? settings.values.ds
        : (settings.values.severe ?? 0) * 2;
      setDsInput(String(dsVal));
    }
  }, [
    settings.auto,
    settings.values.major,
    settings.values.severe,
    settings.values.dsOverride,
    settings.values.ds,
  ]);

  const displayMajor = computeDisplayMajor(
    settings.auto,
    auto.major,
    majorInput
  );
  const displaySevere = computeDisplaySevere(
    settings.auto,
    auto.severe,
    severeInput
  );
  const displayDs = computeDisplayDs(
    settings.auto,
    auto.severe,
    settings.values.dsOverride ?? false,
    dsInput,
    severeInput
  );

  const invalidManual = React.useCallback(() => {
    if (settings.auto) return false;
    return (
      validateThresholdsManual(
        majorInput,
        severeInput,
        settings.values.dsOverride ?? false,
        dsInput
      ) !== null
    );
  }, [
    settings.auto,
    majorInput,
    severeInput,
    settings.values.dsOverride,
    dsInput,
  ]);

  const save = React.useCallback(() => {
    if (!id) return true;
    if (!settings.auto) {
      if (invalidManual()) return false;
      writeThresholdsSettingsToStorage(
        id,
        buildManualSettings(majorInput, severeInput, dsInput, settings)
      );
    } else {
      writeThresholdsSettingsToStorage(id, settings);
    }
    return true;
  }, [id, settings, invalidManual, majorInput, severeInput, dsInput]);

  return {
    settings,
    setSettings,
    auto,
    majorInput,
    setMajorInput,
    severeInput,
    setSevereInput,
    dsInput,
    setDsInput,
    displayMajor,
    displaySevere,
    displayDs,
    invalidManual,
    save,
  } as const;
}
