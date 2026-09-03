import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { ContactCtaBand } from "@/components/layout/ContactCtaBand";
import Footer from "@/components/layout/Footer";
import { SectionSurfaceDevPanel } from "@/components/dev/SectionSurfaceDevPanel";
import { siteMeta } from "@/copy/site";

const isDev = process.env.NODE_ENV === "development";

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
  variable: "--font-archivo",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
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
  title: siteMeta.title,
  description: siteMeta.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <body className={`${plexSans.className} min-h-screen flex flex-col bg-background text-foreground font-sans`}>
        {isDev ? <SectionSurfaceDevPanel /> : null}
        <Navbar />
        <main className="flex-1">{children}</main>
        <ContactCtaBand />
        <Footer />
      </body>
    </html>
  );
}
