import { AlertTriangle, PawPrint, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { CompanionEditor } from './companion-editor';
import {
  CompanionExperiencesBadges,
  CompanionHeader,
  CompanionStatsGrid,
  CompanionStressTracker,
  CompanionTrainingBadges,
} from './companion-ui-parts';
import { type CompanionState, DEFAULT_COMPANION_STATE } from './types';

interface CompanionDisplayProps {
  companion: CompanionState | undefined;
  onChange: (companion: CompanionState | undefined) => void;
  isHomebrew?: boolean;
  onDisable?: () => void;
}

interface CompanionEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  draft: CompanionState;
  onDraftChange: (state: CompanionState) => void;
  onSave: () => void;
  onRemove?: () => void;
  title: string;
}

function CompanionEditDialog({
  isOpen,
  onClose,
  draft,
  onDraftChange,
  onSave,
  onRemove,
  title,
}: CompanionEditDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        aria-describedby={undefined}
        className="h-full w-full overflow-y-auto sm:h-auto sm:max-h-[90vh] sm:w-[98vw] sm:max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <CompanionEditor state={draft} onChange={onDraftChange} />
        <DialogFooter className="gap-2">
          {onRemove && (
            <Button variant="destructive" onClick={onRemove}>
              Remove
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EmptyCompanionState({
  isHomebrew,
  onAdd,
  onDisable,
}: {
  isHomebrew?: boolean;
  onAdd: () => void;
  onDisable?: () => void;
}) {
  return (
    <section className="bg-card hover:border-primary/20 rounded-xl border shadow-sm transition-colors">
      <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <PawPrint className="size-5" />
          <h3 className="text-lg font-semibold">Companion</h3>
          {isHomebrew && (
            <span className="text-muted-foreground text-xs">(Homebrew)</span>
          )}
        </div>
      </div>
      <div className="p-6 text-center">
        <PawPrint className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
        <p className="text-muted-foreground mb-4 text-sm">
          No companion configured
        </p>
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={onAdd}>
            Add Companion
          </Button>
          {onDisable && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={onDisable}
            >
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

export function CompanionDisplay({
  companion,
  onChange,
  isHomebrew,
  onDisable,
}: CompanionDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<CompanionState>(DEFAULT_COMPANION_STATE);

  const handleEdit = () => {
    setDraft(companion ?? DEFAULT_COMPANION_STATE);
    setIsEditing(true);
  };

  const handleSave = () => {
    onChange(draft.name ? draft : undefined);
    setIsEditing(false);
  };

  const totalStressSlots = companion
    ? companion.stressSlots + companion.training.resilient
    : 2;

  const effectiveEvasion = companion
    ? companion.evasion + (companion.training.aware ?? 0) * 2
    : 10;

  const isOutOfScene = companion
    ? companion.markedStress >= totalStressSlots
    : false;

  if (!companion) {
    return (
      <>
        <EmptyCompanionState
          isHomebrew={isHomebrew}
          onAdd={handleEdit}
          onDisable={onDisable}
        />
        <CompanionEditDialog
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          draft={draft}
          onDraftChange={setDraft}
          onSave={handleSave}
          title="Add Companion"
        />
      </>
    );
  }

  const handleStressChange = (delta: number) => {
    const newStress = Math.max(
      0,
      Math.min(totalStressSlots, companion.markedStress + delta)
    );
    onChange({ ...companion, markedStress: newStress });
  };

  const handleSlotClick = (index: number) => {
    onChange({
      ...companion,
      markedStress: index < companion.markedStress ? index : index + 1,
    });
  };

  return (
    <>
      <section className="bg-card hover:border-primary/20 rounded-xl border shadow-sm transition-colors">
        <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <PawPrint className="size-5" />
            <h3 className="text-lg font-semibold">Companion</h3>
            {isHomebrew && (
              <span className="text-muted-foreground text-xs">(Homebrew)</span>
            )}
          </div>
        </div>

        <div className="space-y-4 p-4 sm:p-6">
          <CompanionHeader
            name={companion.name}
            type={companion.type}
            isHomebrew={false}
            onEdit={handleEdit}
            onDisable={onDisable}
          />

          {isOutOfScene && (
            <div className="bg-destructive/10 text-destructive flex items-center gap-2 rounded-md p-3 text-sm">
              <AlertTriangle className="size-4" /> Companion has fled the scene!
              Returns after long rest with 1 Stress cleared.
            </div>
          )}

          <CompanionStatsGrid
            evasion={effectiveEvasion}
            damageDie={companion.damageDie}
            range={companion.range}
            standardAttack={companion.standardAttack}
          />

          <CompanionStressTracker
            markedStress={companion.markedStress}
            totalSlots={totalStressSlots}
            onStressChange={handleStressChange}
            onSlotClick={handleSlotClick}
          />

          <CompanionExperiencesBadges experiences={companion.experiences} />
          <CompanionTrainingBadges training={companion.training} />
        </div>
      </section>

      <CompanionEditDialog
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        draft={draft}
        onDraftChange={setDraft}
        onSave={handleSave}
        onRemove={() => {
          onChange(undefined);
          setIsEditing(false);
        }}
        title="Edit Companion"
      />
    </>
  );
}
