// Campaigns list page with inline campaign card components

import { createFileRoute, Link } from '@tanstack/react-router';
import {
  ChevronDown,
  FolderOpen,
  LogIn,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react';
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

function getComplexityLabel(complexity: '1' | '2' | '3'): ComplexityLabel {
  switch (complexity) {
    case '1':
      return { label: 'Simple', color: 'bg-green-500/20 text-green-600' };
    case '2':
      return { label: 'Standard', color: 'bg-blue-500/20 text-blue-600' };
    case '3':
      return { label: 'Complex', color: 'bg-purple-500/20 text-purple-600' };
  }
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

export const Route = createFileRoute('/gm/campaigns/')({
  component: CampaignsList,
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
          <h1 className="mb-2 flex items-center gap-3 text-3xl font-bold sm:text-4xl">
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/10">
              <FolderOpen className="size-6 text-blue-500" />
            </div>
            My Campaigns
          </h1>
          <p className="text-muted-foreground text-lg">
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

      <CampaignGrid
        campaigns={campaigns}
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

      {/* Move to Trash Confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move to Trash</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to move "{deleteTarget?.name}" to the
              recycle bin? You can restore it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              Move to Trash
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent Delete Confirmation */}
      <AlertDialog
        open={!!permanentDeleteTarget}
        onOpenChange={() => setPermanentDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Permanently</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete "
              {permanentDeleteTarget?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePermanentDelete}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              Delete Forever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Empty Trash Confirmation */}
      <AlertDialog
        open={showEmptyTrashConfirm}
        onOpenChange={setShowEmptyTrashConfirm}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Empty Recycle Bin</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete all{' '}
              {trashedCampaigns.length} campaign(s) in the recycle bin? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEmptyTrash}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              Empty Trash
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
