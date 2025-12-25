import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ClassMode } from '@/lib/schemas/class-selection';

interface ClassModeTabsProps {
  activeMode: ClassMode;
  onModeChange: (mode: ClassMode) => void;
}

export function ClassModeTabs({
  activeMode,
  onModeChange,
}: ClassModeTabsProps) {
  return (
    <Tabs
      value={activeMode}
      onValueChange={v => onModeChange(v as ClassMode)}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="standard" className="gap-2">
          <span>📚</span>
          <span>Standard Classes</span>
        </TabsTrigger>
        <TabsTrigger value="homebrew" className="gap-2">
          <span>🎨</span>
          <span>Homebrew</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
