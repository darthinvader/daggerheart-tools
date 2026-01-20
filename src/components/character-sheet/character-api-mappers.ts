/**
 * Mapper functions for converting local state to CharacterRecord API format
 */
import type { AncestrySelection } from '@/components/ancestry-selector';
import type { CharacterNote } from '@/components/character-notes';
import type { CompanionState } from '@/components/companion';
import type { ConditionsState } from '@/components/conditions';
import type { CoreScoresState } from '@/components/core-scores';
import type { Countdown } from '@/components/countdown-tracker';
import type { DowntimeActivity } from '@/components/downtime-moves';
import type { EquipmentState } from '@/components/equipment';
import type { ExperiencesState } from '@/components/experiences';
import type { InventoryState } from '@/components/inventory';
import type { ResourcesState } from '@/components/resources';
import type { SessionEntry } from '@/components/session-tracker';
import type { ProgressionState } from '@/components/shared/progression-display';
import type { TraitsState } from '@/components/traits';
import type { CharacterRecord } from '@/lib/api/characters';
import type {
  Gold,
  IdentityFormValues,
  ThresholdsSettings,
} from '@/lib/schemas/character-state';
import type { ClassSelection } from '@/lib/schemas/class-selection';
import type { CommunitySelection } from '@/lib/schemas/identity';
import type { LoadoutSelection } from '@/lib/schemas/loadout';
import type { Scar } from '@/lib/schemas/session-state';

/**
 * Maps identity state to API format
 */
export function mapIdentityToApi(
  v: IdentityFormValues,
  serverIdentity?: CharacterRecord['identity']
): Partial<CharacterRecord> {
  return {
    identity: {
      ...serverIdentity,
      name: v.name,
      pronouns: v.pronouns,
      calling: v.calling,
      description: v.description,
      background: v.background || '',
      descriptionDetails: v.descriptionDetails,
      connections: v.connections,
    } as CharacterRecord['identity'],
  };
}

/**
 * Gets the ancestry name from the selection
 */
function getAncestryName(v: AncestrySelection): string {
  if (!v) return '';
  if (v.mode === 'standard') return v.ancestry?.name || '';
  if (v.mode === 'mixed') return v.mixedAncestry?.name || '';
  return v.homebrew?.name || '';
}

/**
 * Builds the mixed ancestry details for API format
 */
function buildMixedDetails(v: AncestrySelection) {
  if (!v || v.mode !== 'mixed' || !v.mixedAncestry) return undefined;
  return {
    name: v.mixedAncestry.name,
    primaryFrom: v.mixedAncestry.parentAncestries?.[0] || '',
    secondaryFrom: v.mixedAncestry.parentAncestries?.[1] || '',
  };
}

/**
 * Builds the homebrew ancestry details for API format
 */
function buildHomebrewDetails(v: AncestrySelection) {
  if (!v || v.mode !== 'homebrew' || !v.homebrew) return undefined;
  return {
    name: v.homebrew.name,
    description: v.homebrew.description || '',
    heightRange: v.homebrew.heightRange,
    lifespan: v.homebrew.lifespan,
    physicalCharacteristics: v.homebrew.physicalCharacteristics,
    primaryFeature: v.homebrew.primaryFeature,
    secondaryFeature: v.homebrew.secondaryFeature,
  };
}

/**
 * Maps ancestry state to API format
 */
export function mapAncestryToApi(
  v: AncestrySelection | null,
  serverIdentity?: CharacterRecord['identity']
): Partial<CharacterRecord> {
  if (!v) {
    return {
      identity: {
        ...serverIdentity,
        ancestry: '',
        ancestryDetails: { type: 'standard' as const },
      } as CharacterRecord['identity'],
    };
  }
  return {
    identity: {
      ...serverIdentity,
      ancestry: getAncestryName(v),
      ancestryDetails: {
        type: v.mode,
        mixed: buildMixedDetails(v),
        homebrew: buildHomebrewDetails(v),
      },
    } as CharacterRecord['identity'],
  };
}

