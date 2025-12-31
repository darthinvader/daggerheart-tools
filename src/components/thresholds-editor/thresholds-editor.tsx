import { cn } from '@/lib/utils';

import { CustomThresholdsForm } from './custom-thresholds-form';
import { ThresholdCheckbox } from './threshold-checkbox';
import { ThresholdsDisplay } from './thresholds-display';
import { useThresholdsEditorState } from './use-thresholds-editor-state';

interface ThresholdsEditorProps {
  minor: number;
  severe: number;
  major?: number;
  autoCalculate?: boolean;
  autoCalculateMajor?: boolean;
  showMajor?: boolean;
  onMinorChange?: (value: number) => void;
  onSevereChange?: (value: number) => void;
  onMajorChange?: (value: number) => void;
  onAutoCalculateChange?: (value: boolean) => void;
  onAutoCalculateMajorChange?: (value: boolean) => void;
  onShowMajorChange?: (value: boolean) => void;
  baseHp?: number;
  className?: string;
  /** Custom label for the auto-calculate checkbox */
  autoLabel?: string;
  /** Custom tooltip for the auto-calculate checkbox */
  autoTooltip?: string;
}

export function ThresholdsEditor({
  minor,
  severe,
  major,
  autoCalculate = true,
  autoCalculateMajor = true,
  showMajor = false,
  onMinorChange,
  onSevereChange,
  onMajorChange,
  onAutoCalculateChange,
  onAutoCalculateMajorChange,
  onShowMajorChange,
  baseHp = 6,
  className,
  autoLabel = 'Auto-calculate',
  autoTooltip = 'Automatically calculate thresholds based on your base HP. Minor = HP ÷ 6, Severe = HP ÷ 3, Major = Severe × 2.',
}: ThresholdsEditorProps) {
  const {
    ids,
    localMinor,
    localSevere,
    localMajor,
    effectiveMinor,
    effectiveSevere,
    effectiveMajor,
    validationError,
    autoCalculate: isAutoCalculate,
    autoCalculateMajor: isAutoCalculateMajor,
    showMajor: isShowMajor,
    handleMinorChange,
    handleSevereChange,
    handleMajorInputChange,
    handleAutoToggle,
    handleShowMajorToggle,
    handleAutoMajorToggle,
  } = useThresholdsEditorState(
    {
      minor,
      severe,
      major,
      autoCalculate,
      autoCalculateMajor,
      showMajor,
      baseHp,
    },
    {
      onMinorChange,
      onSevereChange,
      onMajorChange,
      onAutoCalculateChange,
      onAutoCalculateMajorChange,
      onShowMajorChange,
    }
  );

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <ThresholdsDisplay
        minor={effectiveMinor}
        severe={effectiveSevere}
        major={effectiveMajor}
        showMajor={isShowMajor}
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
          id={ids.major}
          checked={isShowMajor}
          onCheckedChange={handleShowMajorToggle}
          label="Enable Major Damage"
          tooltip="Toggle the Major Damage threshold (optional 4th tier). When enabled, extremely high damage deals even more HP loss."
        />

        {isShowMajor && !isAutoCalculate && (
          <ThresholdCheckbox
            id={ids.autoMajor}
            checked={isAutoCalculateMajor}
            onCheckedChange={handleAutoMajorToggle}
            label="Auto-calculate Major"
            tooltip="Automatically set Major = Severe × 2. Disable to enter a custom Major threshold."
          />
        )}
      </div>

      {!isAutoCalculate && (
        <CustomThresholdsForm
          ids={ids}
          localMinor={localMinor}
          localSevere={localSevere}
          localMajor={localMajor}
          effectiveMajor={effectiveMajor}
          isShowMajor={isShowMajor}
          isAutoCalculateMajor={isAutoCalculateMajor}
          validationError={validationError}
          handleMinorChange={handleMinorChange}
          handleSevereChange={handleSevereChange}
          handleMajorInputChange={handleMajorInputChange}
        />
      )}
    </div>
  );
}
