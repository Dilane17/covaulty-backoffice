"use client";

interface LogomarkProps {
  size?: number;
  color?: string;
  coinColor?: string;
  coinStroke?: string;
}

export function Logomark({
  size = 28,
  color = "var(--primary)",
  coinColor = "#fff",
  coinStroke = "var(--primary)",
}: LogomarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path
        d="M28 8.5C24.8 6.3 21 5.5 17 6.6 11.5 8 7.5 12.6 6.8 18.4c-.9 6.9 3.7 13.6 10.6 15.2 4.6 1 9.4-.4 12.7-3.6"
        stroke={color}
        strokeWidth="4.6"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="26.2" cy="22.4" r="6.2" fill={color} stroke={coinStroke} strokeWidth="1.4" />
      <circle cx="26.2" cy="22.4" r="2.4" fill={coinColor} />
    </svg>
  );
}

interface LogoLockupProps {
  size?: number;
  color?: string;
  textColor?: string;
}

export function LogoLockup({ size = 28, color = "var(--primary)", textColor }: LogoLockupProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <Logomark size={size} color={color} />
      <span
        style={{
          fontWeight: 600,
          fontSize: size * 0.62,
          letterSpacing: "-0.02em",
          color: textColor || color,
          lineHeight: 1,
        }}
      >
        Covaulty
      </span>
    </div>
  );
}
