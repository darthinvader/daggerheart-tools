import { FeatureIcon, SecondaryFeatureIcon } from '@/components/shared';
import type { AncestryFeature } from '@/lib/schemas/identity';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  feature: AncestryFeature;
  variant: 'primary' | 'secondary';
  showLabel?: boolean;
  className?: string;
}

const VARIANT_STYLES = {
  primary: {
    container:
      'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30',
    heading: 'text-amber-700 dark:text-amber-400',
    text: 'text-amber-900 dark:text-amber-200',
    icon: FeatureIcon,
  },
  secondary: {
    container:
      'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30',
    heading: 'text-blue-700 dark:text-blue-400',
    text: 'text-blue-900 dark:text-blue-200',
    icon: SecondaryFeatureIcon,
  },
} as const;

export function FeatureCard({
  feature,
  variant,
  showLabel = true,
  className,
}: FeatureCardProps) {
  const styles = VARIANT_STYLES[variant];
  const Icon = styles.icon;
  const label = variant === 'primary' ? 'Primary' : 'Secondary';

  return (
    <div className={cn('rounded-lg border p-4', styles.container, className)}>
      <h4
        className={cn(
          'mb-2 flex items-center gap-2 font-semibold',
          styles.heading
        )}
      >
        <Icon />
        {showLabel && `${label}: `}
        {feature.name}
      </h4>
      <p className={cn('text-sm', styles.text)}>{feature.description}</p>
    </div>
  );
}
