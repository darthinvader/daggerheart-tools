export interface MulticlassConfig {
  primaryClass: string;
  secondaryClass: string | null;
  primaryLevel: number;
  secondaryLevel: number;
}

export interface MulticlassFeature {
  id: string;
  name: string;
  description: string;
  source: 'primary' | 'secondary';
  level: number;
}

export interface MulticlassState {
  config: MulticlassConfig;
  features: MulticlassFeature[];
}
