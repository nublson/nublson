"use client";

import { PostReactionsSkeleton } from "@/components/skeletons/post-reactions-skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PostReactionSummary, ReactionType } from "@/services/reactions";
import { formatCompactCount } from "@/utils/formatter";
import { Check, Share2, ThumbsDown, ThumbsUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { TooltipWrapper } from "./tooltip-wrapper";

type PostReactionsProps = {
  postId: string;
  postSlug: string;
  initialData?: PostReactionSummary;
};

async function fetchSummary(postId: string): Promise<PostReactionSummary> {
  const res = await fetch(`/api/reactions/${encodeURIComponent(postId)}`);
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(body?.error ?? `Failed to load reactions (${res.status})`);
  }
  return res.json() as Promise<PostReactionSummary>;
}

async function postSummary(
  postId: string,
  postSlug: string,
  reaction: ReactionType | null,
): Promise<PostReactionSummary> {
  const res = await fetch(`/api/reactions/${encodeURIComponent(postId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reaction, postSlug }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(body?.error ?? `Failed to save reaction (${res.status})`);
  }
  return res.json() as Promise<PostReactionSummary>;
}

/**
 * Uses the Web Share API when available; otherwise copies the URL to the clipboard.
 * User canceling the share sheet (AbortError) is ignored.
 * When imageUrl is provided, fetches it and passes as a File so iOS shows a thumbnail.
 */
async function shareUrl(
  url: string,
  options: {
    title?: string;
    imageUrl?: string;
    onClipboardCopied?: () => void;
  } = {},
): Promise<void> {
  const title = options.title ?? "Check out this post";
  let shareData: ShareData = { title, url };

  if (
    options.imageUrl &&
    typeof navigator !== "undefined" &&
    typeof navigator.canShare === "function"
  ) {
    try {
      const res = await fetch(options.imageUrl);
      if (res.ok) {
        const blob = await res.blob();
        if (blob.type.startsWith("image/")) {
          const ext = blob.type.split("/")[1]?.split("+")[0] ?? "jpg";
          const file = new File([blob], `thumbnail.${ext}`, { type: blob.type });
          const withFile: ShareData = { title, url, files: [file] };
          if (navigator.canShare(withFile)) shareData = withFile;
        }
      }
    } catch {
      // Image fetch failed — share without it
    }
  }

  const canWebShare =
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function" &&
    (typeof navigator.canShare !== "function" || navigator.canShare(shareData));

  if (canWebShare) {
    try {
      await navigator.share(shareData);
      return;
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    options.onClipboardCopied?.();
  } catch {
    // Clipboard may be denied; ignore
  }
}

export function PostReactions({
  postId,
  postSlug,
  initialData,
}: PostReactionsProps) {
  const [summary, setSummary] = useState<PostReactionSummary | null>(
    initialData ?? null,
  );
  const [loading, setLoading] = useState(!initialData);
  const [pending, setPending] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const shareResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (initialData !== undefined) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchSummary(postId);
        if (!cancelled) setSummary(data);
      } catch {
        if (!cancelled)
          setSummary({ likes: 0, dislikes: 0, userReaction: null });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [postId, initialData]);

  useEffect(() => {
    return () => {
      if (shareResetRef.current) clearTimeout(shareResetRef.current);
    };
  }, []);

  const applyReaction = useCallback(
    async (reaction: ReactionType) => {
      if (!summary || pending) return;
      const previous = summary;
      const u = previous.userReaction;
      const R = reaction;
      let nextUser: ReactionType | null;
      let nextLikes = previous.likes;
      let nextDislikes = previous.dislikes;

      if (u === R) {
        nextUser = null;
        if (R === "like") nextLikes = Math.max(0, nextLikes - 1);
        else nextDislikes = Math.max(0, nextDislikes - 1);
      } else if (u === null) {
        nextUser = R;
        if (R === "like") nextLikes += 1;
        else nextDislikes += 1;
      } else if (u === "like" && R === "dislike") {
        nextUser = "dislike";
        nextLikes = Math.max(0, nextLikes - 1);
        nextDislikes += 1;
      } else {
        nextUser = "like";
        nextDislikes = Math.max(0, nextDislikes - 1);
        nextLikes += 1;
      }

      const optimistic: PostReactionSummary = {
        likes: nextLikes,
        dislikes: nextDislikes,
        userReaction: nextUser,
      };
      setSummary(optimistic);
      setPending(true);
      try {
        const data = await postSummary(postId, postSlug, nextUser);
        setSummary(data);
      } catch {
        setSummary(previous);
      } finally {
        setPending(false);
      }
    },
    [summary, pending, postId, postSlug],
  );

  const handleShare = useCallback(async () => {
    const ogMeta = document.querySelector<HTMLMetaElement>(
      'meta[property="og:image"]',
    );
    const imageUrl = ogMeta?.content ?? undefined;
    await shareUrl(window.location.href, {
      title: document.title || "Check out this post",
      imageUrl,
      onClipboardCopied: () => {
        setShareCopied(true);
        if (shareResetRef.current) clearTimeout(shareResetRef.current);
        shareResetRef.current = setTimeout(() => {
          setShareCopied(false);
          shareResetRef.current = null;
        }, 2000);
      },
    });
  }, []);

  if (loading || !summary) {
    return <PostReactionsSkeleton aria-busy aria-label="Loading reactions" />;
  }

  const { likes, dislikes, userReaction } = summary;

  return (
    <div className="sticky bottom-10 z-41 mx-auto w-fit rounded-full border border-border bg-background">
      <div className="flex items-center justify-center gap-2 px-2.5 py-2">
        <TooltipWrapper content="Like">
          <Button
            type="button"
            variant={userReaction === "like" ? "default" : "outline"}
            size={likes ? "sm" : "icon-sm"}
            disabled={pending}
            aria-pressed={userReaction === "like"}
            className={cn("rounded-full")}
            onClick={() => void applyReaction("like")}
          >
            <ThumbsUp className="size-4 shrink-0" />
            {likes ? ` ${formatCompactCount(likes)}` : ""}
          </Button>
        </TooltipWrapper>
        <TooltipWrapper content="Dislike">
          <Button
            type="button"
            variant={userReaction === "dislike" ? "default" : "outline"}
            size={dislikes ? "sm" : "icon-sm"}
            disabled={pending}
            aria-pressed={userReaction === "dislike"}
            className={cn("rounded-full")}
            onClick={() => void applyReaction("dislike")}
          >
            <ThumbsDown className="size-4 shrink-0" />
            {dislikes ? ` ${formatCompactCount(dislikes)}` : ""}
          </Button>
        </TooltipWrapper>
        <TooltipWrapper content={shareCopied ? "Copied!" : "Share"}>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="rounded-full"
            onClick={() => void handleShare()}
            aria-label={shareCopied ? "Link copied" : "Share link"}
          >
            {shareCopied ? (
              <Check className="size-4" />
            ) : (
              <Share2 className="size-4" />
            )}
          </Button>
        </TooltipWrapper>
      </div>
    </div>
  );
}
