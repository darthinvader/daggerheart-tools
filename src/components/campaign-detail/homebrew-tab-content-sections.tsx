/**
 * Homebrew Tab Content Section Components
 *
 * Extracted section components for HomebrewTabContent to reduce complexity.
 */
import {
  Beaker,
  Folder,
  Globe,
  Link2,
  Lock,
  Plus,
  Star,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

// ─────────────────────────────────────────────────────────────────────────────
// Header Section
// ─────────────────────────────────────────────────────────────────────────────

interface HomebrewHeaderSectionProps {
  onCreateClick: () => void;
}

export function HomebrewTabHeader({
  onCreateClick,
}: HomebrewHeaderSectionProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h2 className="flex items-center gap-2 text-2xl font-semibold">
          <Beaker className="text-primary size-6" />
          Campaign Homebrew
        </h2>
        <p className="text-muted-foreground mt-1">
          Browse and link homebrew content to this campaign
        </p>
      </div>
      <Button onClick={onCreateClick}>
        <Plus className="mr-2 size-4" /> Create New
      </Button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Info Card
// ─────────────────────────────────────────────────────────────────────────────

interface CampaignInfoCardProps {
  onDismiss: () => void;
}

export function CampaignHomebrewInfoCard({ onDismiss }: CampaignInfoCardProps) {
  return (
    <Card className="relative border-purple-500/20 bg-linear-to-r from-purple-500/5 to-purple-500/10">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 size-7"
        onClick={onDismiss}
      >
        <X className="size-4" />
      </Button>
      <CardHeader className="pr-10 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Link2 className="size-5 text-purple-500" />
          How Campaign Homebrew Works
        </CardTitle>
        <CardDescription className="text-base">
          Content linked to this campaign will be available to players when
          building characters. Custom adversaries and environments can be used
          in the battle tracker. Players will see homebrew options alongside
          official content.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Inner Tabs List
// ─────────────────────────────────────────────────────────────────────────────

interface HomebrewInnerTabsListProps {
  linkedCount: number;
  allCount: number;
}

export function HomebrewInnerTabsList({
  linkedCount,
  allCount,
}: HomebrewInnerTabsListProps) {
  return (
    <TabsList className="flex-wrap">
      <TabsTrigger value="linked" className="gap-2">
        <Link2 className="size-4 text-green-500" />
        <span className="hidden sm:inline">Linked</span>
        <Badge variant="secondary" className="ml-1 hidden lg:inline-flex">
          {linkedCount}
        </Badge>
      </TabsTrigger>
      <TabsTrigger value="all" className="gap-2">
        <Beaker className="size-4" />
        <span className="hidden sm:inline">All</span>
        <Badge variant="secondary" className="ml-1 hidden lg:inline-flex">
          {allCount}
        </Badge>
      </TabsTrigger>
      <TabsTrigger value="public" className="gap-2">
        <Globe className="size-4 text-green-500" />
        <span className="hidden sm:inline">Public</span>
      </TabsTrigger>
      <TabsTrigger value="private" className="gap-2">
        <Lock className="size-4 text-amber-500" />
        <span className="hidden sm:inline">Private</span>
      </TabsTrigger>
      <TabsTrigger value="quicklist" className="gap-2">
        <Star className="size-4 text-amber-500" />
        <span className="hidden sm:inline">Quicklist</span>
      </TabsTrigger>
      <TabsTrigger value="collections" className="gap-2">
        <Folder className="size-4 text-blue-500" />
        <span className="hidden sm:inline">Collections</span>
      </TabsTrigger>
    </TabsList>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// All Tab Info Text
// ─────────────────────────────────────────────────────────────────────────────

export function AllTabInfoText() {
  return (
    <div className="mb-4">
      <p className="text-muted-foreground text-sm">
        All your homebrew content. Items with &quot;✓ Linked&quot; are linked to
        this campaign. Use &quot;Link to Campaign&quot; to toggle.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Browse List Helpers
// ─────────────────────────────────────────────────────────────────────────────

import type {
  HomebrewContent,
  HomebrewContentType,
} from '@/lib/schemas/homebrew';

/**
 * Adds linked tags to items for visual distinction
 */
export function addLinkedTags(
  items: HomebrewContent[],
  linkedIds: Set<string>
): HomebrewContent[] {
  return items.map(item => ({
    ...item,
    tags: linkedIds.has(item.id)
      ? ['✓ Linked', ...(item.tags ?? [])]
      : item.tags,
  }));
}

/**
 * Creates handlers for browse list interactions
 */
export function createBrowseListHandlers(
  sourceList: HomebrewContent[],
  linkedIds: Set<string>,
  handlers: {
    onView: (item: HomebrewContent) => void;
    onEdit: (item: HomebrewContent) => void;
    onLink: (item: HomebrewContent) => void;
    onUnlink: (item: HomebrewContent) => void;
    onCreate: (type: HomebrewContentType) => void;
  }
) {
  return {
    onView: (item: HomebrewContent) => {
      const originalItem = sourceList.find(h => h.id === item.id);
      if (originalItem) handlers.onView(originalItem);
    },
    onEdit: (item: HomebrewContent) => {
      const originalItem = sourceList.find(h => h.id === item.id);
      if (originalItem) handlers.onEdit(originalItem);
    },
    onLinkToCampaign: (item: HomebrewContent) => {
      const originalItem = sourceList.find(h => h.id === item.id);
      if (!originalItem) return;
      if (linkedIds.has(item.id)) {
        handlers.onUnlink(originalItem);
      } else {
        handlers.onLink(originalItem);
      }
    },
    onCreate: handlers.onCreate,
  };
}
