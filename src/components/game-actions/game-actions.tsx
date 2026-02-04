import { Sparkles, Users } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  clearStressOnCriticalSuccess,
  TAG_TEAM_HOPE_COST,
  tryTagTeam,
} from '@/lib/mechanics';
import { cn } from '@/lib/utils';

export interface GameActionsState {
  /** Current stress value */
  currentStress: number;
  /** Maximum stress slots */
  maxStress: number;
  /** Current Hope value */
  currentHope: number;
  /** Whether Tag Team has been used this session */
  tagTeamUsedThisSession: boolean;
}

export interface GameActionsCallbacks {
  /** Called when stress changes */
  onStressChange: (newStress: number) => void;
  /** Called when hope changes */
  onHopeChange: (newHope: number) => void;
  /** Called when Tag Team is used */
  onTagTeamUsed: () => void;
}

interface GameActionsProps {
  state: GameActionsState;
  callbacks: GameActionsCallbacks;
  className?: string;
}

/**
 * Game action buttons for Critical Success and Tag Team mechanics.
 *
 * Per SRD:
 * - Critical Success (Page 29): Clears 1 Stress
 * - Tag Team (Page 32): Costs 3 Hope, once per session
 */
export function GameActions({ state, callbacks, className }: GameActionsProps) {
  const [showTagTeamDialog, setShowTagTeamDialog] = useState(false);
  const [tagTeamError, setTagTeamError] = useState<string | null>(null);

  const handleCriticalSuccess = useCallback(() => {
    const newStress = clearStressOnCriticalSuccess(state.currentStress);
    callbacks.onStressChange(newStress);
  }, [state.currentStress, callbacks]);

  const handleTagTeamAttempt = useCallback(() => {
    const result = tryTagTeam(state.currentHope, state.tagTeamUsedThisSession);

    if (result.success) {
      callbacks.onHopeChange(result.newHope);
      callbacks.onTagTeamUsed();
      setShowTagTeamDialog(false);
      setTagTeamError(null);
    } else {
      setTagTeamError(result.errorMessage ?? 'Cannot use Tag Team');
    }
  }, [state.currentHope, state.tagTeamUsedThisSession, callbacks]);

  const canClearStress = state.currentStress > 0;

  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="text-muted-foreground text-sm font-medium">
        Game Actions
      </h3>

      <div className="flex flex-wrap gap-2">
        {/* Critical Success Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleCriticalSuccess}
          disabled={!canClearStress}
          className="gap-2"
        >
          <Sparkles className="size-4" />
          <span>Critical Success</span>
          {canClearStress && (
            <span className="text-muted-foreground text-xs">(-1 Stress)</span>
          )}
        </Button>

        {/* Tag Team Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowTagTeamDialog(true)}
          disabled={state.tagTeamUsedThisSession}
          className={cn('gap-2', state.tagTeamUsedThisSession && 'opacity-50')}
        >
          <Users className="size-4" />
          <span>Tag Team</span>
          {!state.tagTeamUsedThisSession ? (
            <span className="text-muted-foreground text-xs">
              (-{TAG_TEAM_HOPE_COST} Hope)
            </span>
          ) : (
            <span className="text-muted-foreground text-xs">(Used)</span>
          )}
        </Button>
      </div>

      {/* Tag Team Confirmation Dialog */}
      <Dialog open={showTagTeamDialog} onOpenChange={setShowTagTeamDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="size-5" />
              Tag Team Roll
            </DialogTitle>
            <DialogDescription>
              Spend {TAG_TEAM_HOPE_COST} Hope to make a Tag Team Roll with
              another PC. You can only use Tag Team once per session.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="flex items-center justify-between text-sm">
              <span>Current Hope:</span>
              <span className="font-medium">{state.currentHope}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Cost:</span>
              <span className="font-medium text-amber-500">
                -{TAG_TEAM_HOPE_COST} Hope
              </span>
            </div>
            {tagTeamError && (
              <div className="text-destructive text-sm">{tagTeamError}</div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowTagTeamDialog(false);
                setTagTeamError(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTagTeamAttempt}
              disabled={state.currentHope < TAG_TEAM_HOPE_COST}
            >
              Use Tag Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
