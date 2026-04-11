import { notFound } from "next/navigation";
import { getSummaryData } from "@/app/actions";
import { ARCH_CHARACTERISTICS } from "@/lib/characteristics";
import { ARCH_COMPONENTS, COMPONENT_CATEGORIES } from "@/lib/components-master";
import { PrintButton } from "./print-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function getCharName(id: string) {
  return ARCH_CHARACTERISTICS.find((c) => c.id === id)?.name ?? id;
}

export default async function SummaryPage({
  params,
}: {
  params: Promise<{ joinCode: string; groupId: string }>;
}) {
  const { joinCode, groupId } = await params;
  const data = await getSummaryData(joinCode, groupId);

  if (!data) return notFound();

  const { session, group, selection, problem } = data;

  const choices = [
    { rank: "1位", name: selection.choice_1, reason: selection.choice_1_reason },
    { rank: "2位", name: selection.choice_2, reason: selection.choice_2_reason },
    { rank: "3位", name: selection.choice_3, reason: selection.choice_3_reason },
  ].filter((c) => c.name);

  const tradeoffs = [
    { name: selection.tradeoff_1, reason: selection.tradeoff_1_reason },
    { name: selection.tradeoff_2, reason: selection.tradeoff_2_reason },
  ].filter((t) => t.name);

  return (
    <>
      {/* 印刷用スタイル */}
      <style>{`
        @media print {
          header, .no-print { display: none !important; }
          body { background: white !important; }
          main { padding: 0 !important; }
        }
      `}</style>

      <div className="max-w-2xl mx-auto space-y-6 print:space-y-4">
        {/* ヘッダー */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground print:text-gray-500">
            {session.title} / {problem?.title}
          </p>
          <h1 className="text-2xl font-bold">{group.name} 発表サマリー</h1>
          {group.member_names && group.member_names.length > 0 && (
            <p className="text-muted-foreground">
              メンバー: {group.member_names.join("、")}
            </p>
          )}
        </div>

        <Separator />

        {/* 選んだ特性 */}
        <Card className="print:shadow-none print:border">
          <CardHeader>
            <CardTitle>選んだアーキテクチャ特性</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {choices.map((c) => (
              <div
                key={c.rank}
                className="flex gap-4 items-start"
              >
                <Badge
                  variant="default"
                  className="shrink-0 mt-0.5 min-w-[3rem] justify-center"
                >
                  {c.rank}
                </Badge>
                <div>
                  <p className="font-semibold">{getCharName(c.name!)}</p>
                  {c.reason && (
                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                      {c.reason}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 捨てた特性 */}
        {tradeoffs.length > 0 && (
          <Card className="print:shadow-none print:border">
            <CardHeader>
              <CardTitle>あえて捨てた特性</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tradeoffs.map((t, i) => (
                <div key={i} className="pl-4 border-l-2 border-destructive">
                  <p className="font-semibold">{getCharName(t.name!)}</p>
                  {t.reason && (
                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                      {t.reason}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* コンポーネント */}
        {selection.component_ids && selection.component_ids.length > 0 && (
          <Card className="print:shadow-none print:border">
            <CardHeader>
              <CardTitle>選択したシステムコンポーネント</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {COMPONENT_CATEGORIES.map((cat) => {
                const selected = (selection.component_ids as string[])
                  .map((id: string) => ARCH_COMPONENTS.find((c) => c.id === id))
                  .filter((c) => c && c.category === cat.id);
                if (selected.length === 0) return null;
                return (
                  <div key={cat.id}>
                    <p className="text-sm font-semibold text-muted-foreground">
                      {cat.label}
                    </p>
                    <ul className="list-disc list-inside text-sm mt-1 space-y-0.5">
                      {selected.map((c) => (
                        <li key={c!.id}>{c!.name}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
              {selection.component_reason && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">理由</p>
                  <p className="text-sm whitespace-pre-wrap mt-1">
                    {selection.component_reason}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* 議論メモ */}
        {selection.discussion_memo && (
          <Card className="print:shadow-none print:border">
            <CardHeader>
              <CardTitle>グループで一番議論になったこと</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">
                {selection.discussion_memo}
              </p>
            </CardContent>
          </Card>
        )}

        {/* 印刷ボタン（印刷時非表示） */}
        <PrintButton />
      </div>
    </>
  );
}
