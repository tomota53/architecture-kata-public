"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ARCH_CHARACTERISTICS } from "@/lib/characteristics";
import { ARCH_COMPONENTS, COMPONENT_CATEGORIES } from "@/lib/components-master";
import { ComponentSelector } from "@/components/ComponentSelector";
import { RequirementsEditor, type Requirement } from "@/components/RequirementsEditor";
import {
  getSessionByJoinCode,
  getGroupById,
  getKataProblemById,
  updateMemberNames,
  submitSelections,
} from "@/app/actions";

type SessionInfo = {
  id: string;
  title: string;
  join_code: string;
  status: string;
  kata_problem_id: string;
};

type GroupInfo = {
  id: string;
  name: string;
  member_names: string[] | null;
  session_id: string;
};

type ProblemInfo = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
};

export default function ParticipantWorkPage() {
  const params = useParams();
  const router = useRouter();
  const joinCode = params.joinCode as string;
  const groupId = params.groupId as string;

  const [step, setStep] = useState(1);
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [group, setGroup] = useState<GroupInfo | null>(null);
  const [problem, setProblem] = useState<ProblemInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Step 1: メンバー名
  const [memberNames, setMemberNames] = useState<string[]>(["", "", "", "", ""]);

  // Step 2: 要件確認
  const [requirements, setRequirements] = useState<Requirement[]>([]);

  // Step 3: 特性選択（選択順を保持）
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Step 4: 理由・トレードオフ
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [tradeoffs, setTradeoffs] = useState<string[]>([]);
  const [tradeoffReasons, setTradeoffReasons] = useState<Record<string, string>>({});
  const [discussionMemo, setDiscussionMemo] = useState("");

  // Step 5: コンポーネント選択
  const [componentIds, setComponentIds] = useState<string[]>([]);
  const [componentReason, setComponentReason] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const s = await getSessionByJoinCode(joinCode);
      if (!s) {
        setLoading(false);
        return;
      }
      setSession(s);

      const [g, p] = await Promise.all([
        getGroupById(groupId),
        getKataProblemById(s.kata_problem_id),
      ]);
      setGroup(g);
      setProblem(p);
      if (g?.member_names && g.member_names.length > 0) {
        const padded = [...g.member_names, ...Array(5).fill("")].slice(0, 5);
        setMemberNames(padded);
      }
      setLoading(false);
    }
    load();
  }, [joinCode, groupId]);

  if (loading) {
    return <div className="max-w-2xl mx-auto mt-16 text-center text-muted-foreground">読み込み中...</div>;
  }

  if (!session || !group || !problem) {
    return (
      <div className="max-w-md mx-auto mt-16 text-center space-y-4">
        <h1 className="text-2xl font-bold">セッションが見つかりません</h1>
        <a href="/" className="text-primary underline">トップに戻る</a>
      </div>
    );
  }

  const filledMembers = memberNames.filter((n) => n.trim() !== "");

  // Step 3: カード選択ハンドラ
  const toggleCharacteristic = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  // Step 4: トレードオフ選択ハンドラ
  const toggleTradeoff = (id: string) => {
    setTradeoffs((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  };

  // Step 5: コンポーネント選択ハンドラ
  const toggleComponent = (id: string) => {
    setComponentIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Step 2 → 3 遷移: 要件確認スキップ判定
  const handleRequirementsNext = () => {
    const filledReqs = requirements.filter((r) => r.question.trim() !== "");
    if (filledReqs.length === 0) {
      if (!confirm("要件確認をスキップしますか？スキップしても次のステップに進めます。")) return;
    }
    setStep(3);
  };

  // 提出処理
  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    const filledReqs = requirements.filter((r) => r.question.trim() !== "");

    const result = await submitSelections({
      groupId: group.id,
      sessionId: session.id,
      choice1: selectedIds[0] || "",
      choice1Reason: reasons[selectedIds[0]] || "",
      choice2: selectedIds[1] || "",
      choice2Reason: reasons[selectedIds[1]] || "",
      choice3: selectedIds[2] || "",
      choice3Reason: reasons[selectedIds[2]] || "",
      tradeoff1: tradeoffs[0] || "",
      tradeoff1Reason: tradeoffReasons[tradeoffs[0]] || "",
      tradeoff2: tradeoffs[1] || "",
      tradeoff2Reason: tradeoffReasons[tradeoffs[1]] || "",
      discussionMemo,
      componentIds,
      componentReason,
      requirements: filledReqs,
    });

    if (result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    router.push(`/session/${joinCode}/group/${groupId}/summary`);
  };

  const getCharName = (id: string) =>
    ARCH_CHARACTERISTICS.find((c) => c.id === id)?.name ?? id;

  // ステップインジケーター
  const StepIndicator = () => (
    <div className="flex justify-center gap-2 mb-6">
      {[1, 2, 3, 4, 5, 6].map((s) => (
        <div
          key={s}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            s === step
              ? "bg-primary text-primary-foreground"
              : s < step
                ? "bg-primary/20 text-primary"
                : "bg-muted text-muted-foreground"
          }`}
        >
          {s}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <p className="text-sm text-muted-foreground">{session.title}</p>
        <h1 className="text-xl font-bold">{group.name}</h1>
      </div>

      <StepIndicator />

      {/* お題表示（全ステップ共通） */}
      <div className="p-3 bg-muted rounded-md">
        <p className="text-sm font-semibold">{problem.title}</p>
        <p className="text-sm text-muted-foreground mt-1">{problem.description}</p>
      </div>

      {/* ===== Step 1: メンバー名入力 ===== */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: グループ参加</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>メンバー名（最大5人）</Label>
              {memberNames.map((name, i) => (
                <Input
                  key={i}
                  placeholder={`メンバー${i + 1}`}
                  value={name}
                  onChange={(e) => {
                    const next = [...memberNames];
                    next[i] = e.target.value;
                    setMemberNames(next);
                  }}
                />
              ))}
            </div>

            <Button
              className="w-full"
              size="lg"
              disabled={filledMembers.length === 0}
              onClick={async () => {
                await updateMemberNames(group.id, filledMembers);
                setStep(2);
              }}
            >
              ワークを始める
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ===== Step 2: 要件確認 ===== */}
      {step === 2 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Step 2: お題に対して確認したいことを整理しましょう</CardTitle>
            </CardHeader>
            <CardContent>
              <RequirementsEditor
                value={requirements}
                onChange={setRequirements}
              />
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)}>
              戻る
            </Button>
            <Button
              className="flex-1"
              size="lg"
              onClick={handleRequirementsNext}
            >
              次へ（特性選択）
            </Button>
          </div>
        </div>
      )}

      {/* ===== Step 3: 特性カード選択 ===== */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: 重要な特性を3つ選ぼう</CardTitle>
            <p className="text-sm text-muted-foreground">
              選んだ順に1位・2位・3位が決まります（{selectedIds.length}/3 選択中）
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ARCH_CHARACTERISTICS.map((c) => {
                const index = selectedIds.indexOf(c.id);
                const isSelected = index !== -1;
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleCharacteristic(c.id)}
                    className={`relative p-4 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {isSelected && (
                      <Badge className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center p-0 text-xs">
                        {index + 1}
                      </Badge>
                    )}
                    <p className="font-medium text-sm">{c.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{c.description}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)}>
                戻る
              </Button>
              <Button
                className="flex-1"
                size="lg"
                disabled={selectedIds.length === 0}
                onClick={() => setStep(4)}
              >
                次へ（理由入力）
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ===== Step 4: 理由・トレードオフ入力 ===== */}
      {step === 4 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Step 4: 選んだ理由を書こう</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedIds.map((id, i) => (
                <div key={id} className="space-y-2">
                  <Label>
                    {i + 1}位: {getCharName(id)}
                  </Label>
                  <Textarea
                    placeholder="この特性を選んだ理由..."
                    value={reasons[id] || ""}
                    onChange={(e) =>
                      setReasons((prev) => ({ ...prev, [id]: e.target.value }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>あえて捨てた特性（最大2つ）</CardTitle>
              <p className="text-sm text-muted-foreground">
                選ばなかった特性から、意識的に捨てたものを選んでください
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ARCH_CHARACTERISTICS.filter((c) => !selectedIds.includes(c.id)).map(
                  (c) => {
                    const isTradeoff = tradeoffs.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => toggleTradeoff(c.id)}
                        className={`p-3 rounded-lg border text-left text-sm transition-all ${
                          isTradeoff
                            ? "border-destructive bg-destructive/5"
                            : "border-border hover:border-destructive/50"
                        }`}
                      >
                        {c.name}
                      </button>
                    );
                  }
                )}
              </div>

              {tradeoffs.map((id) => (
                <div key={id} className="space-y-2">
                  <Label>捨てた理由: {getCharName(id)}</Label>
                  <Textarea
                    placeholder="この特性を捨てた理由..."
                    value={tradeoffReasons[id] || ""}
                    onChange={(e) =>
                      setTradeoffReasons((prev) => ({
                        ...prev,
                        [id]: e.target.value,
                      }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>グループで一番議論になったこと</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="自由に記述してください..."
                value={discussionMemo}
                onChange={(e) => setDiscussionMemo(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(3)}>
              戻る
            </Button>
            <Button className="flex-1" size="lg" onClick={() => setStep(5)}>
              次へ（コンポーネント選択）
            </Button>
          </div>
        </div>
      )}

      {/* ===== Step 5: コンポーネント選択 ===== */}
      {step === 5 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Step 5: システム構成コンポーネントを選ぼう</CardTitle>
              <p className="text-sm text-muted-foreground">
                このシステムに必要なコンポーネントを選んでください（複数選択可）
              </p>
            </CardHeader>
            <CardContent>
              <ComponentSelector
                selectedIds={componentIds}
                onToggle={toggleComponent}
                reason={componentReason}
                onReasonChange={setComponentReason}
              />
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(4)}>
              戻る
            </Button>
            <Button
              className="flex-1"
              size="lg"
              disabled={componentIds.length === 0}
              onClick={() => setStep(6)}
            >
              確認画面へ
            </Button>
          </div>
        </div>
      )}

      {/* ===== Step 6: 確認・提出 ===== */}
      {step === 6 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Step 6: 入力内容の確認</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* メンバー */}
              <div>
                <p className="text-sm font-semibold text-muted-foreground">メンバー</p>
                <p>{filledMembers.join("、")}</p>
              </div>

              <Separator />

              {/* 要件確認 */}
              {requirements.filter((r) => r.question.trim()).length > 0 && (
                <>
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-muted-foreground">確認した要件</p>
                    {requirements
                      .filter((r) => r.question.trim())
                      .map((r, i) => (
                        <div key={r.id} className="pl-3 border-l-2 border-blue-400">
                          <p className="text-sm font-medium">Q{i + 1}. {r.question}</p>
                          {r.answer && (
                            <p className="text-sm text-muted-foreground">A{i + 1}. {r.answer}</p>
                          )}
                        </div>
                      ))}
                  </div>
                  <Separator />
                </>
              )}

              {/* 選んだ特性 */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-muted-foreground">選んだ特性</p>
                {selectedIds.map((id, i) => (
                  <div key={id} className="pl-3 border-l-2 border-primary">
                    <p className="font-medium">
                      {i + 1}位: {getCharName(id)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {reasons[id] || "（理由なし）"}
                    </p>
                  </div>
                ))}
              </div>

              <Separator />

              {/* 捨てた特性 */}
              {tradeoffs.length > 0 && (
                <>
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-muted-foreground">
                      捨てた特性
                    </p>
                    {tradeoffs.map((id) => (
                      <div key={id} className="pl-3 border-l-2 border-destructive">
                        <p className="font-medium">{getCharName(id)}</p>
                        <p className="text-sm text-muted-foreground">
                          {tradeoffReasons[id] || "（理由なし）"}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Separator />
                </>
              )}

              {/* 議論メモ */}
              {discussionMemo && (
                <>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">
                      議論になったこと
                    </p>
                    <p className="text-sm whitespace-pre-wrap">{discussionMemo}</p>
                  </div>
                  <Separator />
                </>
              )}

              {/* コンポーネント */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-muted-foreground">
                  システム構成コンポーネント
                </p>
                {COMPONENT_CATEGORIES.map((cat) => {
                  const selected = componentIds
                    .map((id) => ARCH_COMPONENTS.find((c) => c.id === id))
                    .filter((c) => c && c.category === cat.id);
                  if (selected.length === 0) return null;
                  return (
                    <div key={cat.id}>
                      <p className="text-xs font-medium text-muted-foreground">
                        {cat.label}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {selected.map((c) => (
                          <Badge key={c!.id} variant="secondary" className="text-xs">
                            {c!.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {componentReason && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-muted-foreground">理由</p>
                    <p className="text-sm whitespace-pre-wrap">{componentReason}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {error && <p className="text-sm text-destructive text-center">{error}</p>}

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(5)}>
              戻る
            </Button>
            <Button
              className="flex-1"
              size="lg"
              disabled={submitting}
              onClick={handleSubmit}
            >
              {submitting ? "提出中..." : "提出する"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
