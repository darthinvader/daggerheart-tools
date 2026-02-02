import { useCallback, useEffect, useMemo, useState } from 'react';

import type { GameClass, GameSubclass } from '@/lib/data/classes';
import { getDomainsForClass } from '@/lib/data/classes';
import type {
  ClassDraft,
  ClassMode,
  ClassSelection,
  HomebrewClass,
} from '@/lib/schemas/class-selection';

import { useClassSelectionHandlers } from './use-class-selection-handlers';

interface UseClassSelectorStateProps {
  value?: ClassDraft;
  onChange?: (draft: ClassDraft) => void;
  onComplete?: (selection: ClassSelection) => void;
  completeRef?: React.MutableRefObject<{
    complete: () => ClassSelection | null;
  } | null>;
}

// Check if standard mode selection is complete
function isStandardSelectionComplete(
  selectedClasses: GameClass[],
  selectedSubclasses: Map<string, GameSubclass>
): boolean {
  if (selectedClasses.length === 0) return false;
  return selectedClasses.every(c => selectedSubclasses.has(c.name));
}

// Check if homebrew mode selection is complete
function isHomebrewSelectionComplete(
  homebrewClass: HomebrewClass | null
): boolean {
  return Boolean(homebrewClass?.name && homebrewClass.subclasses[0]?.name);
}

// Check if custom mode selection is complete (same logic as homebrew)
function isCustomSelectionComplete(customClass: HomebrewClass | null): boolean {
  return Boolean(customClass?.name && customClass.subclasses[0]?.name);
}

// Build standard class selection from selected classes and subclasses
function buildStandardSelection(
  selectedClasses: GameClass[],
  selectedSubclasses: Map<string, GameSubclass>
): ClassSelection | null {
  if (selectedClasses.length === 0) return null;

  const allDomains = selectedClasses.flatMap(c => getDomainsForClass(c.name));
  const uniqueDomains = [...new Set(allDomains)];

  const primaryClass = selectedClasses[0];
  const primarySubclass = selectedSubclasses.get(primaryClass.name);

  if (!primarySubclass) return null;

  const spellcastTrait =
    'spellcastTrait' in primarySubclass
      ? (primarySubclass.spellcastTrait as string)
      : undefined;

  const classPairs = selectedClasses.map(c => {
    const sub = selectedSubclasses.get(c.name);
    return {
      className: c.name,
      subclassName: sub?.name ?? '',
      spellcastTrait:
        sub && 'spellcastTrait' in sub
          ? (sub.spellcastTrait as string)
          : undefined,
    };
  });

  return {
    mode: 'standard',
    className: selectedClasses.map(c => c.name).join(' / '),
    subclassName: Array.from(selectedSubclasses.values())
      .map(s => s.name)
      .join(' / '),
    domains: uniqueDomains,
    isHomebrew: false,
    isCustom: false,
    spellcastTrait,
    isMulticlass: selectedClasses.length > 1,
    classes: classPairs,
  };
}

// Build homebrew class selection (from campaign-linked content)
function buildHomebrewSelection(
  homebrewClass: HomebrewClass,
  homebrewSubclassName: string | null,
  homebrewContentId?: string
): ClassSelection {
  const subclassName =
    homebrewSubclassName ?? homebrewClass.subclasses[0]?.name ?? '';
  const selectedHomebrewSubclass = homebrewClass.subclasses.find(
    s => s.name === subclassName
  );

  return {
    mode: 'homebrew',
    className: homebrewClass.name,
    subclassName,
    domains: homebrewClass.domains,
    isHomebrew: true,
    isCustom: false,
    spellcastTrait: selectedHomebrewSubclass?.spellcastTrait,
    homebrewClass,
    homebrewContentId,
  };
}

// Build custom class selection (player-created on the fly)
function buildCustomSelection(
  customClass: HomebrewClass,
  customSubclassName: string | null
): ClassSelection {
  const subclassName =
    customSubclassName ?? customClass.subclasses[0]?.name ?? '';
  const selectedSubclass = customClass.subclasses.find(
    s => s.name === subclassName
  );

  return {
    mode: 'custom',
    className: customClass.name,
    subclassName,
    domains: customClass.domains,
    isHomebrew: false,
    isCustom: true,
    spellcastTrait: selectedSubclass?.spellcastTrait,
    customClass,
  };
}

