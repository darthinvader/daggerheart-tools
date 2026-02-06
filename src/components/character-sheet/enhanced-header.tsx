import { Link } from '@tanstack/react-router';
import {
  ArrowLeft,
  Cloud,
  CloudOff,
  Crown,
  Loader2,
  Shield,
  Sparkles,
  Swords,
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
  1: 'bg-tier-1',
  2: 'bg-tier-2',
  3: 'bg-tier-3',
  4: 'bg-tier-4',
};

const tierLabels: Record<number, string> = {
  1: 'Adventurer',
  2: 'Veteran',
  3: 'Hero',
  4: 'Legend',
};

const tierIcons: Record<number, typeof Shield> = {
  1: Shield,
  2: Swords,
  3: Crown,
  4: Sparkles,
};

/* ── Sub-components ─────────────────────────────────────────────── */

function LevelBadge({ level, tier }: { level: number; tier: number }) {
  const bg = tierColors[tier] ?? tierColors[1];
  const TierIcon = tierIcons[tier] ?? Shield;

  return (
    <SmartTooltip
      content={`Level ${level} · Tier ${tier} — ${tierLabels[tier] ?? 'Adventurer'}`}
    >
      <div className="group relative">
        {/* Ambient glow behind badge */}
        <div
          className={cn(
            'absolute inset-0 rounded-xl opacity-40 blur-md transition-opacity group-hover:opacity-60',
            bg
          )}
        />
        <div className={cn('level-badge relative text-white', bg)}>{level}</div>
        <div
          className={cn('level-badge-tier-label text-white', bg, 'opacity-90')}
        >
          <span className="flex items-center gap-0.5">
            <TierIcon className="size-2" />T{tier}
          </span>
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
        <Loader2 className="size-3.5 animate-spin" />
        <span className="hidden sm:inline">Saving…</span>
      </div>
    );
  }

  if (lastSaved) {
    return (
      <SmartTooltip content={`Last saved: ${lastSaved.toLocaleTimeString()}`}>
        <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
          <Cloud className="size-3.5" />
          <span className="hidden sm:inline">Saved</span>
        </div>
      </SmartTooltip>
    );
  }

  return (
    <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
      <CloudOff className="size-3.5" />
      <span className="hidden sm:inline">Not saved</span>
    </div>
  );
}

/* ── Main Header ────────────────────────────────────────────────── */

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
    <div
      className={cn(
        `character-header tier-accent-${tier} animate-fade-up space-y-3`,
        cssClassName
      )}
    >
      {/* Radial gradient background driven by tier */}
      <div className="character-header-bg" />

      {/* Top bar: Back + Save + Campaign */}
      <div className="relative flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="h-8 gap-1 px-2">
          <Link to="/character">
            <ArrowLeft className="size-4" />
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
      <div className="relative flex items-center gap-3 sm:gap-4">
        <LevelBadge level={level} tier={tier} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
              {characterName || 'Untitled Character'}
            </h1>
            {characterTitle && (
              <Badge
                variant="outline"
                className="border-hope/40 bg-hope-muted text-hope-foreground shrink-0 gap-1 text-xs"
              >
                <Sparkles className="size-3" />
                {characterTitle}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-0.5 flex items-center gap-1.5 text-xs sm:text-sm">
            <span
              className="inline-block size-1.5 rounded-full"
              style={{ background: `var(--tier-${tier})` }}
            />
            {tierLabels[tier] ?? 'Adventurer'} · Level {level}
          </p>
        </div>
      </div>

      {/* Dagger divider */}
      <div className="dagger-divider" />

      {/* Status bar */}
      {statusBar}
    </div>
  );
}
