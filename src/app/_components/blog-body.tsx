import ContentSection from "@/sections/content";
import type { BlockWithChildren } from "@/services/notion";

export function BlogBody({ blocks }: { blocks: BlockWithChildren[] }) {
  return <ContentSection blocks={blocks} />;
}
