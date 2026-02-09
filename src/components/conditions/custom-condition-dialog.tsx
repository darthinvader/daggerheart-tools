import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  Ban,
  Clock,
  CloudRain,
  Eye,
  Flame,
  Heart,
  Moon,
  Palette,
  Shield,
  Skull,
  Snowflake,
  Star,
  Sun,
  Target,
  Wind,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { CustomConditionDefinition } from '@/lib/schemas/character-state';
import {
  CONDITION_PRESET_COLORS,
  CONDITION_PRESET_ICONS,
} from '@/lib/schemas/character-state';
import { cn } from '@/lib/utils';

/** Map of icon name → Lucide component for the preset icon palette */
export const CONDITION_ICON_MAP: Record<
  (typeof CONDITION_PRESET_ICONS)[number],
  LucideIcon
> = {
  Shield,
  Heart,
  Eye,
  Skull,
  Flame,
  Snowflake,
  Zap,
  Sun,
  Moon,
  CloudRain,
  Wind,
  Target,
  AlertTriangle,
  Ban,
  Clock,
  Star,
};

/* ── Sub-components ──────────────────────────────────────────────── */

interface ColorPickerFieldProps {
  color: string | undefined;
  onColorChange: (c: string | undefined) => void;
}

function ColorPickerField({ color, onColorChange }: ColorPickerFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label>Color</Label>
      <div className="flex flex-wrap gap-2">
        {CONDITION_PRESET_COLORS.map(c => (
          <button
            key={c}
            type="button"
            className={cn(
              'size-7 rounded-full border-2 transition-transform hover:scale-110',
              color === c ? 'border-foreground scale-110' : 'border-transparent'
            )}
            style={{ backgroundColor: c }}
            onClick={() => onColorChange(color === c ? undefined : c)}
            aria-label={`Select color ${c}`}
          />
        ))}
      </div>
    </div>
  );
}

interface IconPickerFieldProps {
  icon: string | undefined;
  onIconChange: (i: string | undefined) => void;
}

function IconPickerField({ icon, onIconChange }: IconPickerFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label>Icon</Label>
      <div className="grid grid-cols-8 gap-1.5">
        {CONDITION_PRESET_ICONS.map(iconName => {
          const IconComp = CONDITION_ICON_MAP[iconName];
          return (
            <button
              key={iconName}
              type="button"
              className={cn(
                'hover:bg-muted flex size-8 items-center justify-center rounded-md border transition-colors',
                icon === iconName
                  ? 'border-foreground bg-muted'
                  : 'border-transparent'
              )}
              onClick={() =>
                onIconChange(icon === iconName ? undefined : iconName)
              }
              aria-label={`Select icon ${iconName}`}
            >
              <IconComp className="size-4" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface ConditionPreviewProps {
  color: string | undefined;
  icon: string | undefined;
  name: string;
  description: string;
}

function ConditionPreview({
  color,
  icon,
  name,
  description,
}: ConditionPreviewProps) {
  const SelectedIcon = icon
    ? CONDITION_ICON_MAP[icon as (typeof CONDITION_PRESET_ICONS)[number]]
    : undefined;
  const trimmedDesc = description.trim();

  return (
    <div className="space-y-1.5">
      <Label>Preview</Label>
      <div className="bg-muted/50 flex items-center gap-2 rounded-md p-3">
        <Badge
          variant="secondary"
          className="gap-1 px-3 py-1 text-sm"
          style={
            color
              ? {
                  backgroundColor: `${color}20`,
                  color,
                  borderColor: `${color}40`,
                  borderWidth: '1px',
                }
              : undefined
          }
        >
          {SelectedIcon && <SelectedIcon className="size-3" />}
          {name || 'Condition'}
        </Badge>
        {trimmedDesc && (
          <span className="text-muted-foreground text-xs">— {trimmedDesc}</span>
        )}
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────── */

interface CustomConditionDialogProps {
  existingNames: string[];
  onSave: (name: string, definition: CustomConditionDefinition) => void;
  trigger?: React.ReactNode;
}

export function CustomConditionDialog({
  existingNames,
  onSave,
  trigger,
}: CustomConditionDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<string | undefined>(undefined);
  const [icon, setIcon] = useState<string | undefined>(undefined);

  const trimmedName = name.trim();
  const isDuplicate = existingNames.some(
    n => n.toLowerCase() === trimmedName.toLowerCase()
  );
  const isValid =
    trimmedName.length > 0 && trimmedName.length <= 40 && !isDuplicate;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setDescription(e.target.value);

  const handleSave = () => {
    if (!isValid) return;
    onSave(trimmedName, {
      description: description.trim() || undefined,
      color,
      icon,
    });
    resetAndClose();
  };

  const resetAndClose = () => {
    setName('');
    setDescription('');
    setColor(undefined);
    setIcon(undefined);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" className="h-7 gap-1">
            <Palette className="size-4" />
            Custom
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Custom Condition</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="condition-name">Name</Label>
            <Input
              id="condition-name"
              placeholder="e.g. Burning, Inspired..."
              value={name}
              onChange={handleNameChange}
              maxLength={40}
              className="h-8 text-sm"
            />
            {isDuplicate && (
              <p className="text-destructive text-xs">
                A condition with this name already exists.
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="condition-desc">Description (optional)</Label>
            <Textarea
              id="condition-desc"
              placeholder="What does this condition do?"
              value={description}
              onChange={handleDescriptionChange}
              maxLength={200}
              className="min-h-12 text-sm"
              rows={2}
            />
          </div>

          {/* Color Picker */}
          <ColorPickerField color={color} onColorChange={setColor} />

          {/* Icon Picker */}
          <IconPickerField icon={icon} onIconChange={setIcon} />

          {/* Preview */}
          <ConditionPreview
            color={color}
            icon={icon}
            name={trimmedName}
            description={description}
          />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            Add Condition
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
