import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Map,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createCampaign } from '@/features/campaigns/campaign-storage';
import { CAMPAIGN_FRAME_TEMPLATES } from '@/lib/data/campaign-frames';
import type { CampaignFrame } from '@/lib/schemas/campaign';

export const Route = createFileRoute('/gm/campaigns/new')({
  component: NewCampaignPage,
});

function getComplexityInfo(complexity: string) {
  switch (complexity) {
    case '1':
      return {
        label: 'Low',
        color: 'bg-green-500/10 text-green-600 border-green-500/30',
        description: 'Traditional fantasy, minimal custom mechanics',
      };
    case '2':
      return {
        label: 'Medium',
        color: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
        description: 'Some additional mechanics and deeper political themes',
      };
    case '3':
      return {
        label: 'High',
        color: 'bg-red-500/10 text-red-600 border-red-500/30',
        description: 'Requires comfortable homebrewing and custom content',
      };
    default:
      return {
        label: 'Unknown',
        color: 'bg-gray-500/10 text-gray-600',
        description: '',
      };
  }
}

function FrameCard({
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
      className={`cursor-pointer transition-all ${
        isSelected
          ? 'ring-primary ring-2 ring-offset-2'
          : 'hover:border-primary/50 hover:shadow-md'
      }`}
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

function FramePreview({ frame }: { frame: CampaignFrame }) {
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

function NewCampaignPage() {
  const navigate = useNavigate();
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);
  const [campaignName, setCampaignName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const templates = CAMPAIGN_FRAME_TEMPLATES;
  const selectedFrame = templates.find(f => f.id === selectedFrameId);

  const handleCreate = async () => {
    if (!selectedFrameId) return;

    setIsCreating(true);
    try {
      const campaign = await createCampaign(
        selectedFrameId,
        campaignName.trim() || undefined
      );
      navigate({ to: '/gm/campaigns/$id', params: { id: campaign.id } });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl p-4">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="mb-2"
          onClick={() => navigate({ to: '/gm/campaigns' })}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Campaigns
        </Button>
        <h1 className="text-2xl font-bold">Create New Campaign</h1>
        <p className="text-muted-foreground">
          Choose a campaign frame to get started. You can customize everything
          after creation.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Frame Selection */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="campaign-name" className="text-base font-semibold">
              Campaign Name (optional)
            </Label>
            <Input
              id="campaign-name"
              placeholder="My Awesome Campaign"
              value={campaignName}
              onChange={e => setCampaignName(e.target.value)}
              className="mt-2"
            />
            <p className="text-muted-foreground mt-1 text-xs">
              Leave blank to use the frame name
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-base font-semibold">
              Select a Campaign Frame
            </h2>
            <div className="grid gap-3">
              {templates.map(frame => (
                <FrameCard
                  key={frame.id}
                  frame={frame}
                  isSelected={selectedFrameId === frame.id}
                  onSelect={() => setSelectedFrameId(frame.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:sticky lg:top-20 lg:h-fit">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {selectedFrame ? 'Frame Preview' : 'Select a Frame'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedFrame ? (
                <FramePreview frame={selectedFrame} />
              ) : (
                <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
                  <Map className="mb-4 h-12 w-12 opacity-50" />
                  <p>Select a campaign frame to see its details</p>
                </div>
              )}
            </CardContent>
          </Card>

          {selectedFrame && (
            <Button
              className="mt-4 w-full"
              size="lg"
              onClick={handleCreate}
              disabled={isCreating}
            >
              {isCreating ? (
                'Creating...'
              ) : (
                <>
                  Create Campaign
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
