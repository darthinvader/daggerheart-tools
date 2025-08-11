import * as React from 'react';

export type HomebrewArmorFormProps = {
  onAdd: (a: unknown) => void;
};

export function HomebrewArmorForm({ onAdd }: HomebrewArmorFormProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [tier, setTier] = React.useState<'1' | '2' | '3' | '4'>('1');
  const [baseScore, setBaseScore] = React.useState(10);
  const [major, setMajor] = React.useState(1);
  const [severe, setSevere] = React.useState(2);
  const [evasionMod, setEvasionMod] = React.useState(0);
  const [agilityMod, setAgilityMod] = React.useState(0);
  const [armorType, setArmorType] = React.useState('Gambeson');
  const [description, setDescription] = React.useState('');

  const add = () => {
    if (!name.trim()) return;
    const armor = {
      name: name.trim(),
      tier,
      baseScore,
      baseThresholds: { major, severe },
      evasionModifier: evasionMod,
      agilityModifier: agilityMod,
      armorType,
      isStandard: true,
      description: description.trim() || undefined,
      features: [],
      metadata: { homebrew: true, createdAt: Date.now() },
    } as const;
    onAdd(armor);
    setOpen(false);
    setName('');
    setTier('1');
    setBaseScore(10);
    setMajor(1);
    setSevere(2);
    setEvasionMod(0);
    setAgilityMod(0);
    setArmorType('Gambeson');
    setDescription('');
  };

  return (
    <div className="mt-3 rounded-md border p-2">
      <button
        type="button"
        className="text-xs font-medium underline underline-offset-2"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls="homebrew-armor-form"
      >
        {open ? 'Hide custom armor' : 'Add custom armor'}
      </button>
      {open ? (
        <div
          id="homebrew-armor-form"
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
            <span className="text-muted-foreground">Armor type</span>
            <input
              className="rounded border px-2 py-1"
              value={armorType}
              onChange={e => setArmorType(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-muted-foreground">Base score</span>
            <input
              type="number"
              className="rounded border px-2 py-1"
              value={baseScore}
              onChange={e => setBaseScore(parseInt(e.target.value || '0', 10))}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-muted-foreground">Thresholds (M/S)</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                className="w-20 rounded border px-2 py-1"
                value={major}
                onChange={e => setMajor(parseInt(e.target.value || '0', 10))}
                aria-label="Major threshold"
              />
              <input
                type="number"
                min={0}
                className="w-20 rounded border px-2 py-1"
                value={severe}
                onChange={e => setSevere(parseInt(e.target.value || '0', 10))}
                aria-label="Severe threshold"
              />
            </div>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-muted-foreground">Evasion mod</span>
            <input
              type="number"
              className="rounded border px-2 py-1"
              value={evasionMod}
              onChange={e => setEvasionMod(parseInt(e.target.value || '0', 10))}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-muted-foreground">Agility mod</span>
            <input
              type="number"
              className="rounded border px-2 py-1"
              value={agilityMod}
              onChange={e => setAgilityMod(parseInt(e.target.value || '0', 10))}
            />
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
