"use client";

import { ChartPoint, ForecastPoint } from "@/types/common";

interface ForecastChartProps {
  history: ChartPoint[];
  forecast: ForecastPoint[];
  optimistic: ForecastPoint[];
  height?: number;
  width?: number;
}

export function ForecastChart({
  history,
  forecast,
  optimistic,
  height = 280,
  width = 720,
}: ForecastChartProps) {
  const pad = { l: 44, r: 16, t: 16, b: 30 };
  const w = width, h = height;
  const allPts = [...history, ...forecast];
  const n = allPts.length;
  const xs = allPts.map((_, i) => pad.l + (i * (w - pad.l - pad.r)) / (n - 1));
  const ys = allPts.map((d) => d.y);
  const upper = forecast.map((d) => d.y + (d.band || d.y * 0.06));
  const lower = forecast.map((d) => Math.max(0, d.y - (d.band || d.y * 0.08)));
  const yMax = Math.max(...ys, ...upper) * 1.08;
  const yScale = (y: number) => h - pad.b - (y / yMax) * (h - pad.t - pad.b);
  const xForI = (i: number) => xs[i];

  const histPath = history
    .map((d, i) => (i === 0 ? `M${xForI(i)} ${yScale(d.y)}` : `L${xForI(i)} ${yScale(d.y)}`))
    .join(" ");
  const histLast = history.length - 1;
  const fcstPath = forecast
    .map((d, i) => {
      const xi = histLast + 1 + i;
      return i === 0
        ? `M${xForI(histLast)} ${yScale(history[histLast].y)} L${xForI(xi)} ${yScale(d.y)}`
        : `L${xForI(xi)} ${yScale(d.y)}`;
    })
    .join(" ");
  const optPath = optimistic
    .map((d, i) => {
      const xi = histLast + 1 + i;
      return i === 0
        ? `M${xForI(histLast)} ${yScale(history[histLast].y)} L${xForI(xi)} ${yScale(d.y)}`
        : `L${xForI(xi)} ${yScale(d.y)}`;
    })
    .join(" ");

  const bandTop = forecast.map((_, i) => `${xForI(histLast + 1 + i)} ${yScale(upper[i])}`);
  const bandBot = forecast.map((_, i) => `${xForI(histLast + 1 + i)} ${yScale(lower[i])}`).reverse();
  const bandPath =
    `M${xForI(histLast)} ${yScale(history[histLast].y)} ` +
    bandTop.map((p) => `L${p}`).join(" ") +
    " " +
    bandBot.map((p) => `L${p}`).join(" ") +
    " Z";

  const todayX = xForI(histLast);

  return (
    <svg className="chart-svg" viewBox={`0 0 ${w} ${h}`} style={{ height }}>
      {[0.25, 0.5, 0.75, 1].map((t) => {
        const y = pad.t + t * (h - pad.t - pad.b);
        return <line key={t} className="grid" x1={pad.l} x2={w - pad.r} y1={y} y2={y} />;
      })}
      {[0, 0.5, 1].map((t) => {
        const y = pad.t + (1 - t) * (h - pad.t - pad.b);
        const val = (yMax * t).toFixed(0);
        return <text key={t} className="axis" x={pad.l - 8} y={y + 4} textAnchor="end">{val} M</text>;
      })}
      <path d={bandPath} fill="rgba(179,0,27,0.08)" />
      <path d={optPath} stroke="var(--accent)" strokeWidth="1.4" fill="none" strokeDasharray="3 4" opacity="0.85" />
      <path d={histPath} stroke="var(--primary)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d={fcstPath} stroke="var(--primary)" strokeWidth="2" fill="none" strokeDasharray="5 5" strokeLinecap="round" opacity="0.65" />
      <line x1={todayX} x2={todayX} y1={pad.t} y2={h - pad.b} stroke="var(--ink-3)" strokeDasharray="2 4" strokeWidth="1" />
      <text className="axis" x={todayX} y={pad.t - 4} textAnchor="middle" fill="var(--ink-3)">Aujourd&apos;hui</text>
      {allPts.map((d, i) =>
        (i % Math.max(1, Math.floor(n / 8)) === 0 || i === n - 1) ? (
          <text key={i} className="axis" x={xs[i]} y={h - 10} textAnchor="middle">{d.x}</text>
        ) : null
      )}
    </svg>
  );
}
