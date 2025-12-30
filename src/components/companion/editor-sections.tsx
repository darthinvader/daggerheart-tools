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

import { COMPANION_TYPE_SUGGESTIONS } from './constants';
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
        <Input
          id="companion-type"
          value={state.type}
          onChange={e => onChange('type', e.target.value)}
          placeholder="e.g., Wolf, Hawk, Bear"
          list="companion-types"
        />
        <datalist id="companion-types">
          {COMPANION_TYPE_SUGGESTIONS.map(type => (
            <option key={type} value={type} />
          ))}
        </datalist>
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
          <Input
            value={exp.name}
            onChange={e => onChange(i, 'name', e.target.value)}
            placeholder="Experience name..."
            list="experience-suggestions"
            className="flex-1"
          />
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
      <datalist id="experience-suggestions">
        {EXAMPLE_EXPERIENCES.map(exp => (
          <option key={exp} value={exp} />
        ))}
      </datalist>
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
          <Input
            value={state.standardAttack}
            onChange={e => onChange('standardAttack', e.target.value)}
            placeholder="e.g., Bite, Claw"
          />
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
