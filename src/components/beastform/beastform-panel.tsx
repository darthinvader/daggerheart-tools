/**
 * BeastformPanel
 *
 * Panel for activating beastform. Shows available forms based on tier,
 * allows selecting a form, choosing activation method (Stress or Evolution),
 * and if Evolution, picking the bonus trait.
 */

import { PawPrint, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  CHARACTER_TRAITS,
  type CharacterTrait,
} from '@/lib/character-stats-engine/types';
import type { BeastformDefinition } from '@/lib/data/beastforms';

interface BeastformPanelProps {
  availableForms: BeastformDefinition[];
  isActive: boolean;
  onActivateWithStress: (formId: string) => void;
  onActivateWithEvolution: (formId: string, bonusTrait: CharacterTrait) => void;
  onDeactivate: () => void;
  readOnly?: boolean;
}

export function BeastformPanel({
  availableForms,
  isActive,
  onActivateWithStress,
  onActivateWithEvolution,
  onDeactivate,
  readOnly,
}: BeastformPanelProps) {
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [showEvolutionPicker, setShowEvolutionPicker] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const selectedForm = availableForms.find(f => f.id === selectedFormId);

  // Group forms by tier
  const formsByTier = availableForms.reduce<
    Record<number, BeastformDefinition[]>
  >((acc, form) => {
    (acc[form.tier] ??= []).push(form);
    return acc;
  }, {});

  function handleActivateStress() {
    if (!selectedFormId) return;
    onActivateWithStress(selectedFormId);
    setIsOpen(false);
    setSelectedFormId(null);
  }

  function handleActivateEvolution(trait: CharacterTrait) {
    if (!selectedFormId) return;
    onActivateWithEvolution(selectedFormId, trait);
    setIsOpen(false);
    setSelectedFormId(null);
    setShowEvolutionPicker(false);
  }

  if (isActive) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onDeactivate}
        disabled={readOnly}
        className="border-emerald-500/50 text-emerald-300"
      >
        <PawPrint className="mr-1 size-4" />
        Drop Beastform
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={readOnly || availableForms.length === 0}
          className="border-emerald-500/50 text-emerald-300 hover:bg-emerald-950/50"
        >
          <PawPrint className="mr-1 size-4" />
          Beastform
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PawPrint className="size-5 text-emerald-400" />
            Transform into Beastform
          </DialogTitle>
          <DialogDescription>
            Choose a creature form of your tier or lower. Mark a Stress to
            transform, or spend 3 Hope via Evolution.
          </DialogDescription>
        </DialogHeader>

        {showEvolutionPicker && selectedForm ? (
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm">
              Choose a trait to gain +1 while in{' '}
              <strong>{selectedForm.name}</strong> form (Evolution bonus):
            </p>
            <div className="grid grid-cols-2 gap-2">
              {CHARACTER_TRAITS.map(trait => (
                <Button
                  key={trait}
                  variant="outline"
                  size="sm"
                  onClick={() => handleActivateEvolution(trait)}
                  className="justify-start"
                >
                  <Sparkles className="mr-1.5 size-3.5 text-amber-400" />
                  +1 {trait}
                </Button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEvolutionPicker(false)}
              className="w-full"
            >
              Back
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(formsByTier)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([tier, forms]) => (
                <div key={tier}>
                  <h4 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                    Tier {tier}
                  </h4>
                  <div className="space-y-2">
                    {forms.map(form => (
                      <BeastformCard
                        key={form.id}
                        form={form}
                        isSelected={selectedFormId === form.id}
                        onSelect={() => setSelectedFormId(form.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}

            {selectedForm && (
              <div className="flex gap-2 border-t pt-3">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleActivateStress}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-600"
                >
                  <Zap className="mr-1 size-4" />
                  Mark Stress
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEvolutionPicker(true)}
                  className="flex-1 border-amber-500/50 text-amber-300 hover:bg-amber-950/50"
                >
                  <Sparkles className="mr-1 size-4" />
                  Evolution (3 Hope)
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function BeastformCard({
  form,
  isSelected,
  onSelect,
}: {
  form: BeastformDefinition;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <Card
      className={`cursor-pointer transition-colors ${
        isSelected
          ? 'border-emerald-500 bg-emerald-950/30'
          : 'hover:border-emerald-500/30 hover:bg-emerald-950/10'
      }`}
      onClick={onSelect}
      role="option"
      aria-selected={isSelected}
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <CardHeader className="p-3 pb-1">
        <CardTitle className="flex items-center gap-2 text-sm">
          {form.name}
          <Badge variant="secondary" className="text-xs">
            +{form.traitBonus.value} {form.traitBonus.trait}
          </Badge>
          {form.evasionBonus > 0 && (
            <Badge variant="outline" className="text-xs">
              +{form.evasionBonus} Evasion
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-xs">
          {form.examples.join(', ')}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="text-muted-foreground flex flex-wrap gap-1 text-xs">
          <span>
            {form.attack.damageDice} {form.attack.trait} ({form.attack.range})
          </span>
          {form.features.map(f => (
            <Badge key={f.name} variant="outline" className="text-xs">
              {f.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
