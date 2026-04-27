import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import * as React from "react";

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "text-[100px] leading-[120px] tracking-[-5px] text-accent-foreground",
      h2: "text-[80px] leading-24 tracking-[-4px] text-accent-foreground",
      h3: "text-[32px] leading-[38.4px] tracking-[-0.96px] text-accent-foreground",
      h4: "text-[20px] leading-[33.6px] tracking-[-0.42px] text-accent-foreground",
    },
    size: {
      regular:
        "text-lg leading-[28.8px] tracking-[-0.36px] text-muted-foreground",
      small:
        "text-base leading-[28.8px] tracking-[-0.36px] text-muted-foreground",
    },
  },
});

type TypographyComponent =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "a"
  | "li";
type TypographyVariant = "h1" | "h2" | "h3" | "h4";
type TypographySize = "regular" | "small";

interface BaseTypographyProps extends React.HTMLAttributes<HTMLElement> {
  component?: TypographyComponent;
}

// Props when using variant (variant has priority, size is not allowed)
interface VariantTypographyProps extends BaseTypographyProps {
  variant: TypographyVariant;
  size?: never;
  component?: TypographyComponent;
}

// Props when using size or neither (no variant allowed, defaults to size="regular")
interface SizeTypographyProps extends BaseTypographyProps {
  variant?: never;
  size?: TypographySize;
  component?: TypographyComponent;
}

type TypographyProps = VariantTypographyProps | SizeTypographyProps;

function Typography({
  className,
  component = "p",
  variant,
  size,
  children,
  ...props
}: TypographyProps) {
  const Component: React.ElementType = component;

  // Variant has priority over size - if variant exists, size is not applied
  // Default size is "regular" when no variant and no size is provided
  const finalSize = variant ? undefined : (size ?? "regular");

  return (
    <Component
      className={cn(
        typographyVariants({
          variant,
          size: finalSize,
          className,
        }),
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export { Typography, typographyVariants };
export type { TypographyComponent, TypographySize, TypographyVariant };
