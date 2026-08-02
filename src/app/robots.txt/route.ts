import { buildRobotsTxt } from "@/utils/robots-txt";

export const revalidate = 10;

export async function GET() {
  return new Response(buildRobotsTxt(process.env.BASE_URL!), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "s-maxage=10, stale-while-revalidate=59",
    },
  });
}
