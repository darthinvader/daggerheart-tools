import { Sword } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { ALL_PRIMARY_WEAPONS } from '@/lib/data/equipment';
import type { PrimaryWeapon } from '@/lib/schemas/equipment';

import { EquipmentSection } from '../equipment-section';
import { HomebrewWeaponForm } from '../homebrew-weapon-form';
import { SectionHeader } from '../section-header';
import { WeaponCardCompact } from '../weapon-card-compact';

interface PrimaryWeaponSectionProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'standard' | 'homebrew';
  onModeChange: (homebrew: boolean) => void;
  weapon: PrimaryWeapon | null;
  onWeaponChange: (weapon: PrimaryWeapon | null) => void;
  homebrewWeapon: Partial<PrimaryWeapon>;
  onHomebrewChange: (value: Partial<PrimaryWeapon>) => void;
}

export function PrimaryWeaponSection({
  isOpen,
  onOpenChange,
  mode,
  onModeChange,
  weapon,
  onWeaponChange,
  homebrewWeapon,
  onHomebrewChange,
}: PrimaryWeaponSectionProps) {
  const selectedName =
    mode === 'homebrew'
      ? homebrewWeapon.name
        ? `🔧 ${homebrewWeapon.name}`
        : '🔧 Homebrew'
      : weapon?.name;

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={onOpenChange}>
        <CardHeader className="pb-3">
          <SectionHeader
            icon={<Sword className="h-5 w-5" />}
            emoji="⚔️"
            title="Primary Weapon"
            isOpen={isOpen}
            onToggle={() => onOpenChange(!isOpen)}
            isHomebrew={mode === 'homebrew'}
            onHomebrewChange={onModeChange}
            selectedName={selectedName}
          />
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            {mode === 'homebrew' ? (
              <HomebrewWeaponForm
                weaponType="Primary"
                value={homebrewWeapon}
                onChange={onHomebrewChange}
              />
            ) : (
              <EquipmentSection
                title="Primary Weapons"
                icon="⚔️"
                items={ALL_PRIMARY_WEAPONS}
                selectedItem={weapon}
                onSelect={onWeaponChange}
                renderCard={(w, isSelected, onSelect) => (
                  <WeaponCardCompact
                    key={w.name}
                    weapon={w}
                    isSelected={isSelected}
                    onClick={onSelect}
                  />
                )}
              />
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
