import { renderOgImage } from "@/components/og-image";
import { getPageData } from "@/services/notion";
import { formatPageMetadata } from "@/utils/formatter";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 10;

export default async function OgImage() {
  const page = await getPageData(process.env.NOTION_PAGE_WORK_ID!);
  return renderOgImage(formatPageMetadata(page).title || "Projects");
}
