/**
 * Adversary Detail Panel - Shows full stats for a selected adversary
 * Used in Fight Builder wizard and other dialogs
 */
import {
  AlertTriangle,
  Brain,
  Compass,
  Heart,
  Layers,
  Sparkles,
  Swords,
  Target,
  X,
} from 'lucide-react';
import { useRef, useState } from 'react';

import { TooltipLabel } from '@/components/shared/tooltip-label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Adversary } from '@/lib/schemas/adversaries';

import {
  ROLE_CARD_COLORS,
  ROLE_ICONS,
  ROLE_POINT_COSTS,
  TIER_COLORS,
} from './adversary-card-shared';
import TierScalingControls from './tier-scaling-controls';

// ============== Role Descriptions ==============

const ROLE_DESCRIPTIONS: Record<string, string> = {
  Solo: 'A powerful single adversary worth 4 battle points. Designed to challenge the entire party alone.',
  Leader:
    'Commands other adversaries. Worth 3 battle points. Often buffs or coordinates minions.',
  Bruiser:
    'Heavy hitter with high damage output. Worth 2 battle points. Prioritizes damage over defense.',
  Standard:
    'A well-rounded adversary. Worth 2 battle points. Balanced stats and abilities.',
  Support:
    'Provides buffs, healing, or control. Worth 2 battle points. Enhances other adversaries.',
  Ranged:
    'Attacks from distance. Worth 2 battle points. Prefers to stay away from melee.',
  Skulk: 'Sneaky and evasive. Worth 2 battle points. Uses hit-and-run tactics.',
  Social:
    'Focused on non-combat interactions. Worth 2 battle points. May avoid direct conflict.',
  Horde:
    'Weak individually but dangerous in groups. Worth 1 battle point. Swarm tactics.',
  Minion:
    'Fodder enemies. Worth 1 battle point. Easily defeated but can overwhelm.',
};

// ============== Helper Functions ==============

function formatThresholds(thresholds: Adversary['thresholds']): string {
  if (typeof thresholds === 'string') return thresholds;
  const major = thresholds.major ?? '—';
  const severe = thresholds.severe ?? '—';
  const massive =
    typeof thresholds.massive === 'number'
      ? thresholds.massive
      : typeof thresholds.severe === 'number'
        ? thresholds.severe * 2
        : '—';
  return `${major} / ${severe} / ${massive}`;
}

function formatExperience(exp: Adversary['experiences'][number]): string {
  if (typeof exp === 'string') return exp;
  const bonus = exp.bonus >= 0 ? `+${exp.bonus}` : `${exp.bonus}`;
  const description = exp.description ? ` — ${exp.description}` : '';
  return `${exp.name} ${bonus}${description}`;
}

function formatFeature(feature: Adversary['features'][number]): {
  name: string;
  type: string;
  description: string;
} {
  if (typeof feature === 'string') {
    const parts = feature.split(' — ');
    return {
      name: parts[0] ?? feature,
      type: 'Feature',
      description: parts[1] ?? '',
    };
  }
  return {
    name: feature.name,
    type: feature.type ?? 'Feature',
    description: feature.description ?? '',
  };
}

// ============== Stat Card ==============

