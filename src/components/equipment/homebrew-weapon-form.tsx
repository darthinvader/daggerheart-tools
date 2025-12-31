import { FeaturesEditor } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { PrimaryWeapon, SecondaryWeapon } from '@/lib/schemas/equipment';

import { BURDENS, DEFAULT_DAMAGE, RANGES, TIERS, TRAITS } from './constants';
import { DamageEditor, SelectField, TextField } from './form';

type WeaponFormData = Omit<PrimaryWeapon | SecondaryWeapon, 'metadata'>;

interface HomebrewWeaponFormProps {
  weaponType: 'Primary' | 'Secondary';
  value: Partial<WeaponFormData>;
  onChange: (value: Partial<WeaponFormData>) => void;
}

export function HomebrewWeaponForm({
  weaponType,
  value,
  onChange,
}: HomebrewWeaponFormProps) {
  return (
    <Card className="border-primary/50 border-dashed">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Badge>�️ Homebrew</Badge>
          <CardTitle className="text-base">{weaponType} Weapon</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField
            label="Name"
            id="weapon-name"
            value={value.name ?? ''}
            onChange={v => onChange({ ...value, name: v })}
            placeholder="Weapon name..."
          />
          <SelectField
            label="Tier"
            value={value.tier ?? '1'}
            onChange={v => onChange({ ...value, tier: v })}
            options={[...TIERS]}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <SelectField
            label="Trait"
            value={value.trait ?? 'Agility'}
            onChange={v => onChange({ ...value, trait: v })}
            options={TRAITS}
          />
          <SelectField
            label="Range"
            value={value.range ?? 'Melee'}
            onChange={v => onChange({ ...value, range: v })}
            options={RANGES}
          />
          <SelectField
            label="Burden"
            value={value.burden ?? 'One-Handed'}
            onChange={v => onChange({ ...value, burden: v })}
            options={BURDENS}
          />
        </div>

        <DamageEditor
          damage={value.damage ?? DEFAULT_DAMAGE}
          onChange={damage => onChange({ ...value, damage })}
        />

        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={value.description ?? ''}
            onChange={e => onChange({ ...value, description: e.target.value })}
            placeholder="Optional description..."
            className="min-h-15"
          />
        </div>

        <FeaturesEditor
          features={(value.features ?? []).map(f => ({
            name: f.name,
            description: f.description ?? '',
          }))}
          onChange={features => onChange({ ...value, features })}
        />
      </CardContent>
    </Card>
  );
}
