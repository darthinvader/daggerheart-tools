import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight, BookOpen, Sword, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const Route = createFileRoute('/' as const)({
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Hero Section */}
      <section className="from-primary/5 via-background to-background relative flex flex-1 flex-col items-center justify-center bg-linear-to-b px-4 py-16 text-center md:py-24">
        {/* Decorative elements */}
        <div className="bg-primary/10 absolute top-10 left-10 h-32 w-32 rounded-full blur-3xl" />
        <div className="bg-primary/5 absolute right-10 bottom-20 h-40 w-40 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-3xl">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            <span className="text-primary">Daggerheart</span> Tools
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg md:text-xl">
            Your companion app for the Daggerheart TTRPG. Build characters,
            track resources, manage inventory, and enhance your tabletop
            experience.
          </p>

          <Button
            asChild
            size="lg"
            className="text-primary-foreground gap-2 text-lg"
          >
            <Link to="/character">
              <Users className="h-5 w-5" />
              View Characters
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Hero illustration placeholder */}
        <div className="from-primary/20 to-primary/5 border-primary/20 relative z-10 mt-12 flex aspect-video w-full max-w-4xl items-center justify-center rounded-2xl border-2 border-dashed bg-linear-to-br shadow-lg md:mt-16">
          <div className="p-8 text-center">
            <Sword className="text-primary/40 mx-auto mb-4 h-16 w-16 md:h-24 md:w-24" />
            <p className="text-muted-foreground text-sm md:text-base">
              Character builder and game companion
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-2xl font-bold md:text-3xl">
            Everything you need for your adventure
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Users className="text-primary mb-2 h-10 w-10" />
                <CardTitle>Character Builder</CardTitle>
                <CardDescription>
                  Create and manage your Daggerheart characters with an
                  intuitive, mobile-friendly interface.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>• Choose ancestry, class, and community</li>
                  <li>• Track traits and experiences</li>
                  <li>• Manage level progression</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Sword className="text-primary mb-2 h-10 w-10" />
                <CardTitle>Equipment & Inventory</CardTitle>
                <CardDescription>
                  Organize your gear, weapons, armor, and consumables with ease.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>• Track armor and weapons</li>
                  <li>• Manage gold and resources</li>
                  <li>• Organize inventory items</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="text-primary mb-2 h-10 w-10" />
                <CardTitle>Session Tools</CardTitle>
                <CardDescription>
                  Keep your game flowing with helpful tracking and reference
                  tools.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>• Track conditions and status</li>
                  <li>• Manage rest and recovery</li>
                  <li>• Quick reference for rules</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">
            Ready to begin your adventure?
          </h2>
          <p className="text-muted-foreground mb-8">
            Start building your character now and dive into the world of
            Daggerheart.
          </p>
          <Button asChild size="lg" className="text-primary-foreground gap-2">
            <Link to="/character">
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
