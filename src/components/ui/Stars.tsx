"use client";

import { Ic } from "@/components/ui/Icons";

interface StarsProps {
  value: number;
  max?: number;
}

export function Stars({ value, max = 5 }: StarsProps) {
  return (
    <span className="stars">
      {[...Array(max)].map((_, i) => (
        <span key={i} className={i < value ? "" : "off"}>
          <Ic.Star filled={true} />
        </span>
      ))}
    </span>
  );
}
