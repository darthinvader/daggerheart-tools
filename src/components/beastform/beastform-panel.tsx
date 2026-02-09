/**
 * BeastformPanel
 *
 * Panel for activating/changing beastform. Shows available forms based on tier,
 * allows selecting a form, choosing activation method (Stress or Evolution),
 * and if Evolution, picking the bonus trait.
 * When already active, provides Change and Drop controls.
 *
 * Special forms (Evolved / Hybrid) trigger additional configuration steps:
 *  - Evolved (Legendary Beast, Mythic Beast): pick a base form to evolve
 *  - Hybrid (Legendary Hybrid, Mythic Hybrid): pick base forms, then
 *    select advantages and features from those forms
 */

import {
  Check,
  ChevronLeft,
  ChevronRight,
  PawPrint,
  Pencil,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { SpecialFormConfig } from '@/hooks/use-beastform';
import {
  CHARACTER_TRAITS,
  type CharacterTrait,
} from '@/lib/character-stats-engine/types';
import type {
  BeastformDefinition,
  BeastformFeature,
} from '@/lib/data/beastforms';
import { getBeastformsForTier } from '@/lib/data/beastforms';

/* ── Special-form configuration tables ──────────────────────────── */

const EVOLVED_CONFIG: Record<
  string,
  {
    allowedTiers: number[];
    damageBonus: number;
    traitBonus: number;
    evasionBonus: number;
    dieSizeUp?: boolean;
  }
> = {
  'legendary-beast': {
    allowedTiers: [1],
    damageBonus: 6,
    traitBonus: 1,
    evasionBonus: 2,
  },
  'mythic-beast': {
    allowedTiers: [1, 2],
    damageBonus: 9,
    traitBonus: 2,
    evasionBonus: 3,
    dieSizeUp: true,
  },
};

const HYBRID_CONFIG: Record<
  string,
  {
    allowedTiers: number[];
    baseFormCount: number;
    advantageCount: number;
    featureCount: number;
    extraStress: number;
  }
> = {
  'legendary-hybrid': {
    allowedTiers: [1, 2],
    baseFormCount: 2,
    advantageCount: 4,
    featureCount: 2,
    extraStress: 1,
  },
  'mythic-hybrid': {
    allowedTiers: [1, 2, 3],
    baseFormCount: 3,
    advantageCount: 5,
    featureCount: 3,
    extraStress: 2,
  },
};

/** IDs of special forms — excluded from base-form pool for Hybrid/Evolved */
const SPECIAL_FORM_IDS = new Set([
  ...Object.keys(EVOLVED_CONFIG),
  ...Object.keys(HYBRID_CONFIG),
]);

function isEvolvedForm(id: string): boolean {
  return id in EVOLVED_CONFIG;
}

function isHybridForm(id: string): boolean {
  return id in HYBRID_CONFIG;
}

function isSpecialForm(id: string): boolean {
  return SPECIAL_FORM_IDS.has(id);
}

/** Get regular (non-special) forms available for the given tiers */
function getRegularFormsForTiers(tiers: number[]): BeastformDefinition[] {
  const maxTier = Math.max(...tiers);
  return getBeastformsForTier(maxTier).filter(
    (f: BeastformDefinition) => !isSpecialForm(f.id)
  );
}

/* ── Panel step flow ────────────────────────────────────────────── */

type PanelStep =
  | 'select-form'
  | 'evolved-base'
  | 'hybrid-bases'
  | 'hybrid-advantages'
  | 'hybrid-features'
  | 'evolution-trait';

/* ── Dialog header helpers ──────────────────────────────────────── */

const STEP_TITLES: Record<Exclude<PanelStep, 'select-form'>, string> = {
  'evolved-base': 'Choose Base Form to Evolve',
  'hybrid-bases': 'Choose Base Forms',
  'hybrid-advantages': 'Choose Advantages',
  'hybrid-features': 'Choose Features',
  'evolution-trait': 'Choose Evolution Trait',
};

function getDialogTitle(step: PanelStep, isActive: boolean): string {
  if (step === 'select-form') {
    return isActive ? 'Change Beastform' : 'Transform into Beastform';
  }
  return STEP_TITLES[step];
}

const STEP_DESCRIPTIONS: Record<string, string> = {
  'select-form':
    'Choose a creature form of your tier or lower. Mark a Stress to transform, or spend 3 Hope via Evolution.',
  'evolved-base':
    'Select a base form — you retain all its traits, features, and advantages with powerful bonuses on top.',
};

function getDialogDescription(
  step: PanelStep,
  selectedFormId: string | null,
  selectedFormName: string | undefined
): string {
  if (step === 'select-form' || step === 'evolved-base') {
    return STEP_DESCRIPTIONS[step];
  }

  const hybridCfg = selectedFormId ? HYBRID_CONFIG[selectedFormId] : undefined;

  if (step === 'hybrid-bases' && hybridCfg) {
    return `Pick ${hybridCfg.baseFormCount} forms to combine. You'll then choose advantages and features from them.`;
  }
  if (step === 'hybrid-advantages' && hybridCfg) {
    return `Choose ${hybridCfg.advantageCount} advantages from your selected base forms.`;
  }
  if (step === 'hybrid-features' && hybridCfg) {
    return `Choose ${hybridCfg.featureCount} features from your selected base forms.`;
  }
  if (step === 'evolution-trait' && selectedFormName) {
    return `Choose a trait to gain +1 while in ${selectedFormName} form (Evolution bonus).`;
  }
  return '';
}

/* ── Configure step lookup ──────────────────────────────────────── */

const CONFIGURE_STEP_MAP: Record<string, PanelStep> = {};
for (const id of Object.keys(EVOLVED_CONFIG)) {
  CONFIGURE_STEP_MAP[id] = 'evolved-base';
}
for (const id of Object.keys(HYBRID_CONFIG)) {
  CONFIGURE_STEP_MAP[id] = 'hybrid-bases';
}

/* ── Evolution-trait back-step lookup ────────────────────────────── */

function getEvolutionBackStep(formId: string | null): PanelStep {
  if (formId && isEvolvedForm(formId)) return 'evolved-base';
  if (formId && isHybridForm(formId)) return 'hybrid-features';
  return 'select-form';
}

/* ── Toggle helper (add/remove with max) ────────────────────────── */

function toggleInList<T>(
  list: T[],
  item: T,
  max: number,
  eq: (a: T, b: T) => boolean = (a, b) => a === b
): T[] {
  const idx = list.findIndex(x => eq(x, item));
  if (idx >= 0) return list.filter((_, i) => i !== idx);
  if (list.length < max) return [...list, item];
  return list;
}

/* ── Trigger buttons ────────────────────────────────────────────── */

function BeastformTriggerButtons({
  isActive,
  readOnly,
  availableFormsCount,
  onOpen,
  onDeactivate,
}: {
  isActive: boolean;
  readOnly?: boolean;
  availableFormsCount: number;
  onOpen: () => void;
  onDeactivate: () => void;
}) {
  if (isActive) {
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpen}
          className="border-emerald-500/50 text-emerald-600 dark:text-emerald-300"
        >
          <Pencil className="mr-1 size-3" />
          Change
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDeactivate}
          disabled={readOnly}
          className="border-emerald-500/50 text-emerald-600 dark:text-emerald-300"
        >
          <X className="mr-1 size-3" />
          Drop
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={readOnly || availableFormsCount === 0}
      onClick={onOpen}
      className="border-emerald-500/50 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950/50"
    >
      <PawPrint className="mr-1 size-4" />
      Activate
    </Button>
  );
}

