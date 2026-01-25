/* eslint-disable max-lines */
// GM Tools Panel - collection of GM helper tools

import {
  ArrowRight,
  Dice5,
  Flag,
  HelpCircle,
  Lightbulb,
  MapPin,
  Plus,
  Target,
  Trash2,
  User,
} from 'lucide-react';
import { useState } from 'react';

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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const RANDOM_NPC_NAMES = [
  'Aldric the Bold',
  'Brynn of the Vale',
  'Caspian Nightwind',
  'Della Ironhand',
  'Eldrin Shadowmere',
  'Fira Brightspear',
  'Gundren Rockseeker',
  'Helena Stormborn',
  'Ignis Flameheart',
  'Jorath the Wise',
  'Kira Swiftblade',
  'Lysander Moonwhisper',
  'Morgana Duskweaver',
  'Nyx Thornwood',
  'Osric the Grey',
  'Petra Stoneheart',
];

const RANDOM_LOCATIONS = [
  'The Crooked Lantern Inn',
  'Blackwater Crossing',
  'The Gilded Serpent Tavern',
  'Thornwood Cemetery',
  'The Sunken Temple',
  'Mistfall Bridge',
  'The Shattered Gate',
  'Ironforge Mines',
  'The Whispering Woods',
  'Crimson Harbor',
  'The Dusty Road Market',
  'Moonlit Clearing',
  'The Forgotten Library',
  'Stormwatch Tower',
  'The Deep Hollow',
];

const RANDOM_HOOKS = [
  'A mysterious stranger offers a map to buried treasure',
  'Strange lights have been seen in the old ruins at night',
  'A merchant begs for help finding their missing child',
  'The local lord has posted a bounty on a dangerous beast',
  'An ancient artifact was stolen from the temple',
  'Travelers report seeing ghosts on the old trade road',
  'A sealed letter arrives with no sender',
  'The harvest has failed and dark omens are seen',
];

const IMPROV_PROMPTS = [
  'What does the room smell like?',
  'What unexpected sound catches their attention?',
  'What small detail makes this NPC memorable?',
  'What obstacle could complicate their plan?',
  'Who else might be interested in this quest?',
  'What rumor is going around about this place?',
  'What does this character want right now?',
  'What would make this scene more dramatic?',
];

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

interface GMToolsPanelProps {
  campaignId: string;
  onAddNPC: (name: string) => Promise<void>;
  onAddLocation: (name: string) => Promise<void>;
  onAddQuest: (title: string) => Promise<void>;
  onNavigateToTab: (tab: string) => void;
  checklistItems: ChecklistItem[];
  onChecklistChange: (items: ChecklistItem[]) => void;
}

