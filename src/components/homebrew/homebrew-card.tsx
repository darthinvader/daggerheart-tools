/**
 * Homebrew Content Card
 *
 * Display card for homebrew content with preview and actions.
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

interface HomebrewCardProps {
  content: HomebrewContent;
  isOwner?: boolean;
  isStarred?: boolean;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onFork?: () => void;
  onLinkToCampaign?: () => void;
  onToggleStar?: () => void;
  onAddToCollection?: () => void;
  onAddToCharacter?: () => void;
  canInteract?: boolean;
}

// Content type configuration with icons and colors
const CONTENT_TYPE_CONFIG: Record<
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

const VisibilityIcon = ({
  visibility,
}: {
  visibility: HomebrewContent['visibility'];
}) => {
  switch (visibility) {
    case 'public':
      return <Globe className="size-3 text-green-500" />;
    case 'campaign_only':
      return <Users className="size-3 text-purple-500" />;
    default:
      return <Lock className="size-3 text-amber-500" />;
  }
};

export function HomebrewCard({
  content,
  isOwner = false,
  isStarred = false,
  onView,
  onEdit,
  onDelete,
  onFork,
  onLinkToCampaign,
  onToggleStar,
  onAddToCollection,
  onAddToCharacter,
  canInteract = true,
}: HomebrewCardProps) {
  const config = CONTENT_TYPE_CONFIG[content.contentType];
  const TypeIcon = config.icon as React.ComponentType<{ className?: string }>;

  const getDescription = (): string => {
    if ('description' in content.content && content.content.description) {
      return content.content.description;
    }
    return 'No description available.';
  };

  return (
    <Card
      className={`group relative border-l-4 transition-shadow hover:shadow-md ${config.borderColor}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 gap-3">
            {/* Type Icon */}
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${config.bgColor}`}
            >
              <TypeIcon className={`size-5 ${config.color}`} />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="truncate">{content.name}</span>
                {content.forkedFrom && (
                  <span>
                    <GitFork className="text-muted-foreground size-3 shrink-0" />
                  </span>
                )}
              </CardTitle>
              <CardDescription className="mt-1 line-clamp-2">
                {getDescription()}
              </CardDescription>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 transition-opacity group-hover:opacity-100"
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={onView}>
                  <Eye className="mr-2 size-4" /> View
                </DropdownMenuItem>
              )}
              {onAddToCollection && (
                <DropdownMenuItem onClick={onAddToCollection}>
                  <BookOpen className="mr-2 size-4" /> Add to Collection
                </DropdownMenuItem>
              )}
              {onAddToCharacter && (
                <DropdownMenuItem onClick={onAddToCharacter}>
                  <Users className="mr-2 size-4" /> Add to Character
                </DropdownMenuItem>
              )}
              {isOwner && onEdit && (
                <DropdownMenuItem onClick={onEdit}>
                  <Pencil className="mr-2 size-4" /> Edit
                </DropdownMenuItem>
              )}
              {onFork && (
                <DropdownMenuItem onClick={onFork}>
                  <Copy className="mr-2 size-4" /> Fork (Copy)
                </DropdownMenuItem>
              )}
              {isOwner && onLinkToCampaign && (
                <DropdownMenuItem onClick={onLinkToCampaign}>
                  <Link2 className="mr-2 size-4" /> Link to Campaign
                </DropdownMenuItem>
              )}
              {isOwner && onDelete && (
                <>
                  <DropdownMenuSeparator />
                  {content.visibility === 'public' ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuItem
                          disabled
                          className="text-muted-foreground cursor-not-allowed"
                        >
                          <Trash2 className="mr-2 size-4" /> Delete
                        </DropdownMenuItem>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Make this private before deleting</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <DropdownMenuItem
                      onClick={onDelete}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 size-4" /> Delete
                    </DropdownMenuItem>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className={`gap-1 ${config.bgColor} ${config.color}`}
          >
            <TypeIcon className="size-3" />
            {getContentTypeLabel(content.contentType)}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <VisibilityIcon visibility={content.visibility} />
            {getVisibilityLabel(content.visibility)}
          </Badge>

          {content.tags?.slice(0, 2).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {(content.tags?.length ?? 0) > 2 && (
            <span className="text-muted-foreground text-xs">
              +{content.tags!.length - 2} more
            </span>
          )}
        </div>

        <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
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
            <span className="text-xs font-medium">
              {content.starCount ?? 0}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <MessageSquare className="size-3" /> {content.commentCount ?? 0}
          </span>
          {content.viewCount !== undefined && content.viewCount > 0 && (
            <span className="flex items-center gap-1">
              <Eye className="size-3" /> {content.viewCount}
            </span>
          )}
          {content.forkCount !== undefined && content.forkCount > 0 && (
            <span className="flex items-center gap-1">
              <GitFork className="size-3" /> {content.forkCount}
            </span>
          )}
          {content.campaignLinks && content.campaignLinks.length > 0 && (
            <span className="flex items-center gap-1">
              <Link2 className="size-3" /> {content.campaignLinks.length}{' '}
              campaign
              {content.campaignLinks.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
