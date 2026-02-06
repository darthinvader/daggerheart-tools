import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { useCampaignHomebrewContent } from '@/features/homebrew';
import { ADVERSARIES } from '@/lib/data/adversaries';
import { ENVIRONMENTS } from '@/lib/data/environments';
import type { Adversary } from '@/lib/schemas/adversaries';
import type { Environment } from '@/lib/schemas/environments';

import type {
  AdversaryTracker,
  CharacterTracker,
  EnvironmentTracker,
  NewCharacterDraft,
  RollHistoryEntry,
  SpotlightHistoryEntry,
  TrackerItem,
  TrackerSelection,
} from './types';
import {
  DEFAULT_CHARACTER_DRAFT,
  EMPTY_CONDITIONS,
  normalizeEnvironmentFeature,
  toNumber,
} from './utils';

function createCharacterEntry(
  draft: NewCharacterDraft
): CharacterTracker | null {
  const name = draft.name.trim();
  if (!name) return null;
  const hpMax = toNumber(draft.hpMax, 6);
  const stressMax = toNumber(draft.stressMax, 6);
  const evasion = toNumber(draft.evasion, 10);
  return {
    id: crypto.randomUUID(),
    kind: 'character',
    name,
    evasion,
    hp: { current: hpMax, max: hpMax },
    stress: { current: stressMax, max: stressMax },
    conditions: EMPTY_CONDITIONS,
    notes: '',
  };
}

function createAdversaryEntry(adversary: Adversary): AdversaryTracker {
  return {
    id: crypto.randomUUID(),
    kind: 'adversary',
    source: adversary,
    hp: { current: adversary.hp, max: adversary.hp },
    stress: { current: adversary.stress, max: adversary.stress },
    conditions: EMPTY_CONDITIONS,
    notes: '',
  };
}

function createEnvironmentEntry(environment: Environment): EnvironmentTracker {
  return {
    id: crypto.randomUUID(),
    kind: 'environment',
    source: environment,
    notes: '',
    features: environment.features.map((feature, index) =>
      normalizeEnvironmentFeature(feature, index)
    ),
  };
}

function resolveSelectedItem(
  selection: TrackerSelection | null,
  characters: CharacterTracker[],
  adversaries: AdversaryTracker[],
  environments: EnvironmentTracker[]
): TrackerItem | null {
  if (!selection) return null;
  if (selection.kind === 'character') {
    return characters.find(item => item.id === selection.id) ?? null;
  }
  if (selection.kind === 'adversary') {
    return adversaries.find(item => item.id === selection.id) ?? null;
  }
  return environments.find(item => item.id === selection.id) ?? null;
}

function updateSpotlightHistory(
  previous: TrackerSelection[],
  next: TrackerSelection
) {
  const filtered = previous.filter(
    entry => !(entry.kind === next.kind && entry.id === next.id)
  );
  return [next, ...filtered].slice(0, 5);
}

function getEntityName(
  selection: TrackerSelection,
  characters: CharacterTracker[],
  adversaries: AdversaryTracker[],
  environments: EnvironmentTracker[]
): string {
  if (selection.kind === 'character') {
    return characters.find(c => c.id === selection.id)?.name ?? 'Unknown';
  }
  if (selection.kind === 'adversary') {
    return (
      adversaries.find(a => a.id === selection.id)?.source.name ?? 'Unknown'
    );
  }
  return (
    environments.find(e => e.id === selection.id)?.source.name ?? 'Unknown'
  );
}

function updateSpotlightHistoryTimeline(
  previous: SpotlightHistoryEntry[],
  next: TrackerSelection,
  entityName: string,
  currentRound: number
): SpotlightHistoryEntry[] {
  const newEntry: SpotlightHistoryEntry = {
    selection: next,
    timestamp: Date.now(),
    round: currentRound,
    entityName,
  };
  return [newEntry, ...previous].slice(0, 50); // Keep last 50 entries
}

