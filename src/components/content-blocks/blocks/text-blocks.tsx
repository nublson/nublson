import { withContentValidation } from "@9gustin/react-notion-render";
import type { DropedProps } from "@9gustin/react-notion-render/dist/hoc/withContentValidation";
import React from "react";
import { mapParagraphChildren } from "../rich-text";
import { Typography } from "../../typography";

export const ParagraphBlock = withContentValidation((props: DropedProps) => {
  const hasChildren = React.Children.count(props.children) > 0;
  const content = hasChildren
    ? mapParagraphChildren(props.children)
    : (props.plainText ?? "");

  return <Typography data-testid="paragraph">{content}</Typography>;
});

export const CalloutBlock = withContentValidation((props: DropedProps) => (
  <div className="w-full p-3 rounded-md">
    <Typography>{props.children}</Typography>
  </div>
));

export const CodeBlock = withContentValidation((props: DropedProps) => (
  <pre className="w-full">
    <code>{props.children}</code>
  </pre>
));

export const QuoteBlock = withContentValidation((props: DropedProps) => (
  <blockquote className="w-full border-l-2 italic text-muted-foreground pl-4">
    <Typography>{props.children}</Typography>
  </blockquote>
));
