import {
  BookOpen,
  ChevronDown,
  Dices,
  Menu,
  Plus,
  Scroll,
  Users,
} from 'lucide-react';

import * as React from 'react';

import { Link, useLocation } from '@tanstack/react-router';

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
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export interface NavLink {
  to: string;
  label: string;
  icon?: React.ReactNode;
  children?: NavLink[];
}

interface NavbarProps {
  links?: NavLink[];
  brandName?: string;
  brandShortName?: string;
}

const defaultLinks: NavLink[] = [
  {
    to: '/demonstration',
    label: 'Demos',
    icon: <Dices className="size-4" />,
    children: [
      {
        to: '/demonstration',
        label: '📋 All Demos',
        icon: <BookOpen className="size-4" />,
      },
      {
        to: '/character-demo',
        label: '📜 Character Sheet',
        icon: <Scroll className="size-4" />,
      },
    ],
  },
  {
    to: '/character',
    label: 'Character',
    children: [
      {
        to: '/character',
        label: 'View All',
        icon: <Users className="size-4" />,
      },
      {
        to: '/character/new',
        label: 'New Character',
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

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <nav className="container mx-auto flex h-14 items-center px-4">
        <Link
          to="/"
          className="text-primary mr-6 flex items-center font-bold"
          aria-label="Home"
        >
          {brandName}
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            {links.map(link =>
              link.children ? (
                <NavigationMenuItem key={link.to}>
                  <NavigationMenuTrigger>{link.label}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-48 gap-1 p-2">
                      {link.children.map(child => (
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
                      ))}
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
      </nav>
    </header>
  );
}

function MobileNavbar({ links, brandShortName }: NavbarInternalProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <nav className="flex h-14 items-center justify-between px-4">
        <Link
          to="/"
          className="text-primary flex items-center font-bold"
          aria-label="Home"
        >
          {brandShortName}
        </Link>
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
  const [openItems, setOpenItems] = React.useState<Set<string>>(new Set());

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
