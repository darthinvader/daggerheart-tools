import {
  Minus,
  PawPrint,
  Plus,
  Shield,
  Swords,
  Trash2,
  Wind,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import type { CompanionState } from './types';

interface CompanionHeaderProps {
  name: string;
  type: string;
  isHomebrew?: boolean;
  onEdit: () => void;
  onDisable?: () => void;
}

export function CompanionHeader({
  name,
  type,
  isHomebrew,
  onEdit,
  onDisable,
}: CompanionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <PawPrint className="h-5 w-5" />
          {name}
          {isHomebrew && (
            <span className="text-muted-foreground text-xs font-normal">
              (Homebrew)
            </span>
          )}
        </h3>
        <p className="text-muted-foreground text-sm">{type}</p>
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          Edit
        </Button>
        {onDisable && (
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={onDisable}
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

interface CompanionStatsGridProps {
  evasion: number;
  damageDie: string;
  range: string;
  standardAttack: string;
}

export function CompanionStatsGrid({
  evasion,
  damageDie,
  range,
  standardAttack,
}: CompanionStatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="flex items-center gap-2 rounded-lg border p-2">
        <Wind className="text-muted-foreground h-4 w-4" />
        <div>
          <p className="text-muted-foreground text-xs">Evasion</p>
          <p className="font-bold">{evasion}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-lg border p-2">
        <Swords className="text-muted-foreground h-4 w-4" />
        <div>
          <p className="text-muted-foreground text-xs">Damage</p>
          <p className="font-bold">{damageDie}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-lg border p-2">
        <Shield className="text-muted-foreground h-4 w-4" />
        <div>
          <p className="text-muted-foreground text-xs">Range</p>
          <p className="font-bold">{range}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-lg border p-2">
        <div>
          <p className="text-muted-foreground text-xs">Attack</p>
          <p className="truncate text-sm font-medium">
            {standardAttack || '—'}
          </p>
        </div>
      </div>
    </div>
  );
}

interface CompanionStressTrackerProps {
  markedStress: number;
  totalSlots: number;
  onStressChange: (delta: number) => void;
  onSlotClick: (index: number) => void;
}

export function CompanionStressTracker({
  markedStress,
  totalSlots,
  onStressChange,
  onSlotClick,
}: CompanionStressTrackerProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Stress</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => onStressChange(-1)}
            disabled={markedStress <= 0}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center text-sm">
            {markedStress}/{totalSlots}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => onStressChange(1)}
            disabled={markedStress >= totalSlots}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: totalSlots }).map((_, i) => (
          <button
            key={i}
            className={cn(
              'h-6 w-6 rounded border-2 transition-colors',
              i < markedStress
                ? 'border-amber-500 bg-amber-500'
                : 'border-muted-foreground/30 bg-transparent'
            )}
            onClick={() => onSlotClick(i)}
            aria-label={`Stress slot ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

interface CompanionExperiencesBadgesProps {
  experiences: CompanionState['experiences'];
}

export function CompanionExperiencesBadges({
  experiences,
}: CompanionExperiencesBadgesProps) {
  const validExperiences = experiences.filter(e => e.name);
  if (validExperiences.length === 0) return null;

  return (
    <>
      <Separator />
      <div>
        <h4 className="mb-2 text-sm font-medium">Companion Experiences</h4>
        <div className="flex flex-wrap gap-2">
          {validExperiences.map((exp, i) => (
            <span
              key={i}
              className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
            >
              {exp.name} +{exp.bonus}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

function TrainingBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-secondary text-secondary-foreground rounded px-2 py-0.5 text-xs">
      {children}
    </span>
  );
}

function hasActiveTraining(training: CompanionState['training']): boolean {
  return (
    training.intelligent > 0 ||
    training.lightInTheDark ||
    training.creatureComfort ||
    training.armored ||
    training.vicious > 0 ||
    training.resilient > 0 ||
    training.bonded ||
    (training.aware ?? 0) > 0
  );
}

interface CompanionTrainingBadgesProps {
  training: CompanionState['training'];
}

export function CompanionTrainingBadges({
  training,
}: CompanionTrainingBadgesProps) {
  if (!hasActiveTraining(training)) return null;

  return (
    <>
      <Separator />
      <div>
        <h4 className="mb-2 text-sm font-medium">Training</h4>
        <div className="flex flex-wrap gap-1">
          {training.intelligent > 0 && (
            <TrainingBadge>Intelligent ×{training.intelligent}</TrainingBadge>
          )}
          {training.lightInTheDark && (
            <TrainingBadge>Light in the Dark</TrainingBadge>
          )}
          {training.creatureComfort && (
            <TrainingBadge>Creature Comfort</TrainingBadge>
          )}
          {training.armored && <TrainingBadge>Armored</TrainingBadge>}
          {training.vicious > 0 && (
            <TrainingBadge>Vicious ×{training.vicious}</TrainingBadge>
          )}
          {training.resilient > 0 && (
            <TrainingBadge>Resilient ×{training.resilient}</TrainingBadge>
          )}
          {training.bonded && <TrainingBadge>Bonded</TrainingBadge>}
          {(training.aware ?? 0) > 0 && (
            <TrainingBadge>Aware ×{training.aware}</TrainingBadge>
          )}
        </div>
      </div>
    </>
  );
}
