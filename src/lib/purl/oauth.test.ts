import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildAuthorizeUrl,
  completeConnect,
  PurlConnectError,
  PurlTransientError,
  refreshTokens,
  safeReturnPath,
  startConnect,
} from "./oauth";
import { getTokens, setPending, setTokens, takePending } from "./storage";

const assign = vi.fn();

function tokenResponse(body: object, ok = true) {
  return { ok, status: ok ? 200 : 400, json: async () => body };
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  assign.mockReset();
  vi.stubEnv("NEXT_PUBLIC_PURL_URL", "https://purl.test");
  vi.stubEnv("NEXT_PUBLIC_PURL_CLIENT_ID", "portfolio");
  vi.stubGlobal("location", {
    ...window.location,
    origin: window.location.origin,
    pathname: "/blog/post",
    search: "?x=1",
    assign,
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("buildAuthorizeUrl", () => {
  it("carries the PKCE and scope parameters", () => {
    const url = new URL(buildAuthorizeUrl({ state: "st", challenge: "ch" }));
    expect(url.origin + url.pathname).toBe(
      "https://purl.test/api/auth/mcp/authorize",
    );
    expect(url.searchParams.get("response_type")).toBe("code");
    expect(url.searchParams.get("client_id")).toBe("portfolio");
    expect(url.searchParams.get("redirect_uri")).toBe(
      `${window.location.origin}/purl/callback`,
    );
    expect(url.searchParams.get("scope")).toBe("links:save offline_access");
    expect(url.searchParams.get("state")).toBe("st");
    expect(url.searchParams.get("code_challenge")).toBe("ch");
    expect(url.searchParams.get("code_challenge_method")).toBe("S256");
  });
});

describe("safeReturnPath", () => {
  it("keeps same-site relative paths", () => {
    expect(safeReturnPath("/blog/a?x=1")).toBe("/blog/a?x=1");
  });

  it.each([
    "//evil.com",
    "https://evil.com/x",
    "/\\evil.com",
    "/\t/evil.com",
    "",
    undefined,
  ])(
    "falls back to / for %s",
    (value) => {
      expect(safeReturnPath(value)).toBe("/");
    },
  );
});

describe("startConnect", () => {
  it("stores the pending record and redirects to Purl", async () => {
    await expect(startConnect("https://site.test/blog/post")).resolves.toBe(true);
    expect(assign).toHaveBeenCalledTimes(1);
    expect(assign.mock.calls[0][0]).toContain(
      "https://purl.test/api/auth/mcp/authorize?",
    );
    const pending = takePending();
    expect(pending?.returnPath).toBe("/blog/post?x=1");
    expect(pending?.url).toBe("https://site.test/blog/post");
  });

  it("does not redirect without a client id", async () => {
    vi.stubEnv("NEXT_PUBLIC_PURL_CLIENT_ID", "");
    await expect(startConnect("https://site.test/p")).resolves.toBe(false);
    expect(assign).not.toHaveBeenCalled();
  });

  it("does not redirect when the pending record cannot be stored", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("denied");
    });
    await expect(startConnect("https://site.test/p")).resolves.toBe(false);
    expect(assign).not.toHaveBeenCalled();
  });
});

