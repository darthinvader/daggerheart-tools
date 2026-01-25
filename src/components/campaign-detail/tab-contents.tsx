// Campaign detail page tab content components

import { Users } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  CAMPAIGN_THEME_OPTIONS,
  CAMPAIGN_TONE_OPTIONS,
} from '@/lib/data/campaign-frames';
import type {
  Campaign,
  CampaignFrame,
  CampaignNPC,
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
  sessionPrepChecklist: ChecklistItem[] | undefined;
  onAddNPC: (name: string) => void | Promise<void>;
  onAddLocation: (name: string) => void | Promise<void>;
  onAddQuest: (title: string) => void | Promise<void>;
  onNavigateToTab: (tab: string) => void;
  onChecklistChange: (items: ChecklistItem[]) => void;
}

export function GMToolsTabContent({
  campaignId,
  sessionPrepChecklist,
  onAddNPC,
  onAddLocation,
  onAddQuest,
  onNavigateToTab,
  onChecklistChange,
}: GMToolsTabProps) {
  return (
    <TabsContent value="gm-tools" className="space-y-6">
      <GMToolsPanel
        campaignId={campaignId}
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

export function PlayersTabContent() {
  return (
    <TabsContent value="players">
      <Card>
        <CardContent className="py-12 text-center">
          <Users className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <p className="text-muted-foreground">Player management coming soon</p>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
