import { Dog } from 'lucide-react';

import { CompanionDisplay, type CompanionState } from '@/components/companion';
import { Button } from '@/components/ui/button';

interface CompanionSectionProps {
  isRanger: boolean;
  companionEnabled: boolean;
  companion: CompanionState | undefined;
  setCompanion: (v: CompanionState | undefined) => void;
  setCompanionEnabled: (v: boolean) => void;
}

export function CompanionSection({
  isRanger,
  companionEnabled,
  companion,
  setCompanion,
  setCompanionEnabled,
}: CompanionSectionProps) {
  const showCompanion = isRanger || companionEnabled || !!companion;

  if (showCompanion) {
    return (
      <CompanionDisplay
        companion={companion}
        onChange={setCompanion}
        isHomebrew={!isRanger}
        onDisable={
          isRanger
            ? undefined
            : () => {
                setCompanion(undefined);
                setCompanionEnabled(false);
              }
        }
      />
    );
  }

  return (
    <section className="bg-card hover:border-primary/20 rounded-xl border shadow-sm transition-colors">
      <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">🐾</span>
          <h3 className="text-lg font-semibold">Companion</h3>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground gap-2"
          onClick={() => setCompanionEnabled(true)}
        >
          <Dog className="size-4" />
          Add Companion (Homebrew)
        </Button>
      </div>
    </section>
  );
}
