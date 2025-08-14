import { ArrowDownToLine } from 'lucide-react';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { formatThresholdChip } from '@/features/characters/logic/thresholds-format';
import { type ThresholdsSettings } from '@/features/characters/storage';

export type ThresholdValues = {
  major: number;
  severe: number;
};

export type ThresholdsSettingsPanelProps = {
  settings: ThresholdsSettings;
  setSettings: React.Dispatch<React.SetStateAction<ThresholdsSettings>>;
  auto: ThresholdValues;
  majorInput: string;
  setMajorInput: (v: string) => void;
  severeInput: string;
  setSevereInput: (v: string) => void;
  dsInput: string;
  setDsInput: (v: string) => void;
  displayMajor: string;
  displaySevere: string;
  displayDs: string;
  onSave: () => boolean;
};

export function ThresholdsSettingsPanel({
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
  onSave,
}: ThresholdsSettingsPanelProps) {
  return (
    <div className="mx-auto max-w-screen-sm space-y-3 py-4 text-sm">
      <p className="text-muted-foreground">
        Minor = 1 HP, Major = 2 HP, Severe = 3 HP. Optional Major Damage = 4 HP.
      </p>
      <div className="flex items-center justify-between rounded-md border p-3">
        <div>
          <div className="font-medium">Auto-calculate</div>
          <div className="text-muted-foreground text-xs">
            Uses armor base thresholds +1 per level.
          </div>
        </div>
        <Switch
          checked={settings.auto}
          onCheckedChange={v => setSettings(s => ({ ...s, auto: v }))}
          aria-label="Toggle auto-calculate thresholds"
        />
      </div>
      <div className="rounded-md border p-3">
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground text-xs">Auto-calculated</div>
          <div className="flex items-center gap-2">
            <span className="bg-muted rounded px-1 py-0.5 text-xs">
              Major: {auto.major}
            </span>
            <span className="bg-muted rounded px-1 py-0.5 text-xs">
              Severe: {auto.severe}
            </span>
            {settings.enableCritical && (
              <span className="bg-muted rounded px-1 py-0.5 text-xs">
                MD (major damage): {auto.severe * 2}
              </span>
            )}
          </div>
        </div>
        <div className="mt-2 flex items-center justify-end">
          <Button
            type="button"
            size="sm"
            variant="outline"
            aria-label="Copy auto thresholds to custom"
            title="Use these values as Custom"
            onClick={() => {
              setSettings(s => ({ ...s, auto: false }));
              setMajorInput(String(auto.major));
              setSevereInput(String(auto.severe));
            }}
            className="h-7"
          >
            <ArrowDownToLine className="mr-1 h-4 w-4" /> Replace Custom with
            Auto
          </Button>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs">Custom Major:</span>
            <Input
              type="text"
              inputMode="numeric"
              value={settings.auto ? String(auto.major) : majorInput}
              disabled={settings.auto}
              onChange={e => {
                const raw = e.target.value.trim();
                const val = raw === '' ? '' : raw.replace(/[^0-9]/g, '');
                setMajorInput(val);
              }}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs">
              Custom Severe:
            </span>
            <Input
              type="text"
              inputMode="numeric"
              value={settings.auto ? String(auto.severe) : severeInput}
              disabled={settings.auto}
              onChange={e => {
                const raw = e.target.value.trim();
                const val = raw === '' ? '' : raw.replace(/[^0-9]/g, '');
                setSevereInput(val);
              }}
            />
          </label>
          <div className="col-span-2 grid grid-cols-[1fr_auto] items-end gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">
                Custom Major Damage:
              </span>
              <Input
                type="text"
                inputMode="numeric"
                value={settings.auto ? String(auto.severe * 2) : dsInput}
                disabled={settings.auto || !settings.values.dsOverride}
                onChange={e => {
                  const raw = e.target.value.trim();
                  const val = raw === '' ? '' : raw.replace(/[^0-9]/g, '');
                  setDsInput(val);
                }}
              />
            </label>
            <label className="flex items-center gap-2 pb-1">
              <Switch
                checked={!settings.auto && !!settings.values.dsOverride}
                onCheckedChange={v =>
                  setSettings(s => ({
                    ...s,
                    values: { ...s.values, dsOverride: !s.auto && v },
                  }))
                }
                aria-label="Customize Major Damage"
              />
              <span className="text-muted-foreground text-xs select-none">
                Customize Major Damage
              </span>
            </label>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-md border p-3">
        <div>
          <div className="font-medium">Enable Major Damage (4 HP)</div>
          <div className="text-muted-foreground text-xs">
            Triggers when hit is at least Severe × 2.
          </div>
        </div>
        <Switch
          checked={settings.enableCritical ?? false}
          onCheckedChange={v => setSettings(s => ({ ...s, enableCritical: v }))}
          aria-label="Toggle Major Damage rule"
        />
      </div>
      <div className="rounded-md border p-3">
        <div className="text-muted-foreground mb-2 text-xs">
          Current thresholds
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          <span className="bg-muted rounded px-1 py-0.5">1</span>
          <span title="Major threshold">
            {formatThresholdChip('major', displayMajor)}
          </span>
          <span className="opacity-60">•</span>
          <span className="bg-muted rounded px-1 py-0.5">2</span>
          <span title="Severe threshold">
            {formatThresholdChip('severe', displaySevere)}
          </span>
          {settings.enableCritical && (
            <>
              <span className="opacity-60">•</span>
              <span className="bg-muted rounded px-1 py-0.5">3</span>
              <span title="Major Damage threshold">
                {formatThresholdChip('ds', displayDs)}
              </span>
              <span className="opacity-60">•</span>
              <span
                className={
                  'border-destructive/20 bg-destructive/10 text-destructive rounded border px-1 py-0.5'
                }
                title={'Major Damage enabled (4 HP)'}
              >
                4
              </span>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="button" onClick={onSave}>
          Save
        </Button>
      </div>
    </div>
  );
}
