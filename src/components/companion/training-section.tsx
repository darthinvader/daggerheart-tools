import { GraduationCap } from 'lucide-react';

import { Label } from '@/components/ui/label';

import { CompanionTrainingIcons } from './constants';
import { CheckboxTraining, CounterTraining } from './training-controls';
import type { CompanionState } from './types';

interface TrainingSectionProps {
  training: CompanionState['training'];
  onToggle: (key: keyof CompanionState['training']) => void;
  onCount: (
    key: 'intelligent' | 'vicious' | 'resilient' | 'aware',
    delta: number
  ) => void;
}

export function TrainingSection({
  training,
  onToggle,
  onCount,
}: TrainingSectionProps) {
  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2">
        <GraduationCap className="size-5" />
        Training (choose when you level up)
      </Label>

      <div className="space-y-2">
        <CounterTraining
          label="Intelligent"
          description="+1 to a Companion Experience"
          value={training.intelligent ?? 0}
          max={3}
          onChange={delta => onCount('intelligent', delta)}
          Icon={CompanionTrainingIcons.intelligent}
          color="border-blue-400/50"
        />
        <CounterTraining
          label="Vicious"
          description="Increase damage die or range by one step"
          value={training.vicious ?? 0}
          max={3}
          onChange={delta => onCount('vicious', delta)}
          Icon={CompanionTrainingIcons.vicious}
          color="border-red-400/50"
        />
        <CounterTraining
          label="Resilient"
          description="Gain an additional Stress slot"
          value={training.resilient ?? 0}
          max={3}
          onChange={delta => onCount('resilient', delta)}
          Icon={CompanionTrainingIcons.resilient}
          color="border-amber-400/50"
        />
        <CounterTraining
          label="Aware"
          description="+2 permanent Evasion bonus (stacks)"
          value={training.aware ?? 0}
          max={3}
          onChange={delta => onCount('aware', delta)}
          Icon={CompanionTrainingIcons.aware}
          color="border-purple-400/50"
        />
      </div>

      <div className="space-y-2">
        <CheckboxTraining
          label="Light in the Dark"
          description="Additional Hope slot for your character"
          checked={training.lightInTheDark ?? false}
          onCheckedChange={() => onToggle('lightInTheDark')}
          Icon={CompanionTrainingIcons.lightInTheDark}
          color="border-yellow-400/50"
        />
        <CheckboxTraining
          label="Creature Comfort"
          description="Once per rest: gain Hope or both clear Stress"
          checked={training.creatureComfort ?? false}
          onCheckedChange={() => onToggle('creatureComfort')}
          Icon={CompanionTrainingIcons.creatureComfort}
          color="border-pink-400/50"
        />
        <CheckboxTraining
          label="Armored"
          description="Mark your Armor Slot instead of companion Stress"
          checked={training.armored ?? false}
          onCheckedChange={() => onToggle('armored')}
          Icon={CompanionTrainingIcons.armored}
          color="border-slate-400/50"
        />
        <CheckboxTraining
          label="Bonded"
          description="Companion may help you up at last HP"
          checked={training.bonded ?? false}
          onCheckedChange={() => onToggle('bonded')}
          Icon={CompanionTrainingIcons.bonded}
          color="border-green-400/50"
        />
      </div>
    </div>
  );
}
