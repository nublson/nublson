"use client";

import { Persona, type PersonaState } from "@/components/ai-elements/persona";
import { PostReactionsSkeleton } from "@/components/skeletons/post-reactions-skeleton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePostReactionsRealtime } from "@/hooks/use-post-reactions-realtime";
import { usePostViewCountRealtime } from "@/hooks/use-post-view-count-realtime";
import { cn } from "@/lib/utils";
import type { PostReactionSummary, ReactionType } from "@/services/reactions";
import { formatCompactCount } from "@/utils/formatter";
import { Check, Eye, Share2, ThumbsDown, ThumbsUp } from "lucide-react";
import type { SyntheticEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { TooltipWrapper } from "./tooltip-wrapper";
import { Typography } from "./typography";
import { Separator } from "./ui/separator";

type PurlState = "idle" | "saving" | "saved" | "error";

function PurlLogo({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <g clipPath="url(#purl-clip)">
        <circle cx="16" cy="16" r="16" fill="url(#purl-grad)" />
      </g>
      <defs>
        <radialGradient
          id="purl-grad"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(6) scale(28.5 26.4348)"
        >
          <stop offset="0.457935" stopColor="white" />
          <stop offset="1" stopColor="#EAE0C8" />
        </radialGradient>
        <clipPath id="purl-clip">
          <rect width="32" height="32" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

type PostReactionsProps = {
  postId: string;
  postSlug: string;
  initialData?: PostReactionSummary;
  trackViews?: boolean;
  initialViews?: number;
  enableAudio?: boolean;
};

type AudioStatus = "idle" | "loading" | "playing" | "paused" | "error";

const AUDIO_STATUS_TO_PERSONA_STATE: Record<AudioStatus, PersonaState> = {
  idle: "idle",
  loading: "thinking",
  playing: "speaking",
  paused: "idle",
  error: "idle",
};

const AUDIO_STATUS_LABEL: Record<AudioStatus, string> = {
  idle: "Listen to this post",
  loading: "Generating narration…",
  playing: "Pause narration",
  paused: "Listen to this post",
  error: "Couldn't load the audio — tap to try again",
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

export function PostReactions({
  postId,
  postSlug,
  initialData,
  trackViews = false,
  initialViews = 0,
  enableAudio = false,
}: PostReactionsProps) {
  const [summary, setSummary] = useState<PostReactionSummary | null>(
    initialData ?? null,
  );
  const [loading, setLoading] = useState(!initialData);
  const [pending, setPending] = useState(false);
  const [views, setViews] = useState(initialViews);
  const [shareCopied, setShareCopied] = useState(false);
  const shareResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [purlState, setPurlState] = useState<PurlState>("idle");
  const [purlError, setPurlError] = useState<string | null>(null);
  const purlResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioStatus, setAudioStatus] = useState<AudioStatus>("idle");
  const [personaReady, setPersonaReady] = useState(false);
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
    if (!trackViews) return;

    const storageKey = viewRecordedStorageKey(postId);
    let cancelled = false;

    (async () => {
      try {
        if (!sessionStorage.getItem(storageKey)) {
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

  const handleSaveToPurl = useCallback(async () => {
    if (purlState === "saving") return;
    setPurlState("saving");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    let nextState: PurlState = "saved";
    let nextError: string | null = null;
    try {
      const res = await fetch("/api/purl/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: window.location.href }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.status === 402) {
        nextState = "error";
        nextError = "Purl link limit reached. Remove a saved link to add more.";
      } else if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        nextState = "error";
        nextError =
          body?.error ??
          "Couldn't save to Purl. Check your connection and try again.";
      }
    } catch (e) {
      clearTimeout(timeout);
      if (e instanceof Error && e.name === "AbortError") {
        nextState = "error";
        nextError = "Couldn't save to Purl. The request timed out — try again.";
      } else {
        nextState = "error";
        nextError =
          "Couldn't save to Purl. Check your connection and try again.";
      }
    }
    setPurlState(nextState);
    setPurlError(nextError);
    if (purlResetRef.current) clearTimeout(purlResetRef.current);
    purlResetRef.current = setTimeout(
      () => {
        setPurlState("idle");
        setPurlError(null);
        purlResetRef.current = null;
      },
      nextState === "saved" ? 3000 : 4000,
    );
  }, [purlState]);

  // A failed play() fires "error" immediately followed by "pause" — without
  // this guard, "pause" would overwrite the error status right after it's set.
  const handleAudioPause = useCallback(
    (event: SyntheticEvent<HTMLAudioElement>) => {
      if (event.currentTarget.error) return;
      setAudioStatus("paused");
    },
    [],
  );

  const handleToggleAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || audioStatus === "loading") return;
    if (audio.paused) {
      void audio.play().catch(() => setAudioStatus("error"));
    } else {
      audio.pause();
    }
  }, [audioStatus]);

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
      <PostReactionsSkeleton
        aria-busy="true"
        trackViews={trackViews}
        enableAudio={enableAudio}
      >
        <span className="sr-only">Loading reactions</span>
      </PostReactionsSkeleton>
    );
  }

  const { likes, dislikes, userReaction } = summary;

  return (
    <div className="sticky bottom-10 z-41 mx-auto flex w-fit flex-col items-center gap-2">
      <div className="rounded-full border border-border bg-background">
        <div className="flex items-center justify-center gap-2 px-2.5 py-2">
          {trackViews ? (
            <>
              <TooltipWrapper content="Views">
                <div className="flex h-7 items-center gap-1 rounded-full border border-border px-2.5">
                  <Eye className="size-4 shrink-0" aria-hidden />
                  <Typography
                    component="span"
                    size="xs"
                    className="text-foreground"
                  >
                    {formatCompactCount(views)}
                  </Typography>
                  <span className="sr-only">{views} views</span>
                </div>
              </TooltipWrapper>
              <Separator orientation="vertical" />
            </>
          ) : null}
          <TooltipWrapper content="Like">
            <Button
              type="button"
              variant={userReaction === "like" ? "default" : "outline"}
              size={likes ? "sm" : "icon-sm"}
              disabled={pending}
              aria-pressed={userReaction === "like"}
              aria-label="Like"
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
              aria-label="Dislike"
              className={cn("rounded-full")}
              onClick={() => void applyReaction("dislike")}
            >
              <ThumbsDown className="size-4 shrink-0" />
              {dislikes ? ` ${formatCompactCount(dislikes)}` : ""}
            </Button>
          </TooltipWrapper>
          <Separator orientation="vertical" />
          {enableAudio ? (
            <>
              <TooltipWrapper content={AUDIO_STATUS_LABEL[audioStatus]}>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleToggleAudio}
                  disabled={audioStatus === "loading"}
                  aria-pressed={audioStatus === "playing"}
                  aria-label={AUDIO_STATUS_LABEL[audioStatus]}
                  className={cn(
                    "rounded-full p-0",
                    audioStatus === "error" ? "ring-2 ring-destructive" : "",
                  )}
                >
                  <span className="relative inline-flex size-6">
                    <Persona
                      state={AUDIO_STATUS_TO_PERSONA_STATE[audioStatus]}
                      variant="obsidian"
                      className={cn(
                        "size-6",
                        personaReady ? "opacity-100" : "opacity-0",
                      )}
                      onReady={() => setPersonaReady(true)}
                    />
                    {!personaReady ? (
                      <Skeleton className="absolute inset-0 size-6 rounded-full" />
                    ) : null}
                  </span>
                </Button>
              </TooltipWrapper>
              <audio
                ref={audioRef}
                src={`/api/audio/${postSlug}`}
                preload="none"
                className="sr-only"
                onPlay={() => setAudioStatus("loading")}
                onPlaying={() => setAudioStatus("playing")}
                onPause={handleAudioPause}
                onEnded={() => setAudioStatus("idle")}
                onError={() => setAudioStatus("error")}
              />
              <Separator orientation="vertical" />
            </>
          ) : null}
          <TooltipWrapper
            content={
              purlState === "saved"
                ? "Saved!"
                : purlState === "error"
                  ? (purlError ?? "Error")
                  : "Save with Purl"
            }
          >
            <Button
              type="button"
              variant={purlState === "saved" ? "default" : "outline"}
              size="icon-sm"
              className={cn(
                "rounded-full",
                purlError ? "border-destructive!" : "",
              )}
              disabled={purlState === "saving"}
              aria-label={
                purlState === "saved"
                  ? "Saved on Purl"
                  : purlState === "error"
                    ? (purlError ?? "Error saving with Purl")
                    : "Save on Purl"
              }
              onClick={() => void handleSaveToPurl()}
            >
              {purlState === "saved" ? (
                <Check className="size-4" />
              ) : (
                <PurlLogo className="size-4 shrink-0" />
              )}
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
      <div
        role="status"
        aria-live="polite"
        className="min-h-5 px-2 text-center sr-only"
      >
        {purlError ? (
          <Typography size="xs" className="text-destructive">
            {purlError}
          </Typography>
        ) : null}
        {enableAudio && audioStatus === "error" ? (
          <Typography size="xs" className="text-destructive">
            {AUDIO_STATUS_LABEL.error}
          </Typography>
        ) : null}
      </div>
    </div>
  );
}
