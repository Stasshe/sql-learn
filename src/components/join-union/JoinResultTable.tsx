"use client";

import { animate, stagger } from "animejs";
import { useLayoutEffect, useRef, useState } from "react";

import type { Order, User } from "./data";
import type { JoinedRow, MatchKind } from "./join-engine";
import type { FlightVectors } from "./useFlightVectors";

const rowBackground: Record<MatchKind, string> = {
  matched: "hsl(var(--primary) / 0.08)",
  "left-only": "hsl(var(--destructive) / 0.06)",
  "right-only": "hsl(var(--destructive) / 0.06)",
};

function Null() {
  return <span className="text-muted-foreground italic">NULL</span>;
}

interface DisplayRow extends JoinedRow<User, Order> {
  exiting?: boolean;
}

interface JoinResultTableProps {
  rows: JoinedRow<User, Order>[];
  flightVectors: FlightVectors | null;
}

export function JoinResultTable({ rows, flightVectors }: JoinResultTableProps) {
  const [displayRows, setDisplayRows] = useState<DisplayRow[]>(rows);
  const rowElRefs = useRef(new Map<string, HTMLTableRowElement>());
  const prevRectsRef = useRef(new Map<string, DOMRect>());
  const flightVectorsRef = useRef(flightVectors);
  flightVectorsRef.current = flightVectors;

  // FLIP "first": capture current on-screen rects before the row set changes.
  useLayoutEffect(() => {
    const beforeRects = new Map<string, DOMRect>();
    rowElRefs.current.forEach((el, key) => {
      beforeRects.set(key, el.getBoundingClientRect());
    });
    prevRectsRef.current = beforeRects;

    setDisplayRows((prevDisplay) => {
      const nextKeys = new Set(rows.map((r) => r.key));
      const stillExiting = prevDisplay.filter((r) => r.exiting && !nextKeys.has(r.key));
      const newlyExiting = prevDisplay
        .filter((r) => !r.exiting && !nextKeys.has(r.key))
        .map((r) => ({ ...r, exiting: true }));
      return [...rows, ...stillExiting, ...newlyExiting];
    });
  }, [rows]);

  // FLIP "last/invert/play", entrance flight, and exit, driven by anime.js.
  useLayoutEffect(() => {
    const beforeRects = prevRectsRef.current;
    const vectors = flightVectorsRef.current;

    displayRows.forEach((row, index) => {
      const el = rowElRefs.current.get(row.key);
      if (!el) return;

      if (row.exiting) {
        animate(el, {
          opacity: [1, 0],
          scale: [1, 0.92],
          translateY: [0, 8],
          duration: 250,
          ease: "inQuad",
          onComplete: () => {
            setDisplayRows((prev) => prev.filter((r) => r.key !== row.key));
          },
        });
        return;
      }

      const before = beforeRects.get(row.key);
      if (before) {
        const after = el.getBoundingClientRect();
        const dx = before.left - after.left;
        const dy = before.top - after.top;
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
          animate(el, {
            translateX: [dx, 0],
            translateY: [dy, 0],
            duration: 420,
            ease: "outExpo",
          });
        }
        return;
      }

      animate(el, { opacity: [0, 1], duration: 150, ease: "linear" });

      const leftCells = el.querySelectorAll('[data-side="left"]');
      const rightCells = el.querySelectorAll('[data-side="right"]');
      const noneCells = el.querySelectorAll('[data-side="none"]');
      const leftOffset = row.left && vectors ? vectors.left : null;
      const rightOffset = row.right && vectors ? vectors.right : null;

      if (leftCells.length > 0) {
        animate(leftCells, {
          translateX: leftOffset ? [leftOffset.dx, 0] : 0,
          translateY: leftOffset ? [leftOffset.dy, 0] : [-10, 0],
          opacity: [0, 1],
          duration: 550,
          delay: stagger(30, { start: index * 60 }),
          ease: "outExpo",
        });
      }
      if (rightCells.length > 0) {
        animate(rightCells, {
          translateX: rightOffset ? [rightOffset.dx, 0] : 0,
          translateY: rightOffset ? [rightOffset.dy, 0] : [-10, 0],
          opacity: [0, 1],
          duration: 550,
          delay: stagger(30, { start: index * 60 }),
          ease: "outExpo",
        });
      }
      if (noneCells.length > 0) {
        animate(noneCells, { opacity: [0, 1], duration: 300, delay: index * 60 });
      }
    });
  }, [displayRows]);

  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">結果</h3>
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
        <tbody>
          {displayRows.map((row) => (
            <tr
              key={row.key}
              ref={(el) => {
                if (el) rowElRefs.current.set(row.key, el);
                else rowElRefs.current.delete(row.key);
              }}
              style={{ backgroundColor: rowBackground[row.matchKind] }}
              className="border-b border-border/60 last:border-b-0 transition-colors duration-300"
            >
              <td data-side={row.left ? "left" : "none"} className="py-2 pr-4 font-mono">
                {row.left ? row.left.id : <Null />}
              </td>
              <td data-side={row.left ? "left" : "none"} className="py-2 pr-4">
                {row.left ? row.left.name : <Null />}
              </td>
              <td data-side={row.right ? "right" : "none"} className="py-2 pr-4 font-mono">
                {row.right ? row.right.id : <Null />}
              </td>
              <td data-side={row.right ? "right" : "none"} className="py-2 pr-4 font-mono">
                {row.right ? row.right.user_id : <Null />}
              </td>
              <td data-side={row.right ? "right" : "none"} className="py-2 pr-4">
                {row.right ? row.right.item : <Null />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
