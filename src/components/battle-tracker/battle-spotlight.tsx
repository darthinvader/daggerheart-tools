import { Check, Focus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import type {
  AdversaryTracker,
  CharacterTracker,
  EnvironmentTracker,
  TrackerSelection,
} from './types';
import { getSpotlightLabel } from './utils';

interface BattleSpotlightProps {
  spotlight: TrackerSelection | null;
  spotlightHistory: TrackerSelection[];
  characters: CharacterTracker[];
  adversaries: AdversaryTracker[];
  environments: EnvironmentTracker[];
  onClear: () => void;
  onSelect: (selection: TrackerSelection) => void;
}

export function BattleSpotlight({
  spotlight,
  spotlightHistory,
  characters,
  adversaries,
  environments,
  onClear,
  onSelect,
}: BattleSpotlightProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Focus className="size-5" /> Spotlight
        </CardTitle>
        <CardDescription>
          Set who has the spotlight (no initiative order).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={spotlight ? 'default' : 'secondary'}
            className="gap-2"
          >
            {spotlight ? (
              <>
                <Check className="size-3" />
                {getSpotlightLabel(
                  spotlight,
                  characters,
                  adversaries,
                  environments
                )}
              </>
            ) : (
              'No spotlight set'
            )}
          </Badge>
          {spotlight && (
            <Button size="sm" variant="outline" onClick={onClear}>
              Clear
            </Button>
          )}
        </div>
        {spotlightHistory.length > 0 && (
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs">Recent spotlight</p>
            <div className="flex flex-wrap gap-2">
              {spotlightHistory.map(entry => (
                <Badge
                  key={`${entry.kind}-${entry.id}`}
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => onSelect(entry)}
                >
                  {getSpotlightLabel(
                    entry,
                    characters,
                    adversaries,
                    environments
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
