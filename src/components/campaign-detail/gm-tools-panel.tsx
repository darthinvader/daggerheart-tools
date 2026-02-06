// GM Tools Panel - collection of GM helper tools

import { Link } from '@tanstack/react-router';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Clock,
  Cloud,
  Compass,
  Dice5,
  Dices,
  ExternalLink,
  Eye,
  Flag,
  Gem,
  Heart,
  HelpCircle,
  Lightbulb,
  MapPin,
  MessageCircle,
  Pause,
  Play,
  Plus,
  Scroll,
  Search,
  Shield,
  ShieldCheck,
  StickyNote,
  Swords,
  Target,
  Theater,
  Timer,
  Trash2,
  User,
  Users,
  UtensilsCrossed,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

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
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { BattleState } from '@/lib/schemas/battle';

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
  'Ravenna Ashveil',
  'Silas Frostweaver',
  'Theron Copperfield',
  'Uma Windchaser',
  'Vex Blackthorn',
  'Wren Emberly',
  'Xara Driftwood',
  'Yorick Hollowbone',
  'Zara Sunforge',
  'Bael the Unbroken',
  'Calista Ravensong',
  'Dorin Ashwalker',
  'Eira Dewfall',
  'Fenwick Greymane',
  'Ghilanna Thornleaf',
  'Harlan Saltmarsh',
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
  'Amber Lantern Waystation',
  'The Bone Orchard',
  'Cinderspire Ruins',
  'Dewdrop Grotto',
  'The Echoing Chasm',
  'Fellmoor Marshes',
  'The Glass Garden',
  'Howling Crest Pass',
  'The Iron Tankard',
  'Jade Lotus Bathhouse',
  'Kitefall Lookout',
  'The Last Hearth',
  'Mosscreek Village',
  'Nightbloom Cavern',
  'The Obsidian Spire',
  "Pilgrim's Rest Shrine",
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
  'An old friend sends a desperate plea for help',
  'A dying soldier mutters coordinates before expiring',
  'The river has turned an unnatural color overnight',
  'A previously sealed dungeon entrance has opened',
  'A rival adventuring party claims the same quest',
  'The local tavern is unusually empty — everyone is afraid',
  'A cosmic event illuminates a hidden path',
  'Refugees arrive bearing tales of a fallen kingdom',
];

const RANDOM_NPC_TRAITS = [
  'Speaks in riddles and never gives a straight answer',
  'Constantly fidgets with a lucky coin',
  'Has an infectious laugh that puts everyone at ease',
  'Distrusts magic users on principle',
  'Collects odd trinkets and refuses to explain why',
  'Refers to themselves in the third person',
  'Always smells faintly of cinnamon and sage',
  'Has an elaborate tattoo with a hidden meaning',
  'Whistles the same melody when nervous',
  'Tells wildly exaggerated stories about their past',
  'Is unfailingly polite, even to enemies',
  'Has a habit of quoting deceased relatives',
];

const RANDOM_COMPLICATIONS = [
  'An NPC the party trusts reveals a hidden agenda',
  'The ground begins to shake — something stirs beneath',
  'A rival faction arrives claiming the same objective',
  "A PC's backstory connection walks through the door",
  'The exit is suddenly blocked or destroyed',
  'An ally is captured, poisoned, or goes missing',
  'Weather shifts dramatically — storm, fog, or unnatural darkness',
  'A countdown clock appears: something terrible in 3 rounds',
  'The enemy reveals they were expecting the party',
  "A moral dilemma splits the party's loyalties",
  'An environmental hazard activates — fire, flooding, collapse',
  'Reinforcements arrive for the opposition',
  'A critical item breaks, is stolen, or stops working',
  'An innocent bystander is caught in the crossfire',
  'The rules of the environment suddenly change',
  "A powerful entity takes notice of the party's actions",
];

const RANDOM_ENCOUNTERS = [
  'A group of traveling merchants are being harassed by bandits on the road',
  'Strange lights flickering in the distance — investigation reveals a corrupted nature spirit',
  'A bridge troll demands a toll — but accepts stories instead of gold',
  'A rival adventuring party claims the same bounty as the players',
  'Villagers report livestock vanishing at night; tracks lead to an old mine',
  'A wounded courier stumbles into camp with an urgent message and pursuers close behind',
  'The road is blocked by a fallen tree — but it was placed deliberately as an ambush',
  'A hermit sage offers information in exchange for completing a dangerous errand',
  'Unexplained earthquakes shake the region; locals blame an ancient creature stirring',
  'A festival in town is disrupted when the guest of honor is found dead',
  'A magical storm forces the party to seek shelter in a mysterious ruin',
  'A child asks for help finding their lost pet — which turns out to be something dangerous',
  'An overturned cart on the road contains suspicious cargo',
  'The party stumbles upon a hidden shrine with a puzzle lock',
  'Scouts report enemy forces mobilizing nearby',
  'A mysterious stranger offers the party a map to a legendary treasure',
];

const RANDOM_WEATHER = [
  'Thick fog rolls in — visibility drops to Close range',
  'Torrential downpour — disadvantage on ranged attacks, tracks wash away',
  'Scorching heat — exhaustion risk on long travel, seek shade',
  'Bitter cold wind — exposed characters take 1 stress per hour',
  'Perfect calm — an unsettling stillness, too quiet',
  'Rolling thunderstorm — lightning strikes illuminate the battlefield',
  'Light drizzle — damp and gloomy, but manageable',
  'Blizzard conditions — movement costs double, navigation checks required',
  'Eerie magical aurora — spells feel stronger but unpredictable',
  'Ash fall from distant volcanic activity — air quality worsens',
  'Strong crosswinds — projectiles veer off course',
  'Dense wildfire smoke — choking hazard, limited vision',
  'Sudden hailstorm — seek cover or take minor damage',
  'Clear starlit night — excellent visibility, but so are you',
  'Unnatural darkness — even torches seem dimmer than usual',
  'Humid and oppressive — armor feels heavier, tempers flare',
];

const RANDOM_RUMORS = [
  'They say the old lighthouse keeper has been seen walking the cliffs at night — but he died years ago',
  'A merchant caravan vanished on the north road. Guards found the wagons but no people',
  "The duke's advisor has been holding secret meetings with someone from across the border",
  "Strange symbols have been appearing on buildings overnight — no one knows who's painting them",
  "A healer in the lower district can cure anything — for a price that isn't gold",
  'The mines were shut down after workers reported hearing singing from deep underground',
  "Someone's been buying up all the silver in town. Every last piece",
  'A child in the village claims to remember a past life as a great warrior',
  "The harvest festival has been canceled — the elders won't say why",
  "There's a bounty on a creature in the forest, but every hunter who's gone after it has come back... different",
  "The river changed color for three days last month. Fish won't come near it anymore",
  "An old map was found in the library walls during renovation — it shows a building that doesn't exist yet",
  "A traveling bard keeps asking questions about the town's founding. Too many questions",
  'The graveyard keeper says one of the graves was dug up from the inside',
  'Ships in the harbor are reporting lights beneath the water at night',
  "The blacksmith's apprentice forged a blade that won't stop humming",
];

