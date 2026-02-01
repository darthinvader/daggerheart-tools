/**
 * Homebrew View Dialog
 *
 * Read-only dialog for viewing homebrew content details.
 * Provides view-only display with options to edit (if owner) or fork.
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
import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import type {
  HomebrewContent,
  HomebrewContentType,
} from '@/lib/schemas/homebrew';
import {
  getContentTypeLabel,
  getVisibilityLabel,
} from '@/lib/schemas/homebrew';

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

/** Helper to format thresholds object or string */
function formatThresholds(thresholds: unknown): string {
  if (typeof thresholds === 'string') return thresholds;
  if (typeof thresholds === 'number') return String(thresholds);
  if (thresholds && typeof thresholds === 'object') {
    const t = thresholds as { major?: number | null; severe?: number | null };
    const parts = [];
    if (t.major != null) parts.push(`Major: ${t.major}`);
    if (t.severe != null) parts.push(`Severe: ${t.severe}`);
    return parts.join(', ') || 'N/A';
  }
  return 'N/A';
}

/** Helper to extract string array from potentially complex arrays */
function extractStringArray(arr: unknown[]): string[] {
  return arr.map(item => {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object' && 'name' in item) {
      const named = item as { name: string; description?: string };
      return named.description
        ? `${named.name}: ${named.description}`
        : named.name;
    }
    return String(item);
  });
}

/** Field extractor configuration */
type FieldConfig = {
  key: string;
  label: string;
  format?: (value: unknown) => string;
  check?: (value: unknown) => boolean;
};

const CONTENT_FIELD_CONFIGS: FieldConfig[] = [
  { key: 'tier', label: 'Tier' },
  { key: 'role', label: 'Role' },
  { key: 'difficulty', label: 'Difficulty' },
  { key: 'hp', label: 'HP', check: v => typeof v === 'number' },
  { key: 'stress', label: 'Stress', check: v => typeof v === 'number' },
  { key: 'thresholds', label: 'Thresholds', format: formatThresholds },
  { key: 'domain', label: 'Domain' },
  { key: 'level', label: 'Level', check: v => typeof v === 'number' },
  { key: 'cost', label: 'Cost' },
  { key: 'recallCost', label: 'Recall Cost' },
];

/** Extract content details from homebrew content using config-driven approach */
function extractContentDetails(
  content: HomebrewContent['content']
): { label: string; value: string }[] {
  const c = content as Record<string, unknown>;
  return CONTENT_FIELD_CONFIGS.filter(config => {
    const value = c[config.key];
    if (value == null) return false;
    return config.check ? config.check(value) : Boolean(value);
  }).map(config => ({
    label: config.label,
    value: config.format ? config.format(c[config.key]) : String(c[config.key]),
  }));
}

/** Content details grid display */
function ContentDetailsSection({
  content,
}: {
  content: HomebrewContent['content'];
}) {
  const details = extractContentDetails(content);
  if (details.length === 0) return null;

  return (
    <section>
      <h3 className="text-muted-foreground mb-2 text-sm font-semibold tracking-wide uppercase">
        Details
      </h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {details.map(detail => (
          <div
            key={detail.label}
            className="bg-muted/30 rounded-md border px-3 py-2"
          >
            <div className="text-muted-foreground text-xs">{detail.label}</div>
            <div className="font-medium">{detail.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Features list display */
function FeaturesSection({ content }: { content: HomebrewContent['content'] }) {
  if (
    !('features' in content) ||
    !Array.isArray(content.features) ||
    content.features.length === 0
  ) {
    return null;
  }
  const features = extractStringArray(content.features);

  return (
    <section>
      <h3 className="text-muted-foreground mb-2 text-sm font-semibold tracking-wide uppercase">
        Features
      </h3>
      <ul className="space-y-2">
        {features.map((feature, idx) => (
          <li key={idx} className="text-sm leading-relaxed">
            {feature}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Experiences list display */
function ExperiencesSection({
  content,
}: {
  content: HomebrewContent['content'];
}) {
  if (
    !('experiences' in content) ||
    !Array.isArray(content.experiences) ||
    content.experiences.length === 0
  ) {
    return null;
  }
  const experiences = extractStringArray(content.experiences);

  return (
    <section>
      <h3 className="text-muted-foreground mb-2 text-sm font-semibold tracking-wide uppercase">
        Experiences
      </h3>
      <ul className="space-y-1">
        {experiences.map((exp, idx) => (
          <li key={idx} className="text-sm">
            • {exp}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Effect display (for domain cards) */
function EffectSection({ content }: { content: HomebrewContent['content'] }) {
  if (!('effect' in content) || typeof content.effect !== 'string') return null;

  return (
    <section>
      <h3 className="text-muted-foreground mb-2 text-sm font-semibold tracking-wide uppercase">
        Effect
      </h3>
      <p className="text-sm leading-relaxed">{content.effect}</p>
    </section>
  );
}

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
  const description = useMemo(() => {
    if (!content) return 'No description available.';
    if ('description' in content.content && content.content.description) {
      return content.content.description;
    }
    return 'No description available.';
  }, [content]);

  if (!content) return null;

  const config = CONTENT_TYPE_CONFIG[content.contentType];
  const TypeIcon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`flex size-12 shrink-0 items-center justify-center rounded-lg ${config.bgColor}`}
              >
                <TypeIcon className={`size-6 ${config.color}`} />
              </div>
              <div>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  {content.name}
                  {content.forkedFrom && (
                    <GitFork className="text-muted-foreground size-4" />
                  )}
                </DialogTitle>
                <div className="mt-1 flex flex-wrap items-center gap-2">
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
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex shrink-0 gap-2">
              {isOwner && onEdit && (
                <Button size="sm" variant="outline" onClick={onEdit}>
                  <Pencil className="mr-1.5 size-3.5" />
                  Edit
                </Button>
              )}
              {onFork && (
                <Button size="sm" variant="outline" onClick={onFork}>
                  <Copy className="mr-1.5 size-3.5" />
                  Fork
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats Row */}
          <StatsRow content={content} />

          {/* Tags */}
          {content.tags && content.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {content.tags.map(tag => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <Separator />

          {/* Description */}
          <section>
            <h3 className="text-muted-foreground mb-2 text-sm font-semibold tracking-wide uppercase">
              Description
            </h3>
            <p className="text-sm leading-relaxed">{description}</p>
          </section>

          {/* Content Details */}
          <ContentDetailsSection content={content.content} />

          {/* Experiences */}
          <ExperiencesSection content={content.content} />

          {/* Effect (for domain cards) */}
          <EffectSection content={content.content} />

          {/* Features */}
          <FeaturesSection content={content.content} />

          <Separator />

          {/* Comments Section */}
          <HomebrewComments homebrewId={content.id} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
