import { useQuery } from '@tanstack/react-query';
import { Heart, Loader2, Plus, Shield, Sparkles, Swords } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { fetchCharacter } from '@/lib/api/characters';
import type { CampaignPlayer } from '@/lib/schemas/campaign';

import type { CharacterTracker } from './types';
import { characterRecordToTracker } from './utils';

// ============== Stat Display Config ==============
type StatDisplayConfig = {
  key: string;
  icon: typeof Heart;
  label: string;
  iconClass: string;
  getValue: (tracker: CharacterTracker) => number | null | undefined;
  showIf?: (tracker: CharacterTracker) => boolean;
};

const STAT_DISPLAY_CONFIG: StatDisplayConfig[] = [
  {
    key: 'hp',
    icon: Heart,
    label: 'HP',
    iconClass: 'text-destructive',
    getValue: tracker => tracker.hp.max,
  },
  {
    key: 'stress',
    icon: Sparkles,
    label: 'Stress',
    iconClass: 'text-purple-500',
    getValue: tracker => tracker.stress.max,
  },
  {
    key: 'evasion',
    icon: Shield,
    label: 'Evasion',
    iconClass: 'text-blue-500',
    getValue: tracker => tracker.evasion,
  },
  {
    key: 'armor',
    icon: Swords,
    label: 'Armor',
    iconClass: 'text-amber-500',
    getValue: tracker => tracker.armorScore,
    showIf: tracker => !!tracker.armorScore && tracker.armorScore > 0,
  },
];

function CharacterStatsRow({ tracker }: { tracker: CharacterTracker }) {
  return (
    <div className="flex flex-wrap gap-3 text-sm">
      {STAT_DISPLAY_CONFIG.map(
        ({ key, icon: Icon, label, iconClass, getValue, showIf }) => {
          if (showIf && !showIf(tracker)) return null;
          return (
            <div key={key} className="flex items-center gap-1">
              <Icon className={`size-4 ${iconClass}`} />
              <span className="font-medium">{getValue(tracker)}</span>
              <span className="text-muted-foreground">{label}</span>
            </div>
          );
        }
      )}
    </div>
  );
}

function CharacterLoadoutPreview({
  loadout,
}: {
  loadout: CharacterTracker['loadout'];
}) {
  if (!loadout || loadout.length === 0) return null;
  return (
    <div>
      <p className="text-muted-foreground mb-1.5 text-xs font-medium">
        Active Cards ({loadout.length})
      </p>
      <div className="flex flex-wrap gap-1">
        {loadout.slice(0, 5).map((card, index) => (
          <Badge
            key={`${card.name}-${index}`}
            variant="secondary"
            className="text-xs"
          >
            {card.name}
          </Badge>
        ))}
        {loadout.length > 5 && (
          <Badge variant="outline" className="text-xs">
            +{loadout.length - 5} more
          </Badge>
        )}
      </div>
    </div>
  );
}

function CampaignCharacterHeader({
  characterName,
  className,
  subclassName,
  isLoading,
  isLoadingDetails,
  onAdd,
}: {
  characterName: string;
  className?: string;
  subclassName?: string;
  isLoading: boolean;
  isLoadingDetails: boolean;
  onAdd: () => void;
}) {
  return (
    <CardHeader className="pb-2">
      <div className="flex items-start justify-between">
        <div>
          <CardTitle className="text-base">{characterName}</CardTitle>
          <CardDescription className="text-xs">
            {className || 'Loading...'}
            {subclassName && ` · ${subclassName}`}
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
  );
}

function CampaignCharacterBody({
  isLoadingDetails,
  tracker,
}: {
  isLoadingDetails: boolean;
  tracker: CharacterTracker | null;
}) {
  if (isLoadingDetails) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Loader2 className="size-4 animate-spin" />
        Loading character stats...
      </div>
    );
  }

  if (!tracker) return null;

  return (
    <div className="space-y-3">
      <CharacterStatsRow tracker={tracker} />
      <CharacterLoadoutPreview loadout={tracker.loadout} />
    </div>
  );
}

interface CampaignCharacterCardProps {
  player: CampaignPlayer;
  isLoading: boolean;
  onAdd: () => void;
}

export function CampaignCharacterCard({
  player,
  isLoading,
  onAdd,
}: CampaignCharacterCardProps) {
  const { data: character, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['character-preview', player.characterId],
    queryFn: () => fetchCharacter(player.characterId!),
    enabled: Boolean(player.characterId),
    staleTime: 0,
  });

  const tracker = character ? characterRecordToTracker(character) : null;
  const characterName =
    character?.identity?.name ||
    player.characterName ||
    player.name ||
    'Unknown Character';

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CampaignCharacterHeader
        characterName={characterName}
        className={character?.classDraft?.className}
        subclassName={character?.classDraft?.subclassName}
        isLoading={isLoading}
        isLoadingDetails={isLoadingDetails}
        onAdd={onAdd}
      />
      <CardContent className="pt-0">
        <CampaignCharacterBody
          isLoadingDetails={isLoadingDetails}
          tracker={tracker}
        />
      </CardContent>
    </Card>
  );
}
