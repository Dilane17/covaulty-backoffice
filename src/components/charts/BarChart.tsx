"use client";

import { BarChartPoint } from "@/types/common";

interface BarChartProps {
  data: BarChartPoint[];
  height?: number;
  width?: number;
  colors?: [string, string];
}

export function BarChart({
  data,
  height = 240,
  width = 520,
  colors = ["var(--primary)", "var(--accent-soft)"],
}: BarChartProps) {
  const pad = { l: 36, r: 16, t: 16, b: 30 };
  const w = width, h = height;
  const groupW = (w - pad.l - pad.r) / data.length;
  const barW = groupW * 0.32;
  const ys = data.flatMap((d) => [d.y1, d.y2 || 0]);
  const yMax = Math.max(...ys) * 1.15;
  const yScale = (y: number) => h - pad.b - (y / yMax) * (h - pad.t - pad.b);

  return (
    <svg className="chart-svg" viewBox={`0 0 ${w} ${h}`} style={{ height }}>
      {[0.25, 0.5, 0.75, 1].map((t) => {
        const y = pad.t + t * (h - pad.t - pad.b);
        return <line key={t} className="grid" x1={pad.l} x2={w - pad.r} y1={y} y2={y} />;
      })}
      {data.map((d, i) => {
        const cx = pad.l + groupW * i + groupW / 2;
        const y1 = yScale(d.y1), y2 = yScale(d.y2 || 0);
        return (
          <g key={i}>
            <rect x={cx - barW - 2} y={y1} width={barW} height={h - pad.b - y1} fill={colors[0]} rx="2" />
            <rect x={cx + 2} y={y2} width={barW} height={h - pad.b - y2} fill={colors[1]} rx="2" />
            <text className="axis" x={cx} y={h - 10} textAnchor="middle">{d.x}</text>
          </g>
        );
      })}
    </svg>
  );
}
