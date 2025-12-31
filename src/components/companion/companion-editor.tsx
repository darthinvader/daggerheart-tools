import { Separator } from '@/components/ui/separator';

import {
  AttackSection,
  BasicInfoSection,
  EvasionSection,
  ExperiencesSection,
} from './editor-sections';
import { TrainingSection } from './training-section';
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

      <TrainingSection
        training={state.training}
        onToggle={handleTrainingToggle}
        onCount={handleTrainingCount}
      />
    </div>
  );
}
