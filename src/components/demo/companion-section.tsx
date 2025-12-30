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
    <div className="flex items-center justify-center rounded-lg border border-dashed p-4">
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
  );
}
