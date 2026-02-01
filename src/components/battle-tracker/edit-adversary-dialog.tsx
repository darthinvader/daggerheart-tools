import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AdversaryDialogBody } from './edit-adversary-dialog-body';
import { useAdversaryEditorState } from './edit-adversary-dialog-state';
import {
  buildAttackOverride,
  buildThresholdsOverride,
  getSourceAttackState,
  getSourceThresholds,
  getSourceThresholdState,
  isAttackModified,
  isThresholdsModified,
} from './edit-adversary-dialog-utils';
import type { AdversaryTracker } from './types';

interface EditAdversaryDialogProps {
  adversary: AdversaryTracker | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: Partial<AdversaryTracker>) => void;
}

export function EditAdversaryDialog({
  adversary,
  isOpen,
  onOpenChange,
  onSave,
}: EditAdversaryDialogProps) {
  const { state, actions } = useAdversaryEditorState(adversary, isOpen);

  if (!adversary) return null;

  const baseThresholds = getSourceThresholds(adversary);
  const attackModified = isAttackModified(adversary.source.attack, {
    name: state.attackName,
    modifier: state.attackModifier,
    range: state.attackRange,
    damage: state.attackDamage,
  });
  const thresholdsModified = baseThresholds
    ? isThresholdsModified(baseThresholds, {
        major: state.thresholdMajor,
        severe: state.thresholdSevere,
        massive: state.thresholdMassive,
      })
    : false;

  const handleAttackReset = () => {
    const attackState = getSourceAttackState(adversary);
    actions.setAttackName(attackState.name);
    actions.setAttackModifier(attackState.modifier);
    actions.setAttackRange(attackState.range);
    actions.setAttackDamage(attackState.damage);
  };

  const handleThresholdReset = () => {
    const thresholdState = getSourceThresholdState(adversary);
    actions.setThresholdMajor(thresholdState.major);
    actions.setThresholdSevere(thresholdState.severe);
    actions.setThresholdMassive(thresholdState.massive);
  };

  const handleSave = () => {
    const attackOverride = buildAttackOverride(adversary.source.attack, {
      name: state.attackName,
      modifier: state.attackModifier,
      range: state.attackRange,
      damage: state.attackDamage,
    });
    const thresholdsOverride = buildThresholdsOverride(baseThresholds, {
      major: state.thresholdMajor,
      severe: state.thresholdSevere,
      massive: state.thresholdMassive,
    });
    onSave({
      hp: { current: state.hp, max: state.hpMax },
      stress: { current: state.stress, max: state.stressMax },
      difficultyOverride:
        state.difficulty !== adversary.source.difficulty
          ? state.difficulty
          : undefined,
      attackOverride,
      thresholdsOverride,
      featuresOverride: state.features,
      notes: state.notes,
      countdown: state.countdown,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit: {adversary.source.name}</DialogTitle>
        </DialogHeader>

        <AdversaryDialogBody
          adversary={adversary}
          baseThresholds={baseThresholds}
          state={state}
          actions={actions}
          attackModified={attackModified}
          thresholdsModified={thresholdsModified}
          onAttackReset={handleAttackReset}
          onThresholdReset={handleThresholdReset}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