/* ── Step content renderer ──────────────────────────────────────── */

function BeastformStepContent({
  step,
  selectedFormId,
  selectedForm,
  formsByTier,
  evolvedBaseFormId,
  hybridBaseFormIds,
  selectedAdvantages,
  selectedFeatures,
  onSelectForm,
  onConfigure,
  onActivateStress,
  onActivateEvolution,
  onSelectEvolvedBase,
  onToggleHybridBase,
  onToggleAdvantage,
  onToggleFeature,
  onSetStep,
}: {
  step: PanelStep;
  selectedFormId: string | null;
  selectedForm: BeastformDefinition | undefined;
  formsByTier: Record<number, BeastformDefinition[]>;
  evolvedBaseFormId: string | null;
  hybridBaseFormIds: string[];
  selectedAdvantages: string[];
  selectedFeatures: BeastformFeature[];
  onSelectForm: (id: string) => void;
  onConfigure: () => void;
  onActivateStress: () => void;
  onActivateEvolution: (trait: CharacterTrait) => void;
  onSelectEvolvedBase: (id: string) => void;
  onToggleHybridBase: (id: string) => void;
  onToggleAdvantage: (item: string) => void;
  onToggleFeature: (feature: BeastformFeature) => void;
  onSetStep: (step: PanelStep) => void;
}) {
  const hybridCfg = selectedFormId ? HYBRID_CONFIG[selectedFormId] : undefined;

  switch (step) {
    case 'select-form':
      return (
        <SelectFormStep
          formsByTier={formsByTier}
          selectedFormId={selectedFormId}
          onSelectForm={onSelectForm}
          onConfigure={onConfigure}
          onActivateStress={onActivateStress}
          onActivateEvolution={() => onSetStep('evolution-trait')}
        />
      );

    case 'evolved-base':
      if (!selectedFormId) return null;
      return (
        <EvolvedBaseStep
          formId={selectedFormId}
          evolvedBaseFormId={evolvedBaseFormId}
          onSelectBase={onSelectEvolvedBase}
          onBack={() => onSetStep('select-form')}
          onActivateStress={onActivateStress}
          onActivateEvolution={() => onSetStep('evolution-trait')}
        />
      );

    case 'hybrid-bases':
      if (!hybridCfg) return null;
      return (
        <HybridBasesStep
          config={hybridCfg}
          hybridBaseFormIds={hybridBaseFormIds}
          onToggleBase={onToggleHybridBase}
          onBack={() => onSetStep('select-form')}
          onNext={() => onSetStep('hybrid-advantages')}
        />
      );

    case 'hybrid-advantages':
      if (!hybridCfg) return null;
      return (
        <HybridPickerStep
          label="Advantages"
          config={hybridCfg}
          hybridBaseFormIds={hybridBaseFormIds}
          selectedItems={selectedAdvantages}
          maxItems={hybridCfg.advantageCount}
          getItems={forms => [...new Set(forms.flatMap(f => f.advantages))]}
          onToggle={onToggleAdvantage}
          onBack={() => onSetStep('hybrid-bases')}
          onNext={() => onSetStep('hybrid-features')}
        />
      );

    case 'hybrid-features':
      if (!hybridCfg) return null;
      return (
        <HybridFeaturesStep
          config={hybridCfg}
          hybridBaseFormIds={hybridBaseFormIds}
          selectedFeatures={selectedFeatures}
          maxFeatures={hybridCfg.featureCount}
          onToggle={onToggleFeature}
          onBack={() => onSetStep('hybrid-advantages')}
          onActivateStress={onActivateStress}
          onActivateEvolution={() => onSetStep('evolution-trait')}
        />
      );

    case 'evolution-trait':
      if (!selectedForm) return null;
      return (
        <EvolutionTraitStep
          formName={selectedForm.name}
          onSelectTrait={onActivateEvolution}
          onBack={() => onSetStep(getEvolutionBackStep(selectedFormId))}
        />
      );
  }
}

