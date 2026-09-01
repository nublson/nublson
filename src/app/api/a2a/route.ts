import {
  fetchAllPostItems,
  fetchGearGroupsCached,
  fetchPostMarkdownCached,
  fetchProfileCached,
} from "@/services/content-tools";
import { handleA2ARequest, type A2AContentDeps } from "@/utils/a2a";

const deps: A2AContentDeps = {
  listPosts: (type) => fetchAllPostItems(type),
  getPost: (type, slug) => fetchPostMarkdownCached(type, slug),
  listGears: () => fetchGearGroupsCached(),
  getProfile: () => fetchProfileCached(),
};

const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
} as const;

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error." } },
      { headers },
    );
  }

  return Response.json(await handleA2ARequest(body, deps), { headers });
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      ...headers,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
