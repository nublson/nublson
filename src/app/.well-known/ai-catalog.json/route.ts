import { buildAiCatalog } from "@/utils/ai-catalog";

export const revalidate = 3600;

export async function GET() {
  return new Response(
    JSON.stringify(buildAiCatalog(process.env.BASE_URL!), null, 2),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
