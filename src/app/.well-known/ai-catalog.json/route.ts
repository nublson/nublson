import { aiCatalogResponse } from "@/utils/ai-catalog";

export const revalidate = 3600;

// Predecessor ARD discovery path, kept for consumers that have not moved
// to /.well-known/ard.json. Both serve the same manifest.
export async function GET() {
  return aiCatalogResponse(process.env.BASE_URL!);
}
