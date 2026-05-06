/**
 * Maps items with at most `limit` concurrent async operations.
 * Helps avoid Notion API rate spikes when many blocks have children.
 */
export async function mapPool<T, R>(
  items: readonly T[],
  limit: number,
  mapper: (item: T) => Promise<R>,
): Promise<R[]> {
  if (items.length === 0) return [];
  const results: R[] = new Array(items.length);
  let next = 0;

  async function worker(): Promise<void> {
    while (true) {
      const i = next++;
      if (i >= items.length) break;
      results[i] = await mapper(items[i]!);
    }
  }

  const workers = Math.min(Math.max(1, limit), items.length);
  await Promise.all(Array.from({ length: workers }, () => worker()));
  return results;
}
