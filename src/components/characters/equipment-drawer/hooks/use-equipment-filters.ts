import * as React from 'react';

import {
  ALL_ARMOR,
  ALL_PRIMARY_WEAPONS,
  ALL_SECONDARY_WEAPONS,
} from '@/lib/data/equipment';
import { rankAdvanced, rankings } from '@/utils/search/rank';

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

// --- helpers (extracted to keep main hook small)

function buildPrimarySource(
  filter: SourceFilter,
  hbPrimary: MinimalWeapon[],
  hbSecondary: MinimalWeapon[]
) {
  if (filter === 'homebrew') return [...hbPrimary];
  if (filter === 'all')
    return [
      ...ALL_PRIMARY_WEAPONS,
      ...ALL_SECONDARY_WEAPONS,
      ...hbPrimary,
      ...hbSecondary,
    ];
  return [...ALL_PRIMARY_WEAPONS];
}

function buildSecondarySource(
  filter: SourceFilter,
  hbPrimary: MinimalWeapon[],
  hbSecondary: MinimalWeapon[]
) {
  if (filter === 'homebrew') return [...hbSecondary];
  if (filter === 'all')
    return [
      ...ALL_SECONDARY_WEAPONS,
      ...ALL_PRIMARY_WEAPONS,
      ...hbPrimary,
      ...hbSecondary,
    ];
  return [...ALL_SECONDARY_WEAPONS];
}

function filterWeaponsByFacets(
  items: MinimalWeapon[],
  tier: string,
  burden: string
) {
  return items.filter(w => {
    const tierOk = tier ? String(w.tier) === tier : true;
    const burdenOk = burden ? String(w.burden) === burden : true;
    return tierOk && burdenOk;
  });
}

function rankWeapons(items: MinimalWeapon[], q: string) {
  const qq = (q || '').trim();
  if (!qq) return items;
  return rankAdvanced<MinimalWeapon>(
    items,
    qq,
    [
      'name',
      (w: MinimalWeapon) => String(w.trait ?? ''),
      (w: MinimalWeapon) => String(w.range ?? ''),
      (w: MinimalWeapon) => String(w.burden ?? ''),
    ],
    rankings.CONTAINS
  );
}

function buildArmorSource(hbArmor: MinimalArmor[]) {
  const base = ALL_ARMOR as unknown as MinimalArmor[];
  return base.concat(hbArmor as unknown as MinimalArmor[]);
}

function filterArmorByFacets(
  items: MinimalArmor[],
  kind: '' | 'standard' | 'special',
  tier: '' | '1' | '2' | '3' | '4',
  withEvasionMod: boolean,
  withAgilityMod: boolean
) {
  return items.filter(a => {
    const any = a as unknown as {
      armorType?: string;
      isStandard?: boolean;
      tier?: string | number;
      evasionModifier?: number;
      agilityModifier?: number;
    };
    const kindOk = kind
      ? kind === 'standard'
        ? any.isStandard === true
        : any.isStandard === false
      : true;
    const tierOk = tier ? String(any.tier) === tier : true;
    const evOk = withEvasionMod ? (any.evasionModifier || 0) !== 0 : true;
    const agOk = withAgilityMod ? (any.agilityModifier || 0) !== 0 : true;
    return kindOk && tierOk && evOk && agOk;
  });
}

function rankArmor(items: MinimalArmor[], q: string) {
  const qq = (q || '').trim();
  if (!qq) return items;
  return rankAdvanced<MinimalArmor>(
    items,
    qq,
    [
      'name',
      (a: MinimalArmor) =>
        String((a as { armorType?: string }).armorType ?? ''),
    ],
    rankings.CONTAINS
  );
}

function countsForPrimary(hbP: MinimalWeapon[], hbS: MinimalWeapon[]) {
  return {
    default: ALL_PRIMARY_WEAPONS.length,
    homebrew: hbP.length,
    all:
      ALL_PRIMARY_WEAPONS.length +
      ALL_SECONDARY_WEAPONS.length +
      hbP.length +
      hbS.length,
  } as const;
}

function countsForSecondary(hbP: MinimalWeapon[], hbS: MinimalWeapon[]) {
  return {
    default: ALL_SECONDARY_WEAPONS.length,
    homebrew: hbS.length,
    all:
      ALL_SECONDARY_WEAPONS.length +
      ALL_PRIMARY_WEAPONS.length +
      hbP.length +
      hbS.length,
  } as const;
}

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
  const primarySource = React.useMemo(
    () =>
      buildPrimarySource(
        primarySourceFilter,
        homebrewPrimary,
        homebrewSecondary
      ),
    [primarySourceFilter, homebrewPrimary, homebrewSecondary]
  );

  const secondarySource = React.useMemo(
    () =>
      buildSecondarySource(
        secondarySourceFilter,
        homebrewPrimary,
        homebrewSecondary
      ),
    [secondarySourceFilter, homebrewPrimary, homebrewSecondary]
  );

  const armorSource = React.useMemo(
    () => buildArmorSource(homebrewArmor),
    [homebrewArmor]
  );

  // Visible counts for source options
  const primaryCounts = React.useMemo(
    () => countsForPrimary(homebrewPrimary, homebrewSecondary),
    [homebrewPrimary, homebrewSecondary]
  );

  const secondaryCounts = React.useMemo(
    () => countsForSecondary(homebrewPrimary, homebrewSecondary),
    [homebrewPrimary, homebrewSecondary]
  );

  const filteredPrimary = React.useMemo(() => {
    const faceted = filterWeaponsByFacets(
      primarySource,
      primaryTier,
      primaryBurden
    );
    return rankWeapons(faceted, qPrimary);
  }, [primarySource, qPrimary, primaryTier, primaryBurden]);

  const filteredSecondary = React.useMemo(() => {
    const faceted = filterWeaponsByFacets(
      secondarySource,
      secondaryTier,
      secondaryBurden
    );
    return rankWeapons(faceted, qSecondary);
  }, [secondarySource, qSecondary, secondaryTier, secondaryBurden]);

  const filteredArmor = React.useMemo(() => {
    const faceted = filterArmorByFacets(
      armorSource,
      armorKind,
      armorTier,
      armorWithEvasionMod,
      armorWithAgilityMod
    );
    return rankArmor(faceted, qArmor);
  }, [
    armorSource,
    qArmor,
    armorKind,
    armorTier,
    armorWithEvasionMod,
    armorWithAgilityMod,
  ]);

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
