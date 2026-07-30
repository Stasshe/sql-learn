"use client";

import { motion } from "framer-motion";

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  layoutId: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  layoutId,
}: SegmentedControlProps<T>) {
  return (
    <div className="inline-flex gap-1 p-1 rounded-md bg-secondary">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              active ? "text-primary-foreground" : "text-foreground hover:text-foreground/80"
            }`}
          >
            {active && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 bg-primary rounded-md"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
