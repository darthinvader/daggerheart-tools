import { SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';

import * as React from 'react';

import { useDrawerAutosaveOnClose } from '@/components/characters/hooks/use-drawer-autosave';
import { DrawerScaffold } from '@/components/drawers/drawer-scaffold';
import { Button } from '@/components/ui/button';
import { useThresholdsSettings } from '@/features/characters/logic/use-thresholds';

import { ThresholdsButtonsRow } from './thresholds/ThresholdsButtonsRow';
import { ThresholdsSettingsPanel } from './thresholds/ThresholdsSettingsPanel';

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
  const skipRef = React.useRef(false);
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

  // Autosave: if the settings are valid or auto mode is enabled, save on close
  useDrawerAutosaveOnClose({
    open,
    trigger: () => Promise.resolve(settings.auto || !invalidManual()),
    submit: () => {
      void save();
    },
    skipRef,
  });

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
      <ThresholdsButtonsRow
        used={used}
        dsUsed={dsUsed}
        enableCritical={!!settings.enableCritical}
        onDamageClick={handleDamageClick}
      />
      <div className="text-muted-foreground mt-1 w-full text-center text-[11px]">
        Tap a number to apply damage. M=Major, S=Severe, MD=Major Damage.
      </div>

      <DrawerScaffold
        open={open}
        onOpenChange={setOpen}
        title="Damage thresholds"
        onCancel={() => {
          skipRef.current = true;
          if (!settings.auto && invalidManual()) {
            toast('Cannot close', {
              description: 'Fix thresholds or enable Auto-calculate.',
            });
            return;
          }
          setOpen(false);
        }}
        onSubmit={() => {
          skipRef.current = true;
          if (save()) setOpen(false);
        }}
        submitLabel="Save"
      >
        <ThresholdsSettingsPanel
          settings={settings}
          setSettings={setSettings}
          auto={auto}
          majorInput={majorInput}
          setMajorInput={setMajorInput}
          severeInput={severeInput}
          setSevereInput={setSevereInput}
          dsInput={dsInput}
          setDsInput={setDsInput}
          displayMajor={displayMajor}
          displaySevere={displaySevere}
          displayDs={displayDs}
          onSave={() => {
            if (save()) {
              setOpen(false);
              return true;
            }
            return false;
          }}
        />
      </DrawerScaffold>
    </div>
  );
}
