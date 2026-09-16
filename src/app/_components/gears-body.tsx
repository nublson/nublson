import ContentSection from "@/sections/content";
import type { BlockWithChildren } from "@/services/notion";

export function GearsBody({ blocks }: { blocks: BlockWithChildren[] }) {
  return <ContentSection blocks={blocks} />;
}
