import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { CharacteristicsIcon } from './ancestry-icons';

interface HomebrewCharacteristicsFieldProps {
  value: string;
  characteristicsCount: number;
  onChange: (value: string) => void;
}

export function HomebrewCharacteristicsField({
  value,
  characteristicsCount,
  onChange,
}: HomebrewCharacteristicsFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="hb-chars" className="flex items-center gap-2">
        <CharacteristicsIcon />
        Physical Characteristics (one per line)
      </Label>
      <Textarea
        id="hb-chars"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={`Enter physical characteristics, one per line:
Built from organic materials
Bioluminescent markings
Regenerative capabilities`}
        className="min-h-30"
      />
      <p className="text-muted-foreground text-sm">
        {characteristicsCount} characteristic(s) added
      </p>
    </div>
  );
}
