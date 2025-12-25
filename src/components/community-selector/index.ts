// Types
export type {
  CommunityMode,
  CommunitySelection,
  HomebrewCommunity,
} from '@/lib/schemas/identity';

// Main selector
export { CommunityModeTabs } from './community-mode-tabs';
export { CommunitySelector } from './community-selector';

// Standard community components
export { CommunityCard } from './community-card';
export { CommunityFeatureDisplay } from './community-feature-display';
export { CommunitySearch } from './community-search';
export { StandardCommunityList } from './standard-community-list';

// Homebrew components
export { HomebrewCommunityForm } from './homebrew-community-form';

// Utilities (icons come from shared/icons)
export {
  COMMUNITY_COLORS,
  COMMUNITY_EMOJIS,
  getCommunityColors,
  getCommunityEmoji,
} from './community-icons';
