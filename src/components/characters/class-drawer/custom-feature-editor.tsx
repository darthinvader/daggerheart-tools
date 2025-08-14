import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { CustomFeature } from '@/features/characters/storage';

export type CustomFeatureEditorProps = {
  draft: CustomFeature;
  setDraft: React.Dispatch<React.SetStateAction<CustomFeature>>;
  editIndex: number | null;
  onCommit: (next: CustomFeature, index: number | null) => void;
  onCancelEdit: () => void;
};

export function CustomFeatureEditor({
  draft,
  setDraft,
  editIndex,
  onCommit,
  onCancelEdit,
}: CustomFeatureEditorProps) {
  return (
    <div className="space-y-2 rounded-md border p-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">
          {editIndex === null
            ? 'Add custom feature'
            : `Edit custom feature #${(editIndex ?? 0) + 1}`}
        </div>
        {editIndex !== null && (
          <Button size="sm" variant="ghost" onClick={onCancelEdit}>
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
              onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
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
                  level: Math.max(1, Math.min(10, Number(e.target.value) || 1)),
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
            onChange={e => setDraft(d => ({ ...d, type: e.target.value }))}
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
                  tier: (e.target.value || undefined) as CustomFeature['tier'],
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
            onClick={() => onCommit(draft, editIndex)}
            disabled={!draft.name.trim() || !draft.description.trim()}
          >
            {editIndex === null ? 'Add' : 'Update'}
          </Button>
          {editIndex !== null && (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={onCancelEdit}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
