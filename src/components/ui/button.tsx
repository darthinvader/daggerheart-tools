import { Slot } from '@radix-ui/react-slot';
import { type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { buttonVariants } from './button-variants';

interface ButtonProps
  extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /**
   * Shows a loading spinner and disables the button.
   * When true, the button content is replaced with a spinner.
   */
  isLoading?: boolean;
  /**
   * Text to show when loading. If not provided, shows only the spinner.
   */
  loadingText?: string;
}

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  isLoading = false,
  loadingText,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  const isDisabled = disabled || isLoading;

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-loading={isLoading ? 'true' : undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isDisabled}
      aria-busy={isLoading ? 'true' : undefined}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          {loadingText && <span>{loadingText}</span>}
          {!loadingText && <span className="sr-only">Loading</span>}
        </>
      ) : (
        children
      )}
    </Comp>
  );
}

export { Button };
export type { ButtonProps };
