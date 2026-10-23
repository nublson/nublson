"use client";

import { PurlLogo } from "@/components/purl-logo";
import { PostReactionsSkeleton } from "@/components/skeletons/post-reactions-skeleton";
import { Button } from "@/components/ui/button";
import { usePostReactionsRealtime } from "@/hooks/use-post-reactions-realtime";
import { usePostViewCountRealtime } from "@/hooks/use-post-view-count-realtime";
import {
  PURL_LIMIT_MESSAGE,
  saveToPurl,
  type PurlSaveOutcome,
} from "@/lib/purl/client";
import { takeResult, type PurlResult } from "@/lib/purl/storage";
import { cn } from "@/lib/utils";
import type { PostReactionSummary, ReactionType } from "@/services/reactions";
import { formatCompactCount, formatViewCount } from "@/utils/formatter";
import { Check, Share2, ThumbsDown, ThumbsUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { TooltipWrapper } from "./tooltip-wrapper";
import { Typography } from "./typography";

type PurlState = "idle" | "saving" | "saved" | "error";

const PURL_FALLBACK_ERROR = "Couldn't save to Purl";

type PostReactionsProps = {
  postId: string;
  postSlug: string;
  initialData?: PostReactionSummary;
  trackViews?: boolean;
  initialViews?: number;
};

function viewRecordedStorageKey(postId: string): string {
  return `view-recorded:${postId}`;
}

async function fetchViewCount(postId: string): Promise<number> {
  const res = await fetch(`/api/views/${encodeURIComponent(postId)}`);
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(body?.error ?? `Failed to load views (${res.status})`);
  }
  const data = (await res.json()) as { views: number };
  return data.views;
}

