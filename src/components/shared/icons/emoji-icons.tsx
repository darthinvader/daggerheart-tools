import type { ReactNode } from 'react';

export interface IconProps {
  className?: string;
}

type EmojiIconFactory = (emoji: string) => (props: IconProps) => ReactNode;

const createEmojiIcon: EmojiIconFactory = emoji =>
  function EmojiIcon({ className }: IconProps) {
    return (
      <span className={className} aria-hidden="true">
        {emoji}
      </span>
    );
  };

// Common icons used across multiple selectors
export const SearchIcon = createEmojiIcon('🔍');
export const HomebrewIcon = createEmojiIcon('🛠️');
export const StandardIcon = createEmojiIcon('📖');
export const DescriptionIcon = createEmojiIcon('📜');
export const FeatureIcon = createEmojiIcon('⭐');
export const SecondaryFeatureIcon = createEmojiIcon('✨');
export const TraitsIcon = createEmojiIcon('🎭');

// Ancestry-specific icons
export const HeightIcon = createEmojiIcon('📏');
export const LifespanIcon = createEmojiIcon('🧬');
export const MixedIcon = createEmojiIcon('🔀');
export const CharacteristicsIcon = createEmojiIcon('🎭');

// Class-specific icons
export const ClassIcon = createEmojiIcon('📚');
export const CustomIcon = createEmojiIcon('🎨');

// Domain-specific icons
export const DomainIcon = createEmojiIcon('🌟');
