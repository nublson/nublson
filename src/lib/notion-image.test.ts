import { describe, expect, it } from "vitest";
import {
  buildNotionImageProxyUrl,
  isNotionId,
  isNotionImageResource,
  parseNotionImageProxyUrl,
  toAbsoluteAssetUrl,
} from "./notion-image";

describe("isNotionId", () => {
  it("accepts dashed and undashed UUIDs", () => {
    expect(isNotionId("a1b2c3d4-e5f6-7890-abcd-ef1234567890")).toBe(true);
    expect(isNotionId("a1b2c3d4e5f67890abcdef1234567890")).toBe(true);
  });

  it("rejects invalid ids", () => {
    expect(isNotionId("page-1")).toBe(false);
    expect(isNotionId("")).toBe(false);
    expect(isNotionId("../etc/passwd")).toBe(false);
  });
});

describe("isNotionImageResource", () => {
  it("accepts cover and block only", () => {
    expect(isNotionImageResource("cover")).toBe(true);
    expect(isNotionImageResource("block")).toBe(true);
    expect(isNotionImageResource("file")).toBe(false);
  });
});

describe("buildNotionImageProxyUrl", () => {
  it("builds a stable query URL with optional cache buster", () => {
    expect(
      buildNotionImageProxyUrl({
        resource: "cover",
        id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      }),
    ).toBe(
      "/api/notion-image?resource=cover&id=a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    );

    expect(
      buildNotionImageProxyUrl({
        resource: "block",
        id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        v: "2024-09-19T12:00:00.000Z",
      }),
    ).toBe(
      "/api/notion-image?resource=block&id=a1b2c3d4-e5f6-7890-abcd-ef1234567890&v=2024-09-19T12%3A00%3A00.000Z",
    );
  });
});

describe("parseNotionImageProxyUrl", () => {
  it("parses relative and absolute proxy URLs", () => {
    const id = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
    expect(
      parseNotionImageProxyUrl(
        `/api/notion-image?resource=cover&id=${id}&v=1`,
      ),
    ).toEqual({ resource: "cover", id });
    expect(
      parseNotionImageProxyUrl(
        `https://nublson.com/api/notion-image?resource=block&id=${id}`,
      ),
    ).toEqual({ resource: "block", id });
  });

  it("returns null for non-proxy URLs", () => {
    expect(parseNotionImageProxyUrl("https://cdn.example.com/a.png")).toBeNull();
    expect(parseNotionImageProxyUrl("/logo.svg")).toBeNull();
  });
});

describe("toAbsoluteAssetUrl", () => {
  it("leaves absolute URLs unchanged", () => {
    expect(toAbsoluteAssetUrl("https://cdn.example.com/a.png")).toBe(
      "https://cdn.example.com/a.png",
    );
  });

  it("prefixes relative paths with BASE_URL when set", () => {
    const prev = process.env.BASE_URL;
    process.env.BASE_URL = "https://nublson.com/";
    expect(toAbsoluteAssetUrl("/api/notion-image?resource=cover&id=x")).toBe(
      "https://nublson.com/api/notion-image?resource=cover&id=x",
    );
    process.env.BASE_URL = prev;
  });

  it("returns undefined for empty input", () => {
    expect(toAbsoluteAssetUrl(undefined)).toBeUndefined();
  });
});
