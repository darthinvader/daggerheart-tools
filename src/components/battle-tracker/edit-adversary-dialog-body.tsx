import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

import { AdversaryFeaturesEditor } from './edit-adversary-dialog-features';
import {
  AdversaryAttackEditor,
  AdversaryDifficultyEditor,
  AdversaryInfoSection,
  AdversaryNotesEditor,
  AdversaryStatsSection,
  AdversaryThresholdsEditor,
} from './edit-adversary-dialog-sections';
import type {
  AdversaryEditorActions,
  AdversaryEditorState,
} from './edit-adversary-dialog-state';
import type { AdversaryTracker } from './types';

interface AdversaryDialogBodyProps {
  adversary: AdversaryTracker;
  baseThresholds: AdversaryTracker['source']['thresholds'] | null;
  state: AdversaryEditorState;
  actions: AdversaryEditorActions;
  attackModified: boolean;
  thresholdsModified: boolean;
  onAttackReset: () => void;
  onThresholdReset: () => void;
}

export function AdversaryDialogBody({
  adversary,
  baseThresholds,
  state,
  actions,
  attackModified,
  thresholdsModified,
  onAttackReset,
  onThresholdReset,
}: AdversaryDialogBodyProps) {
  return (
    <ScrollArea className="max-h-[60vh]">
      <div className="space-y-6 pr-4">
        <AdversaryInfoSection adversary={adversary} />

        <Separator />

        <AdversaryStatsSection
          hp={state.hp}
          hpMax={state.hpMax}
          stress={state.stress}
          stressMax={state.stressMax}
          onHpChange={actions.setHp}
          onHpMaxChange={actions.setHpMax}
          onStressChange={actions.setStress}
          onStressMaxChange={actions.setStressMax}
        />

        <Separator />

        <AdversaryDifficultyEditor
          difficulty={state.difficulty}
          baseDifficulty={adversary.source.difficulty}
          onDifficultyChange={actions.setDifficulty}
        />

        <Separator />

        <AdversaryAttackEditor
          attackName={state.attackName}
          attackModifier={state.attackModifier}
          attackRange={state.attackRange}
          attackDamage={state.attackDamage}
          isModified={attackModified}
          onNameChange={actions.setAttackName}
          onModifierChange={actions.setAttackModifier}
          onRangeChange={actions.setAttackRange}
          onDamageChange={actions.setAttackDamage}
          onReset={onAttackReset}
        />

        <Separator />

        <AdversaryThresholdsEditor
          description={adversary.source.thresholds}
          isEditable={baseThresholds !== null}
          isModified={thresholdsModified}
          thresholdMajor={state.thresholdMajor}
          thresholdSevere={state.thresholdSevere}
          thresholdMassive={state.thresholdMassive}
          onMajorChange={actions.setThresholdMajor}
          onSevereChange={actions.setThresholdSevere}
          onMassiveChange={actions.setThresholdMassive}
          onReset={onThresholdReset}
        />

        <Separator />

        <AdversaryFeaturesEditor
          features={state.features}
          sourceFeatureCount={adversary.source.features.length}
          newFeatureName={state.newFeatureName}
          newFeatureType={state.newFeatureType}
          newFeatureDesc={state.newFeatureDesc}
          onNewFeatureNameChange={actions.setNewFeatureName}
          onNewFeatureTypeChange={actions.setNewFeatureType}
          onNewFeatureDescChange={actions.setNewFeatureDesc}
          onAddFeature={actions.addFeature}
          onRemoveFeature={actions.removeFeature}
          onResetAll={actions.resetToOriginal}
        />

        <Separator />

        <AdversaryNotesEditor
          notes={state.notes}
          onNotesChange={actions.setNotes}
        />
      </div>
    </ScrollArea>
  );
}
