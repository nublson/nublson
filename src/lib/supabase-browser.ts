import type { Database } from "@/types/supabase";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient<Database> | null | undefined;

export function getSupabaseBrowserClient(): SupabaseClient<Database> | null {
  if (browserClient !== undefined) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    browserClient = null;
    return null;
  }

  browserClient = createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return browserClient;
}
