const AGENTS_TXT_STANDARD = "https://agents-txt.com";
const AGENTS_JSON_SCHEMA =
  "https://agents-txt.com/schema/agents-json/v1.0.json";

export type AgentsDiscovery = {
  baseUrl: string;
  site: {
    name: string;
    description: string;
  };
  mcpCardUrl: string;
  skillsIndexUrl: string;
  agentCardUrl: string;
};

export function getAgentsDiscovery(baseUrl: string): AgentsDiscovery {
  const base = baseUrl.replace(/\/$/, "");

  return {
    baseUrl: base,
    site: {
      name: "Nubelson Fernandes",
      description: "Designer and developer sharing work, writing, and tools.",
    },
    mcpCardUrl: `${base}/.well-known/mcp.json`,
    skillsIndexUrl: `${base}/.well-known/agent-skills.json`,
    agentCardUrl: `${base}/.well-known/agent.json`,
  };
}

export function buildAgentsTxt(discovery: AgentsDiscovery): string {
  const lines = [
    "# agents.txt",
    `# Standard: ${AGENTS_TXT_STANDARD}`,
    `# JSON: ${discovery.baseUrl}/agents.json`,
    "",
    `MCP: ${discovery.mcpCardUrl}`,
    `Skills: ${discovery.skillsIndexUrl}`,
    `A2A: ${discovery.agentCardUrl}`,
  ];

  return `${lines.join("\n")}\n`;
}

export function buildAgentsJson(discovery: AgentsDiscovery) {
  return {
    $schema: AGENTS_JSON_SCHEMA,
    version: "1.0",
    standard: AGENTS_TXT_STANDARD,
    site: {
      name: discovery.site.name,
      url: discovery.baseUrl,
      description: discovery.site.description,
    },
    mcp: [
      {
        url: discovery.mcpCardUrl,
        description:
          "MCP server card for blog and work content resources served as markdown.",
      },
    ],
    skills: [
      {
        url: discovery.skillsIndexUrl,
        description:
          "Agent skills for fetching blog posts and work case studies as markdown.",
      },
    ],
    a2a: [
      {
        url: discovery.agentCardUrl,
        description:
          "Agent card for reading portfolio content; no authentication required.",
      },
    ],
  };
}

export const agentsDiscoveryHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, max-age=3600",
} as const;
