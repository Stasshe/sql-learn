"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

const KEYWORD_SET = new Set([
  "SELECT",
  "FROM",
  "JOIN",
  "INNER",
  "LEFT",
  "RIGHT",
  "FULL",
  "OUTER",
  "ON",
  "UNION",
  "ALL",
  "WHERE",
  "AS",
]);

const SPLIT_PATTERN = /\b(SELECT|FROM|JOIN|INNER|LEFT|RIGHT|FULL|OUTER|ON|UNION|ALL|WHERE|AS)\b/;

function highlight(sql: string): ReactNode[] {
  const parts = sql.split(SPLIT_PATTERN);
  return parts.map((part, i) => {
    const key = `${part}-${i}`;
    if (KEYWORD_SET.has(part)) {
      return (
        <span key={key} className="text-primary font-semibold">
          {part}
        </span>
      );
    }
    return <span key={key}>{part}</span>;
  });
}

interface SqlSnippetProps {
  sql: string;
}

export function SqlSnippet({ sql }: SqlSnippetProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.pre
        key={sql}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.15 }}
        className="font-mono text-sm border-l-2 border-border pl-4 whitespace-pre-wrap"
      >
        {highlight(sql)}
      </motion.pre>
    </AnimatePresence>
  );
}
