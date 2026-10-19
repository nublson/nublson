/**
 * Link behavior for Notion rich text: links to this site open in place,
 * everything else in a new tab.
 */
export function notionLinkAttributes(link: string): {
  target: "_self" | "_blank";
  rel?: string;
} {
  const isRootRelativePath = link.startsWith("/") && !link.startsWith("//");
  const isHashLink = link.startsWith("#");
  const baseOrigin = (() => {
    try {
      return new URL(process.env.BASE_URL ?? "").origin;
    } catch {
      return null;
    }
  })();
  const isSameOriginAbsoluteLink = (() => {
    if (baseOrigin == null) return false;
    try {
      return new URL(link).origin === baseOrigin;
    } catch {
      return false;
    }
  })();

  if (isRootRelativePath || isHashLink || isSameOriginAbsoluteLink) {
    return { target: "_self" };
  }
  return { target: "_blank", rel: "noopener noreferrer" };
}