function StatCard({
  icon: Icon,
  label,
  value,
  tooltip,
  colorClass,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  tooltip: string;
  colorClass: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="bg-card hover:bg-accent/50 cursor-help rounded-lg border p-3 text-center transition-colors">
            <Icon className={`mx-auto mb-1 size-4 ${colorClass}`} />
            <p className={`text-lg font-bold ${colorClass}`}>{value}</p>
            <p className="text-muted-foreground text-xs">{label}</p>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ============== Feature Type Badge Colors ==============

const FEATURE_TYPE_COLORS: Record<string, string> = {
  Passive: 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30',
  Action:
    'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30',
  Reaction:
    'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30',
  Feature:
    'bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30',
};

// ============== Empty State Component ==============

function EmptyDetailPanel() {
  return (
    <div className="bg-muted/30 flex min-h-0 w-96 shrink-0 flex-col overflow-hidden border-l">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="font-semibold">Adversary Details</h3>
      </div>
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="text-muted-foreground text-center">
          <Target className="mx-auto mb-2 size-8 opacity-50" />
          <p className="text-sm">Click an adversary to view details</p>
        </div>
      </div>
    </div>
  );
}

// ============== Header Component ==============

const DEFAULT_ROLE_COLORS = {
  border: 'border-gray-500',
  bg: 'bg-gray-500/5',
  badge: 'bg-gray-500/20 text-gray-700',
};

function getRoleColors(role: string) {
  return ROLE_CARD_COLORS[role] ?? DEFAULT_ROLE_COLORS;
}

function getBattlePointsLabel(pointCost: number) {
  return pointCost === 1 ? '1 Battle Pt' : `${pointCost} Battle Pts`;
}

function DetailPanelHeader({
  adversary,
  onClose,
}: {
  adversary: Adversary;
  onClose: () => void;
}) {
  const roleColors = getRoleColors(adversary.role);
  const pointCost = ROLE_POINT_COSTS[adversary.role] ?? 2;
  const roleIcon = ROLE_ICONS[adversary.role] ?? '⚔️';
  const tierColor = TIER_COLORS[adversary.tier] ?? '';

  return (
    <div className={`shrink-0 border-b ${roleColors.bg}`}>
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="truncate font-semibold">{adversary.name}</h3>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 shrink-0"
          onClick={onClose}
        >
          <X className="size-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-1.5 px-4 pb-3">
        <Badge className={`text-xs ${roleColors.badge}`}>
          {roleIcon} {adversary.role}
        </Badge>
        <Badge className={`text-xs ${tierColor}`}>Tier {adversary.tier}</Badge>
        <Badge variant="secondary" className="text-xs">
          {getBattlePointsLabel(pointCost)}
        </Badge>
      </div>
    </div>
  );
}

// ============== Role Description Component ==============

function RoleDescriptionCard({ adversary }: { adversary: Adversary }) {
  const roleDescription = ROLE_DESCRIPTIONS[adversary.role] ?? '';
  const roleIcon = ROLE_ICONS[adversary.role];

  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
      <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
        {roleIcon} {adversary.role} Role
      </p>
      <p className="text-muted-foreground mt-1 text-xs">{roleDescription}</p>
    </div>
  );
}

// ============== Stats Grid Component ==============

function StatsGrid({ adversary }: { adversary: Adversary }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <StatCard
        icon={Heart}
        label="HP"
        value={adversary.hp}
        tooltip="Hit Points - damage needed to defeat"
        colorClass="text-red-500"
      />
      <StatCard
        icon={AlertTriangle}
        label="Stress"
        value={adversary.stress}
        tooltip="Stress track for special actions"
        colorClass="text-amber-500"
      />
      <StatCard
        icon={Target}
        label="Difficulty"
        value={adversary.difficulty}
        tooltip="Target number to hit this adversary"
        colorClass="text-blue-500"
      />
      <StatCard
        icon={Layers}
        label="Thresholds"
        value={formatThresholds(adversary.thresholds)}
        tooltip="Major/Severe/Massive damage thresholds"
        colorClass="text-purple-500"
      />
    </div>
  );
}

// ============== Attack Section Component ==============

function AttackSection({ attack }: { attack: Adversary['attack'] }) {
  return (
    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
      <div className="mb-2 flex items-center gap-2">
        <Swords className="size-4 text-red-500" />
        <span className="text-sm font-medium">Attack</span>
      </div>
      <p className="text-sm font-medium">{attack.name}</p>
      <p className="text-muted-foreground mt-1 text-xs">
        {attack.modifier} · {attack.range} · {attack.damage}
      </p>
    </div>
  );
}

// ============== Motives & Tactics Component ==============

function MotivesTacticsSection({
  motivesAndTactics,
}: {
  motivesAndTactics: string | undefined;
}) {
  if (!motivesAndTactics) return null;

  return (
    <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3">
      <div className="mb-2 flex items-center gap-2">
        <Compass className="size-4 text-cyan-500" />
        <span className="text-sm font-medium">Motives & Tactics</span>
      </div>
      <p className="text-muted-foreground text-xs">{motivesAndTactics}</p>
    </div>
  );
}

// ============== Experiences Section Component ==============

