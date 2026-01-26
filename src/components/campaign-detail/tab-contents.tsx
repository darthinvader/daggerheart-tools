// Campaign detail page tab content components

import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Copy, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { fetchCharacter } from '@/lib/api/characters';
import {
  CAMPAIGN_THEME_OPTIONS,
  CAMPAIGN_TONE_OPTIONS,
} from '@/lib/data/campaign-frames';
import type { BattleState } from '@/lib/schemas/battle';
import type {
  Campaign,
  CampaignFrame,
  CampaignNPC,
  CampaignPlayer,
  SessionNote,
} from '@/lib/schemas/campaign';

import { EditableDistinctions } from './editable-distinctions';
import { EditableMechanics } from './editable-mechanics';
import { EditablePrinciples } from './editable-principles';
import { EditableQuestions } from './editable-questions';
import { type ChecklistItem, GMToolsPanel } from './gm-tools-panel';
import { EditableLocations } from './location-components';
import { EditableNPCs } from './npc-components';
import { EditableQuests } from './quest-components';
import { EditableSessions } from './session-components';
import { TagInput } from './tag-input';

interface OverviewTabProps {
  frame: CampaignFrame;
  updateFrame: (updates: Partial<CampaignFrame>) => void;
}

export function OverviewTabContent({ frame, updateFrame }: OverviewTabProps) {
  return (
    <TabsContent value="overview" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Campaign Pitch</CardTitle>
          <CardDescription>
            A brief introduction to present to your players
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={frame.pitch}
            onChange={e => updateFrame({ pitch: e.target.value })}
            rows={4}
            placeholder="Describe your campaign in a few sentences..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tone & Feel</CardTitle>
          <CardDescription>
            Words that describe the campaign's atmosphere
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TagInput
            tags={frame.toneAndFeel}
            onChange={tags => updateFrame({ toneAndFeel: tags })}
            suggestions={CAMPAIGN_TONE_OPTIONS}
            placeholder="Add tone words..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Themes</CardTitle>
          <CardDescription>
            Central ideas and conflicts explored in the campaign
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TagInput
            tags={frame.themes}
            onChange={tags => updateFrame({ themes: tags })}
            suggestions={CAMPAIGN_THEME_OPTIONS}
            placeholder="Add themes..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Touchstones</CardTitle>
          <CardDescription>
            Media references that inspired the campaign
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TagInput
            tags={frame.touchstones}
            onChange={tags => updateFrame({ touchstones: tags })}
            placeholder="Add movies, books, games..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Overview</CardTitle>
          <CardDescription>
            Background information to share with players before character
            creation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={frame.overview}
            onChange={e => updateFrame({ overview: e.target.value })}
            rows={6}
            placeholder="Describe the setting, history, and current situation..."
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
}

interface WorldTabProps {
  frame: CampaignFrame;
  updateFrame: (updates: Partial<CampaignFrame>) => void;
}

export function WorldTabContent({ frame, updateFrame }: WorldTabProps) {
  return (
    <TabsContent value="world" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Setting Distinctions</CardTitle>
          <CardDescription>
            Unique elements that make your world special
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditableDistinctions
            distinctions={frame.distinctions}
            onChange={distinctions => updateFrame({ distinctions })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Inciting Incident</CardTitle>
          <CardDescription>
            The event that kicks off the campaign
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs">Title (optional)</Label>
            <Input
              value={frame.incitingIncident?.title ?? ''}
              onChange={e =>
                updateFrame({
                  incitingIncident: {
                    ...frame.incitingIncident,
                    title: e.target.value,
                    description: frame.incitingIncident?.description ?? '',
                    hooks: frame.incitingIncident?.hooks ?? [],
                  },
                })
              }
              placeholder="The Call to Adventure"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Description</Label>
            <Textarea
              value={frame.incitingIncident?.description ?? ''}
              onChange={e =>
                updateFrame({
                  incitingIncident: {
                    ...frame.incitingIncident,
                    title: frame.incitingIncident?.title,
                    description: e.target.value,
                    hooks: frame.incitingIncident?.hooks ?? [],
                  },
                })
              }
              rows={4}
              placeholder="Describe the event that brings the party together..."
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Player Principles</CardTitle>
            <CardDescription>
              Guidance for players during the campaign
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EditablePrinciples
              principles={frame.playerPrinciples}
              onChange={playerPrinciples => updateFrame({ playerPrinciples })}
              target="player"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">GM Principles</CardTitle>
            <CardDescription>Guidance for running the campaign</CardDescription>
          </CardHeader>
          <CardContent>
            <EditablePrinciples
              principles={frame.gmPrinciples}
              onChange={gmPrinciples => updateFrame({ gmPrinciples })}
              target="gm"
            />
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
}

interface MechanicsTabProps {
  frame: CampaignFrame;
  updateFrame: (updates: Partial<CampaignFrame>) => void;
}

export function MechanicsTabContent({ frame, updateFrame }: MechanicsTabProps) {
  return (
    <TabsContent value="mechanics" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Custom Mechanics</CardTitle>
          <CardDescription>
            Special rules unique to this campaign
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditableMechanics
            mechanics={frame.mechanics}
            onChange={mechanics => updateFrame({ mechanics })}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
}

interface SessionsTabProps {
  sessions: SessionNote[];
  npcs: CampaignNPC[];
  campaignId: string;
  onSessionsChange: () => void | Promise<void>;
}

export function SessionsTabContent({
  sessions,
  npcs,
  campaignId,
  onSessionsChange,
}: SessionsTabProps) {
  return (
    <TabsContent value="sessions" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Session Notes</CardTitle>
          <CardDescription>
            Track what happens each session, key moments, and story progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditableSessions
            sessions={sessions}
            npcs={npcs}
            campaignId={campaignId}
            onSessionsChange={onSessionsChange}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
}

interface CharactersTabProps {
  npcs: CampaignNPC[];
  campaignId: string;
  onNPCsChange: () => void | Promise<void>;
}

export function CharactersTabContent({
  npcs,
  campaignId,
  onNPCsChange,
}: CharactersTabProps) {
  return (
    <TabsContent value="characters" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Campaign Characters</CardTitle>
          <CardDescription>
            NPCs, villains, allies, and other characters in your story
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditableNPCs
            npcs={npcs}
            campaignId={campaignId}
            onNPCsChange={onNPCsChange}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
}

interface LocationsTabProps {
  locations: Campaign['locations'];
  campaignId: string;
  onLocationsChange: () => void | Promise<void>;
}

export function LocationsTabContent({
  locations,
  campaignId,
  onLocationsChange,
}: LocationsTabProps) {
  return (
    <TabsContent value="locations" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Campaign Locations</CardTitle>
          <CardDescription>
            Cities, dungeons, and points of interest in your world
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditableLocations
            locations={locations ?? []}
            campaignId={campaignId}
            onLocationsChange={onLocationsChange}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
}

interface QuestsTabProps {
  quests: Campaign['quests'];
  campaignId: string;
  onQuestsChange: () => void | Promise<void>;
}

export function QuestsTabContent({
  quests,
  campaignId,
  onQuestsChange,
}: QuestsTabProps) {
  return (
    <TabsContent value="quests" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quests & Plot Hooks</CardTitle>
          <CardDescription>
            Main quests, side quests, and story threads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditableQuests
            quests={quests ?? []}
            campaignId={campaignId}
            onQuestsChange={onQuestsChange}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
}

const DEFAULT_CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 'default-1', text: 'Review last session notes', checked: false },
  { id: 'default-2', text: 'Check active quests & objectives', checked: false },
  {
    id: 'default-3',
    text: 'Prepare 2-3 NPC voices/mannerisms',
    checked: false,
  },
  { id: 'default-4', text: 'Have a "yes, and" backup plan', checked: false },
  { id: 'default-5', text: 'Note player character goals', checked: false },
  {
    id: 'default-6',
    text: 'Prepare one memorable description',
    checked: false,
  },
  { id: 'default-7', text: 'Check the Fear track', checked: false },
];

interface GMToolsTabProps {
  campaignId: string;
  battles: BattleState[];
  sessionPrepChecklist: ChecklistItem[] | undefined;
  onAddNPC: (name: string) => void | Promise<void>;
  onAddLocation: (name: string) => void | Promise<void>;
  onAddQuest: (title: string) => void | Promise<void>;
  onNavigateToTab: (tab: string) => void;
  onChecklistChange: (items: ChecklistItem[]) => void;
  onDeleteBattle: (battleId: string) => void | Promise<void>;
}

export function GMToolsTabContent({
  campaignId,
  battles,
  sessionPrepChecklist,
  onAddNPC,
  onAddLocation,
  onAddQuest,
  onNavigateToTab,
  onChecklistChange,
  onDeleteBattle,
}: GMToolsTabProps) {
  return (
    <TabsContent value="gm-tools" className="space-y-6">
      <GMToolsPanel
        campaignId={campaignId}
        battles={battles}
        onAddNPC={onAddNPC}
        onAddLocation={onAddLocation}
        onAddQuest={onAddQuest}
        onNavigateToTab={onNavigateToTab}
        checklistItems={
          sessionPrepChecklist?.length
            ? sessionPrepChecklist
            : DEFAULT_CHECKLIST_ITEMS
        }
        onChecklistChange={onChecklistChange}
        onDeleteBattle={onDeleteBattle}
      />
    </TabsContent>
  );
}

interface SessionZeroTabProps {
  frame: CampaignFrame;
  updateFrame: (updates: Partial<CampaignFrame>) => void;
}

export function SessionZeroTabContent({
  frame,
  updateFrame,
}: SessionZeroTabProps) {
  return (
    <TabsContent value="session-zero" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Session Zero Questions</CardTitle>
          <CardDescription>
            Questions to ask your players during session zero
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditableQuestions
            questions={frame.sessionZeroQuestions}
            onChange={sessionZeroQuestions =>
              updateFrame({ sessionZeroQuestions })
            }
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
}

interface PlayersTabProps {
  campaign: Campaign;
  inviteLink: string;
  onCopyInviteCode: () => void;
  onCopyInviteLink: () => void;
}

export function PlayersTabContent({
  campaign,
  inviteLink,
  onCopyInviteCode,
  onCopyInviteLink,
}: PlayersTabProps) {
  const players = campaign.players ?? [];

  return (
    <TabsContent value="players" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invite Players</CardTitle>
          <CardDescription>
            Share this link or invite code with your players so they can join
            and select a character.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Invite Link</Label>
            <div className="flex gap-2">
              <Input value={inviteLink} readOnly />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onCopyInviteLink}
                disabled={!inviteLink}
                aria-label="Copy invite link"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Invite Code</Label>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">
                {campaign.inviteCode ?? 'Unavailable'}
              </Badge>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onCopyInviteCode}
                disabled={!campaign.inviteCode}
                aria-label="Copy invite code"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Players</CardTitle>
          <CardDescription>
            Track who has joined and which character they selected.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {players.length === 0 ? (
            <div className="py-8 text-center">
              <Users className="text-muted-foreground mx-auto mb-3 h-10 w-10" />
              <p className="text-muted-foreground">
                No players have joined yet.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Character</TableHead>
                  <TableHead className="text-right">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {players.map(player => (
                  <TableRow key={player.id}>
                    <TableCell className="font-medium">
                      {player.name || 'Unnamed Player'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {player.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <CharacterNameCell player={player} />
                    </TableCell>
                    <TableCell className="text-right">
                      {player.characterId ? (
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            to="/character/view/$characterId"
                            params={{ characterId: player.characterId }}
                            search={{ tab: 'quick' }}
                          >
                            View
                          </Link>
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}

/**
 * Component to fetch and display fresh character name
 * Falls back to cached characterName if fetch fails
 */
function CharacterNameCell({ player }: { player: CampaignPlayer }) {
  const { data: character, isLoading } = useQuery({
    queryKey: ['character-name', player.characterId],
    queryFn: () => fetchCharacter(player.characterId!),
    enabled: Boolean(player.characterId),
    staleTime: 0, // Always fetch fresh
    select: data => data.identity?.name,
  });

  if (!player.characterId) {
    return <span className="text-muted-foreground">Not selected</span>;
  }

  if (isLoading) {
    return <span className="text-muted-foreground">Loading...</span>;
  }

  // Use fresh name from query, fall back to cached name
  const displayName = character || player.characterName;

  if (!displayName) {
    return (
      <span className="text-muted-foreground font-mono text-xs">
        {player.characterId.slice(0, 8)}...
      </span>
    );
  }

  return <span>{displayName}</span>;
}
