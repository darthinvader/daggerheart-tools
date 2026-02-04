/* eslint-disable react-refresh/only-export-components */
import type { LucideIcon, LucideProps } from 'lucide-react';
import {
  Accessibility,
  Activity,
  AlertTriangle,
  Anchor,
  Archive,
  ArrowLeftRight,
  ArrowRight,
  Award,
  Axe,
  Backpack,
  Ban,
  BarChart3,
  BatteryMedium,
  Bird,
  Blend,
  Bone,
  Book,
  BookOpen,
  BookText,
  Box,
  Brain,
  Bug,
  Calendar,
  Castle,
  Cat,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Circle,
  CircleDot,
  Clapperboard,
  ClipboardList,
  Cloud,
  Clover,
  Coins,
  Compass,
  Crosshair,
  Crown,
  Dice1,
  Dice5,
  Dog,
  Droplet,
  Feather,
  FileText,
  Flame,
  FlaskConical,
  Focus,
  Folder,
  FolderOpen,
  Footprints,
  Gem,
  Gift,
  Glasses,
  Globe,
  GraduationCap,
  Grip,
  Hammer,
  Hand,
  HandMetal,
  Handshake,
  Heart,
  HeartCrack,
  HeartPulse,
  HelpCircle,
  Home,
  House,
  Infinity as InfinityIcon,
  Landmark,
  Layers,
  LayoutGrid,
  Leaf,
  Library,
  Link2,
  Loader,
  Lock,
  Map,
  MapPin,
  Medal,
  MessageSquare,
  Minus,
  Moon,
  Mountain,
  Move,
  Music2,
  Package,
  Palette,
  PawPrint,
  Pencil,
  PersonStanding,
  Pin,
  Play,
  Plus,
  Power,
  Puzzle,
  Rabbit,
  RefreshCw,
  Repeat,
  Ruler,
  Save,
  Scale,
  Scroll,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Shirt,
  Shuffle,
  Skull,
  Slash,
  Snail,
  Spade,
  Sparkle,
  Sparkles,
  Speech,
  Sprout,
  Square,
  Star,
  Sun,
  Sword,
  Swords,
  Target,
  Tent,
  Theater,
  Timer,
  Trash2,
  TreePine,
  TrendingUp,
  Trophy,
  Unlock,
  User,
  Users,
  Wand2,
  Watch,
  Waves,
  Wind,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
/**
 * Centralized icon mappings for the Daggerheart Tools application.
 * Replaces emoji usage with Lucide React icons for consistent styling.
 */
import type { ComponentType } from 'react';

// Re-export LucideIcon and LucideProps types for consumers
export type { LucideIcon, LucideProps };

// Default icon size for inline use (matching typical emoji sizing)
export const ICON_SIZE_SM = 14;
export const ICON_SIZE_MD = 16;
export const ICON_SIZE_LG = 20;
export const ICON_SIZE_XL = 24;

/**
 * Type for any icon component that can be rendered dynamically.
 * Supports LucideIcon and any other React component that accepts LucideProps.
 */
export type IconComponent = ComponentType<LucideProps>;

/**
 * DynamicIcon component - renders an icon passed as a prop
 * without triggering "component created during render" ESLint errors.
 */
interface DynamicIconProps extends Omit<LucideProps, 'ref'> {
  icon: IconComponent | null | undefined;
}

export function DynamicIcon({ icon: Icon, ...props }: DynamicIconProps) {
  if (!Icon) return null;
  return <Icon {...props} />;
}

// ============================================================================
// DOMAIN ICONS
// ============================================================================
export const DomainIcons: Record<string, LucideIcon> = {
  Arcana: Sparkles,
  Blade: Sword,
  Bone,
  Codex: Scroll,
  Grace: Sparkle,
  Midnight: Moon,
  Sage: GraduationCap,
  Splendor: Crown,
  Valor: Flame,
} as const;

// ============================================================================
// CLASS ICONS
// ============================================================================
export const ClassIcons: Record<string, LucideIcon> = {
  Bard: Theater,
  Druid: Leaf,
  Guardian: Shield,
  Ranger: Target,
  Rogue: Axe,
  Seraph: Feather,
  Sorcerer: Wand2,
  Warrior: Swords,
  Wizard: BookOpen,
} as const;

// ============================================================================
// TRAIT ICONS
// ============================================================================
export const TraitIcons: Record<string, LucideIcon> = {
  Agility: Footprints,
  Strength: Activity,
  Finesse: Crosshair,
  Instinct: Focus,
  Presence: Sparkles,
  Knowledge: Library,
} as const;

// ============================================================================
// COMPANION ICONS
// ============================================================================
export const CompanionTypeIcons: Record<string, LucideIcon> = {
  Wolf: Dog,
  Bear: PawPrint,
  Hawk: Bird,
  Eagle: Bird,
  Fox: Dog,
  Panther: Cat,
  Owl: Bird,
  Serpent: Bug,
  Boar: PawPrint,
  Stag: PawPrint,
  Raven: Feather,
  Spider: Bug,
  Horse: PawPrint,
  Lynx: Cat,
  default: PawPrint,
} as const;

export const CompanionTrainingIcons: Record<string, LucideIcon> = {
  intelligent: Brain,
  vicious: Flame,
  resilient: Shield,
  armored: Shield,
  aware: Focus,
  lightInTheDark: Sparkles,
  creatureComfort: Heart,
  bonded: Handshake,
} as const;

// ============================================================================
// COMMUNITY ICONS
// ============================================================================
export const CommunityIcons: Record<string, LucideIcon> = {
  Highborne: Crown,
  Loreborne: Library,
  Orderborne: Scale,
  Ridgeborne: Mountain,
  Seaborne: Waves,
  Slyborne: Axe,
  Underborne: Layers,
  Wanderborne: Compass,
  Wildborne: TreePine,
  default: Home,
} as const;

// ============================================================================
// ADVERSARY ICONS
// ============================================================================
export const AdversaryRoleIcons: Record<string, LucideIcon> = {
  Bruiser: Flame,
  Horde: Bug,
  Leader: Crown,
  Minion: Feather,
  Ranged: Target,
  Skulk: Glasses,
  Social: Speech,
  Solo: Sword,
  Standard: Shield,
  Support: Sparkles,
  default: Puzzle,
} as const;

export const AdversaryTierIcons: Record<string, LucideIcon> = {
  '1': Star,
  '2': Flame,
  '3': Zap,
  '4': Skull,
} as const;

// ============================================================================
// ENVIRONMENT ICONS
// ============================================================================
export const EnvironmentTierIcons: Record<string, LucideIcon> = {
  '1': Sprout,
  '2': Leaf,
  '3': Flame,
  '4': Zap,
} as const;

export const EnvironmentTypeIcons: Record<string, LucideIcon> = {
  Exploration: Compass,
  Event: Clapperboard,
  Social: Speech,
  Traversal: Footprints,
  default: Puzzle,
} as const;

// ============================================================================
// EQUIPMENT ICONS
// ============================================================================
export const EquipmentSlotIcons: Record<string, LucideIcon> = {
  ring: Circle,
  necklace: Link2,
  cloak: Shirt,
  boots: Footprints,
  gloves: Hand,
  bracers: Watch,
  circlet: Crown,
  amulet: Gem,
  trinket: Sparkles,
  custom: Dice5,
} as const;

export const DamageTypeIcons: Record<string, LucideIcon> = {
  physical: Sword,
  magic: Sparkles,
} as const;

export const RangeIcons: Record<string, LucideIcon> = {
  melee: HandMetal,
  veryClose: Axe,
  close: Target,
  far: Crosshair,
  veryFar: Star,
  default: MapPin,
} as const;

export const BurdenIcons: Record<string, LucideIcon> = {
  oneHanded: Hand,
  twoHanded: Grip,
} as const;

export const EquipmentSectionIcons: Record<string, LucideIcon> = {
  primary: Sword,
  secondary: Axe,
  armor: Shield,
  wheelchair: Compass, // Using Compass for wheelchair as Wheelchair icon doesn't exist in lucide-react
  custom: Gem,
} as const;

// ============================================================================
// INVENTORY ICONS
// ============================================================================
export const InventoryCategoryIcons: Record<string, LucideIcon> = {
  common: Wrench,
  consumable: FlaskConical,
  magical: Sparkles,
  weapon: Sword,
  armor: Shield,
  document: Scroll,
  tool: Wrench,
  food: Clover,
  artifact: Landmark,
  misc: Settings,
  default: Backpack,
} as const;

export const InventoryRarityIcons: Record<string, LucideIcon> = {
  common: Circle,
  uncommon: CircleDot,
  rare: Gem,
  epic: Crown,
} as const;

export const InventoryTierIcons: Record<string, LucideIcon> = {
  '1': Medal,
  '2': Award,
  '3': Trophy,
  '4': Gem,
} as const;

export const InventoryLocationIcons: Record<string, LucideIcon> = {
  backpack: Backpack,
  belt: Link2,
  equipped: Star,
  stored: Package,
} as const;

// ============================================================================
// ARMOR STATE ICONS
// ============================================================================
export const ArmorStateIcons: Record<string, LucideIcon> = {
  available: Shield,
  used: Zap,
  damaged: ShieldAlert,
  broken: ShieldX,
} as const;

// ============================================================================
// NOTE CATEGORY ICONS
// ============================================================================
export const NoteCategoryIcons: Record<string, LucideIcon> = {
  general: Pencil,
  session: Calendar,
  npc: User,
  location: Map,
  quest: Sword,
  lore: Library,
} as const;

// ============================================================================
// DOWNTIME MOVE ICONS
// ============================================================================
export const DowntimeMoveIcons: Record<string, LucideIcon> = {
  recovery: HeartPulse,
  crafting: Hammer,
  social: Handshake,
  exploration: Search,
  training: Activity,
} as const;

// ============================================================================
// FEATURE TYPE ICONS
// ============================================================================
export const FeatureTypeIcons: Record<string, LucideIcon> = {
  foundation: Landmark,
  specialization: Zap,
  mastery: Crown,
  default: Star,
} as const;

// ============================================================================
// RULES SECTION ICONS
// ============================================================================
export const RulesSectionIcons: Record<string, LucideIcon> = {
  characterCreation: User,
  rolling: Dice5,
  combat: Swords,
  camping: Tent,
  navigation: Compass,
  adversaries: Skull,
  worldbuilding: Map,
  socialContract: Handshake,
  safetyTools: Shield,
  worldInfo: Globe,
  coreStats: TrendingUp,
  hitPoints: Heart,
  inventory: Backpack,
  diceRolling: Dice5,
  actionTokens: Repeat,
  experiences: Target,
  domainCards: Sparkles,
  hopeAndFear: BatteryMedium,
  hope: Star,
  stress: AlertTriangle,
  attack: Sword,
  scenes: Clapperboard,
  weapons: Axe,
  thresholds: Layers,
  conditions: Puzzle,
  distances: Ruler,
  death: Skull,
  shortRest: Tent,
  longRest: Moon,
  levelUp: TrendingUp,
  gold: Coins,
  crafting: FlaskConical,
  challenges: Compass,
  downtimeMoves: Sparkles,
  features: Wrench,
  hazards: AlertTriangle,
  environments: Wind,
  adversaryDesign: Puzzle,
  statBlocks: FileText,
  roleplay: Theater,
  sessionZero: Sparkles,
  encounterDesign: Flame,
  scaling: Ruler,
  campaignBuilding: Map,
  lore: Library,
  settings: Settings,
  modules: Puzzle,
  communication: MessageSquare,
} as const;

// ============================================================================
// UI / STATUS ICONS
// ============================================================================
export const StatusIcons = {
  active: Zap,
  vault: Package,
  swap: ArrowLeftRight,
  search: Search,
  empty: Box,
  warning: AlertTriangle,
  unlock: Unlock,
  add: Plus,
  remove: X,
  check: Check,
  checkCircle: CheckCircle,
  expand: ChevronDown,
  collapse: ChevronRight,
  infinity: InfinityIcon,
  increase: Plus,
  decrease: Minus,
  equipped: Star,
  pinned: Pin,
  filter: LayoutGrid,
  clear: X,
  play: Play,
  gift: Gift,
  multiclass: Blend,
  loading: Loader,
  help: HelpCircle,
} as const;

// ============================================================================
// COST ICONS (for domain cards)
// ============================================================================
export const CostIcons = {
  recall: Zap,
  hope: Sparkle,
  stress: AlertTriangle,
} as const;

// ============================================================================
// CHARACTER CREATION STEP ICONS
// ============================================================================
export const CharacterCreationStepIcons: Record<string, LucideIcon> = {
  foundation: Sword,
  background: Scroll,
  finishing: Sparkles,
} as const;

// ============================================================================
// LEVEL UP ICONS
// ============================================================================
// LevelUpIcons uses TierIcons mapping
// Use TierIcons directly for level tier display

export const TierIcons: Record<string, LucideIcon> = {
  '1': Sprout,
  '2-4': Sword,
  '5-7': Flame,
  '8-10': Crown,
} as const;

// ============================================================================
// REST ICONS
// ============================================================================
export const RestIcons = {
  short: Timer,
  long: Tent,
} as const;

// ============================================================================
// CARD TYPE ICONS (for domain cards)
// ============================================================================
export const CardTypeIcons: Record<string, LucideIcon> = {
  Spell: Sparkles,
  Ability: Activity,
  Grimoire: BookOpen,
} as const;

// ============================================================================
// LOADOUT MODE ICONS
// ============================================================================
export const LoadoutModeIcons: Record<string, LucideIcon> = {
  standard: Library,
  allCards: Star,
  homebrew: Wrench,
} as const;

// ============================================================================
// HELPER: Get icon component with fallback
// ============================================================================
export function getIcon<T extends Record<string, LucideIcon>>(
  iconMap: T,
  key: string | undefined,
  fallbackKey = 'default'
): LucideIcon {
  if (key && key in iconMap) {
    return iconMap[key];
  }
  if (fallbackKey in iconMap) {
    return iconMap[fallbackKey];
  }
  return HelpCircle;
}

// ============================================================================
// EXPORT ALL LUCIDE ICONS FOR DIRECT USE
// ============================================================================
// Alias for Wheelchair (which doesn't exist in Lucide)
export const Wheelchair = Accessibility;

export {
  Accessibility,
  Activity,
  AlertTriangle,
  Anchor,
  Archive,
  ArrowLeftRight,
  ArrowRight,
  Award,
  Axe,
  Backpack,
  Ban,
  BarChart3,
  BatteryMedium,
  Bird,
  Blend,
  Bone,
  Book,
  BookOpen,
  BookText,
  Box,
  Brain,
  Bug,
  Calendar,
  Castle,
  Cat,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Circle,
  CircleDot,
  Clapperboard,
  ClipboardList,
  Cloud,
  Clover,
  Coins,
  Compass,
  Crosshair,
  Crown,
  Dice1,
  Dice5,
  Dog,
  Droplet,
  Feather,
  FileText,
  Flame,
  FlaskConical,
  Focus,
  Folder,
  FolderOpen,
  Footprints,
  Gem,
  Gift,
  Glasses,
  Globe,
  GraduationCap,
  Grip,
  Hammer,
  Hand,
  HandMetal,
  Handshake,
  Heart,
  HeartCrack,
  HeartPulse,
  HelpCircle,
  Home,
  House,
  InfinityIcon as Infinity,
  Landmark,
  Layers,
  LayoutGrid,
  Leaf,
  Library,
  Link2,
  Loader,
  Lock,
  Map,
  MapPin,
  Medal,
  MessageSquare,
  Minus,
  Moon,
  Mountain,
  Move,
  Music2,
  Package,
  Palette,
  PawPrint,
  Pencil,
  PersonStanding,
  Pin,
  Play,
  Plus,
  Power,
  Puzzle,
  Rabbit,
  RefreshCw,
  Repeat,
  Ruler,
  Save,
  Scale,
  Scroll,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Shirt,
  Shuffle,
  Skull,
  Slash,
  Snail,
  Spade,
  Sparkle,
  Sparkles,
  Speech,
  Sprout,
  Square,
  Star,
  Sun,
  Sword,
  Swords,
  Target,
  Tent,
  Theater,
  Timer,
  Trash2,
  TreePine,
  TrendingUp,
  Trophy,
  Unlock,
  User,
  Users,
  Wand2,
  Watch,
  Waves,
  Wind,
  Wrench,
  X,
  Zap,
};
