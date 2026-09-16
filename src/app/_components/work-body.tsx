import ContentSection from "@/sections/content";
import type { BlockWithChildren } from "@/services/notion";

export function WorkBody({ blocks }: { blocks: BlockWithChildren[] }) {
  return <ContentSection blocks={blocks} />;
}
