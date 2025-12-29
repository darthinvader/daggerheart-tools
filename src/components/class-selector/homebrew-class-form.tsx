import type { HomebrewClass } from '@/lib/schemas/class-selection';

import { ClassDetailsCard } from './class-details-card';
import { SubclassesCard } from './subclasses-card';
import { useHomebrewClassState } from './use-homebrew-class-state';

interface HomebrewClassFormProps {
  homebrewClass: HomebrewClass | null;
  onChange: (homebrewClass: HomebrewClass) => void;
}

export function HomebrewClassForm({
  homebrewClass,
  onChange,
}: HomebrewClassFormProps) {
  const state = useHomebrewClassState({ homebrewClass, onChange });

  return (
    <div className="space-y-6">
      <ClassDetailsCard
        draft={state.draft}
        updateDraft={state.updateDraft}
        handleDomainChange={state.handleDomainChange}
        addClassFeature={state.addClassFeature}
        updateClassFeature={state.updateClassFeature}
        removeClassFeature={state.removeClassFeature}
      />
      <SubclassesCard
        subclasses={state.draft.subclasses}
        addSubclass={state.addSubclass}
        updateSubclass={state.updateSubclass}
        removeSubclass={state.removeSubclass}
        addFeature={state.addFeature}
        updateFeature={state.updateFeature}
        removeFeature={state.removeFeature}
      />
    </div>
  );
}
