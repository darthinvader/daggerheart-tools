import { ArmorFiltersToolbar } from '@/components/characters/equipment-drawer/armor-filters-toolbar';
import { ArmorResultsList } from '@/components/characters/equipment-drawer/armor-results-list';
import { CurrentSelectionStrip } from '@/components/characters/equipment-drawer/current-selection-strip';
import { HomebrewArmorForm } from '@/components/characters/equipment-drawer/homebrew-armor-form';
import { Input } from '@/components/ui/input';

export type ArmorPanelProps = {
  current?:
    | {
        name: string;
        baseScore: number | string;
        baseThresholds: { major: number | string; severe: number | string };
        evasionModifier?: number;
        agilityModifier?: number;
      }
    | undefined;
  currentArmorType?: string | undefined;
  onClear: () => void;
  q: string;
  onQChange: (v: string) => void;
  kind: '' | 'standard' | 'special';
  onKindChange: (v: '' | 'standard' | 'special') => void;
  tier: '' | '1' | '2' | '3' | '4';
  onTierChange: (v: '' | '1' | '2' | '3' | '4') => void;
  withEvasionMod: boolean;
  onWithEvasionModChange: (v: boolean) => void;
  withAgilityMod: boolean;
  onWithAgilityModChange: (v: boolean) => void;
  items: unknown[];
  isSelected: (a: unknown) => boolean;
  onSelect: (a: unknown) => void;
  onAddHomebrew: (a: unknown) => void;
};

export function ArmorPanel(props: ArmorPanelProps) {
  const {
    current,
    currentArmorType,
    onClear,
    q,
    onQChange,
    kind,
    onKindChange,
    tier,
    onTierChange,
    withEvasionMod,
    onWithEvasionModChange,
    withAgilityMod,
    onWithAgilityModChange,
    items,
    isSelected,
    onSelect,
    onAddHomebrew,
  } = props;
  return (
    <div className="space-y-2">
      {current ? (
        <CurrentSelectionStrip
          kind="armor"
          name={current.name}
          onClear={onClear}
          tags={[
            { label: `Base ${current.baseScore}` },
            {
              label: `M${current.baseThresholds.major}/S${current.baseThresholds.severe}`,
            },
            ...(current.evasionModifier
              ? [
                  {
                    label: `Evasion ${current.evasionModifier >= 0 ? `+${current.evasionModifier}` : current.evasionModifier}`,
                  },
                ]
              : []),
            ...(current.agilityModifier
              ? [
                  {
                    label: `Agility ${current.agilityModifier >= 0 ? `+${current.agilityModifier}` : current.agilityModifier}`,
                  },
                ]
              : []),
            ...(currentArmorType ? [{ label: currentArmorType }] : []),
          ]}
        />
      ) : null}
      <Input
        placeholder="Search armor"
        value={q}
        onChange={e => onQChange(e.target.value)}
        inputMode="search"
        enterKeyHint="search"
      />
      <ArmorFiltersToolbar
        kind={kind}
        onKindChange={onKindChange}
        tier={tier}
        onTierChange={onTierChange}
        withEvasionMod={withEvasionMod}
        onWithEvasionModChange={onWithEvasionModChange}
        withAgilityMod={withAgilityMod}
        onWithAgilityModChange={onWithAgilityModChange}
      />
      <ArmorResultsList
        items={items as never}
        isSelected={isSelected as never}
        onSelect={onSelect as never}
      />
      <HomebrewArmorForm onAdd={onAddHomebrew as never} />
    </div>
  );
}
