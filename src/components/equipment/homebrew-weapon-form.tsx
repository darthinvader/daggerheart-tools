/**
 * Homebrew Weapon Form - Character Page Wrapper
 *
 * Thin wrapper that uses the unified EquipmentForm from the homebrew module.
 * Adapts between the character page's weapon type and EquipmentForm's data type.
 */
import { useMemo } from 'react';

import { EquipmentForm, type EquipmentFormData } from '@/components/homebrew';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PrimaryWeapon, SecondaryWeapon } from '@/lib/schemas/equipment';

type WeaponFormData = Omit<PrimaryWeapon | SecondaryWeapon, 'metadata'> & {
  tags?: string[];
  domainAffinity?: string;
};

interface HomebrewWeaponFormProps {
  weaponType: 'Primary' | 'Secondary';
  value: Partial<WeaponFormData>;
  onChange: (value: Partial<WeaponFormData>) => void;
}

/** Convert WeaponFormData to EquipmentFormData */
function weaponToEquipmentFormData(
  value: Partial<WeaponFormData>,
  weaponType: 'Primary' | 'Secondary'
): EquipmentFormData {
  return {
    equipmentType: 'weapon',
    name: value.name ?? '',
    tier: value.tier ?? '1',
    type: weaponType,
    trait: value.trait ?? 'Agility',
    range: value.range ?? 'Melee',
    damage: value.damage ?? { diceType: 6, count: 1, modifier: 0, type: 'phy' },
    burden: value.burden ?? 'One-Handed',
    features: value.features ?? [],
    tags: value.tags,
    domainAffinity: value.domainAffinity,
    description: value.description,
    statModifiers: value.statModifiers,
    isHomebrew: true,
  };
}

/** Convert EquipmentFormData back to WeaponFormData */
function equipmentFormDataToWeapon(
  data: EquipmentFormData
): Partial<WeaponFormData> {
  if (data.equipmentType !== 'weapon') return {};
  return {
    name: data.name,
    tier: data.tier,
    trait: data.trait,
    range: data.range,
    damage: data.damage,
    burden: data.burden,
    features: data.features,
    tags: data.tags,
    domainAffinity: data.domainAffinity,
    description: data.description,
    statModifiers: data.statModifiers,
  };
}

export function HomebrewWeaponForm({
  weaponType,
  value,
  onChange,
}: HomebrewWeaponFormProps) {
  const initialData = useMemo(
    () => weaponToEquipmentFormData(value, weaponType),
    // Only recompute on initial mount, not on every value change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleChange = (data: EquipmentFormData) => {
    onChange(equipmentFormDataToWeapon(data));
  };

  return (
    <Card className="border-primary/50 border-dashed">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Badge>⚒️ Homebrew</Badge>
          <CardTitle className="text-base">{weaponType} Weapon</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <EquipmentForm
          initialData={initialData}
          onChange={handleChange}
          showActions={false}
          lockedType="weapon"
          compact
        />
      </CardContent>
    </Card>
  );
}
