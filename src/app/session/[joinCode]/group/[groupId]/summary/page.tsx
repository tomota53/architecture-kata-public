import { notFound } from "next/navigation";
import { getSummaryData } from "@/app/actions";
import { ARCH_CHARACTERISTICS } from "@/lib/characteristics";
import { ARCH_COMPONENTS, COMPONENT_CATEGORIES } from "@/lib/components-master";
import { PrintButton } from "./print-button";
import { Badge } from "@/components/ui/badge";

function getCharName(id: string) {
  return ARCH_CHARACTERISTICS.find((c) => c.id === id)?.name ?? id;
}

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
    <section className="rounded-xl bg-card border shadow-sm p-6 space-y-4 print:shadow-none print:break-inside-avoid">
      <div className="flex items-baseline gap-3 pb-3 border-b">
        <span
          className="text-3xl font-bold bg-clip-text text-transparent print:text-black"
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
    { name: selection.choice_1, reason: selection.choice_1_reason },
    { name: selection.choice_2, reason: selection.choice_2_reason },
    { name: selection.choice_3, reason: selection.choice_3_reason },
  ].filter((c) => c.name);

  const tradeoffs = [
    { name: selection.tradeoff_1, reason: selection.tradeoff_1_reason },
    { name: selection.tradeoff_2, reason: selection.tradeoff_2_reason },
  ].filter((t) => t.name);

  const requirements =
    (selection.requirements as { id: string; question: string; answer: string }[] | null) ?? [];
  const componentIds = (selection.component_ids as string[] | null) ?? [];

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
        {/* レポートヘッダー */}
        <div
          className="text-center space-y-3 p-8 rounded-xl print:p-4 print:bg-transparent print:border"
          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.1))" }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground print:text-gray-500">
            Architecture Design Report
          </p>
          <h1
            className="text-3xl font-bold bg-clip-text text-transparent print:text-black"
            style={{ backgroundImage: "linear-gradient(135deg, #1e1b4b, #6366f1)" }}
          >
            {group.name} 設計レポート
          </h1>
          <div className="text-sm text-muted-foreground space-y-1">
            <p className="font-medium">{problem?.title}</p>
            <p className="text-xs">{session.title}</p>
            {group.member_names && group.member_names.length > 0 && (
              <p className="text-xs">メンバー: {group.member_names.join("、")}</p>
            )}
          </div>
        </div>

        {/* 01. 確認した要件 */}
        {requirements.length > 0 && (
          <ReportSection number="01" title="確認した要件" subtitle="REQUIREMENTS">
            <div className="space-y-4">
              {requirements.map((r, i) => (
                <div
                  key={r.id}
                  className="rounded-lg p-4 bg-muted/50 border-l-4 print:bg-transparent print:border print:border-gray-300"
                  style={{ borderLeftColor: "#6366f1" }}
                >
                  <p className="text-sm font-semibold mb-1">
                    <span className="text-primary mr-2 print:text-black">Q{i + 1}.</span>
                    {r.question}
                  </p>
                  {r.answer && (
                    <p className="text-sm text-muted-foreground pl-6">
                      <span className="mr-2">A.</span>
                      {r.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </ReportSection>
        )}

        {/* 02. 選んだ特性 */}
        <ReportSection
          number="02"
          title="選んだアーキテクチャ特性"
          subtitle="CHARACTERISTICS"
        >
          <div className="space-y-3">
            {choices.map((c, i) => (
              <div
                key={c.name}
                className="rounded-lg p-4 border-l-4 bg-muted/50 print:bg-transparent print:border print:border-gray-300"
                style={{ borderLeftColor: "#6366f1" }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0 print:bg-gray-700"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                  >
                    {i + 1}
                  </div>
                  <h4 className="font-bold text-base">{getCharName(c.name!)}</h4>
                </div>
                {c.reason && (
                  <p className="text-sm text-muted-foreground leading-relaxed pl-12 whitespace-pre-wrap">
                    {c.reason}
                  </p>
                )}
              </div>
            ))}
          </div>
        </ReportSection>

        {/* 03. 捨てた特性 */}
        {tradeoffs.length > 0 && (
          <ReportSection number="03" title="あえて捨てた特性" subtitle="TRADE-OFFS">
            <div className="space-y-3">
              {tradeoffs.map((t, i) => (
                <div
                  key={i}
                  className="rounded-lg p-4 border-l-4 bg-muted/50 print:bg-transparent print:border print:border-gray-300"
                  style={{ borderLeftColor: "#f43f5e" }}
                >
                  <h4 className="font-bold text-base mb-2 text-destructive print:text-black">
                    ✕ {getCharName(t.name!)}
                  </h4>
                  {t.reason && (
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {t.reason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </ReportSection>
        )}

        {/* 04. 議論メモ */}
        {selection.discussion_memo && (
          <ReportSection number="04" title="議論のハイライト" subtitle="DISCUSSION">
            <div
              className="rounded-lg p-4 bg-muted/50 border-l-4 print:bg-transparent print:border print:border-gray-300"
              style={{ borderLeftColor: "#06b6d4" }}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {selection.discussion_memo}
              </p>
            </div>
          </ReportSection>
        )}

        {/* 05. システム構成 */}
        {componentIds.length > 0 && (
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
                      <span
                        className="w-1 h-4 rounded"
                        style={{ background: "linear-gradient(180deg, #6366f1, #8b5cf6)" }}
                      ></span>
                      {cat.label}
                    </h4>
                    <div className="flex flex-wrap gap-2 pl-3">
                      {selected.map((c) => (
                        <Badge key={c!.id} variant="secondary" className="text-xs">
                          {c!.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
              {selection.component_reason && (
                <div
                  className="rounded-lg p-4 bg-muted/50 border-l-4 mt-4 print:bg-transparent print:border print:border-gray-300"
                  style={{ borderLeftColor: "#06b6d4" }}
                >
                  <p className="text-xs font-semibold text-muted-foreground mb-1">設計の意図</p>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {selection.component_reason}
                  </p>
                </div>
              )}
            </div>
          </ReportSection>
        )}

        {/* ナビゲーション・印刷ボタン（印刷時非表示） */}
        <PrintButton joinCode={joinCode} />
      </div>
    </>
  );
}
