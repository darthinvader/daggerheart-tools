/**
 * Homebrew Tab Content for Campaign Detail
 *
 * Displays and manages homebrew content linked to a campaign.
 */
import {
  Beaker,
  BookOpen,
  Home,
  Layers,
  Link2,
  Map,
  Package,
  Plus,
  Shield,
  Skull,
  Sword,
  Users,
} from 'lucide-react';
import { useCallback, useState } from 'react';

import { HomebrewFormDialog, HomebrewList } from '@/components/homebrew';
import { useAuth } from '@/components/providers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TabsContent } from '@/components/ui/tabs';
import {
  useCampaignHomebrewContent,
  useCreateHomebrewContent,
  useLinkHomebrewToCampaign,
  useMyHomebrewContent,
  useUnlinkHomebrewFromCampaign,
  useUpdateHomebrewContent,
} from '@/features/homebrew';
import type {
  HomebrewContent,
  HomebrewContentType,
  HomebrewVisibility,
} from '@/lib/schemas/homebrew';
import { getContentTypeLabel } from '@/lib/schemas/homebrew';

// Content type icons and colors
const CONTENT_TYPE_CONFIG: Record<
  HomebrewContentType,
  { icon: React.ElementType; color: string; bgColor: string }
> = {
  adversary: { icon: Skull, color: 'text-red-500', bgColor: 'bg-red-500/10' },
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
  class: { icon: Shield, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
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
  community: { icon: Home, color: 'text-teal-500', bgColor: 'bg-teal-500/10' },
  equipment: {
    icon: Sword,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  item: { icon: Package, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10' },
};

interface HomebrewTabContentProps {
  campaignId: string;
}

export function HomebrewTabContent({ campaignId }: HomebrewTabContentProps) {
  const { user } = useAuth();
  const { data: campaignResult, isLoading: loadingCampaign } =
    useCampaignHomebrewContent(campaignId);
  const { data: myResult, isLoading: loadingMy } = useMyHomebrewContent();

  const campaignHomebrew = campaignResult?.items ?? [];
  const myHomebrew = myResult?.items ?? [];

  const createMutation = useCreateHomebrewContent();
  const updateMutation = useUpdateHomebrewContent();
  const linkMutation = useLinkHomebrewToCampaign();
  const unlinkMutation = useUnlinkHomebrewFromCampaign();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [selectedType, setSelectedType] =
    useState<HomebrewContentType>('adversary');
  const [editingItem, setEditingItem] = useState<HomebrewContent | null>(null);

  // Homebrew from my collection that's not already linked
  const linkableHomebrew = myHomebrew.filter(
    item => !campaignHomebrew.some(linked => linked.id === item.id)
  );

  const handleCreate = useCallback((type: HomebrewContentType) => {
    setSelectedType(type);
    setEditingItem(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = useCallback((item: HomebrewContent) => {
    setSelectedType(item.contentType);
    setEditingItem(item);
    setIsFormOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (payload: {
      content: HomebrewContent['content'];
      visibility: HomebrewVisibility;
    }) => {
      const typedFormData = payload.content as {
        name: string;
      } & HomebrewContent['content'];
      if (editingItem) {
        await updateMutation.mutateAsync({
          id: editingItem.id,
          updates: {
            content: typedFormData,
            name: typedFormData.name,
            visibility: payload.visibility,
          },
        });
      } else {
        // Create new and immediately link to campaign
        await createMutation.mutateAsync({
          contentType: selectedType,
          content: typedFormData,
          name: typedFormData.name,
          description: '',
          tags: [],
          visibility: payload.visibility,
          campaignLinks: [campaignId],
        });
      }
      setIsFormOpen(false);
      setEditingItem(null);
    },
    [editingItem, selectedType, campaignId, createMutation, updateMutation]
  );

  const handleLink = useCallback(
    async (item: HomebrewContent) => {
      await linkMutation.mutateAsync({
        homebrewId: item.id,
        campaignId,
      });
      setIsLinkDialogOpen(false);
    },
    [campaignId, linkMutation, setIsLinkDialogOpen]
  );

  const handleUnlink = useCallback(
    async (item: HomebrewContent) => {
      if (confirm(`Remove "${item.name}" from this campaign?`)) {
        await unlinkMutation.mutateAsync({
          homebrewId: item.id,
          campaignId,
        });
      }
    },
    [campaignId, unlinkMutation]
  );

  return (
    <TabsContent value="homebrew" className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-semibold">
            <Beaker className="text-primary size-6" />
            Campaign Homebrew
          </h2>
          <p className="text-muted-foreground mt-1">
            Custom content available to players in this campaign
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsLinkDialogOpen(true)}>
            <Link2 className="mr-2 size-4" /> Link Existing
          </Button>
          <Button onClick={() => handleCreate('adversary')}>
            <Plus className="mr-2 size-4" /> Create New
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-primary/20 from-primary/5 to-primary/10 bg-linear-to-r">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Beaker className="text-primary size-5" />
            How Campaign Homebrew Works
          </CardTitle>
          <CardDescription className="text-sm">
            Content linked to this campaign will be available to players when
            building characters. Custom adversaries and environments can be used
            in the battle tracker. Players will see homebrew options alongside
            official content.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Linked Content */}
      <HomebrewList
        items={campaignHomebrew}
        isLoading={loadingCampaign}
        currentUserId={user?.id}
        onView={handleEdit}
        onEdit={handleEdit}
        onDelete={handleUnlink}
        onCreate={handleCreate}
        showCreateButton
        emptyMessage="No homebrew content linked to this campaign yet."
      />

      {/* Create/Edit Dialog */}
      <HomebrewFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        contentType={selectedType}
        initialData={editingItem ?? undefined}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        defaultVisibility="campaign_only"
      />

      {/* Link Existing Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="size-5" /> Link Existing Homebrew
            </DialogTitle>
            <DialogDescription>
              Select homebrew from your collection to make it available in this
              campaign.
            </DialogDescription>
          </DialogHeader>

          {loadingMy ? (
            <div className="text-muted-foreground py-8 text-center">
              Loading...
            </div>
          ) : linkableHomebrew.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="bg-muted flex size-16 items-center justify-center rounded-full">
                <Beaker className="text-muted-foreground size-8" />
              </div>
              <p className="text-muted-foreground">
                All your homebrew is already linked to this campaign, or you
                haven&apos;t created any yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {linkableHomebrew.map(item => {
                const config = CONTENT_TYPE_CONFIG[item.contentType];
                const TypeIcon = config.icon;
                return (
                  <Card
                    key={item.id}
                    className={`cursor-pointer border-l-4 transition-all hover:shadow-md ${config.bgColor.replace('/10', '/5')} hover:${config.bgColor}`}
                    style={{
                      borderLeftColor: `var(--${config.color.replace('text-', '')})`,
                    }}
                    onClick={() => handleLink(item)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-8 items-center justify-center rounded-lg ${config.bgColor}`}
                        >
                          <TypeIcon className={`size-4 ${config.color}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="truncate text-base">
                            {item.name}
                          </CardTitle>
                          <Badge
                            variant="secondary"
                            className={`mt-1 gap-1 text-xs ${config.bgColor} ${config.color}`}
                          >
                            <TypeIcon className="size-3" />
                            {getContentTypeLabel(item.contentType)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </TabsContent>
  );
}
