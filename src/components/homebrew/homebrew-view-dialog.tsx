/**
 * Homebrew View Dialog
 *
 * Read-only dialog for viewing homebrew content details.
 * Provides view-only display with options to edit (if owner) or fork.
 * Uses the same detail components as the official content browser.
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
  Package,
  Pencil,
  Shield,
  Skull,
  Star,
  Sword,
  Users,
} from 'lucide-react';
import type { ElementType } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type {
  HomebrewContent,
  HomebrewContentType,
} from '@/lib/schemas/homebrew';
import {
  getContentTypeLabel,
  getVisibilityLabel,
} from '@/lib/schemas/homebrew';

import { ContentDetail } from './content-detail-views';
import { HomebrewComments } from './homebrew-comments';

interface HomebrewViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: HomebrewContent | null;
  isOwner?: boolean;
  onEdit?: () => void;
  onFork?: () => void;
}

// Content type configuration with icons and colors
const CONTENT_TYPE_CONFIG: Record<
  HomebrewContentType,
  {
    icon: ElementType;
    color: string;
    bgColor: string;
  }
> = {
  adversary: {
    icon: Skull,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  environment: {
    icon: Map,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  domain_card: {
    icon: Layers,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  class: {
    icon: Shield,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  subclass: {
    icon: BookOpen,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
  },
  ancestry: {
    icon: Users,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  community: {
    icon: Home,
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
  },
  equipment: {
    icon: Sword,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  item: {
    icon: Package,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
  },
};

// Color gradients matching official content browser
const TYPE_GRADIENTS: Record<HomebrewContentType, string> = {
  adversary: 'from-red-500 via-rose-500 to-orange-500',
  environment: 'from-emerald-500 via-teal-500 to-sky-500',
  class: 'from-blue-500 via-indigo-500 to-purple-500',
  subclass: 'from-indigo-500 via-purple-500 to-pink-500',
  ancestry: 'from-amber-500 via-orange-500 to-rose-500',
  community: 'from-teal-500 via-cyan-500 to-blue-500',
  domain_card: 'from-violet-500 via-purple-500 to-fuchsia-500',
  equipment: 'from-orange-500 via-amber-500 to-yellow-500',
  item: 'from-cyan-500 via-sky-500 to-blue-500',
};

const VisibilityIcon = ({
  visibility,
}: {
  visibility: HomebrewContent['visibility'];
}) => {
  switch (visibility) {
    case 'public':
      return <Globe className="size-4 text-green-500" />;
    case 'campaign_only':
      return <Users className="size-4 text-purple-500" />;
    default:
      return <Lock className="size-4 text-amber-500" />;
  }
};

/** Stats row showing engagement metrics */
function StatsRow({ content }: { content: HomebrewContent }) {
  const stats = [
    {
      icon: Star,
      value: content.starCount ?? 0,
      label: 'stars',
      className: 'text-amber-500',
      show: true,
    },
    {
      icon: MessageSquare,
      value: content.commentCount ?? 0,
      label: 'comments',
      show: true,
    },
    {
      icon: Eye,
      value: content.viewCount ?? 0,
      label: 'views',
      show: (content.viewCount ?? 0) > 0,
    },
    {
      icon: GitFork,
      value: content.forkCount ?? 0,
      label: 'forks',
      show: (content.forkCount ?? 0) > 0,
    },
  ];

  const campaignCount = content.campaignLinks?.length ?? 0;

  return (
    <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
      {stats
        .filter(s => s.show)
        .map(stat => (
          <span key={stat.label} className="flex items-center gap-1.5">
            <stat.icon className={`size-4 ${stat.className ?? ''}`} />
            {stat.value} {stat.label}
          </span>
        ))}
      {campaignCount > 0 && (
        <span className="flex items-center gap-1.5">
          <Link2 className="size-4" />
          {campaignCount} campaign{campaignCount > 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
}

export function HomebrewViewDialog({
  open,
  onOpenChange,
  content,
  isOwner = false,
  onEdit,
  onFork,
}: HomebrewViewDialogProps) {
  if (!content) return null;

  const config = CONTENT_TYPE_CONFIG[content.contentType];
  const TypeIcon = config.icon;
  const gradient = TYPE_GRADIENTS[content.contentType];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden p-0">
        {/* Gradient Header - matching official view */}
        <div className={`bg-gradient-to-r p-6 ${gradient}`}>
          <div className="rounded-xl bg-black/25 p-4">
            <DialogHeader className="space-y-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <DialogTitle className="flex items-center gap-2 text-xl font-bold text-white drop-shadow">
                    {content.name}
                    {content.forkedFrom && (
                      <GitFork className="size-4 text-white/70" />
                    )}
                  </DialogTitle>
                  <p className="text-white/80">
                    Homebrew {getContentTypeLabel(content.contentType)}
                  </p>
                </div>
                {/* Action buttons */}
                <div className="flex shrink-0 gap-2">
                  {isOwner && onEdit && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/20 text-white hover:bg-white/30"
                      onClick={onEdit}
                    >
                      <Pencil className="mr-1.5 size-3.5" />
                      Edit
                    </Button>
                  )}
                  {onFork && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/20 text-white hover:bg-white/30"
                      onClick={onFork}
                    >
                      <Copy className="mr-1.5 size-3.5" />
                      Fork
                    </Button>
                  )}
                </div>
              </div>
            </DialogHeader>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge className="border-slate-900/40 bg-slate-900/80 text-white">
                <TypeIcon className="mr-1 size-3" />
                {getContentTypeLabel(content.contentType)}
              </Badge>
              <Badge className="gap-1 border-slate-900/40 bg-slate-900/80 text-white">
                <VisibilityIcon visibility={content.visibility} />
                {getVisibilityLabel(content.visibility)}
              </Badge>
              {content.tags?.map(tag => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="border-white/30 text-white"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Content - Using shared detail component */}
        <ScrollArea className="max-h-[50vh] p-6">
          {/* Stats Row (homebrew-specific) */}
          <div className="mb-4">
            <StatsRow content={content} />
          </div>

          {/* Content Detail - same as official view */}
          <ContentDetail
            contentType={content.contentType}
            rawData={content.content}
          />
        </ScrollArea>

        {/* Footer with comments */}
        <div className="border-t p-4">
          <HomebrewComments homebrewId={content.id} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
