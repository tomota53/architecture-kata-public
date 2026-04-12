"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  createSession,
  getKataProblems,
  createKataProblem,
  updateKataProblem,
  deleteKataProblem,
} from "@/app/actions";

type KataProblem = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  is_preset: boolean;
};

const difficultyLabel: Record<string, string> = {
  easy: "初級",
  medium: "中級",
  hard: "上級",
};

type Mode = "preset" | "custom";

export default function NewSessionPage() {
  const router = useRouter();
  const [problems, setProblems] = useState<KataProblem[]>([]);
  const [selectedProblemId, setSelectedProblemId] = useState("");
  const [groupCount, setGroupCount] = useState("4");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // お題選択モード
  const [mode, setMode] = useState<Mode>("preset");

  // カスタムお題（直接入力）
  const [customTitle, setCustomTitle] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [customDifficulty, setCustomDifficulty] = useState("medium");

  // カスタムお題編集
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDifficulty, setEditDifficulty] = useState("medium");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getKataProblems().then(setProblems);
  }, []);

  const refreshProblems = async () => {
    const updated = await getKataProblems();
    setProblems(updated);
  };

  const startEditing = (p: KataProblem) => {
    setEditingId(p.id);
    setEditTitle(p.title);
    setEditDescription(p.description);
    setEditDifficulty(p.difficulty);
  };

  const handleUpdate = async () => {
    if (!editingId || !editTitle.trim() || !editDescription.trim()) return;
    setSaving(true);

    const result = await updateKataProblem(editingId, {
      title: editTitle.trim(),
      description: editDescription.trim(),
      difficulty: editDifficulty,
    });

    if (result.error) {
      setError(result.error);
      setSaving(false);
      return;
    }

    await refreshProblems();
    setEditingId(null);
    setSaving(false);
  };

  const handleDelete = async (problemId: string) => {
    if (!confirm("このお題を削除しますか？")) return;

    const result = await deleteKataProblem(problemId);
    if (result.error) {
      setError(result.error);
      return;
    }

    if (selectedProblemId === problemId) setSelectedProblemId("");
    await refreshProblems();
  };

  const canSubmit =
    mode === "preset"
      ? !!selectedProblemId
      : customTitle.trim() !== "" && customDescription.trim() !== "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    let problemId = selectedProblemId;

    // カスタムモードの場合はお題を先に作成
    if (mode === "custom") {
      const result = await createKataProblem({
        title: customTitle.trim(),
        description: customDescription.trim(),
        difficulty: customDifficulty,
      });

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
      problemId = result.problemId!;
    }

    const formData = new FormData(e.currentTarget);
    formData.set("kataProblemId", problemId);
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

            {/* お題選択モード切替 */}
            <div className="space-y-3">
              <Label>お題</Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setMode("preset"); setEditingId(null); }}
                  className={`flex-1 py-2 text-sm font-medium rounded-md border transition-all ${
                    mode === "preset"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  一覧から選ぶ
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("custom"); setEditingId(null); }}
                  className={`flex-1 py-2 text-sm font-medium rounded-md border transition-all ${
                    mode === "custom"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  独自のお題を作成
                </button>
              </div>

              {mode === "preset" ? (
                <div className="space-y-2">
                  {problems.map((p) => (
                    <div key={p.id}>
                      {editingId === p.id ? (
                        <div className="space-y-3 p-3 border-2 border-primary rounded-lg">
                          <div className="space-y-1">
                            <Label className="text-xs">タイトル</Label>
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">説明</Label>
                            <Textarea
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              rows={4}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">難易度</Label>
                            <select
                              value={editDifficulty}
                              onChange={(e) => setEditDifficulty(e.target.value)}
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                              <option value="easy">初級</option>
                              <option value="medium">中級</option>
                              <option value="hard">上級</option>
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              size="sm"
                              disabled={saving || !editTitle.trim() || !editDescription.trim()}
                              onClick={handleUpdate}
                            >
                              {saving ? "保存中..." : "保存"}
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingId(null)}
                            >
                              キャンセル
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => setSelectedProblemId(p.id)}
                          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelectedProblemId(p.id); }}
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
                            <span className="font-medium text-sm flex-1">
                              {p.title}
                            </span>
                            {!p.is_preset && (
                              <Badge variant="secondary" className="text-xs shrink-0">
                                カスタム
                              </Badge>
                            )}
                          </div>
                          {selectedProblemId === p.id && (
                            <div className="mt-2">
                              <p className="text-sm text-muted-foreground">
                                {p.description}
                              </p>
                              {!p.is_preset && (
                                <div className="flex gap-2 mt-2">
                                  <button
                                    type="button"
                                    className="text-xs text-primary hover:underline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      startEditing(p);
                                    }}
                                  >
                                    編集
                                  </button>
                                  <button
                                    type="button"
                                    className="text-xs text-destructive hover:underline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(p.id);
                                    }}
                                  >
                                    削除
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">お題タイトル</Label>
                    <Input
                      placeholder="例：社内チャットシステム"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">お題の説明</Label>
                    <Textarea
                      placeholder="システムの背景・制約・要件を記述してください..."
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">難易度</Label>
                    <select
                      value={customDifficulty}
                      onChange={(e) => setCustomDifficulty(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="easy">初級</option>
                      <option value="medium">中級</option>
                      <option value="hard">上級</option>
                    </select>
                  </div>
                </div>
              )}
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
