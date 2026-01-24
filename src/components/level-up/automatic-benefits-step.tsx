import { Check, Gift, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface AutomaticBenefitsStepProps {
  targetLevel: number;
  getsNewExperience: boolean;
  freeDomainCard: string | null;
  newExperienceName: string | null;
  onSelectFreeDomainCard: () => void;
  onSelectNewExperience: () => void;
}

export function AutomaticBenefitsStep({
  targetLevel,
  getsNewExperience,
  freeDomainCard,
  newExperienceName,
  onSelectFreeDomainCard,
  onSelectNewExperience,
}: AutomaticBenefitsStepProps) {
  return (
    <div className="space-y-4 overflow-y-auto p-6">
      <section>
        <h4 className="mb-3 flex items-center gap-2 font-semibold">
          <Sparkles className="size-4" /> Automatic Benefits
        </h4>
        <div className="space-y-2">
          {(targetLevel === 2 || targetLevel === 5 || targetLevel === 8) && (
            <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm">
              <Check className="size-4 text-green-600" />
              <span>Gain +1 Proficiency</span>
            </div>
          )}
          {(targetLevel === 5 || targetLevel === 8) && (
            <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm">
              <Check className="size-4 text-green-600" />
              <span>Clear all marks on character traits</span>
            </div>
          )}
          <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm">
            <Check className="size-4 text-green-600" />
            <span>Damage thresholds increase by +1</span>
          </div>
        </div>
      </section>

      <Separator />

      <section>
        <h4 className="mb-3 flex items-center gap-2 font-semibold">
          <Gift className="size-4" /> Select Your Benefits
        </h4>
        <div className="space-y-3">
          <div
            className={cn(
              'flex items-center justify-between rounded-lg border p-4 transition-colors',
              freeDomainCard
                ? 'border-green-500/50 bg-green-500/10'
                : 'border-amber-500/50 bg-amber-500/10'
            )}
          >
            <div>
              <div className="font-medium">Free Domain Card</div>
              <p className="text-muted-foreground text-sm">
                {freeDomainCard
                  ? `Selected: ${freeDomainCard}`
                  : 'Choose a domain card of your level or lower'}
              </p>
            </div>
            <Button
              variant={freeDomainCard ? 'secondary' : 'default'}
              size="sm"
              onClick={onSelectFreeDomainCard}
            >
              {freeDomainCard ? 'Change' : 'Select'}
            </Button>
          </div>

          {getsNewExperience && (
            <div
              className={cn(
                'flex items-center justify-between rounded-lg border p-4 transition-colors',
                newExperienceName
                  ? 'border-green-500/50 bg-green-500/10'
                  : 'border-amber-500/50 bg-amber-500/10'
              )}
            >
              <div>
                <div className="font-medium">New Experience (+2)</div>
                <p className="text-muted-foreground text-sm">
                  {newExperienceName
                    ? `Added: ${newExperienceName}`
                    : 'Name your new experience'}
                </p>
              </div>
              <Button
                variant={newExperienceName ? 'secondary' : 'default'}
                size="sm"
                onClick={onSelectNewExperience}
              >
                {newExperienceName ? 'Change' : 'Add'}
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
