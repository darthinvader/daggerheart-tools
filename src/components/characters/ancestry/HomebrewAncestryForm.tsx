import { FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export type HomebrewState = {
  name: string;
  description?: string;
  heightRange?: string;
  lifespan?: string;
  physicalCharacteristics?: string[];
  primaryFeature: { name: string; description: string };
  secondaryFeature: { name: string; description: string };
};

export function HomebrewAncestryForm({
  value,
  onChange,
}: {
  value: HomebrewState;
  onChange: (next: HomebrewState) => void;
}) {
  return (
    <div className="rounded-md border p-3">
      <div className="text-sm font-medium">Homebrew Ancestry</div>
      <div className="text-muted-foreground text-xs">
        Define a custom ancestry with features.
      </div>
      {/* Note: This content is rendered inside a parent <form>; avoid nested forms to prevent hydration errors. */}
      <div
        className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2"
        role="group"
        aria-label="Homebrew ancestry fields"
      >
        <div className="space-y-1">
          <FormLabel>Name</FormLabel>
          <Input
            value={value.name}
            onChange={e => onChange({ ...value, name: e.target.value })}
            placeholder="Custom ancestry name"
          />
        </div>
        <div className="space-y-1">
          <FormLabel>Height Range</FormLabel>
          <Input
            value={value.heightRange || ''}
            onChange={e => onChange({ ...value, heightRange: e.target.value })}
            placeholder="e.g., 5 to 6 feet"
          />
        </div>
        <div className="space-y-1">
          <FormLabel>Lifespan</FormLabel>
          <Input
            value={value.lifespan || ''}
            onChange={e => onChange({ ...value, lifespan: e.target.value })}
            placeholder="e.g., ~120 years"
          />
        </div>
        <FormItem>
          <FormLabel>Primary Feature</FormLabel>
          <div className="grid grid-cols-1 gap-2">
            <Input
              placeholder="Feature name"
              value={value.primaryFeature.name}
              onChange={e =>
                onChange({
                  ...value,
                  primaryFeature: {
                    ...value.primaryFeature,
                    name: e.target.value,
                  },
                })
              }
            />
          </div>
        </FormItem>
        <FormItem>
          <FormLabel className="sr-only">Primary Feature Description</FormLabel>
          <Textarea
            placeholder="Feature description"
            rows={2}
            value={value.primaryFeature.description}
            onChange={e =>
              onChange({
                ...value,
                primaryFeature: {
                  ...value.primaryFeature,
                  description: e.target.value,
                },
              })
            }
          />
        </FormItem>
        <FormItem>
          <FormLabel>Secondary Feature</FormLabel>
          <div className="grid grid-cols-1 gap-2">
            <Input
              placeholder="Feature name"
              value={value.secondaryFeature.name}
              onChange={e =>
                onChange({
                  ...value,
                  secondaryFeature: {
                    ...value.secondaryFeature,
                    name: e.target.value,
                  },
                })
              }
            />
          </div>
        </FormItem>
        <FormItem>
          <FormLabel className="sr-only">
            Secondary Feature Description
          </FormLabel>
          <Textarea
            placeholder="Feature description"
            rows={2}
            value={value.secondaryFeature.description}
            onChange={e =>
              onChange({
                ...value,
                secondaryFeature: {
                  ...value.secondaryFeature,
                  description: e.target.value,
                },
              })
            }
          />
        </FormItem>
        <FormItem className="sm:col-span-2">
          <FormLabel>Description</FormLabel>
          <Textarea
            placeholder="Lore, appearance, culture..."
            rows={3}
            value={value.description || ''}
            onChange={e => onChange({ ...value, description: e.target.value })}
          />
        </FormItem>
      </div>
    </div>
  );
}
