import { CompanionDisplay, type CompanionState } from '@/components/companion';

interface CompanionSectionProps {
  hasCompanionFeature: boolean;
  companionEnabled: boolean;
  companion: CompanionState | undefined;
  setCompanion: (v: CompanionState | undefined) => void;
  setCompanionEnabled: (v: boolean) => void;
}

export function CompanionSection({
  hasCompanionFeature,
  companionEnabled,
  companion,
  setCompanion,
  setCompanionEnabled,
}: CompanionSectionProps) {
  const showCompanion = hasCompanionFeature || companionEnabled || !!companion;

  // When disabled, hide entirely — use the Settings dialog to toggle on
  if (!showCompanion) return null;

  return (
    <CompanionDisplay
      companion={companion}
      onChange={setCompanion}
      isHomebrew={!hasCompanionFeature}
      onDisable={
        hasCompanionFeature
          ? undefined
          : () => {
              setCompanion(undefined);
              setCompanionEnabled(false);
            }
      }
    />
  );
}
