"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { useEffect } from "react";

export function usePostReactionsRealtime(
  postId: string,
  onRefresh: () => void,
  shouldSkipRefresh: () => boolean,
): void {
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const channel = supabase
      .channel(`post-reactions:${postId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "post_reactions",
          filter: `post_id=eq.${postId}`,
        },
        () => {
          if (shouldSkipRefresh()) return;
          onRefresh();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [postId, onRefresh, shouldSkipRefresh]);
}
