"use client";

import { DonutSlice } from "@/types/common";

interface DonutChartProps {
  data: DonutSlice[];
  size?: number;
}

export function DonutChart({ data, size = 200 }: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.v, 0);
  const r = size / 2 - 10;
  const cx = size / 2, cy = size / 2;
  const arcs = data.map((d, i) => {
    const prev = data.slice(0, i).reduce((s, x) => s + x.v, 0);
    const start = (prev / total) * Math.PI * 2 - Math.PI / 2;
    const end = ((prev + d.v) / total) * Math.PI * 2 - Math.PI / 2;
    const x1 = cx + Math.cos(start) * r, y1 = cy + Math.sin(start) * r;
    const x2 = cx + Math.cos(end) * r, y2 = cy + Math.sin(end) * r;
    const large = end - start > Math.PI ? 1 : 0;
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
    return { ...d, path };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {arcs.map((a, i) => (
        <path key={i} d={a.path} fill={a.c} />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.55} fill="#fff" />
      <text
        x={cx} y={cy - 4}
        textAnchor="middle" fontSize="22" fontWeight="600" fill="var(--ink)"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {total}%
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" letterSpacing="0.14em" fill="var(--ink-3)">
        RÉPARTITION
      </text>
    </svg>
  );
}
