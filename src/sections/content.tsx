import { NotionBlocks } from "@/components/content-blocks";
import { BlockWithChildren } from "@/services/notion";

interface ContentSectionProps {
  blocks: BlockWithChildren[];
}

export default function ContentSection({ blocks }: ContentSectionProps) {
  return (
    <section
      id="content"
      className="w-full flex flex-col items-start justify-start space-y-0 [&>*+*]:mt-[18px]"
    >
      <NotionBlocks blocks={blocks} />
    </section>
  );
}
