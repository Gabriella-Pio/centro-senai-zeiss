import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = Inter_Tight({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Centro de Excelência em Metrologia SENAI × ZEISS",
  description: "Plataforma oficial de metrologia de alta precisão e gestão de serviços industriais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 pt-[80px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}