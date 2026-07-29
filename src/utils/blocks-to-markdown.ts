import type { BlockWithChildren } from "@/services/notion";
import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

type RichTextLike = Pick<
  RichTextItemResponse,
  "plain_text" | "href" | "annotations"
> & {
  text?: { content?: string; link?: { url?: string | null } | null };
};

function escapeYamlValue(value: string): string {
  if (/[:#{}[\],&*?|>!%@`"'\n]/.test(value) || value.trim() !== value) {
    return JSON.stringify(value);
  }
  return value;
}

function richTextToMarkdown(parts: RichTextLike[] | undefined): string {
  if (!parts?.length) return "";

  return parts
    .map((part) => {
      const text = part.plain_text ?? part.text?.content ?? "";
      const link = part.href ?? part.text?.link?.url ?? null;
      const annotations = part.annotations;

      let output = text;
      if (annotations?.code) output = `\`${output}\``;
      if (annotations?.bold) output = `**${output}**`;
      if (annotations?.italic) output = `*${output}*`;
      if (annotations?.strikethrough) output = `~~${output}~~`;

      if (link) {
        output = `[${output}](${link})`;
      }

      return output;
    })
    .join("");
}

function getBlockRichText(block: BlockWithChildren): RichTextLike[] {
  const payload = block[block.type as keyof BlockWithChildren];
  if (payload == null || typeof payload !== "object") return [];

  const richText = (payload as { rich_text?: RichTextLike[] }).rich_text;
  return richText ?? [];
}

function getBlockChildren(block: BlockWithChildren): BlockWithChildren[] {
  if (block.children?.length) return block.children;

  const payload = block[block.type as keyof BlockWithChildren];
  if (payload == null || typeof payload !== "object") return [];

  const nestedChildren = (payload as { children?: BlockWithChildren[] })
    .children;
  return nestedChildren ?? [];
}

function renderListItems(
  blocks: BlockWithChildren[],
  ordered: boolean,
  depth = 0,
): string {
  const indent = "  ".repeat(depth);

  return blocks
    .map((block, index) => {
      const marker = ordered ? `${index + 1}.` : "-";
      const text = richTextToMarkdown(getBlockRichText(block));
      const children = getBlockChildren(block);
      const childMarkdown =
        children.length > 0
          ? `\n${renderListItems(children, ordered, depth + 1)}`
          : "";

      return `${indent}${marker} ${text}${childMarkdown}`;
    })
    .join("\n");
}

function renderTable(block: BlockWithChildren): string {
  const rows = getBlockChildren(block).filter(
    (child) => child.type === "table_row",
  );
  if (rows.length === 0) return "";

  const tableRows = rows.map((row) => {
    const cells =
      (row.table_row as { cells?: RichTextLike[][] } | undefined)?.cells ?? [];
    return cells.map((cell) => richTextToMarkdown(cell));
  });

  const [header, ...body] = tableRows;
  if (!header) return "";

  const separator = header.map(() => "---");
  const lines = [
    `| ${header.join(" | ")} |`,
    `| ${separator.join(" | ")} |`,
    ...body.map((row) => `| ${row.join(" | ")} |`),
  ];

  return lines.join("\n");
}

function renderBlock(block: BlockWithChildren): string {
  switch (block.type) {
    case "paragraph":
      return richTextToMarkdown(getBlockRichText(block));

    case "heading_1":
      return `# ${richTextToMarkdown(getBlockRichText(block))}`;

    case "heading_2":
      return `## ${richTextToMarkdown(getBlockRichText(block))}`;

    case "heading_3":
      return `### ${richTextToMarkdown(getBlockRichText(block))}`;

    case "bulleted_list_item":
      return renderListItems([block], false);

    case "numbered_list_item":
      return renderListItems([block], true);

    case "quote":
      return `> ${richTextToMarkdown(getBlockRichText(block))}`;

    case "divider":
      return "---";

    case "code": {
      const codePayload = block.code as
        | { language?: string; rich_text?: RichTextLike[] }
        | undefined;
      const language = codePayload?.language ?? "";
      const code = richTextToMarkdown(codePayload?.rich_text);
      return `\`\`\`${language}\n${code}\n\`\`\``;
    }

    case "callout": {
      const calloutPayload = block.callout as
        | { icon?: { emoji?: string }; rich_text?: RichTextLike[] }
        | undefined;
      const emoji = calloutPayload?.icon?.emoji ?? "";
      const text = richTextToMarkdown(calloutPayload?.rich_text);
      return `> ${emoji ? `${emoji} ` : ""}${text}`;
    }

    case "toggle": {
      const title = richTextToMarkdown(getBlockRichText(block));
      const children = blocksToMarkdown(getBlockChildren(block));
      return children ? `**${title}**\n\n${children}` : `**${title}**`;
    }

    case "image": {
      const imagePayload = block.image as
        | {
            type?: "external" | "file";
            external?: { url?: string };
            file?: { url?: string };
            caption?: RichTextLike[];
          }
        | undefined;
      const url =
        imagePayload?.type === "external"
          ? imagePayload.external?.url
          : imagePayload?.file?.url;
      if (!url) return "";
      const caption = richTextToMarkdown(imagePayload?.caption);
      return caption ? `![${caption}](${url})` : `![](${url})`;
    }

    case "video": {
      const videoPayload = block.video as
        | {
            type?: "external" | "file";
            external?: { url?: string };
            file?: { url?: string };
          }
        | undefined;
      const url =
        videoPayload?.type === "external"
          ? videoPayload.external?.url
          : videoPayload?.file?.url;
      return url ? `[Video](${url})` : "";
    }

    case "table":
      return renderTable(block);

    case "table_row":
      return "";

    default:
      return richTextToMarkdown(getBlockRichText(block));
  }
}

function groupListBlocks(blocks: BlockWithChildren[]): BlockWithChildren[][] {
  const groups: BlockWithChildren[][] = [];
  let currentType: BlockWithChildren["type"] | null = null;
  let currentGroup: BlockWithChildren[] = [];

  for (const block of blocks) {
    if (block.type === "bulleted_list_item" || block.type === "numbered_list_item") {
      if (currentType === block.type) {
        currentGroup.push(block);
      } else {
        if (currentGroup.length > 0) groups.push(currentGroup);
        currentType = block.type;
        currentGroup = [block];
      }
      continue;
    }

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
      currentGroup = [];
      currentType = null;
    }
    groups.push([block]);
  }

  if (currentGroup.length > 0) groups.push(currentGroup);
  return groups;
}

