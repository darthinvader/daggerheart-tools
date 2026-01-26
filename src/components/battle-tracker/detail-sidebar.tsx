import { History, Info, Sparkles, Swords, TreePine, User } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { SelectedItemDetails } from './detail-panels';
import type {
  AdversaryTracker,
  CharacterTracker,
  EnvironmentTracker,
  TrackerItem,
  TrackerSelection,
} from './types';

interface DetailSidebarProps {
  item: TrackerItem | null;
  spotlight: TrackerSelection | null;
  spotlightHistory: TrackerSelection[];
  characters: CharacterTracker[];
  adversaries: AdversaryTracker[];
  environments: EnvironmentTracker[];
  useMassiveThreshold: boolean;
  onClearSpotlight: () => void;
  onSetSpotlight: (s: TrackerSelection) => void;
  onCharacterChange: (
    id: string,
    fn: (c: CharacterTracker) => CharacterTracker
  ) => void;
  onAdversaryChange: (
    id: string,
    fn: (a: AdversaryTracker) => AdversaryTracker
  ) => void;
  onEnvironmentChange: (
    id: string,
    fn: (e: EnvironmentTracker) => EnvironmentTracker
  ) => void;
}

export function DetailSidebar({
  item,
  spotlight,
  spotlightHistory,
  characters,
  adversaries,
  environments,
  useMassiveThreshold,
  onClearSpotlight,
  onSetSpotlight,
  onCharacterChange,
  onAdversaryChange,
  onEnvironmentChange,
}: DetailSidebarProps) {
  const getSpotlightName = (s: TrackerSelection) => {
    if (s.kind === 'character') {
      return characters.find(c => c.id === s.id)?.name ?? '—';
    }
    if (s.kind === 'adversary') {
      return adversaries.find(a => a.id === s.id)?.source.name ?? '—';
    }
    return environments.find(e => e.id === s.id)?.source.name ?? '—';
  };

  return (
    <Card className="border-muted-foreground/20 flex h-[calc(100vh-200px)] min-h-125 flex-col border-2">
      <CardHeader className="from-muted/50 to-background flex-none border-b bg-gradient-to-r py-3">
        <div className="flex items-center gap-2">
          <Info className="text-primary size-4" />
          <CardTitle className="text-base">Details</CardTitle>
        </div>
        <CardDescription>
          Select an item to view full information
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="space-y-4 p-4">
            <SpotlightSection
              spotlight={spotlight}
              spotlightHistory={spotlightHistory}
              getSpotlightName={getSpotlightName}
              onClear={onClearSpotlight}
              onSelect={onSetSpotlight}
            />
            <Separator />
            {item ? (
              <SelectedItemDetails
                item={item}
                useMassiveThreshold={useMassiveThreshold}
                onCharacterChange={onCharacterChange}
                onAdversaryChange={onAdversaryChange}
                onEnvironmentChange={onEnvironmentChange}
              />
            ) : (
              <div className="text-muted-foreground py-8 text-center">
                <Info className="mx-auto mb-2 size-8 opacity-50" />
                <p className="text-sm">Select an item from the roster</p>
                <p className="mt-1 text-xs">
                  Click on a character, adversary, or environment
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function SpotlightSection({
  spotlight,
  spotlightHistory,
  getSpotlightName,
  onClear,
  onSelect,
}: {
  spotlight: TrackerSelection | null;
  spotlightHistory: TrackerSelection[];
  getSpotlightName: (s: TrackerSelection) => string;
  onClear: () => void;
  onSelect: (s: TrackerSelection) => void;
}) {
  const kindIcons: Record<string, React.ReactNode> = {
    character: <User className="size-3 text-blue-500" />,
    adversary: <Swords className="size-3 text-red-500" />,
    environment: <TreePine className="size-3 text-emerald-500" />,
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-amber-500" />
          <span className="text-sm font-semibold">Spotlight</span>
        </div>
        {spotlight && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onClear}
            className="h-6 text-xs"
          >
            Clear
          </Button>
        )}
      </div>
      {spotlight ? (
        <div className="rounded-lg border-2 border-amber-400/50 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 p-3">
          <div className="flex items-center gap-2">
            {kindIcons[spotlight.kind]}
            <span className="font-semibold text-amber-700 dark:text-amber-400">
              {getSpotlightName(spotlight)}
            </span>
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            Currently in the spotlight
          </p>
        </div>
      ) : (
        <div className="border-muted-foreground/30 bg-muted/30 rounded-lg border-2 border-dashed p-3 text-center">
          <p className="text-muted-foreground text-xs">No spotlight set</p>
          <p className="text-muted-foreground mt-1 text-[10px]">
            Click the ★ button on any item
          </p>
        </div>
      )}
      {spotlightHistory.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <History className="text-muted-foreground size-3" />
            <span className="text-muted-foreground text-xs">History</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {spotlightHistory.map(s => (
              <TooltipProvider key={`${s.kind}-${s.id}`}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className="hover:bg-accent flex cursor-pointer items-center gap-1 text-xs"
                      onClick={() => onSelect(s)}
                    >
                      {kindIcons[s.kind]}
                      {getSpotlightName(s)}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to spotlight again</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
