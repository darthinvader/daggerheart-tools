import * as React from 'react';

import {
  ALL_ARMOR,
  ALL_PRIMARY_WEAPONS,
  ALL_SECONDARY_WEAPONS,
} from '@/lib/data/equipment';

export type SourceFilter = 'default' | 'homebrew' | 'all';

type MinimalWeapon = {
  name: string;
  tier?: string | number;
  trait?: string;
  range?: string | number;
  burden?: string | number;
} & Record<string, unknown>;
type MinimalArmor = {
  name: string;
  armorType?: string;
  isStandard?: boolean;
  tier?: string | number;
  evasionModifier?: number;
  agilityModifier?: number;
} & Record<string, unknown>;

export function useEquipmentFilters(args: {
  homebrewPrimary: MinimalWeapon[];
  homebrewSecondary: MinimalWeapon[];
  homebrewArmor: MinimalArmor[];
}) {
  const { homebrewPrimary, homebrewSecondary, homebrewArmor } = args;

  // Source filters per weapon tab
  const [primarySourceFilter, setPrimarySourceFilter] =
    React.useState<SourceFilter>('default');
  const [secondarySourceFilter, setSecondarySourceFilter] =
    React.useState<SourceFilter>('default');

  // Local search state per section for filtering; defaults empty to show all
  const [qPrimary, setQPrimary] = React.useState('');
  const [qSecondary, setQSecondary] = React.useState('');
  const [qArmor, setQArmor] = React.useState('');

  // Simple filters per tab
  const [primaryTier, setPrimaryTier] = React.useState<string>('');
  const [primaryBurden, setPrimaryBurden] = React.useState<string>('');
  const [secondaryTier, setSecondaryTier] = React.useState<string>('');
  const [secondaryBurden, setSecondaryBurden] = React.useState<string>('');
  const [armorKind, setArmorKind] = React.useState<'' | 'standard' | 'special'>(
    ''
  );
  const [armorTier, setArmorTier] = React.useState<'' | '1' | '2' | '3' | '4'>(
    ''
  );
  const [armorWithEvasionMod, setArmorWithEvasionMod] = React.useState(false);
  const [armorWithAgilityMod, setArmorWithAgilityMod] = React.useState(false);

  // Compute sources based on selected filters
  const primarySource = React.useMemo(() => {
    if (primarySourceFilter === 'homebrew') return [...homebrewPrimary];
    if (primarySourceFilter === 'all') {
      return [
        ...ALL_PRIMARY_WEAPONS,
        ...ALL_SECONDARY_WEAPONS,
        ...homebrewPrimary,
        ...homebrewSecondary,
      ];
    }
    // default
    return [...ALL_PRIMARY_WEAPONS];
  }, [primarySourceFilter, homebrewPrimary, homebrewSecondary]);

  const secondarySource = React.useMemo(() => {
    if (secondarySourceFilter === 'homebrew') return [...homebrewSecondary];
    if (secondarySourceFilter === 'all') {
      return [
        ...ALL_SECONDARY_WEAPONS,
        ...ALL_PRIMARY_WEAPONS,
        ...homebrewPrimary,
        ...homebrewSecondary,
      ];
    }
    // default
    return [...ALL_SECONDARY_WEAPONS];
  }, [secondarySourceFilter, homebrewPrimary, homebrewSecondary]);

  const armorSource = React.useMemo(() => {
    const base = ALL_ARMOR as unknown as MinimalArmor[];
    return base.concat(homebrewArmor as unknown as MinimalArmor[]);
  }, [homebrewArmor]);

  // Visible counts for source options
  const primaryCounts = React.useMemo(
    () => ({
      default: ALL_PRIMARY_WEAPONS.length,
      homebrew: homebrewPrimary.length,
      all:
        ALL_PRIMARY_WEAPONS.length +
        ALL_SECONDARY_WEAPONS.length +
        homebrewPrimary.length +
        homebrewSecondary.length,
    }),
    [homebrewPrimary, homebrewSecondary]
  );

  const secondaryCounts = React.useMemo(
    () => ({
      default: ALL_SECONDARY_WEAPONS.length,
      homebrew: homebrewSecondary.length,
      all:
        ALL_SECONDARY_WEAPONS.length +
        ALL_PRIMARY_WEAPONS.length +
        homebrewPrimary.length +
        homebrewSecondary.length,
    }),
    [homebrewPrimary, homebrewSecondary]
  );

  const filteredPrimary = React.useMemo(
    () =>
      primarySource.filter(w => {
        const matchesText = (qPrimary || '')
          .split(/\s+/)
          .every(t =>
            t
              ? `${w.name} ${w.trait} ${w.range} ${w.burden}`
                  .toLowerCase()
                  .includes(t.toLowerCase())
              : true
          );
        const matchesTier = primaryTier ? String(w.tier) === primaryTier : true;
        const matchesBurden = primaryBurden
          ? String(w.burden) === primaryBurden
          : true;
        return matchesText && matchesTier && matchesBurden;
      }),
    [primarySource, qPrimary, primaryTier, primaryBurden]
  );

  const filteredSecondary = React.useMemo(
    () =>
      secondarySource.filter(w => {
        const matchesText = (qSecondary || '')
          .split(/\s+/)
          .every(t =>
            t
              ? `${w.name} ${w.trait} ${w.range} ${w.burden}`
                  .toLowerCase()
                  .includes(t.toLowerCase())
              : true
          );
        const matchesTier = secondaryTier
          ? String(w.tier) === secondaryTier
          : true;
        const matchesBurden = secondaryBurden
          ? String(w.burden) === secondaryBurden
          : true;
        return matchesText && matchesTier && matchesBurden;
      }),
    [secondarySource, qSecondary, secondaryTier, secondaryBurden]
  );

  const filteredArmor = React.useMemo(
    () =>
      armorSource.filter(a => {
        const aAny = a as unknown as {
          armorType?: string;
          isStandard?: boolean;
          tier?: string | number;
          evasionModifier?: number;
          agilityModifier?: number;
          name?: string;
        };
        const aType = String(aAny.armorType || '');
        const matchesText = (qArmor || '')
          .split(/\s+/)
          .every(t =>
            t
              ? `${aAny.name ?? ''} ${aType}`
                  .toLowerCase()
                  .includes(t.toLowerCase())
              : true
          );
        const matchesKind = armorKind
          ? armorKind === 'standard'
            ? aAny.isStandard === true
            : aAny.isStandard === false
          : true;
        const matchesTier = armorTier ? String(aAny.tier) === armorTier : true;
        const matchesEvasion = armorWithEvasionMod
          ? (aAny.evasionModifier || 0) !== 0
          : true;
        const matchesAgility = armorWithAgilityMod
          ? (aAny.agilityModifier || 0) !== 0
          : true;
        return (
          matchesText &&
          matchesKind &&
          matchesTier &&
          matchesEvasion &&
          matchesAgility
        );
      }),
    [
      armorSource,
      qArmor,
      armorKind,
      armorTier,
      armorWithEvasionMod,
      armorWithAgilityMod,
    ]
  );

  return {
    primary: {
      sourceFilter: primarySourceFilter,
      setSourceFilter: setPrimarySourceFilter,
      counts: primaryCounts,
      q: qPrimary,
      setQ: setQPrimary,
      tier: primaryTier,
      setTier: setPrimaryTier,
      burden: primaryBurden,
      setBurden: setPrimaryBurden,
      items: filteredPrimary,
    },
    secondary: {
      sourceFilter: secondarySourceFilter,
      setSourceFilter: setSecondarySourceFilter,
      counts: secondaryCounts,
      q: qSecondary,
      setQ: setQSecondary,
      tier: secondaryTier,
      setTier: setSecondaryTier,
      burden: secondaryBurden,
      setBurden: setSecondaryBurden,
      items: filteredSecondary,
    },
    armor: {
      q: qArmor,
      setQ: setQArmor,
      kind: armorKind,
      setKind: setArmorKind,
      tier: armorTier,
      setTier: setArmorTier,
      withEvasionMod: armorWithEvasionMod,
      setWithEvasionMod: setArmorWithEvasionMod,
      withAgilityMod: armorWithAgilityMod,
      setWithAgilityMod: setArmorWithAgilityMod,
      items: filteredArmor,
    },
  } as const;
}
