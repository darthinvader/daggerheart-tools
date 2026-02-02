import {
  BookOpen,
  Dna,
  Library,
  PenTool,
  Ruler,
  Scroll,
  Search,
  Shuffle,
  Sparkles,
  Star,
  Theater,
  Wrench,
} from 'lucide-react';

export interface IconProps {
  className?: string;
}

// Common icons used across multiple selectors - now using Lucide icons
export const SearchIcon = Search;
export const HomebrewIcon = Library; // Campaign-linked homebrew content
export const CustomIcon = PenTool; // Player-created custom content
export const LegacyHomebrewIcon = Wrench; // Legacy export for backwards compatibility
export const StandardIcon = BookOpen;
export const DescriptionIcon = Scroll;
export const FeatureIcon = Star;
export const SecondaryFeatureIcon = Sparkles;
export const TraitsIcon = Theater;

// Ancestry-specific icons
export const HeightIcon = Ruler;
export const LifespanIcon = Dna;
export const MixedIcon = Shuffle;
export const CharacteristicsIcon = Theater;
