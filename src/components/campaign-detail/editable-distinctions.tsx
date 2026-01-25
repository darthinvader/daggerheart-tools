import { ChevronDown, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { CampaignDistinction } from '@/lib/schemas/campaign';

interface EditableDistinctionsProps {
  distinctions: CampaignDistinction[];
  onChange: (distinctions: CampaignDistinction[]) => void;
}

export function EditableDistinctions({
  distinctions,
  onChange,
}: EditableDistinctionsProps) {
  const addDistinction = () => {
    onChange([
      ...distinctions,
      {
        id: `distinction-${Date.now()}`,
        title: 'New Distinction',
        description: '',
      },
    ]);
  };

  const updateDistinction = (
    id: string,
    updates: Partial<CampaignDistinction>
  ) => {
    onChange(distinctions.map(d => (d.id === id ? { ...d, ...updates } : d)));
  };

  const removeDistinction = (id: string) => {
    onChange(distinctions.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-3">
      {distinctions.map(distinction => (
        <Collapsible
          key={distinction.id}
          defaultOpen={!distinction.description}
        >
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ChevronDown className="h-4 w-4 transition-transform [[data-state=open]>&]:rotate-180" />
                    <span className="font-medium">{distinction.title}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={e => {
                      e.stopPropagation();
                      removeDistinction(distinction.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-3 pt-0">
                <div>
                  <Label className="text-xs">Title</Label>
                  <Input
                    value={distinction.title}
                    onChange={e =>
                      updateDistinction(distinction.id, {
                        title: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Description</Label>
                  <Textarea
                    value={distinction.description}
                    onChange={e =>
                      updateDistinction(distinction.id, {
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}
      <Button variant="outline" onClick={addDistinction} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Distinction
      </Button>
    </div>
  );
}
