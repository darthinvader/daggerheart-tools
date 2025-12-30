import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

import {
  AttackSection,
  BasicInfoSection,
  EvasionSection,
  ExperiencesSection,
} from './editor-sections';
import { CheckboxTraining, CounterTraining } from './training-controls';
import type { CompanionState } from './types';

interface CompanionEditorProps {
  state: CompanionState;
  onChange: (state: CompanionState) => void;
}

export function CompanionEditor({ state, onChange }: CompanionEditorProps) {
  const handleChange = <K extends keyof CompanionState>(
    key: K,
    value: CompanionState[K]
  ) => {
    onChange({ ...state, [key]: value });
  };

  const handleExperienceChange = (
    index: number,
    field: 'name' | 'bonus',
    value: string | number
  ) => {
    const newExperiences = [...state.experiences];
    newExperiences[index] = { ...newExperiences[index], [field]: value };
    onChange({ ...state, experiences: newExperiences });
  };

  const handleTrainingToggle = (key: keyof CompanionState['training']) => {
    const training = state.training;
    if (typeof training[key] === 'boolean') {
      onChange({
        ...state,
        training: { ...training, [key]: !training[key] },
      });
    }
  };

  const handleTrainingCount = (
    key: 'intelligent' | 'vicious' | 'resilient' | 'aware',
    delta: number
  ) => {
    const newVal = Math.max(0, Math.min(3, (state.training[key] ?? 0) + delta));
    onChange({
      ...state,
      training: { ...state.training, [key]: newVal },
    });
  };

  const handleAddExperience = () => {
    onChange({
      ...state,
      experiences: [...state.experiences, { name: '', bonus: 2 }],
    });
  };

  return (
    <div className="space-y-6">
      <BasicInfoSection state={state} onChange={handleChange} />
      <EvasionSection
        evasion={state.evasion}
        onChange={v => handleChange('evasion', v)}
      />

      <Separator />

      <ExperiencesSection
        experiences={state.experiences}
        onChange={handleExperienceChange}
        onAdd={handleAddExperience}
      />

      <Separator />

      <AttackSection state={state} onChange={handleChange} />

      <Separator />

      <div className="space-y-3">
        <Label>Training (choose when you level up)</Label>

        <div className="space-y-2">
          <CounterTraining
            label="Intelligent"
            description="+1 to a Companion Experience"
            value={state.training.intelligent ?? 0}
            max={3}
            onChange={delta => handleTrainingCount('intelligent', delta)}
          />
          <CounterTraining
            label="Vicious"
            description="Increase damage die or range by one step"
            value={state.training.vicious ?? 0}
            max={3}
            onChange={delta => handleTrainingCount('vicious', delta)}
          />
          <CounterTraining
            label="Resilient"
            description="Gain an additional Stress slot"
            value={state.training.resilient ?? 0}
            max={3}
            onChange={delta => handleTrainingCount('resilient', delta)}
          />
          <CounterTraining
            label="Aware"
            description="+2 permanent Evasion bonus (stacks)"
            value={state.training.aware ?? 0}
            max={3}
            onChange={delta => handleTrainingCount('aware', delta)}
          />
        </div>

        <div className="space-y-2">
          <CheckboxTraining
            label="Light in the Dark"
            description="Additional Hope slot for your character"
            checked={state.training.lightInTheDark ?? false}
            onCheckedChange={() => handleTrainingToggle('lightInTheDark')}
          />
          <CheckboxTraining
            label="Creature Comfort"
            description="Once per rest: gain Hope or both clear Stress"
            checked={state.training.creatureComfort ?? false}
            onCheckedChange={() => handleTrainingToggle('creatureComfort')}
          />
          <CheckboxTraining
            label="Armored"
            description="Mark your Armor Slot instead of companion Stress"
            checked={state.training.armored ?? false}
            onCheckedChange={() => handleTrainingToggle('armored')}
          />
          <CheckboxTraining
            label="Bonded"
            description="Companion may help you up at last HP"
            checked={state.training.bonded ?? false}
            onCheckedChange={() => handleTrainingToggle('bonded')}
          />
        </div>
      </div>
    </div>
  );
}
