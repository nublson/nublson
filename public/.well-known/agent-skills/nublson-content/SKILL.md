---
name: nublson-content
description: Read blog posts, work case studies, gear recommendations and profile info from nublson.com as clean markdown or via its MCP server.
---

# Reading nublson.com content

nublson.com is the personal site of Nubelson Fernandes — a designer and
developer publishing blog posts, work case studies and tool recommendations.
Everything is public; no authentication is required anywhere.

## Fastest paths

1. **Markdown negotiation (best for reading pages).** Request any page with
   `Accept: text/markdown` and the server returns markdown instead of HTML:
   `/`, `/about`, `/blog`, `/work`, `/gears`, `/blog/{slug}`, `/work/{slug}`.
   Responses include an `x-markdown-tokens` size-estimate header.
2. **Content index.** `https://nublson.com/llms.txt` lists every published
   blog post and work case study with absolute URLs and descriptions. Start
   here to find slugs.
3. **MCP server (best for tools-capable agents).** Streamable HTTP endpoint
   at `https://nublson.com/api/mcp` with five read-only tools: `list_posts`,
   `get_post`, `list_gears`, `get_profile`, `search_posts`. Server card:
   `https://nublson.com/.well-known/mcp/server-card.json`.

## Direct API routes

- `GET /api/markdown/blog/{slug}` and `GET /api/markdown/work/{slug}` —
  a post as markdown with YAML frontmatter (title, description, published,
  author, category).
- `GET /api/markdown/pages/{home|about|blog|work|gears}` — static pages as
  markdown.
- RSS: `/feed.xml` (combined), `/blog/feed.xml`, `/work/feed.xml`.
- OpenAPI description: `https://nublson.com/openapi.json`; API catalog:
  `https://nublson.com/.well-known/api-catalog`.

## Conventions

- Slugs are lowercase-hyphenated post titles; get canonical ones from
  `llms.txt`, `list_posts`, or the sitemap rather than guessing.
- Content is served from a CMS with ~10-second revalidation; repeated reads
  within a few seconds may return cached data.
- Usage preferences are declared in `robots.txt` via Content-Signal:
  search, AI input and AI training are all permitted.
