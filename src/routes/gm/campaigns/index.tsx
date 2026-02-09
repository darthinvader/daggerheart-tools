// Campaigns list page with inline campaign card components

import {
  createFileRoute,
  type ErrorComponentProps,
  Link,
} from '@tanstack/react-router';
import {
  ArrowDownAZ,
  ArrowUpAZ,
  ChevronDown,
  FolderOpen,
  LogIn,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { useAuth } from '@/components/providers';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { RouteErrorFallback } from '@/components/ui/route-error-fallback';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Campaign } from '@/lib/schemas/campaign';
import {
  type TrashedCampaign,
  useCampaignsListState,
} from './use-campaigns-list-state';

type ComplexityLabel = { label: string; color: string };

const COMPLEXITY_LABELS: Record<'1' | '2' | '3' | '4', ComplexityLabel> = {
  '1': {
    label: 'Simple',
    color: 'bg-green-500/20 text-green-600 dark:text-green-400',
  },
  '2': {
    label: 'Standard',
    color: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
  },
  '3': {
    label: 'Complex',
    color: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
  },
  '4': {
    label: 'Epic',
    color: 'bg-red-500/20 text-red-600 dark:text-red-400',
  },
};

function getComplexityLabel(
  complexity: '1' | '2' | '3' | '4'
): ComplexityLabel {
  return COMPLEXITY_LABELS[complexity];
}

function formatDeletedDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

interface CampaignCardProps {
  campaign: Campaign;
  onDelete: (campaign: Campaign) => void;
}

