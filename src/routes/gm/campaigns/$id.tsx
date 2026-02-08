// Campaign detail page - main component using extracted sub-components

import {
  createFileRoute,
  type ErrorComponentProps,
  Outlet,
  useMatches,
  useNavigate,
} from '@tanstack/react-router';
import {
  Beaker,
  BookOpen,
  Building2,
  CalendarDays,
  ChefHat,
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
import { toast } from 'sonner';
import { z } from 'zod';
import {
  BeastFeastTabContent,
  CalendarTabContent,
  CampaignHeader,
  CharactersTabContent,
  GMToolsTabContent,
  HomebrewTabContent,
  LocationsTabContent,
  MechanicsTabContent,
  OrganizationsTabContent,
  OverviewTabContent,
  PlayersTabContent,
  QuestsTabContent,
  SessionsTabContent,
  SessionZeroTabContent,
  WorldTabContent,
} from '@/components/campaign-detail';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RouteErrorFallback } from '@/components/ui/route-error-fallback';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  addLocation,
  addNPC,
  addQuest,
  deleteBattle,
  getCampaign,
  updateCampaign,
  updateCampaignFrame,
} from '@/features/campaigns/campaign-storage';
import type {
  Campaign,
  CampaignFrame,
  CampaignPhase,
} from '@/lib/schemas/campaign';

const validTabs = [
  'overview',
  'world',
  'mechanics',
  'sessions',
  'characters',
  'locations',
  'quests',
  'organizations',
  'session-zero',
  'gm-tools',
  'homebrew',
  'beast-feast',
  'calendar',
  'players',
] as const;

type TabValue = (typeof validTabs)[number];

type AddNPCInput = Parameters<typeof addNPC>[1];
type AddLocationInput = Parameters<typeof addLocation>[1];
type AddQuestInput = Parameters<typeof addQuest>[1];

const buildNPCPayload = (
  name: string,
  extra?: { personality?: string; motivation?: string }
): AddNPCInput => ({
  name,
  titleRole: '',
  description: '',
  personality: extra?.personality ?? '',
  motivation: extra?.motivation ?? '',
  backgroundHistory: '',
  secrets: '',
  connections: [],
  locationIds: [],
  organizationIds: [],
  allyNpcIds: [],
  enemyNpcIds: [],
  allyOrganizationIds: [],
  enemyOrganizationIds: [],
  status: 'active',
  faction: '',
  notes: '',
  sessionAppearances: [],
  questAppearances: [],
  tags: [],
  role: 'neutral',
  features: [],
  disposition: 'neutral',
});

const buildLocationPayload = (name: string): AddLocationInput => ({
  name,
  type: 'other',
  description: '',
  historyLore: '',
  secrets: '',
  currentState: '',
  connectedLocations: [],
  npcIds: [],
  npcsPresentCustom: [],
  organizationIds: [],
  questIds: [],
  questsAvailableCustom: [],
  sessionAppearances: [],
  pointsOfInterest: [],
  tags: [],
  notes: '',
  atmosphere: '',
});

const buildQuestPayload = (title: string): AddQuestInput => ({
  title,
  type: 'hook',
  status: 'available',
  description: '',
  objectives: [],
  rewards: [],
  giver: '',
  location: '',
  npcsInvolved: [],
  charactersInvolved: [],
  locationIds: [],
  organizationIds: [],
  sessionIds: [],
  relatedNpcs: [],
  relatedNpcsCustom: [],
  relatedLocations: [],
  relatedLocationsCustom: [],
  sessionAppearances: [],
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
  onStoryThreadsChange: () => void;
  onOrganizationsChange: () => void;
  onAddNPC: (
    name: string,
    extra?: { personality?: string; motivation?: string }
  ) => void | Promise<void>;
  onAddLocation: (name: string) => void | Promise<void>;
  onAddQuest: (title: string) => void | Promise<void>;
  onChecklistChange: (items: Campaign['sessionPrepChecklist']) => void;
  onSessionZeroChange: (
    sessionZero: NonNullable<Campaign['sessionZero']>
  ) => void;
  onDeleteBattle: (battleId: string) => void | Promise<void>;
  onPartyInventoryChange: (items: Campaign['partyInventory']) => void;
  onPlayersChange: (players: Campaign['players']) => void;
  setCampaign: React.Dispatch<React.SetStateAction<Campaign | null>>;
  markChanged: () => void;
};

function CampaignLoadingState() {
  return (
    <div className="container mx-auto space-y-4 px-4 py-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-muted h-8 w-8 animate-pulse rounded" />
          <div className="bg-muted h-8 w-60 animate-pulse rounded" />
          <div className="bg-muted h-5 w-16 animate-pulse rounded-full" />
        </div>
        <div className="bg-muted h-9 w-28 animate-pulse rounded" />
      </div>
      {/* Tab bar skeleton */}
      <div className="flex gap-1 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-muted h-9 w-20 animate-pulse rounded"
            style={{ animationDelay: `${i * 50}ms` }}
          />
        ))}
      </div>
      {/* Content skeleton */}
      <div className="space-y-4">
        <div className="bg-muted h-32 animate-pulse rounded-lg" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-muted h-40 animate-pulse rounded-lg" />
          <div className="bg-muted h-40 animate-pulse rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function CampaignNotFoundState({ onBack }: { onBack: () => void }) {
  return (
    <div className="container mx-auto px-4 py-4">
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
          toast.error('Failed to save campaign');
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
  buildPayload: (value: string) => TValue,
  entityLabel = 'Item'
) {
  return useCallback(
    async (value: string) => {
      if (!campaign) return;
      await action(campaign.id, buildPayload(value));
      await reloadCampaignData();
      toast.success(`${entityLabel} "${value}" created`);
    },
    [campaign, reloadCampaignData, action, buildPayload, entityLabel]
  );
}

