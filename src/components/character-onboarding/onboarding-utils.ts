import type { DemoState } from '@/components/demo/demo-types';
import type { TraitsState } from '@/components/traits';
import type {
  AncestrySelection,
  CommunitySelection,
} from '@/lib/schemas/identity';

export type OnboardingStepId =
  | 'class'
  | 'companion'
  | 'ancestry'
  | 'community'
  | 'traits'
  | 'identity'
  | 'experiences'
  | 'equipment'
  | 'domains';

export const ONBOARDING_STEP_ORDER: OnboardingStepId[] = [
  'class',
  'companion',
  'ancestry',
  'community',
  'traits',
  'identity',
  'experiences',
  'equipment',
  'domains',
];

function isAncestryComplete(selection: AncestrySelection): boolean {
  if (!selection) return false;
  if (selection.mode === 'standard') {
    return Boolean(selection.ancestry?.name);
  }
  if (selection.mode === 'mixed') {
    const mixed = selection.mixedAncestry;
    return Boolean(
      mixed?.name?.trim() &&
      (mixed.parentAncestries?.length ?? 0) >= 2 &&
      mixed.primaryFeature?.name &&
      mixed.secondaryFeature?.name
    );
  }
  if (selection.mode === 'homebrew') {
    const homebrew = selection.homebrew;
    return Boolean(
      homebrew?.name?.trim() &&
      homebrew.primaryFeature?.name?.trim() &&
      homebrew.secondaryFeature?.name?.trim()
    );
  }
  return false;
}

function isCommunityComplete(selection: CommunitySelection): boolean {
  if (!selection) return false;
  if (selection.mode === 'standard') {
    return Boolean(selection.community?.name);
  }
  if (selection.mode === 'homebrew') {
    const homebrew = selection.homebrew;
    return Boolean(homebrew?.name?.trim() && homebrew.feature?.name?.trim());
  }
  return false;
}

function hasValidTraitDistribution(traits: TraitsState): boolean {
  const values = Object.values(traits).map(trait => trait.value);
  const counts = {
    2: values.filter(v => v === 2).length,
    1: values.filter(v => v === 1).length,
    0: values.filter(v => v === 0).length,
    [-1]: values.filter(v => v === -1).length,
  };
  return (
    counts[2] === 1 && counts[1] === 2 && counts[0] === 2 && counts[-1] === 1
  );
}

function hasValidExperiences(state: DemoState): boolean {
  const items = state.experiences?.items ?? [];
  if (items.length !== 2) return false;
  return items.every(exp => exp.value === 2 && exp.name.trim().length > 0);
}

function hasValidEquipment(state: DemoState): boolean {
  const { equipment } = state;
  const hasPrimary = equipment.useCombatWheelchair
    ? Boolean(equipment.combatWheelchair)
    : Boolean(equipment.primaryWeapon);
  if (!hasPrimary) return false;
  if (!equipment.armor) return false;
  if (equipment.useCombatWheelchair) return true;
  const primaryBurden = equipment.primaryWeapon?.burden;
  if (primaryBurden === 'Two-Handed') return true;
  return Boolean(equipment.secondaryWeapon);
}

function hasValidLoadout(state: DemoState): boolean {
  const totalCards =
    (state.loadout?.activeCards?.length ?? 0) +
    (state.loadout?.vaultCards?.length ?? 0);
  return totalCards >= 2;
}

export function getOnboardingCompletion(
  state: DemoState
): Record<OnboardingStepId, boolean> {
  const isBeastbound =
    state.classSelection?.className?.toLowerCase().includes('ranger') &&
    state.classSelection?.subclassName?.toLowerCase().includes('beastbound');
  const hasCompanionDetails = Boolean(
    state.companion?.name?.trim() &&
    state.companion?.type?.trim() &&
    state.companion?.standardAttack?.trim() &&
    (state.companion?.experiences?.length ?? 0) === 2 &&
    state.companion?.experiences?.every(exp => exp.name.trim())
  );
  return {
    class: Boolean(
      state.classSelection?.className && state.classSelection?.subclassName
    ),
    companion: isBeastbound ? hasCompanionDetails : true,
    ancestry: isAncestryComplete(state.ancestry),
    community: isCommunityComplete(state.community),
    traits: hasValidTraitDistribution(state.traits),
    identity: true,
    experiences: hasValidExperiences(state),
    equipment: hasValidEquipment(state),
    domains: hasValidLoadout(state),
  };
}

export function isOnboardingComplete(state: DemoState): boolean {
  const completion = getOnboardingCompletion(state);
  return ONBOARDING_STEP_ORDER.every(step => completion[step]);
}

export function getFirstIncompleteStepId(
  state: DemoState
): OnboardingStepId | null {
  const completion = getOnboardingCompletion(state);
  return ONBOARDING_STEP_ORDER.find(step => !completion[step]) ?? null;
}
