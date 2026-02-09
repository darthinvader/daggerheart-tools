import {
  Accessibility,
  Gem,
  Plus,
  Shield,
  Sparkles,
  Sword,
  Tag,
  Trash2,
} from 'lucide-react';
/**
 * Equipment Form Section Components
 *
 * Extracted section components for the equipment form to reduce complexity.
 */
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';

import { StatModifiersEditor } from '@/components/equipment/stat-modifiers-editor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { TIERS } from '@/lib/constants';
import { CharacterTraitEnum } from '@/lib/schemas/core';
import type {
  HomebrewArmorContent,
  HomebrewCustomEquipmentContent,
  HomebrewWeaponContent,
  HomebrewWheelchairContent,
} from '@/lib/schemas/homebrew';

// =====================================================================================
// Constants
// =====================================================================================

export const WEAPON_TYPES = ['Primary', 'Secondary'] as const;
export const RANGES = [
  'Melee',
  'Very Close',
  'Close',
  'Far',
  'Very Far',
] as const;
export const BURDENS = ['One-Handed', 'Two-Handed'] as const;
export const DAMAGE_TYPES = [
  { value: 'phy', label: 'Physical' },
  { value: 'mag', label: 'Magic' },
] as const;
export const DICE_TYPES = [4, 6, 8, 10, 12, 20] as const;
export { TIERS };
export const FRAME_TYPES = ['Light', 'Heavy', 'Arcane'] as const;

// =====================================================================================
// FormSelectField (shared helper)
// =====================================================================================

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectFieldProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: readonly SelectOption[];
}

