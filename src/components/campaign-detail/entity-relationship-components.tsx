// Shared components for editing entity relationships (allies, enemies, linked entities)
// Used by NPC, Organization, and other entity cards

import { Building2, Plus, User } from 'lucide-react';
import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

// =====================================================================================
// Types
// =====================================================================================

interface EntityItem {
  id: string;
  name: string;
}

interface RelationshipBadgeListProps {
  /** Label text for the section */
  label: string;
  /** Entity items to display as toggleable badges */
  items: EntityItem[];
  /** Currently selected IDs */
  selectedIds: string[];
  /** Called when an item is toggled */
  onToggle: (id: string) => void;
  /** Called when add button is clicked */
  onAddClick: () => void;
  /** Text for add button */
  addButtonLabel: string;
  /** Icon to display in badges */
  icon: ReactNode;
  /** Badge variant when selected */
  selectedVariant?: 'default' | 'destructive';
  /** Message when no items available */
  emptyMessage?: string;
}

// =====================================================================================
// RelationshipBadgeList Component
// =====================================================================================

/**
 * Displays a list of toggleable badges for entity relationships.
 * Used for ally/enemy NPCs and Organizations in NPC and Organization cards.
 */
export function RelationshipBadgeList({
  label,
  items,
  selectedIds,
  onToggle,
  onAddClick,
  addButtonLabel,
  icon,
  selectedVariant = 'default',
  emptyMessage = 'None available',
}: RelationshipBadgeListProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs">{label}</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 gap-1 px-2 text-xs"
          onClick={onAddClick}
        >
          <Plus className="h-3 w-3" />
          {addButtonLabel}
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <Badge
            key={item.id}
            variant={
              selectedIds.includes(item.id) ? selectedVariant : 'outline'
            }
            className="cursor-pointer"
            onClick={() => onToggle(item.id)}
          >
            {icon}
            {item.name}
          </Badge>
        ))}
        {items.length === 0 && (
          <span className="text-muted-foreground text-sm">{emptyMessage}</span>
        )}
      </div>
    </div>
  );
}

// =====================================================================================
// Pre-configured NPC/Organization badge lists
// =====================================================================================

interface NPCRelationshipBadgeListProps {
  label: string;
  npcs: EntityItem[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onAddClick: () => void;
  isEnemy?: boolean;
}

/** Pre-configured badge list for NPC relationships */
export function NPCRelationshipBadgeList({
  label,
  npcs,
  selectedIds,
  onToggle,
  onAddClick,
  isEnemy = false,
}: NPCRelationshipBadgeListProps) {
  return (
    <RelationshipBadgeList
      label={label}
      items={npcs}
      selectedIds={selectedIds}
      onToggle={onToggle}
      onAddClick={onAddClick}
      addButtonLabel="Add NPC"
      icon={<User className="mr-1 h-3 w-3" />}
      selectedVariant={isEnemy ? 'destructive' : 'default'}
      emptyMessage="No other NPCs"
    />
  );
}

interface OrgRelationshipBadgeListProps {
  label: string;
  organizations: EntityItem[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onAddClick: () => void;
  isEnemy?: boolean;
}

/** Pre-configured badge list for Organization relationships */
export function OrgRelationshipBadgeList({
  label,
  organizations,
  selectedIds,
  onToggle,
  onAddClick,
  isEnemy = false,
}: OrgRelationshipBadgeListProps) {
  return (
    <RelationshipBadgeList
      label={label}
      items={organizations}
      selectedIds={selectedIds}
      onToggle={onToggle}
      onAddClick={onAddClick}
      addButtonLabel="Add Organization"
      icon={<Building2 className="mr-1 h-3 w-3" />}
      selectedVariant={isEnemy ? 'destructive' : 'default'}
      emptyMessage="No organizations"
    />
  );
}
