import { ChevronDown, ChevronUp } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CollapsibleTrigger } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface SectionHeaderProps {
  icon: React.ReactNode;
  emoji: string;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  isHomebrew: boolean;
  onHomebrewChange: (value: boolean) => void;
  selectedName?: string;
}

export function SectionHeader({
  icon,
  emoji,
  title,
  isOpen,
  onToggle,
  isHomebrew,
  onHomebrewChange,
  selectedName,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 p-0 hover:bg-transparent"
          onClick={onToggle}
        >
          {icon}
          <span className="text-lg font-semibold">
            {emoji} {title}
          </span>
          {selectedName && !isOpen && (
            <Badge variant="secondary" className="ml-2">
              {selectedName}
            </Badge>
          )}
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      <div className="flex items-center gap-2">
        <Label className="text-muted-foreground text-xs">Homebrew</Label>
        <Switch checked={isHomebrew} onCheckedChange={onHomebrewChange} />
      </div>
    </div>
  );
}
