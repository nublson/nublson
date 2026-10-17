import type { ReactNode } from "react";
import { Typography } from "../../typography";
import type { ListKind } from "../group-blocks";
import { RichText } from "../rich-text";
import type { NotionBlock } from "../types";
import { NestedBlocks } from "./layout-blocks";

const LIST_VARIANT: Record<
  ListKind,
  { tag: "ul" | "ol"; className: string; testId: string }
> = {
  bulleted: {
    tag: "ul",
    className: "list-content list-disc max-w-[64ch]",
    testId: "bulleted-list-item",
  },
  numbered: {
    tag: "ol",
    className: "list-content list-decimal max-w-[64ch]",
    testId: "numbered-list-item",
  },
  todo: {
    tag: "ul",
    className: "list-content list-none pl-0! max-w-[64ch]",
    testId: "to-do-list-item",
  },
};

function ItemBody({ item }: { item: NotionBlock }) {
  if (item.type === "bulleted_list_item") {
    return <RichText text={item.bulleted_list_item.rich_text} />;
  }
  if (item.type === "numbered_list_item") {
    return <RichText text={item.numbered_list_item.rich_text} />;
  }
  if (item.type === "to_do") {
    const { rich_text, checked } = item.to_do;
    const text = <RichText text={rich_text} />;
    return (
      <span className="inline-flex items-start gap-2">
        <input
          type="checkbox"
          checked={checked}
          disabled
          readOnly
          aria-label={checked ? "Done" : "Not done"}
          className="mt-[0.3em] size-3.5 shrink-0 accent-foreground"
        />
        <span>{checked ? <s>{text}</s> : text}</span>
      </span>
    );
  }
  return null;
}

export function ListBlock({
  kind,
  items,
  renderChildren,
}: {
  kind: ListKind;
  items: NotionBlock[];
  /** Renders an item's nested blocks. */
  renderChildren: (item: NotionBlock) => ReactNode;
}) {
  const { tag: Tag, className, testId } = LIST_VARIANT[kind];

  return (
    <Tag className={className} data-testid={testId}>
      {items.map((item) => (
        <Typography component="li" key={item.id} size="article" className="w-full">
          <ItemBody item={item} />
          {item.children?.length ? (
            <NestedBlocks className="pl-0 mt-1.5 [&>*+*]:mt-1.5">
              {renderChildren(item)}
            </NestedBlocks>
          ) : null}
        </Typography>
      ))}
    </Tag>
  );
}
