import { getLinkPreview } from "@/services/link-preview";
import { Suspense, type ReactElement } from "react";
import { LinkHoverCard } from "./link-hover-card";
import { notionLinkAttributes } from "./link-attributes";
import { LinkPreviewImage } from "./link-preview-image";
import { SiteFavicon } from "./site-favicon";

type LinkPreviewProps = {
  href: string;
  /** The link itself: an anchor, which becomes the hover card's trigger. */
  children: ReactElement;
};

/**
 * Shows the linked page's image, title and description in a hover card.
 * Links to this site, and pages without a preview, render unchanged. The
 * link streams in first, so a slow site never holds up the page.
 */
export function LinkPreview({ href, children }: LinkPreviewProps) {
  if (notionLinkAttributes(href).target !== "_blank") return children;

  return (
    <Suspense fallback={children}>
      <LinkPreviewCard href={href}>{children}</LinkPreviewCard>
    </Suspense>
  );
}

async function LinkPreviewCard({ href, children }: LinkPreviewProps) {
  const preview = await getLinkPreview(href);
  if (!preview) return children;

  return (
    <LinkHoverCard trigger={children}>
      {preview.image && <LinkPreviewImage src={preview.image} />}
      <div className="flex flex-col gap-1 p-2.5">
        <p className="line-clamp-2 text-[13px] leading-5 font-medium text-balance text-foreground">
          {preview.title}
        </p>
        {preview.description && (
          <p className="line-clamp-2 text-xs leading-4 text-pretty text-muted-foreground">
            {preview.description}
          </p>
        )}
        <p className="truncate pt-0.5 text-xs text-subtle-foreground">
          <SiteFavicon href={href} />
          {preview.siteName ?? hostLabel(href)}
        </p>
      </div>
    </LinkHoverCard>
  );
}

/** "example.com" for "https://www.example.com/page". */
function hostLabel(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}
