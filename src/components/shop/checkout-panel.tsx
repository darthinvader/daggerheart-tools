import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { Gold } from '@/lib/schemas/character-state';

import { canAfford, formatGoldAmount } from '../../features/shop/gold-math';
import type { CartEntry } from '../../features/shop/use-shop-cart';

interface CheckoutPanelProps {
  entries: CartEntry[];
  totalPrice: number;
  totalItems: number;
  gold: Gold;
  onUpdateQuantity: (itemName: string, quantity: number) => void;
  onRemove: (itemName: string) => void;
  onClear: () => void;
  onPurchase: () => void;
  purchaseError?: string;
}

export function CheckoutPanel({
  entries,
  totalPrice,
  totalItems,
  gold,
  onUpdateQuantity,
  onRemove,
  onClear,
  onPurchase,
  purchaseError,
}: CheckoutPanelProps) {
  const affordable = canAfford(gold, totalPrice);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-1 pb-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <ShoppingCart className="h-4 w-4" />
          Cart ({totalItems})
        </h3>
        {entries.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-muted-foreground h-7 text-xs"
          >
            Clear
          </Button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="text-muted-foreground flex flex-1 items-center justify-center text-sm">
          Cart is empty
        </div>
      ) : (
        <>
          <ScrollArea className="flex-1">
            <div className="space-y-2 pr-2">
              {entries.map(entry => (
                <div
                  key={entry.item.name}
                  className="bg-card/50 flex items-center gap-2 rounded-md border p-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {entry.item.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {formatGoldAmount(entry.unitPrice)} each
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() =>
                        onUpdateQuantity(entry.item.name, entry.quantity - 1)
                      }
                      aria-label={`Decrease ${entry.item.name} quantity`}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="min-w-[1.25rem] text-center text-xs font-medium">
                      {entry.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() =>
                        onUpdateQuantity(entry.item.name, entry.quantity + 1)
                      }
                      aria-label={`Increase ${entry.item.name} quantity`}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive h-6 w-6"
                      onClick={() => onRemove(entry.item.name)}
                      aria-label={`Remove ${entry.item.name} from cart`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <Separator className="my-3" />

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Total</span>
              <span
                className={
                  affordable
                    ? 'font-semibold'
                    : 'text-destructive font-semibold'
                }
              >
                {formatGoldAmount(totalPrice)}
              </span>
            </div>

            {!affordable && (
              <p className="text-destructive text-xs" role="alert">
                Not enough gold
              </p>
            )}

            {purchaseError && (
              <p className="text-destructive text-xs" role="alert">
                {purchaseError}
              </p>
            )}

            <Button
              className="w-full"
              disabled={!affordable || entries.length === 0}
              onClick={onPurchase}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Purchase {totalItems} item{totalItems > 1 ? 's' : ''}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
