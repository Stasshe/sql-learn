"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

import type { Customer } from "./data";
import type { UnionRow } from "./union-engine";
import type { FlightVectors } from "./useFlightVectors";

interface UnionResultTableProps {
  rows: UnionRow<Customer>[];
  justMergedKey: string | null;
  flightVectors: FlightVectors | null;
}

export function UnionResultTable({ rows, justMergedKey, flightVectors }: UnionResultTableProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">結果</h3>
      <LayoutGroup id="union-result">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wide">
              <th className="text-left font-medium py-2 pr-4">id</th>
              <th className="text-left font-medium py-2 pr-4">name</th>
              <th className="text-left font-medium py-2 pr-4">city</th>
              <th className="text-left font-medium py-2 pr-4">source</th>
            </tr>
          </thead>
          <motion.tbody>
            <AnimatePresence mode="popLayout">
              {rows.map((row) => {
                const vector = row.source === "A" ? flightVectors?.left : flightVectors?.right;
                const initial = vector
                  ? { opacity: 0, x: vector.dx, y: vector.dy }
                  : { opacity: 0, x: 0, y: -6 };
                return (
                  <motion.tr
                    key={row.key}
                    layout
                    style={{ transformOrigin: "top" }}
                    initial={initial}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, scaleY: 0, transition: { duration: 0.15 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    className={`border-b border-border/60 last:border-b-0 ${
                      row.key === justMergedKey ? "animate-merge-pulse" : ""
                    }`}
                  >
                    <td className="py-2 pr-4 font-mono">{row.row.id}</td>
                    <td className="py-2 pr-4">{row.row.name}</td>
                    <td className="py-2 pr-4">{row.row.city}</td>
                    <td className="py-2 pr-4 text-muted-foreground">
                      {row.source === "A" ? "2024" : "2025"}
                      {row.isDuplicate && <span className="ml-2 text-xs">重複</span>}
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </motion.tbody>
        </table>
      </LayoutGroup>
    </div>
  );
}
