import { Shield } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { ALL_SECONDARY_WEAPONS } from '@/lib/data/equipment';
import type { SecondaryWeapon } from '@/lib/schemas/equipment';

import { EquipmentSection } from '../equipment-section';
import { HomebrewWeaponForm } from '../homebrew-weapon-form';
import { SectionHeader } from '../section-header';
import { WeaponCardCompact } from '../weapon-card-compact';

interface SecondaryWeaponSectionProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'standard' | 'homebrew';
  onModeChange: (homebrew: boolean) => void;
  weapon: SecondaryWeapon | null;
  onWeaponChange: (weapon: SecondaryWeapon | null) => void;
  homebrewWeapon: Partial<SecondaryWeapon>;
  onHomebrewChange: (value: Partial<SecondaryWeapon>) => void;
}

export function SecondaryWeaponSection({
  isOpen,
  onOpenChange,
  mode,
  onModeChange,
  weapon,
  onWeaponChange,
  homebrewWeapon,
  onHomebrewChange,
}: SecondaryWeaponSectionProps) {
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
            icon={<Shield className="h-5 w-5" />}
            emoji="🗡️"
            title="Secondary Weapon"
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
                weaponType="Secondary"
                value={homebrewWeapon}
                onChange={onHomebrewChange}
              />
            ) : (
              <EquipmentSection
                title="Secondary Weapons"
                icon="🗡️"
                items={ALL_SECONDARY_WEAPONS}
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
