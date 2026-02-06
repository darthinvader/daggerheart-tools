import { AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface RouteErrorFallbackProps {
  error: Error;
}

/**
 * Shared error fallback for route errorComponent props.
 * Displays a user-friendly error message with a reload action.
 */
export function RouteErrorFallback({ error }: RouteErrorFallbackProps) {
  console.error('[RouteError]', error);

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <AlertTriangle className="text-destructive h-10 w-10" />
      <p className="text-destructive text-center font-medium">
        Something went wrong
      </p>
      <p className="text-muted-foreground max-w-md text-center text-sm">
        An unexpected error occurred. Please try reloading the page.
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.location.reload()}
      >
        Reload page
      </Button>
    </div>
  );
}
