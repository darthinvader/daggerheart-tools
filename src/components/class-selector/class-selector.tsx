import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { ClassDraft, ClassSelection } from '@/lib/schemas/class-selection';
import { CLASS_EMOJIS } from '@/lib/schemas/class-selection';

import { ClassList } from './class-list';
import { ClassModeTabs } from './class-mode-tabs';
import { HomebrewClassForm } from './homebrew-class-form';
import { SubclassList } from './subclass-list';
import { useClassSelectorState } from './use-class-selector-state';

interface ClassSelectorProps {
  value?: ClassDraft;
  onChange?: (draft: ClassDraft) => void;
  onComplete?: (selection: ClassSelection) => void;
  hideCompleteButton?: boolean;
  completeRef?: React.MutableRefObject<{
    complete: () => ClassSelection | null;
  } | null>;
}

export function ClassSelector({
  value,
  onChange,
  onComplete,
  hideCompleteButton = false,
  completeRef,
}: ClassSelectorProps) {
  const {
    mode,
    isMulticlass,
    selectedClasses,
    selectedSubclasses,
    homebrewClass,
    canComplete,
    handleModeChange,
    handleMulticlassToggle,
    handleClassSelect,
    handleSubclassSelect,
    handleHomebrewChange,
    handleComplete,
  } = useClassSelectorState({ value, onChange, onComplete, completeRef });

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

      {canComplete && !hideCompleteButton && (
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
