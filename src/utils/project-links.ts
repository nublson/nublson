import type { PostMetadata } from "./formatter";

/** Where a project row points: its live site, else its source code. */
export function projectHref(
  post: Pick<PostMetadata, "path" | "source">,
): string | undefined {
  return post.path?.trim() || post.source?.trim() || undefined;
}

/**
 * Absolute URL for a project in feeds and agent files. Projects have no page
 * of their own, so one without a link points at its row on /projects.
 */
export function projectPublicUrl(
  baseUrl: string,
  post: Pick<PostMetadata, "path" | "source" | "slug">,
): string {
  const base = baseUrl.replace(/\/$/, "");
  return projectHref(post) ?? `${base}/projects#${post.slug}`;
}
