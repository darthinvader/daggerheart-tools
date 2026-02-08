// Dialog for saving the current playing state as a preset, or loading an existing one.

import { BookOpen, Save, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type {
  SoundboardPreset,
  SoundboardTrack,
} from '@/lib/schemas/soundboard';

interface PresetManagerProps {
  presets: SoundboardPreset[];
  tracks: SoundboardTrack[];
  onSave: (name: string, description: string) => void;
  onLoad: (preset: SoundboardPreset) => void;
  onDelete: (presetId: string) => void;
}

export default function PresetManager({
  presets,
  tracks,
  onSave,
  onLoad,
  onDelete,
}: PresetManagerProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = useCallback(() => {
    if (!name.trim()) return;
    onSave(name.trim(), description.trim());
    setName('');
    setDescription('');
  }, [name, description, onSave]);

  const getTrackName = useCallback(
    (trackId: string) =>
      tracks.find(t => t.id === trackId)?.name ?? 'Unknown Track',
    [tracks]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" aria-label="Manage presets">
          <BookOpen className="mr-1 size-4" />
          Scenes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Sound Scenes</DialogTitle>
          <DialogDescription>
            Save or load combinations of tracks as reusable scenes (e.g.
            &quot;Dark Forest&quot;, &quot;Tavern Night&quot;).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Save new preset */}
          <div className="space-y-2 rounded-lg border p-3">
            <p className="text-sm font-medium">Save Current Mix</p>
            <div className="space-y-2">
              <Label htmlFor="preset-name">Scene Name</Label>
              <Input
                id="preset-name"
                placeholder="Dark Forest at Night"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preset-desc">Description (optional)</Label>
              <Input
                id="preset-desc"
                placeholder="Ambient rain + owl SFX"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!name.trim()}
              className="w-full"
            >
              <Save className="mr-1 size-4" />
              Save Scene
            </Button>
          </div>

          {/* Existing presets */}
          {presets.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Saved Scenes</p>
              <div className="max-h-60 space-y-2 overflow-y-auto">
                {presets.map(preset => (
                  <div
                    key={preset.id}
                    className="flex items-center justify-between rounded-lg border p-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {preset.name}
                      </p>
                      {preset.description && (
                        <p className="text-muted-foreground truncate text-xs">
                          {preset.description}
                        </p>
                      )}
                      <p className="text-muted-foreground text-[10px]">
                        {preset.tracks.length} track
                        {preset.tracks.length !== 1 ? 's' : ''}:{' '}
                        {preset.tracks
                          .map(t => getTrackName(t.trackId))
                          .join(', ')}
                      </p>
                    </div>
                    <div className="ml-2 flex shrink-0 gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          onLoad(preset);
                          setOpen(false);
                        }}
                      >
                        Load
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive/70 hover:text-destructive size-8"
                        onClick={() => onDelete(preset.id)}
                        aria-label={`Delete ${preset.name}`}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {presets.length === 0 && (
            <p className="text-muted-foreground text-center text-sm">
              No saved scenes yet. Add tracks, adjust volumes, then save the
              mix.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
