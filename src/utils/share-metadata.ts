import type { Metadata } from "next";

export const TWITTER_CREATOR_HANDLE = "@nublson";

/** Raster fallback — Safari and many clients ignore SVG for share/OG previews. */
const DEFAULT_OG_IMAGE = "/apple-icon.png";

export type ShareMetadataInput = {
  title: string;
  description: string;
  thumbnail?: string;
};

export type ShareMetadataOptions = {
  /** Skip layout `title.template` suffix (used for home). */
  absoluteTitle?: boolean;
  openGraphType?: "website" | "article";
  publishedTime?: string;
  /** Maps to `article:section` (article OG type only). */
  section?: string;
  /** Maps to `article:tag` (article OG type only). */
  tags?: string[];
  /** Explicit canonical URL path (e.g. '/about'). Resolved against metadataBase. */
  canonical?: string;
};

export function buildShareMetadata(
  { title, description, thumbnail }: ShareMetadataInput,
  options?: ShareMetadataOptions,
): Metadata {
  const ogImage = thumbnail?.trim() ? thumbnail : DEFAULT_OG_IMAGE;
  const openGraphType = options?.openGraphType ?? "website";
  const isArticle = openGraphType === "article";

  return {
    title: options?.absoluteTitle ? { absolute: title } : title,
    description,
    ...(options?.canonical ? { alternates: { canonical: options.canonical } } : {}),
    openGraph: {
      title,
      description,
      type: openGraphType,
      images: [{ url: ogImage }],
      ...(options?.publishedTime
        ? { publishedTime: options.publishedTime }
        : {}),
      ...(isArticle && options?.section ? { section: options.section } : {}),
      ...(isArticle && options?.tags && options.tags.length > 0
        ? { tags: options.tags }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      creator: TWITTER_CREATOR_HANDLE,
      title,
      description,
      images: [ogImage],
    },
  };
}
