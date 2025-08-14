export type CommunityMode = 'standard' | 'homebrew';

export type HomebrewCommunity = {
  name: string;
  description?: string;
  commonTraits?: string[];
  feature: { name: string; description: string };
};

export type CommunityDetails = {
  type?: CommunityMode;
  homebrew?: HomebrewCommunity;
};
