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
    spellcastTrait,
    isMulticlass: selectedClasses.length > 1,
    classes: classPairs,
  };
}

// Build homebrew class selection
function buildHomebrewSelection(
  homebrewClass: HomebrewClass,
  homebrewSubclassName: string | null
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
    spellcastTrait: selectedHomebrewSubclass?.spellcastTrait,
    homebrewClass,
  };
}

function getCanComplete(
  mode: ClassMode,
  selectedClasses: GameClass[],
  selectedSubclasses: Map<string, GameSubclass>,
  homebrewClass: HomebrewClass | null
) {
  if (mode === 'standard') {
    return isStandardSelectionComplete(selectedClasses, selectedSubclasses);
  }
  if (mode === 'homebrew') {
    return isHomebrewSelectionComplete(homebrewClass);
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
  setHomebrewClass,
  onChange,
}: {
  homebrewClass: HomebrewClass | null;
  homebrewSubclassName: string | null;
  setHomebrewClass: React.Dispatch<React.SetStateAction<HomebrewClass | null>>;
  onChange?: (draft: ClassDraft) => void;
}) {
  const handleHomebrewChange = useCallback(
    (homebrew: HomebrewClass) => {
      setHomebrewClass(homebrew);
      onChange?.({
        mode: 'homebrew',
        homebrewClass: homebrew,
        subclassName: homebrewSubclassName ?? homebrew.subclasses[0]?.name,
      });
    },
    [homebrewSubclassName, onChange, setHomebrewClass]
  );

  const selection = useMemo(() => {
    if (!homebrewClass) return null;
    return buildHomebrewSelection(homebrewClass, homebrewSubclassName);
  }, [homebrewClass, homebrewSubclassName]);

  return { handleHomebrewChange, homebrewSelection: selection };
}

function useClassCompletion({
  mode,
  selectedClasses,
  selectedSubclasses,
  homebrewSelection,
  homebrewClass,
}: {
  mode: ClassMode;
  selectedClasses: GameClass[];
  selectedSubclasses: Map<string, GameSubclass>;
  homebrewSelection: ClassSelection | null;
  homebrewClass: HomebrewClass | null;
}) {
  const canComplete = useMemo(
    () =>
      getCanComplete(mode, selectedClasses, selectedSubclasses, homebrewClass),
    [mode, selectedClasses, selectedSubclasses, homebrewClass]
  );

  const buildSelection = useCallback((): ClassSelection | null => {
    if (mode === 'standard') {
      return buildStandardSelection(selectedClasses, selectedSubclasses);
    }
    return homebrewSelection;
  }, [mode, selectedClasses, selectedSubclasses, homebrewSelection]);

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
    setHomebrewClass,
    onChange,
  });

  const { canComplete, buildSelection } = useClassCompletion({
    mode,
    selectedClasses,
    selectedSubclasses,
    homebrewSelection,
    homebrewClass,
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
    canComplete,
    modalClass,
    isModalOpen,
    handleModeChange,
    handleMulticlassToggle,
    handleClassSelect,
    handleSubclassSelect,
    handleHomebrewChange,
    handleComplete,
    handleOpenModal,
    handleCloseModal,
  };
}
