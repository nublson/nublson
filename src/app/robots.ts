import type { MetadataRoute } from "next";

const AI_BOT_USER_AGENTS = [
  "GPTBot",
  "ClaudeBot",
  "PerplexityBot",
  "anthropic-ai",
  "Bytespider",
  "Amazonbot",
  "Meta-ExternalFetcher",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // Explicit allow for named AI bots as a safeguard if the wildcard
      // rule above is ever tightened.
      { userAgent: [...AI_BOT_USER_AGENTS], allow: "/" },
    ],
    sitemap: `${process.env.BASE_URL}/sitemap.xml`,
  };
}
