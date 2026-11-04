import {
  loadOgFonts,
  OgImageTemplate,
  resolveOgImageData,
} from "@/components/og-image";
import { getDatabasePageBySlug } from "@/services/notion";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 10;

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const found = await getDatabasePageBySlug(
    process.env.NOTION_DATABASE_CONTENT_ID!,
    "Blog",
    slug,
  );

  const [data, fonts] = await Promise.all([
    resolveOgImageData({
      title: found?.metadata.title ?? "Blog Post",
      category: found?.metadata.category,
      publishedDate: found?.metadata.published_date,
      thumbnailUrl: found?.metadata.thumbnail,
    }),
    loadOgFonts(),
  ]);

  return new ImageResponse(<OgImageTemplate {...data} />, { ...size, fonts });
}
