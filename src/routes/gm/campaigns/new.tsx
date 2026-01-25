import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, Map } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createCampaign } from '@/features/campaigns/campaign-storage';
import { CAMPAIGN_FRAME_TEMPLATES } from '@/lib/data/campaign-frames';

import { FrameCard, FramePreview } from './campaign-frame-components';

export const Route = createFileRoute('/gm/campaigns/new')({
  component: NewCampaignPage,
});

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
      navigate({
        to: '/gm/campaigns/$id',
        params: { id: campaign.id },
        search: { tab: 'overview' },
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl p-4">
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
