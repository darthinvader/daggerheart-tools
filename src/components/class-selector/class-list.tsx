import { ALL_CLASSES, type GameClass } from '@/lib/data/classes';

import { ClassCard } from './class-card';

interface ClassListProps {
  selectedClasses: GameClass[];
  onSelect: (gameClass: GameClass) => void;
  isMulticlass?: boolean;
}

export function ClassList({
  selectedClasses,
  onSelect,
  isMulticlass = false,
}: ClassListProps) {
  const selectedNames = new Set(selectedClasses.map(c => c.name));

  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-lg font-semibold">
        <span>📚</span>
        <span>
          {isMulticlass ? 'Choose Your Classes' : 'Choose Your Class'}
        </span>
      </h3>
      <div className="grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {ALL_CLASSES.map(gameClass => (
          <ClassCard
            key={gameClass.name}
            gameClass={gameClass}
            isSelected={selectedNames.has(gameClass.name)}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
