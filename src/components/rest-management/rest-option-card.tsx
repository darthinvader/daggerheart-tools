import { Check, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { REST_CONFIG } from './constants';
import type { RestType } from './types';

interface RestOptionCardProps {
  type: RestType;
  lastRest: string | null;
  onSelect: () => void;
  disabled?: boolean;
}

export function RestOptionCard({
  type,
  onSelect,
  disabled,
}: RestOptionCardProps) {
  const config = REST_CONFIG[type];

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <config.icon className="size-6" />
          {config.label}
        </CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          {config.duration}
        </div>
        <ul className="space-y-1">
          {config.effects.map((effect, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
              {effect}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={onSelect} disabled={disabled}>
          Take {config.label}
        </Button>
      </CardFooter>
    </Card>
  );
}
