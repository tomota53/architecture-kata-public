"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { HeroIllustration } from "@/components/illustrations/HeroIllustration";

export default function Home() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");

  const handleJoin = () => {
    const code = joinCode.trim().toUpperCase();
    if (code.length !== 6) {
      setError("6桁の参加コードを入力してください");
      return;
    }
    setError("");
    router.push(`/join/${code}`);
  };

  return (
    <div className="max-w-md mx-auto mt-8 space-y-8">
      {/* ヒーロー */}
      <div className="text-center space-y-4">
        <HeroIllustration className="w-full max-w-sm mx-auto" />
        <h1 className="text-3xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #1e1b4b, #6366f1)" }}>
          Architecture Kata
        </h1>
        <p className="text-muted-foreground text-sm">
          グループでアーキテクチャ特性を議論・選択しよう
        </p>
      </div>

      <Card className="shadow-md border-0" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.03), rgba(139,92,246,0.06))" }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="w-6 h-6 rounded-full text-xs text-white flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>F</span>
            ファシリテーター
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full text-white"
            size="lg"
            onClick={() => router.push("/new")}
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            セッションを作成する
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-md border-0" style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.03), rgba(99,102,241,0.06))" }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="w-6 h-6 rounded-full text-xs text-white flex items-center justify-center" style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)" }}>P</span>
            参加者
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="参加コード（6桁）"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            maxLength={6}
            className="text-center text-lg tracking-widest font-mono"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            className="w-full"
            size="lg"
            variant="outline"
            onClick={handleJoin}
          >
            参加する
          </Button>
        </CardContent>
      </Card>

      <div className="text-center">
        <Link
          href="/about"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          このアプリについて &rarr;
        </Link>
      </div>
    </div>
  );
}
