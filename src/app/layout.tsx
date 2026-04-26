import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Link from "next/link";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://architecture-kata-public.vercel.app";
const SITE_NAME = "Architecture Kata";
const SITE_DESCRIPTION =
  "ソフトウェアアーキテクチャを実践で学ぶためのグループワーク支援ツール。架空のお題をもとに、チームで要件確認・特性選択・トレードオフ判断を繰り返し練習できます。";
const GITHUB_URL = "https://github.com/tomota53/architecture-kata-public";
const AUTHOR_URL = "https://github.com/tomota53";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - ソフトウェアアーキテクチャを、実践で学ぶ`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "tomota53", url: AUTHOR_URL }],
  creator: "tomota53",
  keywords: [
    "アーキテクチャ",
    "ソフトウェアアーキテクチャ",
    "Architecture Kata",
    "アーキテクチャ・カタ",
    "研修",
    "新卒研修",
    "設計",
    "トレードオフ",
  ],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - ソフトウェアアーキテクチャを、実践で学ぶ`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - ソフトウェアアーキテクチャを、実践で学ぶ`,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={cn("font-sans", geist.variable)}>
      <body className="antialiased min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="1" width="5" height="5" rx="1" fill="white" opacity="0.9" />
                  <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.6" />
                  <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.6" />
                  <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity="0.4" />
                </svg>
              </div>
              <span className="font-semibold text-lg">Architecture Kata</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/learn"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                学ぶ
              </Link>
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub リポジトリ"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.32-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.89-.39.98 0 1.97.13 2.89.39 2.2-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-11.5-11.5z" />
                </svg>
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </nav>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 flex-1">{children}</main>
        <footer className="border-t bg-muted/30 mt-8">
          <div className="container mx-auto px-4 py-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                Made by{" "}
                <a
                  href={AUTHOR_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-foreground transition-colors"
                >
                  tomota53
                </a>
                {" · "}
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-foreground transition-colors"
                >
                  コードを見る
                </a>
                {" · "}
                バグ報告は{" "}
                <a
                  href={`${GITHUB_URL}/issues`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-foreground transition-colors"
                >
                  Issues
                </a>
                {" "}へ
              </div>
              <nav className="flex items-center gap-4 text-sm text-muted-foreground">
                <Link href="/learn" className="hover:text-foreground transition-colors">学ぶ</Link>
                <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
                <Link href="/privacy" className="hover:text-foreground transition-colors">プライバシー</Link>
                <Link href="/terms" className="hover:text-foreground transition-colors">利用規約</Link>
              </nav>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Architecture Kata. Open source under the MIT License.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
