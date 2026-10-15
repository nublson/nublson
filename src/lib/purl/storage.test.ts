import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearTokens,
  getTokens,
  setPending,
  setResult,
  setTokens,
  takePending,
  takeResult,
} from "./storage";

const tokens = { accessToken: "a", refreshToken: "r", expiresAt: 1234 };
const pending = {
  state: "s",
  verifier: "v",
  returnPath: "/blog/post",
  url: "https://example.com/blog/post",
};

describe("purl storage", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("round-trips and clears tokens", () => {
    expect(setTokens(tokens)).toBe(true);
    expect(getTokens()).toEqual(tokens);
    clearTokens();
    expect(getTokens()).toBeNull();
  });

  it("returns null for corrupt or wrongly shaped tokens", () => {
    localStorage.setItem("purl:tokens", "{not json");
    expect(getTokens()).toBeNull();
    localStorage.setItem("purl:tokens", JSON.stringify({ accessToken: 1 }));
    expect(getTokens()).toBeNull();
  });

  it("returns the pending record once, then null", () => {
    expect(setPending(pending)).toBe(true);
    expect(takePending()).toEqual(pending);
    expect(takePending()).toBeNull();
  });

  it("returns the result once, then null", () => {
    setResult({ status: "limit" });
    expect(takeResult()).toEqual({ status: "limit" });
    expect(takeResult()).toBeNull();
  });

  it("reports false instead of throwing when storage rejects writes", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("denied");
    });
    expect(setTokens(tokens)).toBe(false);
    expect(setPending(pending)).toBe(false);
    expect(() => setResult({ status: "saved" })).not.toThrow();
  });

  it("returns null instead of throwing when storage rejects reads", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("denied");
    });
    expect(getTokens()).toBeNull();
    expect(takePending()).toBeNull();
    expect(takeResult()).toBeNull();
  });
});
