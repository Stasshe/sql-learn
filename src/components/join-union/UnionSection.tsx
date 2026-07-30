"use client";

import { LayoutGroup } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import { buildUnionSql, customers2024, customers2025 } from "./data";
import { SegmentedControl } from "./SegmentedControl";
import { SqlSnippet } from "./SqlSnippet";
import { TableGrid } from "./TableGrid";
import { UnionResultTable } from "./UnionResultTable";
import type { UnionMode } from "./union-engine";
import { computeUnion } from "./union-engine";
import { useFlightVectors } from "./useFlightVectors";

const customerKey = (c: { id: number; name: string; city: string }) =>
  `${c.id}-${c.name}-${c.city}`;

const UNION_OPTIONS: { value: UnionMode; label: string }[] = [
  { value: "UNION ALL", label: "UNION ALL" },
  { value: "UNION", label: "UNION" },
];

export function UnionSection() {
  const [unionMode, setUnionMode] = useState<UnionMode>("UNION ALL");
  const [justMergedKey, setJustMergedKey] = useState<string | null>(null);
  const prevKeysRef = useRef<Set<string>>(new Set());
  const table2024Ref = useRef<HTMLDivElement>(null);
  const table2025Ref = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const flightVectors = useFlightVectors(table2024Ref, table2025Ref, resultRef);

  const unionResult = useMemo(
    () => computeUnion(customers2024, customers2025, unionMode, customerKey),
    [unionMode],
  );

  useEffect(() => {
    const nextKeys = new Set(unionResult.map((r) => r.key));
    const removed = [...prevKeysRef.current].filter((k) => !nextKeys.has(k));
    if (removed.length > 0) {
      const removedContentKey = removed[0]?.slice(2);
      const survivor = unionResult.find((r) => r.key === `a-${removedContentKey}`);
      if (survivor) {
        setJustMergedKey(survivor.key);
        const timer = setTimeout(() => setJustMergedKey(null), 900);
        prevKeysRef.current = nextKeys;
        return () => clearTimeout(timer);
      }
    }
    prevKeysRef.current = nextKeys;
    return undefined;
  }, [unionResult]);

  return (
    <LayoutGroup id="union-section">
      <section>
        <h2 className="text-2xl font-semibold mb-1">UNION</h2>
        <p className="text-sm text-muted-foreground mb-6">
          UNIONは重複行を除いて結合し、UNION ALLは重複行もそのまま残す。切り替えると行が各テーブルから結果へ飛び込む。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div ref={table2024Ref}>
            <TableGrid
              title="customers_2024"
              columns={[
                { header: "id", cell: (c: { id: number }) => c.id, mono: true },
                { header: "name", cell: (c: { name: string }) => c.name },
                { header: "city", cell: (c: { city: string }) => c.city },
              ]}
              rows={customers2024.map((c) => ({ key: `2024-${c.id}`, data: c }))}
            />
          </div>
          <div ref={table2025Ref}>
            <TableGrid
              title="customers_2025"
              columns={[
                { header: "id", cell: (c: { id: number }) => c.id, mono: true },
                { header: "name", cell: (c: { name: string }) => c.name },
                { header: "city", cell: (c: { city: string }) => c.city },
              ]}
              rows={customers2025.map((c) => ({ key: `2025-${c.id}`, data: c }))}
            />
          </div>
        </div>

        <div className="mb-6">
          <SegmentedControl<UnionMode>
            options={UNION_OPTIONS}
            value={unionMode}
            onChange={setUnionMode}
            layoutId="union-mode-pill"
          />
        </div>

        <SqlSnippet sql={buildUnionSql(unionMode)} />

        <div className="mt-8" ref={resultRef}>
          <UnionResultTable
            rows={unionResult}
            justMergedKey={justMergedKey}
            flightVectors={flightVectors}
          />
        </div>
      </section>
    </LayoutGroup>
  );
}
