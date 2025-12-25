export interface FeatureUnlockState {
  [featureName: string]: boolean;
}

export interface ClassDetailsData {
  className: string;
  subclassName: string;
  spellcastTrait?: string;
  description?: string;
  subclassDescription?: string;
  classFeatures?: ReadonlyArray<{
    readonly name: string;
    readonly description: string;
  }>;
  hopeFeature?: {
    readonly name: string;
    readonly description: string;
    readonly hopeCost: number;
  };
  subclassFeatures?: ReadonlyArray<{
    readonly name: string;
    readonly description: string;
    readonly type?: string;
    readonly level?: number;
  }>;
  startingHitPoints?: number;
  startingEvasion?: number;
  isHomebrew?: boolean;
}
