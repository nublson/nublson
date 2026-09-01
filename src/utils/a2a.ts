import {
  searchPosts,
  type GearGroup,
  type PostToolItem,
  type Profile,
} from "@/utils/mcp-content";

const A2A_PROTOCOL_VERSION = "1.0";
const AGENT_VERSION = "1.0.0";

/** JSON-RPC 2.0 reserved codes, plus A2A's TaskNotFound. */
const ERROR = {
  invalidRequest: -32600,
  methodNotFound: -32601,
  invalidParams: -32602,
  internal: -32603,
  taskNotFound: -32001,
} as const;

export type A2APart = { text: string } | { data: unknown };

export type A2AMessage = {
  messageId: string;
  role: "ROLE_USER" | "ROLE_AGENT";
  parts: A2APart[];
  contextId?: string;
};

export type A2ASkill = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  examples: string[];
};

export type A2AAgentCard = {
  name: string;
  description: string;
  supportedInterfaces: {
    url: string;
    protocolBinding: string;
    protocolVersion: string;
  }[];
  provider: { organization: string; url: string };
  version: string;
  documentationUrl: string;
  capabilities: { streaming: boolean; pushNotifications: boolean };
  defaultInputModes: string[];
  defaultOutputModes: string[];
  skills: A2ASkill[];
};

export type A2AContentDeps = {
  listPosts(type?: "blog" | "work"): Promise<PostToolItem[]>;
  getPost(type: "blog" | "work", slug: string): Promise<string | null>;
  listGears(): Promise<GearGroup[]>;
  getProfile(): Promise<Profile>;
};

export type A2AResponse = {
  jsonrpc: "2.0";
  id: unknown;
  result?: { message?: A2AMessage };
  error?: { code: number; message: string };
};

/**
 * Skills mirror the MCP tools one-for-one, so the two protocols expose the
 * same capabilities under the same names.
 */
const SKILLS: A2ASkill[] = [
  {
    id: "list_posts",
    name: "List posts",
    description:
      "List published blog posts and work case studies with slugs, URLs, dates and descriptions.",
    tags: ["content", "blog", "index"],
    examples: ["What has Nubelson published?", "List the work case studies"],
  },
  {
    id: "get_post",
    name: "Get post",
    description:
      "Fetch a single blog post or work case study as markdown, by type and slug.",
    tags: ["content", "markdown"],
    examples: ["Get the blog post with slug hello-world"],
  },
  {
    id: "search_posts",
    name: "Search posts",
    description:
      "Case-insensitive search across post titles, descriptions and categories.",
    tags: ["content", "search"],
    examples: ["Find posts about design systems"],
  },
  {
    id: "list_gears",
    name: "List gear",
    description:
      "List recommended tools and gear, grouped by category, with product links.",
    tags: ["gear", "tools"],
    examples: ["What keyboard does Nubelson use?"],
  },
  {
    id: "get_profile",
    name: "Get profile",
    description:
      "Get Nubelson Fernandes' profile: name, role, location, bio and social links.",
    tags: ["profile", "about"],
    examples: ["Who is Nubelson Fernandes?"],
  },
];

export function buildAgentCard(baseUrl: string): A2AAgentCard {
  const base = baseUrl.replace(/\/$/, "");

  return {
    name: "nublson.com Content Agent",
    description:
      "Answers questions about Nubelson Fernandes' blog posts, work case studies, gear recommendations and profile. Read-only and public.",
    supportedInterfaces: [
      {
        url: `${base}/api/a2a`,
        protocolBinding: "JSONRPC",
        protocolVersion: A2A_PROTOCOL_VERSION,
      },
    ],
    provider: { organization: "Nubelson Fernandes", url: base },
    version: AGENT_VERSION,
    documentationUrl: `${base}/llms.txt`,
    // The endpoint answers synchronously with a Message and creates no tasks,
    // so neither streaming nor push notifications are offered.
    capabilities: { streaming: false, pushNotifications: false },
    defaultInputModes: ["text/plain", "application/json"],
    defaultOutputModes: ["text/plain", "application/json"],
    skills: SKILLS,
  };
}

