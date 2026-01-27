// Campaign detail page - main component using extracted sub-components

import {
  createFileRoute,
  Outlet,
  useMatches,
  useNavigate,
} from '@tanstack/react-router';
import {
  BookOpen,
  Lightbulb,
  Map,
  MapPin,
  MessageSquare,
  Scroll,
  Sparkles,
  Target,
  User,
  Users,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  CampaignHeader,
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
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  addLocation,
  addNPC,
  addQuest,
  deleteBattle,
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

type AddNPCInput = Parameters<typeof addNPC>[1];
type AddLocationInput = Parameters<typeof addLocation>[1];
type AddQuestInput = Parameters<typeof addQuest>[1];

const buildNPCPayload = (name: string): AddNPCInput => ({
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

const buildLocationPayload = (name: string): AddLocationInput => ({
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

const buildQuestPayload = (title: string): AddQuestInput => ({
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

type CampaignTabsProps = {
  tab: TabValue;
  setActiveTab: (value: string) => void;
  frame: CampaignFrame;
  updateFrame: (updates: Partial<CampaignFrame>) => void;
  campaign: Campaign;
  inviteLink: string;
  onCopyInviteCode: () => void;
  onCopyInviteLink: () => void;
  onSessionsChange: () => void;
  onNPCsChange: () => void;
  onLocationsChange: () => void;
  onQuestsChange: () => void;
  onAddNPC: (name: string) => void | Promise<void>;
  onAddLocation: (name: string) => void | Promise<void>;
  onAddQuest: (title: string) => void | Promise<void>;
  onChecklistChange: (items: Campaign['sessionPrepChecklist']) => void;
  onDeleteBattle: (battleId: string) => void | Promise<void>;
};

function CampaignLoadingState() {
  return (
    <div className="container mx-auto max-w-7xl p-4">
      <div className="bg-muted h-64 animate-pulse rounded-lg" />
    </div>
  );
}

function CampaignNotFoundState({ onBack }: { onBack: () => void }) {
  return (
    <div className="container mx-auto max-w-7xl p-4">
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Campaign not found</p>
          <Button variant="outline" className="mt-4" onClick={onBack}>
            Back to Campaigns
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function useCampaignLoader(id: string) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCampaign = useCallback(async () => {
    const data = await getCampaign(id);
    if (data) {
      setCampaign(data);
    }
  }, [id]);

  const reloadCampaignData = useCallback(async () => {
    const data = await getCampaign(id);
    if (data) {
      setCampaign(current => {
        if (!current) return data;
        return {
          ...data,
          frame: current.frame,
          name: current.name,
        };
      });
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

  return { campaign, setCampaign, loading, reloadCampaignData };
}

function useGmToolsTabReload(
  tab: TabValue,
  loading: boolean,
  hasChildRoute: boolean,
  reloadCampaignData: () => Promise<void>
) {
  const prevTabRef = useRef<TabValue | null>(null);
  const wasChildRouteRef = useRef(false);

  useEffect(() => {
    const comingFromOtherTab =
      tab === 'gm-tools' &&
      prevTabRef.current !== null &&
      prevTabRef.current !== 'gm-tools';

    const comingBackFromChildRoute =
      tab === 'gm-tools' && !hasChildRoute && wasChildRouteRef.current;

    if ((comingFromOtherTab || comingBackFromChildRoute) && !loading) {
      void reloadCampaignData();
    }

    prevTabRef.current = tab;
    wasChildRouteRef.current = hasChildRoute;
  }, [tab, loading, hasChildRoute, reloadCampaignData]);
}

function useCampaignAutoSave(
  performSave: () => Promise<void>,
  hasChanges: boolean,
  saving: boolean
) {
  const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!hasChanges || saving) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      void performSave();
    }, 2000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [hasChanges, saving, performSave]);

  const handleSave = useCallback(async () => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    await performSave();
  }, [performSave]);

  return { handleSave };
}

function useGeneratorHandler<TValue>(
  campaign: Campaign | null,
  reloadCampaignData: () => Promise<void>,
  action: (campaignId: string, payload: TValue) => Promise<unknown>,
  buildPayload: (value: string) => TValue
) {
  return useCallback(
    async (value: string) => {
      if (!campaign) return;
      await action(campaign.id, buildPayload(value));
      await reloadCampaignData();
    },
    [campaign, reloadCampaignData, action, buildPayload]
  );
}

function useCampaignDetailState(
  id: string,
  tab: TabValue,
  hasChildRoute: boolean
) {
  const { campaign, setCampaign, loading, reloadCampaignData } =
    useCampaignLoader(id);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  useGmToolsTabReload(tab, loading, hasChildRoute, reloadCampaignData);

  const updateFrame = useCallback(
    (updates: Partial<CampaignFrame>) => {
      setCampaign(current => {
        if (!current) {
          return current;
        }
        setHasChanges(true);
        return { ...current, frame: { ...current.frame, ...updates } };
      });
    },
    [setCampaign, setHasChanges]
  );

  // Perform the actual save
  const performSave = useCallback(async () => {
    if (!campaign || saving) return;
    setSaving(true);
    try {
      await updateCampaign(id, { name: campaign.name });
      await updateCampaignFrame(id, campaign.frame);
      setHasChanges(false);
    } finally {
      setSaving(false);
    }
  }, [campaign, id, saving]);

  const { handleSave } = useCampaignAutoSave(performSave, hasChanges, saving);

  const handleAddNPCFromGenerator = useGeneratorHandler(
    campaign,
    reloadCampaignData,
    addNPC,
    buildNPCPayload
  );

  const handleAddLocationFromGenerator = useGeneratorHandler(
    campaign,
    reloadCampaignData,
    addLocation,
    buildLocationPayload
  );

  const handleAddQuestFromGenerator = useGeneratorHandler(
    campaign,
    reloadCampaignData,
    addQuest,
    buildQuestPayload
  );

  const handleNameChange = useCallback(
    (value: string) => {
      setCampaign(current => {
        if (!current) {
          return current;
        }
        setHasChanges(true);
        return { ...current, name: value };
      });
    },
    [setCampaign, setHasChanges]
  );

  const handleChecklistChange = useCallback(
    (items: Campaign['sessionPrepChecklist']) => {
      setCampaign(current => {
        if (!current) {
          return current;
        }
        setHasChanges(true);
        return { ...current, sessionPrepChecklist: items };
      });
    },
    [setCampaign, setHasChanges]
  );

  const handleDeleteBattle = useCallback(
    async (battleId: string) => {
      if (!campaign) return;
      await deleteBattle(campaign.id, battleId);
      await reloadCampaignData();
    },
    [campaign, reloadCampaignData]
  );

  // Compute save status
  const saveStatus = saving ? 'saving' : hasChanges ? 'unsaved' : 'saved';

  return {
    campaign,
    loading,
    saving,
    hasChanges,
    saveStatus: saveStatus as 'saved' | 'unsaved' | 'saving',
    reloadCampaignData,
    updateFrame,
    handleSave,
    handleNameChange,
    handleChecklistChange,
    handleDeleteBattle,
    handleAddNPCFromGenerator,
    handleAddLocationFromGenerator,
    handleAddQuestFromGenerator,
  };
}

function CampaignTabs({
  tab,
  setActiveTab,
  frame,
  updateFrame,
  campaign,
  inviteLink,
  onCopyInviteCode,
  onCopyInviteLink,
  onSessionsChange,
  onNPCsChange,
  onLocationsChange,
  onQuestsChange,
  onAddNPC,
  onAddLocation,
  onAddQuest,
  onChecklistChange,
  onDeleteBattle,
}: CampaignTabsProps) {
  return (
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
        <TabsTrigger value="players">
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
        onSessionsChange={onSessionsChange}
      />
      <CharactersTabContent
        npcs={campaign.npcs ?? []}
        campaignId={campaign.id}
        onNPCsChange={onNPCsChange}
      />
      <LocationsTabContent
        locations={campaign.locations}
        campaignId={campaign.id}
        onLocationsChange={onLocationsChange}
      />
      <QuestsTabContent
        quests={campaign.quests}
        campaignId={campaign.id}
        onQuestsChange={onQuestsChange}
      />
      <GMToolsTabContent
        campaignId={campaign.id}
        battles={campaign.battles ?? []}
        sessionPrepChecklist={campaign.sessionPrepChecklist}
        onAddNPC={onAddNPC}
        onAddLocation={onAddLocation}
        onAddQuest={onAddQuest}
        onNavigateToTab={setActiveTab}
        onChecklistChange={onChecklistChange}
        onDeleteBattle={onDeleteBattle}
      />
      <SessionZeroTabContent frame={frame} updateFrame={updateFrame} />
      <PlayersTabContent
        campaign={campaign}
        inviteLink={inviteLink}
        onCopyInviteCode={onCopyInviteCode}
        onCopyInviteLink={onCopyInviteLink}
      />
    </Tabs>
  );
}

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
  const matches = useMatches();

  // Check if there's a child route (e.g., /battle) that should be rendered
  const hasChildRoute = matches.some(
    match =>
      match.routeId !== '/gm/campaigns/$id' &&
      match.routeId.startsWith('/gm/campaigns/$id/')
  );

  // All hooks must be called before any conditional returns
  const {
    campaign,
    loading,
    saving,
    hasChanges,
    saveStatus,
    reloadCampaignData,
    updateFrame,
    handleSave,
    handleNameChange,
    handleChecklistChange,
    handleDeleteBattle,
    handleAddNPCFromGenerator,
    handleAddLocationFromGenerator,
    handleAddQuestFromGenerator,
  } = useCampaignDetailState(id, tab, hasChildRoute);

  const setActiveTab = useCallback(
    (newTab: string) => {
      navigate({
        to: '/gm/campaigns/$id',
        params: { id },
        search: { tab: newTab as TabValue },
        replace: true,
      });
    },
    [id, navigate]
  );

  const handleBack = useCallback(() => {
    navigate({ to: '/gm/campaigns' });
  }, [navigate]);

  const copyInviteCode = useCallback(() => {
    if (campaign?.inviteCode) {
      navigator.clipboard.writeText(campaign.inviteCode);
    }
  }, [campaign]);

  const inviteLink = useMemo(() => {
    if (!campaign?.inviteCode) return '';
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/campaigns/join?code=${encodeURIComponent(
      campaign.inviteCode
    )}`;
  }, [campaign?.inviteCode]);

  const copyInviteLink = useCallback(() => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
    }
  }, [inviteLink]);

  // Now we can have conditional returns after all hooks are called

  // If there's a child route, render the Outlet to display it
  if (hasChildRoute) {
    return <Outlet />;
  }

  if (loading) {
    return <CampaignLoadingState />;
  }

  if (!campaign) {
    return <CampaignNotFoundState onBack={handleBack} />;
  }

  const frame = campaign.frame;

  return (
    <div className="container mx-auto max-w-7xl p-4">
      {/* Header */}
      <CampaignHeader
        campaign={campaign}
        saving={saving}
        hasChanges={hasChanges}
        saveStatus={saveStatus}
        onBack={handleBack}
        onNameChange={handleNameChange}
        onNameBlur={handleSave}
        onCopyInviteCode={copyInviteCode}
        onSave={handleSave}
      />

      <CampaignTabs
        tab={tab}
        setActiveTab={setActiveTab}
        frame={frame}
        updateFrame={updateFrame}
        campaign={campaign}
        inviteLink={inviteLink}
        onCopyInviteCode={copyInviteCode}
        onCopyInviteLink={copyInviteLink}
        onSessionsChange={reloadCampaignData}
        onNPCsChange={reloadCampaignData}
        onLocationsChange={reloadCampaignData}
        onQuestsChange={reloadCampaignData}
        onAddNPC={handleAddNPCFromGenerator}
        onAddLocation={handleAddLocationFromGenerator}
        onAddQuest={handleAddQuestFromGenerator}
        onChecklistChange={handleChecklistChange}
        onDeleteBattle={handleDeleteBattle}
      />
    </div>
  );
}
