import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { RichText } from "../rich-text";
import { hasText } from "../text-utils";
import type { BlockProps } from "../types";
import { Typography } from "../../typography";

export const DividerBlock = () => <Separator className="w-full" />;

/** Blocks indented under another block, spaced like the page itself. */
export function NestedBlocks({
  children,
  className = "pl-6",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full flex flex-col [&>*+*]:mt-[18px]", className)}>
      {children}
    </div>
  );
}

export function ToggleBlock({ block, children }: BlockProps<"toggle">) {
  const { rich_text } = block.toggle;
  if (!hasText(rich_text) && !children) return null;

  return (
    <details className="w-full max-w-[64ch]">
      <summary className="cursor-pointer">
        <Typography component="span" size="article" className="text-foreground">
          <RichText text={rich_text} defaultColor="inherit" />
        </Typography>
      </summary>
      {children && <NestedBlocks className="pl-5 mt-3">{children}</NestedBlocks>}
    </details>
  );
}
