/**
 * CharacterSettingsDialog
 *
 * Gear icon in the header that opens a dialog with toggles for optional
 * character sheet sections (Beastform, Companion). Mirrors the campaign
 * section pattern: button in header → modal with controls.
 */

import { Heart, PawPrint, Settings2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { Switch } from '@/components/ui/switch';

interface CharacterSettingsDialogProps {
  beastformEnabled: boolean;
  companionEnabled: boolean;
  onBeastformEnabledChange: (v: boolean) => void;
  onCompanionEnabledChange: (v: boolean) => void;
  /** Druid class → beastform always available */
  isNativeDruid: boolean;
  /** Class/subclass grants companion feature */
  hasNativeCompanion: boolean;
  readOnly: boolean;
}

export function CharacterSettingsDialog({
  beastformEnabled,
  companionEnabled,
  onBeastformEnabledChange,
  onCompanionEnabledChange,
  isNativeDruid,
  hasNativeCompanion,
  readOnly,
}: CharacterSettingsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <SmartTooltip content="Character settings">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => setIsOpen(true)}
          aria-label="Character settings"
        >
          <Settings2 className="size-3.5" />
        </Button>
      </SmartTooltip>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Character Settings</DialogTitle>
            <DialogDescription>
              Enable optional sections on your character sheet.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Beastform toggle */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <PawPrint className="size-4 text-emerald-500" aria-hidden />
                <Label htmlFor="settings-beastform" className="text-sm">
                  Beastform
                </Label>
                {isNativeDruid && (
                  <span className="text-muted-foreground text-xs">(Druid)</span>
                )}
              </div>
              <Switch
                id="settings-beastform"
                checked={isNativeDruid || beastformEnabled}
                disabled={isNativeDruid || readOnly}
                onCheckedChange={onBeastformEnabledChange}
              />
            </div>

            {/* Companion toggle */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Heart className="size-4 text-rose-500" aria-hidden />
                <Label htmlFor="settings-companion" className="text-sm">
                  Companion
                </Label>
                {hasNativeCompanion && (
                  <span className="text-muted-foreground text-xs">
                    (Class Feature)
                  </span>
                )}
              </div>
              <Switch
                id="settings-companion"
                checked={hasNativeCompanion || companionEnabled}
                disabled={hasNativeCompanion || readOnly}
                onCheckedChange={onCompanionEnabledChange}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
