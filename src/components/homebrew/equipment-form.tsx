/**
 * Homebrew Equipment Form
 *
 * Form for creating and editing homebrew weapons, armor, and combat wheelchairs.
 * Uses discriminated union (weapon | armor | wheelchair) per schema.
 */
import {
  Accessibility,
  Gem,
  Plus,
  Shield,
  Sparkles,
  Sword,
  Trash2,
} from 'lucide-react';
import { useCallback, useState } from 'react';

import { SLOT_PRESETS } from '@/components/equipment/constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { CharacterTraitEnum } from '@/lib/schemas/core';
import type { HomebrewEquipment } from '@/lib/schemas/homebrew';
import {
  createDefaultArmorContent,
  createDefaultCustomEquipmentContent,
  createDefaultWeaponContent,
  createDefaultWheelchairContent,
} from '@/lib/schemas/homebrew';
import { cn } from '@/lib/utils';

const WEAPON_TYPES = ['Primary', 'Secondary'] as const;
const RANGES = ['Melee', 'Very Close', 'Close', 'Far', 'Very Far'] as const;
const BURDENS = ['One-Handed', 'Two-Handed'] as const;
const DAMAGE_TYPES = [
  { value: 'phy', label: 'Physical' },
  { value: 'mag', label: 'Magic' },
] as const;
const DICE_TYPES = [4, 6, 8, 10, 12, 20] as const;
const TIERS = ['1', '2', '3', '4'] as const;
const FRAME_TYPES = ['Light', 'Heavy', 'Arcane'] as const;

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

