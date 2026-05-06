import { getPageData } from "@/services/notion";
import { formatPageMetadata } from "@/utils/formatter";
import {
  buildShareMetadata,
  type ShareMetadataOptions,
} from "@/utils/share-metadata";

/** Metadata for static routes backed by a single Notion page (cover URL from page). */
export async function metadataFromNotionPageId(
  notionPageId: string,
  options?: ShareMetadataOptions,
): Promise<ReturnType<typeof buildShareMetadata>> {
  const page = await getPageData(notionPageId);
  const meta = formatPageMetadata(page);
  return buildShareMetadata(
    {
      title: meta.title,
      description: meta.description,
      thumbnail: meta.thumbnail,
    },
    options,
  );
}
