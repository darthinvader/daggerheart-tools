/**
 * Entity Modal Sections
 *
 * Extracted section components for entity picker modals to reduce complexity.
 */
import { Map, Scroll, User } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import type {
  CampaignLocation,
  CampaignNPC,
  CampaignQuest,
} from '@/lib/schemas/campaign';

// =====================================================================================
// NPC List Section
// =====================================================================================

interface NPCListItemProps {
  npc: CampaignNPC;
  isSelected: boolean;
  onSelect: () => void;
  statusColor: string;
}

function NPCListItem({
  npc,
  isSelected,
  onSelect,
  statusColor,
}: NPCListItemProps) {
  return (
    <button
      key={npc.id}
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors ${
        isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
      }`}
    >
      <User className="h-5 w-5 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="font-medium">{npc.name}</div>
        {npc.titleRole && (
          <div className="text-sm opacity-80">{npc.titleRole}</div>
        )}
      </div>
      <Badge variant="outline" className={`text-xs ${statusColor}`}>
        {npc.status}
      </Badge>
    </button>
  );
}

interface NPCListSectionProps {
  npcs: CampaignNPC[];
  selectedNpc: CampaignNPC | null;
  onSelectNpc: (npc: CampaignNPC | null) => void;
  getStatusColor: (status: string) => string;
  emptyMessage?: string;
}

export function NPCListSection({
  npcs,
  selectedNpc,
  onSelectNpc,
  getStatusColor,
  emptyMessage = 'No matching NPCs',
}: NPCListSectionProps) {
  return (
    <ScrollArea className="h-[200px] rounded-md border p-2">
      {npcs.length === 0 ? (
        <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-2">
          {npcs.map(npc => (
            <NPCListItem
              key={npc.id}
              npc={npc}
              isSelected={selectedNpc?.id === npc.id}
              onSelect={() =>
                onSelectNpc(selectedNpc?.id === npc.id ? null : npc)
              }
              statusColor={getStatusColor(npc.status)}
            />
          ))}
        </div>
      )}
    </ScrollArea>
  );
}

// =====================================================================================
// NPC Involvement Fields Section
// =====================================================================================

interface NPCInvolvementFieldsProps {
  role: string;
  actionsTaken: string;
  notes: string;
  onRoleChange: (value: string) => void;
  onActionsTakenChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  locations: CampaignLocation[];
  selectedLocations: string[];
  onToggleLocation: (id: string) => void;
  quests: CampaignQuest[];
  selectedQuests: string[];
  onToggleQuest: (id: string) => void;
}

export function NPCInvolvementFieldsSection({
  role,
  actionsTaken,
  notes,
  onRoleChange,
  onActionsTakenChange,
  onNotesChange,
  locations,
  selectedLocations,
  onToggleLocation,
  quests,
  selectedQuests,
  onToggleQuest,
}: NPCInvolvementFieldsProps) {
  return (
    <>
      <Separator />
      <div className="space-y-4">
        <h4 className="font-medium">Involvement Details</h4>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs">Role</Label>
            <Input
              value={role}
              onChange={e => onRoleChange(e.target.value)}
              placeholder="e.g., Quest Giver, Antagonist..."
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Actions Taken</Label>
            <Input
              value={actionsTaken}
              onChange={e => onActionsTakenChange(e.target.value)}
              placeholder="What did they do?"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Notes</Label>
          <Textarea
            value={notes}
            onChange={e => onNotesChange(e.target.value)}
            placeholder="Additional notes..."
            rows={2}
          />
        </div>

        {locations.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs">Locations</Label>
            <div className="flex flex-wrap gap-2">
              {locations.map(location => (
                <Badge
                  key={location.id}
                  variant={
                    selectedLocations.includes(location.id)
                      ? 'default'
                      : 'outline'
                  }
                  className="cursor-pointer"
                  onClick={() => onToggleLocation(location.id)}
                >
                  <Map className="mr-1 h-3 w-3" />
                  {location.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {quests.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs">Quests</Label>
            <div className="flex flex-wrap gap-2">
              {quests.map(quest => (
                <Badge
                  key={quest.id}
                  variant={
                    selectedQuests.includes(quest.id) ? 'default' : 'outline'
                  }
                  className="cursor-pointer"
                  onClick={() => onToggleQuest(quest.id)}
                >
                  <Scroll className="mr-1 h-3 w-3" />
                  {quest.title}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
