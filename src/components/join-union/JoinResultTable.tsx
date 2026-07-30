"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

import type { Order, User } from "./data";
import type { JoinedRow, MatchKind } from "./join-engine";
import type { FlightVector, FlightVectors } from "./useFlightVectors";

const rowBackground: Record<MatchKind, string> = {
  matched: "hsl(var(--primary) / 0.08)",
  "left-only": "hsl(var(--destructive) / 0.06)",
  "right-only": "hsl(var(--destructive) / 0.06)",
};

function Null() {
  return <span className="text-muted-foreground italic">NULL</span>;
}

interface JoinResultTableProps {
  rows: JoinedRow<User, Order>[];
  flightVectors: FlightVectors | null;
}

function cellInitial(hasSource: boolean, vector: FlightVector | undefined) {
  if (hasSource && vector) {
    return { opacity: 0, x: vector.dx, y: vector.dy };
  }
  return { opacity: 0, x: 0, y: -6 };
}

const cellTransition = { type: "spring" as const, stiffness: 300, damping: 28 };

export function JoinResultTable({ rows, flightVectors }: JoinResultTableProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">結果</h3>
      <LayoutGroup id="join-result">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wide">
              <th className="text-left font-medium py-2 pr-4">users.id</th>
              <th className="text-left font-medium py-2 pr-4">users.name</th>
              <th className="text-left font-medium py-2 pr-4">orders.id</th>
              <th className="text-left font-medium py-2 pr-4">orders.user_id</th>
              <th className="text-left font-medium py-2 pr-4">orders.item</th>
            </tr>
          </thead>
          <motion.tbody>
            <AnimatePresence mode="popLayout">
              {rows.map((row) => {
                const leftInitial = cellInitial(row.left !== null, flightVectors?.left);
                const rightInitial = cellInitial(row.right !== null, flightVectors?.right);
                return (
                  <motion.tr
                    key={row.key}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    transition={{ duration: 0.25 }}
                    style={{ backgroundColor: rowBackground[row.matchKind] }}
                    className="border-b border-border/60 last:border-b-0 transition-colors duration-300"
                  >
                    <motion.td
                      initial={leftInitial}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={cellTransition}
                      className="py-2 pr-4 font-mono"
                    >
                      {row.left ? row.left.id : <Null />}
                    </motion.td>
                    <motion.td
                      initial={leftInitial}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={cellTransition}
                      className="py-2 pr-4"
                    >
                      {row.left ? row.left.name : <Null />}
                    </motion.td>
                    <motion.td
                      initial={rightInitial}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={cellTransition}
                      className="py-2 pr-4 font-mono"
                    >
                      {row.right ? row.right.id : <Null />}
                    </motion.td>
                    <motion.td
                      initial={rightInitial}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={cellTransition}
                      className="py-2 pr-4 font-mono"
                    >
                      {row.right ? row.right.user_id : <Null />}
                    </motion.td>
                    <motion.td
                      initial={rightInitial}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={cellTransition}
                      className="py-2 pr-4"
                    >
                      {row.right ? row.right.item : <Null />}
                    </motion.td>
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
