import type { TraitsState } from '@/components/traits';
import { cn } from '@/lib/utils';

interface QuickTraitsInfoProps {
  traits: TraitsState;
  className?: string;
}

const TRAIT_CONFIG = [
  { name: 'Agility', emoji: '🏃' },
  { name: 'Strength', emoji: '💪' },
  { name: 'Finesse', emoji: '🎯' },
  { name: 'Instinct', emoji: '👁️' },
  { name: 'Presence', emoji: '✨' },
  { name: 'Knowledge', emoji: '📚' },
] as const;

export function QuickTraitsInfo({ traits, className }: QuickTraitsInfoProps) {
  return (
    <div className={cn('bg-card rounded-lg border p-3', className)}>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg">📊</span>
        <span className="font-semibold">Traits</span>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {TRAIT_CONFIG.map(({ name, emoji }) => {
          const trait = traits[name as keyof TraitsState];
          const total = trait.value + trait.bonus;
          const modifier = total >= 0 ? `+${total}` : `${total}`;

          return (
            <div
              key={name}
              className={cn(
                'flex flex-col items-center rounded border p-2',
                trait.marked && 'bg-primary/10 border-primary/30'
              )}
            >
              <span className="text-sm">{emoji}</span>
              <span className="text-muted-foreground text-xs">{name}</span>
              <span className="text-primary text-lg font-bold">{modifier}</span>
              {trait.bonus !== 0 && (
                <span className="text-muted-foreground text-xs">
                  ({trait.value}
                  {trait.bonus >= 0 ? '+' : ''}
                  {trait.bonus})
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
