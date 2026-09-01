import { aiCatalogResponse } from "@/utils/ai-catalog";

export const revalidate = 3600;

// Normative ARD discovery path (spec/ard.md 5.1). The predecessor
// /.well-known/ai-catalog.json serves the same manifest.
export async function GET() {
  return aiCatalogResponse(process.env.BASE_URL!);
}
