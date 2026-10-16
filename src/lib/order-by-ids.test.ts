import { describe, expect, it } from "vitest";
import { orderByIds } from "./order-by-ids";

const rows = (...ids: string[]) => ids.map((id) => ({ id }));

describe("orderByIds", () => {
  it("follows the given order", () => {
    expect(orderByIds(rows("a", "b", "c"), ["c", "a", "b"])).toEqual(
      rows("c", "a", "b"),
    );
  });

  it("keeps items missing from the order last, in their original order", () => {
    expect(orderByIds(rows("x", "a", "y", "b"), ["b", "a"])).toEqual(
      rows("b", "a", "x", "y"),
    );
  });

  it("ignores ids that match no item", () => {
    expect(orderByIds(rows("a", "b"), ["gone", "b", "a"])).toEqual(
      rows("b", "a"),
    );
  });

  it("matches Notion ids with or without dashes, in any case", () => {
    const first = "1c2b3a4d-0000-4000-8000-000000000001";
    const second = "1c2b3a4d-0000-4000-8000-000000000002";
    expect(
      orderByIds(rows(first, second), [
        "1C2B3A4D000040008000000000000002",
        "1c2b3a4d000040008000000000000001",
      ]),
    ).toEqual(rows(second, first));
  });
});
