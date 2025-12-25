import { ClassFeaturesCard } from './class-features-card';
import { ClassHeader } from './class-header';
import { HopeFeatureCard } from './hope-feature-card';
import { StartingStatsCard } from './starting-stats-card';
import { SubclassFeaturesCard } from './subclass-features-card';
import { SubclassInfoCard } from './subclass-info-card';
import type { ClassDetailsData, FeatureUnlockState } from './types';

interface SingleClassDetailsProps {
  data: ClassDetailsData;
  unlockState: FeatureUnlockState;
  onToggleUnlock: (featureName: string) => void;
}

export function SingleClassDetails({
  data,
  unlockState,
  onToggleUnlock,
}: SingleClassDetailsProps) {
  return (
    <div className="space-y-4">
      <ClassHeader
        className={data.className}
        description={data.description}
        isHomebrew={data.isHomebrew}
      />

      <SubclassInfoCard
        subclassName={data.subclassName}
        description={data.subclassDescription}
        spellcastTrait={data.spellcastTrait}
      />

      {data.classFeatures && data.classFeatures.length > 0 && (
        <ClassFeaturesCard features={data.classFeatures} />
      )}

      {data.hopeFeature && <HopeFeatureCard feature={data.hopeFeature} />}

      {data.subclassFeatures && data.subclassFeatures.length > 0 && (
        <SubclassFeaturesCard
          className={data.className}
          features={data.subclassFeatures}
          unlockState={unlockState}
          onToggleUnlock={onToggleUnlock}
        />
      )}

      <StartingStatsCard
        hitPoints={data.startingHitPoints}
        evasion={data.startingEvasion}
      />
    </div>
  );
}
