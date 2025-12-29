import { memo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import type { GameSubclass } from '@/lib/data/classes';
import { CLASS_COLORS } from '@/lib/schemas/class-selection';
import { cn } from '@/lib/utils';

import { SubclassFeatureList } from './subclass-feature-list';

interface SubclassCardProps {
  subclass: GameSubclass;
  className: string;
  isSelected: boolean;
  onSelect: () => void;
}

function SpellcastBadge({ trait }: { trait: string }) {
  return (
    <SmartTooltip
      content={
        <>
          <p className="text-xs">
            <strong>Spellcast Trait:</strong> {trait}
          </p>
          <p className="text-muted-foreground text-xs">
            Use this trait for Spellcast Rolls
          </p>
        </>
      }
    >
      <Badge
        variant="outline"
        className="cursor-help border-violet-500/50 text-xs text-violet-600"
      >
        ✨ {trait}
      </Badge>
    </SmartTooltip>
  );
}

function CompanionBadge() {
  return (
    <SmartTooltip
      content={
        <>
          <p className="text-xs">
            <strong>Animal Companion</strong>
          </p>
          <p className="text-muted-foreground text-xs">
            This subclass includes an animal ally
          </p>
        </>
      }
    >
      <Badge variant="secondary" className="cursor-help text-xs">
        🐾 Companion
      </Badge>
    </SmartTooltip>
  );
}

function SubclassCardComponent({
  subclass,
  className,
  isSelected,
  onSelect,
}: SubclassCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const colorClass = CLASS_COLORS[className] ?? 'text-foreground';
  const featureCount = subclass.features?.length ?? 0;
  const hasCompanion = 'companion' in subclass && subclass.companion;
  const spellcastTrait =
    'spellcastTrait' in subclass ? subclass.spellcastTrait : null;

  return (
    <Card
      className={cn(
        'flex min-h-64 cursor-pointer flex-col overflow-hidden border-2 transition-all hover:shadow-md',
        isSelected
          ? 'border-primary ring-primary bg-primary/5 ring-2'
          : 'hover:border-muted-foreground/50'
      )}
      onClick={() => onSelect()}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      aria-pressed={isSelected}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className={cn('text-base', colorClass)}>
            {subclass.name}
          </CardTitle>
          <div className="flex flex-wrap justify-end gap-1">
            {hasCompanion && <CompanionBadge />}
            {spellcastTrait && (
              <SpellcastBadge trait={spellcastTrait as string} />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col space-y-3 pt-0">
        <SmartTooltip
          side="bottom"
          className="max-w-sm"
          content={<p className="text-sm">{subclass.description}</p>}
        >
          <CardDescription className="line-clamp-2 cursor-help text-sm">
            {subclass.description}
          </CardDescription>
        </SmartTooltip>

        {featureCount > 0 && (
          <SubclassFeatureList
            features={subclass.features}
            showDetails={showDetails}
            onToggleDetails={setShowDetails}
          />
        )}
      </CardContent>
    </Card>
  );
}

export const SubclassCard = memo(SubclassCardComponent);
