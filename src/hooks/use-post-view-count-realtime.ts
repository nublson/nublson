"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { useEffect } from "react";

type ViewCountRow = {
  views: number;
};

function isViewCountRow(value: unknown): value is ViewCountRow {
  return (
    typeof value === "object" &&
    value !== null &&
    "views" in value &&
    typeof value.views === "number"
  );
}

export function usePostViewCountRealtime(
  postId: string,
  trackViews: boolean,
  onViewsChange: (views: number) => void,
  onSubscribed?: () => void,
): void {
  useEffect(() => {
    if (!trackViews) return;

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const channel = supabase
      .channel(`post-view-count:${postId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "post_view_counts",
          filter: `post_id=eq.${postId}`,
        },
        (payload) => {
          if (isViewCountRow(payload.new)) {
            onViewsChange(payload.new.views);
          }
        },
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          onSubscribed?.();
        }
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [postId, trackViews, onViewsChange, onSubscribed]);
}
