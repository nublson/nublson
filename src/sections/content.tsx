import { NotionBlocks } from "@/components/content-blocks";
import { BlockWithChildren } from "@/services/notion";

interface ContentSectionProps {
  blocks: BlockWithChildren[];
}

export default function ContentSection({ blocks }: ContentSectionProps) {
  // A blank Notion page renders nothing, so it adds no empty gap to the layout.
  if (blocks.length === 0) return null;

  return (
    <section
      id="content"
      className="w-full flex flex-col items-start justify-start space-y-0 [&>*+*]:mt-[18px]"
    >
      <NotionBlocks blocks={blocks} />
    </section>
  );
}
