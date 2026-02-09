// Dialog for adding a new audio track to the soundboard via URL.

import { Plus } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { parseTrackUrl } from '@/features/soundboard/track-url-utils';
import type { TrackCategory } from '@/lib/schemas/soundboard';

function UrlHelpText() {
  return (
    <p className="text-muted-foreground text-xs">
      Supports YouTube, SoundCloud, or direct links to audio files. Try{' '}
      <a
        href="https://freesound.org"
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        Freesound.org
      </a>
      ,{' '}
      <a
        href="https://incompetech.com"
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        Incompetech
      </a>
      , or{' '}
      <a
        href="https://tabletopaudio.com"
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        Tabletop Audio
      </a>{' '}
      for free TTRPG audio.
    </p>
  );
}

interface AddTrackDialogProps {
  onAdd: (track: {
    name: string;
    url: string;
    source: 'youtube' | 'soundcloud' | 'direct';
    category: TrackCategory;
    tags: string[];
    loop: boolean;
  }) => void;
}

export default function AddTrackDialog({ onAdd }: AddTrackDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<TrackCategory>('ambient');
  const [tags, setTags] = useState('');
  const [loop, setLoop] = useState(false);
  const [urlError, setUrlError] = useState('');

  const reset = useCallback(() => {
    setName('');
    setUrl('');
    setCategory('ambient');
    setTags('');
    setLoop(false);
    setUrlError('');
  }, []);

  const handleSubmit = useCallback(() => {
    if (!name.trim() || !url.trim()) return;

    try {
      new URL(url);
    } catch {
      setUrlError('Please enter a valid URL');
      return;
    }

    const parsed = parseTrackUrl(url);

    onAdd({
      name: name.trim(),
      url: parsed.url,
      source: parsed.source,
      category,
      tags: tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
      loop,
    });

    reset();
    setOpen(false);
  }, [name, url, category, tags, loop, onAdd, reset]);

  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUrl(e.target.value);
      setUrlError('');
    },
    []
  );

  const handleCategoryChange = useCallback(
    (v: string) => setCategory(v as TrackCategory),
    []
  );

  const handleCancel = useCallback(() => {
    reset();
    setOpen(false);
  }, [reset]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" aria-label="Add track">
          <Plus className="mr-1 size-4" />
          Add Track
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Audio Track</DialogTitle>
          <DialogDescription>
            Paste a YouTube, SoundCloud, or direct audio URL (MP3, OGG, WAV).
            CC0 / royalty-free sources recommended.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="track-name">Name</Label>
            <Input
              id="track-name"
              placeholder="Tavern Ambience"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="track-url">URL</Label>
            <Input
              id="track-url"
              placeholder="https://youtube.com/watch?v=... or direct .mp3 link"
              value={url}
              onChange={handleUrlChange}
            />
            {urlError && <p className="text-destructive text-xs">{urlError}</p>}
            <UrlHelpText />
          </div>

          <div className="space-y-2">
            <Label htmlFor="track-category">Category</Label>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger id="track-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ambient">🌧️ Ambient</SelectItem>
                <SelectItem value="music">🎵 Music</SelectItem>
                <SelectItem value="sfx">⚡ SFX</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="track-tags">Tags (comma-separated)</Label>
            <Input
              id="track-tags"
              placeholder="tavern, rain, forest"
              value={tags}
              onChange={e => setTags(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch id="track-loop" checked={loop} onCheckedChange={setLoop} />
            <Label htmlFor="track-loop">Loop by default</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim() || !url.trim()}>
            Add Track
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
