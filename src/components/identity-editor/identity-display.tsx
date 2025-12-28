import { useCallback, useRef, useState } from 'react';

import { EditableSection } from '@/components/shared/editable-section';
import type { IdentityFormValues } from '@/lib/schemas/character-state';
import { cn } from '@/lib/utils';

import { IdentityEditor } from './identity-editor';
import {
  AppearanceSection,
  BackgroundSection,
  ConnectionsSection,
  DescriptionSection,
  IdentityHeader,
} from './identity-sections';

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
      <IdentityHeader identity={identity} />
      <DescriptionSection description={identity.description} />
      <AppearanceSection details={identity.descriptionDetails} />
      <BackgroundSection background={identity.background} />
      <ConnectionsSection connections={identity.connections} />
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
  const formRef = useRef<{ submit: () => void } | null>(null);

  const handleEditToggle = useCallback(() => {
    setIsEditing(prev => !prev);
  }, []);

  const handleSubmit = useCallback(
    (values: IdentityFormValues) => {
      onChange?.(values);
    },
    [onChange]
  );

  const handleSave = useCallback(() => {
    formRef.current?.submit();
  }, []);

  return (
    <EditableSection
      title="Identity"
      emoji="👤"
      isEditing={isEditing}
      onEditToggle={handleEditToggle}
      onSave={handleSave}
      showEditButton={!readOnly}
      modalSize="xl"
      className={cn(className)}
      editTitle="Edit Identity"
      editDescription="Define your character's name, pronouns, appearance, background, and connections."
      editContent={
        <IdentityEditor
          defaultValues={identity}
          onSubmit={handleSubmit}
          hideButtons
          formRef={formRef}
        />
      }
    >
      <IdentityContent identity={identity} />
    </EditableSection>
  );
}
