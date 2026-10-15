import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PurlNotConnectedError, saveLink, saveToPurl } from "./client";
import { refreshTokens, startConnect } from "./oauth";
import { getTokens, setTokens } from "./storage";

vi.mock("./oauth", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./oauth")>()),
  startConnect: vi.fn(),
  refreshTokens: vi.fn(),
}));

const URL_TO_SAVE = "https://site.test/blog/post";
const future = () => Date.now() + 3600_000;

function response(status: number, body: object = {}) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.mocked(startConnect).mockReset();
  vi.mocked(refreshTokens).mockReset();
  vi.stubEnv("NEXT_PUBLIC_PURL_URL", "https://purl.test");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("saveLink", () => {
  it("posts the url with the bearer token", async () => {
    setTokens({ accessToken: "acc", expiresAt: future() });
    const fetchMock = vi.fn().mockResolvedValue(response(201));
    vi.stubGlobal("fetch", fetchMock);

    await expect(saveLink(URL_TO_SAVE)).resolves.toBe("saved");

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://purl.test/api/v1/links/save");
    expect(init.method).toBe("POST");
    expect(init.headers.Authorization).toBe("Bearer acc");
    expect(JSON.parse(init.body)).toEqual({ url: URL_TO_SAVE });
  });

  it("throws not-connected without tokens, without calling Purl", async () => {
    vi.stubGlobal("fetch", vi.fn());
    await expect(saveLink(URL_TO_SAVE)).rejects.toBeInstanceOf(
      PurlNotConnectedError,
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it("returns limit for a 403 with LIMIT_REACHED and keeps the tokens", async () => {
    setTokens({ accessToken: "acc", expiresAt: future() });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(response(403, { code: "LIMIT_REACHED" })),
    );
    await expect(saveLink(URL_TO_SAVE)).resolves.toBe("limit");
    expect(getTokens()).not.toBeNull();
  });

  it("treats any other 403 as a lost connection and clears tokens", async () => {
    setTokens({ accessToken: "acc", expiresAt: future() });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response(403, {})));
    await expect(saveLink(URL_TO_SAVE)).rejects.toBeInstanceOf(
      PurlNotConnectedError,
    );
    expect(getTokens()).toBeNull();
  });

  it("refreshes first when the access token is expired", async () => {
    setTokens({ accessToken: "old", refreshToken: "r", expiresAt: 1 });
    vi.mocked(refreshTokens).mockResolvedValue({
      accessToken: "fresh",
      refreshToken: "r",
      expiresAt: future(),
    });
    const fetchMock = vi.fn().mockResolvedValue(response(201));
    vi.stubGlobal("fetch", fetchMock);

    await expect(saveLink(URL_TO_SAVE)).resolves.toBe("saved");
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe(
      "Bearer fresh",
    );
  });

  it("clears tokens and skips the request when an expired token cannot be refreshed", async () => {
    setTokens({ accessToken: "old", refreshToken: "r", expiresAt: 1 });
    vi.mocked(refreshTokens).mockResolvedValue(null);
    vi.stubGlobal("fetch", vi.fn());

    await expect(saveLink(URL_TO_SAVE)).rejects.toBeInstanceOf(
      PurlNotConnectedError,
    );
    expect(fetch).not.toHaveBeenCalled();
    expect(getTokens()).toBeNull();
  });

  it("refreshes once and retries after a 401", async () => {
    setTokens({ accessToken: "acc", refreshToken: "r", expiresAt: future() });
    vi.mocked(refreshTokens).mockResolvedValue({
      accessToken: "fresh",
      expiresAt: future(),
    });
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(response(401))
      .mockResolvedValueOnce(response(201));
    vi.stubGlobal("fetch", fetchMock);

    await expect(saveLink(URL_TO_SAVE)).resolves.toBe("saved");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(refreshTokens).toHaveBeenCalledTimes(1);
  });

  it("gives up after a second 401", async () => {
    setTokens({ accessToken: "acc", refreshToken: "r", expiresAt: future() });
    vi.mocked(refreshTokens).mockResolvedValue({
      accessToken: "fresh",
      expiresAt: future(),
    });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response(401)));

    await expect(saveLink(URL_TO_SAVE)).rejects.toBeInstanceOf(
      PurlNotConnectedError,
    );
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(getTokens()).toBeNull();
  });
});

describe("saveToPurl", () => {
  it("reports saved", async () => {
    setTokens({ accessToken: "acc", expiresAt: future() });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response(201)));
    await expect(saveToPurl(URL_TO_SAVE)).resolves.toEqual({ status: "saved" });
  });

  it("reports the link limit", async () => {
    setTokens({ accessToken: "acc", expiresAt: future() });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(response(403, { code: "LIMIT_REACHED" })),
    );
    await expect(saveToPurl(URL_TO_SAVE)).resolves.toEqual({ status: "limit" });
  });

  it("starts the connect flow when not connected", async () => {
    vi.mocked(startConnect).mockResolvedValue(true);
    await expect(saveToPurl(URL_TO_SAVE)).resolves.toEqual({
      status: "redirecting",
    });
    expect(startConnect).toHaveBeenCalledWith(URL_TO_SAVE);
  });

  it("reports an error when the connect flow cannot start", async () => {
    vi.mocked(startConnect).mockResolvedValue(false);
    const outcome = await saveToPurl(URL_TO_SAVE);
    expect(outcome.status).toBe("error");
  });

  it("surfaces Purl's own error message", async () => {
    setTokens({ accessToken: "acc", expiresAt: future() });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(response(400, { error: "Invalid or missing URL" })),
    );
    await expect(saveToPurl(URL_TO_SAVE)).resolves.toEqual({
      status: "error",
      message: "Invalid or missing URL",
    });
  });

  it("reports the connection message when the request fails", async () => {
    setTokens({ accessToken: "acc", expiresAt: future() });
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
    await expect(saveToPurl(URL_TO_SAVE)).resolves.toEqual({
      status: "error",
      message: "Couldn't save to Purl. Check your connection and try again.",
    });
  });

  it("reports the timeout message after 15 seconds", async () => {
    vi.useFakeTimers();
    setTokens({ accessToken: "acc", expiresAt: Date.now() + 3600_000 });
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_url: string, init: RequestInit) =>
          new Promise((_resolve, reject) => {
            init.signal?.addEventListener("abort", () =>
              reject(new DOMException("aborted", "AbortError")),
            );
          }),
      ),
    );

    const pending = saveToPurl(URL_TO_SAVE);
    await vi.advanceTimersByTimeAsync(15_000);

    await expect(pending).resolves.toEqual({
      status: "error",
      message: "Couldn't save to Purl. The request timed out — try again.",
    });
  });

  it("reports an error instead of looping when storage is unavailable", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("denied");
    });
    vi.mocked(startConnect).mockResolvedValue(false);
    const outcome = await saveToPurl(URL_TO_SAVE);
    expect(outcome.status).toBe("error");
  });
});