function CampaignCard({ campaign, onDelete }: CampaignCardProps) {
  const complexity = getComplexityLabel(campaign.frame.complexity);

  return (
    <Card className="group relative cursor-pointer transition-shadow hover:shadow-md">
      <Link
        to="/gm/campaigns/$id"
        params={{ id: campaign.id }}
        search={{ tab: 'overview' }}
        className="absolute inset-0 z-0"
        aria-label={`Open ${campaign.name}`}
      />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate">{campaign.name}</CardTitle>
            <CardDescription className="mt-1">
              <span
                className={`rounded px-2 py-0.5 text-xs ${complexity.color}`}
              >
                {complexity.label}
              </span>
            </CardDescription>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10 relative z-10 h-8 w-8"
                onClick={event => {
                  event.preventDefault();
                  event.stopPropagation();
                  onDelete(campaign);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move to trash</TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {campaign.frame.pitch || 'No pitch defined'}
        </p>
        <div className="text-muted-foreground mt-2 flex gap-2 text-xs">
          {campaign.sessions.length > 0 && (
            <span>{campaign.sessions.length} sessions</span>
          )}
          {campaign.players.length > 0 && (
            <span>· {campaign.players.length} players</span>
          )}
        </div>
        {campaign.frame.themes.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {campaign.frame.themes.slice(0, 3).map(theme => (
              <span
                key={theme}
                className="bg-secondary rounded px-2 py-0.5 text-xs"
              >
                {theme}
              </span>
            ))}
            {campaign.frame.themes.length > 3 && (
              <span className="text-muted-foreground text-xs">
                +{campaign.frame.themes.length - 3} more
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface CampaignGridProps {
  campaigns: Campaign[];
  onDelete: (campaign: Campaign) => void;
}

function CampaignGrid({ campaigns, onDelete }: CampaignGridProps) {
  if (campaigns.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FolderOpen className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-medium">No campaigns yet</h3>
          <p className="text-muted-foreground mb-4 text-center">
            Create your first campaign using a campaign frame template
          </p>
          <Button asChild>
            <Link to="/gm/campaigns/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {campaigns.map(campaign => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

interface RecycleBinSectionProps {
  trashedCampaigns: TrashedCampaign[];
  trashOpen: boolean;
  onTrashOpenChange: (open: boolean) => void;
  onEmptyTrash: () => void;
  onRestore: (id: string) => void;
  onPermanentDelete: (campaign: TrashedCampaign) => void;
}

function RecycleBinSection({
  trashedCampaigns,
  trashOpen,
  onTrashOpenChange,
  onEmptyTrash,
  onRestore,
  onPermanentDelete,
}: RecycleBinSectionProps) {
  if (trashedCampaigns.length === 0) return null;

  return (
    <Collapsible
      open={trashOpen}
      onOpenChange={onTrashOpenChange}
      className="mt-8"
    >
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Recycle Bin ({trashedCampaigns.length})
            <ChevronDown
              className={`h-4 w-4 transition-transform ${trashOpen ? 'rotate-180' : ''}`}
            />
          </Button>
        </CollapsibleTrigger>
        {trashOpen && (
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:bg-destructive/10"
            onClick={onEmptyTrash}
          >
            Empty Trash
          </Button>
        )}
      </div>
      <CollapsibleContent className="mt-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trashedCampaigns.map(campaign => {
            const complexity = getComplexityLabel(campaign.frame.complexity);
            return (
              <Card key={campaign.id} className="border-dashed opacity-75">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="truncate text-base">
                        {campaign.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        <span
                          className={`rounded px-2 py-0.5 text-xs ${complexity.color}`}
                        >
                          {complexity.label}
                        </span>
                        <span className="text-muted-foreground ml-2 text-xs">
                          Deleted {formatDeletedDate(campaign.deletedAt)}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-green-600 hover:bg-green-500/10"
                            onClick={() => onRestore(campaign.id)}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Restore campaign</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10 h-8 w-8"
                            onClick={() => onPermanentDelete(campaign)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete permanently</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2 text-sm">
                    {campaign.frame.pitch || 'No pitch defined'}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

interface CampaignSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  complexityFilter: string | null;
  onComplexityFilterChange: (value: string | null) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderToggle: () => void;
}

function CampaignSearchBar({
  searchQuery,
  onSearchChange,
  complexityFilter,
  onComplexityFilterChange,
  sortOrder,
  onSortOrderToggle,
}: CampaignSearchBarProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Search campaigns..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex items-center gap-2">
        {(['1', '2', '3', '4'] as const).map(level => {
          const { label, color } = getComplexityLabel(level);
          const isActive = complexityFilter === level;
          return (
            <Button
              key={level}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => onComplexityFilterChange(isActive ? null : level)}
              className={isActive ? '' : `${color} border-transparent`}
            >
              {label}
            </Button>
          );
        })}
        <Button
          variant="ghost"
          size="icon"
          onClick={onSortOrderToggle}
          title={sortOrder === 'asc' ? 'Sort A→Z' : 'Sort Z→A'}
        >
          {sortOrder === 'asc' ? (
            <ArrowDownAZ className="h-4 w-4" />
          ) : (
            <ArrowUpAZ className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  actionLabel,
  onAction,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onAction}
            className="bg-destructive hover:bg-destructive/90 text-white"
          >
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const Route = createFileRoute('/gm/campaigns/')({
  component: CampaignsList,
  errorComponent: ({ error }: ErrorComponentProps) => (
    <RouteErrorFallback error={error} />
  ),
});

function CampaignsList() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  // Use extracted hook for state management
  const {
    campaigns,
    trashedCampaigns,
    loading,
    deleteTarget,
    setDeleteTarget,
    permanentDeleteTarget,
    setPermanentDeleteTarget,
    showEmptyTrashConfirm,
    setShowEmptyTrashConfirm,
    trashOpen,
    setTrashOpen,
    handleDelete,
    handleRestore,
    handlePermanentDelete,
    handleEmptyTrash,
  } = useCampaignsListState();

  const [searchQuery, setSearchQuery] = useState('');
  const [complexityFilter, setComplexityFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredCampaigns = useMemo(() => {
    let result = campaigns;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        c =>
          c.name.toLowerCase().includes(query) ||
          c.frame.pitch.toLowerCase().includes(query) ||
          c.frame.themes.some(t => t.toLowerCase().includes(query))
      );
    }

    if (complexityFilter) {
      result = result.filter(c => c.frame.complexity === complexityFilter);
    }

    result = [...result].sort((a, b) => {
      const cmp = a.name.localeCompare(b.name);
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [campaigns, searchQuery, complexityFilter, sortOrder]);

  const toggleSortOrder = () =>
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  const clearDeleteTarget = () => setDeleteTarget(null);
  const clearPermanentDeleteTarget = () => setPermanentDeleteTarget(null);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="bg-muted size-12 animate-pulse rounded-xl" />
          <div className="space-y-2">
            <div className="bg-muted h-8 w-40 animate-pulse rounded" />
            <div className="bg-muted h-5 w-56 animate-pulse rounded" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-muted h-40 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-2xl font-bold">
            <FolderOpen className="mr-2 inline-block size-6 text-blue-500" />
            My Campaigns
          </span>
          <p className="text-muted-foreground mt-2">
            Manage your campaign frames and settings
          </p>
        </div>
        <Button asChild disabled={!isAuthenticated} size="lg">
          <Link to="/gm/campaigns/new">
            <Plus className="mr-2 size-5" />
            New Campaign
          </Link>
        </Button>
      </div>

      {!isAuthLoading && !isAuthenticated && (
        <Alert className="mb-6 border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
          <LogIn className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-amber-800 dark:text-amber-200">
            Account Required
          </AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-300">
            You need to{' '}
            <Link
              to="/login"
              className="font-medium underline hover:no-underline"
            >
              sign in
            </Link>{' '}
            to create and manage campaigns.
          </AlertDescription>
        </Alert>
      )}

      {/* Search, Filter & Sort Controls */}
      {campaigns.length > 0 && (
        <CampaignSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          complexityFilter={complexityFilter}
          onComplexityFilterChange={setComplexityFilter}
          sortOrder={sortOrder}
          onSortOrderToggle={toggleSortOrder}
        />
      )}

      <CampaignGrid
        campaigns={filteredCampaigns}
        onDelete={campaign => setDeleteTarget(campaign)}
      />

      <RecycleBinSection
        trashedCampaigns={trashedCampaigns}
        trashOpen={trashOpen}
        onTrashOpenChange={setTrashOpen}
        onEmptyTrash={() => setShowEmptyTrashConfirm(true)}
        onRestore={handleRestore}
        onPermanentDelete={setPermanentDeleteTarget}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={clearDeleteTarget}
        title="Move to Trash"
        description={`Are you sure you want to move "${deleteTarget?.name}" to the recycle bin? You can restore it later.`}
        actionLabel="Move to Trash"
        onAction={handleDelete}
      />

      <ConfirmDialog
        open={!!permanentDeleteTarget}
        onOpenChange={clearPermanentDeleteTarget}
        title="Delete Permanently"
        description={`Are you sure you want to permanently delete "${permanentDeleteTarget?.name}"? This action cannot be undone.`}
        actionLabel="Delete Forever"
        onAction={handlePermanentDelete}
      />

      <ConfirmDialog
        open={showEmptyTrashConfirm}
        onOpenChange={setShowEmptyTrashConfirm}
        title="Empty Recycle Bin"
        description={`Are you sure you want to permanently delete all ${trashedCampaigns.length} campaign(s) in the recycle bin? This action cannot be undone.`}
        actionLabel="Empty Trash"
        onAction={handleEmptyTrash}
      />
    </div>
  );
}
