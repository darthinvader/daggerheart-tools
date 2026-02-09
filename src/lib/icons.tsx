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
  Beaker,
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
// CARD TYPE ICONS (for domain cards)
// ============================================================================
export const CardTypeIcons: Record<string, LucideIcon> = {
  Spell: Sparkles,
  Ability: Activity,
  Grimoire: BookOpen,
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
  Beaker,
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
