import { AlertTriangle, Heart, Shield, Swords, User } from 'lucide-react';

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
import type { Adversary } from '@/lib/schemas/adversaries';
import type { Environment } from '@/lib/schemas/environments';

import { AdversaryRoster, EnvironmentRoster } from './battle-roster-sections';
import { EmptyStateCard, RosterCard, StatChip } from './battle-tracker-shared';
import type {
  AdversaryTracker,
  CharacterTracker,
  EnvironmentTracker,
  TrackerSelection,
} from './types';

interface BattleRosterProps {
  characters: CharacterTracker[];
  adversaries: AdversaryTracker[];
  environments: EnvironmentTracker[];
  selection: TrackerSelection | null;
  spotlight: TrackerSelection | null;
  activeTab: 'characters' | 'adversaries' | 'environments';
  onTabChange: (tab: 'characters' | 'adversaries' | 'environments') => void;
  onSelect: (
    item: CharacterTracker | AdversaryTracker | EnvironmentTracker
  ) => void;
  onRemove: (
    item: CharacterTracker | AdversaryTracker | EnvironmentTracker
  ) => void;
  onSpotlight: (
    item: CharacterTracker | AdversaryTracker | EnvironmentTracker
  ) => void;
  availableAdversaries: Adversary[];
  availableEnvironments: Environment[];
  adversarySearch: string;
  environmentSearch: string;
  onAdversarySearchChange: (value: string) => void;
  onEnvironmentSearchChange: (value: string) => void;
  onAddAdversary: (adversary: Adversary) => void;
  onAddEnvironment: (environment: Environment) => void;
}

export function BattleRoster({
  characters,
  adversaries,
  environments,
  selection,
  spotlight,
  activeTab,
  onTabChange,
  onSelect,
  onRemove,
  onSpotlight,
  availableAdversaries,
  availableEnvironments,
  adversarySearch,
  environmentSearch,
  onAdversarySearchChange,
  onEnvironmentSearchChange,
  onAddAdversary,
  onAddEnvironment,
}: BattleRosterProps) {
  return (
    <Card className="flex h-170 flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Swords className="size-5" /> Battle Roster
        </CardTitle>
        <CardDescription>
          Track characters, adversaries, and environments with quick edits.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 p-4">
        <Tabs
          value={activeTab}
          onValueChange={value =>
            onTabChange(value as 'characters' | 'adversaries' | 'environments')
          }
          className="flex h-full flex-col"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="characters">
              Characters
              <span className="bg-muted ml-2 rounded-full px-2 py-0.5 text-xs">
                {characters.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="adversaries">
              Adversaries
              <span className="bg-muted ml-2 rounded-full px-2 py-0.5 text-xs">
                {adversaries.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="environments">
              Environments
              <span className="bg-muted ml-2 rounded-full px-2 py-0.5 text-xs">
                {environments.length}
              </span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="characters" className="min-h-0 flex-1">
            <CharacterRoster
              characters={characters}
              selection={selection}
              spotlight={spotlight}
              onSelect={onSelect}
              onRemove={onRemove}
              onSpotlight={onSpotlight}
            />
          </TabsContent>
          <TabsContent value="adversaries" className="min-h-0 flex-1">
            <AdversaryRoster
              adversaries={adversaries}
              selection={selection}
              spotlight={spotlight}
              onSelect={onSelect}
              onRemove={onRemove}
              onSpotlight={onSpotlight}
              availableAdversaries={availableAdversaries}
              searchValue={adversarySearch}
              onSearchChange={onAdversarySearchChange}
              onAddAdversary={onAddAdversary}
            />
          </TabsContent>
          <TabsContent value="environments" className="min-h-0 flex-1">
            <EnvironmentRoster
              environments={environments}
              selection={selection}
              spotlight={spotlight}
              onSelect={onSelect}
              onRemove={onRemove}
              onSpotlight={onSpotlight}
              availableEnvironments={availableEnvironments}
              searchValue={environmentSearch}
              onSearchChange={onEnvironmentSearchChange}
              onAddEnvironment={onAddEnvironment}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function CharacterRoster({
  characters,
  selection,
  spotlight,
  onSelect,
  onRemove,
  onSpotlight,
}: {
  characters: CharacterTracker[];
  selection: TrackerSelection | null;
  spotlight: TrackerSelection | null;
  onSelect: (item: CharacterTracker) => void;
  onRemove: (item: CharacterTracker) => void;
  onSpotlight: (item: CharacterTracker) => void;
}) {
  return (
    <ScrollArea className="h-full pr-2">
      <div className="space-y-3 py-3">
        <SectionHeader title="Encounter roster" count={characters.length} />
        {characters.length === 0 ? (
          <EmptyStateCard
            icon={<User className="size-6" />}
            title="No characters yet"
            description="Add a PC or ally to start tracking their status."
          />
        ) : (
          characters.map(character => (
            <RosterCard
              key={character.id}
              isSelected={
                selection?.id === character.id && selection.kind === 'character'
              }
              isSpotlight={
                spotlight?.id === character.id && spotlight.kind === 'character'
              }
              title={character.name}
              subtitle="Player Character"
              badgeLabel="Character"
              badgeTone="bg-blue-500/10 text-blue-600"
              onSelect={() => onSelect(character)}
              onRemove={() => onRemove(character)}
              onSpotlight={() => onSpotlight(character)}
            >
              <div className="grid grid-cols-2 gap-3 text-xs">
                <StatChip
                  icon={<Heart className="size-3" />}
                  label={`HP ${character.hp.current}/${character.hp.max}`}
                />
                <StatChip
                  icon={<AlertTriangle className="size-3" />}
                  label={`Stress ${character.stress.current}/${character.stress.max}`}
                />
                {character.evasion !== null && (
                  <StatChip
                    icon={<Shield className="size-3" />}
                    label={`Evasion ${character.evasion}`}
                  />
                )}
              </div>
              {character.conditions.items.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {character.conditions.items.map((condition: string) => (
                    <Badge
                      key={condition}
                      variant="destructive"
                      className="px-1.5 py-0 text-[10px]"
                    >
                      {condition}
                    </Badge>
                  ))}
                </div>
              )}
            </RosterCard>
          ))
        )}
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
