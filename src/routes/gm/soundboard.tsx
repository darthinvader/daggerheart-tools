// GM Soundboard — Audio/Music Manager for ambient music and SFX
// Route: /gm/soundboard

import {
  createFileRoute,
  type ErrorComponentProps,
} from '@tanstack/react-router';
import { Music } from 'lucide-react';

import SoundboardPanel from '@/components/soundboard/soundboard-panel';
import { RouteErrorFallback } from '@/components/ui/route-error-fallback';

export const Route = createFileRoute('/gm/soundboard')({
  component: SoundboardPage,
  errorComponent: ({ error }: ErrorComponentProps) => (
    <RouteErrorFallback error={error} />
  ),
});

function SoundboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <span className="text-2xl font-bold">
          <Music className="mr-2 inline-block size-6 text-pink-500" />
          Soundboard
        </span>
        <p className="text-muted-foreground mt-2">
          Manage ambient music, background tracks, and sound effects for your
          sessions. Add YouTube, SoundCloud, or direct audio links — no files
          uploaded to our servers.
        </p>
      </div>

      <SoundboardPanel />
    </div>
  );
}
