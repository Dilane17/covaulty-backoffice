"use client";

import { ReactNode } from "react";
import { Ic } from "@/components/ui/Icons";

interface FieldProps {
  k: string;
  children: ReactNode;
}

export function Field({ k, children }: FieldProps) {
  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 4 }}>
        {k}
      </div>
      <div style={{ fontSize: 14 }}>{children}</div>
    </div>
  );
}

interface FieldInputProps {
  k: string;
  v?: string;
  mono?: boolean;
}

export function FieldInput({ k, v, mono }: FieldInputProps) {
  return (
    <div className="field">
      <label>{k}</label>
      <div className="input">
        <input defaultValue={v} className={mono ? "mono" : ""} />
      </div>
    </div>
  );
}

interface CounterTileProps {
  color: string;
  big: string;
  small: string;
  icon: ReactNode;
}

export function CounterTile({ color, big, small, icon }: CounterTileProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: `${color}1a`,
          color,
          display: "grid",
          placeItems: "center",
          flex: "0 0 auto",
        }}
      >
        {icon}
      </div>
      <div>
        <div
          className="tnum"
          style={{
            fontSize: 24,
            fontWeight: 600,
            color,
            letterSpacing: "-0.02em",
          }}
        >
          {big}
        </div>
        <div className="muted" style={{ fontSize: 12, fontWeight: 500 }}>
          {small}
        </div>
      </div>
    </div>
  );
}

interface InstMetricProps {
  v: string;
  l: string;
}

export function InstMetric({ v, l }: InstMetricProps) {
  return (
    <div
      style={{
        borderLeft: "1px solid rgba(255,255,255,0.08)",
        paddingLeft: 20,
      }}
    >
      <div className="tnum" style={{ fontSize: 20, fontWeight: 600 }}>
        {v}
      </div>
      <div
        style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.55)",
          letterSpacing: 0.08,
          textTransform: "uppercase",
          marginTop: 2,
        }}
      >
        {l}
      </div>
    </div>
  );
}

interface RowProps {
  k: string;
  v: string;
}

export function Row({ k, v }: RowProps) {
  return (
    <div className="between" style={{ fontSize: 13 }}>
      <span className="muted">{k}</span>
      <strong className="tnum">{v}</strong>
    </div>
  );
}

interface LegendProps {
  c: string;
  l: string;
  border?: string;
}

export function Legend({ c, l, border }: LegendProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        color: "var(--ink-3)",
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: 3,
          background: c,
          border: border ? `1px solid ${border}` : "none",
        }}
      />
      {l}
    </div>
  );
}

export function LegendDash({ c, l }: LegendProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        color: "var(--ink-3)",
      }}
    >
      <svg width="20" height="6">
        <line
          x1="0"
          y1="3"
          x2="20"
          y2="3"
          stroke={c}
          strokeWidth="2"
          strokeDasharray="3 3"
        />
      </svg>
      {l}
    </div>
  );
}

interface PreviewRowProps {
  k: string;
  v: string;
}

export function PreviewRow({ k, v }: PreviewRowProps) {
  return (
    <div className="between" style={{ fontSize: 13 }}>
      <span className="muted">{k}</span>
      <strong className="tnum">{v}</strong>
    </div>
  );
}

interface CheckRowProps {
  t: string;
}

export function CheckRow({ t }: CheckRowProps) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}
    >
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: 999,
          background: "var(--accent)",
          color: "#fff",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Ic.Check />
      </span>
      {t}
    </div>
  );
}

interface PermRowProps {
  ok?: boolean;
  t: string;
}

export function PermRow({ ok, t }: PermRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 12px",
        background: "#fff",
        borderRadius: 8,
        fontSize: 13,
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: 999,
          display: "grid",
          placeItems: "center",
          background: ok ? "var(--accent)" : "var(--paper-3)",
          color: ok ? "#fff" : "var(--ink-4)",
        }}
      >
        {ok ? <Ic.Check /> : <Ic.X />}
      </span>
      <span style={{ color: ok ? "var(--ink)" : "var(--ink-3)" }}>{t}</span>
    </div>
  );
}

interface ColorPickerProps {
  l: string;
  v: string;
  onChange: (val: string) => void;
}

export function ColorPicker({ l, v, onChange }: ColorPickerProps) {
  return (
    <div className="field">
      <label>{l}</label>
      <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
        <div
          style={{
            width: 48,
            borderRadius: 12,
            background: v,
            flex: "0 0 auto",
            border: "1px solid var(--line-strong)",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <input
            type="color"
            value={v}
            onChange={(e) => onChange(e.target.value)}
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0,
              cursor: "pointer",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
        <div className="input" style={{ flex: 1 }}>
          <input
            value={v}
            onChange={(e) => onChange(e.target.value)}
            className="mono"
          />
        </div>
      </div>
    </div>
  );
}
