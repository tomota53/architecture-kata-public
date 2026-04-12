"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

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
    <div className="max-w-md mx-auto mt-16 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">アーキテクチャ・カタ研修</h1>
        <p className="text-muted-foreground">
          グループでアーキテクチャ特性を議論・選択しよう
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ファシリテーター</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            size="lg"
            onClick={() => router.push("/new")}
          >
            セッションを作成する
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>参加者</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="参加コード（6桁）"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            maxLength={6}
            className="text-center text-lg tracking-widest"
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
