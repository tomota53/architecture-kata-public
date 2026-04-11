"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSession, getKataProblems } from "@/app/actions";

type KataProblem = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
};

const difficultyLabel: Record<string, string> = {
  easy: "初級",
  medium: "中級",
  hard: "上級",
};

export default function NewSessionPage() {
  const router = useRouter();
  const [problems, setProblems] = useState<KataProblem[]>([]);
  const [selectedProblemId, setSelectedProblemId] = useState("");
  const [groupCount, setGroupCount] = useState("4");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getKataProblems().then(setProblems);
  }, []);

  const selectedProblem = problems.find((p) => p.id === selectedProblemId);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.set("kataProblemId", selectedProblemId);
    formData.set("groupCount", groupCount);

    const result = await createSession(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push(`/facilitator/${result.sessionId}`);
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold">セッション作成</h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>セッション情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">セッション名</Label>
              <Input
                id="title"
                name="title"
                placeholder="例：2024年度新卒研修"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>お題を選択</Label>
              <Select
                value={selectedProblemId}
                onValueChange={(v) => setSelectedProblemId(v ?? "")}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="お題を選んでください" />
                </SelectTrigger>
                <SelectContent>
                  {problems.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      [{difficultyLabel[p.difficulty]}] {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedProblem && (
                <p className="text-sm text-muted-foreground mt-2 p-3 bg-muted rounded-md">
                  {selectedProblem.description}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>グループ数</Label>
              <Select value={groupCount} onValueChange={(v) => setGroupCount(v ?? "4")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2, 3, 4, 5, 6].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}グループ
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading || !selectedProblemId}
            >
              {loading ? "作成中..." : "作成する"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
