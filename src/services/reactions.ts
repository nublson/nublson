import { supabase } from "@/lib/supabase";

export type ReactionType = "like" | "dislike";

export type ReactionCounts = {
  likes: number;
  dislikes: number;
};

export type PostReactionSummary = ReactionCounts & {
  userReaction: ReactionType | null;
};

export async function getPostReactions(
  postId: string,
  sessionId: string,
): Promise<PostReactionSummary> {
  const { data, error } = await supabase
    .from("post_reactions")
    .select("reaction_type, session_id")
    .eq("post_id", postId);

  if (error) {
    throw new Error(`Failed to fetch reactions: ${error.message}`);
  }

  const rows = data ?? [];
  const likes = rows.filter((r) => r.reaction_type === "like").length;
  const dislikes = rows.filter((r) => r.reaction_type === "dislike").length;
  const userRow = rows.find((r) => r.session_id === sessionId);
  const userReaction = userRow ? (userRow.reaction_type as ReactionType) : null;

  return { likes, dislikes, userReaction };
}

export async function upsertReaction(
  postId: string,
  postSlug: string,
  sessionId: string,
  reactionType: ReactionType,
): Promise<PostReactionSummary> {
  const { error } = await supabase.from("post_reactions").upsert(
    {
      post_id: postId,
      post_slug: postSlug,
      session_id: sessionId,
      reaction_type: reactionType,
    },
    { onConflict: "post_id,session_id" },
  );

  if (error) {
    throw new Error(`Failed to upsert reaction: ${error.message}`);
  }

  return getPostReactions(postId, sessionId);
}

export async function deleteReaction(
  postId: string,
  sessionId: string,
): Promise<PostReactionSummary> {
  const { error } = await supabase
    .from("post_reactions")
    .delete()
    .eq("post_id", postId)
    .eq("session_id", sessionId);

  if (error) {
    throw new Error(`Failed to delete reaction: ${error.message}`);
  }

  return getPostReactions(postId, sessionId);
}
