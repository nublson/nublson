/**
 * The hosts whose Notion embeds load live, for notionic's `embeds`, from a
 * comma- or space-separated list like `NOTION_EMBED_HOSTS`. Each host
 * includes its subdomains. The site's own host (and any host it sits under)
 * is dropped: a page framed from its own origin can lift the iframe's
 * sandbox, so the site's components belong in demos instead.
 */
export function parseEmbedHosts(
  value: string | undefined,
  siteUrl: string | undefined,
): string[] {
  const own = hostOf(siteUrl);
  const hosts = (value ?? "")
    .split(/[\s,]+/)
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean)
    .filter((host) => !own || (own !== host && !own.endsWith(`.${host}`)));
  return [...new Set(hosts)];
}

function hostOf(url: string | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}