// eslint-disable-next-line max-lines-per-function
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
      await updateCampaign(id, {
        name: campaign.name,
        phase: campaign.phase,
        beastFeastEnabled: campaign.beastFeastEnabled,
        calendarEnabled: campaign.calendarEnabled,
        calendar: campaign.calendar,
      });
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

  const handleAddNPCFromGenerator = useCallback(
    async (
      name: string,
      extra?: { personality?: string; motivation?: string }
    ) => {
      if (!campaign) return;
      await addNPC(campaign.id, buildNPCPayload(name, extra));
      await reloadCampaignData();
      toast.success(`NPC "${name}" created`);
    },
    [campaign, reloadCampaignData]
  );

  const handleAddLocationFromGenerator = useGeneratorHandler(
    campaign,
    reloadCampaignData,
    addLocation,
    buildLocationPayload,
    'Location'
  );

  const handleAddQuestFromGenerator = useGeneratorHandler(
    campaign,
    reloadCampaignData,
    addQuest,
    buildQuestPayload,
    'Quest'
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

  const handlePhaseChange = useCallback(
    (phase: CampaignPhase) => {
      setCampaign(current => {
        if (!current) {
          return current;
        }
        setChangeVersion(v => v + 1);
        return { ...current, phase };
      });
    },
    [setCampaign]
  );

  const handleBeastFeastToggle = useCallback(
    (enabled: boolean) => {
      setCampaign(current => {
        if (!current) return current;
        setChangeVersion(v => v + 1);
        return { ...current, beastFeastEnabled: enabled };
      });
    },
    [setCampaign]
  );

  const handleCalendarToggle = useCallback(
    (enabled: boolean) => {
      setCampaign(current => {
        if (!current) return current;
        setChangeVersion(v => v + 1);
        return { ...current, calendarEnabled: enabled };
      });
    },
    [setCampaign]
  );

  const markChanged = useCallback(() => {
    setChangeVersion(v => v + 1);
  }, []);

  const handleSessionZeroChange = useCallback(
    (sessionZero: NonNullable<Campaign['sessionZero']>) => {
      setCampaign(current => {
        if (!current) {
          return current;
        }
        setChangeVersion(v => v + 1);
        return { ...current, sessionZero };
      });
    },
    [setCampaign]
  );

  const handlePartyInventoryChange = useCallback(
    (partyInventory: Campaign['partyInventory']) => {
      setCampaign(current => {
        if (!current) {
          return current;
        }
        setChangeVersion(v => v + 1);
        return { ...current, partyInventory };
      });
    },
    [setCampaign]
  );

  const handlePlayersChange = useCallback(
    (players: Campaign['players']) => {
      setCampaign(current => {
        if (!current) {
          return current;
        }
        setChangeVersion(v => v + 1);
        return { ...current, players };
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
        toast.success('Battle deleted');
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
    handlePhaseChange,
    handleBeastFeastToggle,
    handleCalendarToggle,
    setCampaign,
    markChanged,
    handleChecklistChange,
    handleSessionZeroChange,
    handleDeleteBattle,
    handlePartyInventoryChange,
    handlePlayersChange,
    handleAddNPCFromGenerator,
    handleAddLocationFromGenerator,
    handleAddQuestFromGenerator,
    handleDirectSaveChange,
    markSaving,
    markPendingChange,
  };
}

const MAX_PREVIEW_NAMES = 3;

function buildNamesTooltip(
  label: string,
  items: { name: string }[]
): string | undefined {
  if (items.length === 0) return undefined;
  const plural = `${label}${items.length === 1 ? '' : 's'}`;
  const names = items.slice(0, MAX_PREVIEW_NAMES).map(i => i.name);
  const suffix =
    items.length > MAX_PREVIEW_NAMES
      ? `, +${String(items.length - MAX_PREVIEW_NAMES)} more`
      : '';
  return `${String(items.length)} ${plural}: ${names.join(', ')}${suffix}`;
}

function buildSessionsTooltip(
  sessions: { date?: string; status: string }[]
): string | undefined {
  if (sessions.length === 0) return undefined;
  const label = sessions.length === 1 ? 'session' : 'sessions';
  const lastPlayed = [...sessions]
    .filter(s => s.date)
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
    .at(0);
  if (lastPlayed?.date) {
    const formatted = new Date(lastPlayed.date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
    return `${String(sessions.length)} ${label}, last played ${formatted}`;
  }
  return `${String(sessions.length)} ${label}`;
}

function buildQuestsTooltip(quests: { status: string }[]): string | undefined {
  if (quests.length === 0) return undefined;
  const active = quests.filter(q => q.status === 'active').length;
  const completed = quests.filter(q => q.status === 'completed').length;
  const parts: string[] = [];
  if (active > 0) parts.push(`${String(active)} active`);
  if (completed > 0) parts.push(`${String(completed)} completed`);
  if (parts.length === 0)
    return `${String(quests.length)} quest${quests.length === 1 ? '' : 's'}`;
  return parts.join(', ');
}

function TabCountBadge({
  count,
  tooltip,
}: {
  count: number;
  tooltip?: string;
}) {
  if (count === 0) return null;
  const badge = (
    <span className="bg-muted-foreground/20 text-muted-foreground ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none font-medium">
      {count}
    </span>
  );
  if (!tooltip) return badge;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{badge}</TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={4}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

// eslint-disable-next-line max-lines-per-function, complexity
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
  onStoryThreadsChange,
  onOrganizationsChange,
  onAddNPC,
  onAddLocation,
  onAddQuest,
  onChecklistChange,
  onSessionZeroChange,
  onDeleteBattle,
  onPartyInventoryChange,
  onPlayersChange,
  setCampaign,
  markChanged,
}: CampaignTabsProps) {
  return (
    <Tabs value={tab} onValueChange={setActiveTab}>
      <TabsList className="scrollbar-thin mb-4 h-auto w-full justify-start gap-0.5 overflow-x-auto overflow-y-hidden scroll-smooth p-1 pr-6">
        <TabsTrigger value="overview">
          <Map className="h-4 w-4 text-sky-500" />
          <span className="ml-2 hidden lg:inline">Overview</span>
        </TabsTrigger>
        <TabsTrigger value="world">
          <BookOpen className="h-4 w-4 text-emerald-500" />
          <span className="ml-2 hidden lg:inline">World</span>
        </TabsTrigger>
        <TabsTrigger value="mechanics">
          <Sparkles className="h-4 w-4 text-violet-500" />
          <span className="ml-2 hidden lg:inline">Mechanics</span>
        </TabsTrigger>
        <TabsTrigger value="sessions">
          <Scroll className="h-4 w-4 text-amber-500" />
          <span className="ml-2 hidden lg:inline">Sessions</span>
          <TabCountBadge
            count={(campaign.sessions ?? []).length}
            tooltip={buildSessionsTooltip(campaign.sessions ?? [])}
          />
        </TabsTrigger>
        <TabsTrigger value="characters">
          <User className="h-4 w-4 text-blue-500" />
          <span className="ml-2 hidden lg:inline">NPCs</span>
          <TabCountBadge
            count={(campaign.npcs ?? []).length}
            tooltip={buildNamesTooltip('NPC', campaign.npcs ?? [])}
          />
        </TabsTrigger>
        <TabsTrigger value="locations">
          <MapPin className="h-4 w-4 text-rose-500" />
          <span className="ml-2 hidden lg:inline">Locations</span>
          <TabCountBadge
            count={(campaign.locations ?? []).length}
            tooltip={buildNamesTooltip('location', campaign.locations ?? [])}
          />
        </TabsTrigger>
        <TabsTrigger value="quests">
          <Target className="h-4 w-4 text-orange-500" />
          <span className="ml-2 hidden lg:inline">Quests</span>
          <TabCountBadge
            count={(campaign.quests ?? []).length}
            tooltip={buildQuestsTooltip(campaign.quests ?? [])}
          />
        </TabsTrigger>
        <TabsTrigger value="organizations">
          <Building2 className="h-4 w-4 text-indigo-500" />
          <span className="ml-2 hidden lg:inline">Orgs</span>
          <TabCountBadge
            count={(campaign.organizations ?? []).length}
            tooltip={buildNamesTooltip('org', campaign.organizations ?? [])}
          />
        </TabsTrigger>
        <TabsTrigger value="session-zero">
          <MessageSquare className="h-4 w-4 text-cyan-500" />
          <span className="ml-2 hidden lg:inline">Session 0</span>
        </TabsTrigger>
        <TabsTrigger value="gm-tools">
          <Lightbulb className="h-4 w-4 text-yellow-500" />
          <span className="ml-2 hidden lg:inline">Tools</span>
        </TabsTrigger>
        <TabsTrigger value="homebrew">
          <Beaker className="h-4 w-4 text-purple-500" />
          <span className="ml-2 hidden lg:inline">Homebrew</span>
        </TabsTrigger>
        {campaign.beastFeastEnabled && (
          <TabsTrigger value="beast-feast">
            <ChefHat className="h-4 w-4 text-orange-500" />
            <span className="ml-2 hidden lg:inline">Beast Feast</span>
          </TabsTrigger>
        )}
        {campaign.calendarEnabled && (
          <TabsTrigger value="calendar">
            <CalendarDays className="h-4 w-4 text-teal-500" />
            <span className="ml-2 hidden lg:inline">Calendar</span>
          </TabsTrigger>
        )}
        <TabsTrigger value="players">
          <Users className="h-4 w-4 text-green-500" />
          <span className="ml-2 hidden lg:inline">Players</span>
          <TabCountBadge
            count={(campaign.players ?? []).length}
            tooltip={buildNamesTooltip('player', campaign.players ?? [])}
          />
        </TabsTrigger>
      </TabsList>

      {tab === 'overview' && (
        <OverviewTabContent
          frame={frame}
          updateFrame={updateFrame}
          onBlur={onFrameBlur}
        />
      )}
      {tab === 'world' && (
        <WorldTabContent
          frame={frame}
          updateFrame={updateFrame}
          onBlur={onFrameBlur}
        />
      )}
      {tab === 'mechanics' && (
        <MechanicsTabContent
          frame={frame}
          updateFrame={updateFrame}
          onBlur={onFrameBlur}
        />
      )}
      {tab === 'sessions' && (
        <SessionsTabContent
          sessions={campaign.sessions ?? []}
          npcs={campaign.npcs ?? []}
          locations={campaign.locations}
          quests={campaign.quests}
          organizations={campaign.organizations ?? []}
          campaignId={campaign.id}
          onSaveStart={onSaveStart}
          onPendingChange={onPendingChange}
          onSessionsChange={onSessionsChange}
        />
      )}
      {tab === 'characters' && (
        <CharactersTabContent
          npcs={campaign.npcs ?? []}
          locations={campaign.locations}
          quests={campaign.quests}
          sessions={campaign.sessions}
          organizations={campaign.organizations ?? []}
          campaignId={campaign.id}
          onSaveStart={onSaveStart}
          onPendingChange={onPendingChange}
          onNPCsChange={onNPCsChange}
        />
      )}
      {tab === 'locations' && (
        <LocationsTabContent
          locations={campaign.locations}
          npcs={campaign.npcs ?? []}
          quests={campaign.quests}
          sessions={campaign.sessions}
          organizations={campaign.organizations ?? []}
          campaignId={campaign.id}
          onSaveStart={onSaveStart}
          onPendingChange={onPendingChange}
          onLocationsChange={onLocationsChange}
        />
      )}
      {tab === 'quests' && (
        <QuestsTabContent
          quests={campaign.quests}
          storyThreads={campaign.storyThreads ?? []}
          npcs={campaign.npcs ?? []}
          locations={campaign.locations}
          sessions={campaign.sessions}
          organizations={campaign.organizations ?? []}
          campaignId={campaign.id}
          onSaveStart={onSaveStart}
          onPendingChange={onPendingChange}
          onQuestsChange={onQuestsChange}
          onStoryThreadsChange={onStoryThreadsChange}
        />
      )}
      {tab === 'organizations' && (
        <OrganizationsTabContent
          organizations={campaign.organizations ?? []}
          npcs={campaign.npcs ?? []}
          locations={campaign.locations}
          quests={campaign.quests}
          campaignId={campaign.id}
          onSaveStart={onSaveStart}
          onPendingChange={onPendingChange}
          onOrganizationsChange={onOrganizationsChange}
          onNPCsChange={onNPCsChange}
          onLocationsChange={onLocationsChange}
          onQuestsChange={onQuestsChange}
        />
      )}
      {tab === 'gm-tools' && (
        <GMToolsTabContent
          campaignId={campaign.id}
          battles={campaign.battles ?? []}
          playerNames={(campaign.players ?? []).map(p => p.name)}
          sessionPrepChecklist={campaign.sessionPrepChecklist}
          onAddNPC={onAddNPC}
          onAddLocation={onAddLocation}
          onAddQuest={onAddQuest}
          onNavigateToTab={setActiveTab}
          onChecklistChange={onChecklistChange}
          onDeleteBattle={onDeleteBattle}
        />
      )}
      {tab === 'session-zero' && (
        <SessionZeroTabContent
          frame={frame}
          updateFrame={updateFrame}
          sessionZero={campaign.sessionZero}
          onSessionZeroChange={onSessionZeroChange}
          onBlur={onFrameBlur}
        />
      )}
      {tab === 'homebrew' && <HomebrewTabContent campaignId={campaign.id} />}
      {tab === 'beast-feast' && campaign.beastFeastEnabled && (
        <BeastFeastTabContent campaignId={campaign.id} />
      )}
      {tab === 'calendar' && campaign.calendarEnabled && (
        <CalendarTabContent
          campaign={campaign}
          setCampaign={setCampaign}
          markChanged={markChanged}
        />
      )}
      {tab === 'players' && (
        <PlayersTabContent
          campaign={campaign}
          inviteLink={inviteLink}
          onCopyInviteCode={onCopyInviteCode}
          onCopyInviteLink={onCopyInviteLink}
          onUpdatePartyInventory={onPartyInventoryChange}
          onUpdatePlayers={onPlayersChange}
        />
      )}
    </Tabs>
  );
}

export const Route = createFileRoute('/gm/campaigns/$id')({
  component: CampaignDetailPage,
  errorComponent: ({ error }: ErrorComponentProps) => (
    <RouteErrorFallback error={error} />
  ),
  validateSearch: z.object({
    tab: z.enum(validTabs).catch('overview'),
  }),
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
    handlePhaseChange,
    handleBeastFeastToggle,
    handleCalendarToggle,
    setCampaign,
    markChanged,
    handleChecklistChange,
    handleSessionZeroChange,
    handleDeleteBattle,
    handlePartyInventoryChange,
    handlePlayersChange,
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

  const copyInviteCode = useCallback(async () => {
    if (campaign?.inviteCode) {
      try {
        await navigator.clipboard.writeText(campaign.inviteCode);
        toast.success('Invite code copied');
      } catch {
        toast.error('Failed to copy — try selecting the text manually');
      }
    }
  }, [campaign]);

  const inviteLink = useMemo(() => {
    if (!campaign?.inviteCode) return '';
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/campaigns/join?code=${encodeURIComponent(
      campaign.inviteCode
    )}`;
  }, [campaign?.inviteCode]);

  const copyInviteLink = useCallback(async () => {
    if (inviteLink) {
      try {
        await navigator.clipboard.writeText(inviteLink);
        toast.success('Invite link copied');
      } catch {
        toast.error('Failed to copy — try selecting the text manually');
      }
    }
  }, [inviteLink]);

  // Ctrl+S / Cmd+S keyboard shortcut to force-save
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSave]);

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
    <div className="container mx-auto px-4 py-4">
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
        onPhaseChange={handlePhaseChange}
        onBeastFeastToggle={handleBeastFeastToggle}
        onCalendarToggle={handleCalendarToggle}
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
        onStoryThreadsChange={handleDirectSaveChange}
        onOrganizationsChange={handleDirectSaveChange}
        onAddNPC={handleAddNPCFromGenerator}
        onAddLocation={handleAddLocationFromGenerator}
        onAddQuest={handleAddQuestFromGenerator}
        onChecklistChange={handleChecklistChange}
        onSessionZeroChange={handleSessionZeroChange}
        onDeleteBattle={handleDeleteBattle}
        onPartyInventoryChange={handlePartyInventoryChange}
        onPlayersChange={handlePlayersChange}
        setCampaign={setCampaign}
        markChanged={markChanged}
      />
    </div>
  );
}
