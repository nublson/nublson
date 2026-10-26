import { LinkFavicon, type LinkProps } from "notionic";
import { notionLinkAttributes } from "./link-attributes";
import { TextLink } from "./rich-text";

/**
 * A link in a Notion page body, with the site's link styling and the linked
 * site's favicon as `fetchBlocks` attached it (a globe for a site without
 * one). Links to this site stay plain, even when written as full URLs.
 */
export function NotionLink({ link, favicon, children }: LinkProps) {
  const { target, rel } = notionLinkAttributes(link.href);
  return (
    <TextLink
      href={link.href}
      target={target}
      rel={rel}
      icon={target === "_blank" ? <LinkFavicon favicon={favicon} /> : null}
    >
      {children}
    </TextLink>
  );
}
