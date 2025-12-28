import { useCallback, useState } from 'react';

import { EditableSection } from '@/components/shared/editable-section';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import type { IdentityFormValues } from '@/lib/schemas/character-state';
import { cn } from '@/lib/utils';

import { IdentityEditor } from './identity-editor';

interface IdentityDisplayProps {
  identity: IdentityFormValues;
  onChange?: (identity: IdentityFormValues) => void;
  className?: string;
  readOnly?: boolean;
}

function EmptyIdentity() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <span className="text-4xl opacity-50">👤</span>
      <p className="text-muted-foreground mt-2">No identity set</p>
      <p className="text-muted-foreground text-sm">
        Click edit to define your character&apos;s identity
      </p>
    </div>
  );
}

function AppearanceGrid({
  details,
}: {
  details: IdentityFormValues['descriptionDetails'];
}) {
  const items = [
    { key: 'eyes', label: 'Eyes', emoji: '👁️', value: details.eyes },
    { key: 'hair', label: 'Hair', emoji: '💇', value: details.hair },
    { key: 'skin', label: 'Skin', emoji: '✋', value: details.skin },
    { key: 'body', label: 'Body', emoji: '🧍', value: details.body },
    {
      key: 'clothing',
      label: 'Clothing',
      emoji: '👕',
      value: details.clothing,
    },
    {
      key: 'mannerisms',
      label: 'Mannerisms',
      emoji: '💭',
      value: details.mannerisms,
    },
    { key: 'other', label: 'Other', emoji: '✨', value: details.other },
  ].filter(item => item.value);

  if (items.length === 0) return null;

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(item => (
        <div
          key={item.key}
          className="rounded-lg border bg-gradient-to-br from-slate-50 to-slate-100 p-3 dark:from-slate-900 dark:to-slate-800"
        >
          <div className="text-muted-foreground mb-1 flex items-center gap-1 text-xs tracking-wide uppercase">
            <span>{item.emoji}</span>
            <span>{item.label}</span>
          </div>
          <p className="text-sm">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

function ConnectionCard({
  connection,
}: {
  connection: {
    prompt: string;
    answer: string;
    withPlayer?: { id?: string; name?: string };
  };
}) {
  return (
    <div className="rounded-lg border border-purple-200 bg-purple-50/50 p-3 dark:border-purple-800 dark:bg-purple-950/20">
      <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
        {connection.prompt}
      </p>
      <p className="text-muted-foreground mt-1 text-sm">{connection.answer}</p>
      {connection.withPlayer?.name && (
        <Badge variant="outline" className="mt-2 gap-1 text-xs">
          🤝 With: {connection.withPlayer.name}
        </Badge>
      )}
    </div>
  );
}

function IdentityContent({ identity }: { identity: IdentityFormValues }) {
  const hasName = identity.name?.trim();
  const hasDescription = identity.description?.trim();
  const hasBackground = identity.background?.trim();
  const hasAppearance = Object.values(identity.descriptionDetails || {}).some(
    v => v?.trim()
  );
  const hasConnections = identity.connections?.length > 0;

  const isEmpty =
    !hasName &&
    !hasDescription &&
    !hasBackground &&
    !hasAppearance &&
    !hasConnections;

  if (isEmpty) {
    return <EmptyIdentity />;
  }

  return (
    <div className="space-y-4">
      {(hasName || identity.pronouns || identity.calling) && (
        <div className="flex flex-wrap items-center gap-3">
          <h4 className="text-2xl font-bold">{identity.name || 'Unnamed'}</h4>
          {identity.pronouns && (
            <SmartTooltip content="Pronouns">
              <Badge variant="secondary" className="gap-1">
                💬 {identity.pronouns}
              </Badge>
            </SmartTooltip>
          )}
          {identity.calling && (
            <SmartTooltip content="Calling - Your character's title or epithet">
              <Badge
                variant="outline"
                className="gap-1 border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/30"
              >
                ⭐ {identity.calling}
              </Badge>
            </SmartTooltip>
          )}
        </div>
      )}

      {hasDescription && (
        <>
          <Separator />
          <div>
            <h5 className="text-muted-foreground mb-2 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
              📝 Description
            </h5>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {identity.description}
            </p>
          </div>
        </>
      )}

      {hasAppearance && (
        <>
          <Separator />
          <div>
            <h5 className="text-muted-foreground mb-3 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
              🎭 Appearance
            </h5>
            <AppearanceGrid details={identity.descriptionDetails} />
          </div>
        </>
      )}

      {hasBackground && (
        <>
          <Separator />
          <div>
            <h5 className="text-muted-foreground mb-2 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
              📜 Background
            </h5>
            <div className="rounded-lg border bg-gradient-to-br from-amber-50 to-orange-50 p-4 dark:from-amber-950/20 dark:to-orange-950/20">
              <p className="text-muted-foreground text-sm leading-relaxed">
                {identity.background}
              </p>
            </div>
          </div>
        </>
      )}

      {hasConnections && (
        <>
          <Separator />
          <div>
            <h5 className="text-muted-foreground mb-3 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
              🤝 Connections
            </h5>
            <div className="grid gap-3 sm:grid-cols-2">
              {identity.connections.map((connection, index) => (
                <ConnectionCard key={index} connection={connection} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function IdentityDisplay({
  identity,
  onChange,
  className,
  readOnly = false,
}: IdentityDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = useCallback(() => {
    setIsEditing(prev => !prev);
  }, []);

  const handleSubmit = useCallback(
    (values: IdentityFormValues) => {
      onChange?.(values);
      setIsEditing(false);
    },
    [onChange]
  );

  const handleCancel = useCallback(() => {
    setIsEditing(false);
  }, []);

  return (
    <EditableSection
      title="Identity"
      emoji="👤"
      isEditing={isEditing}
      onEditToggle={handleEditToggle}
      showEditButton={!readOnly}
      modalSize="xl"
      className={cn(className)}
      editTitle="Edit Identity"
      editDescription="Define your character's name, pronouns, appearance, background, and connections."
      editContent={
        <IdentityEditor
          defaultValues={identity}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      }
    >
      <IdentityContent identity={identity} />
    </EditableSection>
  );
}
