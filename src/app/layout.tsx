import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Covaulty · Backoffice",
  description: "Supervision de la collecte journalière d'épargne — Bénin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
