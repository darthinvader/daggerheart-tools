/**
 * Homebrew Campaign Dialog
 *
 * Allows linking a homebrew item to one of the user's campaigns.
 */
import { Link2, Map } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Campaign } from '@/lib/schemas/campaign';

interface HomebrewCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  homebrewName: string;
  campaigns: Campaign[];
  onLink: (campaignId: string) => Promise<void>;
  isSubmitting?: boolean;
}

export function HomebrewCampaignDialog({
  open,
  onOpenChange,
  homebrewName,
  campaigns,
  onLink,
  isSubmitting = false,
}: HomebrewCampaignDialogProps) {
  const [selection, setSelection] = useState<string>('');
  const canSubmit = useMemo(() => selection.length > 0, [selection]);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    await onLink(selection);
    setSelection('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="size-4" /> Link to Campaign
          </DialogTitle>
          <DialogDescription>
            Add "{homebrewName}" to a campaign you manage.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-2">
            <Select value={selection} onValueChange={setSelection}>
              <SelectTrigger>
                <SelectValue placeholder="Select campaign" />
              </SelectTrigger>
              <SelectContent>
                {campaigns.map(campaign => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    <span className="flex items-center gap-2">
                      <Map className="size-4 text-emerald-500" />
                      {campaign.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? 'Linking...' : 'Link'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
