import { buildAgentCard } from "@/utils/a2a";

export const revalidate = 3600;

export async function GET() {
  return new Response(
    JSON.stringify(buildAgentCard(process.env.BASE_URL!), null, 2),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
