import { toast } from 'sonner';

import { useState } from 'react';

import { createFileRoute } from '@tanstack/react-router';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// Newly added components to showcase
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarSub,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { Toaster } from '@/components/ui/sonner';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

function Showcase() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [toggleOn, setToggleOn] = useState(false);
  const [toggleValue, setToggleValue] = useState<string>('a');

  return (
    <div className="mx-auto max-w-screen-sm space-y-6 p-4">
      <Toaster />
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>Primary actions and variants</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
          <Button onClick={() => toast('Hello from Sonner!')}>Toast</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Form Elements</CardTitle>
          <CardDescription>Inputs with theme tokens</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your name" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" placeholder="A longer message" rows={4} />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="agree" />
            <Label htmlFor="agree">I agree to the terms</Label>
          </div>
          <RadioGroup defaultValue="a" className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="a" id="a" />
              <Label htmlFor="a">Option A</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="b" id="b" />
              <Label htmlFor="b">Option B</Label>
            </div>
          </RadioGroup>
          <Select defaultValue="one">
            <SelectTrigger>
              <SelectValue placeholder="Pick one" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="one">One</SelectItem>
              <SelectItem value="two">Two</SelectItem>
              <SelectItem value="three">Three</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Badges & Separator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
          <Separator />
          <div className="space-y-2">
            <Alert>
              <AlertTitle>Heads up</AlertTitle>
              <AlertDescription>
                These components follow the theme.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Overlays</CardTitle>
          <CardDescription>
            Dialog, Sheet, Dropdown, Popover, Tooltip
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
              </DialogHeader>
              Content inside dialog.
            </DialogContent>
          </Dialog>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open Sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Sheet Title</SheetTitle>
              </SheetHeader>
              Slide-over content
            </SheetContent>
          </Sheet>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Item 1</DropdownMenuItem>
              <DropdownMenuItem>Item 2</DropdownMenuItem>
              <DropdownMenuItem>Item 3</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Popover</Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">Hello from popover</PopoverContent>
          </Popover>

          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="outline">Hover</Button>
            </HoverCardTrigger>
            <HoverCardContent>Hover content</HoverCardContent>
          </HoverCard>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Breadcrumb</CardTitle>
          <CardDescription>Hierarchical navigation</CardDescription>
        </CardHeader>
        <CardContent>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Library</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Data</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pagination</CardTitle>
        </CardHeader>
        <CardContent>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Table</CardTitle>
          <CardDescription>Compact data grid</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Aria Swiftwind</TableCell>
                <TableCell>Bard</TableCell>
                <TableCell className="text-right">3</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Garruk Stone</TableCell>
                <TableCell>Guardian</TableCell>
                <TableCell className="text-right">5</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Lysa Dawn</TableCell>
                <TableCell>Wizard</TableCell>
                <TableCell className="text-right">2</TableCell>
              </TableRow>
            </TableBody>
            <TableCaption>Party roster preview</TableCaption>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Menubar</CardTitle>
        </CardHeader>
        <CardContent>
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>New</MenubarItem>
                <MenubarItem>Open…</MenubarItem>
                <MenubarSeparator />
                <MenubarCheckboxItem checked>Autosave</MenubarCheckboxItem>
                <MenubarSeparator />
                <MenubarSub>
                  <MenubarSubTrigger>Share</MenubarSubTrigger>
                </MenubarSub>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>View</MenubarTrigger>
              <MenubarContent>
                <MenubarRadioGroup value="1">
                  <MenubarLabel className="px-2 py-1.5">Zoom</MenubarLabel>
                  <MenubarRadioItem value="1">100%</MenubarRadioItem>
                  <MenubarRadioItem value="2">125%</MenubarRadioItem>
                </MenubarRadioGroup>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Navigation Menu</CardTitle>
        </CardHeader>
        <CardContent>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                <NavigationMenuContent className="p-2">
                  <div className="grid w-[200px] gap-1">
                    <NavigationMenuLink href="#">Buttons</NavigationMenuLink>
                    <NavigationMenuLink href="#">Forms</NavigationMenuLink>
                    <NavigationMenuLink href="#">Overlays</NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Context Menu</CardTitle>
        </CardHeader>
        <CardContent>
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <div className="rounded-md border p-6 text-center text-sm">
                Right click here
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>Refresh</ContextMenuItem>
              <ContextMenuItem>Rename</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuCheckboxItem checked>Pinned</ContextMenuCheckboxItem>
              <ContextMenuSeparator />
              <ContextMenuLabel>Danger</ContextMenuLabel>
              <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Command Palette</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <Button onClick={() => setCmdOpen(true)}>Open</Button>
          <CommandDialog open={cmdOpen} onOpenChange={setCmdOpen}>
            <CommandInput placeholder="Type a command…" />
            <CommandList>
              <CommandEmpty>No results.</CommandEmpty>
              <CommandGroup heading="General">
                <CommandItem onSelect={() => toast('Toggled setting')}>
                  Toggle setting
                </CommandItem>
                <CommandItem onSelect={() => setCmdOpen(false)}>
                  Close palette
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Navigation">
                <CommandItem onSelect={() => (window.location.hash = '#')}>
                  Home
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Date Picker</CardTitle>
          <CardDescription>Calendar in a popover</CardDescription>
        </CardHeader>
        <CardContent>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {date ? date.toLocaleDateString() : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={setDate} />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scroll Area</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-32 rounded-md border p-4">
            <div className="space-y-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="text-sm">
                  Line {i + 1}: The blue-and-gold theme ensures legibility.
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resizable Panels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 rounded-md border">
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={60} className="p-3">
                Left pane
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={40} className="p-3">
                Right pane
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Toggle & Toggle Group</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Toggle pressed={toggleOn} onPressedChange={setToggleOn}>
              Toggle me
            </Toggle>
            <span className="text-sm opacity-80">
              {toggleOn ? 'On' : 'Off'}
            </span>
          </div>
          <ToggleGroup
            type="single"
            value={toggleValue}
            onValueChange={v => v && setToggleValue(v)}
          >
            <ToggleGroupItem value="a">A</ToggleGroupItem>
            <ToggleGroupItem value="b">B</ToggleGroupItem>
            <ToggleGroupItem value="c">C</ToggleGroupItem>
          </ToggleGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aspect Ratio</CardTitle>
          <CardDescription>Consistent media sizing</CardDescription>
        </CardHeader>
        <CardContent>
          <AspectRatio ratio={16 / 9}>
            <img
              src="/vite.svg"
              alt="Vite"
              className="h-full w-full rounded-md object-contain"
            />
          </AspectRatio>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media & Feedback</CardTitle>
          <CardDescription>Avatar, Progress, Skeleton</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback>DG</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Progress value={66} />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Controls</CardTitle>
          <CardDescription>Switch, Slider, Tabs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Switch id="sw" />
            <Label htmlFor="sw">Enable setting</Label>
          </div>
          <Slider defaultValue={[40]} max={100} step={1} />
          <Tabs defaultValue="tab1" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3">Tab 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Tab 1 content</TabsContent>
            <TabsContent value="tab2">Tab 2 content</TabsContent>
            <TabsContent value="tab3">Tab 3 content</TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute('/showcase')({
  component: Showcase,
});
