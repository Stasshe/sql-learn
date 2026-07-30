"use client";

import { animate } from "animejs";
import type { RefObject } from "react";
import { useLayoutEffect, useRef, useState } from "react";

import type { Order, User } from "./data";
import type { JoinedRow, MatchKind } from "./join-engine";

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
  rowRefs: RefObject<Map<string, HTMLTableRowElement>>;
}

function flyCellsFrom(
  cells: NodeListOf<Element>,
  sourceEl: HTMLElement | undefined,
  delay: number,
) {
  if (cells.length === 0) return;
  const sourceRect = sourceEl?.getBoundingClientRect();
  cells.forEach((cell) => {
    const cellRect = cell.getBoundingClientRect();
    const dx = sourceRect ? sourceRect.left - cellRect.left : 0;
    const dy = sourceRect ? sourceRect.top - cellRect.top : -12;
    animate(cell, {
      translateX: [dx, 0],
      translateY: [dy, 0],
      opacity: [0, 1],
      duration: 700,
      delay,
      ease: "outQuad",
    });
  });
}

export function JoinResultTable({ rows, rowRefs }: JoinResultTableProps) {
  const [displayRows, setDisplayRows] = useState<DisplayRow[]>(rows);
  const rowElRefs = useRef(new Map<string, HTMLTableRowElement>());
  const prevRectsRef = useRef(new Map<string, DOMRect>());

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

    displayRows.forEach((row, index) => {
      const el = rowElRefs.current.get(row.key);
      if (!el) return;

      if (row.exiting) {
        animate(el, {
          opacity: [1, 0],
          scale: [1, 0.92],
          translateY: [0, 8],
          duration: 500,
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
            duration: 700,
            ease: "outExpo",
          });
        }
        return;
      }

      const delay = index * 180;
      const leftSource = row.left ? rowRefs.current.get(`user-${row.left.id}`) : undefined;
      const rightSource = row.right ? rowRefs.current.get(`order-${row.right.id}`) : undefined;

      flyCellsFrom(el.querySelectorAll('[data-side="left"]'), leftSource, delay);
      flyCellsFrom(el.querySelectorAll('[data-side="right"]'), rightSource, delay);

      const noneCells = el.querySelectorAll('[data-side="none"]');
      if (noneCells.length > 0) {
        animate(noneCells, { opacity: [0, 1], duration: 400, delay });
      }
    });
  }, [displayRows, rowRefs]);

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
