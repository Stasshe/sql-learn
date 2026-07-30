"use client";

import type { JoinType } from "./join-engine";
import { SegmentedControl } from "./SegmentedControl";

const OPTIONS: { value: JoinType; label: string }[] = [
  { value: "INNER", label: "INNER" },
  { value: "LEFT", label: "LEFT" },
  { value: "RIGHT", label: "RIGHT" },
  { value: "FULL", label: "FULL" },
];

interface JoinTypeSelectorProps {
  value: JoinType;
  onChange: (value: JoinType) => void;
}

export function JoinTypeSelector({ value, onChange }: JoinTypeSelectorProps) {
  return (
    <SegmentedControl<JoinType>
      options={OPTIONS}
      value={value}
      onChange={onChange}
      layoutId="join-type-pill"
    />
  );
}
