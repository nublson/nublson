import { renderOgImage } from "@/components/og-image";
import { getDatabasePageBySlug } from "@/services/notion";

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
    process.env.NOTION_DATABASE_BOOKS_ID!,
    undefined,
    slug,
  );

  return renderOgImage(found?.metadata.title ?? "Book");
}