describe("completeConnect", () => {
  const pending = {
    state: "st",
    verifier: "ver",
    returnPath: "/blog/post",
    url: "https://site.test/blog/post",
  };

  it("exchanges the code and stores tokens", async () => {
    setPending(pending);
    const fetchMock = vi.fn().mockResolvedValue(
      tokenResponse({
        access_token: "acc",
        refresh_token: "ref",
        expires_in: 3600,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const before = Date.now();

    const result = await completeConnect(
      new URLSearchParams({ code: "c1", state: "st" }),
    );

    expect(result).toEqual({
      returnPath: "/blog/post",
      url: "https://site.test/blog/post",
    });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://purl.test/api/auth/mcp/token");
    expect(init.headers["Content-Type"]).toBe(
      "application/x-www-form-urlencoded",
    );
    const body = new URLSearchParams(init.body);
    expect(body.get("grant_type")).toBe("authorization_code");
    expect(body.get("code")).toBe("c1");
    expect(body.get("code_verifier")).toBe("ver");
    expect(body.get("client_id")).toBe("portfolio");
    expect(body.get("redirect_uri")).toBe(
      `${window.location.origin}/purl/callback`,
    );
    const tokens = getTokens();
    expect(tokens?.accessToken).toBe("acc");
    expect(tokens?.refreshToken).toBe("ref");
    expect(tokens!.expiresAt).toBeGreaterThanOrEqual(before + 3600_000 - 31_000);
  });

  it("rejects a state mismatch", async () => {
    setPending(pending);
    vi.stubGlobal("fetch", vi.fn());
    await expect(
      completeConnect(new URLSearchParams({ code: "c1", state: "other" })),
    ).rejects.toBeInstanceOf(PurlConnectError);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("reports denied consent and returns to the post", async () => {
    setPending(pending);
    await expect(
      completeConnect(
        new URLSearchParams({ error: "access_denied", state: "st" }),
      ),
    ).rejects.toMatchObject({
      message: "Purl access was not allowed.",
      returnPath: "/blog/post",
    });
  });

  it("fails safely when the pending record is already consumed", async () => {
    await expect(
      completeConnect(new URLSearchParams({ code: "c1", state: "st" })),
    ).rejects.toMatchObject({ returnPath: "/", quiet: true });
  });

  it("never returns an off-site path from a tampered pending record", async () => {
    setPending({ ...pending, returnPath: "//evil.com" });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        tokenResponse({ access_token: "acc", expires_in: 60 }),
      ),
    );
    const result = await completeConnect(
      new URLSearchParams({ code: "c1", state: "st" }),
    );
    expect(result.returnPath).toBe("/");
  });

  it("throws when the token endpoint rejects the code", async () => {
    setPending(pending);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(tokenResponse({ error: "invalid_grant" }, false)),
    );
    await expect(
      completeConnect(new URLSearchParams({ code: "bad", state: "st" })),
    ).rejects.toBeInstanceOf(PurlConnectError);
    expect(getTokens()).toBeNull();
  });
});

describe("refreshTokens", () => {
  it("stores the new tokens from the refresh grant", async () => {
    setTokens({ accessToken: "old", refreshToken: "ref", expiresAt: 1 });
    const fetchMock = vi.fn().mockResolvedValue(
      tokenResponse({
        access_token: "new",
        refresh_token: "ref2",
        expires_in: 3600,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const tokens = await refreshTokens();

    const body = new URLSearchParams(fetchMock.mock.calls[0][1].body);
    expect(body.get("grant_type")).toBe("refresh_token");
    expect(body.get("refresh_token")).toBe("ref");
    expect(body.get("client_id")).toBe("portfolio");
    expect(tokens?.accessToken).toBe("new");
    expect(getTokens()?.refreshToken).toBe("ref2");
  });

  it("returns null and leaves tokens untouched on failure", async () => {
    setTokens({ accessToken: "old", refreshToken: "ref", expiresAt: 1 });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(tokenResponse({ error: "invalid_grant" }, false)),
    );
    await expect(refreshTokens()).resolves.toBeNull();
    expect(getTokens()?.accessToken).toBe("old");
  });

  it("throws a transient error, keeping the tokens, when the network fails", async () => {
    setTokens({ accessToken: "old", refreshToken: "ref", expiresAt: 1 });
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
    await expect(refreshTokens()).rejects.toBeInstanceOf(PurlTransientError);
    expect(getTokens()?.refreshToken).toBe("ref");
  });

  it("throws a transient error on a server error", async () => {
    setTokens({ accessToken: "old", refreshToken: "ref", expiresAt: 1 });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 503, json: async () => ({}) }),
    );
    await expect(refreshTokens()).rejects.toBeInstanceOf(PurlTransientError);
  });

  it("forwards the abort signal to the token request", async () => {
    setTokens({ accessToken: "old", refreshToken: "ref", expiresAt: 1 });
    const fetchMock = vi
      .fn()
      .mockResolvedValue(tokenResponse({ access_token: "new", expires_in: 60 }));
    vi.stubGlobal("fetch", fetchMock);
    const controller = new AbortController();
    await refreshTokens(controller.signal);
    expect(fetchMock.mock.calls[0][1].signal).toBe(controller.signal);
  });

  it("returns null without a refresh token", async () => {
    setTokens({ accessToken: "old", expiresAt: 1 });
    vi.stubGlobal("fetch", vi.fn());
    await expect(refreshTokens()).resolves.toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });
});
