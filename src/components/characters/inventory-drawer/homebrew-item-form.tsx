import * as React from 'react';

import type { Item } from '@/lib/schemas/equipment';

import { buildHomebrewItem } from './homebrew/build-homebrew-item';
import type { HomebrewCategory } from './homebrew/build-homebrew-item';
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

type Category = HomebrewCategory;

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
    const built = buildHomebrewItem({
      category,
      base: {
        name,
        tier,
        rarity,
        description,
        isConsumable,
        maxQuantity,
        weight,
        cost,
      },
      utility: { usageType, charges, recharge },
      consumable: { effect, duration, targetType },
      potion: {
        potionType,
        healingAmount,
        traitBonusTrait,
        traitBonusAmount,
        traitBonusDuration,
      },
      relic: { relicTrait, relicTraitBonus, relicXPTrack, relicXPBonus },
      modification: {
        modType,
        compatible,
        modTraitChange,
        modFeatureName,
        modFeatureDesc,
      },
      recipe: { craftedItem, materials, downtime, instructions },
    });
    if (!built) return;
    onAdd(built);
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
