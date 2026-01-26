import { useQuery } from '@tanstack/react-query';
import {
  Heart,
  Loader2,
  Plus,
  Shield,
  Sparkles,
  Swords,
  User,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchCharacter } from '@/lib/api/characters';
import type { CampaignPlayer } from '@/lib/schemas/campaign';

import type { CharacterTracker, NewCharacterDraft } from './types';
import { characterRecordToTracker, DEFAULT_CHARACTER_DRAFT } from './utils';

interface CampaignCharacterDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  campaignPlayers: CampaignPlayer[];
  existingCharacterIds: string[];
  onAddCampaignCharacter: (tracker: CharacterTracker) => void;
  onAddManualCharacter: () => void;
  characterDraft: NewCharacterDraft;
  onDraftChange: (draft: NewCharacterDraft) => void;
}

export function CampaignCharacterDialog({
  isOpen,
  onOpenChange,
  campaignPlayers,
  existingCharacterIds,
  onAddCampaignCharacter,
  onAddManualCharacter,
  characterDraft,
  onDraftChange,
}: CampaignCharacterDialogProps) {
  const [loadingCharacterId, setLoadingCharacterId] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<'campaign' | 'manual'>('campaign');

  // Filter players with character IDs that haven't been added yet
  const availablePlayers = campaignPlayers.filter(
    player =>
      player.characterId && !existingCharacterIds.includes(player.characterId)
  );

  const handleAddFromCampaign = async (characterId: string) => {
    setLoadingCharacterId(characterId);
    try {
      const character = await fetchCharacter(characterId);
      const tracker = characterRecordToTracker(character);
      onAddCampaignCharacter(tracker);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to load character:', error);
    } finally {
      setLoadingCharacterId(null);
    }
  };

  const handleAddManual = () => {
    onAddManualCharacter();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Character to Battle</DialogTitle>
          <DialogDescription>
            Add a player character from the campaign or create a custom entry.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={v => setActiveTab(v as 'campaign' | 'manual')}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="campaign" className="gap-2">
              <User className="size-4" />
              Campaign Players
              {availablePlayers.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {availablePlayers.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="manual" className="gap-2">
              <Plus className="size-4" />
              Manual Entry
            </TabsTrigger>
          </TabsList>

          <TabsContent value="campaign" className="mt-4">
            {availablePlayers.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center">
                <User className="mx-auto mb-2 size-8 opacity-50" />
                <p>No campaign characters available</p>
                <p className="text-sm">
                  All players are either already in battle or don't have
                  characters assigned.
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[400px] pr-3">
                <div className="space-y-3">
                  {availablePlayers.map(player => (
                    <CampaignCharacterCard
                      key={player.id}
                      player={player}
                      isLoading={loadingCharacterId === player.characterId}
                      onAdd={() =>
                        player.characterId &&
                        handleAddFromCampaign(player.characterId)
                      }
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="manual" className="mt-4">
            <ManualCharacterForm
              draft={characterDraft}
              onDraftChange={onDraftChange}
              onAdd={handleAddManual}
              onCancel={() => {
                onDraftChange(DEFAULT_CHARACTER_DRAFT);
                onOpenChange(false);
              }}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

interface CampaignCharacterCardProps {
  player: CampaignPlayer;
  isLoading: boolean;
  onAdd: () => void;
}

function CampaignCharacterCard({
  player,
  isLoading,
  onAdd,
}: CampaignCharacterCardProps) {
  // Fetch character details for preview (no staleTime to always get fresh data)
  const { data: character, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['character-preview', player.characterId],
    queryFn: () => fetchCharacter(player.characterId!),
    enabled: Boolean(player.characterId),
    staleTime: 0, // Always fetch fresh data
  });

  // Calculate stats if character is loaded
  const tracker = character ? characterRecordToTracker(character) : null;

  // Use fetched character name (fresh) or fall back to cached name
  const characterName =
    character?.identity?.name ||
    player.characterName ||
    player.name ||
    'Unknown Character';

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{characterName}</CardTitle>
            <CardDescription className="text-xs">
              {character?.classDraft?.className || 'Loading...'}
              {character?.classDraft?.subclassName &&
                ` · ${character.classDraft.subclassName}`}
            </CardDescription>
          </div>
          <Button
            size="sm"
            onClick={onAdd}
            disabled={isLoading || isLoadingDetails}
          >
            {isLoading ? (
              <Loader2 className="mr-1 size-4 animate-spin" />
            ) : (
              <Plus className="mr-1 size-4" />
            )}
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoadingDetails ? (
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Loader2 className="size-4 animate-spin" />
            Loading character stats...
          </div>
        ) : tracker ? (
          <div className="space-y-3">
            {/* Stats row */}
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-1">
                <Heart className="text-destructive size-4" />
                <span className="font-medium">{tracker.hp.max}</span>
                <span className="text-muted-foreground">HP</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="size-4 text-purple-500" />
                <span className="font-medium">{tracker.stress.max}</span>
                <span className="text-muted-foreground">Stress</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="size-4 text-blue-500" />
                <span className="font-medium">{tracker.evasion}</span>
                <span className="text-muted-foreground">Evasion</span>
              </div>
              {tracker.armorScore && tracker.armorScore > 0 && (
                <div className="flex items-center gap-1">
                  <Swords className="size-4 text-amber-500" />
                  <span className="font-medium">{tracker.armorScore}</span>
                  <span className="text-muted-foreground">Armor</span>
                </div>
              )}
            </div>

            {/* Cards preview */}
            {tracker.loadout && tracker.loadout.length > 0 && (
              <div>
                <p className="text-muted-foreground mb-1.5 text-xs font-medium">
                  Active Cards ({tracker.loadout.length})
                </p>
                <div className="flex flex-wrap gap-1">
                  {tracker.loadout.slice(0, 5).map((card, index) => (
                    <Badge
                      key={`${card.name}-${index}`}
                      variant="secondary"
                      className="text-xs"
                    >
                      {card.name}
                    </Badge>
                  ))}
                  {tracker.loadout.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{tracker.loadout.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

interface ManualCharacterFormProps {
  draft: NewCharacterDraft;
  onDraftChange: (draft: NewCharacterDraft) => void;
  onAdd: () => void;
  onCancel: () => void;
}

function ManualCharacterForm({
  draft,
  onDraftChange,
  onAdd,
  onCancel,
}: ManualCharacterFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Name</label>
        <input
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          value={draft.name}
          onChange={event =>
            onDraftChange({ ...draft, name: event.target.value })
          }
          placeholder="Character name"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Evasion</label>
          <input
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            type="number"
            value={draft.evasion}
            onChange={event =>
              onDraftChange({ ...draft, evasion: event.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">HP Max</label>
          <input
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            type="number"
            value={draft.hpMax}
            onChange={event =>
              onDraftChange({ ...draft, hpMax: event.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Stress Max</label>
          <input
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            type="number"
            value={draft.stressMax}
            onChange={event =>
              onDraftChange({ ...draft, stressMax: event.target.value })
            }
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onAdd} disabled={!draft.name.trim()}>
          Add Character
        </Button>
      </div>
    </div>
  );
}
