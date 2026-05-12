import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

import {
  deleteReaction,
  getPostReactions,
  upsertReaction,
  type ReactionType,
} from "@/services/reactions";

const SESSION_COOKIE = "reaction_session_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

type RouteContext = { params: Promise<{ postId: string }> };

/**
 * Reads (or creates) the anonymous session cookie and returns its value.
 * The cookie is HttpOnly, SameSite=Lax, and Secure in production.
 */
async function resolveSession(): Promise<{
  sessionId: string;
  isNew: boolean;
}> {
  const jar = await cookies();
  const existing = jar.get(SESSION_COOKIE)?.value;
  if (existing) return { sessionId: existing, isNew: false };
  return { sessionId: randomUUID(), isNew: true };
}

function sessionCookieOptions(sessionId: string) {
  return {
    name: SESSION_COOKIE,
    value: sessionId,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  };
}

/**
 * GET /api/reactions/[postId]
 *
 * Returns aggregate counts and the caller's current reaction.
 *
 * Response: { likes: number, dislikes: number, userReaction: "like" | "dislike" | null }
 */
export async function GET(
  _request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  const { postId } = await context.params;
  const { sessionId, isNew } = await resolveSession();

  try {
    const summary = await getPostReactions(postId, sessionId);
    const response = NextResponse.json(summary);

    if (isNew) {
      response.cookies.set(sessionCookieOptions(sessionId));
    }

    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/reactions/[postId]
 *
 * Creates, updates, or removes the caller's reaction on a post.
 *
 * Body: { reaction: "like" | "dislike" | null, postSlug: string }
 *   reaction = null  → remove the existing reaction
 *   reaction = "like" | "dislike" → upsert the reaction
 *
 * Response: { likes: number, dislikes: number, userReaction: "like" | "dislike" | null }
 */
export async function POST(
  request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  const { postId } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Request body must be an object" }, { status: 400 });
  }

  const { reaction, postSlug } = body as Record<string, unknown>;

  if (typeof postSlug !== "string" || postSlug.trim() === "") {
    return NextResponse.json(
      { error: "postSlug is required and must be a non-empty string" },
      { status: 400 },
    );
  }

  if (reaction !== null && reaction !== "like" && reaction !== "dislike") {
    return NextResponse.json(
      { error: 'reaction must be "like", "dislike", or null' },
      { status: 400 },
    );
  }

  const { sessionId, isNew } = await resolveSession();

  try {
    const summary =
      reaction === null
        ? await deleteReaction(postId, sessionId)
        : await upsertReaction(postId, postSlug, sessionId, reaction as ReactionType);

    const response = NextResponse.json(summary);

    if (isNew) {
      response.cookies.set(sessionCookieOptions(sessionId));
    }

    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
