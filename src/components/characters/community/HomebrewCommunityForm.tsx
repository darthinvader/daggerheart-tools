import { FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export type Homebrew = {
  name: string;
  description?: string;
  commonTraits?: string[];
  feature: { name: string; description: string };
};

export type HomebrewCommunityFormProps = {
  value: Homebrew;
  onChange: (next: Homebrew) => void;
};

export function HomebrewCommunityForm({
  value,
  onChange,
}: HomebrewCommunityFormProps) {
  return (
    <div className="space-y-3 rounded-md border p-3">
      <div>
        <div className="text-sm font-medium">Homebrew Community</div>
        <div className="text-muted-foreground text-xs">
          Define a custom community.
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormItem>
          <FormLabel>Name</FormLabel>
          <Input
            value={value.name}
            onChange={e => onChange({ ...value, name: e.target.value })}
            placeholder="Custom community"
          />
        </FormItem>
      </div>
      <FormItem>
        <FormLabel>Feature</FormLabel>
        <div className="grid grid-cols-1 gap-2">
          <Input
            placeholder="Feature name"
            value={value.feature.name}
            onChange={e =>
              onChange({
                ...value,
                feature: { ...value.feature, name: e.target.value },
              })
            }
          />
          <Textarea
            placeholder="Feature description"
            value={value.feature.description}
            onChange={e =>
              onChange({
                ...value,
                feature: { ...value.feature, description: e.target.value },
              })
            }
            rows={2}
          />
        </div>
      </FormItem>
      <FormItem>
        <FormLabel>Description</FormLabel>
        <Textarea
          placeholder="Describe culture, roles, etc."
          rows={3}
          value={value.description || ''}
          onChange={e => onChange({ ...value, description: e.target.value })}
        />
      </FormItem>
    </div>
  );
}
