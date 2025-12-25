import type { GameClass, GameSubclass } from '@/lib/data/classes';
import { CLASS_COLORS, CLASS_EMOJIS } from '@/lib/schemas/class-selection';
import { cn } from '@/lib/utils';

import { SubclassCard } from './subclass-card';

interface SubclassListProps {
  gameClasses: GameClass[];
  selectedSubclasses: Map<string, GameSubclass>;
  onSelect: (className: string, subclass: GameSubclass) => void;
}

export function SubclassList({
  gameClasses,
  selectedSubclasses,
  onSelect,
}: SubclassListProps) {
  return (
    <div className="space-y-6">
      {gameClasses.map(gameClass => {
        const emoji = CLASS_EMOJIS[gameClass.name] ?? '⚔️';
        const colorClass = CLASS_COLORS[gameClass.name] ?? 'text-foreground';
        const selectedSubclass = selectedSubclasses.get(gameClass.name);

        return (
          <div key={gameClass.name} className="space-y-4">
            <h3
              className={cn(
                'flex items-center gap-2 text-lg font-semibold',
                colorClass
              )}
            >
              <span>{emoji}</span>
              <span>Choose Your {gameClass.name} Subclass</span>
            </h3>
            <div className="grid items-start gap-4 sm:grid-cols-2">
              {gameClass.subclasses.map(subclass => (
                <SubclassCard
                  key={subclass.name}
                  subclass={subclass}
                  className={gameClass.name}
                  isSelected={selectedSubclass?.name === subclass.name}
                  onSelect={sub => onSelect(gameClass.name, sub)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
