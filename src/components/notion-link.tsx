import type { LinkProps } from "notionic";
import { notionLinkAttributes } from "./link-attributes";
import { TextLink } from "./rich-text";

/** A link in a Notion page body, with the site's favicons and link styling. */
export function NotionLink({ link, children }: LinkProps) {
  const { target, rel } = notionLinkAttributes(link.href);
  return (
    <TextLink href={link.href} target={target} rel={rel}>
      {children}
    </TextLink>
  );
}
