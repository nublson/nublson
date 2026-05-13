import { supabase } from "@/lib/supabase";

export type ReactionType = "like" | "dislike";

export type ReactionCounts = {
  likes: number;
  dislikes: number;
};

export type PostReactionSummary = ReactionCounts & {
  userReaction: ReactionType | null;
};

/**
 * Returns the aggregate like/dislike counts for a post plus the current
 * visitor's reaction. When an ip_hash is provided it takes precedence over
 * session_id for identifying the visitor (cross-browser dedup).
 */
export async function getPostReactions(
  postId: string,
  sessionId: string,
  ipHash?: string | null,
): Promise<PostReactionSummary> {
  const { data, error } = await supabase
    .from("post_reactions")
    .select("reaction_type, session_id, ip_hash")
    .eq("post_id", postId);

  if (error) {
    throw new Error(`Failed to fetch reactions: ${error.message}`);
  }

  const rows = data ?? [];
  const likes = rows.filter((r) => r.reaction_type === "like").length;
  const dislikes = rows.filter((r) => r.reaction_type === "dislike").length;

  const userRow = ipHash
    ? (rows.find((r) => r.ip_hash === ipHash) ??
      rows.find((r) => r.session_id === sessionId))
    : rows.find((r) => r.session_id === sessionId);

  const userReaction = userRow
    ? (userRow.reaction_type as ReactionType)
    : null;

  return { likes, dislikes, userReaction };
}

/**
 * Creates or updates a visitor's reaction on a post.
 * When an ip_hash is provided it is used as the conflict key so that the
 * same device cannot hold multiple reactions across different browsers.
 */
export async function upsertReaction(
  postId: string,
  postSlug: string,
  sessionId: string,
  reactionType: ReactionType,
  ipHash?: string | null,
): Promise<PostReactionSummary> {
  const base = {
    post_id: postId,
    post_slug: postSlug,
    session_id: sessionId,
    reaction_type: reactionType,
  };
  const payload = ipHash ? { ...base, ip_hash: ipHash } : base;
  const conflictTarget = ipHash ? "post_id,ip_hash" : "post_id,session_id";

  const { error } = await supabase
    .from("post_reactions")
    .upsert(payload, { onConflict: conflictTarget });

  if (error) {
    throw new Error(`Failed to upsert reaction: ${error.message}`);
  }

  return getPostReactions(postId, sessionId, ipHash);
}

/**
 * Removes a visitor's reaction from a post.
 * When an ip_hash is provided it deletes by IP so the removal works
 * regardless of which browser the visitor is currently using.
 */
export async function deleteReaction(
  postId: string,
  sessionId: string,
  ipHash?: string | null,
): Promise<PostReactionSummary> {
  const query = supabase.from("post_reactions").delete().eq("post_id", postId);

  const { error } = ipHash
    ? await query.eq("ip_hash", ipHash)
    : await query.eq("session_id", sessionId);

  if (error) {
    throw new Error(`Failed to delete reaction: ${error.message}`);
  }

  return getPostReactions(postId, sessionId, ipHash);
}
