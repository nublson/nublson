const ARD_SPEC_VERSION = "1.0";

export type AiCatalogEntry = {
  identifier: string;
  displayName: string;
  description: string;
  type: string;
  url: string;
  tags: string[];
  representativeQueries: string[];
};

export type AiCatalog = {
  specVersion: string;
  host: {
    displayName: string;
    identifier: string;
    documentationUrl: string;
  };
  entries: AiCatalogEntry[];
};

export function buildAiCatalog(baseUrl: string): AiCatalog {
  const base = baseUrl.replace(/\/$/, "");

  return {
    specVersion: ARD_SPEC_VERSION,
    host: {
      displayName: "Nubelson Fernandes",
      identifier: "did:web:nublson.com",
      documentationUrl: `${base}/llms.txt`,
    },
    entries: [
      {
        identifier: "urn:air:nublson.com:mcp:content",
        displayName: "nublson.com Content MCP Server",
        description:
          "Read-only MCP server exposing blog posts, work case studies, gear recommendations and profile info over Streamable HTTP.",
        type: "application/mcp-server-card+json",
        url: `${base}/.well-known/mcp/server-card.json`,
        tags: ["mcp", "content", "read-only"],
        representativeQueries: [
          "read Nubelson Fernandes' blog posts as markdown",
          "search nublson.com work case studies",
          "what tools and gear does Nubelson Fernandes use",
        ],
      },
      {
        identifier: "urn:air:nublson.com:agent:card",
        displayName: "Nubelson Fernandes Agent Card",
        description:
          "Agent card describing the site's content-reading capability; no authentication required.",
        type: "application/agent-card+json",
        url: `${base}/.well-known/agent.json`,
        tags: ["a2a", "agent-card", "no-auth"],
        representativeQueries: [
          "what can the nublson.com agent do",
          "does nublson.com require authentication for agents",
        ],
      },
      {
        identifier: "urn:air:nublson.com:skills:index",
        displayName: "nublson.com Agent Skills",
        description:
          "Agent skills index for fetching blog posts, work case studies and profile info from nublson.com as clean markdown.",
        type: "application/agent-skills+json",
        url: `${base}/.well-known/agent-skills/index.json`,
        tags: ["agent-skills", "markdown", "content"],
        representativeQueries: [
          "install a skill for reading nublson.com content",
          "agent skills published by Nubelson Fernandes",
          "how do I fetch nublson.com posts as markdown",
        ],
      },
      {
        identifier: "urn:air:nublson.com:api:content",
        displayName: "nublson.com Content API",
        description:
          "OpenAPI 3.1 description of the public read-only endpoints for posts, feeds and site content.",
        type: "application/openapi+json",
        url: `${base}/openapi.json`,
        tags: ["openapi", "rest", "read-only"],
        representativeQueries: [
          "nublson.com REST API for blog posts",
          "OpenAPI schema for nublson.com",
          "fetch a nublson.com post by slug over HTTP",
        ],
      },
      {
        identifier: "urn:air:nublson.com:docs:llms",
        displayName: "nublson.com llms.txt",
        description:
          "Plain-text index of every published blog post and work case study with titles, URLs and descriptions.",
        type: "text/plain",
        url: `${base}/llms.txt`,
        tags: ["llms-txt", "index", "documentation"],
        representativeQueries: [
          "list everything published on nublson.com",
          "llms.txt for nublson.com",
        ],
      },
    ],
  };
}

export const aiCatalogHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "public, max-age=3600",
  "Access-Control-Allow-Origin": "*",
} as const;

/**
 * The manifest body is identical on both discovery paths: ARD requires an
 * `entries` array and ignores other top-level members, so `specVersion` and
 * `host` are carried through for consumers still on the predecessor spec.
 */
export function aiCatalogResponse(baseUrl: string): Response {
  return new Response(JSON.stringify(buildAiCatalog(baseUrl), null, 2), {
    headers: aiCatalogHeaders,
  });
}
