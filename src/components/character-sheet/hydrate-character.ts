/**
 * Hydration logic for mapping server CharacterRecord to local state
 */
import type { CharacterRecord } from '@/lib/api/characters';
import { getDomainsForClass } from '@/lib/data/classes';
import type { InventoryItemEntry } from '@/lib/schemas/equipment';
import { getAncestryByName, getCommunityByName } from '@/lib/schemas/identity';
import { DEFAULT_QUICK_VIEW_PREFERENCES } from '@/lib/schemas/quick-view';

/**
 * Type for the return value of useCharacterState hook
 */
type CharacterStateHook = ReturnType<
  typeof import('@/components/demo/character-state-hooks').useCharacterState
>;

/**
 * Type for the return value of useSessionState hook
 */
type SessionStateHook = ReturnType<
  typeof import('@/components/demo/character-state-hooks').useSessionState
>;

/**
 * Hydrates identity state from server data
 */
export function hydrateIdentity(
  serverData: CharacterRecord,
  setIdentity: CharacterStateHook['setIdentity']
): void {
  const backgroundValue = serverData.identity.background;
  const backgroundString = Array.isArray(backgroundValue)
    ? backgroundValue.map(qa => `${qa.question}: ${qa.answer}`).join('\n')
    : backgroundValue || '';

  setIdentity({
    name: serverData.identity.name || '',
    pronouns: serverData.identity.pronouns || '',
    calling: serverData.identity.calling || '',
    description: serverData.identity.description || '',
    background: backgroundString,
    descriptionDetails: serverData.identity.descriptionDetails || {},
    connections: serverData.identity.connections || [],
  });
}

/**
 * Hydrates ancestry state from server data
 */
// eslint-disable-next-line complexity
export function hydrateAncestry(
  serverData: CharacterRecord,
  setAncestry: CharacterStateHook['setAncestry']
): void {
  const ancestryName = serverData.identity.ancestry;
  const ancestryDetails = serverData.identity.ancestryDetails;

  if (
    ancestryName &&
    ancestryDetails?.type === 'mixed' &&
    ancestryDetails.mixed
  ) {
    const primaryFrom = ancestryDetails.mixed.primaryFrom || '';
    const secondaryFrom = ancestryDetails.mixed.secondaryFrom || '';
    const primaryAncestry = primaryFrom
      ? getAncestryByName(primaryFrom)
      : undefined;
    const secondaryAncestry = secondaryFrom
      ? getAncestryByName(secondaryFrom)
      : undefined;

    setAncestry({
      mode: 'mixed',
      mixedAncestry: {
        name: ancestryDetails.mixed.name || ancestryName,
        parentAncestries: [primaryFrom, secondaryFrom].filter(Boolean),
        primaryFeature: primaryAncestry?.primaryFeature ?? {
          name: '',
          description: '',
          type: 'primary' as const,
        },
        secondaryFeature: secondaryAncestry?.secondaryFeature ?? {
          name: '',
          description: '',
          type: 'secondary' as const,
        },
      },
    } as never);
  } else if (
    ancestryName &&
    ancestryDetails?.type === 'homebrew' &&
    ancestryDetails.homebrew
  ) {
    setAncestry({
      mode: 'homebrew',
      homebrew: ancestryDetails.homebrew,
    } as never);
  } else if (ancestryName) {
    const fullAncestry = getAncestryByName(ancestryName);
    if (fullAncestry) {
      setAncestry({ mode: 'standard', ancestry: fullAncestry });
    } else {
      setAncestry(null);
    }
  } else {
    setAncestry(null);
  }
}

/**
 * Hydrates community state from server data
 */
export function hydrateCommunity(
  serverData: CharacterRecord,
  setCommunity: CharacterStateHook['setCommunity']
): void {
  const communityName = serverData.identity.community;
  const communityDetails = serverData.identity.communityDetails;

  if (
    communityName &&
    communityDetails?.type === 'homebrew' &&
    communityDetails.homebrew
  ) {
    setCommunity({
      mode: 'homebrew',
      homebrew: communityDetails.homebrew,
    } as never);
  } else if (communityName) {
    const fullCommunity = getCommunityByName(communityName);
    if (fullCommunity) {
      setCommunity({ mode: 'standard', community: fullCommunity });
    } else {
      setCommunity(null);
    }
  } else {
    setCommunity(null);
  }
}

/**
 * Hydrates class selection from server data
 */
export function hydrateClassSelection(
  serverData: CharacterRecord,
  setClassSelection: CharacterStateHook['setClassSelection']
): void {
  if (serverData.classDraft.className) {
    const isHomebrew = serverData.classDraft.mode === 'homebrew';
    const homebrewClass = serverData.classDraft.homebrewClass;

    // Derive domains from class data or homebrew class
    let domains: string[] = [];
    if (isHomebrew && homebrewClass?.domains) {
      domains = homebrewClass.domains;
    } else if (!isHomebrew) {
      // For standard classes, get domains from the class definition
      // Handle multiclass by splitting class names and getting unique domains
      const classNames = serverData.classDraft.className.split(' / ');
      const allDomains = classNames.flatMap(name => getDomainsForClass(name));
      domains = [...new Set(allDomains)];
    }

    setClassSelection({
      mode: serverData.classDraft.mode || 'standard',
      className: serverData.classDraft.className,
      subclassName: serverData.classDraft.subclassName || '',
      domains,
      isHomebrew,
      homebrewClass,
    } as never);
  } else {
    setClassSelection(null);
  }
}