async function recordView(postId: string, postSlug: string): Promise<number> {
  const res = await fetch(`/api/views/${encodeURIComponent(postId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postSlug }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(body?.error ?? `Failed to record view (${res.status})`);
  }
  const data = (await res.json()) as { views: number };
  return data.views;
}

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

/** Quiet outline pill for the end-of-article reactions row. */
const REACTION_PILL =
  "h-7 gap-1.5 rounded-full px-2.5 text-subtle-foreground tabular-nums shadow-[inset_0_0_0_1px_var(--input)] transition-[background-color,color,scale] duration-150 ease-(--ease-out) hover:bg-muted hover:text-foreground active:scale-[0.96] data-[size=icon-sm]:px-0";
const REACTION_PILL_ON = "bg-muted text-foreground";

const ICON_SWAP_LAYER =
  "absolute inset-0 transition-[opacity,scale,filter] duration-200 ease-(--ease-out)";

/**
 * Cross-fades between two icons. Both stay mounted so a quick toggle back
 * retargets the transition instead of snapping.
 */
function IconSwap({
  active,
  from,
  to,
}: {
  active: boolean;
  from: React.ReactNode;
  to: React.ReactNode;
}) {
  return (
    <span className="relative inline-flex size-4 shrink-0" aria-hidden>
      <span
        className={cn(
          ICON_SWAP_LAYER,
          active ? "scale-80 opacity-0 blur-[2px]" : "scale-100 opacity-100",
        )}
      >
        {from}
      </span>
      <span
        className={cn(
          ICON_SWAP_LAYER,
          active ? "scale-100 opacity-100" : "scale-80 opacity-0 blur-[2px]",
        )}
      >
        {to}
      </span>
    </span>
  );
}

export function PostReactions({
  postId,
  postSlug,
  initialData,
  trackViews = false,
  initialViews = 0,
}: PostReactionsProps) {
  const [summary, setSummary] = useState<PostReactionSummary | null>(
    initialData ?? null,
  );
  const [loading, setLoading] = useState(!initialData);
  const [pending, setPending] = useState(false);
  // Reaction whose icon should pop; set only from a click, never on load.
  const [poppedReaction, setPoppedReaction] = useState<ReactionType | null>(
    null,
  );
  const [views, setViews] = useState(initialViews);
  // On a first visit the reactions GET mints the session cookie; the view POST
  // waits for it, so both requests use one session and a returning reader's
  // view isn't recorded under an ID the cookie no longer holds.
  const sessionReadyRef = useRef<Promise<unknown>>(Promise.resolve());
  const [shareCopied, setShareCopied] = useState(false);
  const shareResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [purlState, setPurlState] = useState<PurlState>("idle");
  const [purlError, setPurlError] = useState<string | null>(null);
  const purlResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncViewCount = useCallback(async () => {
    try {
      const count = await fetchViewCount(postId);
      setViews(count);
    } catch {
      // Keep the last known count if refresh fails.
    }
  }, [postId]);

  const refreshSummary = useCallback(async () => {
    try {
      const data = await fetchSummary(postId);
      setSummary(data);
    } catch {
      // Keep the last known counts if refresh fails.
    }
  }, [postId]);

  const shouldSkipReactionsRefresh = useCallback(() => pending, [pending]);

  const handleReactionsRefresh = useCallback(() => {
    void refreshSummary();
  }, [refreshSummary]);

  usePostReactionsRealtime(
    postId,
    handleReactionsRefresh,
    shouldSkipReactionsRefresh,
  );

  const handleViewCountSubscribed = useCallback(() => {
    void syncViewCount();
  }, [syncViewCount]);

  usePostViewCountRealtime(
    postId,
    trackViews,
    setViews,
    handleViewCountSubscribed,
  );

  useEffect(() => {
    if (initialData !== undefined) return;
    let cancelled = false;
    const request = fetchSummary(postId);
    sessionReadyRef.current = request.catch(() => undefined);
    (async () => {
      try {
        const data = await request;
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
    if (!trackViews) return;

    const storageKey = viewRecordedStorageKey(postId);
    let cancelled = false;

    (async () => {
      try {
        if (!sessionStorage.getItem(storageKey)) {
          await sessionReadyRef.current;
          const next = await recordView(postId, postSlug);
          sessionStorage.setItem(storageKey, "1");
          if (!cancelled) setViews(next);
        }
      } catch {
        // Another tab may have recorded already; fall through to sync.
      } finally {
        // Always reconcile with the server so the visiting user sees their
        // own increment even if Realtime subscribed late or Strict Mode
        // cancelled the POST response handler.
        if (!cancelled) await syncViewCount();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [trackViews, postId, postSlug, syncViewCount]);

  useEffect(() => {
    return () => {
      if (shareResetRef.current) clearTimeout(shareResetRef.current);
      if (purlResetRef.current) clearTimeout(purlResetRef.current);
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
      setPoppedReaction(nextUser);
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

  const showPurlOutcome = useCallback((outcome: PurlSaveOutcome | PurlResult) => {
    if (outcome.status === "redirecting") return;
    const failed = outcome.status === "limit" || outcome.status === "error";
    setPurlState(failed ? "error" : "saved");
    setPurlError(
      outcome.status === "limit"
        ? PURL_LIMIT_MESSAGE
        : outcome.status === "error"
          ? outcome.message
          : null,
    );
    if (purlResetRef.current) clearTimeout(purlResetRef.current);
    purlResetRef.current = setTimeout(
      () => {
        setPurlState("idle");
        setPurlError(null);
        purlResetRef.current = null;
      },
      failed ? 4000 : 3000,
    );
  }, []);

  const handleSaveToPurl = useCallback(async () => {
    if (purlState === "saving") return;
    setPurlState("saving");
    showPurlOutcome(await saveToPurl(window.location.href));
  }, [purlState, showPurlOutcome]);

  // Returning from Purl's connect flow: show how the pending save went. A page
  // restored from the back/forward cache must not stay stuck on "saving".
  useEffect(() => {
    const result = takeResult();
    // Deferred: the result is read once (synchronously) but applied outside
    // the effect body, which the react-hooks lint rule forbids for setState.
    if (result) queueMicrotask(() => showPurlOutcome(result));
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setPurlState("idle");
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [showPurlOutcome]);

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
    return (
      <PostReactionsSkeleton aria-busy="true" trackViews={trackViews}>
        <span className="sr-only">Loading reactions</span>
      </PostReactionsSkeleton>
    );
  }

  const { likes, dislikes, userReaction } = summary;

  return (
    <div data-stream className="flex w-full flex-col gap-2">
      <div className="flex w-full flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        {trackViews ? (
          <Typography component="span" className="text-subtle-foreground tabular-nums">
            <span aria-hidden>{formatViewCount(views)}</span>
            <span className="sr-only">
              {views.toLocaleString("en-US")} {views === 1 ? "view" : "views"}
            </span>
          </Typography>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-1.5">
          <TooltipWrapper content="Like">
            <Button
              type="button"
              variant="ghost"
              size={likes ? "sm" : "icon-sm"}
              disabled={pending}
              aria-pressed={userReaction === "like"}
              aria-label="Like"
              className={cn(REACTION_PILL, userReaction === "like" && REACTION_PILL_ON)}
              onClick={() => void applyReaction("like")}
            >
              <ThumbsUp
                strokeWidth={1.5}
                className={cn(
                  "size-4 shrink-0",
                  poppedReaction === "like" && "animate-reaction-pop",
                )}
                onAnimationEnd={() => setPoppedReaction(null)}
              />
              {likes ? formatCompactCount(likes) : ""}
            </Button>
          </TooltipWrapper>
          <TooltipWrapper content="Dislike">
            <Button
              type="button"
              variant="ghost"
              size={dislikes ? "sm" : "icon-sm"}
              disabled={pending}
              aria-pressed={userReaction === "dislike"}
              aria-label="Dislike"
              className={cn(REACTION_PILL, userReaction === "dislike" && REACTION_PILL_ON)}
              onClick={() => void applyReaction("dislike")}
            >
              <ThumbsDown
                strokeWidth={1.5}
                className={cn(
                  "size-4 shrink-0",
                  poppedReaction === "dislike" && "animate-reaction-pop",
                )}
                onAnimationEnd={() => setPoppedReaction(null)}
              />
              {dislikes ? formatCompactCount(dislikes) : ""}
            </Button>
          </TooltipWrapper>
          <TooltipWrapper
            content={
              purlState === "saved"
                ? "Saved to Purl"
                : purlState === "error"
                  ? (purlError ?? PURL_FALLBACK_ERROR)
                  : "Save to Purl"
            }
          >
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className={cn(
                REACTION_PILL,
                purlState === "saved" && REACTION_PILL_ON,
                purlError && "shadow-[inset_0_0_0_1px_var(--destructive)]",
              )}
              disabled={purlState === "saving"}
              aria-label={
                purlState === "saved"
                  ? "Saved to Purl"
                  : purlState === "error"
                    ? (purlError ?? PURL_FALLBACK_ERROR)
                    : "Save to Purl"
              }
              onClick={() => void handleSaveToPurl()}
            >
              <IconSwap
                active={purlState === "saved"}
                from={<PurlLogo className="size-4 shrink-0" />}
                to={<Check strokeWidth={1.5} className="size-4" />}
              />
            </Button>
          </TooltipWrapper>
          <TooltipWrapper content={shareCopied ? "Link copied" : "Share"}>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className={REACTION_PILL}
              onClick={() => void handleShare()}
              aria-label={shareCopied ? "Link copied" : "Share link"}
            >
              <IconSwap
                active={shareCopied}
                from={<Share2 strokeWidth={1.5} className="size-4" />}
                to={<Check strokeWidth={1.5} className="size-4" />}
              />
            </Button>
          </TooltipWrapper>
        </div>
      </div>
      <div role="status" aria-live="polite" className="sr-only">
        {purlError ?? ""}
      </div>
    </div>
  );
}
