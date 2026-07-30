"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export type RowState = "default" | "matched" | "unmatched-included" | "excluded";

const rowStateBackground: Record<RowState, string> = {
  default: "transparent",
  matched: "hsl(var(--primary) / 0.08)",
  "unmatched-included": "hsl(var(--destructive) / 0.06)",
  excluded: "transparent",
};

export interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
  mono?: boolean;
}

export interface GridRow<T> {
  key: string;
  data: T;
  state?: RowState;
}

interface TableGridProps<T> {
  title: string;
  columns: Column<T>[];
  rows: GridRow<T>[];
  registerRowRef?: (key: string, el: HTMLTableRowElement | null) => void;
}

export function TableGrid<T>({ title, columns, rows, registerRowRef }: TableGridProps<T>) {
  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wide">
            {columns.map((col) => (
              <th key={col.header} className="text-left font-medium py-2 pr-4">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const state = row.state ?? "default";
            return (
              <motion.tr
                key={row.key}
                ref={(el) => registerRowRef?.(row.key, el)}
                className="border-b border-border/60 last:border-b-0 transition-colors duration-300"
                style={{ backgroundColor: rowStateBackground[state] }}
                animate={{ opacity: state === "excluded" ? 0.35 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {columns.map((col) => (
                  <td key={col.header} className={`py-2 pr-4 ${col.mono ? "font-mono" : ""}`}>
                    {col.cell(row.data)}
                  </td>
                ))}
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
