import { ChevronDown, ChevronUp, Info, Zap } from 'lucide-react';
import { type ReactNode, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import {
  COUNTDOWN_BEHAVIOR_OPTIONS,
  COUNTDOWN_SEGMENT_OPTIONS,
  COUNTDOWN_TYPES,
  TRIGGER_ACTION_OPTIONS,
  VARIANCE_OPTIONS,
} from './constants';
import { createCountdown } from './countdown-utils';
import type {
  Countdown,
  CountdownBehavior,
  CountdownType,
  VarianceMode,
} from './types';

// --- Form state ---

type TriggerActionType =
  | 'notify'
  | 'spawn_adversary'
  | 'environment_change'
  | 'custom';

interface CountdownFormState {
  name: string;
  description: string;
  segments: number;
  type: CountdownType;
  showAdvanced: boolean;
  dynamicAdvancement: boolean;
  behavior: CountdownBehavior;
  variance: VarianceMode;
  hasTrigger: boolean;
  triggerDescription: string;
  triggerAction: TriggerActionType;
}

const INITIAL_FORM_STATE: CountdownFormState = {
  name: '',
  description: '',
  segments: 6,
  type: 'neutral',
  showAdvanced: false,
  dynamicAdvancement: false,
  behavior: 'once',
  variance: 'none',
  hasTrigger: false,
  triggerDescription: '',
  triggerAction: 'notify',
};

type FieldUpdater = <K extends keyof CountdownFormState>(
  field: K,
  value: CountdownFormState[K]
) => void;

// --- Reusable sub-components ---

function LabelWithTooltip({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <Label>{label}</Label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Info className="text-muted-foreground h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">{children}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

function OptionSelectItem({
  label,
  description,
}: {
  label: string;
  description: string;
}) {
  return (
    <div className="flex flex-col">
      <span>{label}</span>
      <span className="text-muted-foreground text-xs">{description}</span>
    </div>
  );
}

// --- Form section sub-components ---

function NameDescriptionFields({
  name,
  description,
  updateField,
}: {
  name: string;
  description: string;
  updateField: FieldUpdater;
}) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="countdown-name">Name</Label>
        <Input
          id="countdown-name"
          value={name}
          onChange={e => updateField('name', e.target.value)}
          placeholder="e.g., Ritual Completion"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="countdown-description">Description (optional)</Label>
        <Textarea
          id="countdown-description"
          value={description}
          onChange={e => updateField('description', e.target.value)}
          placeholder="What happens when complete?"
          rows={2}
        />
      </div>
    </>
  );
}

function SegmentsTypeGrid({
  segments,
  type,
  updateField,
}: {
  segments: number;
  type: CountdownType;
  updateField: FieldUpdater;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Segments</Label>
        <Select
          value={String(segments)}
          onValueChange={v => updateField('segments', Number(v))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COUNTDOWN_SEGMENT_OPTIONS.map(n => (
              <SelectItem key={n} value={String(n)}>
                {n} segments
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Type</Label>
        <Select
          value={type}
          onValueChange={v => updateField('type', v as CountdownType)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COUNTDOWN_TYPES.map(t => (
              <SelectItem key={t.value} value={t.value}>
                <span className={t.color}>{t.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function DynamicAdvancementToggle({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <Zap className="h-5 w-5 text-yellow-500" />
        <div>
          <Label htmlFor="dynamic-advancement" className="cursor-pointer">
            Dynamic Advancement
          </Label>
          <p className="text-muted-foreground text-xs">
            Advance based on roll results (Crit +3, Hope +2, Fear +1)
          </p>
        </div>
      </div>
      <Switch
        id="dynamic-advancement"
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}

function BehaviorSelect({
  value,
  onValueChange,
}: {
  value: CountdownBehavior;
  onValueChange: (value: CountdownBehavior) => void;
}) {
  return (
    <div className="space-y-2">
      <LabelWithTooltip label="Completion Behavior">
        <p>
          <strong>Once:</strong> Completes and stops
        </p>
        <p>
          <strong>Loop:</strong> Restarts when complete
        </p>
        <p>
          <strong>Pause:</strong> Stays at max until reset
        </p>
      </LabelWithTooltip>
      <Select
        value={value}
        onValueChange={v => onValueChange(v as CountdownBehavior)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {COUNTDOWN_BEHAVIOR_OPTIONS.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>
              <OptionSelectItem
                label={opt.label}
                description={opt.description}
              />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function VarianceSelect({
  value,
  onValueChange,
}: {
  value: VarianceMode;
  onValueChange: (value: VarianceMode) => void;
}) {
  return (
    <div className="space-y-2">
      <LabelWithTooltip label="Starting Variance">
        <p>
          Randomize the starting position when the countdown is created or
          loops.
        </p>
      </LabelWithTooltip>
      <Select
        value={value}
        onValueChange={v => onValueChange(v as VarianceMode)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {VARIANCE_OPTIONS.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>
              <OptionSelectItem
                label={opt.label}
                description={opt.description}
              />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function TriggerFields({
  triggerDescription,
  triggerAction,
  updateField,
}: {
  triggerDescription: string;
  triggerAction: TriggerActionType;
  updateField: FieldUpdater;
}) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="trigger-description">Trigger Description</Label>
        <Textarea
          id="trigger-description"
          value={triggerDescription}
          onChange={e => updateField('triggerDescription', e.target.value)}
          placeholder="What happens when this fires?"
          rows={2}
        />
      </div>
      <div className="space-y-2">
        <Label>Trigger Action</Label>
        <Select
          value={triggerAction}
          onValueChange={v =>
            updateField('triggerAction', v as TriggerActionType)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TRIGGER_ACTION_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                <OptionSelectItem
                  label={opt.label}
                  description={opt.description}
                />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}

function TriggerSection({
  hasTrigger,
  triggerDescription,
  triggerAction,
  updateField,
}: {
  hasTrigger: boolean;
  triggerDescription: string;
  triggerAction: TriggerActionType;
  updateField: FieldUpdater;
}) {
  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="has-trigger" className="cursor-pointer">
          Add Trigger
        </Label>
        <Switch
          id="has-trigger"
          checked={hasTrigger}
          onCheckedChange={v => updateField('hasTrigger', v)}
        />
      </div>

      {hasTrigger && (
        <TriggerFields
          triggerDescription={triggerDescription}
          triggerAction={triggerAction}
          updateField={updateField}
        />
      )}
    </div>
  );
}

function AdvancedOptionsSection({
  form,
  updateField,
}: {
  form: CountdownFormState;
  updateField: FieldUpdater;
}) {
  const ChevronIcon = form.showAdvanced ? ChevronUp : ChevronDown;

  return (
    <Collapsible
      open={form.showAdvanced}
      onOpenChange={v => updateField('showAdvanced', v)}
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="flex w-full items-center justify-between"
        >
          <span>Advanced Options</span>
          <ChevronIcon className="h-4 w-4" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pt-4">
        <BehaviorSelect
          value={form.behavior}
          onValueChange={v => updateField('behavior', v)}
        />
        <VarianceSelect
          value={form.variance}
          onValueChange={v => updateField('variance', v)}
        />
        <TriggerSection
          hasTrigger={form.hasTrigger}
          triggerDescription={form.triggerDescription}
          triggerAction={form.triggerAction}
          updateField={updateField}
        />
      </CollapsibleContent>
    </Collapsible>
  );
}

// --- Main component ---

interface AddCountdownDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (countdown: Countdown) => void;
}

function buildCountdownFromForm(form: CountdownFormState): Countdown {
  return createCountdown({
    name: form.name.trim(),
    description: form.description.trim() || undefined,
    segments: form.segments,
    type: form.type,
    dynamicAdvancement: form.dynamicAdvancement,
    behavior: form.behavior,
    variance: form.variance,
    trigger: form.hasTrigger
      ? {
          description: form.triggerDescription.trim() || 'Countdown complete',
          action: form.triggerAction,
        }
      : undefined,
  });
}

export function AddCountdownDialog({
  isOpen,
  onClose,
  onAdd,
}: AddCountdownDialogProps) {
  const [form, setForm] = useState<CountdownFormState>(INITIAL_FORM_STATE);

  const updateField: FieldUpdater = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    setForm(INITIAL_FORM_STATE);
    onClose();
  };

  const handleAdd = () => {
    if (!form.name.trim()) return;

    onAdd(buildCountdownFromForm(form));
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-lg overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Countdown</DialogTitle>
          <DialogDescription>
            Create a countdown to track events, threats, or opportunities.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <NameDescriptionFields
            name={form.name}
            description={form.description}
            updateField={updateField}
          />
          <SegmentsTypeGrid
            segments={form.segments}
            type={form.type}
            updateField={updateField}
          />
          <DynamicAdvancementToggle
            checked={form.dynamicAdvancement}
            onCheckedChange={v => updateField('dynamicAdvancement', v)}
          />
          <AdvancedOptionsSection form={form} updateField={updateField} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={!form.name.trim()}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
