"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getSessionDetail, finishSession } from "@/app/actions";
import { ARCH_CHARACTERISTICS } from "@/lib/characteristics";
import { ARCH_COMPONENTS, COMPONENT_CATEGORIES } from "@/lib/components-master";

type SessionDetail = {
  session: {
    id: string;
    title: string;
    join_code: string;
    status: string;
    created_at: string;
  };
  problem: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    hints: string[];
  } | null;
  groups: {
    id: string;
    name: string;
    member_names: string[] | null;
    submitted: boolean;
    choices: string[];
    componentIds: string[];
  }[];
};

const difficultyLabel: Record<string, string> = {
  easy: "初級",
  medium: "中級",
  hard: "上級",
};

export default function FacilitatorPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [data, setData] = useState<SessionDetail | null>(null);
  const [showProblem, setShowProblem] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [finishing, setFinishing] = useState(false);

  const fetchData = useCallback(async () => {
    const result = await getSessionDetail(sessionId);
    if (result) setData(result);
  }, [sessionId]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // 30秒ごとに自動更新
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleFinish = async () => {
    if (!confirm("セッションを終了しますか？終了すると参加者は新規提出できなくなります。")) return;
    setFinishing(true);
    await finishSession(sessionId);
    await fetchData();
    setFinishing(false);
  };

  if (!data) {
    return (
      <div className="max-w-2xl mx-auto mt-16 text-center">
        <p className="text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  const { session, problem, groups } = data;
  const submittedCount = groups.filter((g) => g.submitted).length;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* セッション情報 */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold">{session.title}</h1>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">参加コード</p>
          <p className="text-5xl font-mono font-bold tracking-[0.3em]">
            {session.join_code}
          </p>
        </div>
        <Badge variant={session.status === "active" ? "default" : "secondary"}>
          {session.status === "active" ? "進行中" : "終了"}
        </Badge>
      </div>

      <Separator />

      {/* お題 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">
            お題: {problem?.title}
            {problem && (
              <Badge variant="outline" className="ml-2">
                {difficultyLabel[problem.difficulty]}
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowProblem(!showProblem)}
          >
            {showProblem ? "非表示" : "表示"}
          </Button>
        </CardHeader>
        {showProblem && problem && (
          <CardContent className="space-y-3">
            <p className="text-sm">{problem.description}</p>
            {problem.hints && problem.hints.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-1">ヒント:</p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  {problem.hints.map((hint, i) => (
                    <li key={i}>{hint}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* グループ一覧 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            グループ一覧（{submittedCount}/{groups.length} 提出済み）
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {groups.map((group) => (
              <div key={group.id} className="border rounded-lg">
                <div className="flex items-center justify-between p-3">
                  <div>
                    <p className="font-medium">{group.name}</p>
                    {group.member_names && group.member_names.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {group.member_names.join("、")}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={group.submitted ? "default" : "outline"}
                    >
                      {group.submitted ? "提出済み" : "未提出"}
                    </Badge>
                    {group.submitted && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setExpandedGroup(
                              expandedGroup === group.id ? null : group.id
                            )
                          }
                        >
                          {expandedGroup === group.id ? "閉じる" : "概要"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/session/${session.join_code}/group/${group.id}/summary`
                            )
                          }
                        >
                          詳細
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                {/* 展開表示 */}
                {group.submitted && expandedGroup === group.id && (
                  <div className="px-3 pb-3 space-y-3 border-t pt-3">
                    {/* 選んだ特性 */}
                    {group.choices.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">選んだ特性</p>
                        <div className="flex flex-wrap gap-1.5">
                          {group.choices.map((id, i) => {
                            const name = ARCH_CHARACTERISTICS.find((c) => c.id === id)?.name ?? id;
                            return (
                              <Badge key={id} variant="secondary" className="text-xs">
                                {i + 1}位: {name}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {/* コンポーネント */}
                    {group.componentIds.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">コンポーネント</p>
                        {COMPONENT_CATEGORIES.map((cat) => {
                          const selected = group.componentIds
                            .map((id) => ARCH_COMPONENTS.find((c) => c.id === id))
                            .filter((c) => c && c.category === cat.id);
                          if (selected.length === 0) return null;
                          return (
                            <div key={cat.id} className="mb-1">
                              <span className="text-xs text-muted-foreground">{cat.label}: </span>
                              {selected.map((c) => (
                                <Badge key={c!.id} variant="outline" className="text-xs mr-1">
                                  {c!.name}
                                </Badge>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 自動更新の案内 */}
      <p className="text-center text-xs text-muted-foreground">
        提出状況は30秒ごとに自動更新されます
      </p>

      {/* セッション終了 */}
      {session.status === "active" && (
        <div className="text-center">
          <Button
            variant="destructive"
            onClick={handleFinish}
            disabled={finishing}
          >
            {finishing ? "終了中..." : "セッションを終了する"}
          </Button>
        </div>
      )}
    </div>
  );
}
