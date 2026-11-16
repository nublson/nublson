import { getLinkPreview } from "@/services/link-preview";
import { Suspense, type ReactElement, type ReactNode } from "react";
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
      <LinkPreviewCardBody
        href={href}
        title={preview.title}
        description={preview.description}
        siteName={preview.siteName}
        image={preview.image && <LinkPreviewImage src={preview.image} />}
      />
    </LinkHoverCard>
  );
}

/**
 * The hover card's content: an optional image over the title, description
 * and the linked site's favicon and name. Shared by link previews and gear
 * rows, which fill it from Notion instead of the linked page.
 */
export function LinkPreviewCardBody({
  href,
  title,
  description,
  siteName,
  image,
}: {
  href: string;
  title: string;
  description?: string;
  siteName?: string;
  image?: ReactNode;
}) {
  return (
    <>
      {image}
      <div className="flex flex-col gap-1 p-2.5">
        <p className="line-clamp-2 text-[13px] leading-5 font-medium text-balance text-foreground">
          {title}
        </p>
        {description && (
          <p className="line-clamp-2 text-xs leading-4 text-pretty text-muted-foreground">
            {description}
          </p>
        )}
        <p className="truncate pt-0.5 text-xs text-subtle-foreground">
          <SiteFavicon href={href} />
          {siteName ?? hostLabel(href)}
        </p>
      </div>
    </>
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
