// Campaign detail page tab content components

import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import {
  BookOpen,
  Building2,
  Cog,
  Copy,
  FileText,
  Globe,
  HelpCircle,
  Map,
  MessageSquare,
  Music,
  Palette,
  Scroll,
  Sparkles,
  Target,
  Users,
  Zap,
} from 'lucide-react';

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { fetchCharacter } from '@/lib/api/characters';
import {
  CAMPAIGN_THEME_OPTIONS,
  CAMPAIGN_TONE_OPTIONS,
} from '@/lib/data/campaign-frames';
import type { BattleState } from '@/lib/schemas/battle';
import type {
  Campaign,
  CampaignFrame,
  CampaignLocation,
  CampaignNPC,
  CampaignOrganization,
  CampaignPlayer,
  CampaignQuest,
  SessionNote,
  SessionZero,
} from '@/lib/schemas/campaign';

import { EditableDistinctions } from './editable-distinctions';
import { EditableMechanics } from './editable-mechanics';
import { EditablePrinciples } from './editable-principles';
import { EditableQuestions } from './editable-questions';
import { type ChecklistItem, GMToolsPanel } from './gm-tools-panel';
import { EditableLocations } from './location-components-new';
import { EditableNPCs } from './npc-components-new';
import { EditableOrganizations } from './organization-components-new';
import { EditableQuests } from './quest-components-new';
import { EditableSessions } from './session-components-new';
import { SessionZeroPanel } from './session-zero-panel';
import { TagInput } from './tag-input';

interface OverviewTabProps {
  frame: CampaignFrame;
  updateFrame: (updates: Partial<CampaignFrame>) => void;
  onBlur: () => void;
}

