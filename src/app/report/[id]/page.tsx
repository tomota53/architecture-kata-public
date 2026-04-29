import { notFound } from "next/navigation";
import { getReportById } from "@/app/actions";
import { ARCH_CHARACTERISTICS } from "@/lib/characteristics";
import { ARCH_COMPONENTS, COMPONENT_CATEGORIES } from "@/lib/components-master";
import { PrintButton } from "./print-button";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await getReportById(id);
  if (!data) return { title: "レポートが見つかりません" };
  return {
    title: `${data.report.user_name} の設計レポート`,
    description: `${data.problem?.title} に対する設計レポート`,
  };
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getReportById(id);

  if (!data) return notFound();

  const { report, problem } = data;

  const choices = [
    { name: report.choice_1, reason: report.choice_1_reason },
    { name: report.choice_2, reason: report.choice_2_reason },
    { name: report.choice_3, reason: report.choice_3_reason },
  ].filter((c) => c.name);

  const tradeoffs = [
    { name: report.tradeoff_1, reason: report.tradeoff_1_reason },
    { name: report.tradeoff_2, reason: report.tradeoff_2_reason },
  ].filter((t) => t.name);

  const requirements =
    (report.requirements as { id: string; question: string; answer: string }[] | null) ?? [];
  const componentIds = (report.component_ids as string[] | null) ?? [];

  return (
    <>
      <style>{`
        @media print {
          header, footer, .no-print { display: none !important; }
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
            {report.user_name} の設計レポート
          </h1>
          <div className="text-sm text-muted-foreground space-y-1">
            <p className="font-medium">{problem?.title}</p>
            {report.share_code && (
              <p className="text-xs">共有コード: {report.share_code}</p>
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
                      <span className="mr-2">A.</span>{r.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </ReportSection>
        )}

        {/* 02. 選んだ特性 */}
        <ReportSection number="02" title="選んだアーキテクチャ特性" subtitle="CHARACTERISTICS">
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

        {/* 04. 振り返りメモ */}
        {report.discussion_memo && (
          <ReportSection number="04" title="振り返りメモ" subtitle="REFLECTION">
            <div
              className="rounded-lg p-4 bg-muted/50 border-l-4 print:bg-transparent print:border print:border-gray-300"
              style={{ borderLeftColor: "#06b6d4" }}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {report.discussion_memo}
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
                  .map((cid) => ARCH_COMPONENTS.find((c) => c.id === cid))
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
              {report.component_reason && (
                <div
                  className="rounded-lg p-4 bg-muted/50 border-l-4 mt-4 print:bg-transparent print:border print:border-gray-300"
                  style={{ borderLeftColor: "#06b6d4" }}
                >
                  <p className="text-xs font-semibold text-muted-foreground mb-1">設計の意図</p>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {report.component_reason}
                  </p>
                </div>
              )}
            </div>
          </ReportSection>
        )}

        {/* レポートURL案内 */}
        <div className="no-print rounded-xl border px-4 py-3 text-xs text-muted-foreground leading-relaxed"
          style={{ backgroundColor: "oklch(0.98 0.02 250)", borderColor: "oklch(0.9 0.04 250)" }}
        >
          <p className="font-medium text-foreground mb-1">このレポートのURL</p>
          <p className="font-mono text-xs break-all">/report/{id}</p>
          <p className="mt-1">このURLをブックマークしておくと、いつでもレポートにアクセスできます。</p>
        </div>

        <PrintButton shareCode={report.share_code} />
      </div>
    </>
  );
}
