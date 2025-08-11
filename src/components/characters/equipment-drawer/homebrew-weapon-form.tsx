import * as React from 'react';

export type HomebrewWeaponFormProps = {
  slotLabel: 'Primary' | 'Secondary';
  onAdd: (w: unknown) => void;
  defaultType?: 'Primary' | 'Secondary';
};

export function HomebrewWeaponForm({
  slotLabel,
  onAdd,
  defaultType,
}: HomebrewWeaponFormProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [tier, setTier] = React.useState<'1' | '2' | '3' | '4'>('1');
  const [trait, setTrait] = React.useState('Strength');
  const [range, setRange] = React.useState('Melee');
  const [damageCount, setDamageCount] = React.useState(1);
  const [damageDice, setDamageDice] = React.useState(6);
  const [damageMod, setDamageMod] = React.useState(0);
  const [damageType, setDamageType] = React.useState<'phy' | 'mag'>('phy');
  const [burden, setBurden] = React.useState<'One-Handed' | 'Two-Handed'>(
    'One-Handed'
  );
  const [description, setDescription] = React.useState('');

  const add = () => {
    if (!name.trim()) return;
    const weapon = {
      name: name.trim(),
      tier,
      type: defaultType ?? slotLabel,
      trait,
      range,
      damage: {
        diceType: damageDice,
        count: damageCount,
        modifier: damageMod,
        type: damageType,
      },
      burden,
      description: description.trim() || undefined,
      features: [],
      metadata: { homebrew: true, createdAt: Date.now() },
    } as const;
    onAdd(weapon);
    // reset minimal
    setOpen(false);
    setName('');
    setTier('1');
    setTrait('Strength');
    setRange('Melee');
    setDamageCount(1);
    setDamageDice(6);
    setDamageMod(0);
    setDamageType('phy');
    setBurden('One-Handed');
    setDescription('');
  };

  return (
    <div className="mt-3 rounded-md border p-2">
      <button
        type="button"
        className="text-xs font-medium underline underline-offset-2"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={`homebrew-${slotLabel.toLowerCase()}-form`}
      >
        {open
          ? 'Hide custom weapon'
          : `Add custom ${slotLabel.toLowerCase()} weapon`}
      </button>
      {open ? (
        <div
          id={`homebrew-${slotLabel.toLowerCase()}-form`}
          className="mt-2 grid grid-cols-2 gap-2 text-xs md:grid-cols-3"
        >
          <label className="col-span-2 flex flex-col gap-1">
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
            <span className="text-muted-foreground">Trait</span>
            <select
              className="rounded border px-2 py-1"
              value={trait}
              onChange={e => setTrait(e.target.value)}
            >
              {[
                'Agility',
                'Strength',
                'Finesse',
                'Instinct',
                'Presence',
                'Knowledge',
                'Spellcast',
              ].map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-muted-foreground">Range</span>
            <select
              className="rounded border px-2 py-1"
              value={range}
              onChange={e => setRange(e.target.value)}
            >
              {['Melee', 'Very Close', 'Close', 'Far', 'Very Far'].map(r => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-muted-foreground">Damage</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={1}
                className="w-16 rounded border px-2 py-1"
                value={damageCount}
                onChange={e =>
                  setDamageCount(parseInt(e.target.value || '1', 10))
                }
                aria-label="Damage dice count"
              />
              <span>d</span>
              <input
                type="number"
                min={4}
                max={20}
                step={2}
                className="w-16 rounded border px-2 py-1"
                value={damageDice}
                onChange={e =>
                  setDamageDice(parseInt(e.target.value || '6', 10))
                }
                aria-label="Damage dice type"
              />
              <span>+</span>
              <input
                type="number"
                className="w-16 rounded border px-2 py-1"
                value={damageMod}
                onChange={e =>
                  setDamageMod(parseInt(e.target.value || '0', 10))
                }
                aria-label="Damage modifier"
              />
              <select
                className="rounded border px-2 py-1"
                value={damageType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setDamageType(e.target.value as 'phy' | 'mag')
                }
                aria-label="Damage type"
              >
                <option value="phy">phy</option>
                <option value="mag">mag</option>
              </select>
            </div>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-muted-foreground">Burden</span>
            <select
              className="rounded border px-2 py-1"
              value={burden}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setBurden(e.target.value as 'One-Handed' | 'Two-Handed')
              }
            >
              <option value="One-Handed">One-Handed</option>
              <option value="Two-Handed">Two-Handed</option>
            </select>
          </label>
          <label className="col-span-2 flex flex-col gap-1 md:col-span-3">
            <span className="text-muted-foreground">
              Description (optional)
            </span>
            <textarea
              className="min-h-16 rounded border px-2 py-1"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </label>
          <div className="col-span-2 flex items-center gap-2 md:col-span-3">
            <button
              type="button"
              className="bg-primary text-primary-foreground rounded border px-2 py-1 text-xs"
              onClick={add}
            >
              Add to list
            </button>
            <span className="text-muted-foreground">
              New item will appear in the list above with a Homebrew badge.
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
