import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Área da equipe — SENAI × ZEISS",
  description: "Módulo interno do laboratório de metrologia. Acesso restrito à equipe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
