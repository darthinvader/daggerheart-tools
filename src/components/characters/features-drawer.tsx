import * as React from 'react';

import { CustomFeatureEditor } from '@/components/characters/class-drawer/custom-feature-editor';
import { CustomFeaturesList } from '@/components/characters/class-drawer/custom-features-list';
import { FeaturesToggleList } from '@/components/characters/class-drawer/features-toggle-list';
import { DrawerScaffold } from '@/components/drawers/drawer-scaffold';
import type { FeatureView } from '@/features/characters/logic';
import type {
  CustomFeature,
  CustomFeatures,
} from '@/features/characters/storage';

export type FeaturesDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  level: number;
  features: FeatureView[];
  selections: Record<string, string | number | boolean>;
  onSave: (next: Record<string, string | number | boolean>) => void;
  // Custom features management
  custom: CustomFeatures;
  onSaveCustom: (list: CustomFeatures) => void;
  onCancel: () => void;
};

function FeaturesDrawerImpl({
  open,
  onOpenChange,
  level,
  features,
  selections,
  onSave,
  custom,
  onSaveCustom,
  onCancel,
}: FeaturesDrawerProps) {
  const [local, setLocal] = React.useState(selections);
  const [localCustom, setLocalCustom] = React.useState<CustomFeatures>(custom);
  const [editIndex, setEditIndex] = React.useState<number | null>(null);
  const [draft, setDraft] = React.useState<CustomFeature>({
    name: '',
    description: '',
    level: 1,
    type: '',
    tags: [],
    tier: undefined,
    unlockCondition: '',
  });
  React.useEffect(() => {
    if (open) {
      setLocal(selections);
      setLocalCustom(custom);
      setEditIndex(null);
      setDraft({
        name: '',
        description: '',
        level: 1,
        type: '',
        tags: [],
        tier: undefined,
        unlockCondition: '',
      });
    }
  }, [open, selections, custom]);

  const current = React.useMemo(
    () => features.filter(f => f.level <= level),
    [features, level]
  );
  const future = React.useMemo(
    () => features.filter(f => f.level > level),
    [features, level]
  );
  const merged = React.useMemo(() => {
    const all = [...current, ...future];
    const l1 = all
      .filter(f => f.level === 1)
      .sort((a, b) => a.name.localeCompare(b.name));
    const rest = all
      .filter(f => f.level !== 1)
      .sort((a, b) =>
        a.level === b.level ? a.name.localeCompare(b.name) : a.level - b.level
      );
    return [...l1, ...rest];
  }, [current, future]);

  return (
    <DrawerScaffold
      open={open}
      onOpenChange={onOpenChange}
      title="Features"
      onCancel={onCancel}
      onSubmit={() => {
        onSave(local);
        onSaveCustom(localCustom);
      }}
      submitLabel="Save"
      submitDisabled={false}
    >
      <div className="space-y-6">
        <FeaturesToggleList
          features={merged}
          selections={local}
          setSelections={setLocal}
          level={level}
        />

        <div>
          <div className="text-muted-foreground mb-2 text-xs font-medium">
            Custom features
          </div>
          <CustomFeaturesList
            list={localCustom}
            onEdit={(idx, cf) => {
              setEditIndex(idx);
              setDraft({ ...cf });
            }}
            onRemove={idx => {
              setLocalCustom(prev => prev.filter((_, i) => i !== idx));
              if (editIndex === idx) {
                setEditIndex(null);
                setDraft({
                  name: '',
                  description: '',
                  level: 1,
                  type: '',
                  tags: [],
                  tier: undefined,
                  unlockCondition: '',
                });
              }
            }}
          />

          <CustomFeatureEditor
            draft={draft}
            setDraft={setDraft}
            editIndex={editIndex}
            onCommit={(next, index) => {
              if (!next.name.trim() || !next.description.trim()) return;
              if (index === null) {
                setLocalCustom(prev => [
                  ...prev,
                  {
                    ...next,
                    type: next.type || undefined,
                    unlockCondition: next.unlockCondition || undefined,
                  },
                ]);
              } else {
                setLocalCustom(prev =>
                  prev.map((it, i) =>
                    i === index
                      ? {
                          ...next,
                          type: next.type || undefined,
                          unlockCondition: next.unlockCondition || undefined,
                        }
                      : it
                  )
                );
                setEditIndex(null);
              }
              setDraft({
                name: '',
                description: '',
                level: 1,
                type: '',
                tags: [],
                tier: undefined,
                unlockCondition: '',
              });
            }}
            onCancelEdit={() => {
              setEditIndex(null);
              setDraft({
                name: '',
                description: '',
                level: 1,
                type: '',
                tags: [],
                tier: undefined,
                unlockCondition: '',
              });
            }}
          />
        </div>
      </div>
    </DrawerScaffold>
  );
}

export const FeaturesDrawer = React.memo(FeaturesDrawerImpl);
