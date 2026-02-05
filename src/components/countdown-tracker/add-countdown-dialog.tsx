import { ChevronDown, ChevronUp, Info, Zap } from 'lucide-react';
import { useState } from 'react';

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

interface AddCountdownDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (countdown: Countdown) => void;
}

export function AddCountdownDialog({
  isOpen,
  onClose,
  onAdd,
}: AddCountdownDialogProps) {
  // Basic fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [segments, setSegments] = useState(6);
  const [type, setType] = useState<CountdownType>('neutral');

  // Advanced options
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [dynamicAdvancement, setDynamicAdvancement] = useState(false);
  const [behavior, setBehavior] = useState<CountdownBehavior>('once');
  const [variance, setVariance] = useState<VarianceMode>('none');

  // Trigger options
  const [hasTrigger, setHasTrigger] = useState(false);
  const [triggerDescription, setTriggerDescription] = useState('');
  const [triggerAction, setTriggerAction] = useState<
    'notify' | 'spawn_adversary' | 'environment_change' | 'custom'
  >('notify');

  const resetForm = () => {
    setName('');
    setDescription('');
    setSegments(6);
    setType('neutral');
    setShowAdvanced(false);
    setDynamicAdvancement(false);
    setBehavior('once');
    setVariance('none');
    setHasTrigger(false);
    setTriggerDescription('');
    setTriggerAction('notify');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAdd = () => {
    if (!name.trim()) return;

    const countdown = createCountdown({
      name: name.trim(),
      description: description.trim() || undefined,
      segments,
      type,
      dynamicAdvancement,
      behavior,
      variance,
      trigger: hasTrigger
        ? {
            description: triggerDescription.trim() || 'Countdown complete',
            action: triggerAction,
          }
        : undefined,
    });

    onAdd(countdown);
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
          {/* Basic Fields */}
          <div className="space-y-2">
            <Label htmlFor="countdown-name">Name</Label>
            <Input
              id="countdown-name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Ritual Completion"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="countdown-description">
              Description (optional)
            </Label>
            <Textarea
              id="countdown-description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What happens when complete?"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Segments</Label>
              <Select
                value={String(segments)}
                onValueChange={v => setSegments(Number(v))}
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
                onValueChange={v => setType(v as CountdownType)}
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

          {/* Dynamic Advancement Toggle */}
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
              checked={dynamicAdvancement}
              onCheckedChange={setDynamicAdvancement}
            />
          </div>

          {/* Advanced Options Collapsible */}
          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-full items-center justify-between"
              >
                <span>Advanced Options</span>
                {showAdvanced ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              {/* Behavior */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Completion Behavior</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="text-muted-foreground h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>
                          <strong>Once:</strong> Completes and stops
                        </p>
                        <p>
                          <strong>Loop:</strong> Restarts when complete
                        </p>
                        <p>
                          <strong>Pause:</strong> Stays at max until reset
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select
                  value={behavior}
                  onValueChange={v => setBehavior(v as CountdownBehavior)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTDOWN_BEHAVIOR_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex flex-col">
                          <span>{opt.label}</span>
                          <span className="text-muted-foreground text-xs">
                            {opt.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Variance */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Starting Variance</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="text-muted-foreground h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>
                          Randomize the starting position when the countdown is
                          created or loops.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select
                  value={variance}
                  onValueChange={v => setVariance(v as VarianceMode)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VARIANCE_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex flex-col">
                          <span>{opt.label}</span>
                          <span className="text-muted-foreground text-xs">
                            {opt.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Trigger */}
              <div className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="has-trigger" className="cursor-pointer">
                    Add Trigger
                  </Label>
                  <Switch
                    id="has-trigger"
                    checked={hasTrigger}
                    onCheckedChange={setHasTrigger}
                  />
                </div>

                {hasTrigger && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="trigger-description">
                        Trigger Description
                      </Label>
                      <Textarea
                        id="trigger-description"
                        value={triggerDescription}
                        onChange={e => setTriggerDescription(e.target.value)}
                        placeholder="What happens when this fires?"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Trigger Action</Label>
                      <Select
                        value={triggerAction}
                        onValueChange={v =>
                          setTriggerAction(
                            v as
                              | 'notify'
                              | 'spawn_adversary'
                              | 'environment_change'
                              | 'custom'
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TRIGGER_ACTION_OPTIONS.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>
                              <div className="flex flex-col">
                                <span>{opt.label}</span>
                                <span className="text-muted-foreground text-xs">
                                  {opt.description}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={!name.trim()}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
