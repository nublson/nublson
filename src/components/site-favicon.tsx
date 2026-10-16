import { cn } from "@/lib/utils";
import { getFavicon } from "@/services/favicon";
import { RiGlobalLine } from "@remixicon/react";
import { notionLinkAttributes } from "./content-blocks/link-attributes";

/** Same box as `SocialIcon`, so profile and plain links line up. */
const ICON_CLASS = "inline-block size-[13px] shrink-0 align-[-2px] mr-[5px]";

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
 * The linked site's favicon, inlined as a data URL so it is in the initial
 * HTML. Falls back to a globe in the text colour when the site has none.
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

  const src = await getFavicon(host);
  if (!src) {
    return (
      <RiGlobalLine
        aria-hidden
        data-slot="site-favicon"
        className={cn(ICON_CLASS, "text-muted-foreground", className)}
      />
    );
  }

  return (
    // A tiny inline data URL: next/image would only add a wrapper.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden
      data-slot="site-favicon"
      width={13}
      height={13}
      decoding="async"
      className={cn(ICON_CLASS, "rounded-[2px]", className)}
    />
  );
}