interface EquipmentFormProps {
  initialData?: HomebrewEquipment['content'];
  onSubmit: (data: HomebrewEquipment['content']) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

interface FeatureState {
  id: string;
  name: string;
  description: string;
}

export function EquipmentForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: EquipmentFormProps) {
  const [equipmentType, setEquipmentType] = useState<
    'weapon' | 'armor' | 'wheelchair' | 'custom'
  >(initialData?.equipmentType ?? 'weapon');
  const [weaponData, setWeaponData] = useState(
    initialData?.equipmentType === 'weapon'
      ? initialData
      : createDefaultWeaponContent()
  );
  const [armorData, setArmorData] = useState(
    initialData?.equipmentType === 'armor'
      ? initialData
      : createDefaultArmorContent()
  );
  const [wheelchairData, setWheelchairData] = useState(
    initialData?.equipmentType === 'wheelchair'
      ? initialData
      : createDefaultWheelchairContent()
  );
  const [customData, setCustomData] = useState(
    initialData?.equipmentType === 'custom'
      ? initialData
      : createDefaultCustomEquipmentContent()
  );
  const [features, setFeatures] = useState<FeatureState[]>(
    (initialData?.features ?? []).map((f, i) => ({
      id: `feature-${i}`,
      name: f.name,
      description: f.description,
    }))
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const baseFeatures = features.map(f => ({
        name: f.name,
        description: f.description,
      }));

      if (equipmentType === 'weapon') {
        onSubmit({
          ...weaponData,
          features: baseFeatures,
          equipmentType: 'weapon',
          isHomebrew: true,
        });
      } else if (equipmentType === 'wheelchair') {
        onSubmit({
          ...wheelchairData,
          features: baseFeatures,
          equipmentType: 'wheelchair',
          isHomebrew: true,
        });
      } else if (equipmentType === 'custom') {
        onSubmit({
          ...customData,
          features: baseFeatures,
          equipmentType: 'custom',
          isHomebrew: true,
        });
      } else {
        onSubmit({
          ...armorData,
          features: baseFeatures,
          equipmentType: 'armor',
          isHomebrew: true,
        });
      }
    },
    [
      equipmentType,
      weaponData,
      armorData,
      wheelchairData,
      customData,
      features,
      onSubmit,
    ]
  );

  const addFeature = () => {
    setFeatures(prev => [
      ...prev,
      { id: `feature-${Date.now()}`, name: '', description: '' },
    ]);
  };

  const removeFeature = (id: string) => {
    setFeatures(prev => prev.filter(f => f.id !== id));
  };

  const updateFeature = (id: string, updates: Partial<FeatureState>) => {
    setFeatures(prev =>
      prev.map(f => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ScrollArea className="h-[60vh] pr-4">
        <div className="space-y-6">
          {/* Equipment Type Tabs */}
          <Tabs
            value={equipmentType}
            onValueChange={v =>
              setEquipmentType(
                v as 'weapon' | 'armor' | 'wheelchair' | 'custom'
              )
            }
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="weapon" className="gap-2">
                <Sword className="size-4" /> Weapon
              </TabsTrigger>
              <TabsTrigger value="armor" className="gap-2">
                <Shield className="size-4" /> Armor
              </TabsTrigger>
              <TabsTrigger value="wheelchair" className="gap-2">
                <Accessibility className="size-4" /> Wheelchair
              </TabsTrigger>
              <TabsTrigger value="custom" className="gap-2">
                <Gem className="size-4" /> Custom
              </TabsTrigger>
            </TabsList>

            {/* Weapon Form */}
            <TabsContent value="weapon" className="mt-4 space-y-6">
              <section className="space-y-4 rounded-lg border border-orange-500/30 bg-orange-500/10 p-4">
                <h3 className="flex items-center gap-2 font-semibold">
                  <Sword className="size-4 text-orange-500" /> Weapon Details
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="weaponName">Name *</Label>
                  <Input
                    id="weaponName"
                    value={weaponData.name}
                    onChange={e =>
                      setWeaponData(prev => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g., Flamebrand"
                    required={equipmentType === 'weapon'}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Weapon Type *</Label>
                    <Select
                      value={weaponData.type}
                      onValueChange={v =>
                        setWeaponData(prev => ({ ...prev, type: v }))
                      }
                    >
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
                    <Label>Trait *</Label>
                    <Select
                      value={weaponData.trait}
                      onValueChange={v =>
                        setWeaponData(prev => ({ ...prev, trait: v }))
                      }
                    >
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
                    <Select
                      value={weaponData.range}
                      onValueChange={v =>
                        setWeaponData(prev => ({ ...prev, range: v }))
                      }
                    >
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

                  <div className="space-y-2">
                    <Label>Burden *</Label>
                    <Select
                      value={weaponData.burden}
                      onValueChange={v =>
                        setWeaponData(prev => ({ ...prev, burden: v }))
                      }
                    >
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

                  <div className="space-y-2">
                    <Label>Tier *</Label>
                    <Select
                      value={weaponData.tier}
                      onValueChange={v =>
                        setWeaponData(prev => ({ ...prev, tier: v }))
                      }
                    >
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

                <h4 className="font-medium">Damage</h4>
                <div className="grid gap-4 sm:grid-cols-4">
                  <div className="space-y-2">
                    <Label>Dice Count</Label>
                    <Input
                      type="number"
                      min={1}
                      value={weaponData.damage.count}
                      onChange={e =>
                        setWeaponData(prev => ({
                          ...prev,
                          damage: {
                            ...prev.damage,
                            count: parseInt(e.target.value, 10) || 1,
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Dice Type</Label>
                    <Select
                      value={String(weaponData.damage.diceType)}
                      onValueChange={v =>
                        setWeaponData(prev => ({
                          ...prev,
                          damage: {
                            ...prev.damage,
                            diceType: parseInt(v, 10),
                          },
                        }))
                      }
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
                      value={weaponData.damage.modifier}
                      onChange={e =>
                        setWeaponData(prev => ({
                          ...prev,
                          damage: {
                            ...prev.damage,
                            modifier: parseInt(e.target.value, 10) || 0,
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={weaponData.damage.type}
                      onValueChange={v =>
                        setWeaponData(prev => ({
                          ...prev,
                          damage: { ...prev.damage, type: v },
                        }))
                      }
                    >
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
              </section>
            </TabsContent>

            {/* Armor Form */}
            <TabsContent value="armor" className="mt-4 space-y-6">
              <section className="space-y-4 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                <h3 className="flex items-center gap-2 font-semibold">
                  <Shield className="size-4 text-blue-500" /> Armor Details
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="armorName">Name *</Label>
                  <Input
                    id="armorName"
                    value={armorData.name}
                    onChange={e =>
                      setArmorData(prev => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g., Dragon Scale Mail"
                    required={equipmentType === 'armor'}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Tier *</Label>
                    <Select
                      value={armorData.tier}
                      onValueChange={v =>
                        setArmorData(prev => ({ ...prev, tier: v }))
                      }
                    >
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

                  <div className="space-y-2">
                    <Label>Base Score *</Label>
                    <Input
                      type="number"
                      min={0}
                      value={armorData.baseScore}
                      onChange={e =>
                        setArmorData(prev => ({
                          ...prev,
                          baseScore: parseInt(e.target.value, 10) || 0,
                        }))
                      }
                    />
                  </div>
                </div>

                <Separator />

                <h4 className="font-medium">Damage Thresholds</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Major Threshold *</Label>
                    <Input
                      type="number"
                      min={1}
                      value={armorData.baseThresholds.major}
                      onChange={e =>
                        setArmorData(prev => ({
                          ...prev,
                          baseThresholds: {
                            ...prev.baseThresholds,
                            major: parseInt(e.target.value, 10) || 1,
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Severe Threshold *</Label>
                    <Input
                      type="number"
                      min={1}
                      value={armorData.baseThresholds.severe}
                      onChange={e =>
                        setArmorData(prev => ({
                          ...prev,
                          baseThresholds: {
                            ...prev.baseThresholds,
                            severe: parseInt(e.target.value, 10) || 1,
                          },
                        }))
                      }
                    />
                  </div>
                </div>

                <Separator />

                <h4 className="font-medium">Modifiers</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Evasion Modifier</Label>
                    <Input
                      type="number"
                      value={armorData.evasionModifier}
                      onChange={e =>
                        setArmorData(prev => ({
                          ...prev,
                          evasionModifier: parseInt(e.target.value, 10) || 0,
                        }))
                      }
                    />
                    <p className="text-muted-foreground text-xs">
                      Modifier to base evasion (can be negative)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Agility Modifier</Label>
                    <Input
                      type="number"
                      value={armorData.agilityModifier}
                      onChange={e =>
                        setArmorData(prev => ({
                          ...prev,
                          agilityModifier: parseInt(e.target.value, 10) || 0,
                        }))
                      }
                    />
                    <p className="text-muted-foreground text-xs">
                      Modifier to Agility rolls (can be negative)
                    </p>
                  </div>
                </div>
              </section>
            </TabsContent>

            {/* Combat Wheelchair Form */}
            <TabsContent value="wheelchair" className="mt-4 space-y-6">
              <section className="space-y-4 rounded-lg border border-violet-500/30 bg-violet-500/10 p-4">
                <h3 className="flex items-center gap-2 font-semibold">
                  <Accessibility className="size-4 text-violet-500" /> Combat
                  Wheelchair Details
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="wheelchairName">Name *</Label>
                  <Input
                    id="wheelchairName"
                    value={wheelchairData.name}
                    onChange={e =>
                      setWheelchairData(prev => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="e.g., Stormrider Chair"
                    required={equipmentType === 'wheelchair'}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Frame Type *</Label>
                    <Select
                      value={wheelchairData.frameType}
                      onValueChange={v =>
                        setWheelchairData(prev => ({
                          ...prev,
                          frameType: v as 'Light' | 'Heavy' | 'Arcane',
                        }))
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
                    <Select
                      value={wheelchairData.tier}
                      onValueChange={v =>
                        setWheelchairData(prev => ({ ...prev, tier: v }))
                      }
                    >
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
                    <Label>Trait *</Label>
                    <Select
                      value={wheelchairData.trait}
                      onValueChange={v =>
                        setWheelchairData(prev => ({ ...prev, trait: v }))
                      }
                    >
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
                    <Select
                      value={wheelchairData.range}
                      onValueChange={v =>
                        setWheelchairData(prev => ({ ...prev, range: v }))
                      }
                    >
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

                <h4 className="font-medium">Damage</h4>
                <div className="grid gap-4 sm:grid-cols-4">
                  <div className="space-y-2">
                    <Label>Dice Count</Label>
                    <Input
                      type="number"
                      min={1}
                      value={wheelchairData.damage.count}
                      onChange={e =>
                        setWheelchairData(prev => ({
                          ...prev,
                          damage: {
                            ...prev.damage,
                            count: parseInt(e.target.value, 10) || 1,
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Dice Type</Label>
                    <Select
                      value={String(wheelchairData.damage.diceType)}
                      onValueChange={v =>
                        setWheelchairData(prev => ({
                          ...prev,
                          damage: {
                            ...prev.damage,
                            diceType: parseInt(v, 10),
                          },
                        }))
                      }
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
                      value={wheelchairData.damage.modifier}
                      onChange={e =>
                        setWheelchairData(prev => ({
                          ...prev,
                          damage: {
                            ...prev.damage,
                            modifier: parseInt(e.target.value, 10) || 0,
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={wheelchairData.damage.type}
                      onValueChange={v =>
                        setWheelchairData(prev => ({
                          ...prev,
                          damage: { ...prev.damage, type: v },
                        }))
                      }
                    >
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

                <Separator />

                {/* Wheelchair-specific Features */}
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 font-medium">
                    <Sparkles className="size-4 text-violet-500" /> Wheelchair
                    Features
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Special mobility and combat features unique to this
                    wheelchair.
                  </p>

                  {/* Quick-add suggestions */}
                  <div className="flex flex-wrap gap-1">
                    {WHEELCHAIR_FEATURE_SUGGESTIONS.filter(
                      f => !wheelchairData.wheelchairFeatures.includes(f)
                    )
                      .slice(0, 8)
                      .map(feature => (
                        <Button
                          key={feature}
                          type="button"
                          variant="outline"
                          size="sm"
                          className={cn(
                            'h-7 text-xs',
                            'border-violet-500/30 hover:bg-violet-500/20'
                          )}
                          onClick={() =>
                            setWheelchairData(prev => ({
                              ...prev,
                              wheelchairFeatures: [
                                ...prev.wheelchairFeatures,
                                feature,
                              ],
                            }))
                          }
                        >
                          <Plus className="mr-1 size-3" /> {feature}
                        </Button>
                      ))}
                  </div>

                  {/* Selected features */}
                  <div className="flex flex-wrap gap-2">
                    {wheelchairData.wheelchairFeatures.map((feature, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="gap-1 border-violet-500/50 bg-violet-500/20"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() =>
                            setWheelchairData(prev => ({
                              ...prev,
                              wheelchairFeatures:
                                prev.wheelchairFeatures.filter(
                                  (_, i) => i !== index
                                ),
                            }))
                          }
                          className="hover:text-destructive"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </section>
            </TabsContent>

            {/* Custom Equipment Form */}
            <TabsContent value="custom" className="mt-4 space-y-6">
              <section className="space-y-4 rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4">
                <h3 className="flex items-center gap-2 font-semibold">
                  <Gem className="size-4 text-cyan-500" /> Custom Equipment
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="customName">Name *</Label>
                  <Input
                    id="customName"
                    value={customData.name}
                    onChange={e =>
                      setCustomData(prev => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g., Whispering Ring"
                    required={equipmentType === 'custom'}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Slot Type</Label>
                    <Select
                      value={customData.slotName}
                      onValueChange={v => {
                        const preset = SLOT_PRESETS.find(p => p.name === v);
                        setCustomData(prev => ({
                          ...prev,
                          slotName: v,
                          slotIconKey: preset?.iconKey ?? prev.slotIconKey,
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {SLOT_PRESETS.map(preset => (
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
                      value={customData.slotName}
                      onChange={e =>
                        setCustomData(prev => ({
                          ...prev,
                          slotName: e.target.value,
                        }))
                      }
                      placeholder="e.g., Ring, Cloak, Trinket"
                    />
                  </div>
                </div>
              </section>
            </TabsContent>
          </Tabs>

          <Separator />

          {/* Features (shared) */}
          <section className="space-y-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-semibold">
                <Sparkles className="size-4 text-emerald-500" /> Equipment
                Features
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFeature}
              >
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
                            updateFeature(feature.id, { name: e.target.value })
                          }
                          placeholder="Feature name"
                        />
                        <Textarea
                          value={feature.description}
                          onChange={e =>
                            updateFeature(feature.id, {
                              description: e.target.value,
                            })
                          }
                          placeholder="Feature description..."
                          rows={2}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFeature(feature.id)}
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

          {/* Description (shared) */}
          <section className="space-y-4">
            <h3 className="font-semibold">Description</h3>
            <Textarea
              value={
                equipmentType === 'weapon'
                  ? (weaponData.description ?? '')
                  : equipmentType === 'armor'
                    ? (armorData.description ?? '')
                    : equipmentType === 'wheelchair'
                      ? (wheelchairData.description ?? '')
                      : (customData.description ?? '')
              }
              onChange={e => {
                if (equipmentType === 'weapon') {
                  setWeaponData(prev => ({
                    ...prev,
                    description: e.target.value,
                  }));
                } else if (equipmentType === 'armor') {
                  setArmorData(prev => ({
                    ...prev,
                    description: e.target.value,
                  }));
                } else if (equipmentType === 'wheelchair') {
                  setWheelchairData(prev => ({
                    ...prev,
                    description: e.target.value,
                  }));
                } else {
                  setCustomData(prev => ({
                    ...prev,
                    description: e.target.value,
                  }));
                }
              }}
              placeholder="Describe the equipment's appearance, history, or special properties..."
              rows={3}
            />
          </section>
        </div>
      </ScrollArea>

      <Separator />

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            isSubmitting ||
            (equipmentType === 'weapon' && !weaponData.name.trim()) ||
            (equipmentType === 'armor' && !armorData.name.trim()) ||
            (equipmentType === 'wheelchair' && !wheelchairData.name.trim()) ||
            (equipmentType === 'custom' && !customData.name.trim())
          }
        >
          {isSubmitting
            ? 'Saving...'
            : `Save ${equipmentType.charAt(0).toUpperCase()}${equipmentType.slice(1)}`}
        </Button>
      </div>
    </form>
  );
}