function ExperiencesSection({
  experiences,
}: {
  experiences: Adversary['experiences'];
}) {
  if (experiences.length === 0) return null;

  return (
    <div>
      <TooltipLabel
        label="Experiences"
        labelIcon={Brain}
        tooltip="Training or background bonuses"
        className="mb-2 text-sm font-medium"
      />
      <div className="flex flex-wrap gap-1">
        {experiences.map((exp, i) => (
          <Badge key={i} variant="secondary" className="text-xs">
            {formatExperience(exp)}
          </Badge>
        ))}
      </div>
    </div>
  );
}

// ============== Feature Item Component ==============

function FeatureItem({ feature }: { feature: Adversary['features'][number] }) {
  const { name, type, description } = formatFeature(feature);
  const badgeColor = FEATURE_TYPE_COLORS[type] ?? FEATURE_TYPE_COLORS.Feature;

  return (
    <li className="bg-background/50 rounded-md border p-2">
      <div className="mb-1 flex items-center gap-2">
        <Badge className={`text-xs ${badgeColor}`}>{type}</Badge>
        <span className="text-sm font-medium">{name}</span>
      </div>
      {description && (
        <p className="text-muted-foreground text-xs leading-relaxed">
          {description}
        </p>
      )}
    </li>
  );
}

// ============== Features Section Component ==============

function FeaturesSection({ features }: { features: Adversary['features'] }) {
  if (features.length === 0) return null;

  return (
    <div>
      <TooltipLabel
        label={`Features (${features.length})`}
        labelIcon={Sparkles}
        tooltip="Special abilities, actions, and reactions"
        className="mb-2 text-sm font-medium"
      />
      <ul className="space-y-2">
        {features.map((f, i) => (
          <FeatureItem key={i} feature={f} />
        ))}
      </ul>
    </div>
  );
}

// ============== Footer Component ==============

function AddToEncounterFooter({
  onAdd,
  adversary,
  canAdd,
}: {
  onAdd: ((adversary: Adversary) => void) | undefined;
  adversary: Adversary;
  canAdd: boolean;
}) {
  if (!onAdd) return null;

  return (
    <div className="shrink-0 border-t p-4">
      <Button
        className="w-full gap-2"
        onClick={() => onAdd(adversary)}
        disabled={!canAdd}
      >
        <Swords className="size-4" />
        Add to Encounter
      </Button>
    </div>
  );
}

// ============== Main Component ==============

interface AdversaryDetailPanelProps {
  adversary: Adversary | null;
  onClose: () => void;
  onAdd?: (adversary: Adversary) => void;
  canAdd?: boolean;
}

export function AdversaryDetailPanel({
  adversary,
  onClose,
  onAdd,
  canAdd = true,
}: AdversaryDetailPanelProps) {
  const [tierOverride, setTierOverride] = useState<number | undefined>();
  const prevAdversaryRef = useRef(adversary?.name);

  // Reset tier override when switching adversaries (adjust state during render)
  if (prevAdversaryRef.current !== adversary?.name) {
    prevAdversaryRef.current = adversary?.name;
    setTierOverride(undefined);
  }

  if (!adversary) {
    return <EmptyDetailPanel />;
  }

  const handleTierChange = (newTier: number) => {
    setTierOverride(newTier === Number(adversary.tier) ? undefined : newTier);
  };

  return (
    <div className="flex min-h-0 w-96 shrink-0 flex-col overflow-hidden border-l">
      <DetailPanelHeader adversary={adversary} onClose={onClose} />

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-4 p-4">
          <p className="text-muted-foreground text-sm">
            {adversary.description}
          </p>

          <RoleDescriptionCard adversary={adversary} />
          <StatsGrid adversary={adversary} />

          <TierScalingControls
            adversary={adversary}
            currentTierOverride={tierOverride}
            onTierChange={handleTierChange}
          />

          <Separator />

          <AttackSection attack={adversary.attack} />
          <MotivesTacticsSection
            motivesAndTactics={adversary.motivesAndTactics}
          />
          <ExperiencesSection experiences={adversary.experiences} />
          <FeaturesSection features={adversary.features} />
        </div>
      </ScrollArea>

      <AddToEncounterFooter
        onAdd={onAdd}
        adversary={adversary}
        canAdd={canAdd}
      />
    </div>
  );
}
