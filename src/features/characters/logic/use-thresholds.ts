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

export function useThresholdsSettings({ id, refreshKey }: UseThresholdsArgs) {
  const [settings, setSettings] = React.useState<ThresholdsSettings>({
    auto: true,
    values: { major: 2, severe: 3, dsOverride: false, ds: 6 },
    enableCritical: false,
  });
  const [auto, setAuto] = React.useState({ major: 2, severe: 3 });
  const [majorInput, setMajorInput] = React.useState('');
  const [severeInput, setSevereInput] = React.useState('');
  const [dsInput, setDsInput] = React.useState('');

  // Load settings and compute auto thresholds
  React.useEffect(() => {
    if (!id) {
      // No context: stay with defaults
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

  const displayMajor = settings.auto
    ? String(auto.major)
    : majorInput === ''
      ? '—'
      : majorInput;
  const displaySevere = settings.auto
    ? String(auto.severe)
    : severeInput === ''
      ? '—'
      : severeInput;
  const displayDs = settings.auto
    ? String(auto.severe * 2)
    : String(
        settings.values.dsOverride
          ? dsInput || '—'
          : Number.isFinite(Number(severeInput))
            ? Number(severeInput) * 2
            : '—'
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
    if (!id) return true; // nothing to persist without id
    if (!settings.auto) {
      if (invalidManual()) return false;
      const mj = Math.max(0, Number.parseInt(majorInput, 10));
      const sv = Math.max(0, Number.parseInt(severeInput, 10));
      const ds = computeDsValue(
        sv,
        settings.values.dsOverride ?? false,
        dsInput
      );
      writeThresholdsSettingsToStorage(id, {
        auto: false,
        values: {
          major: mj,
          severe: sv,
          dsOverride: settings.values.dsOverride ?? false,
          ds,
        },
        enableCritical: settings.enableCritical ?? false,
      });
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
