import type { LucideProps } from 'lucide-react';
import {
  AlertTriangle,
  BookOpen,
  GraduationCap,
  Minus,
  Pencil,
  Plus,
  Shield,
  Swords,
  Trash2,
  Wind,
  Zap,
} from 'lucide-react';
import type { ComponentType } from 'react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DynamicIcon } from '@/lib/icons';
import { cn } from '@/lib/utils';

import { CompanionTrainingIcons, getCompanionIcon } from './constants';
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
  const icon = getCompanionIcon(type);
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <DynamicIcon icon={icon} className="size-6" />
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
          <Pencil className="mr-1 size-4" /> Edit
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
      <div className="flex items-center gap-2 rounded-lg border-2 border-blue-400/30 bg-blue-50/50 p-3 dark:bg-blue-950/20">
        <Wind className="h-5 w-5 text-blue-500" />
        <div>
          <p className="text-muted-foreground text-xs">Evasion</p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {evasion}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-lg border-2 border-red-400/30 bg-red-50/50 p-3 dark:bg-red-950/20">
        <Swords className="h-5 w-5 text-red-500" />
        <div>
          <p className="text-muted-foreground text-xs">Damage</p>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">
            {damageDie}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-lg border-2 border-amber-400/30 bg-amber-50/50 p-3 dark:bg-amber-950/20">
        <Shield className="h-5 w-5 text-amber-500" />
        <div>
          <p className="text-muted-foreground text-xs">Range</p>
          <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
            {range}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-lg border-2 border-purple-400/30 bg-purple-50/50 p-3 dark:bg-purple-950/20">
        <Swords className="h-5 w-5 text-purple-500" />
        <div>
          <p className="text-muted-foreground text-xs">Attack</p>
          <p className="truncate text-sm font-bold text-purple-600 dark:text-purple-400">
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
    <div className="space-y-2 rounded-lg border-2 border-orange-400/30 bg-orange-50/30 p-3 dark:bg-orange-950/10">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-medium">
          <Zap className="size-5 text-orange-500" /> Stress
        </span>
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
          <span className="w-10 text-center text-sm font-bold">
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
      <div className="flex gap-2">
        {Array.from({ length: totalSlots }).map((_, i) => (
          <button
            key={i}
            className={cn(
              'h-8 w-8 rounded-lg border-2 transition-all',
              i < markedStress
                ? 'border-orange-500 bg-gradient-to-br from-orange-400 to-orange-600 shadow-md'
                : 'border-muted-foreground/30 bg-transparent hover:border-orange-300'
            )}
            onClick={() => onSlotClick(i)}
            aria-label={`Stress slot ${i + 1}`}
          >
            {i < markedStress && (
              <AlertTriangle className="size-4 text-white" />
            )}
          </button>
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
  const validExperiences = (experiences ?? []).filter(e => e.name);
  if (validExperiences.length === 0) return null;

  return (
    <>
      <Separator />
      <div>
        <h4 className="mb-2 flex items-center gap-2 text-sm font-medium">
          <BookOpen className="size-4" /> Companion Experiences
        </h4>
        <div className="flex flex-wrap gap-2">
          {validExperiences.map((exp, i) => (
            <span
              key={i}
              className="flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 px-3 py-1.5 text-sm font-medium text-emerald-700 ring-1 ring-emerald-500/30 dark:text-emerald-300"
            >
              {exp.name} +{exp.bonus}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

function TrainingBadge({
  children,
  Icon,
  color = 'bg-secondary',
}: {
  children: React.ReactNode;
  Icon?: ComponentType<LucideProps>;
  color?: string;
}) {
  return (
    <span
      className={`${color} text-secondary-foreground flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium`}
    >
      {Icon && <Icon className="size-3.5" />}
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
        <h4 className="mb-2 flex items-center gap-2 text-sm font-medium">
          <GraduationCap className="size-4" /> Training
        </h4>
        <div className="flex flex-wrap gap-2">
          {training.intelligent > 0 && (
            <TrainingBadge
              Icon={CompanionTrainingIcons.intelligent}
              color="bg-blue-100 dark:bg-blue-900/40"
            >
              Intelligent ×{training.intelligent}
            </TrainingBadge>
          )}
          {training.lightInTheDark && (
            <TrainingBadge
              Icon={CompanionTrainingIcons.lightInTheDark}
              color="bg-yellow-100 dark:bg-yellow-900/40"
            >
              Light in the Dark
            </TrainingBadge>
          )}
          {training.creatureComfort && (
            <TrainingBadge
              Icon={CompanionTrainingIcons.creatureComfort}
              color="bg-pink-100 dark:bg-pink-900/40"
            >
              Creature Comfort
            </TrainingBadge>
          )}
          {training.armored && (
            <TrainingBadge
              Icon={CompanionTrainingIcons.armored}
              color="bg-slate-200 dark:bg-slate-700/40"
            >
              Armored
            </TrainingBadge>
          )}
          {training.vicious > 0 && (
            <TrainingBadge
              Icon={CompanionTrainingIcons.vicious}
              color="bg-red-100 dark:bg-red-900/40"
            >
              Vicious ×{training.vicious}
            </TrainingBadge>
          )}
          {training.resilient > 0 && (
            <TrainingBadge
              Icon={CompanionTrainingIcons.resilient}
              color="bg-amber-100 dark:bg-amber-900/40"
            >
              Resilient ×{training.resilient}
            </TrainingBadge>
          )}
          {training.bonded && (
            <TrainingBadge
              Icon={CompanionTrainingIcons.bonded}
              color="bg-green-100 dark:bg-green-900/40"
            >
              Bonded
            </TrainingBadge>
          )}
          {(training.aware ?? 0) > 0 && (
            <TrainingBadge
              Icon={CompanionTrainingIcons.aware}
              color="bg-purple-100 dark:bg-purple-900/40"
            >
              Aware ×{training.aware}
            </TrainingBadge>
          )}
        </div>
      </div>
    </>
  );
}
