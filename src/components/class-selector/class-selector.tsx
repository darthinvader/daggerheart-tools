/* eslint-disable max-lines-per-function, complexity */
import { useCallback, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { GameClass, GameSubclass } from '@/lib/data/classes';
import { getDomainsForClass } from '@/lib/data/classes';
import type {
  ClassDraft,
  ClassMode,
  ClassSelection,
  HomebrewClass,
} from '@/lib/schemas/class-selection';
import { CLASS_EMOJIS } from '@/lib/schemas/class-selection';

import { ClassList } from './class-list';
import { ClassModeTabs } from './class-mode-tabs';
import { HomebrewClassForm } from './homebrew-class-form';
import { SubclassList } from './subclass-list';

interface ClassSelectorProps {
  value?: ClassDraft;
  onChange?: (draft: ClassDraft) => void;
  onComplete?: (selection: ClassSelection) => void;
}

export function ClassSelector({
  value,
  onChange,
  onComplete,
}: ClassSelectorProps) {
  const [mode, setMode] = useState<ClassMode>(value?.mode ?? 'standard');
  const [isMulticlass, setIsMulticlass] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<GameClass[]>([]);
  const [selectedSubclasses, setSelectedSubclasses] = useState<
    Map<string, GameSubclass>
  >(new Map());
  const [homebrewClass, setHomebrewClass] = useState<HomebrewClass | null>(
    value?.homebrewClass ?? null
  );
  // NOTE: Homebrew subclass selection UI not yet implemented
  const [homebrewSubclassName] = useState<string | null>(null);

  const handleModeChange = useCallback((newMode: ClassMode) => {
    setMode(newMode);
  }, []);

  const handleMulticlassToggle = useCallback(
    (enabled: boolean) => {
      setIsMulticlass(enabled);
      if (!enabled && selectedClasses.length > 1) {
        const firstClass = selectedClasses[0];
        setSelectedClasses([firstClass]);
        const firstSubclass = selectedSubclasses.get(firstClass.name);
        setSelectedSubclasses(
          new Map(firstSubclass ? [[firstClass.name, firstSubclass]] : [])
        );
      }
    },
    [selectedClasses, selectedSubclasses]
  );

  const handleClassSelect = useCallback(
    (gameClass: GameClass) => {
      if (isMulticlass) {
        setSelectedClasses(prev => {
          const exists = prev.some(c => c.name === gameClass.name);
          if (exists) {
            setSelectedSubclasses(prevSubs => {
              const newSubs = new Map(prevSubs);
              newSubs.delete(gameClass.name);
              return newSubs;
            });
            return prev.filter(c => c.name !== gameClass.name);
          }
          return [...prev, gameClass];
        });
      } else {
        setSelectedClasses([gameClass]);
        setSelectedSubclasses(new Map());
      }
      onChange?.({
        mode: 'standard',
        className: gameClass.name,
        subclassName: undefined,
      });
    },
    [isMulticlass, onChange]
  );

  const handleSubclassSelect = useCallback(
    (className: string, subclass: GameSubclass) => {
      setSelectedSubclasses(prev => {
        const newMap = new Map(prev);
        newMap.set(className, subclass);
        return newMap;
      });
      if (selectedClasses.length === 1) {
        onChange?.({
          mode: 'standard',
          className: selectedClasses[0].name,
          subclassName: subclass.name,
        });
      }
    },
    [selectedClasses, onChange]
  );

  const handleHomebrewChange = useCallback(
    (homebrew: HomebrewClass) => {
      setHomebrewClass(homebrew);
      onChange?.({
        mode: 'homebrew',
        homebrewClass: homebrew,
        subclassName: homebrewSubclassName ?? homebrew.subclasses[0]?.name,
      });
    },
    [homebrewSubclassName, onChange]
  );

  const handleComplete = useCallback(() => {
    if (mode === 'standard' && selectedClasses.length > 0) {
      const allDomains = selectedClasses.flatMap(c =>
        getDomainsForClass(c.name)
      );
      const uniqueDomains = [...new Set(allDomains)];

      const primaryClass = selectedClasses[0];
      const primarySubclass = selectedSubclasses.get(primaryClass.name);

      if (!primarySubclass) return;

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

      onComplete?.({
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
      });
    } else if (mode === 'homebrew' && homebrewClass) {
      const subclassName =
        homebrewSubclassName ?? homebrewClass.subclasses[0]?.name ?? '';
      const selectedHomebrewSubclass = homebrewClass.subclasses.find(
        s => s.name === subclassName
      );

      onComplete?.({
        mode: 'homebrew',
        className: homebrewClass.name,
        subclassName,
        domains: homebrewClass.domains,
        isHomebrew: true,
        spellcastTrait: selectedHomebrewSubclass?.spellcastTrait,
        homebrewClass,
      });
    }
  }, [
    mode,
    selectedClasses,
    selectedSubclasses,
    homebrewClass,
    homebrewSubclassName,
    onComplete,
  ]);

  const allSubclassesSelected = selectedClasses.every(c =>
    selectedSubclasses.has(c.name)
  );
  const canComplete =
    (mode === 'standard' &&
      selectedClasses.length > 0 &&
      allSubclassesSelected) ||
    (mode === 'homebrew' &&
      homebrewClass?.name &&
      homebrewClass.subclasses[0]?.name);

  return (
    <div className="space-y-6">
      <ClassModeTabs activeMode={mode} onModeChange={handleModeChange} />

      {mode === 'standard' && (
        <div className="space-y-6">
          <div className="bg-muted/30 flex flex-col gap-3 rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  id="multiclass-toggle"
                  checked={isMulticlass}
                  onCheckedChange={handleMulticlassToggle}
                />
                <Label
                  htmlFor="multiclass-toggle"
                  className="flex cursor-pointer items-center gap-2"
                >
                  <span>🔀 Multiclass</span>
                  {isMulticlass && (
                    <Badge variant="secondary" className="text-xs">
                      Select multiple
                    </Badge>
                  )}
                </Label>
              </div>
            </div>
            {selectedClasses.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 border-t pt-2">
                <span className="text-muted-foreground shrink-0 text-sm">
                  Selected:
                </span>
                {selectedClasses.map(c => (
                  <Badge key={c.name} variant="outline" className="text-xs">
                    {CLASS_EMOJIS[c.name]} {c.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <ClassList
            selectedClasses={selectedClasses}
            onSelect={handleClassSelect}
            isMulticlass={isMulticlass}
          />

          {selectedClasses.length > 0 && (
            <SubclassList
              gameClasses={selectedClasses}
              selectedSubclasses={selectedSubclasses}
              onSelect={handleSubclassSelect}
            />
          )}
        </div>
      )}

      {mode === 'homebrew' && (
        <HomebrewClassForm
          homebrewClass={homebrewClass}
          onChange={handleHomebrewChange}
        />
      )}

      {canComplete && (
        <div className="flex justify-end border-t pt-4">
          <Button onClick={handleComplete} size="lg" className="max-w-full">
            {mode === 'standard' && selectedClasses.length > 0 && (
              <span className="flex min-w-0 items-center gap-1">
                <span className="shrink-0">
                  {selectedClasses.map(c => CLASS_EMOJIS[c.name]).join('')}
                </span>
                <span className="truncate">
                  Continue with{' '}
                  {selectedClasses.length > 2
                    ? `${selectedClasses.length} Classes`
                    : selectedClasses.map(c => c.name).join(' / ')}
                </span>
              </span>
            )}
            {mode === 'homebrew' && homebrewClass && (
              <span className="flex min-w-0 items-center gap-1">
                <span className="shrink-0">🎨</span>
                <span className="truncate">
                  Continue with {homebrewClass.name || 'Homebrew Class'}
                </span>
              </span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
