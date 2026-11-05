import { describe, expect, it, vi } from "vitest";

vi.mock("@/services/notion", () => ({ resolveNotionImageUpstream: vi.fn() }));

const { resolveOgImageData } = await import("./og-image");

const titleOf = async (title: string) =>
  (await resolveOgImageData({ title })).title;

describe("resolveOgImageData title", () => {
  it("curls every apostrophe between letters", async () => {
    expect(await titleOf("Rock'n'roll won't stop")).toBe(
      "Rock\u2019n\u2019roll won\u2019t stop",
    );
  });

  it("keeps titles that fit", async () => {
    expect(await titleOf("Built from Friction")).toBe("Built from Friction");
  });

  it("trims long titles at a whole word", async () => {
    expect(
      await titleOf(
        "AI agents won't replace you, but they will expose every shortcut you have been taking",
      ),
    ).toBe("AI agents won\u2019t replace you, but they will expose every\u2026");
  });
});
