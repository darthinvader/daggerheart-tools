import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { CampaignPrinciple } from '@/lib/schemas/campaign';

interface EditablePrinciplesProps {
  principles: CampaignPrinciple[];
  onChange: (principles: CampaignPrinciple[]) => void;
  onBlur?: () => void;
  target: 'player' | 'gm';
}

export function EditablePrinciples({
  principles,
  onChange,
  onBlur,
  target,
}: EditablePrinciplesProps) {
  const addPrinciple = () => {
    onChange([
      ...principles,
      {
        id: `principle-${crypto.randomUUID()}`,
        title: 'New Principle',
        description: '',
        target,
      },
    ]);
  };

  const updatePrinciple = (id: string, updates: Partial<CampaignPrinciple>) => {
    onChange(principles.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const removePrinciple = (id: string) => {
    onChange(principles.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-3">
      {principles.map(principle => (
        <Card key={principle.id}>
          <CardContent className="space-y-3 pt-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <Label className="text-xs">Title</Label>
                <Input
                  value={principle.title}
                  onChange={e =>
                    updatePrinciple(principle.id, { title: e.target.value })
                  }
                  onBlur={onBlur}
                  className="mt-1"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => removePrinciple(principle.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea
                value={principle.description}
                onChange={e =>
                  updatePrinciple(principle.id, { description: e.target.value })
                }
                onBlur={onBlur}
                rows={2}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" onClick={addPrinciple} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add {target === 'player' ? 'Player' : 'GM'} Principle
      </Button>
    </div>
  );
}
