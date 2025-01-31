import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/shadcn/utils';

const buttonVariants = cva(
  'rounded-pill inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-hover-primary hover:text-hover-primary-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-hover-secondary hover:text-hover-secondary-foreground hover:text-white',
        tertiary:
          'bg-tertiary text-tertiary-foreground hover:bg-hover-tertiary hover:text-hover-tertiary-foreground',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline text-black-blue hover:text-blue',
      },
      size: {
        large: 'px-2xl py-lg elytro-text-body-bold',
        medium: 'px-xl py-md elytro-text-small',
        small: 'px-lg py-sm text-smaller',
        tiny: 'px-md py-3xs elytro-text-tiny-body',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'medium',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
