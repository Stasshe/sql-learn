"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { RefObject } from "react";
import { useLayoutEffect, useState } from "react";

import type { Order, User } from "./data";
import type { JoinedRow } from "./join-engine";

interface Line {
  key: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface ConnectorLinesProps {
  containerRef: RefObject<HTMLDivElement | null>;
  rowRefs: RefObject<Map<string, HTMLTableRowElement>>;
  joinResult: JoinedRow<User, Order>[];
}

export function ConnectorLines({ containerRef, rowRefs, joinResult }: ConnectorLinesProps) {
  const [lines, setLines] = useState<Line[]>([]);

  useLayoutEffect(() => {
    function measure() {
      const container = containerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();

      const next: Line[] = [];
      for (const row of joinResult) {
        if (row.matchKind !== "matched" || !row.left || !row.right) continue;
        const leftEl = rowRefs.current.get(`user-${row.left.id}`);
        const rightEl = rowRefs.current.get(`order-${row.right.id}`);
        if (!leftEl || !rightEl) continue;
        const l = leftEl.getBoundingClientRect();
        const r = rightEl.getBoundingClientRect();
        next.push({
          key: row.key,
          x1: l.right - containerRect.left,
          y1: l.top - containerRect.top + l.height / 2,
          x2: r.left - containerRect.left,
          y2: r.top - containerRect.top + r.height / 2,
        });
      }
      setLines(next);
    }

    measure();
    // On initial mount, framer-motion attaches row DOM refs one frame after
    // this layout effect runs, so the first synchronous measure() can miss them.
    const raf = requestAnimationFrame(measure);

    const container = containerRef.current;
    const observer = new ResizeObserver(measure);
    if (container) observer.observe(container);
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [joinResult, containerRef, rowRefs]);

  return (
    <svg
      className="absolute inset-0 pointer-events-none hidden md:block w-full h-full"
      role="presentation"
    >
      <AnimatePresence>
        {lines.map((line) => (
          <motion.line
            key={line.key}
            stroke="hsl(var(--primary))"
            strokeWidth={1.5}
            initial={{ x1: line.x1, y1: line.y1, x2: line.x1, y2: line.y1, opacity: 0 }}
            animate={{ x1: line.x1, y1: line.y1, x2: line.x2, y2: line.y2, opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          />
        ))}
      </AnimatePresence>
    </svg>
  );
}
