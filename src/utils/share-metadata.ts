import type { Metadata } from "next";

export const TWITTER_CREATOR_HANDLE = "@nublson";

const DEFAULT_OG_IMAGE = "/logo.svg";

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
};

export function buildShareMetadata(
  { title, description, thumbnail }: ShareMetadataInput,
  options?: ShareMetadataOptions,
): Metadata {
  const ogImage = thumbnail ?? DEFAULT_OG_IMAGE;
  const openGraphType = options?.openGraphType ?? "website";

  return {
    title: options?.absoluteTitle ? { absolute: title } : title,
    description,
    openGraph: {
      title,
      description,
      type: openGraphType,
      images: [{ url: ogImage }],
      ...(options?.publishedTime
        ? { publishedTime: options.publishedTime }
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
