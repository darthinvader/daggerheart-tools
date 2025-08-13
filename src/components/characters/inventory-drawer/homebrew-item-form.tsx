import * as React from 'react';

import type {
  ArmorModification,
  Consumable,
  Item,
  Potion,
  Relic,
  UtilityItem,
  WeaponModification,
} from '@/lib/schemas/equipment';

import { ConsumableFields } from './homebrew/consumable-fields';
import { ModificationFields } from './homebrew/modification-fields';
import { PotionFields } from './homebrew/potion-fields';
import { RecipeFields } from './homebrew/recipe-fields';
import { RelicFields } from './homebrew/relic-fields';
import { SharedFields } from './homebrew/shared-fields';
import { UtilityFields } from './homebrew/utility-fields';

export type HomebrewItemFormProps = {
  onAdd: (item: Item) => void;
};

type Category =
  | 'Utility'
  | 'Consumable'
  | 'Potion'
  | 'Relic'
  | 'Weapon Modification'
  | 'Armor Modification'
  | 'Recipe';

export function HomebrewItemForm({ onAdd }: HomebrewItemFormProps) {
  const [open, setOpen] = React.useState(false);
  const [category, setCategory] = React.useState<Category>('Utility');
  const [name, setName] = React.useState('');
  const [tier, setTier] = React.useState<'1' | '2' | '3' | '4'>('1');
  const [rarity, setRarity] = React.useState<
    'Common' | 'Uncommon' | 'Rare' | 'Legendary'
  >('Common');
  const [description, setDescription] = React.useState('');
  const [isConsumable, setIsConsumable] = React.useState(false);
  const [maxQuantity, setMaxQuantity] = React.useState(99);
  const [weight, setWeight] = React.useState('');
  const [cost, setCost] = React.useState<number | ''>('');
  // Utility
  const [usageType, setUsageType] = React.useState('unlimited');
  const [charges, setCharges] = React.useState<number | ''>('');
  const [recharge, setRecharge] = React.useState('');
  // Consumable + Potion
  const [effect, setEffect] = React.useState('');
  const [duration, setDuration] = React.useState('');
  const [targetType, setTargetType] = React.useState('');
  const [potionType, setPotionType] = React.useState('');
  const [healingAmount, setHealingAmount] = React.useState('');
  const [traitBonusTrait, setTraitBonusTrait] = React.useState('');
  const [traitBonusAmount, setTraitBonusAmount] = React.useState<number | ''>(
    ''
  );
  const [traitBonusDuration, setTraitBonusDuration] = React.useState('');
  // Relic
  const [relicTrait, setRelicTrait] = React.useState('');
  const [relicTraitBonus, setRelicTraitBonus] = React.useState<number | ''>('');
  const [relicXPTrack, setRelicXPTrack] = React.useState('');
  const [relicXPBonus, setRelicXPBonus] = React.useState<number | ''>('');
  // Weapon/Armor Mod
  const [modType, setModType] = React.useState('');
  const [compatible, setCompatible] = React.useState('');
  const [modTraitChange, setModTraitChange] = React.useState('');
  const [modFeatureName, setModFeatureName] = React.useState('');
  const [modFeatureDesc, setModFeatureDesc] = React.useState('');
  // Recipe
  const [craftedItem, setCraftedItem] = React.useState('');
  const [materials, setMaterials] = React.useState('');
  const [downtime, setDowntime] = React.useState(false);
  const [instructions, setInstructions] = React.useState('');

  const resetCommon = () => {
    setName('');
    setTier('1');
    setRarity('Common');
    setDescription('');
    setIsConsumable(false);
    setMaxQuantity(99);
    setWeight('');
    setCost('');
  };

  const handleAdd = () => {
    const base: Partial<Item> = {
      name: name.trim(),
      tier,
      rarity,
      description: description.trim() || undefined,
      features: [],
      maxQuantity: Math.max(1, Number(maxQuantity) || 1),
      isConsumable: !!isConsumable,
      metadata: { homebrew: true, createdAt: Date.now() },
    };
    if (weight) base.weight = weight;
    if (cost !== '' && !Number.isNaN(Number(cost))) base.cost = Number(cost);
    if (!base.name) return;

    let full: Item;
    switch (category) {
      case 'Utility': {
        const it: UtilityItem = {
          ...base,
          category: 'Utility',
          usageType: usageType || 'unlimited',
          charges: charges === '' ? undefined : Number(charges) || 0,
          rechargePeriod: recharge || undefined,
          metadata: base.metadata as never,
        } as unknown as UtilityItem;
        full = it as unknown as Item;
        break;
      }
      case 'Consumable': {
        const it: Consumable = {
          ...base,
          category: 'Consumable',
          isConsumable: true,
          effect: effect || 'Effect',
          duration: duration || undefined,
          targetType: targetType || undefined,
          metadata: base.metadata as never,
        } as unknown as Consumable;
        full = it as unknown as Item;
        break;
      }
      case 'Potion': {
        const it: Potion = {
          ...(base as unknown as Consumable),
          category: 'Consumable',
          subcategory: 'Potion',
          isConsumable: true,
          potionType: (potionType || 'Health') as never,
          healingAmount: healingAmount || undefined,
          traitBonus:
            traitBonusTrait && traitBonusAmount && traitBonusDuration
              ? {
                  trait: traitBonusTrait as never,
                  bonus: Number(traitBonusAmount) || 1,
                  duration: traitBonusDuration as never,
                }
              : undefined,
          effect: effect || undefined,
          duration: duration || undefined,
          targetType: targetType || undefined,
          metadata: base.metadata as never,
        } as unknown as Potion;
        full = it as unknown as Item;
        break;
      }
      case 'Relic': {
        const it: Relic = {
          ...base,
          category: 'Relic',
          rarity: 'Legendary',
          traitBonus:
            relicTrait && relicTraitBonus !== ''
              ? {
                  trait: relicTrait as never,
                  bonus: Number(relicTraitBonus) || 1,
                }
              : undefined,
          experienceBonus:
            relicXPTrack && relicXPBonus !== ''
              ? { experience: relicXPTrack, bonus: Number(relicXPBonus) || 1 }
              : undefined,
          metadata: base.metadata as never,
        } as unknown as Relic;
        full = it as unknown as Item;
        break;
      }
      case 'Weapon Modification': {
        const it: WeaponModification = {
          ...base,
          category: 'Weapon Modification',
          modificationType: (modType || 'enhancement') as never,
          compatibleWeapons: compatible
            ? compatible
                .split(',')
                .map(s => s.trim())
                .filter(Boolean)
            : [],
          traitChange: modTraitChange
            ? { trait: modTraitChange as never, description: 'Modified' }
            : undefined,
          featureAdded:
            modFeatureName || modFeatureDesc
              ? {
                  name: modFeatureName || 'Feature',
                  description: modFeatureDesc || '',
                }
              : undefined,
          metadata: base.metadata as never,
        } as unknown as WeaponModification;
        full = it as unknown as Item;
        break;
      }
      case 'Armor Modification': {
        const it: ArmorModification = {
          ...base,
          category: 'Armor Modification',
          modificationType: (modType || 'enhancement') as never,
          compatibleArmor: compatible
            ? compatible
                .split(',')
                .map(s => s.trim())
                .filter(Boolean)
            : [],
          featureAdded:
            modFeatureName || modFeatureDesc
              ? {
                  name: modFeatureName || 'Feature',
                  description: modFeatureDesc || '',
                }
              : undefined,
          metadata: base.metadata as never,
        } as unknown as ArmorModification;
        full = it as unknown as Item;
        break;
      }
      case 'Recipe': {
        const it = {
          ...base,
          category: 'Recipe' as const,
          craftedItem: craftedItem || 'Unknown',
          materials: materials
            ? materials
                .split(',')
                .map(s => s.trim())
                .filter(Boolean)
            : [],
          downtimeRequired: !!downtime,
          instructions: instructions || 'Mix and craft',
          metadata: base.metadata as never,
        } as const;
        full = it as unknown as Item;
        break;
      }
    }

    onAdd(full);
    setOpen(false);
    resetCommon();
  };

  return (
    <div className="mt-3 rounded-md border p-2">
      <button
        type="button"
        className="text-xs font-medium underline underline-offset-2"
        onClick={() => setOpen(o => !o)}
      >
        {open ? 'Hide custom item' : 'Add custom item'}
      </button>
      {open ? (
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs md:grid-cols-3">
          <label className="flex flex-col gap-1">
            <span className="text-muted-foreground">Category</span>
            <select
              className="rounded border px-2 py-1"
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
            >
              {[
                'Utility',
                'Consumable',
                'Potion',
                'Relic',
                'Weapon Modification',
                'Armor Modification',
                'Recipe',
              ].map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <SharedFields
            name={name}
            setName={setName}
            tier={tier}
            setTier={setTier}
            rarity={rarity}
            setRarity={setRarity}
            isConsumable={isConsumable}
            setIsConsumable={setIsConsumable}
            maxQuantity={maxQuantity}
            setMaxQuantity={setMaxQuantity}
            weight={weight}
            setWeight={setWeight}
            cost={cost}
            setCost={setCost}
            description={description}
            setDescription={setDescription}
          />

          {/* Category specific inputs */}
          {category === 'Utility' && (
            <UtilityFields
              usageType={usageType}
              setUsageType={setUsageType}
              charges={charges}
              setCharges={setCharges}
              recharge={recharge}
              setRecharge={setRecharge}
            />
          )}

          {(category === 'Consumable' || category === 'Potion') && (
            <ConsumableFields
              effect={effect}
              setEffect={setEffect}
              duration={duration}
              setDuration={setDuration}
              targetType={targetType}
              setTargetType={setTargetType}
            />
          )}
          {category === 'Potion' && (
            <PotionFields
              potionType={potionType}
              setPotionType={setPotionType}
              healingAmount={healingAmount}
              setHealingAmount={setHealingAmount}
              traitBonusTrait={traitBonusTrait}
              setTraitBonusTrait={setTraitBonusTrait}
              traitBonusAmount={traitBonusAmount}
              setTraitBonusAmount={setTraitBonusAmount}
              traitBonusDuration={traitBonusDuration}
              setTraitBonusDuration={setTraitBonusDuration}
            />
          )}

          {category === 'Relic' && (
            <RelicFields
              relicTrait={relicTrait}
              setRelicTrait={setRelicTrait}
              relicTraitBonus={relicTraitBonus}
              setRelicTraitBonus={setRelicTraitBonus}
              relicXPTrack={relicXPTrack}
              setRelicXPTrack={setRelicXPTrack}
              relicXPBonus={relicXPBonus}
              setRelicXPBonus={setRelicXPBonus}
            />
          )}

          {(category === 'Weapon Modification' ||
            category === 'Armor Modification') && (
            <ModificationFields
              modType={modType}
              setModType={setModType}
              compatible={compatible}
              setCompatible={setCompatible}
              modTraitChange={modTraitChange}
              setModTraitChange={setModTraitChange}
              modFeatureName={modFeatureName}
              setModFeatureName={setModFeatureName}
              modFeatureDesc={modFeatureDesc}
              setModFeatureDesc={setModFeatureDesc}
            />
          )}

          {category === 'Recipe' && (
            <RecipeFields
              craftedItem={craftedItem}
              setCraftedItem={setCraftedItem}
              materials={materials}
              setMaterials={setMaterials}
              downtime={downtime}
              setDowntime={setDowntime}
              instructions={instructions}
              setInstructions={setInstructions}
            />
          )}

          <div className="col-span-2 flex items-center gap-2 md:col-span-3">
            <button
              type="button"
              className="bg-primary text-primary-foreground rounded border px-2 py-1 text-xs"
              onClick={handleAdd}
            >
              Add to inventory
            </button>
            <span className="text-muted-foreground">
              New item will be added to your inventory with a Homebrew badge.
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default HomebrewItemForm;
