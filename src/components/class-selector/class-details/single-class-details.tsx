import { ClassFeaturesCard } from './class-features-card';
import { CompactClassInfo } from './compact-class-info';
import { HopeFeatureCard } from './hope-feature-card';
import { SubclassFeaturesCard } from './subclass-features-card';
import type { ClassDetailsData, FeatureUnlockState } from './types';

interface SingleClassDetailsProps {
  data: ClassDetailsData;
  unlockState: FeatureUnlockState;
  onToggleUnlock: (featureName: string) => void;
  disabledFeatures?: Set<string>;
  onToggleFeatureActivation?: (featureName: string) => void;
}

export function SingleClassDetails({
  data,
  unlockState,
  onToggleUnlock,
  disabledFeatures,
  onToggleFeatureActivation,
}: SingleClassDetailsProps) {
  return (
    <div className="space-y-4">
      <CompactClassInfo data={data} />

      {data.classFeatures && data.classFeatures.length > 0 && (
        <ClassFeaturesCard
          features={data.classFeatures}
          disabledFeatures={disabledFeatures}
          onToggleFeature={onToggleFeatureActivation}
        />
      )}

      {data.hopeFeature && (
        <HopeFeatureCard
          feature={data.hopeFeature}
          isActivated={!disabledFeatures?.has(data.hopeFeature.name)}
          onToggleActivated={
            onToggleFeatureActivation
              ? () => onToggleFeatureActivation(data.hopeFeature!.name)
              : undefined
          }
        />
      )}

      {data.subclassFeatures && data.subclassFeatures.length > 0 && (
        <SubclassFeaturesCard
          className={data.className}
          features={data.subclassFeatures}
          unlockState={unlockState}
          onToggleUnlock={onToggleUnlock}
          disabledFeatures={disabledFeatures}
          onToggleFeatureActivation={onToggleFeatureActivation}
        />
      )}
    </div>
  );
}
