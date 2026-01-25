import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import {
  Backpack,
  ChevronDown,
  Compass,
  Crown,
  Dice5,
  FolderOpen,
  Home,
  LogIn,
  Map,
  Menu,
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
import * as React from 'react';

import { UserMenu } from '@/components/auth';
import { useAuth } from '@/components/providers';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCreateCharacterMutation } from '@/features/characters/use-characters-query';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export interface NavLink {
  to: string;
  label: string;
  icon?: React.ReactNode;
  children?: NavLink[];
  /** If true, this link triggers character creation instead of navigation */
  isCreateCharacter?: boolean;
}

interface NavbarProps {
  links?: NavLink[];
  brandName?: string;
  brandShortName?: string;
}

const defaultLinks: NavLink[] = [
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
      {
        to: '/gm/',
        label: 'GM Dashboard',
        icon: <Crown className="size-4" />,
      },
      {
        to: '/gm/campaigns',
        label: 'My Campaigns',
        icon: <FolderOpen className="size-4" />,
      },
      {
        to: '/gm/campaigns/new',
        label: 'New Campaign',
        icon: <Plus className="size-4" />,
      },
    ],
  },
];

export function Navbar({
  links = defaultLinks,
  brandName = 'Daggerheart Tools',
  brandShortName = 'DH',
}: NavbarProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <MobileNavbar
        links={links}
        brandName={brandName}
        brandShortName={brandShortName}
      />
    );
  }

  return (
    <DesktopNavbar
      links={links}
      brandName={brandName}
      brandShortName={brandShortName}
    />
  );
}

interface NavbarInternalProps {
  links: NavLink[];
  brandName: string;
  brandShortName: string;
}

function DesktopNavbar({ links, brandName }: NavbarInternalProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const createMutation = useCreateCharacterMutation();

  const handleCreateCharacter = async () => {
    try {
      const data = await createMutation.mutateAsync(undefined);
      await navigate({
        to: '/character/$characterId',
        params: { characterId: data.id },
        search: { tab: 'quick' },
      });
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <nav className="container mx-auto flex h-14 items-center px-4">
        <Link
          to="/"
          className="text-primary mr-6 flex items-center font-bold"
          aria-label="Home"
        >
          {brandName}
        </Link>

        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            {links.map(link =>
              link.children ? (
                <NavigationMenuItem key={link.to}>
                  <NavigationMenuTrigger>{link.label}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-48 gap-1 p-2">
                      {link.children.map(child =>
                        child.isCreateCharacter ? (
                          <li key={child.to}>
                            <button
                              onClick={handleCreateCharacter}
                              disabled={createMutation.isPending}
                              className={cn(
                                'hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 rounded-md p-2 text-left text-sm transition-colors',
                                createMutation.isPending && 'opacity-50'
                              )}
                            >
                              {child.icon}
                              {createMutation.isPending
                                ? 'Creating...'
                                : child.label}
                            </button>
                          </li>
                        ) : (
                          <li key={child.to}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={child.to}
                                className={cn(
                                  'hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md p-2 text-sm transition-colors',
                                  location.pathname === child.to && 'bg-accent'
                                )}
                              >
                                {child.icon}
                                {child.label}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        )
                      )}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={link.to}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={link.to}
                      className={navigationMenuTriggerStyle()}
                      data-active={
                        location.pathname === link.to ||
                        location.pathname.startsWith(`${link.to}/`)
                      }
                    >
                      {link.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto flex items-center gap-2">
          <AuthNavItems />
        </div>
      </nav>
    </header>
  );
}

function AuthNavItems() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="bg-muted size-8 animate-pulse rounded-full" />;
  }

  if (isAuthenticated) {
    return <UserMenu />;
  }

  return (
    <Button asChild variant="outline" size="sm">
      <Link to="/login">
        <LogIn className="mr-2 size-4" />
        Sign In
      </Link>
    </Button>
  );
}

function MobileNavbar({ links, brandShortName }: NavbarInternalProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <nav className="flex h-14 items-center justify-between px-4">
        <Link
          to="/"
          className="text-primary flex items-center font-bold"
          aria-label="Home"
        >
          {brandShortName}
        </Link>

        <div className="mr-2 ml-auto flex items-center">
          <AuthNavItems />
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader className="border-b pb-4">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <MobileNavContent
              links={links}
              onLinkClick={() => setOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}

function MobileNavContent({
  links,
  onLinkClick,
}: {
  links: NavLink[];
  onLinkClick: () => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const createMutation = useCreateCharacterMutation();
  const [openItems, setOpenItems] = React.useState<Set<string>>(new Set());

  const handleCreateCharacter = async () => {
    try {
      const data = await createMutation.mutateAsync(undefined);
      onLinkClick();
      await navigate({
        to: '/character/$characterId',
        params: { characterId: data.id },
        search: { tab: 'quick' },
      });
    } catch {
      // Error handled by mutation
    }
  };

  const toggleItem = (to: string) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(to)) {
        next.delete(to);
      } else {
        next.add(to);
      }
      return next;
    });
  };

  return (
    <nav className="flex flex-col gap-1 py-4">
      {links.map(link =>
        link.children ? (
          <div key={link.to}>
            <button
              onClick={() => toggleItem(link.to)}
              className="hover:bg-accent hover:text-accent-foreground flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors"
            >
              <span>{link.label}</span>
              <ChevronDown
                className={cn(
                  'size-4 transition-transform',
                  openItems.has(link.to) && 'rotate-180'
                )}
              />
            </button>
            {openItems.has(link.to) && (
              <div className="ml-3 flex flex-col gap-1 border-l pl-3">
                {link.children.map(child => {
                  if (child.isCreateCharacter) {
                    return (
                      <button
                        key={child.to}
                        onClick={handleCreateCharacter}
                        disabled={createMutation.isPending}
                        className={cn(
                          'text-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors',
                          createMutation.isPending && 'opacity-50'
                        )}
                      >
                        {child.icon}
                        <span>
                          {createMutation.isPending
                            ? 'Creating...'
                            : child.label}
                        </span>
                      </button>
                    );
                  }
                  const isActive = location.pathname === child.to;
                  return (
                    <Link
                      key={child.to}
                      to={child.to}
                      onClick={onLinkClick}
                      className={cn(
                        'text-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                        isActive && 'bg-accent text-accent-foreground'
                      )}
                    >
                      {child.icon}
                      <span>{child.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <Link
            key={link.to}
            to={link.to}
            onClick={onLinkClick}
            className={cn(
              'hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors',
              location.pathname === link.to &&
                'bg-accent text-accent-foreground'
            )}
          >
            {link.label}
          </Link>
        )
      )}
    </nav>
  );
}
