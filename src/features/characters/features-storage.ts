import { characterKeys as keys, storage } from '@/lib/storage';

export type FeatureSelections = Record<string, string | number | boolean>;

export function readFeaturesFromStorage(id: string): FeatureSelections {
  return storage.read(keys.features(id), {} as FeatureSelections);
}
export function writeFeaturesToStorage(id: string, map: FeatureSelections) {
  storage.write(keys.features(id), map);
}
