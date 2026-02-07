/**
 * Custom Adversary Builder - Create custom adversaries from scratch
 */
import { Save, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { Adversary } from '@/lib/schemas/adversaries';

import { ROLE_ICONS } from './adversary-card-shared';
import {
  AttackSection,
  BasicInfoSection,
  CombatStatsSection,
  ExperiencesSection,
  FeaturesSection,
  MotivesTacticsSection,
} from './custom-adversary-builder-sections';
import { useCustomAdversaryBuilderState } from './use-custom-adversary-builder-state';

// ============== Component ==============

interface CustomAdversaryBuilderProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (adversary: Adversary) => void;
}

export function CustomAdversaryBuilder({
  isOpen,
  onOpenChange,
  onSave,
}: CustomAdversaryBuilderProps) {
  const {
    state,
    newExperience,
    newFeature,
    setNewExperience,
    updateNewFeature,
    updateField,
    handleTierChange,
    addExperience,
    removeExperience,
    addFeature,
    removeFeature,
    handleSave,
    roleColors,
    pointCost,
    isValid,
  } = useCustomAdversaryBuilderState({ onSave, onOpenChange, open: isOpen });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-full w-full flex-col gap-0 p-0 sm:h-auto sm:max-h-[90vh] sm:max-w-3xl">
        <DialogHeader className={`border-b px-6 py-4 ${roleColors.bg}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-purple-500/20">
                <Sparkles className="size-5 text-purple-500" />
              </div>
              <div>
                <DialogTitle className="text-xl">
                  Create Custom Adversary
                </DialogTitle>
                <p className="text-muted-foreground text-sm">
                  Build a unique adversary for your encounter
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={roleColors.badge}>
                {ROLE_ICONS[state.role]} {state.role}
              </Badge>
              <Badge variant="secondary">{pointCost} pts</Badge>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-6 p-6">
            <BasicInfoSection
              state={state}
              onTierChange={handleTierChange}
              onRoleChange={role => updateField('role', role)}
              onFieldChange={updateField}
            />

            <Separator />

            <CombatStatsSection state={state} onFieldChange={updateField} />

            <Separator />

            <AttackSection state={state} onFieldChange={updateField} />

            <Separator />

            <MotivesTacticsSection
              value={state.motivesAndTactics}
              onChange={value => updateField('motivesAndTactics', value)}
            />

            <Separator />

            <ExperiencesSection
              experiences={state.experiences}
              newExperience={newExperience}
              onNewExperienceChange={setNewExperience}
              onAdd={addExperience}
              onRemove={removeExperience}
            />

            <Separator />

            <FeaturesSection
              features={state.features}
              newFeature={newFeature}
              onNewFeatureChange={updateNewFeature}
              onAdd={addFeature}
              onRemove={removeFeature}
            />
          </div>
        </ScrollArea>

        <DialogFooter className="border-t px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <p className="text-muted-foreground text-sm">
              {isValid ? (
                <span className="text-green-600 dark:text-green-400">
                  Ready to save
                </span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400">
                  Name is required
                </span>
              )}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!isValid}
                className="gap-2"
              >
                <Save className="size-4" />
                Create Adversary
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
