/** Notion ids with and without dashes, in either case, compare equal. */
function normalizeId(id: string): string {
  return id.replace(/-/g, "").toLowerCase();
}

/**
 * `items` in the order of `ids`. Items missing from `ids` keep their
 * relative order and come last, so a new row never disappears.
 */
export function orderByIds<T extends { id: string }>(
  items: readonly T[],
  ids: readonly string[],
): T[] {
  const rank = new Map(ids.map((id, index) => [normalizeId(id), index]));
  return items
    .map((item, index) => ({
      item,
      index,
      rank: rank.get(normalizeId(item.id)) ?? Number.POSITIVE_INFINITY,
    }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map(({ item }) => item);
}
