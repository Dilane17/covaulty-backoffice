"use client";

import { ChartPoint } from "@/types/common";

interface LineChartProps {
  data: ChartPoint[];
  height?: number;
  width?: number;
  color?: string;
  showTip?: number;
}

export function LineChart({
  data,
  height = 200,
  width = 520,
  color = "var(--primary)",
  showTip = -1,
}: LineChartProps) {
  const pad = { l: 36, r: 16, t: 16, b: 24 };
  const w = width,
    h = height;
  const xs = data.map(
    (_, i) => pad.l + (i * (w - pad.l - pad.r)) / (data.length - 1),
  );
  const ys = data.map((d) => d.y);
  const yMax = Math.max(...ys) * 1.15;
  const yMin = 0;
  const yScale = (y: number) =>
    h - pad.b - ((y - yMin) / (yMax - yMin)) * (h - pad.t - pad.b);
  const pts = data.map((d, i) => [xs[i], yScale(d.y)] as [number, number]);
  const path = pts
    .map((p, i) => (i === 0 ? `M${p[0]} ${p[1]}` : `L${p[0]} ${p[1]}`))
    .join(" ");
  const area = `${path} L${pts[pts.length - 1][0]} ${h - pad.b} L${pts[0][0]} ${h - pad.b} Z`;

  const tipIdx = showTip < 0 ? data.length - 1 : showTip;
  const tipX = pts[tipIdx][0],
    tipY = pts[tipIdx][1];

  return (
    <svg
      className="chart-svg"
      viewBox={`0 0 ${w} ${h}`}
      style={{ height: "auto", overflow: "visible" }}
    >
      <defs>
        <linearGradient id="lcAreaGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((t) => {
        const y = pad.t + t * (h - pad.t - pad.b);
        return (
          <line
            key={t}
            className="grid"
            x1={pad.l}
            x2={w - pad.r}
            y1={y}
            y2={y}
          />
        );
      })}
      <path d={area} fill="url(#lcAreaGrad)" />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={p[0]}
          cy={p[1]}
          r={i === tipIdx ? 5 : 3.5}
          fill={color}
          stroke="#fff"
          strokeWidth="2"
        />
      ))}
      {data.map((d, i) => (
        <text key={i} className="axis" x={xs[i]} y={h - 6} textAnchor="middle">
          {d.x}
        </text>
      ))}
      <g transform={`translate(${tipX}, ${tipY - 28})`}>
        <rect className="tip" x="-32" y="-18" width="64" height="22" rx="6" />
        <text className="tip-text" textAnchor="middle" y="-3">
          {data[tipIdx].tip || `${data[tipIdx].y} M F`}
        </text>
      </g>
    </svg>
  );
}
