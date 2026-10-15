"use client";

import { Persona, type PersonaState } from "@/components/ai-elements/persona";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { SyntheticEvent } from "react";
import { useCallback, useRef, useState } from "react";

type AudioStatus = "idle" | "loading" | "playing" | "paused" | "error";

const AUDIO_STATUS_TO_PERSONA_STATE: Record<AudioStatus, PersonaState> = {
  idle: "idle",
  loading: "thinking",
  playing: "speaking",
  paused: "idle",
  error: "idle",
};

const AUDIO_STATUS_LABEL: Record<AudioStatus, string> = {
  idle: "Listen",
  loading: "Generating…",
  playing: "Pause",
  paused: "Resume",
  error: "Try again",
};

const AUDIO_STATUS_ACCESSIBLE_LABEL: Record<AudioStatus, string> = {
  idle: "Listen to this post",
  loading: "Generating narration",
  playing: "Pause narration",
  paused: "Resume narration",
  error: "Couldn't load the audio. Try again",
};

/** Narration control for the article meta line. */
export function ListenButton({ postSlug }: { postSlug: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [status, setStatus] = useState<AudioStatus>("idle");
  const [personaReady, setPersonaReady] = useState(false);

  // A failed play() fires "error" immediately followed by "pause" — without
  // this guard, "pause" would overwrite the error status right after it's set.
  const handlePause = useCallback((event: SyntheticEvent<HTMLAudioElement>) => {
    if (event.currentTarget.error) return;
    setStatus("paused");
  }, []);

  const handleToggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || status === "loading") return;
    if (audio.paused) {
      void audio.play().catch(() => setStatus("error"));
    } else {
      audio.pause();
    }
  }, [status]);

  return (
    <>
      <button
        type="button"
        onClick={handleToggle}
        disabled={status === "loading"}
        aria-pressed={status === "playing"}
        aria-label={AUDIO_STATUS_ACCESSIBLE_LABEL[status]}
        className={cn(
          "inline-flex cursor-pointer items-center gap-1.5 rounded-sm transition-colors duration-150 ease-(--ease-out) hover:text-foreground disabled:cursor-default",
          status === "playing" || status === "loading"
            ? "text-foreground"
            : "text-subtle-foreground",
          status === "error" && "text-destructive hover:text-destructive",
        )}
      >
        <span className="relative inline-flex size-4 shrink-0" aria-hidden>
          <Persona
            state={AUDIO_STATUS_TO_PERSONA_STATE[status]}
            variant="obsidian"
            className={cn(
              "size-4 transition-opacity duration-200 ease-(--ease-out)",
              personaReady ? "opacity-100" : "opacity-0",
            )}
            onReady={() => setPersonaReady(true)}
          />
          {/* Stays mounted so it can fade out under the persona. */}
          <Skeleton
            className={cn(
              "pointer-events-none absolute inset-0 size-4 rounded-full transition-opacity duration-200 ease-(--ease-out)",
              personaReady && "animate-none opacity-0",
            )}
          />
        </span>
        <span aria-hidden>{AUDIO_STATUS_LABEL[status]}</span>
      </button>
      <audio
        ref={audioRef}
        src={`/api/audio/${postSlug}`}
        preload="none"
        className="sr-only"
        onPlay={() => setStatus("loading")}
        onPlaying={() => setStatus("playing")}
        onPause={handlePause}
        onEnded={() => setStatus("idle")}
        onError={() => setStatus("error")}
      />
      <span role="status" aria-live="polite" className="sr-only">
        {status === "error" ? AUDIO_STATUS_ACCESSIBLE_LABEL.error : ""}
      </span>
    </>
  );
}
