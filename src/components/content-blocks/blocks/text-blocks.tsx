import { Typography } from "../../typography";
import { RichText } from "../rich-text";
import { hasText, plainText } from "../text-utils";
import type { BlockProps } from "../types";
import { CodeBlockHighlight } from "./code-block-highlight";
import { NestedBlocks } from "./layout-blocks";

export function ParagraphBlock({ block, children }: BlockProps<"paragraph">) {
  const { rich_text } = block.paragraph;
  const text = hasText(rich_text);
  if (!text && !children) return null;

  return (
    <>
      {text && (
        <Typography
          data-testid="paragraph"
          size="article"
          className="w-full max-w-[64ch]"
        >
          <RichText text={rich_text} />
        </Typography>
      )}
      {children && <NestedBlocks>{children}</NestedBlocks>}
    </>
  );
}

export function CalloutBlock({ block, children }: BlockProps<"callout">) {
  const { rich_text, icon } = block.callout;
  if (!hasText(rich_text) && !children) return null;
  const emoji = icon?.type === "emoji" ? icon.emoji : "";

  return (
    <div className="w-full rounded-lg bg-card p-3 shadow-[inset_0_0_0_1px_var(--input)] flex items-start justify-start">
      {emoji !== "" && (
        <Typography component="span" className="py-1.5">
          {emoji}
        </Typography>
      )}
      <div className="p-1.5 min-w-0 flex-1">
        <Typography size="article" className="w-full text-foreground">
          <RichText text={rich_text} defaultColor="inherit" />
        </Typography>
        {children && (
          <NestedBlocks className="mt-[18px]">{children}</NestedBlocks>
        )}
      </div>
    </div>
  );
}

export function CodeBlock({ block }: BlockProps<"code">) {
  const code = plainText(block.code.rich_text);
  if (code.trim() === "") return null;

  return <CodeBlockHighlight language={block.code.language} code={code} />;
}

export function QuoteBlock({ block, children }: BlockProps<"quote">) {
  const { rich_text } = block.quote;
  if (!hasText(rich_text) && !children) return null;

  return (
    <blockquote className="w-full max-w-[64ch] border-l-2 border-input pl-4">
      <Typography size="article" className="text-foreground">
        <RichText text={rich_text} defaultColor="inherit" />
      </Typography>
      {children && <NestedBlocks className="mt-[18px]">{children}</NestedBlocks>}
    </blockquote>
  );
}
