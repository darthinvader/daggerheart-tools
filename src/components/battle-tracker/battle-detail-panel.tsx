import { BookOpen, Leaf, Swords, User } from 'lucide-react';

import type { ConditionsState } from '@/components/conditions';
import { QuickConditionsInfo } from '@/components/quick-view/quick-conditions-info';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

import { DetailedPanel } from './battle-detailed-sections';
import { QuickStatsPanel } from './battle-quick-panel';
import type {
  AdversaryTracker,
  CharacterTracker,
  EnvironmentTracker,
  TrackerItem,
} from './types';

interface BattleDetailPanelProps {
  item: TrackerItem | null;
  activeTab: 'quick' | 'details';
  onTabChange: (tab: 'quick' | 'details') => void;
  onCharacterChange: (
    id: string,
    updater: (prev: CharacterTracker) => CharacterTracker
  ) => void;
  onAdversaryChange: (
    id: string,
    updater: (prev: AdversaryTracker) => AdversaryTracker
  ) => void;
  onEnvironmentChange: (
    id: string,
    updater: (prev: EnvironmentTracker) => EnvironmentTracker
  ) => void;
}

export function BattleDetailPanel({
  item,
  activeTab,
  onTabChange,
  onCharacterChange,
  onAdversaryChange,
  onEnvironmentChange,
}: BattleDetailPanelProps) {
  return (
    <Card className="flex h-170 flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="size-5" /> Tracker Detail
        </CardTitle>
        <CardDescription>
          Select a roster entry to view quick and detailed tracking.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 p-4">
        {item ? (
          <Tabs
            value={activeTab}
            onValueChange={value => onTabChange(value as 'quick' | 'details')}
            className="flex h-full flex-col"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="quick">Quick View</TabsTrigger>
              <TabsTrigger value="details">Detailed View</TabsTrigger>
            </TabsList>
            <TabsContent value="quick" className="min-h-0 flex-1">
              <ScrollArea className="h-full pr-2">
                <div className="space-y-4 py-3">
                  <TrackerHeader item={item} />
                  <QuickStatCard
                    title={getQuickTitle(item)}
                    description={getQuickDescription(item)}
                  >
                    <QuickStatsPanel
                      item={item}
                      onCharacterChange={onCharacterChange}
                      onAdversaryChange={onAdversaryChange}
                      onEnvironmentChange={onEnvironmentChange}
                    />
                  </QuickStatCard>
                  {item.kind !== 'environment' && (
                    <QuickConditionsInfo
                      conditions={item.conditions}
                      onChange={next =>
                        handleConditionsChange(
                          item,
                          next,
                          onCharacterChange,
                          onAdversaryChange
                        )
                      }
                    />
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="details" className="min-h-0 flex-1">
              <ScrollArea className="h-full pr-2">
                <div className="space-y-4 py-3">
                  <TrackerHeader item={item} />
                  <DetailedPanel
                    item={item}
                    onCharacterChange={onCharacterChange}
                    onAdversaryChange={onAdversaryChange}
                    onEnvironmentChange={onEnvironmentChange}
                  />
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        ) : (
          <EmptyDetailState />
        )}
      </CardContent>
    </Card>
  );
}

function TrackerHeader({ item }: { item: TrackerItem }) {
  const meta = getTrackerMeta(item);
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className={cn('gap-1 text-xs', meta.badgeTone)}>
          {meta.icon}
          {meta.label}
        </Badge>
        <h2 className="text-xl font-semibold">{meta.title}</h2>
      </div>
      <p className="text-muted-foreground text-sm">{meta.subtitle}</p>
    </div>
  );
}

function EmptyDetailState() {
  return (
    <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-3 text-center text-sm">
      <div className="bg-muted text-foreground flex h-14 w-14 items-center justify-center rounded-full">
        <Swords className="size-6" />
      </div>
      <div>
        <p className="text-foreground font-semibold">Select a roster entry</p>
        <p>Choose a character, adversary, or environment to begin tracking.</p>
      </div>
    </div>
  );
}

function getTrackerMeta(item: TrackerItem) {
  if (item.kind === 'character') {
    return {
      label: 'Character',
      icon: <User className="size-3" />,
      badgeTone: 'bg-blue-500/10 text-blue-600',
      title: item.name,
      subtitle: `Evasion ${item.evasion ?? '—'} · HP ${item.hp.current}/${item.hp.max}`,
    };
  }
  if (item.kind === 'adversary') {
    return {
      label: 'Adversary',
      icon: <Swords className="size-3" />,
      badgeTone: 'bg-rose-500/10 text-rose-600',
      title: item.source.name,
      subtitle: `${item.source.role} · Tier ${item.source.tier} · Diff ${item.source.difficulty}`,
    };
  }
  return {
    label: 'Environment',
    icon: <Leaf className="size-3" />,
    badgeTone: 'bg-emerald-500/10 text-emerald-600',
    title: item.source.name,
    subtitle: `${item.source.type} · Tier ${item.source.tier} · Diff ${item.source.difficulty}`,
  };
}

function handleConditionsChange(
  item: TrackerItem,
  next: ConditionsState,
  onCharacterChange: (
    id: string,
    updater: (prev: CharacterTracker) => CharacterTracker
  ) => void,
  onAdversaryChange: (
    id: string,
    updater: (prev: AdversaryTracker) => AdversaryTracker
  ) => void
) {
  if (item.kind === 'character') {
    onCharacterChange(item.id, prev => ({ ...prev, conditions: next }));
  }
  if (item.kind === 'adversary') {
    onAdversaryChange(item.id, prev => ({ ...prev, conditions: next }));
  }
}

function QuickStatCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-muted-foreground text-xs">{description}</p>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

function getQuickTitle(item: TrackerItem) {
  if (item.kind === 'character') return 'Character Vitals';
  if (item.kind === 'adversary') return 'Adversary Vitals';
  return 'Environment Quick View';
}

function getQuickDescription(item: TrackerItem) {
  if (item.kind === 'character') {
    return 'Adjust HP, Stress, and Evasion quickly.';
  }
  if (item.kind === 'adversary') {
    return 'Track damage and stress during spotlighted actions.';
  }
  return 'Activate features or highlight hazards.';
}
