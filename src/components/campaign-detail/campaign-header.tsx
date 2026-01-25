import { ArrowLeft, Copy, Save } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Campaign } from '@/lib/schemas/campaign';

interface CampaignHeaderProps {
  campaign: Campaign;
  saving: boolean;
  hasChanges: boolean;
  onBack: () => void;
  onNameChange: (value: string) => void;
  onCopyInviteCode: () => void;
  onSave: () => void;
}

export function CampaignHeader({
  campaign,
  saving,
  hasChanges,
  onBack,
  onNameChange,
  onCopyInviteCode,
  onSave,
}: CampaignHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <Button variant="ghost" size="sm" className="mb-2" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Campaigns
        </Button>
        <div className="flex items-center gap-3">
          <Input
            value={campaign.name}
            onChange={e => onNameChange(e.target.value)}
            className="focus-visible:border-input focus-visible:bg-background h-auto border-transparent bg-transparent p-0 text-2xl font-bold focus-visible:px-2"
          />
        </div>
        {campaign.inviteCode && (
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              {campaign.inviteCode}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onCopyInviteCode}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <span className="text-muted-foreground text-xs">Invite Code</span>
          </div>
        )}
      </div>
      <Button onClick={onSave} disabled={!hasChanges || saving}>
        <Save className="mr-2 h-4 w-4" />
        {saving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
}
