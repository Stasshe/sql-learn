"use client";

import { motion } from "framer-motion";

import type { JoinType } from "./join-engine";

const LEFT_CIRCLE = "M 20,60 A 50,50 0 1,0 120,60 A 50,50 0 1,0 20,60 Z";
const RIGHT_CIRCLE = "M 80,60 A 50,50 0 1,0 180,60 A 50,50 0 1,0 80,60 Z";
const LENS = "M 100,20 A 50,50 0 0,1 100,100 A 50,50 0 0,1 100,20 Z";

type RegionFill = 0 | 0.5;

const REGION_FILL: Record<JoinType, { left: RegionFill; lens: RegionFill; right: RegionFill }> = {
  INNER: { left: 0, lens: 0.5, right: 0 },
  LEFT: { left: 0.5, lens: 0.5, right: 0 },
  RIGHT: { left: 0, lens: 0.5, right: 0.5 },
  FULL: { left: 0.5, lens: 0.5, right: 0.5 },
};

interface VennDiagramProps {
  type: JoinType;
}

export function VennDiagram({ type }: VennDiagramProps) {
  const fill = REGION_FILL[type];

  return (
    <svg
      viewBox="0 0 200 120"
      className="w-full max-w-xs h-auto"
      role="img"
      aria-label={`${type} JOIN のベン図`}
    >
      <motion.path
        d={`${LEFT_CIRCLE} ${LENS}`}
        fillRule="evenodd"
        fill="hsl(var(--primary))"
        animate={{ opacity: fill.left }}
        transition={{ duration: 0.3 }}
      />
      <motion.path
        d={`${RIGHT_CIRCLE} ${LENS}`}
        fillRule="evenodd"
        fill="hsl(var(--primary))"
        animate={{ opacity: fill.right }}
        transition={{ duration: 0.3 }}
      />
      <motion.path
        d={LENS}
        fill="hsl(var(--primary))"
        animate={{ opacity: fill.lens }}
        transition={{ duration: 0.3 }}
      />
      <path d={LEFT_CIRCLE} fill="none" stroke="hsl(var(--border))" strokeWidth={1.5} />
      <path d={RIGHT_CIRCLE} fill="none" stroke="hsl(var(--border))" strokeWidth={1.5} />
      <text x="45" y="65" textAnchor="middle" className="fill-muted-foreground text-[10px]">
        users
      </text>
      <text x="155" y="65" textAnchor="middle" className="fill-muted-foreground text-[10px]">
        orders
      </text>
    </svg>
  );
}
