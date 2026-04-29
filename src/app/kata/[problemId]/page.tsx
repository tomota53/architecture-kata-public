"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ARCH_CHARACTERISTICS } from "@/lib/characteristics";
import { ARCH_COMPONENTS, COMPONENT_CATEGORIES } from "@/lib/components-master";
import { ComponentSelector } from "@/components/ComponentSelector";
import { RequirementsEditor, type Requirement } from "@/components/RequirementsEditor";
import { CharacteristicsIllustration } from "@/components/illustrations/CharacteristicsIllustration";
import { SystemIllustration } from "@/components/illustrations/SystemIllustration";
import { RequirementsIllustration } from "@/components/illustrations/RequirementsIllustration";
import { TradeoffIllustration } from "@/components/illustrations/TradeoffIllustration";
import { getKataProblemById, saveDraft, submitReport, generateShareCode, getDraftById } from "@/app/actions";

type ProblemInfo = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
};

function ReportSection({
  number,
  title,
  subtitle,
  children,
}: {
  number: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl bg-card border shadow-sm p-6 space-y-4">
      <div className="flex items-baseline gap-3 pb-3 border-b">
        <span
          className="text-3xl font-bold bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
        >
          {number}
        </span>
        <div>
          <h3 className="text-lg font-bold leading-tight">{title}</h3>
          <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
            {subtitle}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function KataWorkPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const problemId = params.problemId as string;
  const draftId = searchParams.get("draft");

  const [step, setStep] = useState(1);
  const [problem, setProblem] = useState<ProblemInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportId, setReportId] = useState<string | null>(draftId);
  const [saving, setSaving] = useState(false);

  // Step 1
  const [userName, setUserName] = useState("");
  const [shareCode, setShareCode] = useState("");

  // Step 2
  const [requirements, setRequirements] = useState<Requirement[]>([]);

  // Step 3
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Step 4
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [tradeoffs, setTradeoffs] = useState<string[]>([]);
  const [tradeoffReasons, setTradeoffReasons] = useState<Record<string, string>>({});
  const [discussionMemo, setDiscussionMemo] = useState("");

  // Step 5
  const [componentIds, setComponentIds] = useState<string[]>([]);
  const [componentReason, setComponentReason] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  // 現在の入力をDBに保存
  const save = useCallback(async (nextStep: number) => {
    setSaving(true);
    try {
      const result = await saveDraft({
        reportId: reportId ?? undefined,
        kataProblemId: problemId,
        userName,
        shareCode: shareCode.trim() || null,
        step: nextStep,
        requirements: requirements.filter((r) => r.question.trim() !== ""),
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
      });

      if (result.error) {
        setError(result.error);
        setSaving(false);
        return false;
      }

      setLastSavedAt(new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }));

      if (result.id && !reportId) {
        setReportId(result.id);
        window.history.replaceState(null, "", `/kata/${problemId}?draft=${result.id}`);
      }

      setSaving(false);
      return true;
    } catch {
      setError("保存中にエラーが発生しました。");
      setSaving(false);
      return false;
    }
  }, [reportId, problemId, userName, shareCode, requirements, selectedIds, reasons, tradeoffs, tradeoffReasons, discussionMemo, componentIds, componentReason]);

  // 手動保存
  const handleSave = async () => {
    setError("");
    setSaved(false);
    const ok = await save(step);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  // ステップ遷移(保存してから移動)
  const goToStep = async (nextStep: number) => {
    setSaved(false);
    setError("");
    const ok = await save(nextStep);
    if (ok) setStep(nextStep);
  };

  // 初期ロード
  useEffect(() => {
    async function load() {
      const p = await getKataProblemById(problemId);
      setProblem(p);

      // 下書き復元
      if (draftId && p) {
        const draft = await getDraftById(draftId);
        if (draft) {
          setUserName(draft.user_name ?? "");
          setShareCode(draft.share_code ?? "");
          setRequirements(
            (draft.requirements as Requirement[] | null) ?? []
          );
          const c1 = draft.choice_1 as string | null;
          const c2 = draft.choice_2 as string | null;
          const c3 = draft.choice_3 as string | null;
          setSelectedIds([c1, c2, c3].filter(Boolean) as string[]);
          const r: Record<string, string> = {};
          if (c1 && draft.choice_1_reason) r[c1] = draft.choice_1_reason as string;
          if (c2 && draft.choice_2_reason) r[c2] = draft.choice_2_reason as string;
          if (c3 && draft.choice_3_reason) r[c3] = draft.choice_3_reason as string;
          setReasons(r);
          const t1 = draft.tradeoff_1 as string | null;
          const t2 = draft.tradeoff_2 as string | null;
          setTradeoffs([t1, t2].filter(Boolean) as string[]);
          const tr: Record<string, string> = {};
          if (t1 && draft.tradeoff_1_reason) tr[t1] = draft.tradeoff_1_reason as string;
          if (t2 && draft.tradeoff_2_reason) tr[t2] = draft.tradeoff_2_reason as string;
          setTradeoffReasons(tr);
          setDiscussionMemo((draft.discussion_memo as string) ?? "");
          setComponentIds((draft.component_ids as string[] | null) ?? []);
          setComponentReason((draft.component_reason as string) ?? "");
          // 最低でも Step 1 は完了しているので Step 2 以降から再開
          setStep(2);
          setReportId(draftId);
        }
      }

      setLoading(false);
    }
    load();
  }, [problemId, draftId]);

  if (loading) {
    return <div className="max-w-2xl mx-auto mt-16 text-center text-muted-foreground">読み込み中...</div>;
  }

  if (!problem) {
    return (
      <div className="max-w-md mx-auto mt-16 text-center space-y-4">
        <h1 className="text-2xl font-bold">お題が見つかりません</h1>
        <a href="/" className="text-primary underline">トップに戻る</a>
      </div>
    );
  }

  const toggleCharacteristic = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const toggleTradeoff = (id: string) => {
    setTradeoffs((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  };

  const toggleComponent = (id: string) => {
    setComponentIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleRequirementsNext = () => {
    const filledReqs = requirements.filter((r) => r.question.trim() !== "");
    if (filledReqs.length === 0) {
      if (!confirm("要件確認をスキップしますか？スキップしても次のステップに進めます。")) return;
    }
    goToStep(3);
  };

  // 提出処理
  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    try {
      // 最終保存
      const saveOk = await save(6);
      if (!saveOk) {
        setSubmitting(false);
        return;
      }

      const currentReportId = reportId;
      if (!currentReportId) {
        setError("レポートIDが取得できませんでした。もう一度お試しください。");
        setSubmitting(false);
        return;
      }

      const result = await submitReport(currentReportId);

      if (result.error) {
        setError(result.error);
        setSubmitting(false);
        return;
      }

      router.push(`/report/${currentReportId}`);
    } catch (e) {
      setError(`通信エラーが発生しました: ${e instanceof Error ? e.message : "ネットワーク接続を確認してください"}`);
      setSubmitting(false);
    }
  };

  const getCharName = (id: string) =>
    ARCH_CHARACTERISTICS.find((c) => c.id === id)?.name ?? id;

  const stepLabels = ["名前", "要件", "特性", "理由", "構成", "確認"];
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-1 mb-6">
      {[1, 2, 3, 4, 5, 6].map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                s === step
                  ? "text-white shadow-md"
                  : s < step
                    ? "text-white/90"
                    : "bg-muted text-muted-foreground"
              }`}
              style={
                s === step
                  ? { background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }
                  : s < step
                    ? { background: "linear-gradient(135deg, #6366f1, #8b5cf6)", opacity: 0.5 }
                    : undefined
              }
            >
              {s < step ? "✓" : s}
            </div>
            <span className={`text-[10px] ${s === step ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              {stepLabels[i]}
            </span>
          </div>
          {i < 5 && (
            <div className={`w-4 h-px mx-0.5 mb-4 ${s < step ? "bg-primary/40" : "bg-border"}`} />
          )}
        </div>
      ))}
      {saving && <span className="text-xs text-muted-foreground ml-2 mb-4">保存中...</span>}
      {!saving && lastSavedAt && <span className="text-xs text-muted-foreground ml-2 mb-4">✓ {lastSavedAt} に保存</span>}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-xl font-bold">{problem.title}</h1>
      </div>

      <StepIndicator />

      <div className="p-3 bg-muted rounded-md">
        <p className="text-sm font-semibold">{problem.title}</p>
        <p className="text-sm text-muted-foreground mt-1">{problem.description}</p>
      </div>

      {/* ===== Step 1: 名前 + 共有コード ===== */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: あなたの情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName">名前（ニックネーム可）</Label>
              <Input
                id="userName"
                placeholder="例: タロウ"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shareCode">共有コード（任意）</Label>
              <div className="flex gap-2">
                <Input
                  id="shareCode"
                  placeholder="例: X7K9-M2PF"
                  value={shareCode}
                  onChange={(e) => setShareCode(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    const result = await generateShareCode();
                    if (result.code) setShareCode(result.code);
                  }}
                >
                  自動生成
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                研修担当者から共有コードを受け取っている場合はそれを入力してください。
                新しく発行する場合は「自動生成」を押してください。管理者がレポートを一覧で確認できるようになります。
              </p>
            </div>

            {!userName.trim() && (
              <p className="text-xs text-muted-foreground">名前を入力するとワークを開始できます。</p>
            )}
            <Button
              className="w-full"
              size="lg"
              disabled={!userName.trim() || saving}
              onClick={() => goToStep(2)}
            >
              {saving ? "保存中..." : "ワークを始める"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 再開用URL案内(Step 2以降で表示) */}
      {step >= 2 && reportId && (
        <div
          className="rounded-xl border px-4 py-3 text-xs text-muted-foreground leading-relaxed"
          style={{ backgroundColor: "oklch(0.98 0.02 250)", borderColor: "oklch(0.9 0.04 250)" }}
        >
          <p className="font-medium text-foreground mb-1">💾 途中保存されています</p>
          <p className="mb-2">
            このURLをブックマークしておくと、途中から再開できます。
          </p>
          <div className="flex items-center gap-2">
            <code className="text-xs bg-background rounded px-2 py-1 flex-1 truncate border">
              {typeof window !== "undefined" ? window.location.href : `/kata/${problemId}?draft=${reportId}`}
            </code>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 text-xs"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("URLをコピーしました");
              }}
            >
              コピー
            </Button>
          </div>
        </div>
      )}

      {/* ===== Step 2: 要件確認 ===== */}
      {step === 2 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <RequirementsIllustration className="w-full max-w-xs mx-auto mb-2" />
              <CardTitle>Step 2: お題に対して確認したいことを整理しましょう</CardTitle>
            </CardHeader>
            <CardContent>
              <RequirementsEditor value={requirements} onChange={setRequirements} />
            </CardContent>
          </Card>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => goToStep(1)}>戻る</Button>
            <Button variant="outline" disabled={saving} onClick={handleSave}>
              {saving ? "保存中..." : saved ? "✓ 保存済み" : "保存"}
            </Button>
            <Button className="flex-1" size="lg" disabled={saving} onClick={handleRequirementsNext}>
              {saving ? "保存中..." : "次へ（特性選択）"}
            </Button>
          </div>
        </div>
      )}

      {/* ===== Step 3: 特性カード選択 ===== */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CharacteristicsIllustration className="w-full max-w-xs mx-auto mb-2" />
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
            {selectedIds.length < 3 && (
              <p className="text-xs text-muted-foreground text-center">
                あと{3 - selectedIds.length}つ選んでください
              </p>
            )}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => goToStep(2)}>戻る</Button>
              <Button variant="outline" disabled={saving} onClick={handleSave}>
                {saving ? "保存中..." : saved ? "✓ 保存済み" : "保存"}
              </Button>
              <Button
                className="flex-1"
                size="lg"
                disabled={selectedIds.length === 0 || saving}
                onClick={() => goToStep(4)}
              >
                {saving ? "保存中..." : "次へ（理由入力）"}
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
              <TradeoffIllustration className="w-full max-w-xs mx-auto mb-2" />
              <CardTitle>Step 4: 選んだ理由を書こう</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedIds.map((id, i) => (
                <div key={id} className="space-y-2">
                  <Label>{i + 1}位: {getCharName(id)}</Label>
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
                {ARCH_CHARACTERISTICS.filter((c) => !selectedIds.includes(c.id)).map((c) => {
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
                })}
              </div>
              {tradeoffs.map((id) => (
                <div key={id} className="space-y-2">
                  <Label>捨てた理由: {getCharName(id)}</Label>
                  <Textarea
                    placeholder="この特性を捨てた理由..."
                    value={tradeoffReasons[id] || ""}
                    onChange={(e) =>
                      setTradeoffReasons((prev) => ({ ...prev, [id]: e.target.value }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>振り返りメモ</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="判断に迷ったこと、気づいたことなどを自由に記述してください..."
                value={discussionMemo}
                onChange={(e) => setDiscussionMemo(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => goToStep(3)}>戻る</Button>
            <Button variant="outline" disabled={saving} onClick={handleSave}>
              {saving ? "保存中..." : saved ? "✓ 保存済み" : "保存"}
            </Button>
            <Button className="flex-1" size="lg" disabled={saving} onClick={() => goToStep(5)}>
              {saving ? "保存中..." : "次へ（コンポーネント選択）"}
            </Button>
          </div>
        </div>
      )}

      {/* ===== Step 5: コンポーネント選択 ===== */}
      {step === 5 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <SystemIllustration className="w-full max-w-xs mx-auto mb-2" />
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
            <Button variant="outline" onClick={() => goToStep(4)}>戻る</Button>
            <Button variant="outline" disabled={saving} onClick={handleSave}>
              {saving ? "保存中..." : saved ? "✓ 保存済み" : "保存"}
            </Button>
            <Button
              className="flex-1"
              size="lg"
              disabled={componentIds.length === 0 || saving}
              onClick={() => goToStep(6)}
            >
              {saving ? "保存中..." : "確認画面へ"}
            </Button>
          </div>
        </div>
      )}

      {/* ===== Step 6: 確認・提出 ===== */}
      {step === 6 && (
        <div className="space-y-6">
          <div
            className="rounded-xl p-6 space-y-3 text-center"
            style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.1))" }}
          >
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              Architecture Design Report
            </p>
            <h2
              className="text-2xl font-bold bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #1e1b4b, #6366f1)" }}
            >
              {userName} の設計レポート
            </h2>
            <p className="text-sm text-muted-foreground">{problem.title}</p>
            {shareCode.trim() && (
              <p className="text-xs text-muted-foreground">共有コード: {shareCode.trim()}</p>
            )}
          </div>

          {requirements.filter((r) => r.question.trim()).length > 0 && (
            <ReportSection number="01" title="確認した要件" subtitle="REQUIREMENTS">
              <div className="space-y-4">
                {requirements.filter((r) => r.question.trim()).map((r, i) => (
                  <div key={r.id} className="rounded-lg p-4 bg-muted/50 border-l-4" style={{ borderLeftColor: "#6366f1" }}>
                    <p className="text-sm font-semibold mb-1">
                      <span className="text-primary mr-2">Q{i + 1}.</span>{r.question}
                    </p>
                    {r.answer && (
                      <p className="text-sm text-muted-foreground pl-6">
                        <span className="text-muted-foreground mr-2">A.</span>{r.answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </ReportSection>
          )}

          <ReportSection number="02" title="選んだアーキテクチャ特性" subtitle="CHARACTERISTICS">
            <div className="space-y-3">
              {selectedIds.map((id, i) => (
                <div key={id} className="rounded-lg p-4 border-l-4 bg-muted/50" style={{ borderLeftColor: "#6366f1" }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0"
                      style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                    >
                      {i + 1}
                    </div>
                    <h4 className="font-bold text-base">{getCharName(id)}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-12">
                    {reasons[id] || "（理由未入力）"}
                  </p>
                </div>
              ))}
            </div>
          </ReportSection>

          {tradeoffs.length > 0 && (
            <ReportSection number="03" title="あえて捨てた特性" subtitle="TRADE-OFFS">
              <div className="space-y-3">
                {tradeoffs.map((id) => (
                  <div key={id} className="rounded-lg p-4 border-l-4 bg-muted/50" style={{ borderLeftColor: "#f43f5e" }}>
                    <h4 className="font-bold text-base mb-2 text-destructive">✕ {getCharName(id)}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tradeoffReasons[id] || "（理由未入力）"}
                    </p>
                  </div>
                ))}
              </div>
            </ReportSection>
          )}

          {discussionMemo && (
            <ReportSection number="04" title="振り返りメモ" subtitle="REFLECTION">
              <div className="rounded-lg p-4 bg-muted/50 border-l-4" style={{ borderLeftColor: "#06b6d4" }}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{discussionMemo}</p>
              </div>
            </ReportSection>
          )}

          <ReportSection number="05" title="システム構成" subtitle="SYSTEM COMPONENTS">
            <div className="space-y-4">
              {COMPONENT_CATEGORIES.map((cat) => {
                const selected = componentIds
                  .map((id) => ARCH_COMPONENTS.find((c) => c.id === id))
                  .filter((c) => c && c.category === cat.id);
                if (selected.length === 0) return null;
                return (
                  <div key={cat.id}>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <span className="w-1 h-4 rounded" style={{ background: "linear-gradient(180deg, #6366f1, #8b5cf6)" }}></span>
                      {cat.label}
                    </h4>
                    <div className="flex flex-wrap gap-2 pl-3">
                      {selected.map((c) => (
                        <Badge key={c!.id} variant="secondary" className="text-xs">{c!.name}</Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
              {componentReason && (
                <div className="rounded-lg p-4 bg-muted/50 border-l-4 mt-4" style={{ borderLeftColor: "#06b6d4" }}>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">設計の意図</p>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{componentReason}</p>
                </div>
              )}
            </div>
          </ReportSection>

          {error && <p className="text-sm text-destructive text-center">{error}</p>}

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => goToStep(5)}>戻る</Button>
            <Button
              className="flex-1 text-white"
              size="lg"
              disabled={submitting}
              onClick={handleSubmit}
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              {submitting ? "提出中..." : "このレポートを提出する"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
