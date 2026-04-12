import { getSessionByJoinCode, getGroupsBySessionId } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function JoinPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const session = await getSessionByJoinCode(code);

  if (!session) {
    return (
      <div className="max-w-md mx-auto mt-16 text-center space-y-4">
        <h1 className="text-2xl font-bold">セッションが見つかりません</h1>
        <p className="text-muted-foreground">
          参加コード「{code}」に該当するアクティブなセッションがありません。
        </p>
        <Link href="/" className="text-primary underline">
          トップに戻る
        </Link>
      </div>
    );
  }

  const groups = await getGroupsBySessionId(session.id);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div
        className="text-center space-y-2 p-6 rounded-xl"
        style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.05), rgba(99,102,241,0.08))" }}
      >
        <p className="text-xs text-muted-foreground uppercase tracking-wider">セッション</p>
        <h1
          className="text-2xl font-bold bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(135deg, #1e1b4b, #6366f1)" }}
        >
          {session.title}
        </h1>
        <p className="text-sm text-muted-foreground">参加するグループを選んでください</p>
      </div>

      <div className="space-y-3">
        {groups.map((group) => (
          <Link key={group.id} href={`/session/${code}/group/${group.id}`}>
            <Card className="hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <span
                    className="w-7 h-7 rounded-full text-xs text-white flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                  >
                    {group.name.slice(-1)}
                  </span>
                  {group.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {group.member_names && group.member_names.length > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {group.member_names.join("、")}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">メンバー未登録</p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
