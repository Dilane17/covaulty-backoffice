"use client";

import { ReactNode } from "react";

interface StatProps {
  v: ReactNode;
  l: string;
  big?: boolean;
}

export function Stat({ v, l, big }: StatProps) {
  return (
    <div>
      <div className="tnum" style={{ fontSize: big ? 14 : 16, fontWeight: 600 }}>{v}</div>
      <div className="eyebrow" style={{ marginTop: 2 }}>{l}</div>
    </div>
  );
}
