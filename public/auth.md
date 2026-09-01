# auth.md

Authentication and registration policy for autonomous agents and MCP clients
accessing nublson.com.

This site is an **open, read-only content service**. Every agent-facing surface
is public. There is no authorization server, no token endpoint, and nothing to
register for. This document exists so an agent can determine that
programmatically instead of inferring it from a 404.

## Audience

Autonomous agents, MCP clients, and crawlers that want to read blog posts, work
case studies, gear recommendations, or profile information from this site.

## Registration

**No registration is required, and no registration endpoint exists.**

This is a deliberate position, not an omission. The service exposes read-only
public content that is already served to anonymous browsers, so gating it behind
agent identity would add a credential exchange without protecting anything.

Agents should proceed directly to the surfaces listed below.

## Authentication methods

| Method | Supported | Notes |
|---|---|---|
| Anonymous HTTP | Yes | The only supported method. Send no `Authorization` header. |
| OAuth 2.0 / OIDC | No | No authorization server is operated for this domain. |
| API keys | No | None are issued, and none are accepted. |
| mTLS | No | Not configured. |

## Credentials

This service issues no credentials and **does not accept any**. An
`Authorization` header, bearer token, or API key sent to any endpoint is ignored
rather than validated — presenting one grants no additional access, and its
absence denies none.

Because no endpoint is credential-protected, there is nothing to claim, rotate,
or revoke.

## Agent-facing surfaces

All are public and require no credentials:

| Surface | Path |
|---|---|
| MCP server (Streamable HTTP) | `/api/mcp` |
| MCP server card | `/.well-known/mcp/server-card.json` |
| ARD capability manifest | `/.well-known/ard.json` |
| Agent skills index | `/.well-known/agent-skills/index.json` |
| OpenAPI description | `/openapi.json` |
| Content index for LLMs | `/llms.txt` |
| Posts as markdown | `/api/markdown/{blog\|work}/{slug}` |

Content posts are also available by sending `Accept: text/markdown` to any post
URL.

## Acceptable use

Crawling and reading are welcome; see `/robots.txt` for the content signals that
apply. Please identify your agent with a descriptive `User-Agent`, and keep
request rates reasonable — this is a personal site on shared infrastructure.

## Contact

Reach the operator through the links published at
`https://nublson.com/about`.
