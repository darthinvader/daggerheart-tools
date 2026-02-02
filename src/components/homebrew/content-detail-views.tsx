/**
 * Shared Content Detail Views
 *
 * These components display detailed information for different content types.
 * Used by both the Official Content Browser and Homebrew View Dialog.
 */
import {
  AlertTriangle,
  BookOpen,
  Brain,
  Heart,
  Home,
  Layers,
  Package,
  Sparkles,
  Swords,
  Target,
  TreePine,
  Users,
  Zap,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import type { Adversary } from '@/lib/schemas/adversaries';
import type { DomainCard } from '@/lib/schemas/domains';
import type { Environment } from '@/lib/schemas/environments';
import type { HomebrewContentType } from '@/lib/schemas/homebrew';
import { getCardCosts } from '@/lib/utils/card-costs';

// ========== COLOR CONSTANTS ==========

export const levelColors: Record<number, string> = {
  1: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
  2: 'bg-sky-500/20 text-sky-700 dark:text-sky-300',
  3: 'bg-violet-500/20 text-violet-700 dark:text-violet-300',
  4: 'bg-amber-500/20 text-amber-700 dark:text-amber-300',
  5: 'bg-rose-500/20 text-rose-700 dark:text-rose-300',
  6: 'bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-300',
  7: 'bg-red-500/20 text-red-700 dark:text-red-300',
  8: 'bg-orange-500/20 text-orange-700 dark:text-orange-300',
  9: 'bg-pink-500/20 text-pink-700 dark:text-pink-300',
  10: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300',
};

// ========== HELPER FUNCTIONS ==========

export function formatThresholds(
  thresholds:
    | string
    | { major?: number | null; severe?: number | null; massive?: number | null }
    | undefined
): string {
  if (!thresholds) return '-';
  if (typeof thresholds === 'string') return thresholds;
  const parts = [];
  if (thresholds.major != null) parts.push(thresholds.major);
  if (thresholds.severe != null) parts.push(thresholds.severe);
  if (thresholds.massive != null) parts.push(thresholds.massive);
  return parts.join('/') || '-';
}

export function formatFeature(
  feature: string | { name: string; type?: string; description: string }
): string {
  if (typeof feature === 'string') return feature;
  const type = feature.type ? `${feature.type}: ` : '';
  return `${feature.name} — ${type}${feature.description}`;
}

// ========== DETAIL COMPONENTS ==========

export function AdversaryDetail({ adv }: { adv: Adversary }) {
  return (
    <div className="space-y-4">
      {/* Overview */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-rose-700 uppercase dark:text-rose-300">
          <Skull className="size-3" />
          Overview
        </div>
        <p className="text-muted-foreground text-sm">{adv.description}</p>
      </div>

      {/* Motives & Tactics */}
      {adv.motivesAndTactics && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-blue-700 uppercase dark:text-blue-300">
            <Brain className="size-3" />
            Motives & Tactics
          </div>
          <p className="text-muted-foreground text-sm">
            {adv.motivesAndTactics}
          </p>
        </div>
      )}

      {/* Core Stats */}
      <div className="bg-muted/40 text-muted-foreground grid grid-cols-2 gap-3 rounded-lg border p-4 text-sm">
        <div className="col-span-2 mb-1">
          <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
            <Target className="size-3" />
            Core Stats
          </div>
        </div>
        <div>
          <span className="font-semibold">Difficulty</span> {adv.difficulty}
        </div>
        <div>
          <span className="font-semibold">Thresholds</span>{' '}
          {formatThresholds(adv.thresholds)}
        </div>
        <div>
          <Heart className="mr-1 inline size-3" />
          <span className="font-semibold">HP</span> {adv.hp}
        </div>
        <div>
          <AlertTriangle className="mr-1 inline size-3" />
          <span className="font-semibold">Stress</span> {adv.stress}
        </div>
      </div>

      {/* Attack */}
      {adv.attack && (
        <div className="rounded-lg border border-red-500/30 bg-gradient-to-r from-red-500/10 to-rose-500/10 p-4">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-red-700 uppercase dark:text-red-300">
            <Swords className="size-3" />
            Attack
          </div>
          <p className="text-sm">
            <span className="font-semibold">{adv.attack.modifier}</span>{' '}
            {adv.attack.name} · {adv.attack.range} · {adv.attack.damage}
          </p>
        </div>
      )}

      {/* Experiences */}
      {adv.experiences && adv.experiences.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-violet-700 uppercase dark:text-violet-300">
            <Brain className="size-3" />
            Experiences
          </div>
          <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
            {adv.experiences.map((exp, i) => (
              <li key={i}>
                {typeof exp === 'string' ? exp : `${exp.name} +${exp.bonus}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Features */}
      {adv.features && adv.features.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-300">
            <Sparkles className="size-3" />
            Features
          </div>
          <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
            {adv.features.map((feat, i) => (
              <li key={i}>{formatFeature(feat)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Skull icon isn't imported, let's add it
import { Skull } from 'lucide-react';

export function EnvironmentDetail({ env }: { env: Environment }) {
  return (
    <div className="space-y-4">
      {/* Overview */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
          <TreePine className="size-3" />
          Overview
        </div>
        <p className="text-muted-foreground text-sm">{env.description}</p>
      </div>

      {/* Scene Stats */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-sky-700 uppercase dark:text-sky-300">
          <Target className="size-3" />
          Scene Stats
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">Difficulty</span> {env.difficulty}
          </div>
          <div>
            <span className="font-semibold">Type</span> {env.type}
          </div>
        </div>
      </div>

      {/* Impulses */}
      {env.impulses.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
            <Brain className="size-3" />
            Impulses
          </div>
          <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
            {env.impulses.map((imp, i) => (
              <li key={i}>{imp}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Potential Adversaries */}
      {env.potentialAdversaries.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-rose-700 uppercase dark:text-rose-300">
            <Swords className="size-3" />
            Potential Adversaries
          </div>
          <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
            {env.potentialAdversaries.map((adv, i) => (
              <li key={i}>{adv}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Features */}
      {env.features.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-300">
            <Sparkles className="size-3" />
            Features
          </div>
          <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
            {env.features.map((feat, i) => (
              <li key={i}>{formatFeature(feat)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function DomainCardDetail({ card }: { card: DomainCard }) {
  const costs = getCardCosts(card);
  const hopeCosts = costs.activationCosts.filter(c => c.type === 'Hope');
  const stressCosts = costs.activationCosts.filter(c => c.type === 'Stress');

  return (
    <div className="space-y-4">
      {/* Card Info */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-violet-700 uppercase dark:text-violet-300">
          <Sparkles className="size-3" />
          Card Details
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-3">
            <div className="text-muted-foreground text-xs">Level</div>
            <div className="text-xl font-bold text-indigo-700 dark:text-indigo-400">
              {card.level}
            </div>
          </div>
          <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-3">
            <div className="text-muted-foreground text-xs">Domain</div>
            <div className="text-sm font-semibold text-purple-700 dark:text-purple-400">
              {card.domain}
            </div>
          </div>
          <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3">
            <div className="text-muted-foreground text-xs">Type</div>
            <div className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">
              {card.type}
            </div>
          </div>
        </div>
      </div>

      {/* Costs */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-rose-700 uppercase dark:text-rose-300">
          <Zap className="size-3" />
          Costs
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="min-w-20 flex-1 rounded-lg border border-sky-500/30 bg-sky-500/10 p-3">
            <div className="text-muted-foreground text-xs">Recall Cost</div>
            <div className="text-lg font-bold text-sky-700 dark:text-sky-400">
              {costs.recallCost}
            </div>
          </div>
          {hopeCosts.length > 0 && (
            <div className="min-w-20 flex-1 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
              <div className="text-muted-foreground text-xs">
                Activation (Hope)
              </div>
              <div className="text-lg font-bold text-amber-700 dark:text-amber-400">
                {hopeCosts
                  .map(c => (c.amount === 'any' ? 'X' : c.amount))
                  .join(' + ')}
              </div>
            </div>
          )}
          {stressCosts.length > 0 && (
            <div className="min-w-20 flex-1 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
              <div className="text-muted-foreground text-xs">
                Activation (Stress)
              </div>
              <div className="text-lg font-bold text-red-700 dark:text-red-400">
                {stressCosts.reduce(
                  (sum, c) => sum + (c.amount === 'any' ? 0 : c.amount),
                  0
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-sky-700 uppercase dark:text-sky-300">
          <BookOpen className="size-3" />
          Effect
        </div>
        <p className="text-sm leading-relaxed whitespace-pre-line">
          {card.description}
        </p>
      </div>

      {/* Tags */}
      {card.tags && card.tags.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-teal-500/30 bg-teal-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-teal-700 uppercase dark:text-teal-300">
            Tags
          </div>
          <div className="flex flex-wrap gap-2">
            {card.tags.map((tag, i) => (
              <Badge
                key={i}
                variant="outline"
                className="border-teal-500/30 bg-teal-500/10 text-teal-700 dark:text-teal-300"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ClassDetail({ raw }: { raw: unknown }) {
  const cls = raw as {
    name: string;
    description: string;
    domains?: string[];
    startingHitPoints?: number;
    startingEvasion?: number;
    hopeFeature?: { name: string; description: string; hopeCost: number };
    classFeatures?: Array<{ name: string; description: string; type?: string }>;
    classItems?: string[];
    backgroundQuestions?: string[];
    connections?: string[];
    subclasses?: Array<{
      name: string;
      description: string;
      spellcastTrait?: string;
      features?: Array<{
        name: string;
        description: string;
        type?: string;
        level?: number;
        availability?: {
          tier: string;
          minLevel: number;
          unlockCondition?: string;
        };
      }>;
    }>;
  };

  return (
    <div className="space-y-4">
      {/* Overview */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-rose-700 uppercase dark:text-rose-300">
          Overview
        </div>
        <p className="text-muted-foreground text-sm">{cls.description}</p>
        {cls.domains && cls.domains.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {cls.domains.map(d => (
              <Badge key={d} variant="outline">
                {d}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Base Stats */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
          <Target className="size-3" />
          Base Stats
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
            <div className="text-muted-foreground text-sm">Hit Points</div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {cls.startingHitPoints ?? '?'}
            </div>
          </div>
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
            <div className="text-muted-foreground text-sm">Evasion</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {cls.startingEvasion ?? '?'}
            </div>
          </div>
        </div>
      </div>

      {/* Hope Feature */}
      {cls.hopeFeature && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-yellow-700 uppercase dark:text-yellow-300">
            <Sparkles className="size-3" />
            Hope Feature
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="mb-1 flex items-center justify-between gap-3">
              <span className="font-semibold text-yellow-700 dark:text-yellow-300">
                {cls.hopeFeature.name}
              </span>
              <Badge className="border-yellow-500/30 bg-yellow-500/15 text-yellow-700 dark:text-yellow-300">
                {cls.hopeFeature.hopeCost} Hope
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              {cls.hopeFeature.description}
            </p>
          </div>
        </div>
      )}

      {/* Class Features */}
      {cls.classFeatures && cls.classFeatures.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-violet-700 uppercase dark:text-violet-300">
            <Sparkles className="size-3" />
            Class Features
          </div>
          <div className="space-y-2">
            {cls.classFeatures.map((feat, i) => (
              <div key={i} className="bg-muted/50 rounded-lg p-3">
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-medium">{feat.name}</span>
                  {feat.type && (
                    <Badge variant="outline" className="text-xs">
                      {feat.type}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-sm">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Class Items */}
      {cls.classItems && cls.classItems.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-300">
            <Package className="size-3" />
            Class Items
          </div>
          <ul className="text-muted-foreground list-inside list-disc text-sm">
            {cls.classItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Subclasses */}
      {cls.subclasses && cls.subclasses.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-indigo-700 uppercase dark:text-indigo-300">
              <Layers className="size-3" />
              Subclasses
            </div>
            <Badge variant="outline">{cls.subclasses.length}</Badge>
          </div>
          <div className="space-y-4">
            {cls.subclasses.map((sub, i) => (
              <div key={i} className="bg-muted/30 rounded-lg border p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="font-semibold">{sub.name}</span>
                  {sub.spellcastTrait && (
                    <Badge variant="outline" className="text-xs">
                      Spellcast: {sub.spellcastTrait}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-3 text-sm">
                  {sub.description}
                </p>
                {sub.features && sub.features.length > 0 && (
                  <div className="space-y-2">
                    {sub.features.map((feat, j) => (
                      <div
                        key={j}
                        className="bg-background/50 rounded border-l-2 border-l-indigo-500/50 p-2"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium">
                            {feat.name}
                          </span>
                          {feat.level != null && (
                            <Badge
                              variant="outline"
                              className="py-0 text-[10px]"
                            >
                              Lvl {feat.level}
                            </Badge>
                          )}
                          {feat.type && (
                            <Badge
                              variant="outline"
                              className="py-0 text-[10px]"
                            >
                              {feat.type}
                            </Badge>
                          )}
                          {feat.availability && (
                            <Badge
                              variant="secondary"
                              className="py-0 text-[10px]"
                            >
                              {feat.availability.unlockCondition ??
                                `Tier ${feat.availability.tier}`}
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mt-1 text-xs">
                          {feat.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Background Questions */}
      {cls.backgroundQuestions && cls.backgroundQuestions.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-sky-700 uppercase dark:text-sky-300">
            Background Questions
          </div>
          <ul className="text-muted-foreground list-inside list-decimal space-y-1 text-sm">
            {cls.backgroundQuestions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Connections */}
      {cls.connections && cls.connections.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-rose-700 uppercase dark:text-rose-300">
            Connections
          </div>
          <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
            {cls.connections.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function SubclassDetail({ raw }: { raw: unknown }) {
  const sub = raw as {
    name: string;
    description: string;
    parentClass?: string;
    spellcastTrait?: string;
    features?: Array<{
      name: string;
      description: string;
      type?: string;
      level?: number;
      availability?: {
        tier: string;
        minLevel: number;
        unlockCondition?: string;
      };
    }>;
  };

  return (
    <div className="space-y-4">
      {/* Overview */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-rose-700 uppercase dark:text-rose-300">
          Overview
        </div>
        <p className="text-muted-foreground text-sm">{sub.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {sub.parentClass && (
            <Badge variant="outline">{sub.parentClass}</Badge>
          )}
          {sub.spellcastTrait && (
            <Badge variant="secondary">Spellcast: {sub.spellcastTrait}</Badge>
          )}
        </div>
      </div>

      {/* Features */}
      {sub.features && sub.features.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-violet-700 uppercase dark:text-violet-300">
            <Sparkles className="size-3" />
            Features
          </div>
          <div className="space-y-2">
            {sub.features.map((feat, i) => (
              <div
                key={i}
                className="bg-muted/50 rounded-lg border-l-4 border-l-violet-500/50 p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{feat.name}</span>
                  {feat.level != null && (
                    <Badge
                      className={`py-0 text-xs ${levelColors[feat.level] ?? ''}`}
                    >
                      Level {feat.level}
                    </Badge>
                  )}
                  {feat.type && (
                    <Badge variant="outline" className="text-xs">
                      {feat.type}
                    </Badge>
                  )}
                  {feat.availability && (
                    <Badge variant="secondary" className="text-xs">
                      {feat.availability.unlockCondition ??
                        `Tier ${feat.availability.tier}`}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function AncestryDetail({ raw }: { raw: unknown }) {
  const anc = raw as {
    name: string;
    description: string;
    heightRange?: string;
    lifespan?: string;
    physicalCharacteristics?: string[];
    primaryFeature?: { name: string; description: string; type?: string };
    secondaryFeature?: { name: string; description: string; type?: string };
  };

  return (
    <div className="space-y-4">
      {/* Overview */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-rose-700 uppercase dark:text-rose-300">
          Overview
        </div>
        <p className="text-muted-foreground text-sm">{anc.description}</p>
        {(anc.heightRange || anc.lifespan) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {anc.heightRange && (
              <Badge variant="outline">{anc.heightRange}</Badge>
            )}
            {anc.lifespan && <Badge variant="outline">{anc.lifespan}</Badge>}
          </div>
        )}
      </div>

      {/* Physical Characteristics */}
      {anc.physicalCharacteristics &&
        anc.physicalCharacteristics.length > 0 && (
          <div className="bg-card rounded-lg border p-4">
            <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
              <Users className="size-3" />
              Physical Characteristics
            </div>
            <div className="flex flex-wrap gap-2">
              {anc.physicalCharacteristics.map((char, i) => (
                <Badge key={i} variant="outline" className="bg-muted/50">
                  {char}
                </Badge>
              ))}
            </div>
          </div>
        )}

      {/* Primary Feature */}
      {anc.primaryFeature && (
        <div className="rounded-lg border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-4">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-300">
            Primary Feature
          </div>
          <h4 className="mb-2 font-semibold">{anc.primaryFeature.name}</h4>
          <p className="text-muted-foreground text-sm">
            {anc.primaryFeature.description}
          </p>
        </div>
      )}

      {/* Secondary Feature */}
      {anc.secondaryFeature && (
        <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-4">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-cyan-700 uppercase dark:text-cyan-300">
            Secondary Feature
          </div>
          <h4 className="mb-2 font-semibold">{anc.secondaryFeature.name}</h4>
          <p className="text-muted-foreground text-sm">
            {anc.secondaryFeature.description}
          </p>
        </div>
      )}
    </div>
  );
}

export function CommunityDetail({ raw }: { raw: unknown }) {
  const comm = raw as {
    name: string;
    description: string;
    commonTraits?: string[];
    feature?: { name: string; description: string };
  };

  return (
    <div className="space-y-4">
      {/* Overview */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-rose-700 uppercase dark:text-rose-300">
          Overview
        </div>
        <p className="text-muted-foreground text-sm">{comm.description}</p>
      </div>

      {/* Common Traits */}
      {comm.commonTraits && comm.commonTraits.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
            <Home className="size-3" />
            Common Traits
          </div>
          <div className="flex flex-wrap gap-2">
            {comm.commonTraits.map((trait, i) => (
              <Badge
                key={i}
                variant="outline"
                className="border-teal-500/30 bg-teal-500/10 text-teal-700 capitalize dark:text-teal-300"
              >
                {trait}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Community Feature */}
      {comm.feature && (
        <div className="rounded-lg border border-teal-500/30 bg-teal-500/10 p-4">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-teal-500/30 bg-teal-500/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-teal-700 uppercase dark:text-teal-300">
            Community Feature
          </div>
          <h4 className="mb-2 font-semibold">{comm.feature.name}</h4>
          <p className="text-muted-foreground text-sm">
            {comm.feature.description}
          </p>
        </div>
      )}
    </div>
  );
}

export function EquipmentDetail({ raw }: { raw: unknown }) {
  const equip = raw as {
    name: string;
    tier?: string;
    type?: string;
    trait?: string;
    range?: string;
    burden?: number;
    damage?: {
      diceType?: string;
      count?: number;
      modifier?: number;
      type?: string;
    };
    features?: Array<{ name: string; description: string }>;
    slots?: number;
    baseScore?: number;
  };

  const formatDamage = () => {
    if (!equip.damage) return null;
    const { count = 1, diceType, modifier = 0, type } = equip.damage;
    let dmg = `${count}${diceType}`;
    if (modifier > 0) dmg += ` + ${modifier}`;
    if (modifier < 0) dmg += ` - ${Math.abs(modifier)}`;
    if (type) dmg += ` ${type}`;
    return dmg;
  };

  const damageString = formatDamage();

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="bg-muted/40 grid grid-cols-2 gap-3 rounded-lg border p-4 text-sm">
        {equip.tier && (
          <div className="rounded-lg border p-3">
            <div className="text-muted-foreground text-xs">Tier</div>
            <div className="font-semibold">{equip.tier}</div>
          </div>
        )}
        {equip.type && (
          <div className="rounded-lg border p-3">
            <div className="text-muted-foreground text-xs">Type</div>
            <div className="font-semibold">{equip.type}</div>
          </div>
        )}
        {equip.trait && (
          <div className="rounded-lg border p-3">
            <div className="text-muted-foreground text-xs">Trait</div>
            <div className="font-semibold">{equip.trait}</div>
          </div>
        )}
        {equip.range && (
          <div className="rounded-lg border p-3">
            <div className="text-muted-foreground text-xs">Range</div>
            <div className="font-semibold">{equip.range}</div>
          </div>
        )}
        {equip.burden != null && (
          <div className="rounded-lg border p-3">
            <div className="text-muted-foreground text-xs">Burden</div>
            <div className="font-semibold">{equip.burden}</div>
          </div>
        )}
        {equip.slots != null && (
          <div className="rounded-lg border p-3">
            <div className="text-muted-foreground text-xs">Slots</div>
            <div className="font-semibold">{equip.slots}</div>
          </div>
        )}
        {equip.baseScore != null && (
          <div className="rounded-lg border p-3">
            <div className="text-muted-foreground text-xs">Base Score</div>
            <div className="font-semibold">{equip.baseScore}</div>
          </div>
        )}
      </div>

      {/* Damage */}
      {damageString && (
        <div className="rounded-lg border border-red-500/30 bg-gradient-to-r from-red-500/10 to-rose-500/10 p-4">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-red-700 uppercase dark:text-red-300">
            <Swords className="size-3" />
            Damage
          </div>
          <div className="text-lg font-bold text-red-700 dark:text-red-400">
            {damageString}
          </div>
        </div>
      )}

      {/* Features */}
      {equip.features && equip.features.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-300">
            <Sparkles className="size-3" />
            Features
          </div>
          <div className="space-y-2">
            {equip.features.map((feat, i) => (
              <div
                key={i}
                className="bg-muted/50 rounded border-l-4 border-l-amber-500/50 p-3"
              >
                <div className="font-medium">{feat.name}</div>
                <p className="text-muted-foreground mt-1 text-sm">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ItemDetail({ raw }: { raw: unknown }) {
  const item = raw as {
    name: string;
    tier?: string;
    rarity?: string;
    effect?: string;
    features?: Array<{ name: string; description: string }>;
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      {(item.tier || item.rarity) && (
        <div className="bg-muted/40 flex flex-wrap gap-3 rounded-lg border p-4 text-sm">
          {item.tier && (
            <div className="rounded-lg border p-3">
              <div className="text-muted-foreground text-xs">Tier</div>
              <div className="font-semibold">{item.tier}</div>
            </div>
          )}
          {item.rarity && (
            <div className="rounded-lg border p-3">
              <div className="text-muted-foreground text-xs">Rarity</div>
              <div className="font-semibold capitalize">{item.rarity}</div>
            </div>
          )}
        </div>
      )}

      {/* Effect */}
      {item.effect && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-cyan-700 uppercase dark:text-cyan-300">
            Effect
          </div>
          <p className="text-sm">{item.effect}</p>
        </div>
      )}

      {/* Features */}
      {item.features && item.features.length > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-300">
            <Sparkles className="size-3" />
            Features
          </div>
          <div className="space-y-2">
            {item.features.map((feat, i) => (
              <div
                key={i}
                className="bg-muted/50 rounded border-l-4 border-l-amber-500/50 p-3"
              >
                <div className="font-medium">{feat.name}</div>
                <p className="text-muted-foreground mt-1 text-sm">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ========== UNIFIED CONTENT DETAIL ROUTER ==========

export interface ContentDetailProps {
  contentType: HomebrewContentType;
  rawData: unknown;
}

/**
 * Unified component that renders the appropriate detail view based on content type.
 * Used by both the official content browser and homebrew view dialog.
 */
export function ContentDetail({ contentType, rawData }: ContentDetailProps) {
  switch (contentType) {
    case 'adversary':
      return <AdversaryDetail adv={rawData as Adversary} />;
    case 'environment':
      return <EnvironmentDetail env={rawData as Environment} />;
    case 'domain_card':
      return <DomainCardDetail card={rawData as DomainCard} />;
    case 'class':
      return <ClassDetail raw={rawData} />;
    case 'subclass':
      return <SubclassDetail raw={rawData} />;
    case 'ancestry':
      return <AncestryDetail raw={rawData} />;
    case 'community':
      return <CommunityDetail raw={rawData} />;
    case 'equipment':
      return <EquipmentDetail raw={rawData} />;
    case 'item':
      return <ItemDetail raw={rawData} />;
    default:
      return <GenericDetail raw={rawData} />;
  }
}

/** Fallback detail for unknown content types */
function GenericDetail({ raw }: { raw: unknown }) {
  const data = raw as Record<string, unknown>;
  const description =
    typeof data.description === 'string' ? data.description : null;

  return (
    <div className="space-y-4">
      {description && (
        <div className="bg-card rounded-lg border p-4">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-slate-500/30 bg-slate-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-slate-700 uppercase dark:text-slate-300">
            Description
          </div>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      )}
    </div>
  );
}
