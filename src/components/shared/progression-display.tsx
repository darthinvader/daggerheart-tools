import { ChevronUp } from 'lucide-react';

import { useCallback, useState } from 'react';

import { EditableSection } from '@/components/shared/editable-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { getTierForLevel } from '@/lib/schemas/core';
import { cn } from '@/lib/utils';

export interface ProgressionState {
  currentLevel: number;
  currentTier: string;
  experience?: number;
  experienceToNext?: number;
}

interface ProgressionDisplayProps {
  progression: ProgressionState;
  onChange?: (progression: ProgressionState) => void;
  onLevelUp?: () => void;
  canLevelUp?: boolean;
  className?: string;
  readOnly?: boolean;
}

const TIER_COLORS: Record<string, string> = {
  '1': 'text-green-600 border-green-500/30 bg-green-500/10',
  '2-4': 'text-blue-600 border-blue-500/30 bg-blue-500/10',
  '5-7': 'text-purple-600 border-purple-500/30 bg-purple-500/10',
  '8-10': 'text-amber-600 border-amber-500/30 bg-amber-500/10',
};

const TIER_EMOJIS: Record<string, string> = {
  '1': '🌱',
  '2-4': '⚔️',
  '5-7': '🔥',
  '8-10': '👑',
};

const TIER_NAMES: Record<string, string> = {
  '1': 'Novice',
  '2-4': 'Adventurer',
  '5-7': 'Veteran',
  '8-10': 'Legend',
};

function EmptyProgression() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <span className="text-4xl opacity-50">📈</span>
      <p className="text-muted-foreground mt-2">No progression data</p>
      <p className="text-muted-foreground text-sm">
        Start your adventure to track progress
      </p>
    </div>
  );
}

function LevelBadge({ level, tier }: { level: number; tier: string }) {
  const emoji = TIER_EMOJIS[tier] ?? '⭐';
  const tierName = TIER_NAMES[tier] ?? 'Unknown';
  const tierColor = TIER_COLORS[tier] ?? '';

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div
          className={cn(
            'flex size-16 items-center justify-center rounded-full border-2 font-bold',
            tierColor
          )}
        >
          <span className="text-2xl">{level}</span>
        </div>
        <span className="absolute -right-1 -bottom-1 text-2xl">{emoji}</span>
      </div>
      <div>
        <p className="text-muted-foreground text-xs tracking-wide uppercase">
          Level
        </p>
        <p className="font-semibold">{tierName}</p>
        <Badge variant="outline" className={cn('text-xs', tierColor)}>
          Tier {tier}
        </Badge>
      </div>
    </div>
  );
}

function ExperienceBar({ current, next }: { current?: number; next?: number }) {
  if (current === undefined || next === undefined) return null;

  const percentage = Math.min(100, (current / next) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Experience</span>
        <span className="font-medium">
          {current} / {next} XP
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
      <p className="text-muted-foreground text-xs">
        {next - current} XP to next level
      </p>
    </div>
  );
}

function ProgressionContent({
  progression,
  onLevelUp,
  canLevelUp,
}: {
  progression: ProgressionState;
  onLevelUp?: () => void;
  canLevelUp?: boolean;
}) {
  const { currentLevel, currentTier, experience, experienceToNext } =
    progression;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <LevelBadge level={currentLevel} tier={currentTier} />

        {onLevelUp && (
          <SmartTooltip
            content={
              canLevelUp
                ? 'Level up your character!'
                : 'Not enough experience to level up'
            }
          >
            <Button
              variant={canLevelUp ? 'default' : 'outline'}
              size="sm"
              onClick={onLevelUp}
              disabled={!canLevelUp}
              className={cn(
                'gap-2',
                canLevelUp &&
                  'animate-pulse bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
              )}
            >
              <ChevronUp className="size-4" />
              Level Up
            </Button>
          </SmartTooltip>
        )}
      </div>

      {(experience !== undefined || experienceToNext !== undefined) && (
        <>
          <Separator />
          <ExperienceBar current={experience} next={experienceToNext} />
        </>
      )}

      <Separator />

      <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
        {Object.entries(TIER_NAMES).map(([tier, name]) => {
          const isActive = tier === currentTier;
          const tierEmoji = TIER_EMOJIS[tier];
          return (
            <div
              key={tier}
              className={cn(
                'rounded-lg border p-2 transition-all',
                isActive
                  ? TIER_COLORS[tier]
                  : 'border-muted bg-muted/20 opacity-50'
              )}
            >
              <span className="text-xl">{tierEmoji}</span>
              <p
                className={cn(
                  'text-xs font-medium',
                  isActive && TIER_COLORS[tier]?.split(' ')[0]
                )}
              >
                {name}
              </p>
              <p className="text-muted-foreground text-xs">Tier {tier}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface LevelEditorProps {
  level: number;
  onChange: (level: number) => void;
}

function LevelEditor({ level, onChange }: LevelEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Current Level</label>
        <p className="text-muted-foreground text-xs">
          Choose your character&apos;s current level (1-10)
        </p>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(lvl => {
          const tier = getTierForLevel(lvl);
          return (
            <Button
              key={lvl}
              variant={level === lvl ? 'default' : 'outline'}
              size="sm"
              onClick={() => onChange(lvl)}
              className={cn(level === lvl && TIER_COLORS[tier])}
            >
              {lvl}
            </Button>
          );
        })}
      </div>
      <div className="rounded-lg border p-4">
        <p className="text-sm">
          <strong>Selected:</strong> Level {level} (Tier{' '}
          {getTierForLevel(level)})
        </p>
        <p className="text-muted-foreground text-xs">
          {TIER_NAMES[getTierForLevel(level)]} tier
        </p>
      </div>
    </div>
  );
}

export function ProgressionDisplay({
  progression,
  onChange,
  onLevelUp,
  canLevelUp = false,
  className,
  readOnly = false,
}: ProgressionDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftLevel, setDraftLevel] = useState(progression.currentLevel);

  const handleEditToggle = useCallback(() => {
    if (isEditing && onChange) {
      onChange({
        ...progression,
        currentLevel: draftLevel,
        currentTier: getTierForLevel(draftLevel),
      });
    } else {
      setDraftLevel(progression.currentLevel);
    }
    setIsEditing(prev => !prev);
  }, [isEditing, draftLevel, progression, onChange]);

  if (!progression) {
    return <EmptyProgression />;
  }

  return (
    <EditableSection
      title="Progression"
      emoji="📈"
      isEditing={isEditing}
      onEditToggle={handleEditToggle}
      showEditButton={!readOnly}
      modalSize="md"
      className={cn(className)}
      editTitle="Edit Progression"
      editDescription="Adjust your character's level and progression."
      editContent={<LevelEditor level={draftLevel} onChange={setDraftLevel} />}
    >
      <ProgressionContent
        progression={progression}
        onLevelUp={onLevelUp}
        canLevelUp={canLevelUp}
      />
    </EditableSection>
  );
}
