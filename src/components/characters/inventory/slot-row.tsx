// React import not required with automatic JSX runtime
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type {
  ArmorModification,
  Consumable,
  InventorySlot,
  Potion,
  Recipe,
  Relic,
  UtilityItem,
  WeaponModification,
} from '@/lib/schemas/equipment';

type Props = {
  slot: InventorySlot;
  index: number;
  expanded: boolean;
  onToggleExpanded: (index: number) => void;
  onIncQty: (index: number, delta: number) => void;
  onToggleEquipped: (index: number, checked: boolean) => void;
  onChangeLocation: (index: number, loc: InventorySlot['location']) => void;
  onRemove: (index: number) => void;
};

export function SlotRow({
  slot: s,
  index: idx,
  expanded,
  onToggleExpanded,
  onIncQty,
  onToggleEquipped,
  onChangeLocation,
  onRemove,
}: Props) {
  return (
    <div className="border-muted rounded border">
      <button
        type="button"
        className="hover:bg-muted/50 flex w-full items-center justify-between p-2 text-left"
        onClick={() => onToggleExpanded(idx)}
      >
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{s.item.name}</div>
          <div className="text-muted-foreground text-xs">
            {s.item.rarity} • Tier {s.item.tier}
          </div>
        </div>
        <div className="text-muted-foreground text-xs">Details</div>
      </button>
      <div className="flex items-center justify-between gap-2 p-2 pt-0">
        <Button
          type="button"
          size="icon"
          variant="outline"
          aria-label="Decrease quantity"
          onClick={() => onIncQty(idx, -1)}
        >
          -
        </Button>
        <div className="w-8 text-center tabular-nums">{s.quantity}</div>
        <Button
          type="button"
          size="icon"
          variant="outline"
          aria-label="Increase quantity"
          onClick={() => onIncQty(idx, 1)}
        >
          +
        </Button>
        <div className="flex items-center gap-1">
          <Label htmlFor={`equipped-${idx}`} className="text-xs">
            Eqp
          </Label>
          <Switch
            id={`equipped-${idx}`}
            checked={!!s.isEquipped}
            onCheckedChange={checked => onToggleEquipped(idx, !!checked)}
            aria-label="Equipped"
          />
        </div>
        <Select
          value={s.location}
          onValueChange={val =>
            onChangeLocation(idx, val as InventorySlot['location'])
          }
        >
          <SelectTrigger className="w-[8.25rem]">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="backpack">Backpack</SelectItem>
            <SelectItem value="belt">Belt</SelectItem>
            <SelectItem value="equipped">Equipped</SelectItem>
            <SelectItem value="stored">Stored</SelectItem>
          </SelectContent>
        </Select>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          aria-label="Remove"
          onClick={() => onRemove(idx)}
        >
          Remove
        </Button>
      </div>
      {expanded ? (
        <div className="border-t p-2 text-xs">
          {/* Core meta */}
          <div className="mb-1 flex flex-wrap gap-x-3 gap-y-1">
            <span className="text-muted-foreground">🎖️ {s.item.rarity}</span>
            <span className="text-blue-600 dark:text-blue-400">
              ⛰️ Tier {s.item.tier}
            </span>
            {s.item.cost != null ? (
              <span className="text-amber-700 dark:text-amber-300">
                💰 {s.item.cost}
              </span>
            ) : null}
            {s.item.weight ? (
              <span className="text-emerald-700 dark:text-emerald-300">
                🏋️ {String(s.item.weight)}
              </span>
            ) : null}
          </div>
          {s.item.description ? (
            <div className="text-foreground/90 mb-2">{s.item.description}</div>
          ) : null}
          {/* Category specific */}
          {(() => {
            const cat = (s.item as unknown as { category?: string }).category;
            if (cat === 'Utility') {
              const u = s.item as unknown as UtilityItem;
              return (
                <div className="mb-2 space-y-1">
                  <div className="font-medium">🧰 Utility</div>
                  <div className="text-muted-foreground">
                    ⚙️ Usage:{' '}
                    <span className="text-foreground">
                      {String(u.usageType)}
                    </span>
                    {typeof u.charges === 'number' ? (
                      <>
                        {' '}
                        • 🔋{' '}
                        <span className="text-foreground">
                          {u.charges} charges
                        </span>
                      </>
                    ) : null}
                    {u.rechargePeriod ? (
                      <>
                        {' '}
                        • ♻️{' '}
                        <span className="text-foreground">
                          {String(u.rechargePeriod)}
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>
              );
            }
            if (cat === 'Consumable') {
              const c = s.item as unknown as Consumable | Potion;
              const isPotion = (c as Potion).potionType != null;
              return (
                <div className="mb-2 space-y-1">
                  <div className="font-medium">
                    {isPotion ? '🧪 Potion' : '🍽️ Consumable'}
                  </div>
                  <div className="text-muted-foreground space-x-1">
                    {isPotion ? (
                      <>
                        <span>
                          ✨ Type:{' '}
                          <span className="text-foreground">
                            {String((c as Potion).potionType)}
                          </span>
                        </span>
                        {(c as Potion).healingAmount ? (
                          <span>
                            • ❤️ Heal:{' '}
                            <span className="text-foreground">
                              {(c as Potion).healingAmount}
                            </span>
                          </span>
                        ) : null}
                        {(c as Potion).traitBonus ? (
                          <span>
                            • 💪 Trait:{' '}
                            <span className="text-foreground">
                              {(c as Potion).traitBonus!.trait} +
                              {(c as Potion).traitBonus!.bonus}
                            </span>{' '}
                            <span className="text-muted-foreground">
                              ({String((c as Potion).traitBonus!.duration)})
                            </span>
                          </span>
                        ) : null}
                      </>
                    ) : null}
                    {(c as Consumable).effect ? (
                      <span>
                        • 🎯 Effect:{' '}
                        <span className="text-foreground">
                          {(c as Consumable).effect}
                        </span>
                      </span>
                    ) : null}
                    {(c as Consumable).duration ? (
                      <span>
                        • ⏳ Duration:{' '}
                        <span className="text-foreground">
                          {(c as Consumable).duration}
                        </span>
                      </span>
                    ) : null}
                    {(c as Consumable).targetType ? (
                      <span>
                        • 🎯 Target:{' '}
                        <span className="text-foreground">
                          {String((c as Consumable).targetType)}
                        </span>
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            }
            if (cat === 'Relic') {
              const r = s.item as unknown as Relic;
              return (
                <div className="mb-2 space-y-1">
                  <div className="font-medium">🗿 Relic</div>
                  <div className="text-muted-foreground space-x-1">
                    {r.traitBonus ? (
                      <span>
                        • 💪 Trait:{' '}
                        <span className="text-foreground">
                          {r.traitBonus.trait} +{r.traitBonus.bonus}
                        </span>
                      </span>
                    ) : null}
                    {r.experienceBonus ? (
                      <span>
                        • 📚 XP:{' '}
                        <span className="text-foreground">
                          {r.experienceBonus.experience} +
                          {r.experienceBonus.bonus}
                        </span>
                      </span>
                    ) : null}
                    {r.exclusivity ? (
                      <span>
                        • 🚫{' '}
                        <span className="text-foreground">{r.exclusivity}</span>
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            }
            if (cat === 'Weapon Modification') {
              const w = s.item as unknown as WeaponModification;
              const compat = (w.compatibleWeapons || []).join(', ');
              return (
                <div className="mb-2 space-y-1">
                  <div className="font-medium">🛠️ Weapon Mod</div>
                  <div className="text-muted-foreground space-x-1">
                    <span>
                      • 🧩 Type:{' '}
                      <span className="text-foreground">
                        {String(w.modificationType)}
                      </span>
                    </span>
                    {compat ? (
                      <span>
                        • 🗡️ For:{' '}
                        <span className="text-foreground">{compat}</span>
                      </span>
                    ) : null}
                    {w.traitChange ? (
                      <span>
                        • 💪 Trait:{' '}
                        <span className="text-foreground">
                          {w.traitChange.trait}
                        </span>
                      </span>
                    ) : null}
                    {w.featureAdded ? (
                      <span>
                        • ✨ Feature:{' '}
                        <span className="text-foreground">
                          {w.featureAdded.name}
                        </span>
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            }
            if (cat === 'Armor Modification') {
              const a = s.item as unknown as ArmorModification;
              const compat = (a.compatibleArmor || []).join(', ');
              return (
                <div className="mb-2 space-y-1">
                  <div className="font-medium">🛡️ Armor Mod</div>
                  <div className="text-muted-foreground space-x-1">
                    <span>
                      • 🧩 Type:{' '}
                      <span className="text-foreground">
                        {String(a.modificationType)}
                      </span>
                    </span>
                    {compat ? (
                      <span>
                        • 🛡️ For:{' '}
                        <span className="text-foreground">{compat}</span>
                      </span>
                    ) : null}
                    {a.featureAdded ? (
                      <span>
                        • ✨ Feature:{' '}
                        <span className="text-foreground">
                          {a.featureAdded.name}
                        </span>
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            }
            if (cat === 'Recipe') {
              const rc = s.item as unknown as Recipe;
              const mats = (rc.materials || []).join(', ');
              return (
                <div className="mb-2 space-y-1">
                  <div className="font-medium">📜 Recipe</div>
                  <div className="text-muted-foreground space-x-1">
                    <span>
                      • 🎁 Makes:{' '}
                      <span className="text-foreground">{rc.craftedItem}</span>
                    </span>
                    {mats ? (
                      <span>
                        • 🧱 Materials:{' '}
                        <span className="text-foreground">{mats}</span>
                      </span>
                    ) : null}
                    {rc.downtimeRequired ? (
                      <span>• ⏳ Downtime required</span>
                    ) : null}
                  </div>
                  {rc.instructions ? (
                    <div className="text-foreground/90">
                      📝 {rc.instructions}
                    </div>
                  ) : null}
                </div>
              );
            }
            return null;
          })()}
          {/* Features */}
          {Array.isArray(s.item.features) && s.item.features.length ? (
            <div className="space-y-1">
              <div className="font-medium">📒 Features</div>
              <ul className="list-disc pl-4">
                {s.item.features.map((f, i) => (
                  <li key={i}>
                    <span className="font-medium">{f.name}:</span>{' '}
                    {f.description}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
