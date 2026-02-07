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

export function BeastformPanel({
  availableForms,
  isActive,
  onActivateWithStress,
  onActivateWithEvolution,
  onDeactivate,
  readOnly,
}: BeastformPanelProps) {
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [step, setStep] = useState<PanelStep>('select-form');
  const [isOpen, setIsOpen] = useState(false);

  // Evolved state
  const [evolvedBaseFormId, setEvolvedBaseFormId] = useState<string | null>(
    null
  );

  // Hybrid state
  const [hybridBaseFormIds, setHybridBaseFormIds] = useState<string[]>([]);
  const [selectedAdvantages, setSelectedAdvantages] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<BeastformFeature[]>(
    []
  );

  const selectedForm = availableForms.find(f => f.id === selectedFormId);

  // Group forms by tier
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

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (!open) resetState();
  }

  function buildSpecialConfig(): SpecialFormConfig | undefined {
    if (selectedFormId && isEvolvedForm(selectedFormId) && evolvedBaseFormId) {
      return { evolvedBaseFormId };
    }
    if (selectedFormId && isHybridForm(selectedFormId)) {
      return {
        hybridBaseFormIds,
        selectedAdvantages,
        selectedFeatures,
      };
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
    // Reset special state when re-selecting
    setEvolvedBaseFormId(null);
    setHybridBaseFormIds([]);
    setSelectedAdvantages([]);
    setSelectedFeatures([]);
  }

  function handleConfigure() {
    if (!selectedFormId) return;
    if (isEvolvedForm(selectedFormId)) {
      setStep('evolved-base');
    } else if (isHybridForm(selectedFormId)) {
      setStep('hybrid-bases');
    }
  }

  return (
    <>
      {isActive ? (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(true)}
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
      ) : (
        <Button
          variant="outline"
          size="sm"
          disabled={readOnly || availableForms.length === 0}
          onClick={() => setIsOpen(true)}
          className="border-emerald-500/50 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950/50"
        >
          <PawPrint className="mr-1 size-4" />
          Activate
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="flex max-h-[85vh] max-w-lg flex-col gap-0 overflow-hidden p-0">
          <DialogHeader className="shrink-0 px-6 pt-6 pb-2">
            <DialogTitle className="flex items-center gap-2">
              <PawPrint className="size-5 text-emerald-500 dark:text-emerald-400" />
              {step === 'select-form' &&
                (isActive ? 'Change Beastform' : 'Transform into Beastform')}
              {step === 'evolved-base' && 'Choose Base Form to Evolve'}
              {step === 'hybrid-bases' && 'Choose Base Forms'}
              {step === 'hybrid-advantages' && 'Choose Advantages'}
              {step === 'hybrid-features' && 'Choose Features'}
              {step === 'evolution-trait' && 'Choose Evolution Trait'}
            </DialogTitle>
            <DialogDescription>
              {step === 'select-form' &&
                'Choose a creature form of your tier or lower. Mark a Stress to transform, or spend 3 Hope via Evolution.'}
              {step === 'evolved-base' &&
                `Select a base form — you retain all its traits, features, and advantages with powerful bonuses on top.`}
              {step === 'hybrid-bases' &&
                selectedFormId &&
                HYBRID_CONFIG[selectedFormId] &&
                `Pick ${HYBRID_CONFIG[selectedFormId].baseFormCount} forms to combine. You'll then choose advantages and features from them.`}
              {step === 'hybrid-advantages' &&
                selectedFormId &&
                HYBRID_CONFIG[selectedFormId] &&
                `Choose ${HYBRID_CONFIG[selectedFormId].advantageCount} advantages from your selected base forms.`}
              {step === 'hybrid-features' &&
                selectedFormId &&
                HYBRID_CONFIG[selectedFormId] &&
                `Choose ${HYBRID_CONFIG[selectedFormId].featureCount} features from your selected base forms.`}
              {step === 'evolution-trait' &&
                selectedForm &&
                `Choose a trait to gain +1 while in ${selectedForm.name} form (Evolution bonus).`}
            </DialogDescription>
          </DialogHeader>

          {/* ── Step: select-form ─────────────────────────────── */}
          {step === 'select-form' && (
            <SelectFormStep
              formsByTier={formsByTier}
              selectedFormId={selectedFormId}
              onSelectForm={handleFormSelect}
              onConfigure={handleConfigure}
              onActivateStress={handleActivateStress}
              onActivateEvolution={() => setStep('evolution-trait')}
            />
          )}

          {/* ── Step: evolved-base ────────────────────────────── */}
          {step === 'evolved-base' && selectedFormId && (
            <EvolvedBaseStep
              formId={selectedFormId}
              evolvedBaseFormId={evolvedBaseFormId}
              onSelectBase={setEvolvedBaseFormId}
              onBack={() => setStep('select-form')}
              onActivateStress={handleActivateStress}
              onActivateEvolution={() => setStep('evolution-trait')}
            />
          )}

          {/* ── Step: hybrid-bases ────────────────────────────── */}
          {step === 'hybrid-bases' &&
            selectedFormId &&
            HYBRID_CONFIG[selectedFormId] && (
              <HybridBasesStep
                config={HYBRID_CONFIG[selectedFormId]}
                hybridBaseFormIds={hybridBaseFormIds}
                onToggleBase={id => {
                  setHybridBaseFormIds(prev =>
                    prev.includes(id)
                      ? prev.filter(x => x !== id)
                      : prev.length <
                          HYBRID_CONFIG[selectedFormId].baseFormCount
                        ? [...prev, id]
                        : prev
                  );
                }}
                onBack={() => {
                  setStep('select-form');
                  setHybridBaseFormIds([]);
                }}
                onNext={() => {
                  setSelectedAdvantages([]);
                  setStep('hybrid-advantages');
                }}
              />
            )}

          {/* ── Step: hybrid-advantages ───────────────────────── */}
          {step === 'hybrid-advantages' &&
            selectedFormId &&
            HYBRID_CONFIG[selectedFormId] && (
              <HybridPickerStep
                label="Advantages"
                config={HYBRID_CONFIG[selectedFormId]}
                hybridBaseFormIds={hybridBaseFormIds}
                selectedItems={selectedAdvantages}
                maxItems={HYBRID_CONFIG[selectedFormId].advantageCount}
                getItems={forms => [
                  ...new Set(forms.flatMap(f => f.advantages)),
                ]}
                onToggle={item => {
                  setSelectedAdvantages(prev =>
                    prev.includes(item)
                      ? prev.filter(x => x !== item)
                      : prev.length <
                          HYBRID_CONFIG[selectedFormId].advantageCount
                        ? [...prev, item]
                        : prev
                  );
                }}
                onBack={() => {
                  setStep('hybrid-bases');
                  setSelectedAdvantages([]);
                }}
                onNext={() => {
                  setSelectedFeatures([]);
                  setStep('hybrid-features');
                }}
              />
            )}

          {/* ── Step: hybrid-features ─────────────────────────── */}
          {step === 'hybrid-features' &&
            selectedFormId &&
            HYBRID_CONFIG[selectedFormId] && (
              <HybridFeaturesStep
                config={HYBRID_CONFIG[selectedFormId]}
                hybridBaseFormIds={hybridBaseFormIds}
                selectedFeatures={selectedFeatures}
                maxFeatures={HYBRID_CONFIG[selectedFormId].featureCount}
                onToggle={feature => {
                  setSelectedFeatures(prev => {
                    const exists = prev.some(f => f.name === feature.name);
                    if (exists)
                      return prev.filter(f => f.name !== feature.name);
                    if (
                      prev.length < HYBRID_CONFIG[selectedFormId].featureCount
                    ) {
                      return [...prev, feature];
                    }
                    return prev;
                  });
                }}
                onBack={() => {
                  setStep('hybrid-advantages');
                  setSelectedFeatures([]);
                }}
                onActivateStress={handleActivateStress}
                onActivateEvolution={() => setStep('evolution-trait')}
              />
            )}

          {/* ── Step: evolution-trait ──────────────────────────── */}
          {step === 'evolution-trait' && selectedForm && (
            <EvolutionTraitStep
              formName={selectedForm.name}
              onSelectTrait={handleActivateEvolution}
              onBack={() => {
                if (selectedFormId && isEvolvedForm(selectedFormId)) {
                  setStep('evolved-base');
                } else if (selectedFormId && isHybridForm(selectedFormId)) {
                  setStep('hybrid-features');
                } else {
                  setStep('select-form');
                }
              }}
            />
          )}
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
