import type { NotionBlock } from "./types";

export type ListKind = "bulleted" | "numbered" | "todo";

export type BlockGroup =
  | { kind: "block"; block: NotionBlock }
  | { kind: ListKind; items: NotionBlock[] };

const LIST_KINDS: Partial<Record<NotionBlock["type"], ListKind>> = {
  bulleted_list_item: "bulleted",
  numbered_list_item: "numbered",
  to_do: "todo",
};

/** Merges consecutive list items of one kind into a list; other blocks stand alone. */
export function groupBlocks(blocks: NotionBlock[]): BlockGroup[] {
  const groups: BlockGroup[] = [];
  for (const block of blocks) {
    const kind = LIST_KINDS[block.type];
    if (!kind) {
      groups.push({ kind: "block", block });
      continue;
    }
    const last = groups[groups.length - 1];
    if (last && last.kind === kind) {
      last.items.push(block);
    } else {
      groups.push({ kind, items: [block] });
    }
  }
  return groups;
}
