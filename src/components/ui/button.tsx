import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[hsl(38,65%,60%)] text-[hsl(0,0%,4%)] shadow hover:bg-[hsl(38,55%,52%)] focus-visible:ring-[hsl(38,65%,60%)]",
        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-600 focus-visible:ring-red-500",
        outline:
          "border border-[hsl(0,0%,15%)] bg-transparent text-[hsl(0,0%,95%)] shadow-sm hover:bg-[hsl(0,0%,12%)] hover:text-[hsl(38,65%,60%)]",
        secondary:
          "bg-[hsl(0,0%,12%)] text-[hsl(0,0%,95%)] shadow-sm hover:bg-[hsl(0,0%,18%)]",
        ghost:
          "text-[hsl(0,0%,80%)] hover:bg-[hsl(0,0%,12%)] hover:text-[hsl(0,0%,95%)]",
        link: "text-[hsl(38,65%,60%)] underline-offset-4 hover:underline",
        gold:
          "bg-gradient-to-r from-[hsl(38,65%,60%)] to-[hsl(38,45%,50%)] text-[hsl(0,0%,4%)] shadow-lg hover:shadow-[hsl(38,65%,60%)/30%] hover:opacity-90 font-semibold",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        xl: "h-14 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
