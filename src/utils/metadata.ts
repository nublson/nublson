import { getPageData } from "@/services/notion";
import { formatPageMetadata } from "@/utils/formatter";
import {
  buildShareMetadata,
  type ShareMetadataOptions,
} from "@/utils/share-metadata";

/**
 * Metadata for static routes backed by a single Notion page. The share image
 * is the route's generated `opengraph-image` title card.
 */
export async function metadataFromNotionPageId(
  notionPageId: string,
  options: ShareMetadataOptions & { canonical: string },
): Promise<ReturnType<typeof buildShareMetadata>> {
  const page = await getPageData(notionPageId);
  const meta = formatPageMetadata(page);
  const base = options.canonical === "/" ? "" : options.canonical;
  return buildShareMetadata(
    {
      title: meta.title,
      description: meta.description,
      image: `${base}/opengraph-image`,
    },
    options,
  );
}