export function GMToolsPanel({
  campaignId: _campaignId,
  onAddNPC,
  onAddLocation,
  onAddQuest,
  onNavigateToTab,
  checklistItems,
  onChecklistChange,
}: GMToolsPanelProps) {
  const [randomResult, setRandomResult] = useState<{
    value: string;
    type: 'npc' | 'location' | 'quest';
  } | null>(null);
  const [improv, setImprov] = useState<string>('');
  const [adding, setAdding] = useState(false);
  const [newChecklistItem, setNewChecklistItem] = useState('');

  const rollRandom = (list: string[], type: 'npc' | 'location' | 'quest') => {
    const result = list[Math.floor(Math.random() * list.length)];
    setRandomResult({ value: result, type });
    return result;
  };

  const handleAddAndGo = async () => {
    if (!randomResult || adding) return;
    setAdding(true);
    try {
      if (randomResult.type === 'npc') {
        await onAddNPC(randomResult.value);
        onNavigateToTab('characters');
      } else if (randomResult.type === 'location') {
        await onAddLocation(randomResult.value);
        onNavigateToTab('locations');
      } else if (randomResult.type === 'quest') {
        await onAddQuest(randomResult.value);
        onNavigateToTab('quests');
      }
      setRandomResult(null);
    } finally {
      setAdding(false);
    }
  };

  const getImprovPrompt = () => {
    const prompt =
      IMPROV_PROMPTS[Math.floor(Math.random() * IMPROV_PROMPTS.length)];
    setImprov(prompt);
  };

  const getTypeLabel = (type: 'npc' | 'location' | 'quest') => {
    switch (type) {
      case 'npc':
        return 'Character';
      case 'location':
        return 'Location';
      case 'quest':
        return 'Quest';
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Dice5 className="h-4 w-4 text-purple-500" />
            Random Generators
          </CardTitle>
          <CardDescription>Quick inspiration when you need it</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => rollRandom(RANDOM_NPC_NAMES, 'npc')}
                >
                  <User className="mr-1 h-3 w-3" />
                  NPC Name
                </Button>
              </TooltipTrigger>
              <TooltipContent>Generate a random NPC name</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => rollRandom(RANDOM_LOCATIONS, 'location')}
                >
                  <MapPin className="mr-1 h-3 w-3" />
                  Location
                </Button>
              </TooltipTrigger>
              <TooltipContent>Generate a random location name</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => rollRandom(RANDOM_HOOKS, 'quest')}
                >
                  <Target className="mr-1 h-3 w-3" />
                  Plot Hook
                </Button>
              </TooltipTrigger>
              <TooltipContent>Generate a random plot hook</TooltipContent>
            </Tooltip>
          </div>
          {randomResult && (
            <div className="bg-muted space-y-2 rounded-lg p-3">
              <p className="text-sm font-medium">{randomResult.value}</p>
              <Button
                size="sm"
                onClick={handleAddAndGo}
                disabled={adding}
                className="w-full"
              >
                {adding ? (
                  'Adding...'
                ) : (
                  <>
                    Add as {getTypeLabel(randomResult.type)}
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            Improv Helper
          </CardTitle>
          <CardDescription>Prompts to spark your imagination</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            onClick={getImprovPrompt}
            className="w-full"
          >
            Get a Prompt
          </Button>
          {improv && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                {improv}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <HelpCircle className="h-4 w-4 text-blue-500" />
            Quick Reference
          </CardTitle>
          <CardDescription>
            Common Daggerheart rules at a glance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="bg-muted/50 rounded-md p-2">
              <p className="text-xs font-semibold">Fear/Hope Dice</p>
              <p className="text-muted-foreground text-xs">
                Higher Fear = GM makes a Fear move. Higher Hope = Player
                succeeds with Hope.
              </p>
            </div>
            <div className="bg-muted/50 rounded-md p-2">
              <p className="text-xs font-semibold">Stress</p>
              <p className="text-muted-foreground text-xs">
                Clear 1 Stress per Short Rest. Clear all on Long Rest.
              </p>
            </div>
            <div className="bg-muted/50 rounded-md p-2">
              <p className="text-xs font-semibold">Armor Slots</p>
              <p className="text-muted-foreground text-xs">
                Mark when hit to reduce damage. Clear on rest.
              </p>
            </div>
            <div className="bg-muted/50 rounded-md p-2">
              <p className="text-xs font-semibold">Death&apos;s Door</p>
              <p className="text-muted-foreground text-xs">
                At 0 HP, you&apos;re dying. Roll with Death each turn.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Flag className="h-4 w-4 text-green-500" />
            Session Prep Checklist
          </CardTitle>
          <CardDescription>
            Don&apos;t forget before the session starts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="mb-2 flex gap-2 border-b pb-2">
              <Input
                placeholder="Add new item..."
                value={newChecklistItem}
                onChange={e => setNewChecklistItem(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && newChecklistItem.trim()) {
                    onChecklistChange([
                      {
                        id: crypto.randomUUID(),
                        text: newChecklistItem.trim(),
                        checked: false,
                      },
                      ...checklistItems,
                    ]);
                    setNewChecklistItem('');
                  }
                }}
                className="text-sm"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (newChecklistItem.trim()) {
                    onChecklistChange([
                      {
                        id: crypto.randomUUID(),
                        text: newChecklistItem.trim(),
                        checked: false,
                      },
                      ...checklistItems,
                    ]);
                    setNewChecklistItem('');
                  }
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {checklistItems.map(item => (
              <div key={item.id} className="group flex items-center gap-2">
                <label className="flex flex-1 items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={item.checked}
                    onChange={e => {
                      onChecklistChange(
                        checklistItems.map(i =>
                          i.id === item.id
                            ? { ...i, checked: e.target.checked }
                            : i
                        )
                      );
                    }}
                  />
                  <span
                    className={
                      item.checked ? 'text-muted-foreground line-through' : ''
                    }
                  >
                    {item.text}
                  </span>
                </label>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => {
                    onChecklistChange(
                      checklistItems.filter(i => i.id !== item.id)
                    );
                  }}
                >
                  <Trash2 className="text-destructive h-3 w-3" />
                </Button>
              </div>
            ))}
            {checklistItems.length === 0 && (
              <p className="text-muted-foreground text-sm italic">
                No items yet. Add your first checklist item above.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
