import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { SubclassFeature } from '@/lib/schemas/core';

const FEATURE_TYPES = ['foundation', 'specialization', 'mastery'] as const;
const FEATURE_TYPE_EMOJIS: Record<string, string> = {
  foundation: '🏛️',
  specialization: '⚡',
  mastery: '👑',
};
const FEATURE_TYPE_COLORS: Record<string, string> = {
  foundation: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
  specialization: 'bg-purple-500/10 text-purple-700 border-purple-500/30',
  mastery: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
};

interface SubclassFeatureItemProps {
  feature: SubclassFeature;
  featureIndex: number;
  onUpdate: (updates: Partial<SubclassFeature>) => void;
  onRemove: () => void;
}

export function SubclassFeatureItem({
  feature,
  featureIndex,
  onUpdate,
  onRemove,
}: SubclassFeatureItemProps) {
  return (
    <div className="bg-background space-y-3 rounded border p-3">
      <div className="flex items-center justify-between gap-2">
        <Badge
          variant="outline"
          className={
            FEATURE_TYPE_COLORS[feature.type] || FEATURE_TYPE_COLORS.foundation
          }
        >
          {FEATURE_TYPE_EMOJIS[feature.type] || '⭐'} {feature.type}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-destructive hover:text-destructive h-7 w-7 p-0"
          aria-label={`Remove feature ${featureIndex + 1}`}
        >
          ✕
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1">
          <Label className="text-xs">Name</Label>
          <Input
            placeholder="Feature name..."
            value={feature.name}
            onChange={e => onUpdate({ name: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Type</Label>
          <Select
            value={feature.type}
            onValueChange={v => onUpdate({ type: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FEATURE_TYPES.map(type => (
                <SelectItem key={type} value={type}>
                  {FEATURE_TYPE_EMOJIS[type]}{' '}
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Level (optional)</Label>
          <Input
            type="number"
            min={1}
            max={10}
            placeholder="1-10"
            value={feature.level ?? ''}
            onChange={e =>
              onUpdate({
                level: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Description</Label>
        <Textarea
          placeholder="Describe what this feature does..."
          value={feature.description}
          onChange={e => onUpdate({ description: e.target.value })}
          rows={2}
        />
      </div>
    </div>
  );
}
