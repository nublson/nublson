import { describe, expect, it } from "vitest";
import { createChallenge, createState, createVerifier } from "./pkce";

describe("pkce", () => {
  it("derives the RFC 7636 S256 challenge for a known verifier", async () => {
    await expect(
      createChallenge("dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"),
    ).resolves.toBe("E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM");
  });

  it("creates a verifier of unreserved characters between 43 and 128 long", () => {
    expect(createVerifier()).toMatch(/^[A-Za-z0-9\-._~]{43,128}$/);
  });

  it("creates distinct url-safe state values", () => {
    const a = createState();
    const b = createState();
    expect(a).not.toBe(b);
    expect(a).toMatch(/^[A-Za-z0-9_-]{16,}$/);
  });
});
