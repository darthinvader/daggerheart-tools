import type { BaseFeature } from '@/lib/schemas/core';

import { ClickableCard } from './clickable-card';
import { WeaponSummaryCard } from './summary';

interface WeaponData {
  name: string;
  damage?: string | null;
  range?: string;
  trait?: string;
  burden?: string;
  features?: BaseFeature[];
  tier?: string;
  description?: string;
  isEmpty: boolean;
}

interface WeaponsGridRowProps {
  primaryData: WeaponData;
  secondaryData: WeaponData;
  primaryIsHomebrew: boolean;
  secondaryIsHomebrew: boolean;
  readOnly: boolean;
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
}

export function WeaponsGridRow({
  primaryData,
  secondaryData,
  primaryIsHomebrew,
  secondaryIsHomebrew,
  readOnly,
  onPrimaryClick,
  onSecondaryClick,
}: WeaponsGridRowProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <ClickableCard onClick={onPrimaryClick} disabled={readOnly}>
        <WeaponSummaryCard
          icon="⚔️"
          label="Primary Weapon"
          name={primaryData.name}
          isHomebrew={primaryIsHomebrew}
          isEmpty={primaryData.isEmpty}
          damage={primaryData.damage}
          range={primaryData.range}
          trait={primaryData.trait}
          burden={primaryData.burden}
          features={primaryData.features}
          tier={primaryData.tier}
          description={primaryData.description}
        />
      </ClickableCard>
      <ClickableCard onClick={onSecondaryClick} disabled={readOnly}>
        <WeaponSummaryCard
          icon="🗡️"
          label="Secondary Weapon"
          name={secondaryData.name}
          isHomebrew={secondaryIsHomebrew}
          isEmpty={secondaryData.isEmpty}
          damage={secondaryData.damage}
          range={secondaryData.range}
          trait={secondaryData.trait}
          burden={secondaryData.burden}
          features={secondaryData.features}
          tier={secondaryData.tier}
          description={secondaryData.description}
        />
      </ClickableCard>
    </div>
  );
}
