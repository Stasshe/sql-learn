"use client";

import type { JoinType } from "./join-engine";
import { SegmentedControl } from "./SegmentedControl";

const OPTIONS: { value: JoinType; label: string }[] = [
  { value: "INNER", label: "内部結合" },
  { value: "LEFT", label: "左外部結合" },
  { value: "RIGHT", label: "右外部結合" },
  { value: "FULL", label: "完全外部結合" },
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
