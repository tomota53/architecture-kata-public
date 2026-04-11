import { redirect } from "next/navigation";
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
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">{session.title}</h1>
        <p className="text-muted-foreground">グループを選んでください</p>
      </div>

      <div className="space-y-3">
        {groups.map((group) => (
          <Link
            key={group.id}
            href={`/session/${code}/group/${group.id}`}
          >
            <Card className="hover:bg-accent transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle>{group.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {group.member_names && group.member_names.length > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    メンバー: {group.member_names.join("、")}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    メンバー未登録
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
