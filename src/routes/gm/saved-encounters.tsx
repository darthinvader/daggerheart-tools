import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { FolderOpen, Play, Plus, Swords, Trash2 } from 'lucide-react';
import { type KeyboardEvent, useState } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  createStandaloneBattle,
  deleteStandaloneBattle,
  listStandaloneBattles,
  type StandaloneBattleSummary,
} from '@/features/campaigns/campaign-storage';
import { listCampaigns } from '@/features/campaigns/campaign-storage';

export const Route = createFileRoute('/gm/saved-encounters')({
  component: SavedEncountersPage,
});

function EncounterLoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-muted h-16 animate-pulse rounded-lg" />
      ))}
    </div>
  );
}

interface StandaloneEncounterItemProps {
  battle: StandaloneBattleSummary;
  onDelete: (id: string) => void;
}

function StandaloneEncounterItem({
  battle,
  onDelete,
}: StandaloneEncounterItemProps) {
  return (
    <div className="group hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{battle.name}</p>
        <p className="text-muted-foreground text-xs">
          Updated {new Date(battle.updatedAt).toLocaleString()}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link to="/gm/battle-tracker" search={{ battleId: battle.id }}>
            <Play className="mr-1 h-4 w-4" />
            Open
          </Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive opacity-0 group-hover:opacity-100"
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Encounter</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this encounter. This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(battle.id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

interface CampaignEncounterItemProps {
  battle: {
    id: string;
    name: string;
    status: string;
    campaignId: string;
    campaignName: string;
  };
}

function CampaignEncounterItem({ battle }: CampaignEncounterItemProps) {
  return (
    <div className="group hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium">{battle.name}</p>
          <Badge variant="outline" className="text-xs">
            {battle.status}
          </Badge>
        </div>
        <p className="text-muted-foreground text-xs">{battle.campaignName}</p>
      </div>
      <Button variant="outline" size="sm" asChild>
        <Link
          to="/gm/campaigns/$id/battle"
          params={{ id: battle.campaignId }}
          search={{ tab: 'gm-tools', battleId: battle.id }}
        >
          <Play className="mr-1 h-4 w-4" />
          Open
        </Link>
      </Button>
    </div>
  );
}

function SavedEncountersPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [newBattleName, setNewBattleName] = useState('');

  // Standalone battles
  const { data: standaloneBattles = [], isLoading: isLoadingStandalone } =
    useQuery({
      queryKey: ['standalone-battles'],
      queryFn: listStandaloneBattles,
    });

  // Campaign battles (for the campaign section)
  const { data: campaigns = [], isLoading: isLoadingCampaigns } = useQuery({
    queryKey: ['campaigns'],
    queryFn: listCampaigns,
  });

  const createBattleMutation = useMutation({
    mutationFn: async (name: string) => {
      return createStandaloneBattle({
        name: name.trim() || 'New Encounter',
        characters: [],
        adversaries: [],
        environments: [],
        spotlight: null,
        spotlightHistory: [],
        spotlightHistoryTimeline: [],
        rollHistory: [],
        currentRound: 1,
        fearPool: 0,
        useMassiveThreshold: false,
        notes: '',
        status: 'planning',
      });
    },
    onSuccess: battle => {
      setNewBattleName('');
      void queryClient.invalidateQueries({ queryKey: ['standalone-battles'] });
      // Navigate to battle tracker with this battle loaded
      void navigate({
        to: '/gm/battle-tracker',
        search: { battleId: battle.id },
      });
    },
    onError: () => {
      toast.error('Failed to create encounter');
    },
  });

  const deleteBattleMutation = useMutation({
    mutationFn: deleteStandaloneBattle,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['standalone-battles'] });
    },
    onError: () => {
      toast.error('Failed to delete encounter');
    },
  });

  const handleCreateBattle = () => {
    createBattleMutation.mutate(newBattleName);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleCreateBattle();
  };

  // Collect all campaign battles for the campaign section
  const campaignBattles = campaigns.flatMap(campaign =>
    (campaign.battles ?? []).map(battle => ({
      ...battle,
      campaignId: campaign.id,
      campaignName: campaign.name,
    }))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <span className="text-2xl font-bold">
          <Swords className="mr-2 inline-block size-6 text-red-500" />
          Combat Encounters
        </span>
        <p className="text-muted-foreground mt-2">
          Manage your combat encounters for one-off sessions or campaigns
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Standalone Encounters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Swords className="h-5 w-5 text-red-500" />
              Standalone Encounters
            </CardTitle>
            <CardDescription>
              Combat encounters not linked to any campaign
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Create new encounter */}
            <div className="flex gap-2">
              <Input
                placeholder="New encounter name..."
                value={newBattleName}
                onChange={e => setNewBattleName(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button
                onClick={handleCreateBattle}
                disabled={createBattleMutation.isPending}
              >
                <Plus className="mr-1 h-4 w-4" />
                {createBattleMutation.isPending ? 'Creating...' : 'Create'}
              </Button>
            </div>

            {/* List of standalone battles */}
            {isLoadingStandalone ? (
              <EncounterLoadingSkeleton />
            ) : standaloneBattles.length === 0 ? (
              <div className="text-muted-foreground py-4 text-center text-sm">
                No standalone encounters yet. Create one above!
              </div>
            ) : (
              <div className="space-y-2">
                {standaloneBattles.map(battle => (
                  <StandaloneEncounterItem
                    key={battle.id}
                    battle={battle}
                    onDelete={id => deleteBattleMutation.mutate(id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Campaign Encounters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-blue-500" />
              Campaign Encounters
            </CardTitle>
            <CardDescription>
              Combat encounters linked to your campaigns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingCampaigns ? (
              <EncounterLoadingSkeleton count={2} />
            ) : campaignBattles.length === 0 ? (
              <div className="space-y-4">
                <p className="text-muted-foreground text-center text-sm">
                  No campaign encounters yet.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/gm/campaigns">
                    <FolderOpen className="mr-2 h-4 w-4" />
                    View Campaigns
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {campaignBattles.map(battle => (
                  <CampaignEncounterItem
                    key={`${battle.campaignId}-${battle.id}`}
                    battle={battle}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
