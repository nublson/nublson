"use client";

import { PostReactionsSkeleton } from "@/components/skeletons/post-reactions-skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PostReactionSummary, ReactionType } from "@/services/reactions";
import { formatCompactCount } from "@/utils/formatter";
import { Check, Share2, ThumbsDown, ThumbsUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { TooltipWrapper } from "./tooltip-wrapper";

const FP_CACHE_KEY = "fp_visitor_id";
const FP_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

type FpCache = { visitorId: string; cachedAt: number };

function readFpCache(): string | null {
  try {
    const raw = localStorage.getItem(FP_CACHE_KEY);
    if (!raw) return null;
    const { visitorId, cachedAt } = JSON.parse(raw) as FpCache;
    if (Date.now() - cachedAt > FP_CACHE_TTL_MS) return null;
    return visitorId;
  } catch {
    return null;
  }
}

function writeFpCache(visitorId: string) {
  try {
    localStorage.setItem(
      FP_CACHE_KEY,
      JSON.stringify({ visitorId, cachedAt: Date.now() } satisfies FpCache),
    );
  } catch {
    // localStorage may be unavailable (private mode, storage full)
  }
}

type PostReactionsProps = {
  postId: string;
  postSlug: string;
  initialData?: PostReactionSummary;
};

async function fetchSummary(
  postId: string,
  fingerprint: string | null,
): Promise<PostReactionSummary> {
  const url = new URL(
    `/api/reactions/${encodeURIComponent(postId)}`,
    window.location.origin,
  );
  if (fingerprint) url.searchParams.set("fp", fingerprint);

  const res = await fetch(url.toString());
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
  fingerprint: string | null,
): Promise<PostReactionSummary> {
  const res = await fetch(`/api/reactions/${encodeURIComponent(postId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reaction, postSlug, fingerprint }),
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
 */
async function shareUrl(
  url: string,
  options: { title?: string; onClipboardCopied?: () => void } = {},
): Promise<void> {
  const title = options.title ?? "Check out this post";
  const shareData: ShareData = { title, url };

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
  // Lazy initializer reads from localStorage synchronously on first render —
  // avoids an effect-triggered setState and gives an instant cache hit.
  const [fingerprint, setFingerprint] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return readFpCache();
  });
  const shareResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // If the cache missed, call the Fingerprint Pro API once and persist the result.
  useEffect(() => {
    if (fingerprint) return; // cache hit — nothing to do

    const apiKey = process.env.NEXT_PUBLIC_FINGERPRINT_API_KEY;
    if (!apiKey) return;

    let cancelled = false;

    import("@fingerprintjs/fingerprintjs-pro")
      .then((FingerprintJS) => FingerprintJS.load({ apiKey }))
      .then((fp) => fp.get())
      .then(({ visitorId }) => {
        if (cancelled) return;
        writeFpCache(visitorId);
        setFingerprint(visitorId);
      })
      .catch(() => {
        // Fingerprinting unavailable — fall back to session-cookie dedup
      });

    return () => {
      cancelled = true;
    };
  }, [fingerprint]);

  // Initial fetch when no SSR data was provided.
  useEffect(() => {
    if (initialData !== undefined) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchSummary(postId, null);
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

  // Once fingerprint is ready, re-fetch to correct userReaction.
  // SSR used the session cookie only, so a user who reacted from a different
  // browser would see the wrong state until this correction runs.
  useEffect(() => {
    if (!fingerprint || loading) return;
    let cancelled = false;
    fetchSummary(postId, fingerprint)
      .then((data) => {
        if (!cancelled) setSummary(data);
      })
      .catch(() => {
        // Keep existing summary on failure
      });
    return () => {
      cancelled = true;
    };
  }, [fingerprint, postId, loading]);

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
        const data = await postSummary(postId, postSlug, nextUser, fingerprint);
        setSummary(data);
      } catch {
        setSummary(previous);
      } finally {
        setPending(false);
      }
    },
    [summary, pending, postId, postSlug, fingerprint],
  );

  const handleShare = useCallback(async () => {
    await shareUrl(window.location.href, {
      title: document.title || "Check out this post",
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