const RANDOM_QUEST_HOOKS = [
  'A village elder asks the party to investigate disappearances near an ancient ruin',
  'A sealed door in a dungeon has been open for the first time in centuries',
  'A noble hires the party to retrieve a stolen heirloom — but the thief claims it was theirs first',
  'Strange creatures are emerging from a rift in the wilderness',
  "A dying warrior entrusts the party with delivering a message to someone they've never heard of",
  "The local temple's relic has stopped working, and the priests are panicking",
  'A rival faction offers the party a dangerous alliance against a common enemy',
  "Miners struck something underground that's now making people sick",
  'A ghost ship appears in the harbor once per year — tonight is the night',
  'A powerful artifact is being auctioned, and multiple factions want it',
  "The party discovers a map in a dead adventurer's pack leading to uncharted territory",
  'A peaceful creature the party befriended is being hunted by poachers',
  'The local ruler has been replaced by an imposter — only the party seems to notice',
  'A prophecy names one of the party members, and people have started showing up',
  "An old ally sends word they're in trouble but the message is three weeks old",
  'The party finds a door that only appears during a full moon',
];

const RANDOM_LOOT = [
  'A pouch of gold coins (2 Handfuls) hidden in a false-bottom chest',
  'An ornate dagger with a gemstone pommel — worth 1 Bag to the right buyer',
  'A healing potion that restores 1d8 Hit Points',
  'A torn map fragment pointing to a larger treasure',
  'A silver locket containing a portrait — someone might be looking for this',
  'A bundle of rare herbs useful for crafting or trade (1 Handful)',
  'An enchanted cloak that glimmers faintly — grants advantage on stealth once per rest',
  "A sealed letter with a noble's wax seal — could be leverage or trouble",
  "A set of thieves' tools of exceptional quality",
  'A mysterious key that hums faintly when pointed north',
  'A bag of precious gemstones (1 Bag) from a collapsed mine',
  'A journal detailing the location of a hidden vault',
  'A finely crafted shield bearing an unknown house crest',
  'A vial of alchemical fire — can be thrown to deal 2d6 damage in Close range',
  'A music box that plays a haunting melody — NPCs find it captivating',
  'An ancient coin from a fallen empire — a collector would pay well',
];

const RANDOM_MOTIVATIONS = [
  'Protect their family from a looming threat',
  'Amass enough wealth to buy their freedom',
  "Seek revenge for a betrayal they can't forgive",
  "Find a cure for a loved one's mysterious illness",
  'Prove their worth to a disapproving parent',
  'Uncover the truth about their mysterious heritage',
  'Atone for a terrible mistake from their past',
  'Rise to power by any means necessary',
  'Preserve a dying tradition or way of life',
  'Escape the consequences of a crime they committed',
  'Fulfill a promise made to someone who has passed',
  'Discover what lies beyond the known world',
  'Build a legacy that will outlast them',
  'Protect a dangerous secret from falling into the wrong hands',
  'Win the affection of someone who barely knows they exist',
  'Repay an impossible debt before time runs out',
];

const RANDOM_SETTINGS = [
  'A dimly lit tavern with low-hanging smoke, a crackling fireplace, and a one-eyed bartender polishing a cracked glass',
  "An overgrown garden maze where the hedges seem to shift when you're not looking",
  'A bustling marketplace where every stall sells something slightly unsettling',
  'A crumbling stone bridge spanning a gorge with swirling mist below',
  'An abandoned library with books that whisper when you walk past the shelves',
  'A sun-drenched meadow with strange crystalline flowers that chime in the wind',
  'A narrow cave tunnel with bioluminescent fungi casting an eerie blue glow',
  'A grand throne room, empty except for cobwebs and a single throne facing the wrong direction',
  'A dense forest clearing with a ring of mushrooms and the faint sound of music',
  'A seaside cliff with crashing waves, salt spray, and the wreck of a ship below',
  "A cramped alchemist's shop overflowing with bubbling potions and strange smells",
  'A frozen lake with something large and dark visible beneath the ice',
  'A ruined watchtower at a crossroads, its signal fire still smoldering',
  'A hidden grotto behind a waterfall with ancient carvings on every surface',
  'A battlefield aftermath — broken weapons, torn banners, and an unnatural silence',
  'A floating island connected to the mainland by a chain bridge swaying in the wind',
];

const RANDOM_TAVERN = [
  'The Sleeping Griffin — a cozy inn run by a retired adventurer, famous for its honey mead and the griffin skull mounted above the bar',
  'The Rusty Anchor — a dockside dive with cheap ale, arm-wrestling contests, and a mysterious locked door in the cellar',
  'The Golden Acorn — an elven-run establishment with living-wood furniture, enchanted music, and a menu of foraged delicacies',
  'The Broken Crown — once-noble tavern fallen on hard times, the owner tells tales of lost glory and offers quests for coin',
  "The Wanderer's Rest — a crossroads inn where every traveler leaves a carved token on the Wall of Journeys",
  'The Ember Hearth — a dwarven brewhouse built into a hillside, with stone-brewed dark ales and a rune-heated forge-oven',
  'The Laughing Lantern — a gnomish pub where the drinks glow, the seats spin, and the entertainment is always "experimental"',
  'The Crimson Chalice — an upscale wine bar with a hidden back room where information brokers ply their trade',
  'The Thorn & Thistle — a druidic tea house in a converted greenhouse, serving herbal remedies and prophecy readings',
  'The Last Tankard — a rough-and-tumble fighting pit doubling as a bar, where disputes are settled with fists',
  'The Moonlit Canopy — a treetop tavern connected by rope bridges, popular with rangers and scouts',
  'The Forge & Flagon — a combined smithy and alehouse where drinks come in metal tankards you can keep (for a price)',
];

const RANDOM_TRAPS = [
  'Pressure plate triggers poison darts from the walls (d6 phy, Finesse 13 to dodge)',
  'Tripwire releases a swinging log (d8 phy, very loud — alerts nearby enemies)',
  'False floor covers a 20ft pit with spikes (d10+3 phy, Instinct 12 to spot)',
  'Magical glyph on the floor erupts in flame when stepped on (d8 mag, Knowledge 15 to identify)',
  'Room slowly fills with water when the door closes — need to solve a puzzle to drain it',
  'Hallway narrows imperceptibly — armored characters get stuck (Strength 14 to push through)',
  'Mirror on the wall traps the reflection of whoever looks into it (Presence 13 to resist)',
  'Chest is a mimic — attacks when opened (Tier 2 adversary, d8 phy bite)',
  'Invisible force field blocks the corridor — requires a specific keyword to pass',
  'Floor tiles are a musical puzzle — wrong step triggers lightning (d6 mag)',
  "Statue's eyes track movement — turns to attack if you turn your back (d10 phy)",
  'Door handle is coated in contact poison — 1 Stress and Weakened condition',
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
  'What hidden danger lurks just out of sight?',
  'What personal connection does a PC have to this moment?',
  'What nearby object could become important later?',
  'What secret is this NPC keeping from the party?',
  'What unexpected ally might appear?',
  'What would happen if the party fails here?',
  'What weather or environmental detail sets the mood?',
  'What contradiction exists in this situation?',
];

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

