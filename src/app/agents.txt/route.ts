import {
  agentsDiscoveryHeaders,
  buildAgentsTxt,
  getAgentsDiscovery,
} from "@/utils/agents-discovery";

export const revalidate = 3600;

export async function GET() {
  const base = process.env.BASE_URL!;
  const body = buildAgentsTxt(getAgentsDiscovery(base));

  return new Response(body, {
    headers: {
      ...agentsDiscoveryHeaders,
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
