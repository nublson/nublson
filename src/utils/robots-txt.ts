const AI_BOT_USER_AGENTS = [
  "GPTBot",
  "ClaudeBot",
  "PerplexityBot",
  "anthropic-ai",
  "Bytespider",
  "Amazonbot",
  "Meta-ExternalFetcher",
] as const;

export const CONTENT_SIGNAL = "search=yes, ai-input=yes, ai-train=yes";

export function buildRobotsTxt(baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, "");

  const lines = [
    "User-Agent: *",
    "Allow: /",
    `Content-Signal: ${CONTENT_SIGNAL}`,
    "",
    ...AI_BOT_USER_AGENTS.map((bot) => `User-Agent: ${bot}`),
    "Allow: /",
    "",
    `Sitemap: ${base}/sitemap.xml`,
  ];

  return `${lines.join("\n")}\n`;
}
