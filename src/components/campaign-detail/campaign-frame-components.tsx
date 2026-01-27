import { Check, FileText, Map, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { CampaignFrame } from '@/lib/schemas/campaign';

import { getComplexityInfo } from './campaign-utils';

export function FrameCard({
  frame,
  isSelected,
  onSelect,
}: {
  frame: CampaignFrame;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const complexity = getComplexityInfo(frame.complexity);
  const isBlank = frame.id === 'blank';

  return (
    <Card
      className={`cursor-pointer transition-all ${isSelected ? 'ring-primary ring-2 ring-offset-2' : 'hover:border-primary/50 hover:shadow-md'}`}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {isBlank ? (
              <FileText className="text-muted-foreground h-5 w-5" />
            ) : (
              <Map className="h-5 w-5 text-violet-600" />
            )}
            <CardTitle className="text-base">{frame.name}</CardTitle>
          </div>
          {isSelected && (
            <div className="bg-primary flex h-5 w-5 items-center justify-center rounded-full">
              <Check className="text-primary-foreground h-3 w-3" />
            </div>
          )}
        </div>
        {!isBlank && (
          <Badge variant="outline" className={`mt-2 w-fit ${complexity.color}`}>
            {complexity.label} Complexity
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {isBlank ? (
          <CardDescription>
            Start with a blank slate and build your campaign frame from scratch.
          </CardDescription>
        ) : (
          <>
            <CardDescription className="mb-3 line-clamp-3">
              {frame.pitch}
            </CardDescription>
            {frame.toneAndFeel.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {frame.toneAndFeel.slice(0, 4).map(tone => (
                  <Badge key={tone} variant="secondary" className="text-xs">
                    {tone}
                  </Badge>
                ))}
                {frame.toneAndFeel.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{frame.toneAndFeel.length - 4}
                  </Badge>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function FramePreview({ frame }: { frame: CampaignFrame }) {
  const complexity = getComplexityInfo(frame.complexity);
  const isBlank = frame.id === 'blank';

  if (isBlank) {
    return (
      <div className="bg-muted/50 flex h-full flex-col items-center justify-center rounded-lg p-8 text-center">
        <FileText className="text-muted-foreground mb-4 h-12 w-12" />
        <h3 className="mb-2 text-lg font-semibold">Blank Campaign</h3>
        <p className="text-muted-foreground max-w-sm">
          You'll be able to add all the details—pitch, themes, distinctions,
          mechanics, and more—after creating the campaign.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-1 text-lg font-semibold">{frame.name}</h3>
        <Badge variant="outline" className={complexity.color}>
          {complexity.label} Complexity — {complexity.description}
        </Badge>
      </div>

      {frame.pitch && (
        <div>
          <h4 className="text-muted-foreground mb-1 text-sm font-medium uppercase">
            Pitch
          </h4>
          <p className="text-sm">{frame.pitch}</p>
        </div>
      )}

      {frame.toneAndFeel.length > 0 && (
        <div>
          <h4 className="text-muted-foreground mb-2 text-sm font-medium uppercase">
            Tone & Feel
          </h4>
          <div className="flex flex-wrap gap-1">
            {frame.toneAndFeel.map(tone => (
              <Badge key={tone} variant="secondary">
                {tone}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {frame.themes.length > 0 && (
        <div>
          <h4 className="text-muted-foreground mb-2 text-sm font-medium uppercase">
            Themes
          </h4>
          <div className="flex flex-wrap gap-1">
            {frame.themes.map(theme => (
              <Badge key={theme} variant="outline">
                {theme}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {frame.touchstones.length > 0 && (
        <div>
          <h4 className="text-muted-foreground mb-2 text-sm font-medium uppercase">
            Touchstones
          </h4>
          <ul className="text-muted-foreground list-inside list-disc text-sm">
            {frame.touchstones.map(touchstone => (
              <li key={touchstone}>{touchstone}</li>
            ))}
          </ul>
        </div>
      )}

      {frame.distinctions.length > 0 && (
        <div>
          <h4 className="text-muted-foreground mb-2 text-sm font-medium uppercase">
            Setting Distinctions
          </h4>
          <ul className="space-y-2">
            {frame.distinctions.slice(0, 3).map(distinction => (
              <li key={distinction.id}>
                <span className="font-medium">{distinction.title}:</span>{' '}
                <span className="text-muted-foreground text-sm">
                  {distinction.description.slice(0, 100)}
                  {distinction.description.length > 100 && '...'}
                </span>
              </li>
            ))}
            {frame.distinctions.length > 3 && (
              <li className="text-muted-foreground text-sm">
                +{frame.distinctions.length - 3} more distinctions
              </li>
            )}
          </ul>
        </div>
      )}

      {frame.mechanics.length > 0 && (
        <div>
          <h4 className="text-muted-foreground mb-2 text-sm font-medium uppercase">
            Custom Mechanics
          </h4>
          <ul className="space-y-1">
            {frame.mechanics.map(mechanic => (
              <li key={mechanic.id} className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-500" />
                <span className="text-sm">{mechanic.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
