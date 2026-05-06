import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import * as React from "react";

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "text-[50px] lg:text-[100px] leading-[1.2em] tracking-[-0.05em] text-accent-foreground font-semibold",
      h2: "text-[48px] lg:text-[80px] leading-[1.2em] tracking-[-0.03em] text-accent-foreground font-semibold",
      h3: "text-[24px] lg:text-[32px] leading-[1.6em] tracking-[-0.02em] text-accent-foreground font-semibold",
      h4: "text-[19px] lg:text-[21px] leading-[33.6px] tracking-[-0.42px] text-accent-foreground font-semibold",
    },
    size: {
      regular:
        "text-base lg:text-lg leading-[1.6em] tracking-[-0.02em] text-muted-foreground",
      small:
        "text-sm lg:text-base leading-[1.6em] tracking-[-0.02em] text-muted-foreground",
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
