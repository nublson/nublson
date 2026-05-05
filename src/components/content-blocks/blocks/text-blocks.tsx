import { withContentValidation } from "@9gustin/react-notion-render";
import type { DropedProps } from "@9gustin/react-notion-render/dist/hoc/withContentValidation";
import React from "react";
import { Typography } from "../../typography";
import { mapParagraphChildren } from "../rich-text";

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
    ? mapParagraphChildren(props.children)
    : (props.plainText ?? "");

  return <Typography data-testid="paragraph">{content}</Typography>;
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
        <Typography>{props.children}</Typography>
      </div>
    </div>
  );
});

export const CodeBlock = withContentValidation((props: DropedProps) => (
  <pre className="w-full">
    <code>{props.children}</code>
  </pre>
));

export const QuoteBlock = withContentValidation((props: DropedProps) => (
  <blockquote className="w-full border-l-2 italic pl-4">
    <Typography>{props.children}</Typography>
  </blockquote>
));
