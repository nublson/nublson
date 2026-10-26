import { getFavicon } from "@/services/favicon";
import { LinkFavicon } from "notionic";
import { notionLinkAttributes } from "./link-attributes";

/** The host to show an icon for, or null for links to this site. */
function externalHost(href: string): string | null {
  if (notionLinkAttributes(href).target !== "_blank") return null;
  try {
    return new URL(href).hostname || null;
  } catch {
    return null;
  }
}

/**
 * The linked site's favicon for every link (page bodies, hero and lede
 * descriptions, the link preview card), from the cached lookup in
 * `@/services/favicon`. Rendered by notionic's `LinkFavicon`: the icon
 * inlined as a data URL, or a muted globe when the site has none.
 */
export async function SiteFavicon({
  href,
  className,
}: {
  href: string;
  className?: string;
}) {
  const host = externalHost(href);
  if (!host) return null;

  return <LinkFavicon favicon={await getFavicon(host)} className={className} />;
}
