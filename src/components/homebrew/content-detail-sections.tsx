/**
 * Content Detail Section Components
 *
 * Extracted section components for content-detail-views to reduce complexity.
 */
import { Layers, Package, Sparkles, Target } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

// ─────────────────────────────────────────────────────────────────────────────
// Section Header Pill Component
// ─────────────────────────────────────────────────────────────────────────────

interface SectionPillProps {
  children: React.ReactNode;
  color: 'rose' | 'emerald' | 'yellow' | 'violet' | 'amber' | 'indigo' | 'sky';
  icon?: React.ReactNode;
}

const PILL_COLORS = {
  rose: 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300',
  emerald:
    'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  yellow:
    'border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
  violet:
    'border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300',
  amber:
    'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  indigo:
    'border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300',
  sky: 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300',
};

function SectionPill({ children, color, icon }: SectionPillProps) {
  return (
    <div
      className={`mb-3 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${PILL_COLORS[color]}`}
    >
      {icon}
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Class Overview Section
// ─────────────────────────────────────────────────────────────────────────────

interface ClassOverviewSectionProps {
  description: string;
  domains?: string[];
}

export function ClassOverviewSection({
  description,
  domains,
}: ClassOverviewSectionProps) {
  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-rose-700 uppercase dark:text-rose-300">
        Overview
      </div>
      <p className="text-muted-foreground text-sm">{description}</p>
      {domains && domains.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {domains.map(d => (
            <Badge key={d} variant="outline">
              {d}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Class Base Stats Section
// ─────────────────────────────────────────────────────────────────────────────

interface ClassBaseStatsSectionProps {
  startingHitPoints?: number;
  startingEvasion?: number;
}

export function ClassBaseStatsSection({
  startingHitPoints,
  startingEvasion,
}: ClassBaseStatsSectionProps) {
  return (
    <div className="bg-card rounded-lg border p-4">
      <SectionPill color="emerald" icon={<Target className="size-3" />}>
        Base Stats
      </SectionPill>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
          <div className="text-muted-foreground text-sm">Hit Points</div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {startingHitPoints ?? '?'}
          </div>
        </div>
        <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
          <div className="text-muted-foreground text-sm">Evasion</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {startingEvasion ?? '?'}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Class Hope Feature Section
// ─────────────────────────────────────────────────────────────────────────────

interface HopeFeature {
  name: string;
  description: string;
  hopeCost: number;
}

interface ClassHopeFeatureSectionProps {
  hopeFeature: HopeFeature;
}

export function ClassHopeFeatureSection({
  hopeFeature,
}: ClassHopeFeatureSectionProps) {
  return (
    <div className="bg-card rounded-lg border p-4">
      <SectionPill color="yellow" icon={<Sparkles className="size-3" />}>
        Hope Feature
      </SectionPill>
      <div className="bg-muted/50 rounded-lg p-3">
        <div className="mb-1 flex items-center justify-between gap-3">
          <span className="font-semibold text-yellow-700 dark:text-yellow-300">
            {hopeFeature.name}
          </span>
          <Badge className="border-yellow-500/30 bg-yellow-500/15 text-yellow-700 dark:text-yellow-300">
            {hopeFeature.hopeCost} Hope
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          {hopeFeature.description}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Class Features Section
// ─────────────────────────────────────────────────────────────────────────────

interface ClassFeature {
  name: string;
  description: string;
  type?: string;
}

interface ClassFeaturesSectionProps {
  features: ClassFeature[];
}

export function ClassFeaturesSection({ features }: ClassFeaturesSectionProps) {
  if (!features || features.length === 0) return null;

  return (
    <div className="bg-card rounded-lg border p-4">
      <SectionPill color="violet" icon={<Sparkles className="size-3" />}>
        Class Features
      </SectionPill>
      <div className="space-y-2">
        {features.map((feat, i) => (
          <div key={i} className="bg-muted/50 rounded-lg p-3">
            <div className="mb-1 flex items-center gap-2">
              <span className="font-medium">{feat.name}</span>
              {feat.type && (
                <Badge variant="outline" className="text-xs">
                  {feat.type}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm">{feat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Class Items Section
// ─────────────────────────────────────────────────────────────────────────────

interface ClassItemsSectionProps {
  items: string[];
}

export function ClassItemsSection({ items }: ClassItemsSectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-card rounded-lg border p-4">
      <SectionPill color="amber" icon={<Package className="size-3" />}>
        Class Items
      </SectionPill>
      <ul className="text-muted-foreground list-inside list-disc text-sm">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Subclasses Section
// ─────────────────────────────────────────────────────────────────────────────

interface SubclassFeature {
  name: string;
  description: string;
  type?: string;
  level?: number;
  availability?: {
    tier: string;
    minLevel: number;
    unlockCondition?: string;
  };
}

interface Subclass {
  name: string;
  description: string;
  spellcastTrait?: string;
  features?: SubclassFeature[];
}

interface SubclassesSectionProps {
  subclasses: Subclass[];
}

export function SubclassesSection({ subclasses }: SubclassesSectionProps) {
  if (!subclasses || subclasses.length === 0) return null;

  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="mb-3 flex items-center gap-2">
        <SectionPill color="indigo" icon={<Layers className="size-3" />}>
          Subclasses
        </SectionPill>
        <Badge variant="outline">{subclasses.length}</Badge>
      </div>
      <div className="space-y-4">
        {subclasses.map((sub, i) => (
          <SubclassCard key={i} subclass={sub} />
        ))}
      </div>
    </div>
  );
}

function SubclassCard({ subclass }: { subclass: Subclass }) {
  return (
    <div className="bg-muted/30 rounded-lg border p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-semibold">{subclass.name}</span>
        {subclass.spellcastTrait && (
          <Badge variant="outline" className="text-xs">
            Spellcast: {subclass.spellcastTrait}
          </Badge>
        )}
      </div>
      <p className="text-muted-foreground mb-3 text-sm">
        {subclass.description}
      </p>
      {subclass.features && subclass.features.length > 0 && (
        <div className="space-y-2">
          {subclass.features.map((feat, j) => (
            <SubclassFeatureItem key={j} feature={feat} />
          ))}
        </div>
      )}
    </div>
  );
}

function SubclassFeatureItem({ feature }: { feature: SubclassFeature }) {
  return (
    <div className="bg-background/50 rounded border-l-2 border-l-indigo-500/50 p-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">{feature.name}</span>
        {feature.level != null && (
          <Badge variant="outline" className="py-0 text-[10px]">
            Lvl {feature.level}
          </Badge>
        )}
        {feature.type && (
          <Badge variant="outline" className="py-0 text-[10px]">
            {feature.type}
          </Badge>
        )}
        {feature.availability && (
          <Badge variant="secondary" className="py-0 text-[10px]">
            {feature.availability.unlockCondition ??
              `Tier ${feature.availability.tier}`}
          </Badge>
        )}
      </div>
      <p className="text-muted-foreground mt-1 text-xs">
        {feature.description}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Background Questions Section
// ─────────────────────────────────────────────────────────────────────────────

interface BackgroundQuestionsSectionProps {
  questions: string[];
}

export function BackgroundQuestionsSection({
  questions,
}: BackgroundQuestionsSectionProps) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="bg-card rounded-lg border p-4">
      <SectionPill color="sky">Background Questions</SectionPill>
      <ul className="text-muted-foreground list-inside list-decimal space-y-1 text-sm">
        {questions.map((q, i) => (
          <li key={i}>{q}</li>
        ))}
      </ul>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Connections Section
// ─────────────────────────────────────────────────────────────────────────────

interface ConnectionsSectionProps {
  connections: string[];
}

export function ConnectionsSection({ connections }: ConnectionsSectionProps) {
  if (!connections || connections.length === 0) return null;

  return (
    <div className="bg-card rounded-lg border p-4">
      <SectionPill color="rose">Connections</SectionPill>
      <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
        {connections.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
    </div>
  );
}
