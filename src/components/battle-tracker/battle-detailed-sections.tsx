import { AlertTriangle, Heart } from 'lucide-react';

import { ConditionsDisplay } from '@/components/conditions';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { StatCounter, StatInput } from './battle-tracker-shared';
import type {
  AdversaryTracker,
  CharacterTracker,
  EnvironmentTracker,
  TrackerItem,
} from './types';
import { formatAttack, formatThresholds } from './utils';

interface DetailedPanelProps {
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

export function DetailedPanel({
  item,
  onCharacterChange,
  onAdversaryChange,
  onEnvironmentChange,
}: DetailedPanelProps) {
  if (item.kind === 'character') {
    return <CharacterDetail item={item} onChange={onCharacterChange} />;
  }
  if (item.kind === 'adversary') {
    return <AdversaryDetail item={item} onChange={onAdversaryChange} />;
  }
  return <EnvironmentDetail item={item} onChange={onEnvironmentChange} />;
}

function CharacterDetail({
  item,
  onChange,
}: {
  item: CharacterTracker;
  onChange: (
    id: string,
    updater: (prev: CharacterTracker) => CharacterTracker
  ) => void;
}) {
  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <StatCounter
            label="HP"
            icon={<Heart className="size-4" />}
            value={item.hp.current}
            max={item.hp.max}
            onChange={next =>
              onChange(item.id, prev => ({
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
              onChange(item.id, prev => ({
                ...prev,
                stress: { ...prev.stress, current: next },
              }))
            }
          />
          <StatInput
            label="Evasion"
            value={item.evasion ?? 0}
            onChange={next =>
              onChange(item.id, prev => ({
                ...prev,
                evasion: next,
              }))
            }
          />
        </div>
        <Separator />
        <ConditionsDisplay
          conditions={item.conditions}
          onChange={next =>
            onChange(item.id, prev => ({
              ...prev,
              conditions: next,
            }))
          }
        />
        <div className="space-y-2">
          <label className="text-sm font-medium">Notes</label>
          <Textarea
            value={item.notes}
            onChange={event =>
              onChange(item.id, prev => ({
                ...prev,
                notes: event.target.value,
              }))
            }
            placeholder="Tactical notes, spotlight cues, or condition context."
          />
        </div>
      </CardContent>
    </Card>
  );
}

function AdversaryDetail({
  item,
  onChange,
}: {
  item: AdversaryTracker;
  onChange: (
    id: string,
    updater: (prev: AdversaryTracker) => AdversaryTracker
  ) => void;
}) {
  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <StatCounter
            label="HP"
            icon={<Heart className="size-4" />}
            value={item.hp.current}
            max={item.hp.max}
            onChange={next =>
              onChange(item.id, prev => ({
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
              onChange(item.id, prev => ({
                ...prev,
                stress: { ...prev.stress, current: next },
              }))
            }
          />
          <div className="space-y-2 rounded-md border p-3 text-sm">
            <p className="text-muted-foreground">Difficulty</p>
            <p className="text-lg font-semibold">{item.source.difficulty}</p>
          </div>
        </div>
        <Separator />
        <div className="grid gap-2 text-sm">
          <p className="font-semibold">Attack</p>
          <div className="text-muted-foreground text-sm">
            {item.source.attack.name} · {formatAttack(item.source.attack)}
          </div>
          <div className="text-muted-foreground text-sm">
            Thresholds: {formatThresholds(item.source.thresholds)}
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <p className="font-semibold">Features</p>
          <ul className="text-muted-foreground space-y-2 text-sm">
            {item.source.features.length === 0 ? (
              <li>No special features</li>
            ) : (
              item.source.features.map((feature, index) => (
                <li key={`${item.id}-feature-${index}`}>
                  {typeof feature === 'string'
                    ? feature
                    : `${feature.name} - ${feature.description}`}
                </li>
              ))
            )}
          </ul>
        </div>
        <Separator />
        <ConditionsDisplay
          conditions={item.conditions}
          onChange={next =>
            onChange(item.id, prev => ({
              ...prev,
              conditions: next,
            }))
          }
        />
        <div className="space-y-2">
          <label className="text-sm font-medium">Notes</label>
          <Textarea
            value={item.notes}
            onChange={event =>
              onChange(item.id, prev => ({
                ...prev,
                notes: event.target.value,
              }))
            }
            placeholder="Threat tactics, spotlight timing, or fear spends."
          />
        </div>
      </CardContent>
    </Card>
  );
}

function EnvironmentDetail({
  item,
  onChange,
}: {
  item: EnvironmentTracker;
  onChange: (
    id: string,
    updater: (prev: EnvironmentTracker) => EnvironmentTracker
  ) => void;
}) {
  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="text-muted-foreground text-sm">
          {item.source.description}
        </div>
        <div className="grid gap-2 text-sm">
          <p className="font-semibold">Impulses</p>
          <div className="flex flex-wrap gap-2">
            {item.source.impulses.map(impulse => (
              <Badge key={impulse} variant="secondary">
                {impulse}
              </Badge>
            ))}
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <p className="font-semibold">Features</p>
          <div className="space-y-2">
            {item.features.map(feature => (
              <div
                key={feature.id}
                className={cn(
                  'rounded-md border p-3 text-sm',
                  feature.active && 'border-emerald-400 bg-emerald-500/10'
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{feature.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {feature.description}
                    </p>
                  </div>
                  <Checkbox
                    checked={feature.active}
                    onCheckedChange={checked =>
                      onChange(item.id, prev => ({
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
              </div>
            ))}
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <label className="text-sm font-medium">Notes</label>
          <Textarea
            value={item.notes}
            onChange={event =>
              onChange(item.id, prev => ({
                ...prev,
                notes: event.target.value,
              }))
            }
            placeholder="Trigger details, map notes, or spotlight cues."
          />
        </div>
      </CardContent>
    </Card>
  );
}
