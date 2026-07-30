export type UnionMode = "UNION" | "UNION ALL";

export interface UnionRow<T> {
  key: string;
  row: T;
  source: "A" | "B";
  isDuplicate: boolean;
}

export function computeUnion<T>(
  tableA: readonly T[],
  tableB: readonly T[],
  mode: UnionMode,
  rowKey: (row: T) => string,
): UnionRow<T>[] {
  const keysInA = new Set(tableA.map(rowKey));
  const keysInB = new Set(tableB.map(rowKey));

  const taggedA: UnionRow<T>[] = tableA.map((row) => ({
    key: `a-${rowKey(row)}`,
    row,
    source: "A",
    isDuplicate: keysInB.has(rowKey(row)),
  }));

  const taggedB: UnionRow<T>[] = tableB.map((row) => ({
    key: `b-${rowKey(row)}`,
    row,
    source: "B",
    isDuplicate: keysInA.has(rowKey(row)),
  }));

  if (mode === "UNION ALL") {
    return [...taggedA, ...taggedB];
  }

  return [...taggedA, ...taggedB.filter((r) => !r.isDuplicate)];
}
