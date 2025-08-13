import { CurrentSelectionStrip } from '@/components/characters/equipment-drawer/current-selection-strip';
import { HomebrewWeaponForm } from '@/components/characters/equipment-drawer/homebrew-weapon-form';
import { SourceFilterToggle } from '@/components/characters/equipment-drawer/source-filter-toggle';
import { WeaponsFiltersToolbar } from '@/components/characters/equipment-drawer/weapons-filters-toolbar';
import { WeaponsResultsList } from '@/components/characters/equipment-drawer/weapons-results-list';
import { Input } from '@/components/ui/input';

type SourceFilter = 'default' | 'homebrew' | 'all';

export type SecondaryPanelProps = {
  current?:
    | {
        name: string;
        trait: string;
        range: number | string;
        burden: number | string;
        damage: {
          count: number;
          diceType: number | string;
          modifier?: number;
          type: string;
        };
        domainAffinity?: string;
      }
    | undefined;
  onClear: () => void;
  sourceFilter: SourceFilter;
  counts: { default: number; homebrew: number; all: number };
  onSourceFilterChange: (v: SourceFilter) => void;
  q: string;
  onQChange: (v: string) => void;
  tier: string;
  onTierChange: (v: string) => void;
  burden: string;
  onBurdenChange: (v: string) => void;
  items: unknown[];
  isSelected: (w: unknown) => boolean;
  onSelect: (w: unknown) => void;
  onAddHomebrew: (w: unknown) => void;
};

export function SecondaryPanel(props: SecondaryPanelProps) {
  const {
    current,
    onClear,
    sourceFilter,
    counts,
    onSourceFilterChange,
    q,
    onQChange,
    tier,
    onTierChange,
    burden,
    onBurdenChange,
    items,
    isSelected,
    onSelect,
    onAddHomebrew,
  } = props;
  return (
    <div className="space-y-2">
      {current ? (
        <CurrentSelectionStrip
          kind="secondary"
          name={current.name}
          onClear={onClear}
          tags={[
            { label: current.trait, icon: 'trait' },
            { label: String(current.range), icon: 'range' },
            {
              label: `${current.damage.count}d${current.damage.diceType}${current.damage.modifier ? `+${current.damage.modifier}` : ''} ${current.damage.type}`,
              icon: 'damage',
            },
            { label: String(current.burden), icon: 'burden' },
            ...(current.domainAffinity
              ? [{ label: current.domainAffinity }]
              : []),
          ]}
        />
      ) : null}
      <SourceFilterToggle
        value={sourceFilter}
        counts={counts}
        onChange={onSourceFilterChange}
      />
      <Input
        placeholder="Search secondary weapons"
        value={q}
        onChange={e => onQChange(e.target.value)}
        inputMode="search"
        enterKeyHint="search"
      />
      <WeaponsFiltersToolbar
        tier={tier}
        onTierChange={onTierChange}
        burden={burden}
        onBurdenChange={onBurdenChange}
      />
      <WeaponsResultsList
        items={items as never}
        isSelected={isSelected as never}
        onSelect={onSelect as never}
      />
      <HomebrewWeaponForm
        slotLabel="Secondary"
        defaultType="Secondary"
        onAdd={onAddHomebrew as never}
      />
    </div>
  );
}