function addEntry<T extends TrackerItem>(
  entry: T,
  setItems: Dispatch<SetStateAction<T[]>>,
  setSelection: Dispatch<SetStateAction<TrackerSelection | null>>
) {
  setItems(prev => [...prev, entry]);
  setSelection({ kind: entry.kind, id: entry.id });
}

function updateEntryById<T extends { id: string }>(
  id: string,
  updater: (prev: T) => T,
  setItems: Dispatch<SetStateAction<T[]>>
) {
  setItems(prev =>
    prev.map(entry => (entry.id === id ? updater(entry) : entry))
  );
}

function removeRosterItem(
  item: TrackerItem,
  selection: TrackerSelection | null,
  spotlight: TrackerSelection | null,
  setCharacters: Dispatch<SetStateAction<CharacterTracker[]>>,
  setAdversaries: Dispatch<SetStateAction<AdversaryTracker[]>>,
  setEnvironments: Dispatch<SetStateAction<EnvironmentTracker[]>>,
  setSelection: Dispatch<SetStateAction<TrackerSelection | null>>,
  setSpotlight: Dispatch<SetStateAction<TrackerSelection | null>>,
  setSpotlightHistory: Dispatch<SetStateAction<TrackerSelection[]>>
) {
  if (item.kind === 'character') {
    setCharacters(prev => prev.filter(entry => entry.id !== item.id));
  }
  if (item.kind === 'adversary') {
    setAdversaries(prev => prev.filter(entry => entry.id !== item.id));
  }
  if (item.kind === 'environment') {
    setEnvironments(prev => prev.filter(entry => entry.id !== item.id));
  }
  if (selection?.id === item.id && selection.kind === item.kind) {
    setSelection(null);
  }
  if (spotlight?.id === item.id && spotlight.kind === item.kind) {
    setSpotlight(null);
  }
  setSpotlightHistory(prev =>
    prev.filter(entry => !(entry.kind === item.kind && entry.id === item.id))
  );
}

