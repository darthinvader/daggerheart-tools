import { FeaturesList } from '@/components/characters/features-list';
import { CharacterCardHeader } from '@/components/characters/presenters/card-header';
// Title becomes tappable; no separate header icon
import { Card, CardContent } from '@/components/ui/card';
import type { FeatureView } from '@/features/characters/logic';

export type FeaturesCardProps = {
  level: number;
  features: FeatureView[];
  onEdit?: () => void;
  selections?: Record<string, string | number | boolean>;
};

export function FeaturesCard({
  level,
  features,
  onEdit,
  selections,
}: FeaturesCardProps) {
  const isInteractive = (t: EventTarget | null) => {
    if (!(t instanceof HTMLElement)) return false;
    return !!t.closest(
      'button, a, input, textarea, select, [role="button"], [role="link"], [contenteditable="true"], [data-no-open]'
    );
  };
  return (
    <Card>
      <CharacterCardHeader
        title="Class Features"
        titleClassName="text-lg sm:text-xl"
        onTitleClick={onEdit}
      />
      <CardContent
        role={onEdit ? 'button' : undefined}
        tabIndex={onEdit ? 0 : undefined}
        onClick={e => {
          if (!onEdit || isInteractive(e.target)) return;
          onEdit();
        }}
        onKeyDown={e => {
          if (!onEdit || isInteractive(e.target)) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onEdit();
          }
        }}
        className={
          onEdit
            ? 'hover:bg-accent/30 focus-visible:ring-ring cursor-pointer rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none'
            : undefined
        }
      >
        <FeaturesList
          level={level}
          features={features}
          selections={selections}
        />
      </CardContent>
    </Card>
  );
}
