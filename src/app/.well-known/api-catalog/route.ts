import { buildApiCatalog } from "@/utils/api-catalog";

export const revalidate = 10;

export async function GET() {
  return new Response(
    JSON.stringify(buildApiCatalog(process.env.BASE_URL!), null, 2),
    {
      headers: {
        "Content-Type": "application/linkset+json",
        "Cache-Control": "s-maxage=10, stale-while-revalidate=59",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
