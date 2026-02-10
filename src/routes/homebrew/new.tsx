/**
 * Create New Homebrew Content
 *
 * Page for creating new homebrew content with type selection.
 */
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  Beaker,
  BookOpen,
  GitFork,
  Home,
  Layers,
  Map,
  Package,
  Plus,
  Shield,
  Skull,
  Sword,
  Users,
} from 'lucide-react';

import { HomebrewFormDialog } from '@/components/homebrew';
import { useAuth } from '@/components/providers';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { HomebrewContentType } from '@/lib/schemas/homebrew';

import { useCreateHomebrewState } from './-use-create-homebrew-state';

export const Route = createFileRoute('/homebrew/new')({
  component: CreateHomebrew,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      forkFrom:
        typeof search.forkFrom === 'string' ? search.forkFrom : undefined,
    };
  },
});

const CONTENT_TYPE_OPTIONS: {
  type: HomebrewContentType;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}[] = [
  {
    type: 'adversary',
    label: 'Adversary',
    description: 'Create custom monsters, enemies, and NPCs for encounters',
    icon: Skull,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10 hover:bg-red-500/20',
  },
  {
    type: 'environment',
    label: 'Environment',
    description: 'Design locations and environmental challenges',
    icon: Map,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10 hover:bg-emerald-500/20',
  },
  {
    type: 'domain_card',
    label: 'Domain Card',
    description: 'Create abilities, spells, and techniques',
    icon: Layers,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10 hover:bg-purple-500/20',
  },
  {
    type: 'class',
    label: 'Class',
    description: 'Design a completely new character class',
    icon: Shield,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10 hover:bg-blue-500/20',
  },
  {
    type: 'subclass',
    label: 'Subclass',
    description: 'Create a subclass for an existing class',
    icon: BookOpen,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10 hover:bg-indigo-500/20',
  },
  {
    type: 'ancestry',
    label: 'Ancestry',
    description: 'Design a new ancestry with unique features',
    icon: Users,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10 hover:bg-amber-500/20',
  },
  {
    type: 'community',
    label: 'Community',
    description: 'Create a community background option',
    icon: Home,
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10 hover:bg-teal-500/20',
  },
  {
    type: 'equipment',
    label: 'Weapon/Armor',
    description: 'Design custom weapons and armor',
    icon: Sword,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10 hover:bg-orange-500/20',
  },
  {
    type: 'item',
    label: 'Item',
    description: 'Create general items, consumables, and magic items',
    icon: Package,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10 hover:bg-cyan-500/20',
  },
];

function CreateHomebrew() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { forkFrom } = Route.useSearch();

  const {
    forkSource,
    isForkSourceLoading,
    selectedType,
    isFormOpen,
    forkInitialData,
    isPending,
    handleTypeSelect,
    handleFormSubmit,
    handleFormDialogChange,
  } = useCreateHomebrewState({
    forkFrom,
    user,
    onNavigateAfterCreate: () => navigate({ to: '/homebrew' }),
    onNavigateAfterForkClose: () => navigate({ to: '/homebrew/browse' }),
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-dashed">
          <CardHeader className="text-center">
            <div className="bg-primary/10 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
              <Beaker className="text-primary size-8" />
            </div>
            <CardTitle className="text-2xl">Sign In Required</CardTitle>
            <CardDescription className="text-base">
              Please sign in to create homebrew content.
            </CardDescription>
          </CardHeader>
          <div className="flex justify-center p-6 pt-0">
            <Button size="lg" onClick={() => navigate({ to: '/login' })}>
              Sign In
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Show loading state when fetching fork source
  if (forkFrom && isForkSourceLoading) {
    return (
      <div className="container mx-auto flex h-96 items-center justify-center px-4 py-8">
        <div className="text-muted-foreground animate-pulse">
          Loading content to fork...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <span className="text-2xl font-bold">
          {forkSource ? (
            <GitFork className="mr-2 inline-block size-6 text-green-500" />
          ) : (
            <Plus className="text-primary mr-2 inline-block size-6" />
          )}
          {forkSource ? 'Fork Homebrew' : 'Create Homebrew'}
        </span>
        <p className="text-muted-foreground text-lg">
          {forkSource
            ? `Create your own version of "${forkSource.name}"`
            : 'Choose a content type to start creating'}
        </p>
      </div>

      {/* Content Type Grid - Only show if not forking */}
      {!forkSource && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CONTENT_TYPE_OPTIONS.map(
            ({ type, label, description, icon: Icon, color, bgColor }) => (
              <Card
                key={type}
                className={`cursor-pointer border-2 border-transparent transition-all hover:scale-[1.02] hover:shadow-md ${bgColor}`}
                onClick={() => handleTypeSelect(type)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div
                      className={`flex size-10 items-center justify-center rounded-lg ${bgColor}`}
                    >
                      <Icon className={`size-5 ${color}`} />
                    </div>
                    {label}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {description}
                  </CardDescription>
                </CardHeader>
              </Card>
            )
          )}
        </div>
      )}

      {/* Form Dialog */}
      {selectedType && (
        <HomebrewFormDialog
          open={isFormOpen}
          onOpenChange={handleFormDialogChange}
          contentType={selectedType}
          initialData={forkInitialData}
          onSubmit={handleFormSubmit}
          isSubmitting={isPending}
        />
      )}
    </div>
  );
}
