/**
 * Homebrew Card Section Components
 *
 * Extracted section components for the homebrew card to reduce complexity.
 */
import {
  BookOpen,
  Copy,
  Eye,
  GitFork,
  Globe,
  Home,
  Layers,
  Link2,
  Lock,
  Map,
  MessageSquare,
  MoreVertical,
  Package,
  Pencil,
  Shield,
  Skull,
  Star,
  Sword,
  Trash2,
  Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type {
  HomebrewContent,
  HomebrewContentType,
} from '@/lib/schemas/homebrew';
import {
  getContentTypeLabel,
  getVisibilityLabel,
} from '@/lib/schemas/homebrew';

// =====================================================================================
// Constants
// =====================================================================================

export const CONTENT_TYPE_CONFIG: Record<
  HomebrewContentType,
  {
    icon: React.ElementType;
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  adversary: {
    icon: Skull,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-l-red-500',
  },
  environment: {
    icon: Map,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-l-emerald-500',
  },
  domain_card: {
    icon: Layers,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-l-purple-500',
  },
  class: {
    icon: Shield,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-l-blue-500',
  },
  subclass: {
    icon: BookOpen,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-l-indigo-500',
  },
  ancestry: {
    icon: Users,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-l-amber-500',
  },
  community: {
    icon: Home,
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-l-teal-500',
  },
  equipment: {
    icon: Sword,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-l-orange-500',
  },
  item: {
    icon: Package,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-l-cyan-500',
  },
};

// =====================================================================================
// VisibilityIcon
// =====================================================================================

interface VisibilityIconProps {
  visibility: HomebrewContent['visibility'];
}

export function VisibilityIcon({ visibility }: VisibilityIconProps) {
  switch (visibility) {
    case 'public':
      return <Globe className="size-3 text-green-500" />;
    case 'campaign_only':
      return <Users className="size-3 text-purple-500" />;
    default:
      return <Lock className="size-3 text-amber-500" />;
  }
}

// =====================================================================================
// CardActionsMenu
// =====================================================================================

interface CardActionsMenuProps {
  isOwner: boolean;
  isLinkedToCampaign: boolean;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onFork?: () => void;
  onLinkToCampaign?: () => void;
  onAddToCollection?: () => void;
  onAddToCharacter?: () => void;
}

export function CardActionsMenu({
  isOwner,
  isLinkedToCampaign,
  onView,
  onEdit,
  onDelete,
  onFork,
  onLinkToCampaign,
  onAddToCollection,
  onAddToCharacter,
}: CardActionsMenuProps) {
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
            >
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>More actions for this homebrew</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-56">
        {onView && (
          <DropdownMenuItem onClick={onView}>
            <Eye className="mr-2 size-4" />
            <div className="flex flex-col">
              <span>View Details</span>
              <span className="text-muted-foreground text-xs">
                Open read-only preview
              </span>
            </div>
          </DropdownMenuItem>
        )}
        {onAddToCollection && (
          <DropdownMenuItem onClick={onAddToCollection}>
            <BookOpen className="mr-2 size-4" />
            <div className="flex flex-col">
              <span>Add to Collection</span>
              <span className="text-muted-foreground text-xs">
                Organize into a collection
              </span>
            </div>
          </DropdownMenuItem>
        )}
        {onAddToCharacter && (
          <DropdownMenuItem onClick={onAddToCharacter}>
            <Users className="mr-2 size-4" />
            <div className="flex flex-col">
              <span>Add to Character</span>
              <span className="text-muted-foreground text-xs">
                Link to one of your characters
              </span>
            </div>
          </DropdownMenuItem>
        )}
        {isOwner && onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="mr-2 size-4" />
            <div className="flex flex-col">
              <span>Edit</span>
              <span className="text-muted-foreground text-xs">
                Modify this homebrew content
              </span>
            </div>
          </DropdownMenuItem>
        )}
        {onFork && (
          <DropdownMenuItem onClick={onFork}>
            <Copy className="mr-2 size-4" />
            <div className="flex flex-col">
              <span>Fork (Copy)</span>
              <span className="text-muted-foreground text-xs">
                Create your own editable copy
              </span>
            </div>
          </DropdownMenuItem>
        )}
        {isOwner && onLinkToCampaign && (
          <DropdownMenuItem onClick={onLinkToCampaign}>
            <Link2 className="mr-2 size-4" />
            <div className="flex flex-col">
              <span>
                {isLinkedToCampaign
                  ? 'Unlink from Campaign'
                  : 'Link to Campaign'}
              </span>
              <span className="text-muted-foreground text-xs">
                {isLinkedToCampaign
                  ? 'Remove from current campaign'
                  : 'Make available in a campaign'}
              </span>
            </div>
          </DropdownMenuItem>
        )}
        {isOwner && onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 size-4" />
              <div className="flex flex-col">
                <span>Delete</span>
                <span className="text-xs opacity-70">Move to recycle bin</span>
              </div>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// =====================================================================================
// CardBadges
// =====================================================================================

interface CardBadgesProps {
  contentType: HomebrewContentType;
  visibility: HomebrewContent['visibility'];
  tags?: string[];
  config: {
    bgColor: string;
    color: string;
    icon: React.ElementType;
  };
}

export function CardBadges({
  contentType,
  visibility,
  tags,
  config,
}: CardBadgesProps) {
  const TypeIcon = config.icon as React.ComponentType<{ className?: string }>;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge
        variant="secondary"
        className={`gap-1 ${config.bgColor} ${config.color}`}
      >
        <TypeIcon className="size-3" />
        {getContentTypeLabel(contentType)}
      </Badge>
      <Badge variant="outline" className="gap-1">
        <VisibilityIcon visibility={visibility} />
        {getVisibilityLabel(visibility)}
      </Badge>

      {tags?.slice(0, 2).map(tag => (
        <Badge key={tag} variant="outline" className="text-xs">
          {tag}
        </Badge>
      ))}
      {(tags?.length ?? 0) > 2 && (
        <span className="text-muted-foreground text-xs">
          +{tags!.length - 2} more
        </span>
      )}
    </div>
  );
}

// =====================================================================================
// CardStats
// =====================================================================================

interface CardStatsProps {
  starCount: number;
  commentCount: number;
  viewCount?: number;
  forkCount?: number;
  campaignLinksCount?: number;
  isStarred: boolean;
  canInteract: boolean;
  onToggleStar?: () => void;
}

export function CardStats({
  starCount,
  commentCount,
  viewCount,
  forkCount,
  campaignLinksCount,
  isStarred,
  canInteract,
  onToggleStar,
}: CardStatsProps) {
  return (
    <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-4 text-xs">
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onToggleStar}
              disabled={!canInteract || !onToggleStar}
              aria-pressed={isStarred}
            >
              <Star
                className={
                  isStarred
                    ? 'size-4 fill-amber-500 text-amber-500'
                    : 'text-muted-foreground size-4'
                }
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <p className="font-medium">
              {isStarred ? 'Remove from Quicklist' : 'Add to Quicklist'}
            </p>
            <p className="text-muted-foreground text-xs">
              {isStarred
                ? 'Remove this homebrew from your quicklist for fast access.'
                : 'Star this homebrew to add it to your quicklist for fast access during play.'}
            </p>
          </TooltipContent>
        </Tooltip>
        <span className="text-xs font-medium">{starCount}</span>
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="flex cursor-default items-center gap-1">
            <MessageSquare className="size-3" /> {commentCount}
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Comments and feedback from the community</p>
        </TooltipContent>
      </Tooltip>
      {viewCount !== undefined && viewCount > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex cursor-default items-center gap-1">
              <Eye className="size-3" /> {viewCount}
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Total number of views</p>
          </TooltipContent>
        </Tooltip>
      )}
      {forkCount !== undefined && forkCount > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex cursor-default items-center gap-1">
              <GitFork className="size-3" /> {forkCount}
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Times this homebrew has been forked by others</p>
          </TooltipContent>
        </Tooltip>
      )}
      {campaignLinksCount !== undefined && campaignLinksCount > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex cursor-default items-center gap-1">
              <Link2 className="size-3" /> {campaignLinksCount} campaign
              {campaignLinksCount > 1 ? 's' : ''}
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Number of campaigns this homebrew is linked to</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
