"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PrintButton({ joinCode }: { joinCode: string }) {
  return (
    <div className="no-print flex flex-wrap gap-3 justify-center pt-4">
      <Link href={`/join/${joinCode}`}>
        <Button variant="outline">← グループ一覧へ</Button>
      </Link>
      <Button onClick={() => window.print()}>印刷する</Button>
      <Link href="/">
        <Button variant="ghost">トップへ</Button>
      </Link>
    </div>
  );
}
