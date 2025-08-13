import * as React from 'react';

type CommonProps = {
  name: string;
  setName: (v: string) => void;
  tier: '1' | '2' | '3' | '4';
  setTier: (v: '1' | '2' | '3' | '4') => void;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
  setRarity: (v: 'Common' | 'Uncommon' | 'Rare' | 'Legendary') => void;
  isConsumable: boolean;
  setIsConsumable: (v: boolean) => void;
  maxQuantity: number;
  setMaxQuantity: (v: number) => void;
  weight: string;
  setWeight: (v: string) => void;
  cost: number | '';
  setCost: (v: number | '') => void;
  description: string;
  setDescription: (v: string) => void;
};

export function SharedFields(props: CommonProps) {
  const {
    name,
    setName,
    tier,
    setTier,
    rarity,
    setRarity,
    isConsumable,
    setIsConsumable,
    maxQuantity,
    setMaxQuantity,
    weight,
    setWeight,
    cost,
    setCost,
    description,
    setDescription,
  } = props;

  return (
    <>
      <label className="col-span-1 flex flex-col gap-1 md:col-span-2">
        <span className="text-muted-foreground">Name</span>
        <input
          className="rounded border px-2 py-1"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-muted-foreground">Tier</span>
        <select
          className="rounded border px-2 py-1"
          value={tier}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setTier(e.target.value as '1' | '2' | '3' | '4')
          }
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-muted-foreground">Rarity</span>
        <select
          className="rounded border px-2 py-1"
          value={rarity}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setRarity(
              e.target.value as 'Common' | 'Uncommon' | 'Rare' | 'Legendary'
            )
          }
        >
          <option value="Common">Common</option>
          <option value="Uncommon">Uncommon</option>
          <option value="Rare">Rare</option>
          <option value="Legendary">Legendary</option>
        </select>
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isConsumable}
          onChange={e => setIsConsumable(e.target.checked)}
        />
        <span className="text-muted-foreground">Consumable</span>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-muted-foreground">Max qty</span>
        <input
          type="number"
          className="rounded border px-2 py-1"
          value={maxQuantity}
          onChange={e => setMaxQuantity(parseInt(e.target.value || '1', 10))}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-muted-foreground">Weight</span>
        <input
          className="rounded border px-2 py-1"
          value={weight}
          onChange={e => setWeight(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-muted-foreground">Cost</span>
        <input
          type="number"
          className="rounded border px-2 py-1"
          value={cost}
          onChange={e =>
            setCost(e.target.value === '' ? '' : Number(e.target.value))
          }
        />
      </label>
      <label className="col-span-2 flex flex-col gap-1 md:col-span-3">
        <span className="text-muted-foreground">Description</span>
        <textarea
          className="min-h-16 rounded border px-2 py-1"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </label>
    </>
  );
}
