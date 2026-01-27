import { cn } from '@/lib/utils';

import { CustomThresholdsForm } from './custom-thresholds-form';
import { ThresholdCheckbox } from './threshold-checkbox';
import { ThresholdsDisplay } from './thresholds-display';
import { useThresholdsEditorState } from './use-thresholds-editor-state';

interface ThresholdsEditorProps {
  major: number;
  severe: number;
  massiveDamage?: number;
  autoCalculate?: boolean;
  autoCalculateMassiveDamage?: boolean;
  showMassiveDamage?: boolean;
  onMajorChange?: (value: number) => void;
  onSevereChange?: (value: number) => void;
  onMassiveDamageChange?: (value: number) => void;
  onAutoCalculateChange?: (value: boolean) => void;
  onAutoCalculateMassiveDamageChange?: (value: boolean) => void;
  onShowMassiveDamageChange?: (value: boolean) => void;
  baseHp?: number;
  className?: string;
  /** Custom label for the auto-calculate checkbox */
  autoLabel?: string;
  /** Custom tooltip for the auto-calculate checkbox */
  autoTooltip?: string;
}

export function ThresholdsEditor({
  major,
  severe,
  massiveDamage,
  autoCalculate = true,
  autoCalculateMassiveDamage = true,
  showMassiveDamage = false,
  onMajorChange,
  onSevereChange,
  onMassiveDamageChange,
  onAutoCalculateChange,
  onAutoCalculateMassiveDamageChange,
  onShowMassiveDamageChange,
  baseHp = 6,
  className,
  autoLabel = 'Auto-calculate',
  autoTooltip = 'Automatically calculate thresholds based on your base HP. Major = HP ÷ 6, Severe = HP ÷ 3, Massive Damage = Severe × 2.',
}: ThresholdsEditorProps) {
  const {
    ids,
    localMajor,
    localSevere,
    localMassiveDamage,
    effectiveMajor,
    effectiveSevere,
    effectiveMassiveDamage,
    validationError,
    autoCalculate: isAutoCalculate,
    autoCalculateMassiveDamage: isAutoCalculateMassiveDamage,
    showMassiveDamage: isShowMassiveDamage,
    handleMajorChange,
    handleSevereChange,
    handleMassiveDamageInputChange,
    handleAutoToggle,
    handleShowMassiveDamageToggle,
    handleAutoMassiveDamageToggle,
  } = useThresholdsEditorState(
    {
      major,
      severe,
      massiveDamage,
      autoCalculate,
      autoCalculateMassiveDamage,
      showMassiveDamage,
      baseHp,
    },
    {
      onMajorChange,
      onSevereChange,
      onMassiveDamageChange,
      onAutoCalculateChange,
      onAutoCalculateMassiveDamageChange,
      onShowMassiveDamageChange,
    }
  );

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <ThresholdsDisplay
        major={effectiveMajor}
        severe={effectiveSevere}
        massiveDamage={effectiveMassiveDamage}
        showMassiveDamage={isShowMassiveDamage}
      />

      <div className="flex flex-wrap items-center gap-4">
        <ThresholdCheckbox
          id={ids.auto}
          checked={isAutoCalculate}
          onCheckedChange={handleAutoToggle}
          label={autoLabel}
          tooltip={autoTooltip}
        />

        <ThresholdCheckbox
          id={ids.massiveDamage}
          checked={isShowMassiveDamage}
          onCheckedChange={handleShowMassiveDamageToggle}
          label="Enable Massive Damage"
          tooltip="Toggle the Massive Damage threshold (optional 4th tier). When enabled, extremely high damage deals even more HP loss."
        />

        {isShowMassiveDamage && !isAutoCalculate && (
          <ThresholdCheckbox
            id={ids.autoMassiveDamage}
            checked={isAutoCalculateMassiveDamage}
            onCheckedChange={handleAutoMassiveDamageToggle}
            label="Auto-calculate Massive Damage"
            tooltip="Automatically set Massive Damage = Severe × 2. Disable to enter a custom Massive Damage threshold."
          />
        )}
      </div>

      {!isAutoCalculate && (
        <CustomThresholdsForm
          ids={ids}
          localMajor={localMajor}
          localSevere={localSevere}
          localMassiveDamage={localMassiveDamage}
          effectiveMassiveDamage={effectiveMassiveDamage}
          isShowMassiveDamage={isShowMassiveDamage}
          isAutoCalculateMassiveDamage={isAutoCalculateMassiveDamage}
          validationError={validationError}
          handleMajorChange={handleMajorChange}
          handleSevereChange={handleSevereChange}
          handleMassiveDamageInputChange={handleMassiveDamageInputChange}
        />
      )}
    </div>
  );
}
