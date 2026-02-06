import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { LogIn, Menu } from 'lucide-react';
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
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useCreateCharacterMutation } from '@/features/characters/use-characters-query';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

import { MobileNavContent } from './mobile-nav-content';
import { defaultNavLinks, type NavLink } from './nav-links';

export type { NavLink };

interface NavbarProps {
  links?: NavLink[];
  brandName?: string;
  brandShortName?: string;
}

export function Navbar({
  links = defaultNavLinks,
  brandName = 'Daggerheart Tools',
  brandShortName = 'DH',
}: NavbarProps) {
  const isMobile = useIsMobile();
  if (isMobile)
    return (
      <MobileNavbar
        links={links}
        brandName={brandName}
        brandShortName={brandShortName}
      />
    );
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
                                  location.pathname === child.to ||
                                    location.pathname.startsWith(`${child.to}/`)
                                    ? 'bg-accent'
                                    : ''
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
          <ThemeToggle />
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

        <div className="mr-2 ml-auto flex items-center gap-2">
          <ThemeToggle />
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
