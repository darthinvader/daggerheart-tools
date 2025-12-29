import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ThresholdInputProps {
  id: string;
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  colorClass: string;
  disabled?: boolean;
  suffix?: string;
  errorId?: string;
}

export function ThresholdInput({
  id,
  label,
  value,
  onChange,
  colorClass,
  disabled,
  suffix,
  errorId,
}: ThresholdInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className={cn(colorClass, disabled && 'opacity-50')}>
        {label} {suffix}
      </Label>
      <Input
        id={id}
        type="number"
        min={1}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={cn('font-mono', disabled && 'opacity-50')}
        aria-describedby={errorId}
      />
    </div>
  );
}

interface CustomThresholdsFormProps {
  ids: {
    minorInput: string;
    severeInput: string;
    majorInput: string;
    error: string;
  };
  localMinor: string;
  localSevere: string;
  localMajor: string;
  effectiveMajor: number;
  isShowMajor: boolean;
  isAutoCalculateMajor: boolean;
  validationError: string | null;
  handleMinorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSevereChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMajorInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CustomThresholdsForm({
  ids,
  localMinor,
  localSevere,
  localMajor,
  effectiveMajor,
  isShowMajor,
  isAutoCalculateMajor,
  validationError,
  handleMinorChange,
  handleSevereChange,
  handleMajorInputChange,
}: CustomThresholdsFormProps) {
  const errorId = validationError ? ids.error : undefined;

  return (
    <div className="bg-muted/50 rounded-lg border p-4">
      <div className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
        Custom Thresholds
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <ThresholdInput
          id={ids.minorInput}
          label="Minor"
          value={localMinor}
          onChange={handleMinorChange}
          colorClass="text-amber-700 dark:text-amber-400"
          errorId={errorId}
        />

        <ThresholdInput
          id={ids.severeInput}
          label="Severe"
          value={localSevere}
          onChange={handleSevereChange}
          colorClass="text-orange-700 dark:text-orange-400"
          errorId={errorId}
        />

        {isShowMajor && (
          <ThresholdInput
            id={ids.majorInput}
            label="Major"
            value={isAutoCalculateMajor ? effectiveMajor : localMajor}
            onChange={handleMajorInputChange}
            colorClass="text-red-700 dark:text-red-400"
            disabled={isAutoCalculateMajor}
            suffix={isAutoCalculateMajor ? '(auto)' : undefined}
            errorId={errorId}
          />
        )}
      </div>

      {validationError && (
        <p
          id={ids.error}
          className="text-destructive mt-2 text-sm"
          role="alert"
        >
          {validationError}
        </p>
      )}
    </div>
  );
}
