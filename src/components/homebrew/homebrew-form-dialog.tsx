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

import { HomebrewComments } from './homebrew-comments';
import { getHomebrewForm } from './homebrew-form-registry';

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

  // Filter visibility options: show campaign_only only when editing (has initialData)
  const visibilityOptions = useMemo(() => {
    if (initialData) {
      return VISIBILITY_OPTIONS;
    }
    // When creating, exclude campaign_only option
    return VISIBILITY_OPTIONS.filter(
      option => option.value !== 'campaign_only'
    );
  }, [initialData]);

  const visibilityDescription = useMemo(() => {
    return (
      VISIBILITY_OPTIONS.find(option => option.value === visibility)
        ?.description ?? ''
    );
  }, [visibility]);

  const renderForm = () => {
    const FormComponent = getHomebrewForm(contentType);
    if (!FormComponent) {
      return <div>Unknown content type</div>;
    }

    return (
      <FormComponent
        initialData={initialData?.content}
        onSubmit={(content: HomebrewContent['content']) =>
          onSubmit({ content, visibility })
        }
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="h-full w-full overflow-y-auto sm:h-auto sm:max-h-[90vh] sm:max-w-2xl"
      >
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
                  {visibilityOptions.map(option => {
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
