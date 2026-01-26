import { ArrowLeft, Check, Copy, Loader2, Save } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Campaign } from '@/lib/schemas/campaign';

type SaveStatus = 'saved' | 'unsaved' | 'saving';

interface CampaignHeaderProps {
  campaign: Campaign;
  saving: boolean;
  hasChanges: boolean;
  saveStatus: SaveStatus;
  onBack: () => void;
  onNameChange: (value: string) => void;
  onNameBlur: () => void;
  onCopyInviteCode: () => void;
  onSave: () => void;
}

export function CampaignHeader({
  campaign,
  saving,
  hasChanges,
  saveStatus,
  onBack,
  onNameChange,
  onNameBlur,
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
            onBlur={onNameBlur}
            className="focus-visible:border-input focus-visible:bg-background h-auto border-transparent bg-transparent p-0 text-2xl font-bold focus-visible:px-2"
          />
          {/* Save status indicator */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  {saveStatus === 'saving' ? (
                    <Badge variant="outline" className="gap-1 text-xs">
                      <Loader2 className="size-3 animate-spin" />
                      Saving...
                    </Badge>
                  ) : saveStatus === 'unsaved' ? (
                    <Badge
                      variant="outline"
                      className="border-amber-300 text-xs text-amber-600"
                    >
                      Unsaved
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="gap-1 border-green-300 text-xs text-green-600"
                    >
                      <Check className="size-3" />
                      Saved
                    </Badge>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {saveStatus === 'saving' && <p>Saving campaign...</p>}
                {saveStatus === 'unsaved' && <p>You have unsaved changes</p>}
                {saveStatus === 'saved' && <p>All changes saved</p>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
