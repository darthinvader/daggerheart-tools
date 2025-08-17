import { TabsList, TabsTrigger } from '@/components/ui/tabs';

export function TabsHeader() {
  return (
    <TabsList>
      <TabsTrigger value="filtered">Filtered</TabsTrigger>
      <TabsTrigger value="any">Any</TabsTrigger>
      <TabsTrigger value="simple">Simple</TabsTrigger>
      <TabsTrigger value="homebrew">Homebrew</TabsTrigger>
    </TabsList>
  );
}
