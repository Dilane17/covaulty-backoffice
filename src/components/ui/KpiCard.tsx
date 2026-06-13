"use client";

import { ReactNode } from "react";

interface KpiCardProps {
  lbl: string;
  val: ReactNode;
  delta?: ReactNode;
  deltaDir?: "down";
  spark?: number[];
  progress?: number;
  highlight?: boolean;
}

export function KpiCard({
  lbl,
  val,
  delta,
  deltaDir,
  spark,
  progress,
  highlight,
}: KpiCardProps) {
  return (
    <div className={`kpi ${highlight ? "kpi--ok" : ""}`}>
      <div className="kpi-top">
        <div className="lbl">{lbl}</div>
      </div>
      <div className="val tnum">{val}</div>
      <div
        className={`delta ${deltaDir === "down" ? "down" : ""} ${highlight ? "ok" : ""}`}
      >
        {delta}
      </div>
      {typeof progress === "number" && (
        <div className="kpi-bar">
          <span style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

interface KpiSmProps {
  v: ReactNode;
  l: string;
}

export function KpiSm({ v, l }: KpiSmProps) {
  return (
    <div
      style={{
        background: "var(--paper)",
        borderRadius: 12,
        padding: 12,
        border: "1px solid var(--line)",
      }}
    >
      <div
        className="tnum"
        style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}
      >
        {v}
      </div>
      <div className="eyebrow" style={{ marginTop: 3, fontSize: 10 }}>
        {l}
      </div>
    </div>
  );
}
