import {
  agentsDiscoveryHeaders,
  buildAgentsJson,
  getAgentsDiscovery,
} from "@/utils/agents-discovery";

export const revalidate = 3600;

export async function GET() {
  const base = process.env.BASE_URL!;
  const body = JSON.stringify(buildAgentsJson(getAgentsDiscovery(base)), null, 2);

  return new Response(body, {
    headers: {
      ...agentsDiscoveryHeaders,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