/**
 * Maps community state to API format
 */
export function mapCommunityToApi(
  v: CommunitySelection | null,
  serverIdentity?: CharacterRecord['identity']
): Partial<CharacterRecord> {
  if (!v) {
    return {
      identity: {
        ...serverIdentity,
        community: '',
        communityDetails: { type: 'standard' as const },
      } as CharacterRecord['identity'],
    };
  }
  const communityName =
    v.mode === 'standard' ? v.community?.name || '' : v.homebrew?.name || '';
  return {
    identity: {
      ...serverIdentity,
      community: communityName,
      communityDetails: {
        type: v.mode,
        homebrew:
          v.mode === 'homebrew' && v.homebrew
            ? {
                name: v.homebrew.name,
                description: v.homebrew.description || '',
                commonTraits: v.homebrew.commonTraits || [],
                feature: v.homebrew.feature,
              }
            : undefined,
      },
    } as CharacterRecord['identity'],
  };
}

/**
 * Maps class selection to API format
 */
export function mapClassSelectionToApi(
  v: ClassSelection | null
): Partial<CharacterRecord> {
  return {
    classDraft: v
      ? {
          mode: v.mode || 'standard',
          className: v.className,
          subclassName: v.subclassName || '',
          homebrewClass: v.homebrewClass,
        }
      : { mode: 'standard' as const },
  };
}

/**
 * Maps traits to API format
 */
export function mapTraitsToApi(v: TraitsState): Partial<CharacterRecord> {
  return {
    traits: v as unknown as Record<
      string,
      { value: number; bonus: number; marked: boolean }
    >,
  };
}

/**
 * Maps equipment to API format
 */
export function mapEquipmentToApi(v: EquipmentState): Partial<CharacterRecord> {
  return {
    equipment: {
      primaryWeapon: v.primaryWeapon,
      primaryWeaponMode: v.primaryWeaponMode,
      homebrewPrimaryWeapon: v.homebrewPrimaryWeapon,
      secondaryWeapon: v.secondaryWeapon,
      secondaryWeaponMode: v.secondaryWeaponMode,
      homebrewSecondaryWeapon: v.homebrewSecondaryWeapon,
      armor: v.armor,
      armorMode: v.armorMode,
      homebrewArmor: v.homebrewArmor,
      useCombatWheelchair: v.useCombatWheelchair,
      combatWheelchair: v.combatWheelchair,
      wheelchairMode: v.wheelchairMode,
      homebrewWheelchair: v.homebrewWheelchair,
      customSlots: v.customSlots,
      items: [],
      consumables: {},
    },
  };
}

/**
 * Maps inventory to API format
 */
export function mapInventoryToApi(v: InventoryState): Partial<CharacterRecord> {
  return {
    inventory: {
      slots: (v.items || []).map(entry => ({
        id: entry.id,
        name: entry.item?.name || '',
        description: entry.item?.description || '',
        quantity: entry.quantity ?? 1,
        location: entry.location || 'backpack',
        isEquipped: entry.isEquipped ?? false,
        item: entry.item,
      })),
      maxItems: v.maxSlots ?? 50,
      currentWeight: 0,
      unlimitedSlots: v.unlimitedSlots ?? false,
      unlimitedQuantity: v.unlimitedQuantity ?? false,
      metadata: {},
    },
  };
}

/**
 * Maps loadout to API format
 */
export function mapLoadoutToApi(
  v: LoadoutSelection,
  serverDomains?: CharacterRecord['domains']
): Partial<CharacterRecord> {
  return {
    domains: {
      ...serverDomains,
      loadout: v.activeCards || [],
      vault: v.vaultCards || [],
      creationComplete: true,
    },
  };
}

/**
 * Maps progression to API format
 */
