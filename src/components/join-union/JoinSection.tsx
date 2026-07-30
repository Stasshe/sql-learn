"use client";

import { LayoutGroup } from "framer-motion";
import { useCallback, useMemo, useRef, useState } from "react";

import { ConnectorLines } from "./ConnectorLines";
import { buildJoinSql, orders, users } from "./data";
import { JoinResultTable } from "./JoinResultTable";
import { JoinTypeSelector } from "./JoinTypeSelector";
import type { JoinType } from "./join-engine";
import { computeJoin } from "./join-engine";
import { SourceTables } from "./SourceTables";
import { SqlSnippet } from "./SqlSnippet";
import type { RowState } from "./TableGrid";
import { VennDiagram } from "./VennDiagram";

export function JoinSection() {
  const [joinType, setJoinType] = useState<JoinType>("INNER");
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef(new Map<string, HTMLTableRowElement>());

  const joinResult = useMemo(
    () =>
      computeJoin(
        users,
        orders,
        (u) => u.id,
        (o) => o.user_id,
        joinType,
      ),
    [joinType],
  );

  const registerRowRef = useCallback((key: string, el: HTMLTableRowElement | null) => {
    if (el) {
      rowRefs.current.set(key, el);
    } else {
      rowRefs.current.delete(key);
    }
  }, []);

  const userState = useCallback(
    (id: number): RowState => {
      const matched = joinResult.some((r) => r.matchKind === "matched" && r.left?.id === id);
      const unmatched = joinResult.some((r) => r.matchKind === "left-only" && r.left?.id === id);
      if (matched) return "matched";
      if (unmatched) return "unmatched-included";
      return "excluded";
    },
    [joinResult],
  );

  const orderState = useCallback(
    (id: number): RowState => {
      const matched = joinResult.some((r) => r.matchKind === "matched" && r.right?.id === id);
      const unmatched = joinResult.some((r) => r.matchKind === "right-only" && r.right?.id === id);
      if (matched) return "matched";
      if (unmatched) return "unmatched-included";
      return "excluded";
    },
    [joinResult],
  );

  return (
    <LayoutGroup id="join-section">
      <section>
        <h2 className="text-2xl font-semibold mb-1">JOIN</h2>
        <p className="text-sm text-muted-foreground mb-6">
          結合種別を切り替えると、一致した行が users / orders
          テーブルから飛び出して結果テーブルへ合体する。
        </p>

        <div className="flex flex-wrap items-start gap-8 mb-8">
          <JoinTypeSelector value={joinType} onChange={setJoinType} />
          <VennDiagram type={joinType} />
        </div>

        <SqlSnippet sql={buildJoinSql(joinType)} />

        <div ref={containerRef} className="relative my-8">
          <SourceTables
            userState={userState}
            orderState={orderState}
            registerRowRef={registerRowRef}
          />
          <ConnectorLines containerRef={containerRef} rowRefs={rowRefs} joinResult={joinResult} />
        </div>

        <JoinResultTable rows={joinResult} rowRefs={rowRefs} />
      </section>
    </LayoutGroup>
  );
}
