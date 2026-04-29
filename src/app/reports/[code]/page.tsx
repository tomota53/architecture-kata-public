import Link from "next/link";
import { getReportsByShareCode } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `レポート一覧: ${code}`,
    description: `共有コード「${code}」のレポート一覧`,
  };
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ReportsPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const reports = await getReportsByShareCode(code);

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4">
      <div className="text-center space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">共有コード</p>
        <h1
          className="text-3xl font-bold font-mono tracking-wider bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
        >
          {code}
        </h1>
        <p className="text-sm text-muted-foreground">
          {reports.length > 0
            ? `${reports.length}件のレポートが提出されています`
            : "まだレポートが提出されていません"}
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <p className="text-muted-foreground">
            この共有コードに紐づくレポートは見つかりませんでした。
          </p>
          <p className="text-sm text-muted-foreground">
            共有コードが正しいか確認してください。自動生成コードはすべて大文字です。
          </p>
          <Link href="/" className="text-primary underline text-sm">
            トップに戻る
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <Link key={r.id} href={`/report/${r.id}`}>
              <Card className="hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer border-0 shadow-sm mb-3">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-2">
                      <span
                        className="w-8 h-8 rounded-full text-xs text-white flex items-center justify-center shrink-0"
                        style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                      >
                        {r.userName.slice(0, 1)}
                      </span>
                      <span className="truncate">{r.userName}</span>
                    </span>
                    <Badge variant="outline" className="text-xs shrink-0">
                      レポート
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{r.problemTitle}</span>
                    <span className="text-xs">{formatDate(r.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
