import { describe, it, expect, vi } from "vitest";
import { mapPool } from "./map-pool";

describe("mapPool", () => {
  it("returns an empty array when items is empty", async () => {
    const result = await mapPool([], 3, async (x) => x);
    expect(result).toEqual([]);
  });

  it("maps all items to their results", async () => {
    const items = [1, 2, 3, 4, 5];
    const result = await mapPool(items, 2, async (x) => x * 2);
    expect(result).toEqual([2, 4, 6, 8, 10]);
  });

  it("preserves order of results regardless of completion order", async () => {
    const delays = [30, 10, 20];
    const result = await mapPool(delays, 3, (delay) =>
      new Promise<number>((resolve) => setTimeout(() => resolve(delay), delay))
    );
    expect(result).toEqual([30, 10, 20]);
  });

  it("respects the concurrency limit", async () => {
    let concurrent = 0;
    let maxConcurrent = 0;
    const limit = 2;

    await mapPool([1, 2, 3, 4], limit, async (x) => {
      concurrent++;
      maxConcurrent = Math.max(maxConcurrent, concurrent);
      await new Promise((r) => setTimeout(r, 10));
      concurrent--;
      return x;
    });

    expect(maxConcurrent).toBeLessThanOrEqual(limit);
  });

  it("works with a limit of 1 (sequential)", async () => {
    const order: number[] = [];
    await mapPool([1, 2, 3], 1, async (x) => {
      order.push(x);
      return x;
    });
    expect(order).toEqual([1, 2, 3]);
  });

  it("calls mapper exactly once per item", async () => {
    const mapper = vi.fn(async (x: number) => x);
    await mapPool([1, 2, 3], 5, mapper);
    expect(mapper).toHaveBeenCalledTimes(3);
  });
});
