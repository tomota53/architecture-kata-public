import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroIllustration } from "@/components/illustrations/HeroIllustration";
import { getKataProblems } from "@/app/actions";
import { ShareCodeForm } from "./share-code-form";

const difficultyLabel: Record<string, string> = {
  easy: "初級",
  medium: "中級",
  hard: "上級",
};

export default async function Home() {
  const problems = await getKataProblems();

  return (
    <div className="max-w-lg mx-auto mt-8 space-y-8">
      {/* ヒーロー */}
      <div className="text-center space-y-4">
        <HeroIllustration className="w-full max-w-sm mx-auto" />
        <h1
          className="text-3xl font-bold bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(135deg, #1e1b4b, #6366f1)",
          }}
        >
          Architecture Kata
        </h1>
        <p className="text-muted-foreground text-sm">
          お題を選んで、アーキテクチャ設計に挑戦しよう
        </p>
      </div>

      {/* お題一覧 */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">お題を選ぶ</h2>
        {problems.map((p) => (
          <Link key={p.id} href={`/kata/${p.id}`}>
            <Card className="hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer border-0 shadow-sm mb-3">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Badge variant="outline" className="text-xs shrink-0">
                    {difficultyLabel[p.difficulty]}
                  </Badge>
                  {p.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {p.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* 共有コードでレポート一覧 */}
      <ShareCodeForm />

      {/* 座学リンク */}
      <div className="text-center space-y-3">
        <Link
          href="/learn"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          📖 まずは座学で基礎を学ぶ &rarr;
        </Link>
      </div>

      <div className="text-center">
        <Link
          href="/about"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          このアプリについて &rarr;
        </Link>
      </div>
    </div>
  );
}