function getCanComplete(
  mode: ClassMode,
  selectedClasses: GameClass[],
  selectedSubclasses: Map<string, GameSubclass>,
  homebrewClass: HomebrewClass | null,
  customClass: HomebrewClass | null
) {
  if (mode === 'standard') {
    return isStandardSelectionComplete(selectedClasses, selectedSubclasses);
  }
  if (mode === 'homebrew') {
    return isHomebrewSelectionComplete(homebrewClass);
  }
  if (mode === 'custom') {
    return isCustomSelectionComplete(customClass);
  }
  return false;
}

function ensureClassSelected({
  gameClass,
  isMulticlass,
  selectedClasses,
  selectedSubclasses,
}: {
  gameClass: GameClass;
  isMulticlass: boolean;
  selectedClasses: GameClass[];
  selectedSubclasses: Map<string, GameSubclass>;
}) {
  const isAlreadySelected = selectedClasses.some(
    c => c.name === gameClass.name
  );

  if (isAlreadySelected) {
    return { nextClasses: selectedClasses, nextSubclasses: selectedSubclasses };
  }

  if (isMulticlass) {
    return {
      nextClasses: [...selectedClasses, gameClass],
      nextSubclasses: selectedSubclasses,
    };
  }

  return {
    nextClasses: [gameClass],
    nextSubclasses: new Map<string, GameSubclass>(),
  };
}

function useModalHandlers({
  isMulticlass,
  selectedClasses,
  selectedSubclasses,
  setSelectedClasses,
  setSelectedSubclasses,
}: {
  isMulticlass: boolean;
  selectedClasses: GameClass[];
  selectedSubclasses: Map<string, GameSubclass>;
  setSelectedClasses: React.Dispatch<React.SetStateAction<GameClass[]>>;
  setSelectedSubclasses: React.Dispatch<
    React.SetStateAction<Map<string, GameSubclass>>
  >;
}) {
  const [modalClass, setModalClass] = useState<GameClass | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = useCallback(
    (gameClass: GameClass) => {
      const { nextClasses, nextSubclasses } = ensureClassSelected({
        gameClass,
        isMulticlass,
        selectedClasses,
        selectedSubclasses,
      });
      if (nextClasses !== selectedClasses) {
        setSelectedClasses(nextClasses);
      }
      if (nextSubclasses !== selectedSubclasses) {
        setSelectedSubclasses(nextSubclasses);
      }
      setModalClass(gameClass);
      setIsModalOpen(true);
    },
    [
      isMulticlass,
      selectedClasses,
      selectedSubclasses,
      setSelectedClasses,
      setSelectedSubclasses,
    ]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setModalClass(null);
  }, []);

  return { modalClass, isModalOpen, handleOpenModal, handleCloseModal };
}

function useHomebrewHandlers({
  homebrewClass,
  homebrewSubclassName,
  homebrewContentId,
  setHomebrewClass,
  setHomebrewContentId,
  onChange,
}: {
  homebrewClass: HomebrewClass | null;
  homebrewSubclassName: string | null;
  homebrewContentId: string | undefined;
  setHomebrewClass: React.Dispatch<React.SetStateAction<HomebrewClass | null>>;
  setHomebrewContentId: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  onChange?: (draft: ClassDraft) => void;
}) {
  const handleHomebrewChange = useCallback(
    (homebrew: HomebrewClass, contentId?: string) => {
      setHomebrewClass(homebrew);
      if (contentId) {
        setHomebrewContentId(contentId);
      }
      onChange?.({
        mode: 'homebrew',
        homebrewClass: homebrew,
        subclassName: homebrewSubclassName ?? homebrew.subclasses[0]?.name,
        homebrewContentId: contentId,
      });
    },
    [homebrewSubclassName, onChange, setHomebrewClass, setHomebrewContentId]
  );

  const selection = useMemo(() => {
    if (!homebrewClass) return null;
    return buildHomebrewSelection(
      homebrewClass,
      homebrewSubclassName,
      homebrewContentId
    );
  }, [homebrewClass, homebrewSubclassName, homebrewContentId]);

  return { handleHomebrewChange, homebrewSelection: selection };
}

function useCustomHandlers({
  customClass,
  customSubclassName,
  setCustomClass,
  onChange,
}: {
  customClass: HomebrewClass | null;
  customSubclassName: string | null;
  setCustomClass: React.Dispatch<React.SetStateAction<HomebrewClass | null>>;
  onChange?: (draft: ClassDraft) => void;
}) {
  const handleCustomChange = useCallback(
    (custom: HomebrewClass) => {
      setCustomClass(custom);
      onChange?.({
        mode: 'custom',
        customClass: custom,
        subclassName: customSubclassName ?? custom.subclasses[0]?.name,
      });
    },
    [customSubclassName, onChange, setCustomClass]
  );

  const selection = useMemo(() => {
    if (!customClass) return null;
    return buildCustomSelection(customClass, customSubclassName);
  }, [customClass, customSubclassName]);

  return { handleCustomChange, customSelection: selection };
}

