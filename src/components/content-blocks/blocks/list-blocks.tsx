import { withContentValidation } from "@9gustin/react-notion-render";
import type { DropedProps } from "@9gustin/react-notion-render/dist/hoc/withContentValidation";
import {
  LIST_BLOCK_VARIANT,
  listItemsFromChildren,
  listItemsFromProps,
} from "../list-utils";
import { mapListTextParts } from "../rich-text";
import type { ListBlockLike, ListBlockVariant } from "../types";
import { Typography } from "../../typography";

function ListBlockView(props: DropedProps & { variant: ListBlockVariant }) {
  const { variant, ...rest } = props;
  const block = rest.config?.block as ListBlockLike | undefined;
  const blockItems =
    block != null && Array.isArray(block.items)
      ? block.items.map((item) => mapListTextParts(item.content?.text ?? []))
      : [];
  const childItems = listItemsFromChildren(rest.children);
  const items =
    blockItems.length > 0
      ? blockItems
      : childItems.length > 0
        ? childItems
        : listItemsFromProps(rest);
  const { tag: Tag, className, testId } = LIST_BLOCK_VARIANT[variant];

  return (
    <Tag className={className} data-testid={testId}>
      {items.map((item, i) => (
        <Typography component="li" key={i}>
          {item}
        </Typography>
      ))}
    </Tag>
  );
}

export const BulletListBlock = withContentValidation((props: DropedProps) => (
  <ListBlockView {...props} variant="bullet" />
));

export const NumberedListBlock = withContentValidation((props: DropedProps) => (
  <ListBlockView {...props} variant="numbered" />
));