export function blocksToMarkdown(blocks: BlockWithChildren[]): string {
  const sections: string[] = [];

  for (const group of groupListBlocks(blocks)) {
    const first = group[0];
    if (!first) continue;

    if (first.type === "bulleted_list_item") {
      sections.push(renderListItems(group, false));
      continue;
    }

    if (first.type === "numbered_list_item") {
      sections.push(renderListItems(group, true));
      continue;
    }

    for (const block of group) {
      const rendered = renderBlock(block);
      if (rendered) sections.push(rendered);
    }
  }

  return sections.join("\n\n");
}

export function postToMarkdown({
  title,
  description,
  publishedDate,
  author,
  category,
  blocks,
}: {
  title: string;
  description: string;
  publishedDate: string;
  author: string;
  category?: string;
  blocks: BlockWithChildren[];
}): string {
  const frontMatter = [
    "---",
    `title: ${escapeYamlValue(title)}`,
    `description: ${escapeYamlValue(description)}`,
    `published: ${escapeYamlValue(publishedDate)}`,
    `author: ${escapeYamlValue(author)}`,
    ...(category ? [`category: ${escapeYamlValue(category)}`] : []),
    "---",
  ].join("\n");

  const body = blocksToMarkdown(blocks);
  return body ? `${frontMatter}\n\n${body}\n` : `${frontMatter}\n`;
}