/* ── Component ──────────────────────────────────────────────────── */

interface BeastformPanelProps {
  availableForms: BeastformDefinition[];
  isActive: boolean;
  onActivateWithStress: (formId: string, config?: SpecialFormConfig) => void;
  onActivateWithEvolution: (
    formId: string,
    bonusTrait: CharacterTrait,
    config?: SpecialFormConfig
  ) => void;
  onDeactivate: () => void;
  readOnly?: boolean;
}

/* ── Panel state hook ───────────────────────────────────────────── */

function useBeastformPanelState(
  availableForms: BeastformDefinition[],
  onActivateWithStress: BeastformPanelProps['onActivateWithStress'],
  onActivateWithEvolution: BeastformPanelProps['onActivateWithEvolution']
) {
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [step, setStep] = useState<PanelStep>('select-form');
  const [isOpen, setIsOpen] = useState(false);
  const [evolvedBaseFormId, setEvolvedBaseFormId] = useState<string | null>(
    null
  );
  const [hybridBaseFormIds, setHybridBaseFormIds] = useState<string[]>([]);
  const [selectedAdvantages, setSelectedAdvantages] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<BeastformFeature[]>(
    []
  );

  const selectedForm = availableForms.find(f => f.id === selectedFormId);

  const formsByTier = availableForms.reduce<
    Record<number, BeastformDefinition[]>
  >((acc, form) => {
    (acc[form.tier] ??= []).push(form);
    return acc;
  }, {});

  function resetState() {
    setSelectedFormId(null);
    setStep('select-form');
    setEvolvedBaseFormId(null);
    setHybridBaseFormIds([]);
    setSelectedAdvantages([]);
    setSelectedFeatures([]);
  }

  function handleOpen() {
    setIsOpen(true);
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (!open) resetState();
  }

  function buildSpecialConfig(): SpecialFormConfig | undefined {
    if (selectedFormId && isEvolvedForm(selectedFormId) && evolvedBaseFormId) {
      return { evolvedBaseFormId };
    }
    if (selectedFormId && isHybridForm(selectedFormId)) {
      return { hybridBaseFormIds, selectedAdvantages, selectedFeatures };
    }
    return undefined;
  }

  function handleActivateStress() {
    if (!selectedFormId) return;
    onActivateWithStress(selectedFormId, buildSpecialConfig());
    setIsOpen(false);
    resetState();
  }

  function handleActivateEvolution(trait: CharacterTrait) {
    if (!selectedFormId) return;
    onActivateWithEvolution(selectedFormId, trait, buildSpecialConfig());
    setIsOpen(false);
    resetState();
  }

  function handleFormSelect(formId: string) {
    setSelectedFormId(formId);
    setEvolvedBaseFormId(null);
    setHybridBaseFormIds([]);
    setSelectedAdvantages([]);
    setSelectedFeatures([]);
  }

  function handleConfigure() {
    if (!selectedFormId) return;
    const nextStep = CONFIGURE_STEP_MAP[selectedFormId];
    if (nextStep) setStep(nextStep);
  }

  function handleSetStep(nextStep: PanelStep) {
    // Clear downstream state when navigating backward
    if (nextStep === 'select-form') {
      setHybridBaseFormIds([]);
    } else if (nextStep === 'hybrid-bases') {
      setSelectedAdvantages([]);
    } else if (nextStep === 'hybrid-advantages') {
      setSelectedAdvantages([]);
      setSelectedFeatures([]);
    } else if (nextStep === 'hybrid-features') {
      setSelectedFeatures([]);
    }
    setStep(nextStep);
  }

  function handleToggleHybridBase(id: string) {
    const max = selectedFormId
      ? (HYBRID_CONFIG[selectedFormId]?.baseFormCount ?? 0)
      : 0;
    setHybridBaseFormIds(prev => toggleInList(prev, id, max));
  }

  function handleToggleAdvantage(item: string) {
    const max = selectedFormId
      ? (HYBRID_CONFIG[selectedFormId]?.advantageCount ?? 0)
      : 0;
    setSelectedAdvantages(prev => toggleInList(prev, item, max));
  }

  function handleToggleFeature(feature: BeastformFeature) {
    const max = selectedFormId
      ? (HYBRID_CONFIG[selectedFormId]?.featureCount ?? 0)
      : 0;
    setSelectedFeatures(prev =>
      toggleInList(prev, feature, max, (a, b) => a.name === b.name)
    );
  }

  return {
    selectedFormId,
    step,
    isOpen,
    selectedForm,
    formsByTier,
    evolvedBaseFormId,
    hybridBaseFormIds,
    selectedAdvantages,
    selectedFeatures,
    handleOpen,
    handleOpenChange,
    handleFormSelect,
    handleConfigure,
    handleSetStep,
    handleActivateStress,
    handleActivateEvolution,
    handleToggleHybridBase,
    handleToggleAdvantage,
    handleToggleFeature,
    setEvolvedBaseFormId,
  };
}

