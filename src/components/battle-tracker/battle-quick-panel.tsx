import { AlertTriangle, Axe, Heart, Target } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';

import { StatChip, StatCounter, StatInput } from './battle-tracker-shared';
import type {
  AdversaryTracker,
  CharacterTracker,
  EnvironmentTracker,
  TrackerItem,
} from './types';
import { formatAttack } from './utils';

interface QuickStatsPanelProps {
  item: TrackerItem;
  onCharacterChange: (
    id: string,
    updater: (prev: CharacterTracker) => CharacterTracker
  ) => void;
  onAdversaryChange: (
    id: string,
    updater: (prev: AdversaryTracker) => AdversaryTracker
  ) => void;
  onEnvironmentChange: (
    id: string,
    updater: (prev: EnvironmentTracker) => EnvironmentTracker
  ) => void;
}

export function QuickStatsPanel({
  item,
  onCharacterChange,
  onAdversaryChange,
  onEnvironmentChange,
}: QuickStatsPanelProps) {
  if (item.kind === 'character') {
    return (
      <div className="grid gap-3 md:grid-cols-2">
        <StatCounter
          label="HP"
          icon={<Heart className="size-4" />}
          value={item.hp.current}
          max={item.hp.max}
          onChange={next =>
            onCharacterChange(item.id, prev => ({
              ...prev,
              hp: { ...prev.hp, current: next },
            }))
          }
        />
        <StatCounter
          label="Stress"
          icon={<AlertTriangle className="size-4" />}
          value={item.stress.current}
          max={item.stress.max}
          onChange={next =>
            onCharacterChange(item.id, prev => ({
              ...prev,
              stress: { ...prev.stress, current: next },
            }))
          }
        />
        <StatInput
          label="Evasion"
          value={item.evasion ?? 0}
          onChange={next =>
            onCharacterChange(item.id, prev => ({
              ...prev,
              evasion: next,
            }))
          }
        />
      </div>
    );
  }

  if (item.kind === 'adversary') {
    return (
      <div className="grid gap-3 md:grid-cols-2">
        <StatCounter
          label="HP"
          icon={<Heart className="size-4" />}
          value={item.hp.current}
          max={item.hp.max}
          onChange={next =>
            onAdversaryChange(item.id, prev => ({
              ...prev,
              hp: { ...prev.hp, current: next },
            }))
          }
        />
        <StatCounter
          label="Stress"
          icon={<AlertTriangle className="size-4" />}
          value={item.stress.current}
          max={item.stress.max}
          onChange={next =>
            onAdversaryChange(item.id, prev => ({
              ...prev,
              stress: { ...prev.stress, current: next },
            }))
          }
        />
        <div className="grid gap-2 text-xs">
          <StatChip
            icon={<Target className="size-3" />}
            label={`Difficulty ${item.source.difficulty}`}
          />
          <StatChip
            icon={<Axe className="size-3" />}
            label={`${item.source.attack.name} ${formatAttack(item.source.attack)}`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {item.features.slice(0, 4).map(feature => (
        <div
          key={feature.id}
          className="flex items-center justify-between rounded-md border px-3 py-2 text-xs"
        >
          <span className="font-medium">{feature.name}</span>
          <Checkbox
            checked={feature.active}
            onCheckedChange={checked =>
              onEnvironmentChange(item.id, prev => ({
                ...prev,
                features: prev.features.map(entry =>
                  entry.id === feature.id
                    ? { ...entry, active: Boolean(checked) }
                    : entry
                ),
              }))
            }
          />
        </div>
      ))}
    </div>
  );
}
