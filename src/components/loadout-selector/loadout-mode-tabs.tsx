import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { LoadoutMode } from '@/lib/schemas/loadout';

interface LoadoutModeTabsProps {
  activeMode: LoadoutMode;
  onModeChange: (mode: LoadoutMode) => void;
  classDomains?: string[];
}

export function LoadoutModeTabs({
  activeMode,
  onModeChange,
}: LoadoutModeTabsProps) {
  return (
    <Tabs
      value={activeMode}
      onValueChange={v => onModeChange(v as LoadoutMode)}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="class-domains" className="gap-2">
          <span>📚</span>
          <span className="hidden sm:inline">Class Domains</span>
          <span className="sm:hidden">Class</span>
        </TabsTrigger>
        <TabsTrigger value="all-domains" className="gap-2">
          <span>🌟</span>
          <span className="hidden sm:inline">All Domains</span>
          <span className="sm:hidden">All</span>
        </TabsTrigger>
        <TabsTrigger value="homebrew" className="gap-2">
          <span>🎨</span>
          <span className="hidden sm:inline">Homebrew</span>
          <span className="sm:hidden">Custom</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
