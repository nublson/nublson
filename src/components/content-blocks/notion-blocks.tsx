import { Fragment, type ReactNode } from "react";
import { HeadingBlock } from "./blocks/heading-blocks";
import { DividerBlock, ToggleBlock } from "./blocks/layout-blocks";
import { ListBlock } from "./blocks/list-blocks";
import {
  EmbedBlock,
  ImageBlock,
  LinkBlock,
  VideoBlock,
} from "./blocks/media-blocks";
import { TableBlock } from "./blocks/table-block";
import {
  CalloutBlock,
  CodeBlock,
  ParagraphBlock,
  QuoteBlock,
} from "./blocks/text-blocks";
import { groupBlocks } from "./group-blocks";
import type { NotionBlock } from "./types";

const warnedTypes = new Set<string>();

function warnUnsupported(type: string) {
  if (process.env.NODE_ENV !== "development" || warnedTypes.has(type)) return;
  warnedTypes.add(type);
  console.warn(`Notion block type "${type}" is not rendered`);
}

/** Blocks in order, with consecutive list items merged into one list. */
function BlockList({ blocks }: { blocks: NotionBlock[] | undefined }) {
  if (!blocks?.length) return null;

  return groupBlocks(blocks).map((group) =>
    group.kind === "block" ? (
      <Fragment key={group.block.id}>{renderBlock(group.block)}</Fragment>
    ) : (
      <ListBlock
        key={group.items[0].id}
        kind={group.kind}
        items={group.items}
        renderChildren={(item) => <BlockList blocks={item.children} />}
      />
    ),
  );
}

export function renderBlock(block: NotionBlock): ReactNode {
  // Nested blocks, only when there are some.
  const children = block.children?.length ? (
    <BlockList blocks={block.children} />
  ) : undefined;

  switch (block.type) {
    case "paragraph":
      return <ParagraphBlock block={block}>{children}</ParagraphBlock>;
    case "heading_1":
    case "heading_2":
    case "heading_3":
      return <HeadingBlock block={block}>{children}</HeadingBlock>;
    case "quote":
      return <QuoteBlock block={block}>{children}</QuoteBlock>;
    case "callout":
      return <CalloutBlock block={block}>{children}</CalloutBlock>;
    case "toggle":
      return <ToggleBlock block={block}>{children}</ToggleBlock>;
    case "code":
      return <CodeBlock block={block} />;
    case "divider":
      return <DividerBlock />;
    case "image":
      return <ImageBlock block={block} />;
    case "video":
      return <VideoBlock block={block} />;
    case "embed":
    case "pdf":
      return <EmbedBlock block={block} />;
    case "file":
    case "bookmark":
      return <LinkBlock block={block} />;
    case "table":
      return <TableBlock block={block} />;
    case "synced_block":
    case "column_list":
    case "column":
      // Containers: their content flows into the page.
      return children ?? null;
    default:
      warnUnsupported(block.type);
      return null;
  }
}

/** A Notion page body, rendered from the API's blocks on the server. */
export function NotionBlocks({ blocks }: { blocks: NotionBlock[] }) {
  return <BlockList blocks={blocks} />;
}
