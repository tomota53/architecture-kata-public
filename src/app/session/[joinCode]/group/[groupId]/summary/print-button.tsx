"use client";

import { Button } from "@/components/ui/button";

export function PrintButton() {
  return (
    <div className="text-center no-print">
      <Button onClick={() => window.print()}>印刷する</Button>
    </div>
  );
}