function fail(id: unknown, code: number, message: string): A2AResponse {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

function reply(id: unknown, parts: A2APart[]): A2AResponse {
  return {
    jsonrpc: "2.0",
    id,
    result: {
      message: {
        messageId: crypto.randomUUID(),
        role: "ROLE_AGENT",
        parts,
      },
    },
  };
}

function textOf(parts: unknown): string {
  if (!Array.isArray(parts)) return "";
  return parts
    .filter((p): p is { text: string } => typeof p?.text === "string")
    .map((p) => p.text)
    .join(" ")
    .trim();
}

function dataOf(parts: unknown): Record<string, unknown> | null {
  if (!Array.isArray(parts)) return null;
  const part = parts.find(
    (p) => p && typeof p === "object" && "data" in p && p.data,
  );
  return part ? (part.data as Record<string, unknown>) : null;
}

async function runSkill(
  skill: string,
  args: Record<string, unknown>,
  deps: A2AContentDeps,
): Promise<A2APart[] | { invalid: string }> {
  switch (skill) {
    case "list_posts": {
      const type = args.type === "blog" || args.type === "work" ? args.type : undefined;
      const posts = await deps.listPosts(type);
      return [
        { text: `${posts.length} post(s).` },
        { data: { skill, posts } },
      ];
    }
    case "get_post": {
      const { type, slug } = args;
      if ((type !== "blog" && type !== "work") || typeof slug !== "string") {
        return { invalid: "get_post requires type ('blog'|'work') and slug." };
      }
      const markdown = await deps.getPost(type, slug);
      if (markdown === null) {
        return [
          {
            text: `No ${type} post found for slug "${slug}". Use list_posts to see available slugs.`,
          },
        ];
      }
      return [{ text: markdown }];
    }
    case "search_posts": {
      const query = typeof args.query === "string" ? args.query : "";
      if (!query) return { invalid: "search_posts requires a query string." };
      const matches = searchPosts(await deps.listPosts(), query);
      return [
        { text: `${matches.length} post(s) matched "${query}".` },
        { data: { skill, query, matches } },
      ];
    }
    case "list_gears": {
      const gears = await deps.listGears();
      return [{ text: `${gears.length} gear categories.` }, { data: { skill, gears } }];
    }
    case "get_profile": {
      const profile = await deps.getProfile();
      return [{ text: profile.name }, { data: { skill, profile } }];
    }
    default:
      return {
        invalid: `Unknown skill "${skill}". Advertised skills: ${SKILLS.map((s) => s.id).join(", ")}.`,
      };
  }
}

export async function handleA2ARequest(
  body: {
    jsonrpc?: unknown;
    id?: unknown;
    method?: unknown;
    params?: unknown;
  },
  deps: A2AContentDeps,
): Promise<A2AResponse> {
  const id = body?.id ?? null;

  if (body?.jsonrpc !== "2.0") {
    return fail(id, ERROR.invalidRequest, 'Expected "jsonrpc": "2.0".');
  }

  switch (body.method) {
    case "SendMessage":
      break;
    case "GetTask":
    case "CancelTask":
    case "ListTasks":
      // This agent answers synchronously with a Message and never creates a
      // Task, so no task id can ever resolve.
      return fail(
        id,
        ERROR.taskNotFound,
        "This agent returns Messages synchronously and creates no tasks.",
      );
    default:
      return fail(
        id,
        ERROR.methodNotFound,
        `Unknown method "${String(body.method)}".`,
      );
  }

  const params = body.params as { message?: { parts?: unknown } } | undefined;
  const message = params?.message;

  if (!message || !Array.isArray(message.parts)) {
    return fail(
      id,
      ERROR.invalidParams,
      "SendMessage requires params.message with a parts array.",
    );
  }

  const data = dataOf(message.parts);
  const text = textOf(message.parts);

  try {
    // A data part names a skill explicitly; free text is treated as a search.
    const outcome =
      data && typeof data.skill === "string"
        ? await runSkill(data.skill, data, deps)
        : text
          ? await runSkill("search_posts", { query: text }, deps)
          : { invalid: "Provide a text part to search, or a data part naming a skill." };

    if ("invalid" in outcome) {
      return fail(id, ERROR.invalidParams, outcome.invalid);
    }

    return reply(id, outcome);
  } catch {
    return fail(id, ERROR.internal, "Failed to read site content.");
  }
}
