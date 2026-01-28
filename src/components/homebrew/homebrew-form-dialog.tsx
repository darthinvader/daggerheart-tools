/**
 * Homebrew Form Dialog
 *
 * Dialog wrapper that displays the appropriate form based on content type.
 */
import { Globe, Lock, Users } from 'lucide-react';
import type { ElementType } from 'react';
import { useMemo, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type {
  HomebrewContent,
  HomebrewContentType,
  HomebrewVisibility,
} from '@/lib/schemas/homebrew';
import {
  getContentTypeLabel,
  getVisibilityLabel,
} from '@/lib/schemas/homebrew';

import { AdversaryForm } from './adversary-form';
import { AncestryForm } from './ancestry-form';
import { ClassForm } from './class-form';
import { CommunityForm } from './community-form';
import { DomainCardForm } from './domain-card-form';
import { EnvironmentForm } from './environment-form';
import { EquipmentForm } from './equipment-form';
import { HomebrewComments } from './homebrew-comments';
import { ItemForm } from './item-form';
import { SubclassForm } from './subclass-form';

interface HomebrewFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentType: HomebrewContentType;
  initialData?: HomebrewContent;
  onSubmit: (data: {
    content: HomebrewContent['content'];
    visibility: HomebrewVisibility;
  }) => void;
  isSubmitting?: boolean;
  defaultVisibility?: HomebrewVisibility;
}

const VISIBILITY_OPTIONS: {
  value: HomebrewVisibility;
  label: string;
  description: string;
  icon: ElementType;
  color: string;
}[] = [
  {
    value: 'private',
    label: 'Private',
    description: 'Only you can see this homebrew content.',
    icon: Lock,
    color: 'text-amber-500',
  },
  {
    value: 'campaign_only',
    label: 'Campaign Only',
    description: 'Visible to players in linked campaigns.',
    icon: Users,
    color: 'text-purple-500',
  },
  {
    value: 'public',
    label: 'Public',
    description: 'Visible to everyone in Browse Homebrew.',
    icon: Globe,
    color: 'text-green-500',
  },
];

export function HomebrewFormDialog({
  open,
  onOpenChange,
  contentType,
  initialData,
  onSubmit,
  isSubmitting = false,
  defaultVisibility = 'private',
}: HomebrewFormDialogProps) {
  const resetKey = `${open ? 'open' : 'closed'}-${contentType}-${
    initialData?.id ?? 'new'
  }-${defaultVisibility}`;

  return (
    <HomebrewFormDialogBody
      key={resetKey}
      open={open}
      onOpenChange={onOpenChange}
      contentType={contentType}
      initialData={initialData}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      defaultVisibility={defaultVisibility}
    />
  );
}

function HomebrewFormDialogBody({
  open,
  onOpenChange,
  contentType,
  initialData,
  onSubmit,
  isSubmitting = false,
  defaultVisibility = 'private',
}: HomebrewFormDialogProps) {
  const handleCancel = () => onOpenChange(false);
  const [visibility, setVisibility] = useState<HomebrewVisibility>(
    initialData?.visibility ?? defaultVisibility
  );

  const visibilityDescription = useMemo(() => {
    return (
      VISIBILITY_OPTIONS.find(option => option.value === visibility)
        ?.description ?? ''
    );
  }, [visibility]);

  const renderForm = () => {
    const commonProps = {
      onSubmit: (content: HomebrewContent['content']) =>
        onSubmit({ content, visibility }),
      onCancel: handleCancel,
      isSubmitting,
    };

    switch (contentType) {
      case 'adversary':
        return (
          <AdversaryForm
            {...commonProps}
            initialData={
              initialData?.content as Parameters<
                typeof AdversaryForm
              >[0]['initialData']
            }
          />
        );
      case 'environment':
        return (
          <EnvironmentForm
            {...commonProps}
            initialData={
              initialData?.content as Parameters<
                typeof EnvironmentForm
              >[0]['initialData']
            }
          />
        );
      case 'domain_card':
        return (
          <DomainCardForm
            {...commonProps}
            initialData={
              initialData?.content as Parameters<
                typeof DomainCardForm
              >[0]['initialData']
            }
          />
        );
      case 'class':
        return (
          <ClassForm
            {...commonProps}
            initialData={
              initialData?.content as Parameters<
                typeof ClassForm
              >[0]['initialData']
            }
          />
        );
      case 'subclass':
        return (
          <SubclassForm
            {...commonProps}
            initialData={
              initialData?.content as Parameters<
                typeof SubclassForm
              >[0]['initialData']
            }
          />
        );
      case 'ancestry':
        return (
          <AncestryForm
            {...commonProps}
            initialData={
              initialData?.content as Parameters<
                typeof AncestryForm
              >[0]['initialData']
            }
          />
        );
      case 'community':
        return (
          <CommunityForm
            {...commonProps}
            initialData={
              initialData?.content as Parameters<
                typeof CommunityForm
              >[0]['initialData']
            }
          />
        );
      case 'equipment':
        return (
          <EquipmentForm
            {...commonProps}
            initialData={
              initialData?.content as Parameters<
                typeof EquipmentForm
              >[0]['initialData']
            }
          />
        );
      case 'item':
        return (
          <ItemForm
            {...commonProps}
            initialData={
              initialData?.content as Parameters<
                typeof ItemForm
              >[0]['initialData']
            }
          />
        );
      default:
        return <div>Unknown content type</div>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit' : 'Create'} {getContentTypeLabel(contentType)}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <section className="border-muted bg-muted/20 flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h3 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                Visibility
              </h3>
              <p className="text-muted-foreground text-xs">
                {visibilityDescription}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="visibility" className="sr-only">
                Visibility
              </Label>
              <Select
                value={visibility}
                onValueChange={value =>
                  setVisibility(value as HomebrewVisibility)
                }
              >
                <SelectTrigger id="visibility" className="h-8 w-50 text-xs">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  {VISIBILITY_OPTIONS.map(option => {
                    const Icon = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <span className="flex items-center gap-2">
                          <Icon className={`size-4 ${option.color}`} />
                          {option.label}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <span className="text-muted-foreground text-xs font-medium">
                {getVisibilityLabel(visibility)}
              </span>
            </div>
          </section>

          {renderForm()}

          {initialData?.id && <HomebrewComments homebrewId={initialData.id} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
