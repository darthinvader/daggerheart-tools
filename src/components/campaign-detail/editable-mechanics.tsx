import { ChevronDown, Plus, Sparkles, Trash2, X } from 'lucide-react';

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
import type { CampaignMechanic } from '@/lib/schemas/campaign';

interface EditableMechanicsProps {
  mechanics: CampaignMechanic[];
  onChange: (mechanics: CampaignMechanic[]) => void;
}

export function EditableMechanics({
  mechanics,
  onChange,
}: EditableMechanicsProps) {
  const addMechanic = () => {
    onChange([
      ...mechanics,
      {
        id: `mechanic-${Date.now()}`,
        name: 'New Mechanic',
        description: '',
        rules: [],
      },
    ]);
  };

  const updateMechanic = (id: string, updates: Partial<CampaignMechanic>) => {
    onChange(mechanics.map(m => (m.id === id ? { ...m, ...updates } : m)));
  };

  const removeMechanic = (id: string) => {
    onChange(mechanics.filter(m => m.id !== id));
  };

  const addRule = (mechanicId: string) => {
    const mechanic = mechanics.find(m => m.id === mechanicId);
    if (mechanic) {
      updateMechanic(mechanicId, { rules: [...mechanic.rules, ''] });
    }
  };

  const updateRule = (mechanicId: string, ruleIndex: number, value: string) => {
    const mechanic = mechanics.find(m => m.id === mechanicId);
    if (mechanic) {
      const newRules = [...mechanic.rules];
      newRules[ruleIndex] = value;
      updateMechanic(mechanicId, { rules: newRules });
    }
  };

  const removeRule = (mechanicId: string, ruleIndex: number) => {
    const mechanic = mechanics.find(m => m.id === mechanicId);
    if (mechanic) {
      updateMechanic(mechanicId, {
        rules: mechanic.rules.filter((_, i) => i !== ruleIndex),
      });
    }
  };

  return (
    <div className="space-y-3">
      {mechanics.map(mechanic => (
        <Collapsible key={mechanic.id} defaultOpen={!mechanic.description}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ChevronDown className="h-4 w-4 transition-transform [[data-state=open]>&]:rotate-180" />
                    <Sparkles className="h-4 w-4 text-violet-500" />
                    <span className="font-medium">{mechanic.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={e => {
                      e.stopPropagation();
                      removeMechanic(mechanic.id);
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
                  <Label className="text-xs">Name</Label>
                  <Input
                    value={mechanic.name}
                    onChange={e =>
                      updateMechanic(mechanic.id, { name: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Description</Label>
                  <Textarea
                    value={mechanic.description}
                    onChange={e =>
                      updateMechanic(mechanic.id, {
                        description: e.target.value,
                      })
                    }
                    rows={2}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Rules</Label>
                  <div className="mt-1 space-y-2">
                    {mechanic.rules.map((rule, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={rule}
                          onChange={e =>
                            updateRule(mechanic.id, index, e.target.value)
                          }
                          placeholder={`Rule ${index + 1}`}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 shrink-0"
                          onClick={() => removeRule(mechanic.id, index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addRule(mechanic.id)}
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Add Rule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}
      <Button variant="outline" onClick={addMechanic} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Mechanic
      </Button>
    </div>
  );
}
