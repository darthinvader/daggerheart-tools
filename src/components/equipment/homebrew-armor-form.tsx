import { FeaturesEditor } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { StandardArmor } from '@/lib/schemas/equipment';

import { ARMOR_TYPES, TIERS } from './constants';
import { NumberField, SelectField, TextField } from './form';
import { StatModifiersEditor } from './stat-modifiers-editor';

type ArmorFormData = Omit<StandardArmor, 'metadata' | 'isStandard'>;

interface HomebrewArmorFormProps {
  value: Partial<ArmorFormData>;
  onChange: (value: Partial<ArmorFormData>) => void;
}

export function HomebrewArmorForm({ value, onChange }: HomebrewArmorFormProps) {
  const handleThresholdChange = (key: 'major' | 'severe', val: number) => {
    const current = value.baseThresholds ?? { major: 5, severe: 11 };
    onChange({ ...value, baseThresholds: { ...current, [key]: val } });
  };

  return (
    <Card className="border-primary/50 border-dashed">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Badge>�️ Homebrew</Badge>
          <CardTitle className="text-base">Custom Armor</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField
            label="Name"
            id="armor-name"
            value={value.name ?? ''}
            onChange={v => onChange({ ...value, name: v })}
            placeholder="Armor name..."
          />
          <SelectField
            label="Tier"
            value={value.tier ?? '1'}
            onChange={v => onChange({ ...value, tier: v })}
            options={[...TIERS]}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <SelectField
            label="Armor Type"
            value={value.armorType ?? 'Leather'}
            onChange={v => onChange({ ...value, armorType: v })}
            options={[...ARMOR_TYPES]}
          />
          <NumberField
            label="Base Armor Score"
            value={value.baseScore ?? 3}
            onChange={v => onChange({ ...value, baseScore: v })}
            min={0}
          />
        </div>

        <div className="space-y-2">
          <Label>Damage Thresholds</Label>
          <div className="grid gap-3 sm:grid-cols-2">
            <NumberField
              label="Major"
              value={value.baseThresholds?.major ?? 5}
              onChange={v => handleThresholdChange('major', v)}
              min={1}
            />
            <NumberField
              label="Severe"
              value={value.baseThresholds?.severe ?? 11}
              onChange={v => handleThresholdChange('severe', v)}
              min={1}
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <NumberField
            label="Evasion Modifier"
            value={value.evasionModifier ?? 0}
            onChange={v => onChange({ ...value, evasionModifier: v })}
          />
          <NumberField
            label="Agility Modifier"
            value={value.agilityModifier ?? 0}
            onChange={v => onChange({ ...value, agilityModifier: v })}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="armor-description">Description</Label>
          <Textarea
            id="armor-description"
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

        <StatModifiersEditor
          value={value.statModifiers}
          onChange={mods => onChange({ ...value, statModifiers: mods })}
          showRolls={false}
          showThresholds={true}
        />
      </CardContent>
    </Card>
  );
}
