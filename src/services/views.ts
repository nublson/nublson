import { supabase } from "@/lib/supabase";

export async function getViewCount(postId: string): Promise<number> {
  const { data, error } = await supabase
    .from("post_view_counts")
    .select("views")
    .eq("post_id", postId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch view count: ${error.message}`);
  }

  return data?.views ?? 0;
}

export async function recordUniqueView(
  postId: string,
  postSlug: string,
  sessionId: string,
): Promise<number> {
  const { data, error } = await supabase.rpc("record_unique_view", {
    p_post_id: postId,
    p_post_slug: postSlug,
    p_session_id: sessionId,
  });

  if (error) {
    throw new Error(`Failed to record view: ${error.message}`);
  }

  return data ?? 0;
}
