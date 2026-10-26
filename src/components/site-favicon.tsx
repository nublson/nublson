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
 * The linked site's favicon for links outside a Notion page body (hero and
 * lede descriptions, the link preview card), looked up and cached here since
 * no `fetchBlocks` attached it. Rendered by notionic's `LinkFavicon`, so it
 * matches the links in article bodies: the icon inlined as a data URL, or a
 * muted globe when the site has none.
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
