import { describe, expect, it } from "vitest";
import { parseEmbedHosts } from "./embed-hosts";

describe("parseEmbedHosts", () => {
  it("is empty when unset", () => {
    expect(parseEmbedHosts(undefined, "https://nublson.com")).toEqual([]);
    expect(parseEmbedHosts("", "https://nublson.com")).toEqual([]);
  });

  it("splits on commas and spaces, lowercases and dedupes", () => {
    expect(
      parseEmbedHosts(" Figma.com, sanding.space  figma.com,,", undefined),
    ).toEqual(["figma.com", "sanding.space"]);
  });

  it("drops the site's own host and hosts it sits under", () => {
    expect(
      parseEmbedHosts(
        "nublson.com,www.nublson.com,sanding.space",
        "https://www.nublson.com",
      ),
    ).toEqual(["sanding.space"]);
  });

  it("keeps hosts that only share a suffix with the site", () => {
    expect(parseEmbedHosts("son.com", "https://nublson.com")).toEqual([
      "son.com",
    ]);
  });

  it("ignores an invalid site URL", () => {
    expect(parseEmbedHosts("figma.com", "not a url")).toEqual(["figma.com"]);
  });
});
