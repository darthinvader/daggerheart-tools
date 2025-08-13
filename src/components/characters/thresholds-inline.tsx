import { ArrowDownToLine, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';

import * as React from 'react';

import { DrawerScaffold } from '@/components/drawers/drawer-scaffold';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { formatThresholdChip } from '@/features/characters/logic/thresholds-format';
import { useThresholdsSettings } from '@/features/characters/logic/use-thresholds';

type ThresholdsInlineProps = {
  id: string;
  onDamage: (hpDelta: number) => void;
  className?: string;
};

export function ThresholdsInline({
  id,
  onDamage,
  className,
}: ThresholdsInlineProps) {
  const [open, setOpen] = React.useState(false);
  const {
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
  } = useThresholdsSettings({ id, refreshKey: open });

  const used = settings.auto ? auto : settings.values;
  const dsUsed = settings.auto
    ? auto.severe * 2
    : Number(dsInput || used.severe * 2);

  const handleDamageClick = (label: 1 | 2 | 3 | 4) => {
    if (label === 4) {
      onDamage(-4);
      return;
    }
    const delta = label === 1 ? -1 : label === 2 ? -2 : -3;
    onDamage(delta);
  };

  return (
    <div className={className}>
      {/* Header with label (left) and edit icon (right), spanning full width */}
      <div className="mb-1 flex w-full items-center justify-between gap-1">
        <span className="text-muted-foreground text-xs">Thresholds:</span>
        <Button
          type="button"
          aria-label="Open thresholds drawer"
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
          title="Open thresholds settings"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>
      {/* Interleaved row centered on X, full width */}
      <div className="flex w-full items-center justify-center gap-2 overflow-x-auto whitespace-nowrap">
        {/* Interleaved: 1  M:X  2  S:Y  3  DS:Z  4 */}
        <Button
          key={1}
          size="sm"
          className="h-7 bg-emerald-600 px-2 text-sm font-medium text-white hover:bg-emerald-600/90"
          variant="default"
          aria-label="Apply 1 HP damage (Minor)"
          onClick={() => handleDamageClick(1)}
          title="Minor = 1 HP"
        >
          1
        </Button>
        <span className="text-xs" title="Major threshold">
          {formatThresholdChip('major', used.major)}
        </span>
        <Button
          key={2}
          size="sm"
          className="h-7 bg-blue-600 px-2 text-sm font-medium text-white hover:bg-blue-600/90"
          variant="default"
          aria-label="Apply 2 HP damage (Major)"
          onClick={() => handleDamageClick(2)}
          title="Major = 2 HP"
        >
          2
        </Button>
        <span className="text-xs" title="Severe threshold">
          {formatThresholdChip('severe', used.severe)}
        </span>
        <Button
          key={3}
          size="sm"
          className="h-7 bg-amber-600 px-2 text-sm font-medium text-white hover:bg-amber-600/90"
          variant="default"
          aria-label="Apply 3 HP damage (Severe)"
          onClick={() => handleDamageClick(3)}
          title="Severe = 3 HP"
        >
          3
        </Button>
        <span
          className={`text-xs ${!settings.enableCritical ? 'opacity-90' : ''}`}
          title={
            settings.enableCritical
              ? 'Double Severe threshold'
              : 'Double Severe threshold (Critical 4 HP is optional)'
          }
        >
          {formatThresholdChip('ds', dsUsed)}
          {!settings.enableCritical ? ' (4 opt)' : ''}
        </span>
        <Button
          size="sm"
          className="h-7 px-2 text-sm font-medium"
          variant={settings.enableCritical ? 'destructive' : 'outline'}
          aria-label="Apply 4 HP damage (Critical)"
          onClick={() => handleDamageClick(4)}
          disabled={!settings.enableCritical}
          title={
            settings.enableCritical
              ? `Critical at DS:${dsUsed} = 4 HP`
              : 'Enable in settings'
          }
        >
          4
        </Button>
      </div>
      <div className="text-muted-foreground mt-1 w-full text-center text-[11px]">
        Tap a number to apply damage. M=Major, S=Severe, DS=Double Severe.
      </div>

      <DrawerScaffold
        open={open}
        onOpenChange={setOpen}
        title="Damage thresholds"
        onCancel={() => {
          if (!settings.auto && invalidManual()) {
            toast('Cannot close', {
              description: 'Fix thresholds or enable Auto-calculate.',
            });
            return;
          }
          setOpen(false);
        }}
        onSubmit={() => {
          if (save()) setOpen(false);
        }}
        submitLabel="Save"
      >
        <div className="mx-auto max-w-screen-sm space-y-3 py-4 text-sm">
          <p className="text-muted-foreground">
            Minor = 1 HP, Major = 2 HP, Severe = 3 HP. Optional Critical = 4 HP.
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
          {/* Auto vs Custom with copy-down */}
          <div className="rounded-md border p-3">
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground text-xs">
                Auto-calculated
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-muted rounded px-1 py-0.5 text-xs">
                  Major: {auto.major}
                </span>
                <span className="bg-muted rounded px-1 py-0.5 text-xs">
                  Severe: {auto.severe}
                </span>
                {settings.enableCritical && (
                  <span className="bg-muted rounded px-1 py-0.5 text-xs">
                    DS (double severe): {auto.severe * 2}
                  </span>
                )}
              </div>
            </div>
            {/* Copy action placed directly under the Auto row and next to the toggle conceptually */}
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
                <span className="text-muted-foreground text-xs">
                  Custom Major:
                </span>
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
                    Custom Double Severe:
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
                    checked={!settings.auto && settings.values.dsOverride}
                    onCheckedChange={v =>
                      setSettings(s => ({
                        ...s,
                        values: {
                          ...s.values,
                          dsOverride: !s.auto && v,
                        },
                      }))
                    }
                    aria-label="Customize Double Severe"
                  />
                  <span className="text-muted-foreground text-xs select-none">
                    Customize Double Severe
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <div className="font-medium">Enable Critical (4 HP)</div>
              <div className="text-muted-foreground text-xs">
                Triggers when hit is at least Severe × 2.
              </div>
            </div>
            <Switch
              checked={settings.enableCritical ?? false}
              onCheckedChange={v =>
                setSettings(s => ({ ...s, enableCritical: v }))
              }
              aria-label="Toggle critical damage rule"
            />
          </div>
          {/* Current thresholds compact summary (responsive, wraps) */}
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

              <span className="opacity-60">•</span>
              <span className="bg-muted rounded px-1 py-0.5">3</span>
              <span title="Double Severe threshold">
                {formatThresholdChip('ds', displayDs)}
              </span>

              <span className="opacity-60">•</span>
              <span
                className={
                  settings.enableCritical
                    ? 'border-destructive/20 bg-destructive/10 text-destructive rounded border px-1 py-0.5'
                    : 'text-muted-foreground rounded border border-dashed px-1 py-0.5'
                }
                title={
                  settings.enableCritical
                    ? 'Critical enabled (4 HP)'
                    : 'Critical optional (4 HP)'
                }
              >
                4{!settings.enableCritical ? ' (optional)' : ''}
              </span>
            </div>
          </div>
          <div className="text-muted-foreground text-xs">
            How thresholds work: Minor is always 1 HP. When a hit is at most
            Major, it's Major (2 HP). When a hit is at most Severe, it's Severe
            (3 HP). If Critical is enabled and a hit is at least Double Severe,
            it's Critical (4 HP). Auto-calculate derives Major/Severe from your
            armor and level; turn off Auto to enter custom values.
          </div>
        </div>
      </DrawerScaffold>
    </div>
  );
}
