import { Badge } from '@/components/ui/badge';
import {
  ClassIcons,
  HelpCircle,
  Home,
  ICON_SIZE_SM,
  ICON_SIZE_XL,
} from '@/lib/icons';
import { CLASS_BG_COLORS, CLASS_COLORS } from '@/lib/schemas/class-selection';
import { cn } from '@/lib/utils';

interface ClassHeaderProps {
  className: string;
  description?: string;
  isHomebrew?: boolean;
}

export function ClassHeader({
  className,
  description,
  isHomebrew,
}: ClassHeaderProps) {
  const Icon = ClassIcons[className] ?? HelpCircle;
  const colorClass = CLASS_COLORS[className] ?? 'text-foreground';
  const bgColorClass = CLASS_BG_COLORS[className] ?? '';

  return (
    <div className={cn('overflow-hidden rounded-lg border p-3', bgColorClass)}>
      <div className="flex flex-wrap items-center gap-2">
        <Icon size={ICON_SIZE_XL} className="shrink-0" />
        <h4 className={cn('min-w-0 text-xl font-semibold', colorClass)}>
          {className}
        </h4>
        {isHomebrew && (
          <Badge variant="secondary" className="shrink-0">
            <Home size={ICON_SIZE_SM} className="mr-1" /> Homebrew
          </Badge>
        )}
      </div>
      {description && (
        <p className="text-muted-foreground mt-2 text-sm">{description}</p>
      )}
    </div>
  );
}
