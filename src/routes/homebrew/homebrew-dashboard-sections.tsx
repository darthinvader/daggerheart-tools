/**
 * Homebrew Dashboard Section Components
 *
 * Extracted section components for HomebrewDashboard to reduce complexity.
 */
import { Beaker, Folder, Loader2 } from 'lucide-react';
import type { RefObject } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// ─────────────────────────────────────────────────────────────────────────────
// Sign In Required Card
// ─────────────────────────────────────────────────────────────────────────────

interface SignInRequiredCardProps {
  onSignIn: () => void;
}

export function SignInRequiredCard({ onSignIn }: SignInRequiredCardProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="border-dashed">
        <CardHeader className="text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
            <Beaker className="text-primary size-8" />
          </div>
          <CardTitle className="text-2xl">Sign In Required</CardTitle>
          <CardDescription className="text-base">
            Please sign in to access your homebrew content.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-6">
          <Button size="lg" onClick={onSignIn}>
            Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Infinite Scroll Loader
// ─────────────────────────────────────────────────────────────────────────────

interface InfiniteScrollLoaderProps {
  loadMoreRef: RefObject<HTMLDivElement | null>;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  hasContent: boolean;
}

export function InfiniteScrollLoader({
  loadMoreRef,
  isFetchingNextPage,
  hasNextPage,
  hasContent,
}: InfiniteScrollLoaderProps) {
  return (
    <div ref={loadMoreRef} className="py-4 text-center">
      {isFetchingNextPage && (
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="size-5 animate-spin" />
          <span className="text-muted-foreground">Loading more...</span>
        </div>
      )}
      {!hasNextPage && hasContent && (
        <p className="text-muted-foreground text-sm">
          You've reached the end of your homebrew content.
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Create Collection Dialog
// ─────────────────────────────────────────────────────────────────────────────

interface CreateCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onNameChange: (name: string) => void;
  description: string;
  onDescriptionChange: (description: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function CreateCollectionDialog({
  open,
  onOpenChange,
  name,
  onNameChange,
  description,
  onDescriptionChange,
  onSubmit,
  isSubmitting,
}: CreateCollectionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Folder className="size-5" /> Create Collection
          </DialogTitle>
          <DialogDescription>
            Create a new collection to organize your homebrew content.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="collection-name">Name</Label>
            <Input
              id="collection-name"
              placeholder="My Collection"
              value={name}
              onChange={e => onNameChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="collection-description">
              Description (optional)
            </Label>
            <Input
              id="collection-description"
              placeholder="A brief description..."
              value={description}
              onChange={e => onDescriptionChange(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={!name.trim() || isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
