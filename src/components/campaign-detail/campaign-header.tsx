import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  Keyboard,
  Loader2,
  Save,
  Settings,
} from 'lucide-react';
import { useMemo, useRef } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Campaign, CampaignPhase } from '@/lib/schemas/campaign';

const PHASE_CONFIG: Record<CampaignPhase, { label: string; color: string }> = {
  prologue: {
    label: 'Prologue',
    color: 'bg-gray-100 text-gray-700 border-gray-300',
  },
  'act-1': {
    label: 'Act 1',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
  },
  'act-2': {
    label: 'Act 2',
    color: 'bg-amber-100 text-amber-700 border-amber-300',
  },
  'act-3': {
    label: 'Act 3',
    color: 'bg-orange-100 text-orange-700 border-orange-300',
  },
  climax: { label: 'Climax', color: 'bg-red-100 text-red-700 border-red-300' },
  epilogue: {
    label: 'Epilogue',
    color: 'bg-green-100 text-green-700 border-green-300',
  },
};
import {
  exportCampaignAsJson,
  exportCampaignAsMarkdown,
} from '@/features/campaigns/campaign-export';

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
  onPhaseChange?: (phase: CampaignPhase) => void;
  onBeastFeastToggle?: (enabled: boolean) => void;
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
  onPhaseChange,
  onBeastFeastToggle,
}: CampaignHeaderProps) {
  // eslint-disable-next-line react-hooks/purity -- Date.now() in ref init is safe for relative time display
  const nowRef = useRef(Date.now());

  const lastPlayedLabel = useMemo(() => {
    const sessions = campaign.sessions ?? [];
    const timestamps = sessions
      .map(s => s.date)
      .filter((d): d is string => Boolean(d))
      .map(d => new Date(d).getTime())
      .filter(t => !Number.isNaN(t));

    if (timestamps.length === 0) return null;

    const diffDays = Math.floor(
      (nowRef.current - Math.max(...timestamps)) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
    const years = Math.floor(diffDays / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }, [campaign.sessions]);

  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-2 -ml-3"
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Campaigns
        </Button>
        <div className="flex items-center gap-3 pl-1">
          <Input
            value={campaign.name}
            onChange={e => onNameChange(e.target.value)}
            onBlur={onNameBlur}
            aria-label="Campaign name"
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
          {/* Campaign phase indicator */}
          <Select
            value={campaign.phase ?? 'act-1'}
            onValueChange={v => onPhaseChange?.(v as CampaignPhase)}
          >
            <SelectTrigger
              className={`h-6 w-auto gap-1 rounded-full border px-2 text-xs font-medium ${PHASE_CONFIG[campaign.phase ?? 'act-1'].color}`}
              aria-label="Campaign phase"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PHASE_CONFIG).map(([value, { label }]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Screen reader announcement for save status */}
          <span className="sr-only" aria-live="polite" role="status">
            {saveStatus === 'saving' && 'Saving campaign...'}
            {saveStatus === 'unsaved' && 'You have unsaved changes'}
            {saveStatus === 'saved' && 'All changes saved'}
          </span>
        </div>
        <div className="text-muted-foreground flex flex-wrap gap-3 pl-1 text-xs">
          <span>{campaign.sessions?.length ?? 0} sessions</span>
          <span>·</span>
          <span>{campaign.npcs?.length ?? 0} NPCs</span>
          <span>·</span>
          <span>{campaign.locations?.length ?? 0} locations</span>
          <span>·</span>
          <span>{campaign.quests?.length ?? 0} quests</span>
          <span>·</span>
          <span>{campaign.players?.length ?? 0} players</span>
          {lastPlayedLabel && (
            <>
              <span>·</span>
              <span>Last session: {lastPlayedLabel}</span>
            </>
          )}
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
              aria-label="Copy invite code"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <span className="text-muted-foreground text-xs">Invite Code</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground h-8 w-8"
              aria-label="Campaign settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 text-sm" align="end">
            <p className="mb-3 font-semibold">Campaign Settings</p>
            <div className="flex items-center justify-between">
              <Label htmlFor="beast-feast-toggle" className="text-xs">
                Enable Beast Feast
              </Label>
              <Switch
                id="beast-feast-toggle"
                checked={campaign.beastFeastEnabled ?? false}
                onCheckedChange={v => onBeastFeastToggle?.(v)}
              />
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground h-8 w-8"
              aria-label="Keyboard shortcuts"
            >
              <Keyboard className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 text-sm" align="end">
            <p className="mb-2 font-semibold">Keyboard Shortcuts</p>
            <ul className="space-y-1 text-xs">
              <li className="flex justify-between">
                <span>Save campaign</span>
                <kbd className="bg-muted rounded border px-1.5 py-0.5 font-mono text-[10px]">
                  Ctrl+S
                </kbd>
              </li>
              <li className="flex justify-between">
                <span>Toggle sidebar</span>
                <kbd className="bg-muted rounded border px-1.5 py-0.5 font-mono text-[10px]">
                  Ctrl+B
                </kbd>
              </li>
              <li className="flex justify-between">
                <span>Navigate items</span>
                <kbd className="bg-muted rounded border px-1.5 py-0.5 font-mono text-[10px]">
                  ← →
                </kbd>
              </li>
              <li className="flex justify-between">
                <span>Close panel</span>
                <kbd className="bg-muted rounded border px-1.5 py-0.5 font-mono text-[10px]">
                  Esc
                </kbd>
              </li>
            </ul>
          </PopoverContent>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => exportCampaignAsJson(campaign)}>
              Export as JSON
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => exportCampaignAsMarkdown(campaign)}
            >
              Export as Markdown
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={onSave} disabled={!hasChanges || saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
                <kbd className="bg-muted text-muted-foreground ml-2 hidden rounded px-1.5 py-0.5 text-[10px] font-medium sm:inline">
                  Ctrl+S
                </kbd>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save campaign (Ctrl+S)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
