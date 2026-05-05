import { getListBlockItems } from "@/utils/formatter";
import type { DropedProps } from "@9gustin/react-notion-render/dist/hoc/withContentValidation";
import React from "react";
import {
  isNotionRichTextElementProps,
  mapParagraphChildren,
} from "./rich-text";
import type { ListBlockLike, ListBlockVariant } from "./types";

export const LIST_BLOCK_VARIANT: Record<
  ListBlockVariant,
  { tag: "ul" | "ol"; className: string; testId: string }
> = {
  bullet: {
    tag: "ul",
    className: "list list-outside list-disc w-full ps-6",
    testId: "bulleted-list-item",
  },
  numbered: {
    tag: "ol",
    className: "list list-outside list-decimal w-full ps-6",
    testId: "numbered-list-item",
  },
};

export function listItemsFromProps(props: DropedProps): string[] {
  const block = props.config?.block as ListBlockLike | undefined;
  if (block != null && Array.isArray(block.items) && block.items.length > 0) {
    return block.items.map((item) =>
      (item.content?.text ?? [])
        .map((textPart) => textPart.plain_text ?? "")
        .join(""),
    );
  }
  if (props.config?.block != null) {
    return getListBlockItems(
      props.config.block as Parameters<typeof getListBlockItems>[0],
    );
  }
  if (props.plainText != null) {
    return [props.plainText];
  }
  return [];
}

export function listItemsFromChildren(children: React.ReactNode): React.ReactNode[] {
  const childArray = React.Children.toArray(children);
  if (childArray.length === 0) {
    return [];
  }

  const allRichTextNodes = childArray.every(
    (child) =>
      React.isValidElement(child) &&
      isNotionRichTextElementProps(child.props as unknown),
  );

  if (allRichTextNodes) {
    return [mapParagraphChildren(children)];
  }

  return childArray.map((child) => {
    if (!React.isValidElement(child)) {
      return child;
    }

    const nested = child.props as { children?: React.ReactNode };
    if (React.Children.count(nested.children) > 0) {
      return mapParagraphChildren(nested.children);
    }

    return nested.children ?? child;
  });
}
