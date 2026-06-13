"use client";

import { Ic } from "@/components/ui/Icons";

interface DropChipProps {
  label: string;
}

export function DropChip({ label }: DropChipProps) {
  return (
    <button className="chip">
      {label} <Ic.Chevron />
    </button>
  );
}
