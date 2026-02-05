import {
  MapPin,
  MessageCircle,
  Sparkles,
  Store,
  UtensilsCrossed,
  Wind,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { BerrysRestaurant } from '@/lib/schemas/beast-feast-cooking';
import { cn } from '@/lib/utils';

interface BerrysRestaurantDisplayProps {
  restaurant: BerrysRestaurant;
  className?: string;
}

/**
 * Get a descriptive label and styling for each cave layer
 */
function getCaveLayerInfo(layer: BerrysRestaurant['caveLayer']): {
  label: string;
  description: string;
  className: string;
} {
  switch (layer) {
    case 'Shallows':
      return {
        label: 'The Shallows',
        description: 'Near the surface, where light still reaches',
        className:
          'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200',
      };
    case 'Twilight':
      return {
        label: 'Twilight Zone',
        description: 'Where darkness begins to take hold',
        className:
          'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200',
      };
    case 'Abyss':
      return {
        label: 'The Abyss',
        description: 'Deep in eternal darkness',
        className:
          'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
      };
    case 'Hadral':
      return {
        label: 'Hadral Depths',
        description: 'The deepest and most dangerous layer',
        className:
          'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
      };
    default:
      return {
        label: layer,
        description: 'A cave location',
        className:
          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      };
  }
}

/**
 * Berry's Restaurant Display Component
 *
 * Displays restaurant discovery information in the Beast Feast campaign section.
 * Shows restaurant details including location, daily specials, rumors, and ambiance.
 */
export function BerrysRestaurantDisplay({
  restaurant,
  className,
}: BerrysRestaurantDisplayProps) {
  const caveLayerInfo = getCaveLayerInfo(restaurant.caveLayer);
  const hasRumors = restaurant.rumors.length > 0;
  const hasNotes = restaurant.notes.length > 0;

  return (
    <Card
      className={cn(
        'overflow-hidden border-amber-200 dark:border-amber-800/50',
        className
      )}
    >
      {/* Header with warm restaurant theme */}
      <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2 text-xl text-amber-900 dark:text-amber-100">
                {restaurant.locationName}
              </CardTitle>
              <CardDescription className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
                <MapPin className="h-3.5 w-3.5" />
                Cave Restaurant Chain
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge
              className={cn(
                'border-0',
                restaurant.isOpen
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
              )}
            >
              {restaurant.isOpen ? 'Open' : 'Closed'}
            </Badge>
            <Badge className={cn('border-0', caveLayerInfo.className)}>
              {caveLayerInfo.label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-5">
        {/* Special of the Day - Prominent display */}
        {restaurant.specialOfTheDay && (
          <div className="rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-4 dark:border-amber-800/50 dark:from-amber-950/20 dark:to-yellow-950/20">
            <div className="mb-2 flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                Special of the Day
              </h3>
              <Sparkles className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-lg font-medium text-amber-800 dark:text-amber-200">
              {restaurant.specialOfTheDay}
            </p>
          </div>
        )}

        {/* Rumors Section - Gossip style */}
        {hasRumors && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                Whispers & Rumors
              </h3>
            </div>
            <div className="space-y-2">
              {restaurant.rumors.map((rumor, index) => (
                <div
                  key={index}
                  className="relative rounded-lg border border-amber-100 bg-amber-50/50 p-3 pl-6 dark:border-amber-900/30 dark:bg-amber-950/20"
                >
                  <span className="absolute top-3 left-2 text-amber-400 dark:text-amber-600">
                    &ldquo;
                  </span>
                  <p className="text-muted-foreground text-sm italic">
                    {rumor}
                  </p>
                  <span className="absolute right-3 -bottom-1 text-amber-400 dark:text-amber-600">
                    &rdquo;
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ambiance/Notes Section - Setting the scene */}
        {hasNotes && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                Ambiance
              </h3>
            </div>
            <p className="text-muted-foreground rounded-lg border border-dashed border-amber-200 bg-amber-50/30 p-3 text-sm leading-relaxed dark:border-amber-800/30 dark:bg-amber-950/10">
              {restaurant.notes}
            </p>
          </div>
        )}

        {/* Location details footer */}
        <div className="border-t border-amber-100 pt-3 dark:border-amber-900/30">
          <p className="text-muted-foreground text-xs">
            {caveLayerInfo.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