export function mapProgressionToApi(
  v: ProgressionState
): Partial<CharacterRecord> {
  return {
    progression: {
      currentLevel: v.currentLevel,
      currentTier: v.currentTier,
      availablePoints: 0,
      spentOptions: {},
    },
  };
}

/**
 * Maps gold to API format
 */
export function mapGoldToApi(
  v: Gold,
  serverResources?: CharacterRecord['resources']
): Partial<CharacterRecord> {
  return {
    resources: {
      ...serverResources,
      gold: v,
    } as CharacterRecord['resources'],
  };
}

/**
 * Maps thresholds to API format
 */
export function mapThresholdsToApi(
  v: ThresholdsSettings
): Partial<CharacterRecord> {
  return { thresholds: v };
}

/**
 * Maps conditions to API format
 */
export function mapConditionsToApi(
  v: ConditionsState
): Partial<CharacterRecord> {
  return { conditions: v.items.map(name => ({ name })) };
}

/**
 * Maps experiences to API format
 * Preserves the { items: [...] } structure with id, name, value
 */
export function mapExperiencesToApi(
  v: ExperiencesState
): Partial<CharacterRecord> {
  return {
    experiences: {
      items: v.items.map(e => ({ id: e.id, name: e.name, value: e.value })),
    },
  };
}

/**
 * Maps resources to API format
 */
export function mapResourcesToApi(
  v: ResourcesState,
  currentGold: Gold
): Partial<CharacterRecord> {
  return {
    resources: {
      hp: v.hp,
      stress: v.stress,
      hope: v.hope,
      armorScore: v.armorScore,
      gold: currentGold,
      autoCalculateHp: v.autoCalculateHp,
      autoCalculateEvasion: v.autoCalculateEvasion,
      autoCalculateArmorScore: v.autoCalculateArmorScore,
      autoCalculateThresholds: v.autoCalculateThresholds,
    } as CharacterRecord['resources'],
  };
}

/**
 * Maps core scores to API format
 */
export function mapCoreScoresToApi(
  v: CoreScoresState
): Partial<CharacterRecord> {
  return {
    coreScores: {
      evasion: v.evasion,
      proficiency: v.proficiency,
      autoCalculateEvasion: v.autoCalculateEvasion,
    },
  };
}

/**
 * Maps companion to API format
 */
export function mapCompanionToApi(
  v: CompanionState | null | undefined
): Partial<CharacterRecord> {
  return { companion: v ?? null };
}

/**
 * Maps companion enabled to API format
 */
export function mapCompanionEnabledToApi(v: boolean): Partial<CharacterRecord> {
  return { companionEnabled: v };
}

/**
 * Maps countdowns to API format
 */
export function mapCountdownsToApi(v: Countdown[]): Partial<CharacterRecord> {
  return { countdowns: v };
}

/**
 * Maps notes to API format
 */
export function mapNotesToApi(v: CharacterNote[]): Partial<CharacterRecord> {
  return { notes: v };
}

/**
 * Maps downtime activities to API format
 */
export function mapDowntimeActivitiesToApi(
  v: DowntimeActivity[]
): Partial<CharacterRecord> {
  return { downtimeActivities: v };
}

/**
 * Maps hope with scars to API format
 */
export function mapHopeWithScarsToApi(
  hope: { current: number; max: number },
  scars: Scar[],
  extraSlots: number,
  companionHopeFilled: boolean,
  serverResources?: CharacterRecord['resources']
): Partial<CharacterRecord> {
  return {
    resources: {
      ...serverResources,
      hope: { current: hope.current, max: hope.max },
    } as CharacterRecord['resources'],
    scars,
    extraHopeSlots: extraSlots,
    companionHopeFilled,
  };
}

/**
 * Maps sessions to API format
 */
export function mapSessionsToApi(
  sessions: SessionEntry[],
  currentSessionId: string | null
): Partial<CharacterRecord> {
  return { sessions, currentSessionId };
}
