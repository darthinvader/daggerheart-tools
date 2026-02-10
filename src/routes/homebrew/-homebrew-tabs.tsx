/**
 * Homebrew Dashboard Tab Sections
 *
 * Extracted tab content components to reduce HomebrewDashboard complexity.
 */
import {
  BookOpen,
  Folder,
  Globe,
  Lock,
  Package,
  Plus,
  Star,
  Trash2,
  Users,
} from 'lucide-react';
import { useState } from 'react';

import { HomebrewList } from '@/components/homebrew';
import { OfficialContentBrowser } from '@/components/homebrew/official-content-browser';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type {
  HomebrewContent,
  HomebrewContentType,
} from '@/lib/schemas/homebrew';

import { CONTENT_TYPE_CONFIG } from './index';

// ─────────────────────────────────────────────────────────────────────────────
// Tabs List Component
// ─────────────────────────────────────────────────────────────────────────────

interface TabCountsProps {
  all: number;
  public: number;
  private: number;
  linked: number;
  starred: number;
  collections: number;
  deleted: number;
}

export function HomebrewTabsList({ counts }: { counts: TabCountsProps }) {
  return (
    <TabsList>
      <TabsTrigger value="all" className="gap-2">
        <Package className="size-4" />
        <span className="hidden sm:inline">All</span>
        <Badge className="ml-1 hidden bg-zinc-200 text-zinc-700 lg:inline-flex dark:bg-zinc-700 dark:text-zinc-200">
          {counts.all}
        </Badge>
      </TabsTrigger>
      <TabsTrigger value="public" className="gap-2">
        <Globe className="size-4 text-green-500" />
        <span className="hidden sm:inline">Public</span>
        <Badge className="ml-1 hidden bg-zinc-200 text-zinc-700 lg:inline-flex dark:bg-zinc-700 dark:text-zinc-200">
          {counts.public}
        </Badge>
      </TabsTrigger>
      <TabsTrigger value="private" className="gap-2">
        <Lock className="size-4 text-amber-500" />
        <span className="hidden sm:inline">Private</span>
        <Badge className="ml-1 hidden bg-zinc-200 text-zinc-700 lg:inline-flex dark:bg-zinc-700 dark:text-zinc-200">
          {counts.private}
        </Badge>
      </TabsTrigger>
      <TabsTrigger value="quicklist" className="gap-2">
        <Star className="size-4 text-amber-500" />
        <span className="hidden sm:inline">Quicklist</span>
        {counts.starred > 0 && (
          <Badge className="ml-1 hidden bg-zinc-200 text-zinc-700 lg:inline-flex dark:bg-zinc-700 dark:text-zinc-200">
            {counts.starred}
          </Badge>
        )}
      </TabsTrigger>
      <TabsTrigger value="campaign" className="gap-2">
        <Users className="size-4 text-purple-500" />
        <span className="hidden sm:inline">Linked</span>
        {counts.linked > 0 && (
          <Badge className="ml-1 hidden bg-zinc-200 text-zinc-700 lg:inline-flex dark:bg-zinc-700 dark:text-zinc-200">
            {counts.linked}
          </Badge>
        )}
      </TabsTrigger>
      <TabsTrigger value="collections" className="gap-2">
        <Folder className="size-4 text-blue-500" />
        <span className="hidden sm:inline">Collections</span>
        {counts.collections > 0 && (
          <Badge className="ml-1 hidden bg-zinc-200 text-zinc-700 lg:inline-flex dark:bg-zinc-700 dark:text-zinc-200">
            {counts.collections}
          </Badge>
        )}
      </TabsTrigger>
      <TabsTrigger value="recycle-bin" className="gap-2">
        <Trash2 className="size-4 text-red-500" />
        <span className="hidden sm:inline">Recycle Bin</span>
        {counts.deleted > 0 && (
          <Badge className="ml-1 hidden bg-red-100 text-red-700 lg:inline-flex dark:bg-red-900 dark:text-red-200">
            {counts.deleted}
          </Badge>
        )}
      </TabsTrigger>
      <TabsTrigger value="official" className="gap-2">
        <BookOpen className="size-4 text-indigo-500" />
        <span className="hidden sm:inline">Official</span>
      </TabsTrigger>
    </TabsList>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Content Tab Props (shared by multiple tabs)
// ─────────────────────────────────────────────────────────────────────────────

interface ContentTabProps {
  items: HomebrewContent[];
  isLoading: boolean;
  currentUserId: string;
  onView: (item: HomebrewContent) => void;
  onEdit: (item: HomebrewContent) => void;
  onDelete: (item: HomebrewContent) => void;
  onFork: (item: HomebrewContent) => void;
  onCreate: (type: HomebrewContentType) => void;
  emptyMessage: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// All Tab
// ─────────────────────────────────────────────────────────────────────────────

export function AllContentTab(props: ContentTabProps) {
  return (
    <TabsContent value="all">
      <HomebrewList
        items={props.items}
        isLoading={props.isLoading}
        currentUserId={props.currentUserId}
        onView={props.onView}
        onEdit={props.onEdit}
        onDelete={props.onDelete}
        onFork={props.onFork}
        onCreate={props.onCreate}
        emptyMessage={props.emptyMessage}
      />
    </TabsContent>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Public Tab
// ─────────────────────────────────────────────────────────────────────────────

export function PublicContentTab(props: ContentTabProps) {
  return (
    <TabsContent value="public">
      <HomebrewList
        items={props.items}
        isLoading={props.isLoading}
        currentUserId={props.currentUserId}
        onView={props.onView}
        onEdit={props.onEdit}
        onDelete={props.onDelete}
        onFork={props.onFork}
        onCreate={props.onCreate}
        emptyMessage={props.emptyMessage}
      />
    </TabsContent>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Private Tab
// ─────────────────────────────────────────────────────────────────────────────

export function PrivateContentTab(props: ContentTabProps) {
  return (
    <TabsContent value="private">
      <HomebrewList
        items={props.items}
        isLoading={props.isLoading}
        currentUserId={props.currentUserId}
        onView={props.onView}
        onEdit={props.onEdit}
        onDelete={props.onDelete}
        onFork={props.onFork}
        onCreate={props.onCreate}
        emptyMessage={props.emptyMessage}
      />
    </TabsContent>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Quicklist Tab
// ─────────────────────────────────────────────────────────────────────────────

export function QuicklistTab(props: ContentTabProps) {
  return (
    <TabsContent value="quicklist">
      <HomebrewList
        items={props.items}
        isLoading={props.isLoading}
        currentUserId={props.currentUserId}
        onView={props.onView}
        onEdit={props.onEdit}
        onDelete={props.onDelete}
        onFork={props.onFork}
        onCreate={props.onCreate}
        emptyMessage={props.emptyMessage}
      />
    </TabsContent>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Campaign Linked Tab
// ─────────────────────────────────────────────────────────────────────────────

export function CampaignLinkedTab(props: ContentTabProps) {
  return (
    <TabsContent value="campaign">
      <HomebrewList
        items={props.items}
        isLoading={props.isLoading}
        currentUserId={props.currentUserId}
        onView={props.onView}
        onEdit={props.onEdit}
        onDelete={props.onDelete}
        onFork={props.onFork}
        onCreate={props.onCreate}
        emptyMessage={props.emptyMessage}
      />
    </TabsContent>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Official Content Tab
// ─────────────────────────────────────────────────────────────────────────────

export function OfficialContentTab() {
  return (
    <TabsContent value="official">
      <OfficialContentBrowser />
    </TabsContent>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Collections Tab
// ─────────────────────────────────────────────────────────────────────────────

interface CollectionsTabProps {
  isLoading: boolean;
  collections: Array<{
    id: string;
    name: string;
    description?: string | null;
  }>;
  selectedCollectionId: string | null;
  selectedCollection: {
    name: string;
    description?: string | null;
  } | null;
  onSelectCollection: (id: string) => void;
  onDeleteCollection: (id: string) => void;
  isDeletingCollection: boolean;
  onCreateClick: () => void;
  isContentLoading: boolean;
  orderedContent: HomebrewContent[];
  currentUserId: string;
  contentTabProps: Omit<
    ContentTabProps,
    'items' | 'isLoading' | 'emptyMessage'
  >;
}

export function CollectionsTab({
  isLoading,
  collections,
  selectedCollectionId,
  selectedCollection,
  onSelectCollection,
  onDeleteCollection,
  isDeletingCollection,
  onCreateClick,
  isContentLoading,
  orderedContent,
  currentUserId,
  contentTabProps,
}: CollectionsTabProps) {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  if (isLoading) {
    return (
      <TabsContent value="collections">
        <div className="text-muted-foreground flex h-48 items-center justify-center">
          Loading collections...
        </div>
      </TabsContent>
    );
  }

  if (collections.length === 0) {
    return (
      <TabsContent value="collections">
        <div className="flex h-48 flex-col items-center justify-center gap-3 text-center">
          <div className="bg-muted flex size-16 items-center justify-center rounded-full">
            <Folder className="text-muted-foreground size-8" />
          </div>
          <p className="text-muted-foreground">
            You don&apos;t have any collections yet.
          </p>
          <Button onClick={onCreateClick}>
            <Plus className="mr-2 size-4" /> Create Collection
          </Button>
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="collections">
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Your Collections</CardTitle>
              <Button variant="ghost" size="sm" onClick={onCreateClick}>
                <Plus className="size-4" />
              </Button>
            </div>
            <CardDescription>
              Pick a collection to view its items.
            </CardDescription>
          </CardHeader>
          <div className="space-y-2 p-4 pt-0">
            {collections.map(collection => (
              <div
                key={collection.id}
                className="group flex items-center gap-1"
              >
                <Button
                  variant={
                    collection.id === selectedCollectionId
                      ? 'secondary'
                      : 'ghost'
                  }
                  className="min-w-0 flex-1 justify-start"
                  onClick={() => onSelectCollection(collection.id)}
                >
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium">
                      {collection.name}
                    </span>
                    {collection.description && (
                      <span className="text-muted-foreground text-xs">
                        {collection.description}
                      </span>
                    )}
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive size-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => setDeleteTargetId(collection.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>

          <AlertDialog
            open={!!deleteTargetId}
            onOpenChange={open => {
              if (!open) setDeleteTargetId(null);
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Collection</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this collection? The homebrew
                  items inside it will not be deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={isDeletingCollection}
                  onClick={async () => {
                    if (deleteTargetId) {
                      await onDeleteCollection(deleteTargetId);
                      setDeleteTargetId(null);
                    }
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {selectedCollection?.name ?? 'Collection'}
            </CardTitle>
            {selectedCollection?.description && (
              <CardDescription>
                {selectedCollection.description}
              </CardDescription>
            )}
          </CardHeader>
          <div className="p-4 pt-0">
            {isContentLoading ? (
              <div className="text-muted-foreground flex h-48 items-center justify-center">
                Loading collection items...
              </div>
            ) : orderedContent.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center gap-3 text-center">
                <div className="bg-muted flex size-16 items-center justify-center rounded-full">
                  <Package className="text-muted-foreground size-8" />
                </div>
                <p className="text-muted-foreground">
                  This collection doesn&apos;t have any items yet.
                </p>
              </div>
            ) : (
              <HomebrewList
                items={orderedContent}
                isLoading={false}
                currentUserId={currentUserId}
                onView={contentTabProps.onView}
                onEdit={contentTabProps.onEdit}
                onDelete={contentTabProps.onDelete}
                onFork={contentTabProps.onFork}
                onCreate={contentTabProps.onCreate}
                showCreateButton={false}
                emptyMessage="No items in this collection."
              />
            )}
          </div>
        </Card>
      </div>
    </TabsContent>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Recycle Bin Tab
// ─────────────────────────────────────────────────────────────────────────────

type RecycleBinItem = HomebrewContent & {
  deletedAt?: string | null;
};

interface RecycleBinTabProps {
  items: RecycleBinItem[];
  isLoading: boolean;
  onRestore: (item: HomebrewContent) => void;
  onPermanentDelete: (item: HomebrewContent) => void;
  onEmptyBin: () => void;
  isRestorePending: boolean;
  isPermanentDeletePending: boolean;
  isEmptyBinPending: boolean;
}

export function RecycleBinTab({
  items,
  isLoading,
  onRestore,
  onPermanentDelete,
  onEmptyBin,
  isRestorePending,
  isPermanentDeletePending,
  isEmptyBinPending,
}: RecycleBinTabProps) {
  if (isLoading) {
    return (
      <TabsContent value="recycle-bin">
        <div className="text-muted-foreground flex h-48 items-center justify-center">
          Loading deleted items...
        </div>
      </TabsContent>
    );
  }

  if (items.length === 0) {
    return (
      <TabsContent value="recycle-bin">
        <div className="flex h-48 flex-col items-center justify-center gap-3 text-center">
          <div className="bg-muted flex size-16 items-center justify-center rounded-full">
            <Trash2 className="text-muted-foreground size-8" />
          </div>
          <p className="text-muted-foreground">Your recycle bin is empty.</p>
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="recycle-bin">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {items.length} item(s) in recycle bin
        </p>
        <Button
          variant="destructive"
          size="sm"
          onClick={onEmptyBin}
          disabled={isEmptyBinPending}
        >
          <Trash2 className="mr-2 size-4" />
          Empty Recycle Bin
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(item => {
          const config = CONTENT_TYPE_CONFIG[item.contentType];
          const TypeIcon = config.icon;
          return (
            <Card
              key={item.id}
              className="opacity-60 transition-opacity hover:opacity-100"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${config.bgColor}`}
                    >
                      <TypeIcon className={`size-5 ${config.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="truncate text-lg">
                        {item.name}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Deleted{' '}
                        {item.deletedAt
                          ? new Date(item.deletedAt).toLocaleDateString()
                          : 'recently'}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRestore(item)}
                      disabled={isRestorePending}
                    >
                      Restore
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onPermanentDelete(item)}
                      disabled={isPermanentDeletePending}
                    >
                      Delete Forever
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </TabsContent>
  );
}
