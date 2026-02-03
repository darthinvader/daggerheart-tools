/**
 * Homebrew Content Card
 *
 * Display card for homebrew content with preview and actions.
 */
import { GitFork } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { HomebrewContent } from '@/lib/schemas/homebrew';

import {
  CardActionsMenu,
  CardBadges,
  CardStats,
  CONTENT_TYPE_CONFIG,
} from './homebrew-card-sections';

interface HomebrewCardProps {
  content: HomebrewContent;
  isOwner?: boolean;
  isStarred?: boolean;
  isLinkedToCampaign?: boolean;
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

export function HomebrewCard({
  content,
  isOwner = false,
  isStarred = false,
  isLinkedToCampaign = false,
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

          <CardActionsMenu
            isOwner={isOwner}
            isLinkedToCampaign={isLinkedToCampaign}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onFork={onFork}
            onLinkToCampaign={onLinkToCampaign}
            onAddToCollection={onAddToCollection}
            onAddToCharacter={onAddToCharacter}
          />
        </div>
      </CardHeader>

      <CardContent>
        <CardBadges
          contentType={content.contentType}
          visibility={content.visibility}
          tags={content.tags}
          config={config}
        />

        <CardStats
          starCount={content.starCount ?? 0}
          commentCount={content.commentCount ?? 0}
          viewCount={content.viewCount}
          forkCount={content.forkCount}
          campaignLinksCount={content.campaignLinks?.length}
          isStarred={isStarred}
          canInteract={canInteract}
          onToggleStar={onToggleStar}
        />
      </CardContent>
    </Card>
  );
}