/**
 * Hydrates thresholds from server data
 */
export function hydrateThresholds(
  serverData: CharacterRecord,
  setThresholds: CharacterStateHook['setThresholds']
): void {
  if (serverData.thresholds) {
    setThresholds(serverData.thresholds);
  } else {
    setThresholds({
      auto: true,
      autoMajor: true,
      values: {
        major: 0,
        severe: 0,
        critical: 0,
        dsOverride: false,
        ds: 0,
      },
      enableCritical: false,
    });
  }
}

/**
 * Hydrates inventory from server data
 */
export function hydrateInventory(
  serverData: CharacterRecord,
  setInventory: CharacterStateHook['setInventory']
): void {
  const inventoryItems = (serverData.inventory?.slots || []).map(
    (slot, idx) => ({
      id: `slot-${idx}`,
      item: slot.item || {
        name: slot.name || 'Unknown Item',
        tier: '1',
        description: slot.description || '',
        category: 'Utility',
        features: [],
        tags: [],
        metadata: {},
        rarity: 'Common',
        isConsumable: false,
        maxQuantity: 1,
      },
      quantity: slot.quantity ?? 1,
      isEquipped: slot.isEquipped ?? false,
      location:
        (slot.location as 'backpack' | 'belt' | 'equipped' | 'stored') ||
        'backpack',
    })
  );

  setInventory({
    items: inventoryItems as unknown as InventoryItemEntry[],
    maxSlots: serverData.inventory?.maxItems ?? 50,
    unlimitedSlots: serverData.inventory?.unlimitedSlots ?? false,
    unlimitedQuantity: serverData.inventory?.unlimitedQuantity ?? false,
  });
}

// Default values for equipment hydration
const DEFAULT_HOMEBREW_PRIMARY = { type: 'Primary' as const, features: [] };
const DEFAULT_HOMEBREW_SECONDARY = { type: 'Secondary' as const, features: [] };
const DEFAULT_HOMEBREW_ARMOR = { features: [] };
const DEFAULT_HOMEBREW_WHEELCHAIR = {
  type: 'Primary' as const,
  features: [],
  wheelchairFeatures: [],
  frameType: 'Light' as const,
};

/**
 * Hydrates equipment from server data.
 * Uses helper to build equipment object with defaults.
 *
 * Complexity note: This function has high cyclomatic complexity due to
 * many fallback expressions (||, ??), but each line is a simple independent
 * property assignment with no branching logic.
 */
// eslint-disable-next-line complexity -- Linear property mapping, not actual branching complexity
export function hydrateEquipment(
  serverData: CharacterRecord,
  setEquipment: CharacterStateHook['setEquipment']
): void {
  const eq = serverData.equipment;
  const equipment = {
    primaryWeapon: eq?.primaryWeapon || null,
    primaryWeaponMode: eq?.primaryWeaponMode || 'standard',
    homebrewPrimaryWeapon:
      eq?.homebrewPrimaryWeapon || DEFAULT_HOMEBREW_PRIMARY,
    secondaryWeapon: eq?.secondaryWeapon || null,
    secondaryWeaponMode: eq?.secondaryWeaponMode || 'standard',
    homebrewSecondaryWeapon:
      eq?.homebrewSecondaryWeapon || DEFAULT_HOMEBREW_SECONDARY,
    armor: eq?.armor || null,
    armorMode: eq?.armorMode || 'standard',
    homebrewArmor: eq?.homebrewArmor || DEFAULT_HOMEBREW_ARMOR,
    useCombatWheelchair: eq?.useCombatWheelchair ?? false,
    combatWheelchair: eq?.combatWheelchair || null,
    wheelchairMode: eq?.wheelchairMode || 'standard',
    homebrewWheelchair: eq?.homebrewWheelchair || DEFAULT_HOMEBREW_WHEELCHAIR,
    customSlots: eq?.customSlots || [],
  };
  setEquipment(equipment as never);
}

// Default values for resources hydration
const DEFAULT_HP = { current: 6, max: 6 };
const DEFAULT_STRESS = { current: 0, max: 6 };
const DEFAULT_HOPE = { current: 2, max: 6 };
const DEFAULT_ARMOR_SCORE = { current: 0, max: 0 };
const DEFAULT_GOLD = {
  handfuls: 0,
  bags: 0,
  chests: 0,
  coins: 0,
  showCoins: false,
  displayDenomination: 'handfuls' as const,
};

/**
 * Hydrates resources from server data.
 * Uses simple property access with defaults for each field.
 *
 * Complexity note: This function has high cyclomatic complexity due to
 * many fallback expressions (||, ??), but each line is a simple independent
 * property assignment with no branching logic.
 */