export function OverviewTabContent({
  frame,
  updateFrame,
  onBlur,
}: OverviewTabProps) {
  return (
    <TabsContent value="overview" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-4 w-4 text-blue-500" />
            Campaign Pitch
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="text-muted-foreground h-4 w-4 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p>
                    A compelling 2-3 sentence hook to present to players. Think
                    movie trailer pitch!
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>
            A brief introduction to present to your players
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={frame.pitch}
            onChange={e => updateFrame({ pitch: e.target.value })}
            onBlur={onBlur}
            rows={4}
            placeholder="Describe your campaign in a few sentences..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Palette className="h-4 w-4 text-purple-500" />
            Tone & Feel
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="text-muted-foreground h-4 w-4 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p>
                    Keywords like "gritty", "heroic", "mysterious", or
                    "whimsical" that set the mood.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>
            Words that describe the campaign's atmosphere
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TagInput
            tags={frame.toneAndFeel}
            onChange={tags => updateFrame({ toneAndFeel: tags })}
            onBlur={onBlur}
            suggestions={CAMPAIGN_TONE_OPTIONS}
            placeholder="Add tone words..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-4 w-4 text-red-500" />
            Themes
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="text-muted-foreground h-4 w-4 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p>
                    Core ideas explored: redemption, sacrifice, found family,
                    corruption, etc.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>
            Central ideas and conflicts explored in the campaign
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TagInput
            tags={frame.themes}
            onChange={tags => updateFrame({ themes: tags })}
            onBlur={onBlur}
            suggestions={CAMPAIGN_THEME_OPTIONS}
            placeholder="Add themes..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Music className="h-4 w-4 text-amber-500" />
            Touchstones
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="text-muted-foreground h-4 w-4 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p>
                    Movies, books, games, or shows that inspired this campaign.
                    Helps players understand the vibe!
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>
            Media references that inspired the campaign
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TagInput
            tags={frame.touchstones}
            onChange={tags => updateFrame({ touchstones: tags })}
            onBlur={onBlur}
            placeholder="Add movies, books, games..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe className="h-4 w-4 text-emerald-500" />
            Overview
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="text-muted-foreground h-4 w-4 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p>
                    The world state, recent history, and current events that
                    players should know.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>
            Background information to share with players before character
            creation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={frame.overview}
            onChange={e => updateFrame({ overview: e.target.value })}
            onBlur={onBlur}
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
  onBlur: () => void;
}

export function WorldTabContent({ frame, updateFrame, onBlur }: WorldTabProps) {
  return (
    <TabsContent value="world" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-violet-500" />
            Setting Distinctions
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="text-muted-foreground h-4 w-4 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p>
                    What makes your world unique? Magic systems, technology,
                    cultures, or cosmic forces that set it apart.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>
            Unique elements that make your world special
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditableDistinctions
            distinctions={frame.distinctions}
            onChange={distinctions => updateFrame({ distinctions })}
            onBlur={onBlur}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="h-4 w-4 text-yellow-500" />
            Inciting Incident
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="text-muted-foreground h-4 w-4 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p>
                    The catalyst that brings the party together and kicks off
                    the adventure. What disrupts the status quo?
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
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
              onBlur={onBlur}
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
              onBlur={onBlur}
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
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-blue-500" />
              Player Principles
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="text-muted-foreground h-4 w-4 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p>
                      Guidelines for players: how to engage with the world,
                      collaborate, and embody the campaign's spirit.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <CardDescription>
              Guidance for players during the campaign
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EditablePrinciples
              principles={frame.playerPrinciples}
              onChange={playerPrinciples => updateFrame({ playerPrinciples })}
              onBlur={onBlur}
              target="player"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-4 w-4 text-orange-500" />
              GM Principles
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="text-muted-foreground h-4 w-4 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p>
                      Reminders for yourself: pacing, tone, when to be generous
                      or challenging, storytelling goals.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <CardDescription>Guidance for running the campaign</CardDescription>
          </CardHeader>
          <CardContent>
            <EditablePrinciples
              principles={frame.gmPrinciples}
              onChange={gmPrinciples => updateFrame({ gmPrinciples })}
              onBlur={onBlur}
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
  onBlur: () => void;
}

export function MechanicsTabContent({
  frame,
  updateFrame,
  onBlur,
}: MechanicsTabProps) {
  return (
    <TabsContent value="mechanics" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Cog className="h-4 w-4 text-slate-500" />
            Custom Mechanics
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="text-muted-foreground h-4 w-4 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p>
                    House rules, custom moves, or unique systems for this
                    campaign. Keep players informed!
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>
            Special rules unique to this campaign
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditableMechanics
            mechanics={frame.mechanics}
            onChange={mechanics => updateFrame({ mechanics })}
            onBlur={onBlur}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
}

interface SessionsTabProps {
  sessions: SessionNote[];
  npcs: CampaignNPC[];
  locations: CampaignLocation[];
  quests: CampaignQuest[];
  organizations: CampaignOrganization[];
  campaignId: string;
  onSaveStart: () => void;
  onPendingChange: () => void;
  onSessionsChange: () => void | Promise<void>;
  onNPCsChange?: () => void | Promise<void>;
  onLocationsChange?: () => void | Promise<void>;
  onQuestsChange?: () => void | Promise<void>;
  onOrganizationsChange?: () => void | Promise<void>;
}

export function SessionsTabContent({
  sessions,
  npcs,
  locations,
  quests,
  organizations,
  campaignId,
  onSaveStart,
  onPendingChange,
  onSessionsChange,
  onNPCsChange,
  onLocationsChange,
  onQuestsChange,
  onOrganizationsChange,
}: SessionsTabProps) {
  return (
    <TabsContent value="sessions" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Scroll className="h-4 w-4 text-amber-500" />
            Session Notes
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="text-muted-foreground h-4 w-4 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p>
                    Record what happened each session: highlights, NPC
                    interactions, quest progress, and memorable moments.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>
            Track what happens each session, key moments, and story progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditableSessions
            sessions={sessions}
            npcs={npcs}
            locations={locations}
            quests={quests}
            organizations={organizations}
            campaignId={campaignId}
            onSaveStart={onSaveStart}
            onPendingChange={onPendingChange}
            onSessionsChange={onSessionsChange}
            onNPCsChange={onNPCsChange}
            onLocationsChange={onLocationsChange}
            onQuestsChange={onQuestsChange}
            onOrganizationsChange={onOrganizationsChange}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
}

interface CharactersTabProps {
  npcs: CampaignNPC[];
  locations: CampaignLocation[];
  quests: CampaignQuest[];
  sessions: SessionNote[];
  organizations: CampaignOrganization[];
  campaignId: string;
  onSaveStart: () => void;
  onPendingChange: () => void;
  onNPCsChange: () => void | Promise<void>;
  onLocationsChange?: () => void | Promise<void>;
  onOrganizationsChange?: () => void | Promise<void>;
}

export function CharactersTabContent({
  npcs,
  locations,
  quests,
  sessions,
  organizations,
  campaignId,
  onSaveStart,
  onPendingChange,
  onNPCsChange,
  onLocationsChange,
  onOrganizationsChange,
}: CharactersTabProps) {
  return (
    <TabsContent value="characters" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4 text-indigo-500" />
            Campaign Characters
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="text-muted-foreground h-4 w-4 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p>
                    All NPCs in your world: allies, villains, shopkeepers,
                    rulers. Track their motivations and secrets!
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>
            NPCs, villains, allies, and other characters in your story
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditableNPCs
            npcs={npcs}
            locations={locations}
            quests={quests}
            sessions={sessions}
            organizations={organizations}
            campaignId={campaignId}
            onSaveStart={onSaveStart}
            onPendingChange={onPendingChange}
            onNPCsChange={onNPCsChange}
            onLocationsChange={onLocationsChange}
            onOrganizationsChange={onOrganizationsChange}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
}

interface LocationsTabProps {
  locations: Campaign['locations'];
  npcs: CampaignNPC[];
  quests: CampaignQuest[];
  sessions: SessionNote[];
  organizations: CampaignOrganization[];
  campaignId: string;
  onSaveStart: () => void;
  onPendingChange: () => void;
  onLocationsChange: () => void | Promise<void>;
  onNPCsChange?: () => void | Promise<void>;
  onQuestsChange?: () => void | Promise<void>;
  onOrganizationsChange?: () => void | Promise<void>;
}

export function LocationsTabContent({
  locations,
  npcs,
  quests,
  sessions,
  organizations,
  campaignId,
  onSaveStart,
  onPendingChange,
  onLocationsChange,
  onNPCsChange,
  onQuestsChange,
  onOrganizationsChange,
}: LocationsTabProps) {
  return (
    <TabsContent value="locations" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Map className="h-4 w-4 text-emerald-500" />
            Campaign Locations
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="text-muted-foreground h-4 w-4 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p>
                    Cities, dungeons, taverns, and landmarks. Add points of
                    interest to make locations come alive!
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>
            Cities, dungeons, and points of interest in your world
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditableLocations
            locations={locations ?? []}
            npcs={npcs}
            quests={quests}
            sessions={sessions}
            organizations={organizations}
            campaignId={campaignId}
            onSaveStart={onSaveStart}
            onPendingChange={onPendingChange}
            onLocationsChange={onLocationsChange}
            onNPCsChange={onNPCsChange}
            onQuestsChange={onQuestsChange}
            onOrganizationsChange={onOrganizationsChange}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
}

interface QuestsTabProps {
  quests: Campaign['quests'];
  npcs: CampaignNPC[];
  locations: CampaignLocation[];
  sessions: SessionNote[];
  organizations: CampaignOrganization[];
  campaignId: string;
  onSaveStart: () => void;
  onPendingChange: () => void;
  onQuestsChange: () => void | Promise<void>;
  onNPCsChange?: () => void | Promise<void>;
  onLocationsChange?: () => void | Promise<void>;
  onOrganizationsChange?: () => void | Promise<void>;
}

export function QuestsTabContent({
  quests,
  npcs,
  locations,
  sessions,
  organizations,
  campaignId,
  onSaveStart,
  onPendingChange,
  onQuestsChange,
  onNPCsChange,
  onLocationsChange,
  onOrganizationsChange,
}: QuestsTabProps) {
  return (
    <TabsContent value="quests" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-4 w-4 text-red-500" />
            Quests & Plot Hooks
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="text-muted-foreground h-4 w-4 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p>
                    Track main storylines, side quests, rumors, and plot hooks.
                    Link NPCs and locations involved!
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>
            Main quests, side quests, and story threads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditableQuests
            quests={quests ?? []}
            npcs={npcs}
            locations={locations}
            sessions={sessions}
            organizations={organizations}
            campaignId={campaignId}
            onSaveStart={onSaveStart}
            onPendingChange={onPendingChange}
            onQuestsChange={onQuestsChange}
            onNPCsChange={onNPCsChange}
            onLocationsChange={onLocationsChange}
            onOrganizationsChange={onOrganizationsChange}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
}

interface OrganizationsTabProps {
  organizations: CampaignOrganization[];
  npcs: CampaignNPC[];
  locations: CampaignLocation[];
  quests: CampaignQuest[];
  campaignId: string;
  onSaveStart: () => void;
  onPendingChange: () => void;
  onOrganizationsChange: () => void | Promise<void>;
  onNPCsChange?: () => void | Promise<void>;
  onLocationsChange?: () => void | Promise<void>;
  onQuestsChange?: () => void | Promise<void>;
}

export function OrganizationsTabContent({
  organizations,
  npcs,
  locations,
  quests,
  campaignId,
  onSaveStart,
  onPendingChange,
  onOrganizationsChange,
  onNPCsChange,
  onLocationsChange,
  onQuestsChange,
}: OrganizationsTabProps) {
  return (
    <TabsContent value="organizations" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-4 w-4 text-purple-500" />
            Organizations & Factions
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="text-muted-foreground h-4 w-4 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p>
                    Guilds, governments, cults, and factions. Track their goals,
                    resources, and relationships!
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>
            Guilds, factions, governments, and other groups in your world
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditableOrganizations
            organizations={organizations ?? []}
            npcs={npcs}
            locations={locations}
            quests={quests}
            campaignId={campaignId}
            onSaveStart={onSaveStart}
            onPendingChange={onPendingChange}
            onOrganizationsChange={onOrganizationsChange}
            onNPCsChange={onNPCsChange}
            onLocationsChange={onLocationsChange}
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
  sessionZero: Campaign['sessionZero'];
  onSessionZeroChange: (sessionZero: SessionZero) => void;
  onBlur: () => void;
}

export function SessionZeroTabContent({
  frame,
  updateFrame,
  sessionZero,
  onSessionZeroChange,
  onBlur,
}: SessionZeroTabProps) {
  return (
    <TabsContent value="session-zero" className="space-y-6">
      {/* Full Session Zero Panel with CATS method and safety tools */}
      <SessionZeroPanel
        sessionZero={sessionZero}
        onChange={onSessionZeroChange}
        onBlur={onBlur}
      />

      {/* Legacy Session Zero Questions (from Campaign Frame) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-4 w-4 text-teal-500" />
            Additional Session Zero Questions
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="text-muted-foreground h-4 w-4 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p>
                    Custom discussion prompts from your campaign frame template.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>
            Custom questions from your campaign frame
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditableQuestions
            questions={frame.sessionZeroQuestions}
            onChange={sessionZeroQuestions =>
              updateFrame({ sessionZeroQuestions })
            }
            onBlur={onBlur}
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
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-blue-500" />
            Invite Players
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="text-muted-foreground h-4 w-4 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p>
                    Share the invite link or code with players. They can then
                    select or create their character.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
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
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4 text-green-500" />
            Players
          </CardTitle>
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