interface GMToolsPanelProps {
  campaignId: string;
  battles: BattleState[];
  playerNames?: string[];
  onAddNPC: (
    name: string,
    extra?: { personality?: string; motivation?: string }
  ) => void | Promise<void>;
  onAddLocation: (name: string) => void | Promise<void>;
  onAddQuest: (title: string) => void | Promise<void>;
  onNavigateToTab: (tab: string) => void;
  checklistItems: ChecklistItem[];
  onChecklistChange: (items: ChecklistItem[]) => void;
  onDeleteBattle: (battleId: string) => void | Promise<void>;
}

type RandomResultType =
  | 'npc'
  | 'location'
  | 'quest'
  | 'questHook'
  | 'trait'
  | 'complication'
  | 'encounter'
  | 'loot'
  | 'weather'
  | 'motivation'
  | 'rumor'
  | 'setting'
  | 'trap'
  | 'tavern';

interface RandomResult {
  value: string;
  type: RandomResultType;
}

interface RandomGeneratorsCardProps {
  randomResult: RandomResult | null;
  adding: boolean;
  onRoll: (list: string[], type: RandomResultType) => void;
  onAddAndGo: () => Promise<void>;
  getTypeLabel: (type: RandomResultType) => string;
}

function RandomGeneratorsCard({
  randomResult,
  adding,
  onRoll,
  onAddAndGo,
  getTypeLabel,
}: RandomGeneratorsCardProps) {
  return (
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
                onClick={() => onRoll(RANDOM_NPC_NAMES, 'npc')}
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
                onClick={() => onRoll(RANDOM_LOCATIONS, 'location')}
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
                onClick={() => onRoll(RANDOM_HOOKS, 'quest')}
              >
                <Target className="mr-1 h-3 w-3" />
                Plot Hook
              </Button>
            </TooltipTrigger>
            <TooltipContent>Generate a random plot hook</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRoll(RANDOM_QUEST_HOOKS, 'questHook')}
              >
                <Scroll className="mr-1 h-3 w-3" />
                Quest Hook
              </Button>
            </TooltipTrigger>
            <TooltipContent>Generate a random quest hook</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRoll(RANDOM_NPC_TRAITS, 'trait')}
              >
                <HelpCircle className="mr-1 h-3 w-3" />
                NPC Trait
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Generate a random NPC personality trait
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRoll(RANDOM_COMPLICATIONS, 'complication')}
              >
                <Zap className="mr-1 h-3 w-3" />
                Complication
              </Button>
            </TooltipTrigger>
            <TooltipContent>Roll a mid-session complication</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRoll(RANDOM_ENCOUNTERS, 'encounter')}
              >
                <Swords className="mr-1 h-3 w-3" />
                Encounter
              </Button>
            </TooltipTrigger>
            <TooltipContent>Generate a random encounter</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRoll(RANDOM_LOOT, 'loot')}
              >
                <Gem className="mr-1 h-3 w-3" />
                Loot
              </Button>
            </TooltipTrigger>
            <TooltipContent>Generate random loot or treasure</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRoll(RANDOM_WEATHER, 'weather')}
              >
                <Cloud className="mr-1 h-3 w-3" />
                Weather
              </Button>
            </TooltipTrigger>
            <TooltipContent>Generate random weather conditions</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRoll(RANDOM_MOTIVATIONS, 'motivation')}
              >
                <Heart className="mr-1 h-3 w-3" />
                Motivation
              </Button>
            </TooltipTrigger>
            <TooltipContent>Generate a random NPC motivation</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRoll(RANDOM_RUMORS, 'rumor')}
              >
                <MessageCircle className="mr-1 h-3 w-3" />
                Rumor
              </Button>
            </TooltipTrigger>
            <TooltipContent>Generate a random tavern rumor</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRoll(RANDOM_SETTINGS, 'setting')}
              >
                <Eye className="mr-1 h-3 w-3" />
                Setting
              </Button>
            </TooltipTrigger>
            <TooltipContent>Generate a random scene description</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRoll(RANDOM_TRAPS, 'trap')}
              >
                <AlertTriangle className="mr-1 h-3 w-3" />
                Trap
              </Button>
            </TooltipTrigger>
            <TooltipContent>Generate a random trap or hazard</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRoll(RANDOM_TAVERN, 'tavern')}
              >
                <UtensilsCrossed className="mr-1 h-3 w-3" />
                Tavern Menu
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Generate a random tavern for your players to visit
            </TooltipContent>
          </Tooltip>
        </div>
        {randomResult && (
          <div className="bg-muted space-y-2 rounded-lg p-3">
            <p className="text-sm font-medium">{randomResult.value}</p>
            {randomResult.type !== 'complication' &&
              randomResult.type !== 'encounter' &&
              randomResult.type !== 'loot' &&
              randomResult.type !== 'weather' &&
              randomResult.type !== 'rumor' &&
              randomResult.type !== 'trap' && (
                <Button
                  size="sm"
                  onClick={onAddAndGo}
                  disabled={adding}
                  className="w-full"
                >
                  {adding ? (
                    'Adding...'
                  ) : (
                    <>
                      {randomResult.type === 'trait' ||
                      randomResult.type === 'motivation'
                        ? 'Add as NPC'
                        : `Add as ${getTypeLabel(randomResult.type)}`}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </>
                  )}
                </Button>
              )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ImprovHelperCardProps {
  improv: string;
  onGetPrompt: () => void;
}

function ImprovHelperCard({ improv, onGetPrompt }: ImprovHelperCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          Improv Helper
        </CardTitle>
        <CardDescription>Prompts to spark your imagination</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" onClick={onGetPrompt} className="w-full">
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
  );
}

function QuickReferenceCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <HelpCircle className="h-4 w-4 text-blue-500" />
          Quick Reference
        </CardTitle>
        <CardDescription>Common Daggerheart rules at a glance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <div className="bg-muted/50 rounded-md p-2">
            <p className="text-xs font-semibold">Fear/Hope Dice</p>
            <p className="text-muted-foreground text-xs">
              Higher Fear = GM makes a Fear move. Higher Hope = Player succeeds
              with Hope.
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
          <div className="bg-muted/50 rounded-md p-2">
            <p className="text-xs font-semibold">Action Tokens</p>
            <p className="text-muted-foreground text-xs">
              Tokens move between GM and Players. Spend to act, then pass token
              to the other side.
            </p>
          </div>
          <div className="bg-muted/50 rounded-md p-2">
            <p className="text-xs font-semibold">Short Rest</p>
            <p className="text-muted-foreground text-xs">
              Clear 1 Stress, unmark armor slots, spend Hope to heal. Takes ~1
              hour in fiction.
            </p>
          </div>
          <div className="bg-muted/50 rounded-md p-2">
            <p className="text-xs font-semibold">Long Rest</p>
            <p className="text-muted-foreground text-xs">
              Clear all Stress, full heal, reset all resources. Requires safe
              haven.
            </p>
          </div>
          <div className="bg-muted/50 rounded-md p-2">
            <p className="text-xs font-semibold">GM Fear Moves</p>
            <p className="text-muted-foreground text-xs">
              Deal damage, introduce a complication, reveal an unwelcome truth,
              take away something, show a sign of threat, or put someone in a
              spot.
            </p>
          </div>
          <div className="bg-muted/50 rounded-md p-2">
            <p className="text-xs font-semibold">Gaining Hope</p>
            <p className="text-muted-foreground text-xs">
              Players gain Hope on a roll with Hope (Duality Die &gt; Fear Die).
              Hope is shared among the party. Starting Hope = 2 per player.
            </p>
          </div>
          <div className="bg-muted/50 rounded-md p-2">
            <p className="text-xs font-semibold">Spending Hope</p>
            <p className="text-muted-foreground text-xs">
              1 Hope: +1d6 to your roll · 2 Hope: Assist another player · Use a
              Hope ability from your class · Activate a card&apos;s Hope feature
            </p>
          </div>
          <div className="bg-muted/50 rounded-md p-2">
            <p className="text-xs font-semibold">Spending Fear</p>
            <p className="text-muted-foreground text-xs">
              Spend 1 Fear to: interrupt players, make an extra move, use a Fear
              Feature, add an adversary&apos;s Experience to a roll.
            </p>
          </div>
          <div className="bg-muted/50 rounded-md p-2">
            <p className="text-xs font-semibold">Fear Budget by Scene</p>
            <p className="text-muted-foreground text-xs">
              Incidental: 0–1 · Minor: 1–3 · Standard: 2–4 · Major: 4–8 ·
              Climactic: 6–12
            </p>
          </div>
          <div className="bg-muted/50 rounded-md p-2">
            <p className="text-xs font-semibold">Difficulty Benchmarks</p>
            <p className="text-muted-foreground text-xs">
              Easy: 5 · Moderate: 10 · Hard: 15 · Very Hard: 20 · Near
              Impossible: 25 · Legendary: 30
            </p>
          </div>
          <div className="bg-muted/50 rounded-md p-2">
            <p className="text-xs font-semibold">Downtime Moves</p>
            <p className="text-muted-foreground text-xs">
              Tend to Wounds (clear 1d4+Tier HP) · Clear Stress (1d4+Tier) ·
              Craft · Research · Train · Socialize · Explore
            </p>
          </div>
          <div className="bg-muted/50 rounded-md p-2">
            <p className="text-xs font-semibold">Countdowns</p>
            <p className="text-muted-foreground text-xs">
              Standard: tick down 1 per action roll. Dynamic: varies by roll
              outcome (Crit: 3, Hope: 2, Fear: 1, Fail: 0).
            </p>
          </div>
          <div className="bg-muted/50 rounded-md p-2">
            <p className="text-xs font-semibold">Gold & Costs</p>
            <p className="text-muted-foreground text-xs">
              Handful = small items, meals · Bag = mounts, fine goods · Chest =
              rare equipment. Tier 1 gear: 1–5 Handfuls · Tier 2: 1–2 Bags ·
              Tier 3: 5–10 Bags · Tier 4: 1–2 Chests
            </p>
          </div>
          <div className="bg-muted/50 rounded-md p-2">
            <p className="text-xs font-semibold">Falling Damage</p>
            <p className="text-muted-foreground text-xs">
              Very Close: 1d10+3 · Close: 1d20+5 · Far/Very Far: 1d100+15 or
              death
            </p>
          </div>
          <div className="bg-muted/50 rounded-md p-2">
            <p className="text-xs font-semibold">Armor Mechanics</p>
            <p className="text-muted-foreground text-xs">
              Before taking damage, mark armor slots to reduce damage by the
              armor&apos;s value. Once all slots are marked, armor can&apos;t
              reduce damage until a rest. Armor resets on Short Rest.
            </p>
          </div>
          <div className="bg-muted/50 rounded-md p-2">
            <p className="text-xs font-semibold">Damage Types</p>
            <p className="text-muted-foreground text-xs">
              Physical (phy) — weapons, claws, falls · Magic (mag) — spells,
              enchantments · Stress — emotional/mental harm, marks Stress
              instead of HP
            </p>
          </div>
          <div className="bg-muted/50 rounded-md p-2">
            <p className="text-xs font-semibold">Death &amp; Dying</p>
            <p className="text-muted-foreground text-xs">
              At 0 HP → roll Death Move. Results: Rally (heal &amp; return),
              Crawl (survive at 1 HP, disadvantage), or Die (player describes
              final moment).
            </p>
          </div>
          <div className="bg-muted/50 rounded-md p-2">
            <p className="text-xs font-semibold">Range Bands</p>
            <p className="text-muted-foreground text-xs">
              Melee — within arm&apos;s reach · Very Close — same room/area ·
              Close — nearby, a short dash · Far — across a field, needs effort
              · Very Far — distant, requires travel
            </p>
          </div>
          <div className="bg-muted/50 rounded-md p-2">
            <p className="text-xs font-semibold">Movement</p>
            <p className="text-muted-foreground text-xs">
              On your turn, move within Close range for free. Moving to Far
              costs an action or Sprint (mark Stress). Very Far typically
              requires multiple turns.
            </p>
          </div>
          <div className="bg-muted/50 rounded-md p-2">
            <p className="text-xs font-semibold">Starting Combat</p>
            <p className="text-muted-foreground text-xs">
              1. Set Fear to 0 · 2. Place Action Tokens (1 per PC) · 3. Set the
              scene & range bands · 4. GM describes the threat · 5. Players act
              first (spend tokens) · 6. When all tokens spent → GM Turn
            </p>
          </div>
          <div className="bg-muted/50 rounded-md p-2">
            <p className="text-xs font-semibold">Ending Combat</p>
            <p className="text-muted-foreground text-xs">
              Combat ends when: all adversaries defeated, GM calls it
              (narratively), or the party flees. Fear resets to 0. Players keep
              their Hope.
            </p>
          </div>
        </div>
        <Separator />
        <div className="space-y-1">
          <p className="text-xs font-semibold">Reference Links</p>
          <div className="flex flex-wrap gap-1">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/references/gm-moves">
                <ExternalLink className="h-3 w-3" />
                GM Moves
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/references/adversaries">
                <ExternalLink className="h-3 w-3" />
                Adversaries
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/references/environments">
                <ExternalLink className="h-3 w-3" />
                Environments
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/references/equipment">
                <ExternalLink className="h-3 w-3" />
                Equipment
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/references/domain-cards">
                <ExternalLink className="h-3 w-3" />
                Domain Cards
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ChecklistCardProps {
  checklistItems: ChecklistItem[];
  newChecklistItem: string;
  onNewChecklistItemChange: (value: string) => void;
  onChecklistChange: (items: ChecklistItem[]) => void;
}

function ChecklistCard({
  checklistItems,
  newChecklistItem,
  onNewChecklistItemChange,
  onChecklistChange,
}: ChecklistCardProps) {
  const addChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    onChecklistChange([
      {
        id: crypto.randomUUID(),
        text: newChecklistItem.trim(),
        checked: false,
      },
      ...checklistItems,
    ]);
    onNewChecklistItemChange('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Flag className="h-4 w-4 text-green-500" />
          Session Prep Checklist
        </CardTitle>
        <CardDescription>
          Don't forget before the session starts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="mb-2 flex gap-2 border-b pb-2">
            <Input
              aria-label="New checklist item"
              placeholder="Add new item..."
              value={newChecklistItem}
              onChange={e => onNewChecklistItemChange(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  addChecklistItem();
                }
              }}
              className="text-sm"
            />
            <Button size="sm" variant="outline" onClick={addChecklistItem}>
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
  );
}

function QuickNotesCard() {
  const [notes, setNotes] = useState('');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <StickyNote className="h-4 w-4 text-yellow-500" />
            Quick Notes
          </span>
          {notes.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              className="text-muted-foreground h-6 text-xs"
              onClick={() => {
                navigator.clipboard.writeText(notes);
              }}
            >
              Copy
            </Button>
          )}
        </CardTitle>
        <CardDescription>Scratch pad for mid-session notes</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Jot down notes during your session..."
          className="min-h-20 resize-y text-sm"
        />
        <p className="text-muted-foreground mt-1 text-right text-[10px]">
          {notes.length} chars · Not saved
        </p>
      </CardContent>
    </Card>
  );
}

