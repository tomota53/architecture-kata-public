"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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

  const canSubmit = !!selectedProblemId;

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

            <div className="space-y-3">
              <Label>お題</Label>
              <div className="space-y-2">
                {problems.map((p) => (
                  <div
                    key={p.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedProblemId(p.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setSelectedProblemId(p.id);
                    }}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedProblemId === p.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs shrink-0">
                        {difficultyLabel[p.difficulty]}
                      </Badge>
                      <span className="font-medium text-sm flex-1">{p.title}</span>
                    </div>
                    {selectedProblemId === p.id && (
                      <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="groupCount">グループ数</Label>
              <select
                id="groupCount"
                value={groupCount}
                onChange={(e) => setGroupCount(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {[2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={String(n)}>
                    {n}グループ
                  </option>
                ))}
              </select>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading || !canSubmit}
            >
              {loading ? "作成中..." : "作成する"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
