"use client";

import type { JoinType } from "./join-engine";
import { SegmentedControl } from "./SegmentedControl";

const OPTIONS: { value: JoinType; label: string }[] = [
  { value: "INNER", label: "INNER JOIN" },
  { value: "LEFT", label: "LEFT OUTER JOIN" },
  { value: "RIGHT", label: "RIGHT OUTER JOIN" },
  { value: "FULL", label: "FULL OUTER JOIN" },
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
