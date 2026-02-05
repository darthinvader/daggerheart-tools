import { Link } from '@tanstack/react-router';
import {
  ArrowLeft,
  Cloud,
  CloudOff,
  Crown,
  Loader2,
  Sparkles,
} from 'lucide-react';
import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { cn } from '@/lib/utils';

interface EnhancedHeaderProps {
  characterName: string;
  characterTitle?: string;
  className?: string;
  level: number;
  tier: number;
  readOnly: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  campaignSection?: ReactNode;
  statusBar?: ReactNode;
}

const tierColors: Record<number, string> = {
  1: 'bg-tier-1 text-white',
  2: 'bg-tier-2 text-white',
  3: 'bg-tier-3 text-white',
  4: 'bg-tier-4 text-tier-4-foreground',
};

const tierLabels: Record<number, string> = {
  1: 'Adventurer',
  2: 'Veteran',
  3: 'Hero',
  4: 'Legend',
};

function LevelBadge({ level, tier }: { level: number; tier: number }) {
  const colorClass = tierColors[tier] ?? tierColors[1];

  return (
    <SmartTooltip
      content={`Level ${level} · Tier ${tier} (${tierLabels[tier] ?? 'Adventurer'})`}
    >
      <div className="relative">
        <div
          className={cn(
            'flex size-10 items-center justify-center rounded-xl font-bold shadow-sm sm:size-12 sm:rounded-2xl sm:text-lg',
            colorClass
          )}
        >
          {level}
        </div>
        <div
          className={cn(
            'absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full px-1.5 py-0 text-[9px] leading-tight font-semibold whitespace-nowrap',
            colorClass,
            'opacity-90'
          )}
        >
          T{tier}
        </div>
      </div>
    </SmartTooltip>
  );
}

function SaveIndicator({
  isSaving,
  lastSaved,
}: {
  isSaving: boolean;
  lastSaved: Date | null;
}) {
  if (isSaving) {
    return (
      <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span className="hidden sm:inline">Saving...</span>
      </div>
    );
  }

  if (lastSaved) {
    return (
      <SmartTooltip content={`Last saved: ${lastSaved.toLocaleTimeString()}`}>
        <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
          <Cloud className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Saved</span>
        </div>
      </SmartTooltip>
    );
  }

  return (
    <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
      <CloudOff className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">Not saved</span>
    </div>
  );
}

function ClassIcon({ className }: { className?: string }) {
  // Decorative class icon using existing icons
  return <Crown className={cn('text-hope', className)} />;
}

export function EnhancedCharacterHeader({
  characterName,
  characterTitle,
  className: cssClassName,
  level,
  tier,
  readOnly,
  isSaving,
  lastSaved,
  campaignSection,
  statusBar,
}: EnhancedHeaderProps) {
  return (
    <div className={cn('space-y-3', cssClassName)}>
      {/* Top bar: Back + Save + Campaign */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="h-8 gap-1 px-2">
          <Link to="/character">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Characters</span>
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          {campaignSection}
          {readOnly ? (
            <Badge variant="outline" className="text-xs">
              Read-only
            </Badge>
          ) : (
            <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} />
          )}
        </div>
      </div>

      {/* Character identity section */}
      <div className="flex items-center gap-3 sm:gap-4">
        <LevelBadge level={level} tier={tier} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-lg font-bold tracking-tight sm:text-xl lg:text-2xl">
              {characterName || 'Untitled Character'}
            </h1>
            {characterTitle && (
              <Badge
                variant="outline"
                className="border-hope/50 bg-hope-muted text-hope-foreground shrink-0 gap-1"
              >
                <Sparkles className="size-3" />
                {characterTitle}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm">
            {tierLabels[tier] ?? 'Adventurer'} · Level {level}
          </p>
        </div>
        <ClassIcon className="hidden size-8 opacity-30 sm:block lg:size-10" />
      </div>

      {/* Dagger divider */}
      <div className="dagger-divider" />

      {/* Status bar */}
      {statusBar}
    </div>
  );
}
