import { Typography } from "../../typography";
import { RichText } from "../rich-text";
import { hasText } from "../text-utils";
import type { BlockProps } from "../types";

type HeadingType = "heading_1" | "heading_2" | "heading_3";

// Heading 1 renders as an h2: the page title is the h1.
const HEADINGS = {
  heading_1: { component: "h2", variant: "h3", className: "w-full mt-10!" },
  heading_2: { component: "h2", variant: "h3", className: "w-full mt-8!" },
  heading_3: { component: "h3", variant: "h4", className: "w-full mt-6!" },
} as const;

export function HeadingBlock({ block, children }: BlockProps<HeadingType>) {
  const heading =
    block.type === "heading_1"
      ? block.heading_1
      : block.type === "heading_2"
        ? block.heading_2
        : block.heading_3;
  const { component, variant, className } = HEADINGS[block.type];

  return (
    <>
      {hasText(heading.rich_text) && (
        <Typography component={component} variant={variant} className={className}>
          <RichText text={heading.rich_text} defaultColor="inherit" />
        </Typography>
      )}
      {/* A toggleable heading's content: shown, rather than dropped. */}
      {children}
    </>
  );
}