function FormSelectField({
  label,
  value,
  onValueChange,
  options,
}: FormSelectFieldProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(o => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// =====================================================================================
// WeaponSection
// =====================================================================================

const WEAPON_TYPE_OPTIONS = WEAPON_TYPES.map(t => ({ value: t, label: t }));
const TRAIT_OPTIONS = CharacterTraitEnum.options.map(t => ({
  value: t,
  label: t,
}));
const RANGE_OPTIONS = RANGES.map(r => ({ value: r, label: r }));
const BURDEN_OPTIONS = BURDENS.map(b => ({ value: b, label: b }));
const TIER_OPTIONS = TIERS.map(t => ({ value: t, label: `Tier ${t}` }));
const DICE_TYPE_OPTIONS = DICE_TYPES.map(d => ({
  value: String(d),
  label: `d${d}`,
}));
const DAMAGE_TYPE_OPTIONS = DAMAGE_TYPES.map(dt => ({
  value: dt.value,
  label: dt.label,
}));

interface WeaponSectionProps {
  data: HomebrewWeaponContent;
  onChange: Dispatch<SetStateAction<HomebrewWeaponContent>>;
}

export function WeaponSection({ data, onChange }: WeaponSectionProps) {
  const update = <K extends keyof HomebrewWeaponContent>(
    key: K,
    value: HomebrewWeaponContent[K]
  ) => {
    onChange({ ...data, [key]: value });
  };

  const updateDamage = <K extends keyof HomebrewWeaponContent['damage']>(
    key: K,
    value: HomebrewWeaponContent['damage'][K]
  ) => {
    onChange({ ...data, damage: { ...data.damage, [key]: value } });
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    update('name', e.target.value);
  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    update('description', e.target.value);
  const handleDomainAffinityChange = (e: ChangeEvent<HTMLInputElement>) =>
    update('domainAffinity', e.target.value);
  const handleDiceCountChange = (e: ChangeEvent<HTMLInputElement>) =>
    updateDamage('count', parseInt(e.target.value, 10) || 1);
  const handleDiceTypeChange = (v: string) =>
    updateDamage('diceType', parseInt(v, 10));
  const handleModifierChange = (e: ChangeEvent<HTMLInputElement>) =>
    updateDamage('modifier', parseInt(e.target.value, 10) || 0);
  const handleTagsChange = (tags: string[]) => update('tags', tags);
  const handleStatModsChange = (mods: HomebrewWeaponContent['statModifiers']) =>
    update('statModifiers', mods);

  return (
    <section className="space-y-4 rounded-lg border border-orange-500/30 bg-orange-500/10 p-4">
      <h3 className="flex items-center gap-2 font-semibold">
        <Sword className="size-4 text-orange-500" /> Weapon Details
      </h3>

      <div className="space-y-2">
        <Label htmlFor="weaponName">Name *</Label>
        <Input
          id="weaponName"
          value={data.name}
          onChange={handleNameChange}
          placeholder="e.g., Flamebrand"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormSelectField
          label="Weapon Type *"
          value={data.type}
          onValueChange={v => update('type', v)}
          options={WEAPON_TYPE_OPTIONS}
        />
        <FormSelectField
          label="Trait *"
          value={data.trait}
          onValueChange={v => update('trait', v)}
          options={TRAIT_OPTIONS}
        />
        <FormSelectField
          label="Range *"
          value={data.range}
          onValueChange={v => update('range', v)}
          options={RANGE_OPTIONS}
        />
        <FormSelectField
          label="Burden *"
          value={data.burden}
          onValueChange={v => update('burden', v)}
          options={BURDEN_OPTIONS}
        />
        <FormSelectField
          label="Tier *"
          value={data.tier}
          onValueChange={v => update('tier', v)}
          options={TIER_OPTIONS}
        />
      </div>

      <Separator />

      <h4 className="font-medium">Damage</h4>
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="space-y-2">
          <Label>Dice Count</Label>
          <Input
            type="number"
            min={1}
            value={data.damage.count}
            onChange={handleDiceCountChange}
          />
        </div>

        <FormSelectField
          label="Dice Type"
          value={String(data.damage.diceType)}
          onValueChange={handleDiceTypeChange}
          options={DICE_TYPE_OPTIONS}
        />

        <div className="space-y-2">
          <Label>Modifier</Label>
          <Input
            type="number"
            value={data.damage.modifier}
            onChange={handleModifierChange}
          />
        </div>

        <FormSelectField
          label="Type"
          value={data.damage.type}
          onValueChange={v => updateDamage('type', v)}
          options={DAMAGE_TYPE_OPTIONS}
        />
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="weaponDescription">Description</Label>
        <Textarea
          id="weaponDescription"
          value={data.description ?? ''}
          onChange={handleDescriptionChange}
          placeholder="Optional description of the weapon..."
          className="min-h-20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="weaponDomainAffinity">Domain Affinity</Label>
        <Input
          id="weaponDomainAffinity"
          value={data.domainAffinity ?? ''}
          onChange={handleDomainAffinityChange}
          placeholder="e.g., Arcana, Blade, etc."
        />
        <p className="text-muted-foreground text-xs">
          Optional domain that this weapon has affinity with
        </p>
      </div>

      <Separator />

      <TagsEditor
        tags={data.tags ?? []}
        onChange={handleTagsChange}
        colorClass="orange-500"
      />

      <Separator />

      <h4 className="font-medium">Stat Modifiers</h4>
      <p className="text-muted-foreground text-sm">
        Define bonuses this weapon provides to character stats
      </p>
      <StatModifiersEditor
        value={data.statModifiers}
        onChange={handleStatModsChange}
        showRolls={true}
        showThresholds={false}
      />
    </section>
  );
}

// =====================================================================================
// ArmorSection
// =====================================================================================

interface ArmorSectionProps {
  data: HomebrewArmorContent;
  onChange: Dispatch<SetStateAction<HomebrewArmorContent>>;
}

export function ArmorSection({ data, onChange }: ArmorSectionProps) {
  const update = <K extends keyof HomebrewArmorContent>(
    key: K,
    value: HomebrewArmorContent[K]
  ) => {
    onChange({ ...data, [key]: value });
  };

  const updateThreshold = (key: 'major' | 'severe', value: number) => {
    onChange({
      ...data,
      baseThresholds: { ...data.baseThresholds, [key]: value },
    });
  };

  return (
    <section className="space-y-4 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
      <h3 className="flex items-center gap-2 font-semibold">
        <Shield className="size-4 text-blue-500" /> Armor Details
      </h3>

      <div className="space-y-2">
        <Label htmlFor="armorName">Name *</Label>
        <Input
          id="armorName"
          value={data.name}
          onChange={e => update('name', e.target.value)}
          placeholder="e.g., Chainmail"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Base Score *</Label>
          <Input
            type="number"
            min={0}
            value={data.baseScore}
            onChange={e =>
              update('baseScore', parseInt(e.target.value, 10) || 0)
            }
          />
          <p className="text-muted-foreground text-xs">
            Added to Evasion score
          </p>
        </div>

        <div className="space-y-2">
          <Label>Major Threshold *</Label>
          <Input
            type="number"
            min={0}
            value={data.baseThresholds.major}
            onChange={e =>
              updateThreshold('major', parseInt(e.target.value, 10) || 0)
            }
          />
          <p className="text-muted-foreground text-xs">
            Major damage threshold
          </p>
        </div>

        <div className="space-y-2">
          <Label>Severe Threshold *</Label>
          <Input
            type="number"
            min={0}
            value={data.baseThresholds.severe}
            onChange={e =>
              updateThreshold('severe', parseInt(e.target.value, 10) || 0)
            }
          />
          <p className="text-muted-foreground text-xs">
            Severe damage threshold
          </p>
        </div>

        <div className="space-y-2">
          <Label>Tier *</Label>
          <Select value={data.tier} onValueChange={v => update('tier', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIERS.map(t => (
                <SelectItem key={t} value={t}>
                  Tier {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="armorDescription">Description</Label>
        <Textarea
          id="armorDescription"
          value={data.description ?? ''}
          onChange={e => update('description', e.target.value)}
          placeholder="Optional description of the armor..."
          className="min-h-20"
        />
      </div>

      <Separator />

      <TagsEditor
        tags={data.tags ?? []}
        onChange={tags => update('tags', tags)}
        colorClass="blue-500"
      />

      <Separator />

      <h4 className="font-medium">Stat Modifiers</h4>
      <p className="text-muted-foreground text-sm">
        Define bonuses this armor provides to character stats
      </p>
      <StatModifiersEditor
        value={data.statModifiers}
        onChange={mods => update('statModifiers', mods)}
        showRolls={false}
        showThresholds={true}
      />
    </section>
  );
}

// =====================================================================================
// TagsEditor - Reusable component for editing tags
// =====================================================================================

interface TagsEditorProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  colorClass: string;
}

export function TagsEditor({ tags, onChange, colorClass }: TagsEditorProps) {
  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const addTag = (tag: string) => {
    if (tag.trim()) {
      onChange([...tags, tag.trim()]);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-1">
        <Tag className="size-3" /> Tags
      </Label>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className={`gap-1 border-${colorClass}/50 bg-${colorClass}/20`}
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="hover:text-destructive"
            >
              <Trash2 className="size-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Add a tag..."
          onKeyDown={e => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              e.preventDefault();
              addTag(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
        />
      </div>
      <p className="text-muted-foreground text-xs">Press Enter to add a tag</p>
    </div>
  );
}

// =====================================================================================
// WheelchairSection
// =====================================================================================

// Predefined wheelchair features from official combat wheelchairs
const WHEELCHAIR_FEATURE_SUGGESTIONS = [
  'Enhanced Mobility',
  'Ramming Charge',
  'Defensive Positioning',
  'Quick Deploy',
  'Terrain Adaptation',
  'Shield Mount',
  'Weapon Rack',
  'Arcane Focus Mount',
  'Stabilized Platform',
  'All-Terrain Wheels',
  'Folding Frame',
  'Reinforced Frame',
] as const;

interface WheelchairSectionProps {
  data: HomebrewWheelchairContent;
  onChange: Dispatch<SetStateAction<HomebrewWheelchairContent>>;
}

// Extracted damage section for wheelchair
interface WheelchairDamageSectionProps {
  damage: HomebrewWheelchairContent['damage'];
  onUpdate: <K extends keyof HomebrewWheelchairContent['damage']>(
    key: K,
    value: HomebrewWheelchairContent['damage'][K]
  ) => void;
}

function WheelchairDamageSection({
  damage,
  onUpdate,
}: WheelchairDamageSectionProps) {
  return (
    <>
      <h4 className="font-medium">Damage</h4>
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="space-y-2">
          <Label>Dice Count</Label>
          <Input
            type="number"
            min={1}
            value={damage.count}
            onChange={e => onUpdate('count', parseInt(e.target.value, 10) || 1)}
          />
        </div>

        <div className="space-y-2">
          <Label>Dice Type</Label>
          <Select
            value={String(damage.diceType)}
            onValueChange={v => onUpdate('diceType', parseInt(v, 10))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DICE_TYPES.map(d => (
                <SelectItem key={d} value={String(d)}>
                  d{d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Modifier</Label>
          <Input
            type="number"
            value={damage.modifier}
            onChange={e =>
              onUpdate('modifier', parseInt(e.target.value, 10) || 0)
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={damage.type} onValueChange={v => onUpdate('type', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DAMAGE_TYPES.map(dt => (
                <SelectItem key={dt.value} value={dt.value}>
                  {dt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}

// Extracted wheelchair features section
interface WheelchairFeaturesSectionProps {
  features: string[];
  onAdd: (feature: string) => void;
  onRemove: (index: number) => void;
}

function WheelchairFeaturesSection({
  features,
  onAdd,
  onRemove,
}: WheelchairFeaturesSectionProps) {
  return (
    <div className="space-y-3">
      <h4 className="flex items-center gap-2 font-medium">
        <Sparkles className="size-4 text-violet-500" /> Wheelchair Features
      </h4>
      <p className="text-muted-foreground text-sm">
        Special mobility and combat features unique to this wheelchair.
      </p>

      {/* Quick-add suggestions */}
      <div className="flex flex-wrap gap-1">
        {WHEELCHAIR_FEATURE_SUGGESTIONS.filter(f => !features.includes(f))
          .slice(0, 8)
          .map(feature => (
            <Button
              key={feature}
              type="button"
              variant="outline"
              size="sm"
              className="h-7 border-violet-500/30 text-xs hover:bg-violet-500/20"
              onClick={() => onAdd(feature)}
            >
              <Plus className="mr-1 size-3" /> {feature}
            </Button>
          ))}
      </div>

      {/* Selected features */}
      <div className="flex flex-wrap gap-2">
        {features.map((feature, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="gap-1 border-violet-500/50 bg-violet-500/20"
          >
            {feature}
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="hover:text-destructive"
            >
              <Trash2 className="size-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function WheelchairSection({ data, onChange }: WheelchairSectionProps) {
  const update = <K extends keyof HomebrewWheelchairContent>(
    key: K,
    value: HomebrewWheelchairContent[K]
  ) => {
    onChange({ ...data, [key]: value });
  };

  const updateDamage = <K extends keyof HomebrewWheelchairContent['damage']>(
    key: K,
    value: HomebrewWheelchairContent['damage'][K]
  ) => {
    onChange({ ...data, damage: { ...data.damage, [key]: value } });
  };

  const addWheelchairFeature = (feature: string) => {
    update('wheelchairFeatures', [...(data.wheelchairFeatures ?? []), feature]);
  };

  const removeWheelchairFeature = (index: number) => {
    update(
      'wheelchairFeatures',
      (data.wheelchairFeatures ?? []).filter((_, i) => i !== index)
    );
  };

  return (
    <section className="space-y-4 rounded-lg border border-violet-500/30 bg-violet-500/10 p-4">
      <h3 className="flex items-center gap-2 font-semibold">
        <Accessibility className="size-4 text-violet-500" /> Combat Wheelchair
        Details
      </h3>

      <div className="space-y-2">
        <Label htmlFor="wheelchairName">Name *</Label>
        <Input
          id="wheelchairName"
          value={data.name}
          onChange={e => update('name', e.target.value)}
          placeholder="e.g., Stormrider Chair"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Frame Type *</Label>
          <Select
            value={data.frameType}
            onValueChange={v =>
              update('frameType', v as 'Light' | 'Heavy' | 'Arcane')
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FRAME_TYPES.map(t => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Tier *</Label>
          <Select value={data.tier} onValueChange={v => update('tier', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIERS.map(t => (
                <SelectItem key={t} value={t}>
                  Tier {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Weapon Type *</Label>
          <Select value={data.type} onValueChange={v => update('type', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WEAPON_TYPES.map(t => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Burden *</Label>
          <Select value={data.burden} onValueChange={v => update('burden', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BURDENS.map(b => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Trait *</Label>
          <Select value={data.trait} onValueChange={v => update('trait', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CharacterTraitEnum.options.map(trait => (
                <SelectItem key={trait} value={trait}>
                  {trait}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Range *</Label>
          <Select value={data.range} onValueChange={v => update('range', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RANGES.map(r => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <WheelchairDamageSection damage={data.damage} onUpdate={updateDamage} />

      <Separator />

      {/* Wheelchair-specific Features */}
      <WheelchairFeaturesSection
        features={data.wheelchairFeatures}
        onAdd={addWheelchairFeature}
        onRemove={removeWheelchairFeature}
      />

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="wheelchairDescription">Description</Label>
        <Textarea
          id="wheelchairDescription"
          value={data.description ?? ''}
          onChange={e => update('description', e.target.value)}
          placeholder="Optional description of the wheelchair..."
          className="min-h-20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="wheelchairDomainAffinity">Domain Affinity</Label>
        <Input
          id="wheelchairDomainAffinity"
          value={data.domainAffinity ?? ''}
          onChange={e => update('domainAffinity', e.target.value)}
          placeholder="e.g., Arcana, Blade, etc."
        />
        <p className="text-muted-foreground text-xs">
          Optional domain that this wheelchair has affinity with
        </p>
      </div>

      <Separator />

      <TagsEditor
        tags={data.tags ?? []}
        onChange={tags => update('tags', tags)}
        colorClass="violet-500"
      />

      <Separator />

      <h4 className="font-medium">Stat Modifiers</h4>
      <p className="text-muted-foreground text-sm">
        Define bonuses this wheelchair provides to character stats
      </p>
      <StatModifiersEditor
        value={data.statModifiers}
        onChange={mods => update('statModifiers', mods)}
        showRolls={true}
        showThresholds={false}
      />
    </section>
  );
}

// =====================================================================================
// CustomEquipmentSection
// =====================================================================================

interface CustomEquipmentSectionProps {
  data: HomebrewCustomEquipmentContent;
  onChange: Dispatch<SetStateAction<HomebrewCustomEquipmentContent>>;
  slotPresets: readonly { name: string; iconKey: string }[];
}

export function CustomEquipmentSection({
  data,
  onChange,
  slotPresets,
}: CustomEquipmentSectionProps) {
  const update = <K extends keyof HomebrewCustomEquipmentContent>(
    key: K,
    value: HomebrewCustomEquipmentContent[K]
  ) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <section className="space-y-4 rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4">
      <h3 className="flex items-center gap-2 font-semibold">
        <Gem className="size-4 text-cyan-500" /> Custom Equipment
      </h3>

      <div className="space-y-2">
        <Label htmlFor="customName">Name *</Label>
        <Input
          id="customName"
          value={data.name}
          onChange={e => update('name', e.target.value)}
          placeholder="e.g., Whispering Ring"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Slot Type</Label>
          <Select
            value={data.slotName}
            onValueChange={v => {
              const preset = slotPresets.find(p => p.name === v);
              onChange({
                ...data,
                slotName: v,
                slotIconKey: preset?.iconKey ?? data.slotIconKey,
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select slot" />
            </SelectTrigger>
            <SelectContent>
              {slotPresets.map(preset => (
                <SelectItem key={preset.name} value={preset.name}>
                  {preset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customSlotName">Custom Slot Name</Label>
          <Input
            id="customSlotName"
            value={data.slotName}
            onChange={e => update('slotName', e.target.value)}
            placeholder="e.g., Ring, Cloak, Trinket"
          />
        </div>
      </div>
    </section>
  );
}

// =====================================================================================
// Equipment Features Section
// =====================================================================================

export interface EquipmentFeatureState {
  id: string;
  name: string;
  description: string;
}

interface EquipmentFeaturesSectionProps {
  features: EquipmentFeatureState[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<EquipmentFeatureState>) => void;
}

export function EquipmentFeaturesSection({
  features,
  onAdd,
  onRemove,
  onUpdate,
}: EquipmentFeaturesSectionProps) {
  return (
    <section className="space-y-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold">
          <Sparkles className="size-4 text-emerald-500" /> Equipment Features
        </h3>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="mr-1 size-4" /> Add Feature
        </Button>
      </div>

      {features.length === 0 ? (
        <p className="text-muted-foreground text-sm italic">
          No features added yet.
        </p>
      ) : (
        <div className="space-y-3">
          {features.map(feature => (
            <div
              key={feature.id}
              className="bg-muted/50 space-y-2 rounded-lg border p-3"
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-2">
                  <Input
                    value={feature.name}
                    onChange={e =>
                      onUpdate(feature.id, { name: e.target.value })
                    }
                    placeholder="Feature name"
                  />
                  <Textarea
                    value={feature.description}
                    onChange={e =>
                      onUpdate(feature.id, { description: e.target.value })
                    }
                    placeholder="Feature description..."
                    rows={2}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(feature.id)}
                  className="text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// =====================================================================================
// Equipment Description Section
// =====================================================================================

interface EquipmentDescriptionSectionProps {
  description: string;
  onChange: (description: string) => void;
}

export function EquipmentDescriptionSection({
  description,
  onChange,
}: EquipmentDescriptionSectionProps) {
  return (
    <section className="space-y-4">
      <h3 className="font-semibold">Description</h3>
      <Textarea
        value={description}
        onChange={e => onChange(e.target.value)}
        placeholder="Describe the equipment's appearance, history, or special properties..."
        rows={3}
      />
    </section>
  );
}

// =====================================================================================
// Equipment Form Actions Section
// =====================================================================================

interface EquipmentFormActionsProps {
  onCancel?: () => void;
  isSubmitting: boolean;
  isDisabled: boolean;
  equipmentType: 'weapon' | 'armor' | 'wheelchair' | 'custom';
}

export function EquipmentFormActions({
  onCancel,
  isSubmitting,
  isDisabled,
  equipmentType,
}: EquipmentFormActionsProps) {
  return (
    <>
      <Separator />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || isDisabled}>
          {isSubmitting
            ? 'Saving...'
            : `Save ${equipmentType.charAt(0).toUpperCase()}${equipmentType.slice(1)}`}
        </Button>
      </div>
    </>
  );
}
