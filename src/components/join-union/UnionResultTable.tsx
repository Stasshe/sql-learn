"use client";

import { animate } from "animejs";
import { useLayoutEffect, useRef, useState } from "react";

import type { Customer } from "./data";
import type { UnionRow } from "./union-engine";
import type { FlightVectors } from "./useFlightVectors";

interface DisplayRow extends UnionRow<Customer> {
  exiting?: boolean;
}

interface UnionResultTableProps {
  rows: UnionRow<Customer>[];
  justMergedKey: string | null;
  flightVectors: FlightVectors | null;
}

export function UnionResultTable({ rows, justMergedKey, flightVectors }: UnionResultTableProps) {
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

  // FLIP "last/invert/play" and entrance flight, driven by anime.js.
  useLayoutEffect(() => {
    const beforeRects = prevRectsRef.current;
    const vectors = flightVectorsRef.current;

    displayRows.forEach((row, index) => {
      const el = rowElRefs.current.get(row.key);
      if (!el) return;

      if (row.exiting) {
        animate(el, {
          opacity: [1, 0],
          scale: [1, 0.9],
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
            duration: 400,
            ease: "outExpo",
          });
        }
        return;
      }

      const offset = vectors ? (row.source === "A" ? vectors.left : vectors.right) : null;
      animate(el, {
        translateX: offset ? [offset.dx, 0] : 0,
        translateY: offset ? [offset.dy, 0] : [-10, 0],
        opacity: [0, 1],
        duration: 500,
        delay: index * 50,
        ease: "outExpo",
      });
    });
  }, [displayRows]);

  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">結果</h3>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wide">
            <th className="text-left font-medium py-2 pr-4">id</th>
            <th className="text-left font-medium py-2 pr-4">name</th>
            <th className="text-left font-medium py-2 pr-4">city</th>
            <th className="text-left font-medium py-2 pr-4">source</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
