// Campaign detail page - main component using extracted sub-components

import {
  createFileRoute,
  Outlet,
  useMatches,
  useNavigate,
} from '@tanstack/react-router';
import {
  Beaker,
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
  HomebrewTabContent,
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
  'homebrew',
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
  onFrameBlur: () => void;
  campaign: Campaign;
  inviteLink: string;
  onCopyInviteCode: () => void;
  onCopyInviteLink: () => void;
  onSaveStart: () => void;
  onPendingChange: () => void;
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
  changeVersion: number,
  saving: boolean
) {
  const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);
  const performSaveRef = useRef(performSave);

  // Keep a stable reference for cleanup
  useEffect(() => {
    performSaveRef.current = performSave;
  });

  useEffect(() => {
    if (changeVersion === 0 || saving) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      performSaveRef.current().catch(error => {
        if (isMountedRef.current) {
          console.error('[CampaignAutoSave] Failed to save:', error);
        }
      });
    }, 1000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [changeVersion, saving]);

  // Cleanup: flush pending save on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
        // Trigger save immediately on unmount if there were pending changes
        performSaveRef.current().catch(() => {
          // Silently ignore errors on unmount
        });
      }
    };
  }, []);

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
  const [directSaving, setDirectSaving] = useState(false);
  const [subformPendingChanges, setSubformPendingChanges] = useState(false);
  const [changeVersion, setChangeVersion] = useState(0);
  const hasChanges = changeVersion > 0;
  useGmToolsTabReload(tab, loading, hasChildRoute, reloadCampaignData);

  const updateFrame = useCallback(
    (updates: Partial<CampaignFrame>) => {
      setCampaign(current => {
        if (!current) {
          return current;
        }
        setChangeVersion(v => v + 1);
        return { ...current, frame: { ...current.frame, ...updates } };
      });
    },
    [setCampaign]
  );

  // Perform the actual save
  const performSave = useCallback(async () => {
    if (!campaign || saving) return;
    setSaving(true);
    try {
      await updateCampaign(id, { name: campaign.name });
      await updateCampaignFrame(id, campaign.frame);
      setChangeVersion(0);
    } finally {
      setSaving(false);
    }
  }, [campaign, id, saving]);

  const { handleSave } = useCampaignAutoSave(
    performSave,
    changeVersion,
    saving
  );

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
        setChangeVersion(v => v + 1);
        return { ...current, name: value };
      });
    },
    [setCampaign]
  );

  const handleChecklistChange = useCallback(
    (items: Campaign['sessionPrepChecklist']) => {
      setCampaign(current => {
        if (!current) {
          return current;
        }
        setChangeVersion(v => v + 1);
        return { ...current, sessionPrepChecklist: items };
      });
    },
    [setCampaign]
  );

  const handleDeleteBattle = useCallback(
    async (battleId: string) => {
      if (!campaign) return;
      setDirectSaving(true);
      try {
        await deleteBattle(campaign.id, battleId);
        await reloadCampaignData();
      } finally {
        setDirectSaving(false);
      }
    },
    [campaign, reloadCampaignData]
  );

  // markSaving is called before the storage operation starts
  const markSaving = useCallback(() => {
    setDirectSaving(true);
  }, []);

  // markPendingChange is called when a subform has unsaved changes
  const markPendingChange = useCallback(() => {
    setSubformPendingChanges(true);
  }, []);

  // Called after the storage operation completes to reload data and clear saving state
  const handleDirectSaveChange = useCallback(async () => {
    try {
      await reloadCampaignData();
    } finally {
      setDirectSaving(false);
      setSubformPendingChanges(false);
    }
  }, [reloadCampaignData]);

  // Compute save status - directSaving takes precedence for immediate feedback
  const saveStatus =
    saving || directSaving
      ? 'saving'
      : hasChanges || subformPendingChanges
        ? 'unsaved'
        : 'saved';

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
    handleDirectSaveChange,
    markSaving,
    markPendingChange,
  };
}

function CampaignTabs({
  tab,
  setActiveTab,
  frame,
  updateFrame,
  onFrameBlur,
  campaign,
  inviteLink,
  onCopyInviteCode,
  onCopyInviteLink,
  onSaveStart,
  onPendingChange,
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
        <TabsTrigger value="homebrew">
          <Beaker className="mr-2 h-4 w-4" />
          Homebrew
        </TabsTrigger>
        <TabsTrigger value="players">
          <Users className="mr-2 h-4 w-4" />
          Players
        </TabsTrigger>
      </TabsList>

      <OverviewTabContent
        frame={frame}
        updateFrame={updateFrame}
        onBlur={onFrameBlur}
      />
      <WorldTabContent
        frame={frame}
        updateFrame={updateFrame}
        onBlur={onFrameBlur}
      />
      <MechanicsTabContent
        frame={frame}
        updateFrame={updateFrame}
        onBlur={onFrameBlur}
      />
      <SessionsTabContent
        sessions={campaign.sessions ?? []}
        npcs={campaign.npcs ?? []}
        campaignId={campaign.id}
        onSaveStart={onSaveStart}
        onPendingChange={onPendingChange}
        onSessionsChange={onSessionsChange}
      />
      <CharactersTabContent
        npcs={campaign.npcs ?? []}
        campaignId={campaign.id}
        onSaveStart={onSaveStart}
        onPendingChange={onPendingChange}
        onNPCsChange={onNPCsChange}
      />
      <LocationsTabContent
        locations={campaign.locations}
        campaignId={campaign.id}
        onSaveStart={onSaveStart}
        onPendingChange={onPendingChange}
        onLocationsChange={onLocationsChange}
      />
      <QuestsTabContent
        quests={campaign.quests}
        campaignId={campaign.id}
        onSaveStart={onSaveStart}
        onPendingChange={onPendingChange}
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
      <SessionZeroTabContent
        frame={frame}
        updateFrame={updateFrame}
        onBlur={onFrameBlur}
      />
      <HomebrewTabContent campaignId={campaign.id} />
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
    updateFrame,
    handleSave,
    handleNameChange,
    handleChecklistChange,
    handleDeleteBattle,
    handleAddNPCFromGenerator,
    handleAddLocationFromGenerator,
    handleAddQuestFromGenerator,
    handleDirectSaveChange,
    markSaving,
    markPendingChange,
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
        onFrameBlur={handleSave}
        campaign={campaign}
        inviteLink={inviteLink}
        onCopyInviteCode={copyInviteCode}
        onCopyInviteLink={copyInviteLink}
        onSaveStart={markSaving}
        onPendingChange={markPendingChange}
        onSessionsChange={handleDirectSaveChange}
        onNPCsChange={handleDirectSaveChange}
        onLocationsChange={handleDirectSaveChange}
        onQuestsChange={handleDirectSaveChange}
        onAddNPC={handleAddNPCFromGenerator}
        onAddLocation={handleAddLocationFromGenerator}
        onAddQuest={handleAddQuestFromGenerator}
        onChecklistChange={handleChecklistChange}
        onDeleteBattle={handleDeleteBattle}
      />
    </div>
  );
}
