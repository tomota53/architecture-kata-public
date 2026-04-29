"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ShareCodeForm() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const handleSubmit = () => {
    const trimmed = code.trim();
    if (!trimmed) return;
    router.push(`/reports/${trimmed}`);
  };

  return (
    <Card
      className="border-0 shadow-sm"
      style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.03), rgba(99,102,241,0.06))" }}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <span
            className="w-6 h-6 rounded-full text-xs text-white flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)" }}
          >
            📋
          </span>
          レポート一覧を見る
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          共有コードを入力すると、そのコードで提出されたレポートを一覧表示できます。
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="共有コードを入力"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            className="flex-1"
          />
          <Button
            variant="outline"
            disabled={!code.trim()}
            onClick={handleSubmit}
            className="sm:w-auto w-full"
          >
            表示
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