function useClassCompletion({
  mode,
  selectedClasses,
  selectedSubclasses,
  homebrewSelection,
  homebrewClass,
  customSelection,
  customClass,
}: {
  mode: ClassMode;
  selectedClasses: GameClass[];
  selectedSubclasses: Map<string, GameSubclass>;
  homebrewSelection: ClassSelection | null;
  homebrewClass: HomebrewClass | null;
  customSelection: ClassSelection | null;
  customClass: HomebrewClass | null;
}) {
  const canComplete = useMemo(
    () =>
      getCanComplete(
        mode,
        selectedClasses,
        selectedSubclasses,
        homebrewClass,
        customClass
      ),
    [mode, selectedClasses, selectedSubclasses, homebrewClass, customClass]
  );

  const buildSelection = useCallback((): ClassSelection | null => {
    if (mode === 'standard') {
      return buildStandardSelection(selectedClasses, selectedSubclasses);
    }
    if (mode === 'homebrew') {
      return homebrewSelection;
    }
    if (mode === 'custom') {
      return customSelection;
    }
    return null;
  }, [
    mode,
    selectedClasses,
    selectedSubclasses,
    homebrewSelection,
    customSelection,
  ]);

  return { canComplete, buildSelection };
}

export function useClassSelectorState({
  value,
  onChange,
  onComplete,
  completeRef,
}: UseClassSelectorStateProps) {
  const [mode, setMode] = useState<ClassMode>(value?.mode ?? 'standard');
  const [isMulticlass, setIsMulticlass] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<GameClass[]>([]);
  const [selectedSubclasses, setSelectedSubclasses] = useState<
    Map<string, GameSubclass>
  >(new Map());
  const [homebrewClass, setHomebrewClass] = useState<HomebrewClass | null>(
    value?.homebrewClass ?? null
  );
  const [homebrewSubclassName] = useState<string | null>(null);
  const [homebrewContentId, setHomebrewContentId] = useState<
    string | undefined
  >(value?.homebrewContentId);

  // Custom class state (player-created on the fly)
  const [customClass, setCustomClass] = useState<HomebrewClass | null>(
    value?.customClass ?? null
  );
  const [customSubclassName] = useState<string | null>(null);

  const handleModeChange = useCallback((newMode: ClassMode) => {
    setMode(newMode);
  }, []);

  const { handleMulticlassToggle, handleClassSelect, handleSubclassSelect } =
    useClassSelectionHandlers({
      isMulticlass,
      selectedClasses,
      setSelectedClasses,
      selectedSubclasses,
      setSelectedSubclasses,
      setIsMulticlass,
      onChange,
    });

  const { modalClass, isModalOpen, handleOpenModal, handleCloseModal } =
    useModalHandlers({
      isMulticlass,
      selectedClasses,
      selectedSubclasses,
      setSelectedClasses,
      setSelectedSubclasses,
    });

  const { handleHomebrewChange, homebrewSelection } = useHomebrewHandlers({
    homebrewClass,
    homebrewSubclassName,
    homebrewContentId,
    setHomebrewClass,
    setHomebrewContentId,
    onChange,
  });

  const { handleCustomChange, customSelection } = useCustomHandlers({
    customClass,
    customSubclassName,
    setCustomClass,
    onChange,
  });

  const { canComplete, buildSelection } = useClassCompletion({
    mode,
    selectedClasses,
    selectedSubclasses,
    homebrewSelection,
    homebrewClass,
    customSelection,
    customClass,
  });

  const handleComplete = useCallback(() => {
    const selection = buildSelection();
    if (selection) {
      onComplete?.(selection);
    }
  }, [buildSelection, onComplete]);

  useEffect(() => {
    if (completeRef) {
      completeRef.current = {
        complete: () => (canComplete ? buildSelection() : null),
      };
    }
  }, [completeRef, canComplete, buildSelection]);

  return {
    mode,
    isMulticlass,
    selectedClasses,
    selectedSubclasses,
    homebrewClass,
    customClass,
    canComplete,
    modalClass,
    isModalOpen,
    handleModeChange,
    handleMulticlassToggle,
    handleClassSelect,
    handleSubclassSelect,
    handleHomebrewChange,
    handleCustomChange,
    handleComplete,
    handleOpenModal,
    handleCloseModal,
  };
}
