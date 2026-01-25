import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { ChevronDown } from 'lucide-react';
import * as React from 'react';

import { useCreateCharacterMutation } from '@/features/characters/use-characters-query';
import { cn } from '@/lib/utils';

import type { NavLink } from './nav-links';

interface MobileNavContentProps {
  links: NavLink[];
  onLinkClick: () => void;
}

export function MobileNavContent({
  links,
  onLinkClick,
}: MobileNavContentProps) {
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
      if (next.has(to)) next.delete(to);
      else next.add(to);
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