// eslint-disable-next-line complexity -- Linear property mapping, not actual branching complexity
export function hydrateResources(
  serverData: CharacterRecord,
  setResources: CharacterStateHook['setResources'],
  setGold: CharacterStateHook['setGold'],
  setCoreScores: CharacterStateHook['setCoreScores']
): void {
  const res = serverData.resources;
  setResources({
    hp: res?.hp || DEFAULT_HP,
    stress: res?.stress || DEFAULT_STRESS,
    hope: res?.hope || DEFAULT_HOPE,
    armorScore: res?.armorScore || DEFAULT_ARMOR_SCORE,
    autoCalculateHp: res?.autoCalculateHp ?? true,
    autoCalculateEvasion: res?.autoCalculateEvasion ?? true,
    autoCalculateArmorScore: res?.autoCalculateArmorScore ?? true,
    autoCalculateThresholds: res?.autoCalculateThresholds ?? true,
  });

  setGold(res?.gold || DEFAULT_GOLD);

  const scores = serverData.coreScores;
  setCoreScores({
    evasion: scores?.evasion ?? res?.evasion ?? 10,
    proficiency: scores?.proficiency ?? res?.proficiency ?? 1,
    autoCalculateEvasion: scores?.autoCalculateEvasion ?? true,
  });
}

/**
 * Hydrates traits from server data
 */
export function hydrateTraits(
  serverData: CharacterRecord,
  setTraits: CharacterStateHook['setTraits']
): void {
  if (serverData.traits && Object.keys(serverData.traits).length > 0) {
    setTraits(
      serverData.traits as unknown as import('@/components/traits').TraitsState
    );
  } else {
    setTraits({
      Agility: { value: 0, bonus: 0, marked: false },
      Strength: { value: 0, bonus: 0, marked: false },
      Finesse: { value: 0, bonus: 0, marked: false },
      Instinct: { value: 0, bonus: 0, marked: false },
      Presence: { value: 0, bonus: 0, marked: false },
      Knowledge: { value: 0, bonus: 0, marked: false },
    });
  }
}

/**
 * Hydrates session state (companion, scars, countdowns, etc.)
 */
export function hydrateSessionStateHook(
  serverData: CharacterRecord,
  SessionStateHook: SessionStateHook
): void {
  if (serverData.companion) {
    const companionRange = serverData.companion.range;
    const validRange =
      companionRange === 'Very Close' || companionRange === 'Very Far'
        ? ('Close' as const)
        : (companionRange as 'Melee' | 'Close' | 'Far');
    SessionStateHook.setCompanion({
      ...serverData.companion,
      range: validRange,
    });
  }
  SessionStateHook.setCompanionEnabled(serverData.companionEnabled ?? false);
  SessionStateHook.setScars(serverData.scars || []);
  SessionStateHook.setExtraHopeSlots(serverData.extraHopeSlots ?? 0);
  SessionStateHook.setCompanionHopeFilled(
    serverData.companionHopeFilled ?? false
  );
  SessionStateHook.setCountdowns(serverData.countdowns || []);
  SessionStateHook.setSessions(serverData.sessions || []);
  SessionStateHook.setCurrentSessionId(serverData.currentSessionId ?? null);
  SessionStateHook.setNotes(serverData.notes || []);
  SessionStateHook.setDowntimeActivities(serverData.downtimeActivities || []);
  SessionStateHook.setQuickView(
    serverData.quickView ?? DEFAULT_QUICK_VIEW_PREFERENCES
  );
}

/**
 * Main hydration function - orchestrates all hydration
 */
export function hydrateCharacterState(
  serverData: CharacterRecord,
  charState: CharacterStateHook,
  sessionState: SessionStateHook
): void {
  hydrateIdentity(serverData, charState.setIdentity);
  hydrateAncestry(serverData, charState.setAncestry);
  hydrateCommunity(serverData, charState.setCommunity);
  hydrateClassSelection(serverData, charState.setClassSelection);

  charState.setProgression({
    currentLevel: serverData.progression.currentLevel,
    currentTier: serverData.progression.currentTier,
    tierHistory: {},
  });

  hydrateThresholds(serverData, charState.setThresholds);

  charState.setLoadout({
    activeCards: serverData.domains?.loadout || [],
    vaultCards: serverData.domains?.vault || [],
  } as never);

  hydrateInventory(serverData, charState.setInventory);
  hydrateEquipment(serverData, charState.setEquipment);

  charState.setConditions({
    items: (serverData.conditions || []).map(c =>
      typeof c === 'string' ? c : c.name
    ),
  });

  // experiences is stored as { items: [...] } with { id, name, value }
  const experienceItems = serverData.experiences?.items ?? [];
  charState.setExperiences({
    items: experienceItems.map((e, i) => ({
      id: e.id ?? String(i),
      name: e.name,
      value: e.value,
    })),
  });

  hydrateResources(
    serverData,
    charState.setResources,
    charState.setGold,
    charState.setCoreScores
  );
  hydrateTraits(serverData, charState.setTraits);
  hydrateSessionStateHook(serverData, sessionState);
}
