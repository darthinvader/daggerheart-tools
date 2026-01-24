import {
  ChevronUp,
  Crown,
  Flame,
  type LucideIcon,
  Sprout,
  Star,
  Sword,
  TrendingUp,
} from 'lucide-react';
import { useCallback, useState } from 'react';

import { EditableSection } from '@/components/shared/editable-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getTierForLevel } from '@/lib/schemas/core';
import { cn } from '@/lib/utils';

export interface ProgressionState {
  currentLevel: number;
  currentTier: string;
  tierHistory: Record<string, number>;
}

interface ProgressionDisplayProps {
  progression: ProgressionState;
  onChange?: (progression: ProgressionState) => void;
  onLevelUp?: () => void;
  className?: string;
  readOnly?: boolean;
}

const TIER_COLORS: Record<string, string> = {
  '1': 'text-green-600 border-green-500/30 bg-green-500/10',
  '2-4': 'text-blue-600 border-blue-500/30 bg-blue-500/10',
  '5-7': 'text-purple-600 border-purple-500/30 bg-purple-500/10',
  '8-10': 'text-amber-600 border-amber-500/30 bg-amber-500/10',
};

const TIER_ICONS: Record<string, LucideIcon> = {
  '1': Sprout,
  '2-4': Sword,
  '5-7': Flame,
  '8-10': Crown,
};

const TIER_NAMES: Record<string, string> = {
  '1': 'Novice',
  '2-4': 'Adventurer',
  '5-7': 'Veteran',
  '8-10': 'Legend',
};

const TIER_NUMBERS: Record<string, number> = {
  '1': 1,
  '2-4': 2,
  '5-7': 3,
  '8-10': 4,
};

function EmptyProgression() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <TrendingUp className="size-10 opacity-50" />
      <p className="text-muted-foreground mt-2">No progression data</p>
      <p className="text-muted-foreground text-sm">
        Start your adventure to track progress
      </p>
    </div>
  );
}

function LevelBadge({ level, tier }: { level: number; tier: string }) {
  const TierIcon = TIER_ICONS[tier] ?? Star;
  const tierName = TIER_NAMES[tier] ?? 'Unknown';
  const tierColor = TIER_COLORS[tier] ?? '';
  const tierNumber = TIER_NUMBERS[tier] ?? 1;

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
        <TierIcon className="absolute -right-1 -bottom-1 size-6" />
      </div>
      <div>
        <p className="text-muted-foreground text-xs tracking-wide uppercase">
          Level
        </p>
        <p className="font-semibold">{tierName}</p>
        <Badge variant="outline" className={cn('text-xs', tierColor)}>
          Tier {tierNumber}
        </Badge>
      </div>
    </div>
  );
}

function ProgressionContent({
  progression,
  onLevelUp,
}: {
  progression: ProgressionState;
  onLevelUp?: () => void;
}) {
  const { currentLevel, currentTier } = progression;
  const canLevelUp = currentLevel < 10;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <LevelBadge level={currentLevel} tier={currentTier} />

        {onLevelUp && (
          <Button
            variant={canLevelUp ? 'default' : 'outline'}
            size="sm"
            onClick={onLevelUp}
            disabled={!canLevelUp}
            className={cn(
              'gap-2',
              canLevelUp &&
                'bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
            )}
          >
            <ChevronUp className="size-4" />
            Level Up
          </Button>
        )}
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
        {Object.entries(TIER_NAMES).map(([tier, name]) => {
          const isActive = tier === currentTier;
          const TierIcon = TIER_ICONS[tier] ?? Star;
          const tierNumber = TIER_NUMBERS[tier];
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
              <TierIcon className="mx-auto size-5" />
              <p
                className={cn(
                  'text-xs font-medium',
                  isActive && TIER_COLORS[tier]?.split(' ')[0]
                )}
              >
                {name}
              </p>
              <p className="text-muted-foreground text-xs">Tier {tierNumber}</p>
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
      icon={TrendingUp}
      isEditing={isEditing}
      onEditToggle={handleEditToggle}
      showEditButton={!readOnly}
      modalSize="md"
      className={cn(className)}
      editTitle="Edit Progression"
      editDescription="Adjust your character's level and progression."
      editContent={<LevelEditor level={draftLevel} onChange={setDraftLevel} />}
    >
      <ProgressionContent progression={progression} onLevelUp={onLevelUp} />
    </EditableSection>
  );
}
