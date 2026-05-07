import { withContentValidation } from "@9gustin/react-notion-render";
import type { DropedProps } from "@9gustin/react-notion-render/dist/hoc/withContentValidation";
import React from "react";
import { Typography } from "../../typography";
import { mapParagraphChildren } from "../rich-text";
import { CodeBlockHighlight } from "./code-block-highlight";

type CalloutIconLike = {
  emoji?: string;
};

type CalloutBlockLike = {
  content?: {
    icon?: CalloutIconLike;
  };
};

function getCalloutEmoji(block: unknown): string {
  if (block == null || typeof block !== "object") {
    return "";
  }

  const calloutBlock = block as CalloutBlockLike;
  return calloutBlock.content?.icon?.emoji ?? "";
}

export const ParagraphBlock = withContentValidation((props: DropedProps) => {
  const hasChildren = React.Children.count(props.children) > 0;
  const content = hasChildren
    ? mapParagraphChildren(props.children, props.config?.linkAttributes)
    : (props.plainText ?? "");

  return (
    <Typography data-testid="paragraph" className="w-full">
      {content}
    </Typography>
  );
});

export const CalloutBlock = withContentValidation((props: DropedProps) => {
  const emoji = getCalloutEmoji(props.config?.block);

  return (
    <div className="w-full p-3 rounded-md bg-card flex items-start justify-start">
      {emoji !== "" && (
        <Typography component="span" className="py-1.5">
          {emoji}
        </Typography>
      )}
      <div className="p-1.5">
        <Typography className="w-full text-accent-foreground">
          {props.children}
        </Typography>
      </div>
    </div>
  );
});

export const CodeBlock = withContentValidation((props: DropedProps) => (
  <CodeBlockHighlight
    language={props.language}
    code={props.plainText ?? ""}
  />
));

export const QuoteBlock = withContentValidation((props: DropedProps) => (
  <blockquote className="w-full mt-6 border-l-2 pl-6 italic">
    <Typography>{props.children}</Typography>
  </blockquote>
));
