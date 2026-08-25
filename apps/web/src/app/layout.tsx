import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
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
    <html lang="pt-BR" className={`${plexSans.variable} ${plexMono.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f%5B%5D=general-sans@600,700&display=swap"
        />
      </head>
      <body className={`${plexSans.className} min-h-screen flex flex-col bg-background text-foreground font-sans`}>
        <Navbar />
        <main className="flex-1 pt-[80px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
