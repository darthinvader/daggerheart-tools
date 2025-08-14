import * as React from 'react';

import { DrawerScaffold } from '@/components/drawers/drawer-scaffold';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
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
  const displayTier = (t?: FeatureView['tier'] | CustomFeature['tier']) =>
    t === '1'
      ? 'Tier 1'
      : t === '2-4'
        ? 'Tier 2'
        : t === '5-7'
          ? 'Tier 3'
          : t === '8-10'
            ? 'Tier 4'
            : undefined;
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
        <div>
          <ul className="space-y-2">
            {merged.map(f => (
              <li key={`${f.source}:${f.name}`} className="text-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 font-medium whitespace-normal">
                      <span className="break-words">{f.name}</span>
                      {f.type && (
                        <span className="inline-flex rounded border px-2 py-0.5 text-[10px]">
                          {f.type}
                        </span>
                      )}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      L{f.level} · {f.source}
                      {f.tier ? ` · ${displayTier(f.tier)}` : ''}
                      {f.unlockCondition ? ` · ${f.unlockCondition}` : ''}
                    </div>
                    {f.description && (
                      <div className="text-muted-foreground mt-1 text-xs break-words">
                        {f.description}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor={`toggle-${f.source}-${f.name}`}
                      className="text-muted-foreground text-xs"
                    >
                      Enabled
                    </Label>
                    <Switch
                      id={`toggle-${f.source}-${f.name}`}
                      checked={Boolean(
                        (local as Record<string, unknown>)[
                          `enabled:${f.source}:${f.name}`
                        ] ?? true
                      )}
                      onCheckedChange={val =>
                        setLocal(prev => ({
                          ...prev,
                          [`enabled:${f.source}:${f.name}`]: Boolean(val),
                        }))
                      }
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Custom features management */}
        <div>
          <div className="text-muted-foreground mb-2 text-xs font-medium">
            Custom features
          </div>
          {localCustom.length === 0 ? (
            <div className="text-muted-foreground text-sm">
              No custom features yet
            </div>
          ) : (
            <ul className="mb-2 space-y-2">
              {localCustom.map((cf, idx) => (
                <li key={`${cf.name}:${idx}`} className="rounded-md border p-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 whitespace-normal">
                        <span className="bg-secondary text-secondary-foreground inline-flex rounded px-2 py-0.5 text-[10px] tracking-wide uppercase">
                          L{cf.level}
                        </span>
                        <span className="font-medium break-words">
                          {cf.name}
                        </span>
                        {cf.type && (
                          <span className="inline-flex rounded border px-2 py-0.5 text-[10px]">
                            {cf.type}
                          </span>
                        )}
                      </div>
                      {cf.description && (
                        <div className="text-muted-foreground mt-1 text-xs break-words">
                          {cf.description}
                        </div>
                      )}
                      {(cf.tier || cf.unlockCondition) && (
                        <div className="text-muted-foreground mt-1 text-[10px]">
                          {cf.tier ? displayTier(cf.tier) : ''}
                          {cf.tier && cf.unlockCondition ? ' · ' : ''}
                          {cf.unlockCondition ?? ''}
                        </div>
                      )}
                      {cf.tags && cf.tags.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {(cf.tags ?? []).map(t => (
                            <span
                              key={t}
                              className="inline-flex rounded border px-2 py-0.5 text-[10px]"
                            >
                              🏷️ {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditIndex(idx);
                          setDraft({ ...cf });
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setLocalCustom(prev =>
                            prev.filter((_, i) => i !== idx)
                          );
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
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Editor */}
          <div className="space-y-2 rounded-md border p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">
                {editIndex === null
                  ? 'Add custom feature'
                  : `Edit custom feature #${(editIndex ?? 0) + 1}`}
              </div>
              {editIndex !== null && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
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
                >
                  Cancel edit
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="cf-name">Name</Label>
                  <Input
                    id="cf-name"
                    value={draft.name}
                    onChange={e =>
                      setDraft(d => ({ ...d, name: e.target.value }))
                    }
                    placeholder="Feature name"
                  />
                </div>
                <div>
                  <Label htmlFor="cf-level">Level</Label>
                  <Input
                    id="cf-level"
                    type="number"
                    min={1}
                    max={10}
                    value={draft.level}
                    onChange={e =>
                      setDraft(d => ({
                        ...d,
                        level: Math.max(
                          1,
                          Math.min(10, Number(e.target.value) || 1)
                        ),
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="cf-type">Type</Label>
                <Input
                  id="cf-type"
                  value={draft.type ?? ''}
                  onChange={e =>
                    setDraft(d => ({ ...d, type: e.target.value }))
                  }
                  placeholder="e.g., Ability, Passive"
                />
              </div>
              <div>
                <Label htmlFor="cf-tags">Tags (comma-separated)</Label>
                <Input
                  id="cf-tags"
                  value={(draft.tags ?? []).join(', ')}
                  onChange={e =>
                    setDraft(d => ({
                      ...d,
                      tags: e.target.value
                        .split(',')
                        .map(s => s.trim())
                        .filter(Boolean),
                    }))
                  }
                  placeholder="e.g., reaction, defense"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="cf-tier">Tier</Label>
                  <select
                    id="cf-tier"
                    className="border-input bg-background ring-offset-background focus-visible:ring-ring h-9 w-full rounded-md border px-3 py-1 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                    value={draft.tier ?? ''}
                    onChange={e =>
                      setDraft(d => ({
                        ...d,
                        tier: (e.target.value ||
                          undefined) as CustomFeature['tier'],
                      }))
                    }
                    aria-label="Tier"
                  >
                    <option value="">None</option>
                    <option value="1">1</option>
                    <option value="2-4">2-4</option>
                    <option value="5-7">5-7</option>
                    <option value="8-10">8-10</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="cf-unlock">Unlock condition</Label>
                  <Input
                    id="cf-unlock"
                    value={draft.unlockCondition ?? ''}
                    onChange={e =>
                      setDraft(d => ({ ...d, unlockCondition: e.target.value }))
                    }
                    placeholder="Optional"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="cf-desc">Description</Label>
                <Textarea
                  id="cf-desc"
                  value={draft.description}
                  onChange={e =>
                    setDraft(d => ({ ...d, description: e.target.value }))
                  }
                  placeholder="Describe what this feature does…"
                  rows={4}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    if (!draft.name.trim() || !draft.description.trim()) return;
                    if (editIndex === null) {
                      setLocalCustom(prev => [
                        ...prev,
                        {
                          ...draft,
                          type: draft.type || undefined,
                          unlockCondition: draft.unlockCondition || undefined,
                        },
                      ]);
                    } else {
                      setLocalCustom(prev =>
                        prev.map((it, i) =>
                          i === editIndex
                            ? {
                                ...draft,
                                type: draft.type || undefined,
                                unlockCondition:
                                  draft.unlockCondition || undefined,
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
                  disabled={!draft.name.trim() || !draft.description.trim()}
                >
                  {editIndex === null ? 'Add' : 'Update'}
                </Button>
                {editIndex !== null && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => {
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
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DrawerScaffold>
  );
}

export const FeaturesDrawer = React.memo(FeaturesDrawerImpl);
