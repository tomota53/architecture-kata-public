"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PrintButton({ shareCode }: { shareCode?: string | null }) {
  return (
    <div className="no-print flex flex-wrap gap-3 justify-center pt-4">
      <Button onClick={() => window.print()}>印刷する</Button>
      {shareCode && (
        <Link href={`/reports/${shareCode}`}>
          <Button variant="outline">レポート一覧へ</Button>
        </Link>
      )}
      <Link href="/">
        <Button variant="ghost">トップへ</Button>
      </Link>
    </div>
  );
}
