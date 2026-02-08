import {
  Backpack,
  Beaker,
  Calendar,
  Compass,
  Crown,
  Dice5,
  FolderOpen,
  Globe,
  Home,
  Map,
  Music,
  Plus,
  Scroll,
  Shield,
  Skull,
  Sparkles,
  Sword,
  Swords,
  Tent,
  TreePine,
  User,
  Users,
} from 'lucide-react';
import type { ReactNode } from 'react';

export interface NavLink {
  to: string;
  label: string;
  icon?: ReactNode;
  children?: NavLink[];
  /** If true, this link triggers character creation instead of navigation */
  isCreateCharacter?: boolean;
}

export const defaultNavLinks: NavLink[] = [
  {
    to: '/character',
    label: 'Characters',
    children: [
      {
        to: '/character/',
        label: 'View All',
        icon: <Users className="size-4" />,
      },
      {
        to: '/character/new',
        label: 'New Character',
        icon: <Plus className="size-4" />,
        isCreateCharacter: true,
      },
    ],
  },
  {
    to: '/references',
    label: 'References',
    children: [
      {
        to: '/references/equipment',
        label: 'Equipment',
        icon: <Sword className="size-4" />,
      },
      {
        to: '/references/adversaries',
        label: 'Adversaries',
        icon: <Skull className="size-4" />,
      },
      {
        to: '/references/environments',
        label: 'Environments',
        icon: <TreePine className="size-4" />,
      },
      {
        to: '/references/classes',
        label: 'Classes & Subclasses',
        icon: <Shield className="size-4" />,
      },
      {
        to: '/references/ancestries',
        label: 'Ancestries',
        icon: <Users className="size-4" />,
      },
      {
        to: '/references/communities',
        label: 'Communities',
        icon: <Home className="size-4" />,
      },
      {
        to: '/references/domain-cards',
        label: 'Domain Cards',
        icon: <Sparkles className="size-4" />,
      },
      {
        to: '/references/inventory',
        label: 'Inventory Items',
        icon: <Backpack className="size-4" />,
      },
    ],
  },
  {
    to: '/rules',
    label: 'Rules',
    children: [
      {
        to: '/rules/core-mechanics',
        label: 'Core Mechanics',
        icon: <Dice5 className="size-4" />,
      },
      {
        to: '/rules/character-creation',
        label: 'Character Creation',
        icon: <User className="size-4" />,
      },
      {
        to: '/rules/combat',
        label: 'Combat & Consequences',
        icon: <Swords className="size-4" />,
      },
      {
        to: '/rules/downtime-advancement',
        label: 'Downtime & Advancement',
        icon: <Tent className="size-4" />,
      },
      {
        to: '/rules/gm-guide',
        label: 'GM Guide',
        icon: <Compass className="size-4" />,
      },
      {
        to: '/rules/adversaries-environments',
        label: 'Adversaries & Environments',
        icon: <Skull className="size-4" />,
      },
      {
        to: '/rules/campaign-frames',
        label: 'Campaign Frames',
        icon: <Map className="size-4" />,
      },
      {
        to: '/rules/',
        label: 'Rules Overview',
        icon: <Scroll className="size-4" />,
      },
    ],
  },
  {
    to: '/gm',
    label: 'GM Tools',
    children: [
      { to: '/gm/', label: 'GM Dashboard', icon: <Crown className="size-4" /> },
      {
        to: '/gm/campaigns',
        label: 'My Campaigns',
        icon: <FolderOpen className="size-4" />,
      },
      {
        to: '/gm/saved-encounters',
        label: 'Combat Encounters',
        icon: <Swords className="size-4" />,
      },
      {
        to: '/gm/scheduling',
        label: 'Session Scheduling',
        icon: <Calendar className="size-4" />,
      },
      {
        to: '/gm/soundboard',
        label: 'Soundboard',
        icon: <Music className="size-4" />,
      },
      {
        to: '/gm/campaigns/new',
        label: 'New Campaign',
        icon: <Plus className="size-4" />,
      },
    ],
  },
  {
    to: '/homebrew',
    label: 'Homebrew',
    children: [
      {
        to: '/homebrew/',
        label: 'My Homebrew',
        icon: <Beaker className="size-4" />,
      },
      {
        to: '/homebrew/browse',
        label: 'Browse Public',
        icon: <Globe className="size-4" />,
      },
      {
        to: '/homebrew/new',
        label: 'Create New',
        icon: <Plus className="size-4" />,
      },
    ],
  },
];