export function BeastformPanel({
  availableForms,
  isActive,
  onActivateWithStress,
  onActivateWithEvolution,
  onDeactivate,
  readOnly,
}: BeastformPanelProps) {
  const {
    selectedFormId,
    step,
    isOpen,
    selectedForm,
    formsByTier,
    evolvedBaseFormId,
    hybridBaseFormIds,
    selectedAdvantages,
    selectedFeatures,
    handleOpen,
    handleOpenChange,
    handleFormSelect,
    handleConfigure,
    handleSetStep,
    handleActivateStress,
    handleActivateEvolution,
    handleToggleHybridBase,
    handleToggleAdvantage,
    handleToggleFeature,
    setEvolvedBaseFormId,
  } = useBeastformPanelState(
    availableForms,
    onActivateWithStress,
    onActivateWithEvolution
  );

  return (
    <>
      <BeastformTriggerButtons
        isActive={isActive}
        readOnly={readOnly}
        availableFormsCount={availableForms.length}
        onOpen={handleOpen}
        onDeactivate={onDeactivate}
      />

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="flex max-h-[85vh] max-w-lg flex-col gap-0 overflow-hidden p-0">
          <DialogHeader className="shrink-0 px-6 pt-6 pb-2">
            <DialogTitle className="flex items-center gap-2">
              <PawPrint className="size-5 text-emerald-500 dark:text-emerald-400" />
              {getDialogTitle(step, isActive)}
            </DialogTitle>
            <DialogDescription>
              {getDialogDescription(step, selectedFormId, selectedForm?.name)}
            </DialogDescription>
          </DialogHeader>

          <BeastformStepContent
            step={step}
            selectedFormId={selectedFormId}
            selectedForm={selectedForm}
            formsByTier={formsByTier}
            evolvedBaseFormId={evolvedBaseFormId}
            hybridBaseFormIds={hybridBaseFormIds}
            selectedAdvantages={selectedAdvantages}
            selectedFeatures={selectedFeatures}
            onSelectForm={handleFormSelect}
            onConfigure={handleConfigure}
            onActivateStress={handleActivateStress}
            onActivateEvolution={handleActivateEvolution}
            onSelectEvolvedBase={setEvolvedBaseFormId}
            onToggleHybridBase={handleToggleHybridBase}
            onToggleAdvantage={handleToggleAdvantage}
            onToggleFeature={handleToggleFeature}
            onSetStep={handleSetStep}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ── Select Form Step ───────────────────────────────────────────── */

function SelectFormStep({
  formsByTier,
  selectedFormId,
  onSelectForm,
  onConfigure,
  onActivateStress,
  onActivateEvolution,
}: {
  formsByTier: Record<number, BeastformDefinition[]>;
  selectedFormId: string | null;
  onSelectForm: (id: string) => void;
  onConfigure: () => void;
  onActivateStress: () => void;
  onActivateEvolution: () => void;
}) {
  const selectedForm =
    selectedFormId &&
    Object.values(formsByTier)
      .flat()
      .find(f => f.id === selectedFormId);

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-3">
        {Object.entries(formsByTier)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([tier, forms]) => (
            <div key={tier} className="mb-4 last:mb-0">
              <h4 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                Tier {tier}
              </h4>
              <div
                className="space-y-2"
                role="listbox"
                aria-label={`Tier ${tier} beastforms`}
              >
                {forms.map(form => (
                  <BeastformCard
                    key={form.id}
                    form={form}
                    isSelected={selectedFormId === form.id}
                    onSelect={() => onSelectForm(form.id)}
                    isSpecial={isSpecialForm(form.id)}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>

      {selectedForm && (
        <div className="flex shrink-0 gap-2 border-t px-6 py-3">
          {isSpecialForm(selectedForm.id) ? (
            <Button
              variant="default"
              size="sm"
              onClick={onConfigure}
              className="flex-1 bg-emerald-700 hover:bg-emerald-600"
            >
              Configure {selectedForm.name}
              <ChevronRight className="ml-1 size-4" />
            </Button>
          ) : (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={onActivateStress}
                className="flex-1 bg-emerald-700 hover:bg-emerald-600"
              >
                <Zap className="mr-1 size-4" />
                Mark Stress
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onActivateEvolution}
                className="flex-1 border-amber-500/50 text-amber-600 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950/50"
              >
                <Sparkles className="mr-1 size-4" />
                Evolution (3 Hope)
              </Button>
            </>
          )}
        </div>
      )}
    </>
  );
}

/* ── Evolution Trait Step ───────────────────────────────────────── */

function EvolutionTraitStep({
  formName,
  onSelectTrait,
  onBack,
}: {
  formName: string;
  onSelectTrait: (trait: CharacterTrait) => void;
  onBack: () => void;
}) {
  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-3">
        <p className="text-muted-foreground mb-3 text-sm">
          Choose a trait to gain +1 while in <strong>{formName}</strong> form
          (Evolution bonus):
        </p>
        <div className="grid grid-cols-2 gap-2">
          {CHARACTER_TRAITS.map(trait => (
            <Button
              key={trait}
              variant="outline"
              size="sm"
              onClick={() => onSelectTrait(trait)}
              className="justify-start"
            >
              <Sparkles className="mr-1.5 size-3.5 text-amber-500 dark:text-amber-400" />
              +1 {trait}
            </Button>
          ))}
        </div>
      </div>
      <div className="shrink-0 border-t px-6 py-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="w-full">
          <ChevronLeft className="mr-1 size-4" />
          Back
        </Button>
      </div>
    </>
  );
}

/* ── Evolved Base Step ──────────────────────────────────────────── */

function EvolvedBaseStep({
  formId,
  evolvedBaseFormId,
  onSelectBase,
  onBack,
  onActivateStress,
  onActivateEvolution,
}: {
  formId: string;
  evolvedBaseFormId: string | null;
  onSelectBase: (id: string) => void;
  onBack: () => void;
  onActivateStress: () => void;
  onActivateEvolution: () => void;
}) {
  const cfg = EVOLVED_CONFIG[formId];
  const baseForms = useMemo(
    () => getRegularFormsForTiers(cfg.allowedTiers),
    [cfg.allowedTiers]
  );
  const baseForm = baseForms.find(f => f.id === evolvedBaseFormId);

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-3">
        <div className="mb-3 rounded-md border border-amber-500/30 bg-amber-950/20 px-3 py-2 text-xs text-amber-200">
          <strong>Evolution bonuses:</strong> +{cfg.damageBonus} damage, +
          {cfg.traitBonus} trait bonus, +{cfg.evasionBonus} Evasion
          {cfg.dieSizeUp && ', damage die size +1'}
        </div>
        <div className="space-y-2" role="listbox" aria-label="Base forms">
          {baseForms.map(f => (
            <BeastformCard
              key={f.id}
              form={f}
              isSelected={evolvedBaseFormId === f.id}
              onSelect={() => onSelectBase(f.id)}
            />
          ))}
        </div>
      </div>
      <div className="flex shrink-0 gap-2 border-t px-6 py-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="mr-1 size-4" />
          Back
        </Button>
        {baseForm && (
          <>
            <Button
              variant="default"
              size="sm"
              onClick={onActivateStress}
              className="flex-1 bg-emerald-700 hover:bg-emerald-600"
            >
              <Zap className="mr-1 size-4" />
              Mark Stress
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onActivateEvolution}
              className="flex-1 border-amber-500/50 text-amber-600 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950/50"
            >
              <Sparkles className="mr-1 size-4" />
              Evolution
            </Button>
          </>
        )}
      </div>
    </>
  );
}

/* ── Hybrid Bases Step ──────────────────────────────────────────── */

function HybridBasesStep({
  config,
  hybridBaseFormIds,
  onToggleBase,
  onBack,
  onNext,
}: {
  config: (typeof HYBRID_CONFIG)[string];
  hybridBaseFormIds: string[];
  onToggleBase: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const baseForms = useMemo(
    () => getRegularFormsForTiers(config.allowedTiers),
    [config.allowedTiers]
  );

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-3">
        <div className="text-muted-foreground mb-3 text-xs">
          Select {config.baseFormCount} base forms ({hybridBaseFormIds.length}/
          {config.baseFormCount} chosen). Extra Stress cost: +
          {config.extraStress}
        </div>
        <div className="space-y-2" role="listbox" aria-label="Base forms">
          {baseForms.map(f => {
            const checked = hybridBaseFormIds.includes(f.id);
            return (
              <BeastformCard
                key={f.id}
                form={f}
                isSelected={checked}
                onSelect={() => onToggleBase(f.id)}
                showCheckmark={checked}
              />
            );
          })}
        </div>
      </div>
      <div className="flex shrink-0 gap-2 border-t px-6 py-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="mr-1 size-4" />
          Back
        </Button>
        <Button
          variant="default"
          size="sm"
          disabled={hybridBaseFormIds.length !== config.baseFormCount}
          onClick={onNext}
          className="flex-1 bg-emerald-700 hover:bg-emerald-600"
        >
          Next: Choose Advantages
          <ChevronRight className="ml-1 size-4" />
        </Button>
      </div>
    </>
  );
}

/* ── Hybrid Advantages Picker ───────────────────────────────────── */

function HybridPickerStep({
  label,
  config,
  hybridBaseFormIds,
  selectedItems,
  maxItems,
  getItems,
  onToggle,
  onBack,
  onNext,
}: {
  label: string;
  config: (typeof HYBRID_CONFIG)[string];
  hybridBaseFormIds: string[];
  selectedItems: string[];
  maxItems: number;
  getItems: (forms: BeastformDefinition[]) => string[];
  onToggle: (item: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const baseForms = useMemo(
    () =>
      getRegularFormsForTiers(config.allowedTiers).filter(f =>
        hybridBaseFormIds.includes(f.id)
      ),
    [config.allowedTiers, hybridBaseFormIds]
  );
  const items = useMemo(() => getItems(baseForms), [baseForms, getItems]);

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-3">
        <div className="text-muted-foreground mb-3 text-xs">
          {selectedItems.length}/{maxItems} {label.toLowerCase()} selected
        </div>
        <div className="flex flex-wrap gap-2">
          {items.map(item => {
            const checked = selectedItems.includes(item);
            return (
              <Button
                key={item}
                variant={checked ? 'default' : 'outline'}
                size="sm"
                onClick={() => onToggle(item)}
                className={
                  checked
                    ? 'bg-emerald-700 hover:bg-emerald-600'
                    : 'border-emerald-600/40 text-emerald-300'
                }
              >
                {checked && <Check className="mr-1 size-3" />}
                {item}
              </Button>
            );
          })}
        </div>
      </div>
      <div className="flex shrink-0 gap-2 border-t px-6 py-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="mr-1 size-4" />
          Back
        </Button>
        <Button
          variant="default"
          size="sm"
          disabled={selectedItems.length !== maxItems}
          onClick={onNext}
          className="flex-1 bg-emerald-700 hover:bg-emerald-600"
        >
          Next: Choose Features
          <ChevronRight className="ml-1 size-4" />
        </Button>
      </div>
    </>
  );
}

/* ── Hybrid Features Picker ─────────────────────────────────────── */

function HybridFeaturesStep({
  config,
  hybridBaseFormIds,
  selectedFeatures,
  maxFeatures,
  onToggle,
  onBack,
  onActivateStress,
  onActivateEvolution,
}: {
  config: (typeof HYBRID_CONFIG)[string];
  hybridBaseFormIds: string[];
  selectedFeatures: BeastformFeature[];
  maxFeatures: number;
  onToggle: (feature: BeastformFeature) => void;
  onBack: () => void;
  onActivateStress: () => void;
  onActivateEvolution: () => void;
}) {
  const baseForms = useMemo(
    () =>
      getRegularFormsForTiers(config.allowedTiers).filter(f =>
        hybridBaseFormIds.includes(f.id)
      ),
    [config.allowedTiers, hybridBaseFormIds]
  );
  const allFeatures = useMemo(() => {
    const seen = new Set<string>();
    const result: BeastformFeature[] = [];
    for (const form of baseForms) {
      for (const feat of form.features) {
        if (!seen.has(feat.name)) {
          seen.add(feat.name);
          result.push(feat);
        }
      }
    }
    return result;
  }, [baseForms]);

  const isComplete = selectedFeatures.length === maxFeatures;

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-3">
        <div className="text-muted-foreground mb-3 text-xs">
          {selectedFeatures.length}/{maxFeatures} features selected
        </div>
        <div className="space-y-2">
          {allFeatures.map(feat => {
            const checked = selectedFeatures.some(f => f.name === feat.name);
            return (
              <Card
                key={feat.name}
                className={`cursor-pointer transition-colors ${
                  checked
                    ? 'border-emerald-500 bg-emerald-950/30'
                    : 'hover:border-emerald-500/30 hover:bg-emerald-950/10'
                }`}
                onClick={() => onToggle(feat)}
                role="option"
                aria-selected={checked}
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onToggle(feat);
                  }
                }}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    {checked && (
                      <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                    )}
                    <div className="text-xs">
                      <span className="font-medium text-emerald-400">
                        {feat.name}:
                      </span>{' '}
                      <span className="text-muted-foreground">
                        {feat.description}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      <div className="flex shrink-0 gap-2 border-t px-6 py-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="mr-1 size-4" />
          Back
        </Button>
        {isComplete && (
          <>
            <Button
              variant="default"
              size="sm"
              onClick={onActivateStress}
              className="flex-1 bg-emerald-700 hover:bg-emerald-600"
            >
              <Zap className="mr-1 size-4" />
              Mark Stress (+{config.extraStress})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onActivateEvolution}
              className="flex-1 border-amber-500/50 text-amber-600 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950/50"
            >
              <Sparkles className="mr-1 size-4" />
              Evolution
            </Button>
          </>
        )}
      </div>
    </>
  );
}

/* ── BeastformCard ──────────────────────────────────────────────── */

function BeastformCard({
  form,
  isSelected,
  onSelect,
  isSpecial,
  showCheckmark,
}: {
  form: BeastformDefinition;
  isSelected: boolean;
  onSelect: () => void;
  isSpecial?: boolean;
  showCheckmark?: boolean;
}) {
  return (
    <Card
      className={`cursor-pointer transition-colors ${
        isSelected
          ? 'border-emerald-500 bg-emerald-950/30'
          : 'hover:border-emerald-500/30 hover:bg-emerald-950/10'
      }`}
      onClick={onSelect}
      role="option"
      aria-selected={isSelected}
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <CardHeader className="p-3 pb-1">
        <CardTitle className="flex items-center gap-2 text-sm">
          {showCheckmark && (
            <Check className="size-4 shrink-0 text-emerald-400" />
          )}
          {form.name}
          {isSpecial && (
            <Badge
              variant="outline"
              className="border-amber-500/50 text-xs text-amber-300"
            >
              Special
            </Badge>
          )}
          {form.traitBonus.value > 0 && (
            <Badge variant="secondary" className="text-xs">
              +{form.traitBonus.value} {form.traitBonus.trait}
            </Badge>
          )}
          {form.evasionBonus > 0 && (
            <Badge variant="outline" className="text-xs">
              +{form.evasionBonus} Evasion
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-xs">
          {form.examples.join(', ')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 p-3 pt-0">
        {/* Attack info — only if non-placeholder */}
        {form.attack.damageDice !== 'd0' && (
          <div className="text-muted-foreground text-xs">
            <span className="font-medium">Attack:</span>{' '}
            {form.attack.damageDice} {form.attack.trait} ({form.attack.range})
          </div>
        )}

        {/* Advantages */}
        {form.advantages.length > 0 && (
          <div className="space-y-1">
            <span className="text-muted-foreground text-xs font-medium">
              Advantages:
            </span>
            <div className="flex flex-wrap gap-1">
              {form.advantages.map((adv: string) => (
                <Badge
                  key={adv}
                  variant="outline"
                  className="border-emerald-600/40 text-xs text-emerald-300"
                >
                  {adv}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Features with descriptions */}
        {form.features.length > 0 && (
          <div className="space-y-1">
            {form.features.map((f: { name: string; description: string }) => (
              <div key={f.name} className="text-xs">
                <span className="font-medium text-emerald-400">{f.name}:</span>{' '}
                <span
                  className="text-muted-foreground"
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {f.description}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
