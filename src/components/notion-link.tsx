import type { LinkProps } from "notionic";
import { notionLinkAttributes } from "./link-attributes";
import { TextLink } from "./rich-text";
import { SiteFavicon } from "./site-favicon";

/**
 * A link in a Notion page body, with the site's link styling and the linked
 * site's favicon from the cached lookup shared with descriptions (a globe for
 * a site without one). Links to this site stay plain, even when written as
 * full URLs.
 */
export function NotionLink({ link, children }: LinkProps) {
  const { target, rel } = notionLinkAttributes(link.href);
  return (
    <TextLink
      href={link.href}
      target={target}
      rel={rel}
      icon={<SiteFavicon href={link.href} />}
    >
      {children}
    </TextLink>
  );
}