export function useBattleRosterState() {
  const [characters, setCharacters] = useState<CharacterTracker[]>([]);
  const [adversaries, setAdversaries] = useState<AdversaryTracker[]>([]);
  const [environments, setEnvironments] = useState<EnvironmentTracker[]>([]);
  const [selection, setSelection] = useState<TrackerSelection | null>(null);
  const [spotlight, setSpotlight] = useState<TrackerSelection | null>(null);
  const [spotlightHistory, setSpotlightHistory] = useState<TrackerSelection[]>(
    []
  );
  const [spotlightHistoryTimeline, setSpotlightHistoryTimeline] = useState<
    SpotlightHistoryEntry[]
  >([]);
  const [rollHistory, setRollHistory] = useState<RollHistoryEntry[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [fearPool, setFearPool] = useState(0); // GM Fear pool
  /**
   * Custom max fear value. If undefined, defaults to 2 * party size.
   * Per Daggerheart rules, fear caps are typically based on party size.
   */
  const [maxFear, setMaxFear] = useState<number | undefined>(undefined);
  const [useMassiveThreshold, setUseMassiveThreshold] = useState(false); // Global massive threshold toggle
  const [rosterVersion, setRosterVersion] = useState(0);
  const [activeRosterTab, setActiveRosterTab] = useState<
    'characters' | 'adversaries' | 'environments'
  >('characters');
  const [activeDetailTab, setActiveDetailTab] = useState<'quick' | 'details'>(
    'quick'
  );
  const bumpRosterVersion = useCallback(() => {
    setRosterVersion(prev => prev + 1);
  }, []);
  const selectedItem = useMemo(() => {
    return resolveSelectedItem(
      selection,
      characters,
      adversaries,
      environments
    );
  }, [selection, characters, adversaries, environments]);
  const handleSelect = (item: TrackerItem) => {
    setSelection({ kind: item.kind, id: item.id });
  };
  const handleSpotlight = (item: TrackerItem) => {
    const next = { kind: item.kind, id: item.id } as TrackerSelection;
    const entityName = getEntityName(
      next,
      characters,
      adversaries,
      environments
    );
    setSpotlight(next);
    setSpotlightHistory(prev => updateSpotlightHistory(prev, next));
    setSpotlightHistoryTimeline(prev =>
      updateSpotlightHistoryTimeline(prev, next, entityName, currentRound)
    );
    bumpRosterVersion();
  };
  const handleRemove = (item: TrackerItem) => {
    removeRosterItem(
      item,
      selection,
      spotlight,
      setCharacters,
      setAdversaries,
      setEnvironments,
      setSelection,
      setSpotlight,
      setSpotlightHistory
    );
    bumpRosterVersion();
  };
  const addCharacter = (draft: NewCharacterDraft) => {
    const entry = createCharacterEntry(draft);
    if (!entry) return null;
    addEntry(entry, setCharacters, setSelection);
    bumpRosterVersion();
    return entry.id;
  };
  const addAdversary = (adversary: Adversary) => {
    const entry = createAdversaryEntry(adversary);
    addEntry(entry, setAdversaries, setSelection);
    bumpRosterVersion();
  };
  const addEnvironment = (environment: Environment) => {
    const entry = createEnvironmentEntry(environment);
    addEntry(entry, setEnvironments, setSelection);
    bumpRosterVersion();
  };
  const updateCharacter = (
    id: string,
    updater: (prev: CharacterTracker) => CharacterTracker
  ) => {
    updateEntryById(id, updater, setCharacters);
    bumpRosterVersion();
  };
  const updateAdversary = (
    id: string,
    updater: (prev: AdversaryTracker) => AdversaryTracker
  ) => {
    updateEntryById(id, updater, setAdversaries);
    bumpRosterVersion();
  };
  const updateEnvironment = (
    id: string,
    updater: (prev: EnvironmentTracker) => EnvironmentTracker
  ) => {
    updateEntryById(id, updater, setEnvironments);
    bumpRosterVersion();
  };

  return {
    rosterState: {
      characters,
      adversaries,
      environments,
      selection,
      spotlight,
      spotlightHistory,
      spotlightHistoryTimeline,
      rollHistory,
      currentRound,
      fearPool,
      maxFear,
      useMassiveThreshold,
      rosterVersion,
      activeRosterTab,
      activeDetailTab,
      selectedItem,
    },
    rosterActions: {
      setActiveRosterTab,
      setActiveDetailTab,
      setSpotlight: (value: TrackerSelection | null) => {
        setSpotlight(value);
        bumpRosterVersion();
      },
      setFearPool: (value: number) => {
        setFearPool(value);
        bumpRosterVersion();
      },
      spendFear: (amount: number): boolean => {
        let succeeded = false;
        setFearPool(prev => {
          if (prev < amount) return prev;
          succeeded = true;
          return prev - amount;
        });
        if (succeeded) bumpRosterVersion();
        return succeeded;
      },
      setMaxFear: (value: number | undefined) => {
        setMaxFear(value);
        bumpRosterVersion();
      },
      setUseMassiveThreshold: (value: boolean) => {
        setUseMassiveThreshold(value);
        bumpRosterVersion();
      },
      handleSelect,
      handleSpotlight,
      handleRemove,
      addCharacter,
      addAdversary,
      addEnvironment,
      updateCharacter,
      updateAdversary,
      updateEnvironment,
      // Round management
      setCurrentRound: (value: number) => {
        setCurrentRound(value);
        bumpRosterVersion();
      },
      advanceRound: () => {
        setCurrentRound(prev => prev + 1);
        setAdversaries(prev =>
          prev.map(a => ({ ...a, hasActedThisRound: false }))
        );
        bumpRosterVersion();
      },
      // Roll history management
      addRollToHistory: (entry: RollHistoryEntry) => {
        setRollHistory(prev => [entry, ...prev].slice(0, 100)); // Keep last 100 rolls
        bumpRosterVersion();
      },
      clearRollHistory: () => {
        setRollHistory([]);
        bumpRosterVersion();
      },
      setRollHistory: (value: SetStateAction<RollHistoryEntry[]>) => {
        setRollHistory(value);
        bumpRosterVersion();
      },
      // Spotlight history timeline management
      clearSpotlightHistoryTimeline: () => {
        setSpotlightHistoryTimeline([]);
        bumpRosterVersion();
      },
      setSpotlightHistoryTimeline: (
        value: SetStateAction<SpotlightHistoryEntry[]>
      ) => {
        setSpotlightHistoryTimeline(value);
        bumpRosterVersion();
      },
      // Bulk setters for loading battle state
      setCharacters: (value: SetStateAction<CharacterTracker[]>) => {
        setCharacters(value);
        bumpRosterVersion();
      },
      setAdversaries: (value: SetStateAction<AdversaryTracker[]>) => {
        setAdversaries(value);
        bumpRosterVersion();
      },
      setEnvironments: (value: SetStateAction<EnvironmentTracker[]>) => {
        setEnvironments(value);
        bumpRosterVersion();
      },
      setSpotlightHistory: (value: SetStateAction<TrackerSelection[]>) => {
        setSpotlightHistory(value);
        bumpRosterVersion();
      },
    },
  };
}

export function useBattleDialogState(campaignId?: string) {
  const [isAddCharacterOpen, setIsAddCharacterOpen] = useState(false);
  const [isAddAdversaryOpen, setIsAddAdversaryOpen] = useState(false);
  const [isAddEnvironmentOpen, setIsAddEnvironmentOpen] = useState(false);
  const [characterDraft, setCharacterDraft] = useState(DEFAULT_CHARACTER_DRAFT);
  const [adversarySearch, setAdversarySearch] = useState('');
  const [environmentSearch, setEnvironmentSearch] = useState('');

  // Get homebrew content for this campaign
  const { data: homebrewResult } = useCampaignHomebrewContent(campaignId);
  const homebrewItems = homebrewResult?.items;
  const homebrewContent = useMemo(() => homebrewItems ?? [], [homebrewItems]);

  // Extract homebrew adversaries and environments
  const homebrewAdversaries = useMemo(() => {
    return homebrewContent
      .filter(c => c.contentType === 'adversary')
      .map(c => ({
        ...(c.content as Adversary),
        name: `${c.name} (Homebrew)`,
        _isHomebrew: true,
        _homebrewId: c.id,
      })) as Adversary[];
  }, [homebrewContent]);

  const homebrewEnvironments = useMemo(() => {
    return homebrewContent
      .filter(c => c.contentType === 'environment')
      .map(c => ({
        ...(c.content as Environment),
        name: `${c.name} (Homebrew)`,
        _isHomebrew: true,
        _homebrewId: c.id,
      })) as Environment[];
  }, [homebrewContent]);

  // Combine SRD with homebrew content
  const allAdversaries = useMemo(() => {
    return [...homebrewAdversaries, ...ADVERSARIES];
  }, [homebrewAdversaries]);

  const allEnvironments = useMemo(() => {
    return [...homebrewEnvironments, ...ENVIRONMENTS];
  }, [homebrewEnvironments]);

  const filteredAdversaries = useMemo(() => {
    const query = adversarySearch.trim().toLowerCase();
    if (!query) return allAdversaries;
    return allAdversaries.filter(adversary =>
      [adversary.name, adversary.role, adversary.tier]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [adversarySearch, allAdversaries]);

  const filteredEnvironments = useMemo(() => {
    const query = environmentSearch.trim().toLowerCase();
    if (!query) return allEnvironments;
    return allEnvironments.filter(environment =>
      [environment.name, environment.type, environment.tier]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [environmentSearch, allEnvironments]);

  return {
    dialogState: {
      isAddCharacterOpen,
      isAddAdversaryOpen,
      isAddEnvironmentOpen,
      characterDraft,
      adversarySearch,
      environmentSearch,
      filteredAdversaries,
      filteredEnvironments,
    },
    dialogActions: {
      setIsAddCharacterOpen,
      setIsAddAdversaryOpen,
      setIsAddEnvironmentOpen,
      setCharacterDraft,
      setAdversarySearch,
      setEnvironmentSearch,
    },
  };
}
