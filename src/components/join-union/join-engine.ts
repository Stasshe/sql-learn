export type JoinType = "INNER" | "LEFT" | "RIGHT" | "FULL";

export type MatchKind = "matched" | "left-only" | "right-only";

export interface JoinedRow<L, R> {
  key: string;
  left: L | null;
  right: R | null;
  matchKind: MatchKind;
}

export function computeJoin<L, R>(
  leftRows: readonly L[],
  rightRows: readonly R[],
  getLeftKey: (row: L) => string | number,
  getRightKey: (row: R) => string | number,
  type: JoinType,
): JoinedRow<L, R>[] {
  const rightByKey = new Map<string, { row: R; index: number }[]>();
  rightRows.forEach((r, index) => {
    const k = String(getRightKey(r));
    const bucket = rightByKey.get(k);
    if (bucket) {
      bucket.push({ row: r, index });
    } else {
      rightByKey.set(k, [{ row: r, index }]);
    }
  });

  const matchedRightIndices = new Set<number>();
  const matched: JoinedRow<L, R>[] = [];
  const unmatchedLeft: JoinedRow<L, R>[] = [];

  leftRows.forEach((l, leftIndex) => {
    const partners = rightByKey.get(String(getLeftKey(l)));
    if (partners && partners.length > 0) {
      for (const { row: r, index: rightIndex } of partners) {
        matchedRightIndices.add(rightIndex);
        matched.push({
          key: `L${leftIndex}-R${rightIndex}`,
          left: l,
          right: r,
          matchKind: "matched",
        });
      }
    } else {
      unmatchedLeft.push({
        key: `L${leftIndex}-Rnull`,
        left: l,
        right: null,
        matchKind: "left-only",
      });
    }
  });

  const unmatchedRight: JoinedRow<L, R>[] = rightRows
    .map((row, index) => ({ row, index }))
    .filter(({ index }) => !matchedRightIndices.has(index))
    .map(({ row, index }) => ({
      key: `Lnull-R${index}`,
      left: null,
      right: row,
      matchKind: "right-only" as const,
    }));

  switch (type) {
    case "INNER":
      return matched;
    case "LEFT":
      return [...matched, ...unmatchedLeft];
    case "RIGHT":
      return [...matched, ...unmatchedRight];
    case "FULL":
      return [...matched, ...unmatchedLeft, ...unmatchedRight];
  }
}
