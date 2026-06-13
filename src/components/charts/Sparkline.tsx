"use client";

interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

export function Sparkline({ data, color = "var(--primary)", width = 120, height = 32 }: SparklineProps) {
  const ys = data;
  const yMax = Math.max(...ys), yMin = Math.min(...ys);
  const xs = data.map((_, i) => (i * width) / (data.length - 1));
  const yScale = (y: number) => height - 2 - ((y - yMin) / (yMax - yMin || 1)) * (height - 4);
  const path = ys.map((y, i) => (i === 0 ? `M${xs[i]} ${yScale(y)}` : `L${xs[i]} ${yScale(y)}`)).join(" ");

  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <path d={path} stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}
