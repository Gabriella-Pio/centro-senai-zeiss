import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Centro de Excelência em Metrologia | SENAI × ZEISS',
    template: '%s | SENAI × ZEISS',
  },
  description:
    'Serviços de metrologia, digitalização 3D e engenharia para a indústria no Centro de Excelência em Metrologia SENAI × ZEISS.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={cn('h-full', 'antialiased', geistSans.variable, geistMono.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