interface BattleTrackerCardProps {
  campaignId: string;
  battles: BattleState[];
  onDeleteBattle: (battleId: string) => void | Promise<void>;
}

function BattleTrackerCard({
  campaignId,
  battles,
  onDeleteBattle,
}: BattleTrackerCardProps) {
  const statusColors: Record<string, string> = {
    planning:
      'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30',
    active:
      'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30',
    paused:
      'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
    completed:
      'bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/30',
  };

  const statusIcons: Record<string, React.ReactNode> = {
    planning: <Swords className="h-3 w-3" />,
    active: <Play className="h-3 w-3" />,
    paused: <Pause className="h-3 w-3" />,
    completed: <Flag className="h-3 w-3" />,
  };

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Swords className="h-4 w-4 text-red-500" />
          Battle Tracker
        </CardTitle>
        <CardDescription>Manage encounters for your campaign</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Link
          to="/gm/campaigns/$id/battle"
          params={{ id: campaignId }}
          search={{ tab: 'gm-tools', new: true }}
          className="block"
        >
          <Button className="w-full gap-2">
            <Plus className="h-4 w-4" />
            New Combat Encounter
          </Button>
        </Link>

        {battles.length > 0 && (
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Saved Encounters ({battles.length})
            </p>
            <div className="max-h-50 space-y-2 overflow-y-auto pr-1">
              {battles.map(battle => (
                <div
                  key={battle.id}
                  className="group hover:bg-muted/50 flex items-center justify-between rounded-lg border p-2 transition-colors"
                >
                  <Link
                    to="/gm/campaigns/$id/battle"
                    params={{ id: campaignId }}
                    search={{ tab: 'gm-tools', battleId: battle.id }}
                    className="min-w-0 flex-1"
                  >
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">
                        {battle.name}
                      </p>
                      <Badge
                        variant="outline"
                        className={`shrink-0 text-xs ${statusColors[battle.status]}`}
                      >
                        {statusIcons[battle.status]}
                        <span className="ml-1 capitalize">{battle.status}</span>
                      </Badge>
                    </div>
                    <div className="text-muted-foreground mt-0.5 flex items-center gap-3 text-xs">
                      <span>{battle.characters.length} PCs</span>
                      <span>·</span>
                      <span>{battle.adversaries.length} Adversaries</span>
                      {battle.environments.length > 0 && (
                        <>
                          <span>·</span>
                          <span>{battle.environments.length} Env</span>
                        </>
                      )}
                    </div>
                  </Link>
                  <div className="ml-2 flex shrink-0 items-center gap-1">
                    <Link
                      to="/gm/campaigns/$id/battle"
                      params={{ id: campaignId }}
                      search={{ tab: 'gm-tools', battleId: battle.id }}
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Open Battle</TooltipContent>
                      </Tooltip>
                    </Link>
                    <AlertDialog>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <Trash2 className="text-destructive h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Delete Battle</TooltipContent>
                      </Tooltip>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Battle</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this battle? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDeleteBattle(battle.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {battles.length === 0 && (
          <p className="text-muted-foreground py-2 text-center text-sm">
            No saved encounters yet. Start a new combat to track your battles!
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ActionRollResolverCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Dice5 className="h-4 w-4 text-amber-500" />
          Action Roll Resolver
        </CardTitle>
        <CardDescription>Daggerheart roll outcomes at a glance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="rounded-md border-l-4 border-yellow-500 bg-yellow-500/5 p-2">
          <p className="text-xs font-bold text-yellow-600 dark:text-yellow-400">
            Critical Success (nat 20)
          </p>
          <p className="text-muted-foreground text-xs">
            Auto-success + bonus. Roll extra damage die.
          </p>
        </div>
        <div className="rounded-md border-l-4 border-sky-500 bg-sky-500/5 p-2">
          <p className="text-xs font-bold text-sky-600 dark:text-sky-400">
            Success with Hope
          </p>
          <p className="text-muted-foreground text-xs">
            &quot;Yes, and...&quot; — They succeed and gain a Hope. Let the
            player describe it.
          </p>
        </div>
        <div className="rounded-md border-l-4 border-purple-500 bg-purple-500/5 p-2">
          <p className="text-xs font-bold text-purple-600 dark:text-purple-400">
            Success with Fear
          </p>
          <p className="text-muted-foreground text-xs">
            &quot;Yes, but...&quot; — They succeed, but you gain a Fear. Make a
            minor GM move.
          </p>
        </div>
        <div className="rounded-md border-l-4 border-orange-500 bg-orange-500/5 p-2">
          <p className="text-xs font-bold text-orange-600 dark:text-orange-400">
            Failure with Hope
          </p>
          <p className="text-muted-foreground text-xs">
            &quot;No, but...&quot; — They fail, but gain a Hope. Offer a silver
            lining.
          </p>
        </div>
        <div className="rounded-md border-l-4 border-red-500 bg-red-500/5 p-2">
          <p className="text-xs font-bold text-red-600 dark:text-red-400">
            Failure with Fear
          </p>
          <p className="text-muted-foreground text-xs">
            &quot;No, and...&quot; — They fail and it gets worse. You gain a
            Fear. Make a hard GM move.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function ConditionsReferenceCard() {
  const conditions = [
    {
      name: 'Frightened',
      effect: 'Disadvantage on rolls against source of fear',
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      name: 'Restrained',
      effect: 'Cannot move; attacks against have advantage',
      color: 'text-red-600 dark:text-red-400',
    },
    {
      name: 'Vulnerable',
      effect: 'Attacks against deal +1d6 damage',
      color: 'text-orange-600 dark:text-orange-400',
    },
    {
      name: 'Slowed',
      effect: 'Can only move within Close range on your turn',
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      name: 'Weakened',
      effect: 'Disadvantage on attack rolls',
      color: 'text-amber-600 dark:text-amber-400',
    },
    {
      name: 'Hidden',
      effect: 'Cannot be targeted; attack from hidden has advantage',
      color: 'text-green-600 dark:text-green-400',
    },
    {
      name: 'Prone',
      effect: 'Disadvantage on ranged attacks; stand up costs movement',
      color: 'text-gray-600 dark:text-gray-400',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          Conditions Reference
        </CardTitle>
        <CardDescription>Common conditions and their effects</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {conditions.map(c => (
          <div key={c.name} className="bg-muted/50 rounded-md px-2 py-1.5">
            <p className={`text-xs font-bold ${c.color}`}>{c.name}</p>
            <p className="text-muted-foreground text-xs">{c.effect}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function SessionTimerCard() {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || !startTime) return;
    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const hours = Math.floor(elapsed / 3600000);
  const minutes = Math.floor((elapsed % 3600000) / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  const display = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleToggle = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      if (!startTime) {
        setStartTime(Date.now());
      } else {
        setStartTime(Date.now() - elapsed);
      }
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setStartTime(null);
    setElapsed(0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Timer className="h-4 w-4 text-green-500" />
          Session Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3">
        <p className="font-mono text-3xl font-bold tracking-wider">{display}</p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={isRunning ? 'destructive' : 'default'}
            onClick={handleToggle}
          >
            {isRunning ? 'Pause' : elapsed > 0 ? 'Resume' : 'Start'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            disabled={elapsed === 0}
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function DiceRollerCard() {
  const [result, setResult] = useState<{
    type: string;
    detail: string;
    total: number;
  } | null>(null);

  const roll = useCallback((sides: number) => {
    const value = Math.floor(Math.random() * sides) + 1;
    setResult({ type: `d${sides}`, detail: `${value}`, total: value });
  }, []);

  const dualityRoll = useCallback(() => {
    const hope = Math.floor(Math.random() * 12) + 1;
    const fear = Math.floor(Math.random() * 12) + 1;
    const total = hope + fear;
    const isHope = hope >= fear;
    const isCrit = hope === fear;
    const type = isCrit
      ? total >= 13
        ? 'Critical Success!'
        : 'Critical Failure!'
      : isHope
        ? 'with Hope'
        : 'with Fear';
    setResult({
      type: `Duality Roll — ${type}`,
      detail: `Hope: ${hope} | Fear: ${fear}`,
      total,
    });
  }, []);

  const critColor = result?.type.includes('Critical Success')
    ? 'text-yellow-500'
    : result?.type.includes('Critical Failure')
      ? 'text-red-500'
      : result?.type.includes('Hope')
        ? 'text-blue-500'
        : result?.type.includes('Fear')
          ? 'text-purple-500'
          : 'text-foreground';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Dices className="h-4 w-4 text-indigo-500" />
          Dice Roller
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {result && (
          <div className="bg-muted rounded-lg p-3 text-center">
            <p className={`text-2xl font-bold ${critColor}`}>{result.total}</p>
            <p className="text-xs font-medium">{result.type}</p>
            <p className="text-muted-foreground text-xs">{result.detail}</p>
          </div>
        )}
        <Button className="w-full" onClick={dualityRoll}>
          🎲 Duality Roll (2d12)
        </Button>
        <div className="flex flex-wrap gap-1.5">
          {[4, 6, 8, 10, 12, 20].map(d => (
            <Button
              key={d}
              size="sm"
              variant="outline"
              onClick={() => roll(d)}
              className="flex-1 text-xs"
            >
              d{d}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PlayerSpotlightCard({ players }: { players?: string[] }) {
  const [spotlit, setSpotlit] = useState<Set<string>>(new Set());

  const playerList = players?.length
    ? players
    : ['Player 1', 'Player 2', 'Player 3', 'Player 4'];

  const toggle = (name: string) => {
    setSpotlit(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4 text-violet-500" />
            Spotlight Tracker
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSpotlit(new Set())}
          >
            Reset
          </Button>
        </CardTitle>
        <CardDescription>
          Track who&apos;s had screen time this scene
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1.5">
          {playerList.map(p => (
            <Button
              key={p}
              size="sm"
              variant={spotlit.has(p) ? 'default' : 'outline'}
              onClick={() => toggle(p)}
              className="text-xs"
            >
              {spotlit.has(p) ? '✓ ' : ''}
              {p}
            </Button>
          ))}
        </div>
        <p className="text-muted-foreground mt-2 text-xs">
          {spotlit.size}/{playerList.length} players spotlit
        </p>
      </CardContent>
    </Card>
  );
}

function SceneTypeGuidanceCard() {
  const sceneTypes = [
    {
      type: 'Roleplay',
      description: 'Social encounters, exploration, downtime',
      tips: 'Use GM Moves softly. Let players drive. Advance story threads.',
      fearBudget: '0–1',
      color: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      type: 'Action (Minor)',
      description: 'Brief skirmishes, chases, traps',
      tips: 'Quick encounters. 1–2 adversaries or a hazard. Resolve in ~15 min.',
      fearBudget: '1–3',
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      type: 'Action (Standard)',
      description: 'Typical combat encounters',
      tips: 'Mix adversary types. Use environment. Escalate with Fear.',
      fearBudget: '2–4',
      color: 'text-amber-600 dark:text-amber-400',
    },
    {
      type: 'Action (Major)',
      description: 'Boss fights, multi-wave battles',
      tips: 'Use countdown clocks. Introduce twists. Make terrain matter.',
      fearBudget: '4–8',
      color: 'text-orange-600 dark:text-orange-400',
    },
    {
      type: 'Action (Climactic)',
      description: 'Campaign-defining encounters',
      tips: 'All stops out. Multiple objectives. NPC allies may join. High stakes.',
      fearBudget: '6–12',
      color: 'text-red-600 dark:text-red-400',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Theater className="h-4 w-4 text-indigo-500" />
          Scene Type Guide
        </CardTitle>
        <CardDescription>
          Choose scene type to set stakes and Fear budget
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {sceneTypes.map(s => (
          <div key={s.type} className="bg-muted/50 rounded-md px-2 py-1.5">
            <div className="flex items-center justify-between">
              <p className={`text-xs font-bold ${s.color}`}>{s.type}</p>
              <span className="bg-background rounded px-1.5 py-0.5 text-[10px] font-medium">
                Fear: {s.fearBudget}
              </span>
            </div>
            <p className="text-muted-foreground text-[11px]">{s.description}</p>
            <p className="text-muted-foreground mt-0.5 text-[11px] italic">
              {s.tips}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function GmMovesCheatCard() {
  const softMoves = [
    'Reveal an unwelcome truth',
    'Foreshadow trouble',
    'Put someone in a tough spot',
    'Offer an opportunity with a cost',
    'Tell them the consequences and ask',
  ];
  const hardMoves = [
    'Deal damage or inflict a condition',
    "Use an adversary's feature",
    'Make an irreversible change',
    'Separate the party',
    'Advance a threat or countdown',
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BookOpen className="h-4 w-4 text-teal-500" />
          GM Moves Cheat Sheet
        </CardTitle>
        <CardDescription>Quick reminder of available moves</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="mb-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            Soft Moves
          </p>
          <ul className="space-y-0.5">
            {softMoves.map(m => (
              <li
                key={m}
                className="text-muted-foreground flex items-start gap-1.5 text-xs"
              >
                <span className="mt-0.5 text-amber-500">→</span> {m}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-1 text-xs font-semibold text-red-600 dark:text-red-400">
            Hard Moves
          </p>
          <ul className="space-y-0.5">
            {hardMoves.map(m => (
              <li
                key={m}
                className="text-muted-foreground flex items-start gap-1.5 text-xs"
              >
                <span className="mt-0.5 text-red-500">→</span> {m}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function GmPrinciplesCard() {
  const principles = [
    {
      title: 'Be a Fan of the Players',
      desc: 'Root for their success. Make their victories feel earned.',
    },
    {
      title: 'Address the Characters',
      desc: 'Speak to characters, not players. Keep the fiction alive.',
    },
    {
      title: 'Begin and End with Fiction',
      desc: 'Frame rules in the story. Start with what happens, not mechanics.',
    },
    {
      title: 'Ask Questions',
      desc: 'Build on answers. Let players shape the world with you.',
    },
    {
      title: 'Make the World Feel Real',
      desc: 'NPCs have motives. Environments react. Consequences flow naturally.',
    },
    {
      title: 'Telegraph Danger',
      desc: 'Show threats before they strike. Give players a chance to act.',
    },
    {
      title: 'Think Off-Screen',
      desc: "The world moves even when players aren't looking. Advance threats and allies.",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Compass className="h-4 w-4 text-sky-500" />
          GM Principles
        </CardTitle>
        <CardDescription>
          Your north star while running the game
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        {principles.map(p => (
          <div key={p.title} className="bg-muted/50 rounded-md px-2 py-1.5">
            <p className="text-xs font-semibold">{p.title}</p>
            <p className="text-muted-foreground text-[11px]">{p.desc}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

interface CountdownClock {
  id: string;
  label: string;
  segments: number;
  filled: number;
}

function CountdownClocksCard() {
  const [clocks, setClocks] = useState<CountdownClock[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [newSegments, setNewSegments] = useState(4);

  const addClock = () => {
    if (!newLabel.trim()) return;
    setClocks(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        label: newLabel.trim(),
        segments: newSegments,
        filled: 0,
      },
    ]);
    setNewLabel('');
  };

  const fillSegment = (id: string) => {
    setClocks(prev =>
      prev.map(c =>
        c.id === id && c.filled < c.segments
          ? { ...c, filled: c.filled + 1 }
          : c
      )
    );
  };

  const unfillSegment = (id: string) => {
    setClocks(prev =>
      prev.map(c =>
        c.id === id && c.filled > 0 ? { ...c, filled: c.filled - 1 } : c
      )
    );
  };

  const removeClock = (id: string) => {
    setClocks(prev => prev.filter(c => c.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4 text-orange-500" />
          Countdown Clocks
        </CardTitle>
        <CardDescription>
          Track progress toward events and threats
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {clocks.map(clock => (
          <div key={clock.id} className="bg-muted/50 rounded-lg p-2">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-semibold">{clock.label}</span>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => unfillSegment(clock.id)}
                >
                  \u2212
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => fillSegment(clock.id)}
                >
                  +
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-red-500"
                  onClick={() => removeClock(clock.id)}
                >
                  \u00d7
                </Button>
              </div>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: clock.segments }, (_, i) => (
                <div
                  key={i}
                  className={`h-4 flex-1 rounded-sm border ${
                    i < clock.filled
                      ? clock.filled === clock.segments
                        ? 'border-red-600 bg-red-500'
                        : 'border-orange-500 bg-orange-400'
                      : 'border-border bg-muted'
                  }`}
                />
              ))}
            </div>
            {clock.filled === clock.segments && (
              <p className="mt-1 animate-pulse text-[11px] font-medium text-red-500">
                \u26a0 Clock Complete!
              </p>
            )}
          </div>
        ))}
        {clocks.length === 0 && (
          <p className="text-muted-foreground py-2 text-center text-xs">
            No active clocks
          </p>
        )}
        <div className="flex gap-2">
          <Input
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            placeholder="Clock label..."
            className="h-8 text-xs"
            onKeyDown={e => e.key === 'Enter' && addClock()}
          />
          <select
            value={newSegments}
            onChange={e => setNewSegments(Number(e.target.value))}
            className="bg-background border-input h-8 rounded border px-2 text-xs"
          >
            {[3, 4, 5, 6, 8, 10, 12].map(n => (
              <option key={n} value={n}>
                {n} seg
              </option>
            ))}
          </select>
          <Button size="sm" className="h-8" onClick={addClock}>
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AdversaryTiersCard() {
  const tiers = [
    {
      tier: 'Tier 1 (Minion)',
      hp: '1–6',
      damage: 'd4–d6',
      difficulty: '10–12',
      evasion: '8–10',
      color: 'text-green-600 dark:text-green-400',
    },
    {
      tier: 'Tier 2 (Standard)',
      hp: '6–15',
      damage: 'd6–d10',
      difficulty: '12–15',
      evasion: '10–13',
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      tier: 'Tier 3 (Elite)',
      hp: '15–30',
      damage: 'd10–d12',
      difficulty: '15–18',
      evasion: '12–16',
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      tier: 'Tier 4 (Boss)',
      hp: '30–60',
      damage: 'd12–d20',
      difficulty: '18–22',
      evasion: '15–20',
      color: 'text-red-600 dark:text-red-400',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Shield className="h-4 w-4 text-orange-500" />
          Adversary Tiers
        </CardTitle>
        <CardDescription>
          Quick reference for building encounters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {tiers.map(t => (
          <div key={t.tier} className="bg-muted/50 rounded-md px-2 py-1.5">
            <p className={`text-xs font-bold ${t.color}`}>{t.tier}</p>
            <div className="text-muted-foreground grid grid-cols-2 gap-x-3 text-[11px]">
              <span>HP: {t.hp}</span>
              <span>Damage: {t.damage}</span>
              <span>Difficulty: {t.difficulty}</span>
              <span>Evasion: {t.evasion}</span>
            </div>
          </div>
        ))}
        <div className="bg-muted/50 rounded-md px-2 py-1.5">
          <p className="text-muted-foreground text-[11px]">
            <span className="font-semibold">Damage Thresholds:</span> Minor{' '}
            {'<'}5 · Major 5–9 · Severe 10+
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

const GM_TIPS = [
  "Ask your players: 'What does your character notice?' — it shifts narration to them.",
  'When in doubt, use a Soft Move. Save Hard Moves for high-drama moments.',
  'Fear is a resource, not a punishment. Spending it creates exciting moments.',
  'Let silence sit. Players will fill it with character moments.',
  'Name every NPC, even minor ones. It makes the world feel alive.',
  'End sessions on a cliffhanger. It builds anticipation for next time.',
  "If the table is laughing, don't interrupt. Joy is the goal.",
  'Use countdown clocks visibly. Player urgency drives great stories.',
  'Revisit player backstories regularly. It shows you care about their characters.',
  "Telegraph danger: 'You notice the ground is trembling...' gives players agency.",
  "Don't prep plots, prep situations. Let players determine the direction.",
  'When players roll with Fear, make the consequence interesting, not just punishing.',
  "Check in with quiet players: 'What is [character name] doing right now?'",
  'Describe with senses beyond sight: sounds, smells, textures, temperature.',
  "It's okay to say 'Let me think about that for a moment.' Take your time.",
  'Celebrate critical successes loudly. They are the stories players remember.',
];

function GmTipOfTheDay() {
  const [tip] = useState(
    () => GM_TIPS[Math.floor(Math.random() * GM_TIPS.length)]
  );

  return (
    <div className="flex items-start gap-2 rounded-lg border border-sky-200 bg-sky-50/50 p-3 dark:border-sky-900 dark:bg-sky-950/30">
      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
      <div>
        <p className="text-xs font-semibold text-sky-700 dark:text-sky-300">
          GM Tip
        </p>
        <p className="text-[11px] text-sky-600 dark:text-sky-400">{tip}</p>
      </div>
    </div>
  );
}

function SafetyToolsReminder() {
  return (
    <Card className="border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/30">
      <CardContent className="flex items-start gap-2 p-3">
        <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400" />
        <div>
          <p className="text-xs font-semibold text-green-700 dark:text-green-300">
            Safety Tools Active
          </p>
          <p className="text-[11px] text-green-600 dark:text-green-400">
            Lines & Veils are set in Session Zero. Any player can pause the game
            at any time. Check in regularly, especially during intense scenes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function GMToolsPanel({
  campaignId,
  battles,
  playerNames,
  onAddNPC,
  onAddLocation,
  onAddQuest,
  onNavigateToTab,
  checklistItems,
  onChecklistChange,
  onDeleteBattle,
}: GMToolsPanelProps) {
  const [randomResult, setRandomResult] = useState<RandomResult | null>(null);
  const [improv, setImprov] = useState<string>('');
  const [adding, setAdding] = useState(false);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [toolFilter, setToolFilter] = useState('');

  const rollRandom = (list: string[], type: RandomResultType) => {
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
      } else if (randomResult.type === 'questHook') {
        await onAddQuest(randomResult.value);
        onNavigateToTab('quests');
      } else if (randomResult.type === 'setting') {
        await onAddLocation(randomResult.value);
        onNavigateToTab('locations');
      } else if (randomResult.type === 'tavern') {
        await onAddLocation(randomResult.value);
        onNavigateToTab('locations');
      } else if (randomResult.type === 'trait') {
        const randomName =
          RANDOM_NPC_NAMES[Math.floor(Math.random() * RANDOM_NPC_NAMES.length)];
        await onAddNPC(randomName, { personality: randomResult.value });
        onNavigateToTab('characters');
      } else if (randomResult.type === 'motivation') {
        const randomName =
          RANDOM_NPC_NAMES[Math.floor(Math.random() * RANDOM_NPC_NAMES.length)];
        await onAddNPC(randomName, { motivation: randomResult.value });
        onNavigateToTab('characters');
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

  const getTypeLabel = (type: RandomResultType) => {
    switch (type) {
      case 'npc':
        return 'Character';
      case 'location':
        return 'Location';
      case 'quest':
        return 'Quest';
      case 'questHook':
        return 'Quest';
      case 'trait':
        return 'Trait';
      case 'complication':
        return 'Complication';
      case 'encounter':
        return 'Encounter';
      case 'loot':
        return 'Loot';
      case 'weather':
        return 'Weather';
      case 'motivation':
        return 'Motivation';
      case 'rumor':
        return 'Rumor';
      case 'setting':
        return 'Location';
      case 'trap':
        return 'Trap';
      case 'tavern':
        return 'Location';
    }
  };

  return (
    <div className="space-y-6">
      <SafetyToolsReminder />
      <GmTipOfTheDay />
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
        <Input
          value={toolFilter}
          onChange={e => setToolFilter(e.target.value)}
          placeholder="Filter tools..."
          className="h-8 pl-8 text-sm"
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {(
          [
            {
              name: 'GM Principles',
              el: <GmPrinciplesCard key="principles" />,
            },
            { name: 'Session Timer', el: <SessionTimerCard key="timer" /> },
            { name: 'Dice Roller', el: <DiceRollerCard key="dice" /> },
            {
              name: 'Battle Tracker',
              el: (
                <BattleTrackerCard
                  key="battle"
                  campaignId={campaignId}
                  battles={battles}
                  onDeleteBattle={onDeleteBattle}
                />
              ),
            },
            {
              name: 'Countdown Clocks',
              el: <CountdownClocksCard key="countdown" />,
            },
            {
              name: 'Random Generators',
              el: (
                <RandomGeneratorsCard
                  key="random"
                  randomResult={randomResult}
                  adding={adding}
                  onRoll={rollRandom}
                  onAddAndGo={handleAddAndGo}
                  getTypeLabel={getTypeLabel}
                />
              ),
            },
            {
              name: 'Improv Helper',
              el: (
                <ImprovHelperCard
                  key="improv"
                  improv={improv}
                  onGetPrompt={getImprovPrompt}
                />
              ),
            },
            {
              name: 'Player Spotlight',
              el: <PlayerSpotlightCard key="spotlight" players={playerNames} />,
            },
            {
              name: 'Action Roll Resolver',
              el: <ActionRollResolverCard key="action" />,
            },
            {
              name: 'Quick Reference',
              el: <QuickReferenceCard key="quickref" />,
            },
            {
              name: 'Conditions Reference',
              el: <ConditionsReferenceCard key="conditions" />,
            },
            {
              name: 'Scene Type Guidance',
              el: <SceneTypeGuidanceCard key="scene" />,
            },
            {
              name: 'GM Moves Cheat Sheet',
              el: <GmMovesCheatCard key="moves" />,
            },
            {
              name: 'Adversary Tiers',
              el: <AdversaryTiersCard key="adversary" />,
            },
            {
              name: 'Checklist',
              el: (
                <ChecklistCard
                  key="checklist"
                  checklistItems={checklistItems}
                  newChecklistItem={newChecklistItem}
                  onNewChecklistItemChange={setNewChecklistItem}
                  onChecklistChange={onChecklistChange}
                />
              ),
            },
            { name: 'Quick Notes', el: <QuickNotesCard key="notes" /> },
          ] as const
        )
          .filter(
            t =>
              !toolFilter ||
              t.name.toLowerCase().includes(toolFilter.toLowerCase())
          )
          .map(t => t.el)}
      </div>
    </div>
  );
}
