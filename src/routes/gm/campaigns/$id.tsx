/* eslint-disable max-lines-per-function */
// Campaign detail page - main component using extracted sub-components

import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  ArrowLeft,
  BookOpen,
  Copy,
  Lightbulb,
  Map,
  MapPin,
  MessageSquare,
  Save,
  Scroll,
  Sparkles,
  Target,
  User,
  Users,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import {
  CharactersTabContent,
  GMToolsTabContent,
  LocationsTabContent,
  MechanicsTabContent,
  OverviewTabContent,
  PlayersTabContent,
  QuestsTabContent,
  SessionsTabContent,
  SessionZeroTabContent,
  WorldTabContent,
} from '@/components/campaign-detail';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  addLocation,
  addNPC,
  addQuest,
  getCampaign,
  updateCampaign,
  updateCampaignFrame,
} from '@/features/campaigns/campaign-storage';
import type { Campaign, CampaignFrame } from '@/lib/schemas/campaign';

const validTabs = [
  'overview',
  'world',
  'mechanics',
  'sessions',
  'characters',
  'locations',
  'quests',
  'session-zero',
  'gm-tools',
  'players',
] as const;

type TabValue = (typeof validTabs)[number];

export const Route = createFileRoute('/gm/campaigns/$id')({
  component: CampaignDetailPage,
  validateSearch: (search: Record<string, unknown>): { tab: TabValue } => {
    const tab = search.tab as string;
    if (tab && validTabs.includes(tab as TabValue)) {
      return { tab: tab as TabValue };
    }
    return { tab: 'overview' };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
function CampaignDetailPage() {
  const { id } = Route.useParams();
  const { tab } = Route.useSearch();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const setActiveTab = (newTab: string) => {
    navigate({
      to: '/gm/campaigns/$id',
      params: { id },
      search: { tab: newTab as TabValue },
      replace: true,
    });
  };

  const loadCampaign = useCallback(async () => {
    const data = await getCampaign(id);
    if (data) {
      setCampaign(data);
    }
  }, [id]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await loadCampaign();
      setLoading(false);
    };
    load();
  }, [loadCampaign]);

  const updateFrame = useCallback(
    (updates: Partial<CampaignFrame>) => {
      if (!campaign) return;
      setCampaign({
        ...campaign,
        frame: { ...campaign.frame, ...updates },
      });
      setHasChanges(true);
    },
    [campaign]
  );

  const handleSave = async () => {
    if (!campaign) return;
    setSaving(true);
    try {
      await updateCampaign(id, { name: campaign.name });
      await updateCampaignFrame(id, campaign.frame);
      setHasChanges(false);
    } finally {
      setSaving(false);
    }
  };

  // GM Tools callbacks for adding items from random generators
  const handleAddNPCFromGenerator = async (name: string) => {
    if (!campaign) return;
    await addNPC(campaign.id, {
      name,
      title: '',
      description: '',
      personality: '',
      motivation: '',
      secrets: '',
      connections: [],
      locations: [],
      status: 'active',
      faction: '',
      notes: '',
      sessionAppearances: [],
      tags: [],
    });
    await loadCampaign();
  };

  const handleAddLocationFromGenerator = async (name: string) => {
    if (!campaign) return;
    await addLocation(campaign.id, {
      name,
      type: 'other',
      description: '',
      history: '',
      secrets: '',
      currentState: '',
      connectedLocations: [],
      npcsPresent: [],
      pointsOfInterest: [],
      tags: [],
      notes: '',
    });
    await loadCampaign();
  };

  const handleAddQuestFromGenerator = async (title: string) => {
    if (!campaign) return;
    await addQuest(campaign.id, {
      title,
      type: 'hook',
      status: 'available',
      description: '',
      objectives: [],
      rewards: '',
      giver: '',
      location: '',
      relatedNpcs: [],
      notes: '',
      foreshadowing: '',
      consequences: '',
      priority: 'medium',
      tags: [],
    });
    await loadCampaign();
  };

  const copyInviteCode = () => {
    if (campaign?.inviteCode) {
      navigator.clipboard.writeText(campaign.inviteCode);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl p-4">
        <div className="bg-muted h-64 animate-pulse rounded-lg" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container mx-auto max-w-7xl p-4">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Campaign not found</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate({ to: '/gm/campaigns' })}
            >
              Back to Campaigns
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const frame = campaign.frame;

  return (
    <div className="container mx-auto max-w-7xl p-4">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2"
            onClick={() => navigate({ to: '/gm/campaigns' })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Campaigns
          </Button>
          <div className="flex items-center gap-3">
            <Input
              value={campaign.name}
              onChange={e => {
                setCampaign({ ...campaign, name: e.target.value });
                setHasChanges(true);
              }}
              className="focus-visible:border-input focus-visible:bg-background h-auto border-transparent bg-transparent p-0 text-2xl font-bold focus-visible:px-2"
            />
          </div>
          {campaign.inviteCode && (
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="outline" className="font-mono">
                {campaign.inviteCode}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={copyInviteCode}
              >
                <Copy className="h-3 w-3" />
              </Button>
              <span className="text-muted-foreground text-xs">Invite Code</span>
            </div>
          )}
        </div>
        <Button onClick={handleSave} disabled={!hasChanges || saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 w-full flex-wrap justify-start">
          <TabsTrigger value="overview">
            <Map className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="world">
            <BookOpen className="mr-2 h-4 w-4" />
            World
          </TabsTrigger>
          <TabsTrigger value="mechanics">
            <Sparkles className="mr-2 h-4 w-4" />
            Mechanics
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <Scroll className="mr-2 h-4 w-4" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="characters">
            <User className="mr-2 h-4 w-4" />
            Characters
          </TabsTrigger>
          <TabsTrigger value="locations">
            <MapPin className="mr-2 h-4 w-4" />
            Locations
          </TabsTrigger>
          <TabsTrigger value="quests">
            <Target className="mr-2 h-4 w-4" />
            Quests
          </TabsTrigger>
          <TabsTrigger value="session-zero">
            <MessageSquare className="mr-2 h-4 w-4" />
            Session Zero
          </TabsTrigger>
          <TabsTrigger value="gm-tools">
            <Lightbulb className="mr-2 h-4 w-4" />
            GM Tools
          </TabsTrigger>
          <TabsTrigger value="players" disabled>
            <Users className="mr-2 h-4 w-4" />
            Players
          </TabsTrigger>
        </TabsList>

        <OverviewTabContent frame={frame} updateFrame={updateFrame} />
        <WorldTabContent frame={frame} updateFrame={updateFrame} />
        <MechanicsTabContent frame={frame} updateFrame={updateFrame} />
        <SessionsTabContent
          sessions={campaign.sessions ?? []}
          npcs={campaign.npcs ?? []}
          campaignId={campaign.id}
          onSessionsChange={loadCampaign}
        />
        <CharactersTabContent
          npcs={campaign.npcs ?? []}
          campaignId={campaign.id}
          onNPCsChange={loadCampaign}
        />
        <LocationsTabContent
          locations={campaign.locations}
          campaignId={campaign.id}
          onLocationsChange={loadCampaign}
        />
        <QuestsTabContent
          quests={campaign.quests}
          campaignId={campaign.id}
          onQuestsChange={loadCampaign}
        />
        <GMToolsTabContent
          campaignId={campaign.id}
          sessionPrepChecklist={campaign.sessionPrepChecklist}
          onAddNPC={handleAddNPCFromGenerator}
          onAddLocation={handleAddLocationFromGenerator}
          onAddQuest={handleAddQuestFromGenerator}
          onNavigateToTab={setActiveTab}
          onChecklistChange={items => {
            setCampaign({ ...campaign, sessionPrepChecklist: items });
            setHasChanges(true);
          }}
        />
        <SessionZeroTabContent frame={frame} updateFrame={updateFrame} />
        <PlayersTabContent />
      </Tabs>
    </div>
  );
}
