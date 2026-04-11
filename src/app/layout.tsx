import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "アーキテクチャ・カタ研修",
  description: "新卒エンジニア向けアーキテクチャ・カタ研修アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={cn("font-sans", geist.variable)}>
      <body className="antialiased min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <a href="/" className="text-xl font-bold">
              Architecture Kata
            </a>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
