import { createFileRoute, Link } from '@tanstack/react-router';
import { FolderOpen, MoreVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  deleteCampaign,
  listCampaigns,
} from '@/features/campaigns/campaign-storage';
import type { Campaign } from '@/lib/schemas/campaign';

export const Route = createFileRoute('/gm/campaigns/')({
  component: CampaignsList,
});

function CampaignsList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const data = await listCampaigns();
      if (!cancelled) {
        setCampaigns(data);
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteCampaign(deleteTarget.id);
    setDeleteTarget(null);
    setLoading(true);
    const data = await listCampaigns();
    setCampaigns(data);
    setLoading(false);
  }

  function getComplexityLabel(complexity: '1' | '2' | '3') {
    switch (complexity) {
      case '1':
        return { label: 'Simple', color: 'bg-green-500/20 text-green-600' };
      case '2':
        return { label: 'Standard', color: 'bg-blue-500/20 text-blue-600' };
      case '3':
        return { label: 'Complex', color: 'bg-purple-500/20 text-purple-600' };
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-3xl font-bold">My Campaigns</h1>
          <p className="text-muted-foreground">
            Manage your campaign frames and settings
          </p>
        </div>
        <Button asChild>
          <Link to="/gm/campaigns/new">
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Link>
        </Button>
      </div>

      {campaigns.length === 0 ? (
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
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map(campaign => {
            const complexity = getComplexityLabel(campaign.frame.complexity);
            return (
              <Card key={campaign.id} className="group relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="truncate">
                        {campaign.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        <span
                          className={`rounded px-2 py-0.5 text-xs ${complexity.color}`}
                        >
                          {complexity.label}
                        </span>
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            to="/gm/campaigns/$id"
                            params={{ id: campaign.id }}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteTarget(campaign)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
          })}
        </div>
      )}

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.name}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
