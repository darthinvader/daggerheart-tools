import { Plus } from 'lucide-react';

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
import { Separator } from '@/components/ui/separator';

import {
  COMPANION_ATTACK_SUGGESTIONS,
  COMPANION_TYPE_SUGGESTIONS,
} from './constants';
import {
  type CompanionDamageDie,
  type CompanionRange,
  type CompanionState,
  EXAMPLE_EXPERIENCES,
} from './types';

const DAMAGE_DICE: CompanionDamageDie[] = ['d6', 'd8', 'd10', 'd12'];
const RANGES: CompanionRange[] = ['Melee', 'Close', 'Far'];

interface BasicInfoSectionProps {
  state: CompanionState;
  onChange: <K extends keyof CompanionState>(
    key: K,
    value: CompanionState[K]
  ) => void;
}

export function BasicInfoSection({ state, onChange }: BasicInfoSectionProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="companion-name">Companion Name</Label>
        <Input
          id="companion-name"
          value={state.name}
          onChange={e => onChange('name', e.target.value)}
          placeholder="e.g., Shadow, Bramble, Luna"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="companion-type">Creature Type</Label>
        <Select
          value={state.type}
          onValueChange={value => onChange('type', value)}
        >
          <SelectTrigger id="companion-type">
            <SelectValue placeholder="Select a creature type" />
          </SelectTrigger>
          <SelectContent>
            {COMPANION_TYPE_SUGGESTIONS.map(type => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

interface ExperiencesSectionProps {
  experiences: CompanionState['experiences'];
  onChange: (
    index: number,
    field: 'name' | 'bonus',
    value: string | number
  ) => void;
  onAdd: () => void;
}

export function ExperiencesSection({
  experiences,
  onChange,
  onAdd,
}: ExperiencesSectionProps) {
  return (
    <div className="space-y-3">
      <Label>Companion Experiences (start at +2 each)</Label>
      <p className="text-muted-foreground text-xs">
        Create two experiences based on your companion's training and history
        together.
      </p>
      {experiences.map((exp, i) => (
        <div key={i} className="flex gap-2">
          <Select
            value={exp.name}
            onValueChange={value => onChange(i, 'name', value)}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select an experience" />
            </SelectTrigger>
            <SelectContent>
              {EXAMPLE_EXPERIENCES.map(example => (
                <SelectItem key={example} value={example}>
                  {example}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1">
            <span className="text-sm">+</span>
            <Input
              type="number"
              min={0}
              value={exp.bonus}
              onChange={e =>
                onChange(i, 'bonus', parseInt(e.target.value) || 2)
              }
              className="w-16"
            />
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={onAdd}>
        <Plus className="mr-1 h-3 w-3" />
        Add Experience
      </Button>
    </div>
  );
}

interface AttackSectionProps {
  state: CompanionState;
  onChange: <K extends keyof CompanionState>(
    key: K,
    value: CompanionState[K]
  ) => void;
}

export function AttackSection({ state, onChange }: AttackSectionProps) {
  return (
    <div className="space-y-3">
      <Label>Attack & Damage</Label>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1">
          <Label className="text-muted-foreground text-xs">
            Standard Attack
          </Label>
          <Select
            value={state.standardAttack}
            onValueChange={value => onChange('standardAttack', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an attack" />
            </SelectTrigger>
            <SelectContent>
              {COMPANION_ATTACK_SUGGESTIONS.map(attack => (
                <SelectItem key={attack} value={attack}>
                  {attack}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-muted-foreground text-xs">Damage Die</Label>
          <Select
            value={state.damageDie}
            onValueChange={v => onChange('damageDie', v as CompanionDamageDie)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DAMAGE_DICE.map(die => (
                <SelectItem key={die} value={die}>
                  {die}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-muted-foreground text-xs">Range</Label>
          <Select
            value={state.range}
            onValueChange={v => onChange('range', v as CompanionRange)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RANGES.map(range => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

interface EvasionSectionProps {
  evasion: number;
  onChange: (value: number) => void;
}

export function EvasionSection({ evasion, onChange }: EvasionSectionProps) {
  return (
    <div className="space-y-2">
      <Label>Evasion (starts at 10)</Label>
      <Input
        type="number"
        min={0}
        value={evasion}
        onChange={e => onChange(parseInt(e.target.value) || 10)}
        className="w-24"
      />
    </div>
  );
}

export { Separator };
