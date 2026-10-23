import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PostReactions } from "./post-reactions";
import { TooltipProvider } from "./ui/tooltip";

vi.mock("@/hooks/use-post-reactions-realtime", () => ({
  usePostReactionsRealtime: () => {},
}));
vi.mock("@/hooks/use-post-view-count-realtime", () => ({
  usePostViewCountRealtime: () => {},
}));

afterEach(() => {
  vi.unstubAllGlobals();
  sessionStorage.clear();
});

describe("PostReactions", () => {
  it("records the view only after the reactions request has set the session", async () => {
    const calls: string[] = [];
    let finishReactions!: () => void;
    const json = (body: unknown) =>
      new Response(JSON.stringify(body), {
        headers: { "Content-Type": "application/json" },
      });

    vi.stubGlobal(
      "fetch",
      vi.fn((url: string, init?: RequestInit) => {
        const call = `${init?.method ?? "GET"} ${url.split("/").slice(0, 3).join("/")}`;
        calls.push(call);
        if (call === "GET /api/reactions") {
          return new Promise<Response>((resolve) => {
            finishReactions = () =>
              resolve(json({ likes: 0, dislikes: 0, userReaction: null }));
          });
        }
        return Promise.resolve(json({ views: 1 }));
      }),
    );

    render(
      <TooltipProvider>
        <PostReactions postId="p1" postSlug="hello" trackViews />
      </TooltipProvider>,
    );

    await waitFor(() => expect(calls).toContain("GET /api/reactions"));
    expect(calls).not.toContain("POST /api/views");

    finishReactions();
    await waitFor(() => expect(calls).toContain("POST /api/views"));
    expect(calls.indexOf("POST /api/views")).toBeGreaterThan(
      calls.indexOf("GET /api/reactions"),
    );
  });
});
