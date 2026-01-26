import {
  AlertTriangle,
  Heart,
  Leaf,
  Plus,
  Search,
  Sparkles,
  Swords,
  Target,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { Adversary } from '@/lib/schemas/adversaries';
import type { Environment } from '@/lib/schemas/environments';

import { EmptyStateCard, RosterCard, StatChip } from './battle-tracker-shared';
import type {
  AdversaryTracker,
  EnvironmentTracker,
  TrackerSelection,
} from './types';

export function AdversaryRoster({
  adversaries,
  selection,
  spotlight,
  onSelect,
  onRemove,
  onSpotlight,
  availableAdversaries,
  searchValue,
  onSearchChange,
  onAddAdversary,
}: {
  adversaries: AdversaryTracker[];
  selection: TrackerSelection | null;
  spotlight: TrackerSelection | null;
  onSelect: (item: AdversaryTracker) => void;
  onRemove: (item: AdversaryTracker) => void;
  onSpotlight: (item: AdversaryTracker) => void;
  availableAdversaries: Adversary[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAddAdversary: (adversary: Adversary) => void;
}) {
  return (
    <ScrollArea className="h-full pr-2">
      <div className="space-y-4 py-3">
        <SectionHeader title="Encounter roster" count={adversaries.length} />
        {adversaries.length === 0 ? (
          <EmptyStateCard
            icon={<Swords className="size-6" />}
            title="No adversaries yet"
            description="Add an adversary from the reference list."
          />
        ) : (
          adversaries.map(adversary => (
            <RosterCard
              key={adversary.id}
              isSelected={
                selection?.id === adversary.id && selection.kind === 'adversary'
              }
              isSpotlight={
                spotlight?.id === adversary.id && spotlight.kind === 'adversary'
              }
              title={adversary.source.name}
              subtitle={`${adversary.source.role} · Tier ${adversary.source.tier}`}
              badgeLabel="Adversary"
              badgeTone="bg-rose-500/10 text-rose-600"
              onSelect={() => onSelect(adversary)}
              onRemove={() => onRemove(adversary)}
              onSpotlight={() => onSpotlight(adversary)}
            >
              <div className="grid grid-cols-2 gap-3 text-xs">
                <StatChip
                  icon={<Heart className="size-3" />}
                  label={`HP ${adversary.hp.current}/${adversary.hp.max}`}
                />
                <StatChip
                  icon={<AlertTriangle className="size-3" />}
                  label={`Stress ${adversary.stress.current}/${adversary.stress.max}`}
                />
                <StatChip
                  icon={<Target className="size-3" />}
                  label={`Diff ${adversary.source.difficulty}`}
                />
              </div>
            </RosterCard>
          ))
        )}
        <Separator />
        <div className="space-y-3">
          <SectionHeader
            title="Reference list"
            count={availableAdversaries.length}
          />
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              value={searchValue}
              onChange={event => onSearchChange(event.target.value)}
              placeholder="Search adversaries"
              className="pl-9"
            />
          </div>
          <div className="space-y-2">
            {availableAdversaries.map(adversary => (
              <Card key={`ref-${adversary.name}`}>
                <CardContent className="flex items-center justify-between gap-3 p-3">
                  <div>
                    <p className="text-sm font-semibold">{adversary.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {adversary.role} · Tier {adversary.tier} · Diff{' '}
                      {adversary.difficulty}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddAdversary(adversary)}
                  >
                    <Plus className="mr-1 size-3" /> Add
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

export function EnvironmentRoster({
  environments,
  selection,
  spotlight,
  onSelect,
  onRemove,
  onSpotlight,
  availableEnvironments,
  searchValue,
  onSearchChange,
  onAddEnvironment,
}: {
  environments: EnvironmentTracker[];
  selection: TrackerSelection | null;
  spotlight: TrackerSelection | null;
  onSelect: (item: EnvironmentTracker) => void;
  onRemove: (item: EnvironmentTracker) => void;
  onSpotlight: (item: EnvironmentTracker) => void;
  availableEnvironments: Environment[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAddEnvironment: (environment: Environment) => void;
}) {
  return (
    <ScrollArea className="h-full pr-2">
      <div className="space-y-4 py-3">
        <SectionHeader title="Encounter roster" count={environments.length} />
        {environments.length === 0 ? (
          <EmptyStateCard
            icon={<Leaf className="size-6" />}
            title="No environments yet"
            description="Add a scene environment to track features and hazards."
          />
        ) : (
          environments.map(environment => {
            const activeCount = environment.features.filter(
              feature => feature.active
            ).length;
            return (
              <RosterCard
                key={environment.id}
                isSelected={
                  selection?.id === environment.id &&
                  selection.kind === 'environment'
                }
                isSpotlight={
                  spotlight?.id === environment.id &&
                  spotlight.kind === 'environment'
                }
                title={environment.source.name}
                subtitle={`${environment.source.type} · Tier ${environment.source.tier}`}
                badgeLabel="Environment"
                badgeTone="bg-emerald-500/10 text-emerald-600"
                onSelect={() => onSelect(environment)}
                onRemove={() => onRemove(environment)}
                onSpotlight={() => onSpotlight(environment)}
              >
                <div className="flex flex-wrap gap-2 text-xs">
                  <StatChip
                    icon={<Target className="size-3" />}
                    label={`Diff ${environment.source.difficulty}`}
                  />
                  <StatChip
                    icon={<Sparkles className="size-3" />}
                    label={`${activeCount} active feature${activeCount === 1 ? '' : 's'}`}
                  />
                </div>
              </RosterCard>
            );
          })
        )}
        <Separator />
        <div className="space-y-3">
          <SectionHeader
            title="Reference list"
            count={availableEnvironments.length}
          />
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              value={searchValue}
              onChange={event => onSearchChange(event.target.value)}
              placeholder="Search environments"
              className="pl-9"
            />
          </div>
          <div className="space-y-2">
            {availableEnvironments.map(environment => (
              <Card key={`ref-${environment.name}`}>
                <CardContent className="flex items-center justify-between gap-3 p-3">
                  <div>
                    <p className="text-sm font-semibold">{environment.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {environment.type} · Tier {environment.tier}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddEnvironment(environment)}
                  >
                    <Plus className="mr-1 size-3" /> Add
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="text-muted-foreground flex items-center justify-between text-xs tracking-wide uppercase">
      <span>{title}</span>
      <span>{count}</span>
    </div>
  );
}
