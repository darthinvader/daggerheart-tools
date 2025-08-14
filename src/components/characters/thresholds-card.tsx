import { Info } from 'lucide-react';
import { toast } from 'sonner';

import * as React from 'react';

import { CharacterCardHeader } from '@/components/characters/presenters/card-header';
import { ThresholdsSummary } from '@/components/characters/thresholds-summary';
import { DrawerScaffold } from '@/components/drawers/drawer-scaffold';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useThresholdsSettings } from '@/features/characters/logic/use-thresholds';

export type ThresholdsCardProps = {
  id?: string; // character id for storage
  className?: string;
};

export function ThresholdsCard({ id, className }: ThresholdsCardProps) {
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

  const onSubmit = () => {
    if (!settings.auto && invalidManual()) {
      toast.error('Fix thresholds', {
        description: 'Severe must be ≥ Major and both values must be set.',
      });
      return;
    }
    if (save()) setOpen(false);
  };
  const onCancel = () => {
    if (!settings.auto && invalidManual()) {
      toast('Cannot close', {
        description: 'Fix thresholds or enable Auto-calculate.',
      });
      return;
    }
    setOpen(false);
  };
  return (
    <Card id={id} className={className}>
      <CharacterCardHeader
        title="Damage Thresholds"
        actions={
          <Button
            type="button"
            aria-label="Explain thresholds"
            variant="ghost"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Info className="h-4 w-4" />
          </Button>
        }
      />
      <CardContent>
        <ThresholdsSummary
          major={displayMajor}
          severe={displaySevere}
          doubleSevere={displayDs}
        />
      </CardContent>
      <React.Suspense fallback={null}>
        <DrawerScaffold
          open={open}
          onOpenChange={setOpen}
          title="Damage thresholds"
          onCancel={onCancel}
          onSubmit={onSubmit}
          submitLabel="Save"
        >
          <div className="mx-auto max-w-screen-sm space-y-3 py-4 text-sm">
            <p>
              Minor damage costs 1 HP, Major costs 2 HP, and Severe costs 3 HP.
              Optional Major Damage costs 4 HP.
            </p>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <div className="font-medium">Auto-calculate</div>
                <div className="text-muted-foreground text-xs">
                  Uses your armor’s base thresholds plus +1 to each per level.
                </div>
              </div>
              <Switch
                checked={settings.auto}
                onCheckedChange={v => setSettings(s => ({ ...s, auto: v }))}
                aria-label="Toggle auto-calculate thresholds"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <label className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs">Major:</span>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={settings.auto ? String(auto.major) : majorInput}
                  disabled={settings.auto}
                  onChange={e => {
                    const raw = e.target.value.trim();
                    // Allow empty; otherwise keep digits only
                    const val = raw === '' ? '' : raw.replace(/[^0-9]/g, '');
                    setMajorInput(val);
                  }}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs">Severe:</span>
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
                    aria-label="Customize Major Damage"
                  />
                  <span className="text-muted-foreground text-xs select-none">
                    Customize Major Damage
                  </span>
                </label>
              </div>
            </div>
            <div className="text-muted-foreground text-xs">
              Tip: Turn off Auto-calculate to set custom thresholds.
            </div>
          </div>
        </DrawerScaffold>
      </React.Suspense>
    </Card>
  );
}
