import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー | Architecture Kata",
  description:
    "Architecture Kata のプライバシーポリシー。収集する情報、利用目的、保管場所について記載しています。",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-[720px] mx-auto space-y-8 py-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-medium">プライバシーポリシー</h1>
        <p className="text-sm text-muted-foreground">最終更新日: 2026年4月12日</p>
      </header>

      <section className="space-y-3">
        <p className="text-sm leading-relaxed">
          Architecture Kata（以下「本サービス」）は、研修ワークの実施を目的とした Web
          アプリケーションです。本ポリシーでは、本サービスが取り扱う情報の内容と、その取り扱いについて説明します。
        </p>
        <div
          className="border-l-2 px-5 py-4 rounded-r-lg text-sm leading-relaxed"
          style={{ borderColor: "oklch(0.7 0.12 25)", backgroundColor: "oklch(0.98 0.02 25)" }}
        >
          <strong>ご注意:</strong> メンバー名の入力にはニックネームの使用を推奨します。本名や個人を特定できる情報（メールアドレス・電話番号・所属情報など）の入力は避けてください。
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">1. 収集する情報</h2>
        <p className="text-sm leading-relaxed">
          本サービスは、研修ワークの実施に必要な最低限の情報のみを収集します。
        </p>
        <ul className="text-sm leading-relaxed list-disc pl-6 space-y-1">
          <li>参加コード（ファシリテーターがセッションを作成する際に発行される 6 桁のコード）</li>
          <li>グループ名</li>
          <li>メンバー名（任意・ニックネーム推奨）</li>
          <li>ワーク中に入力された回答内容（要件確認の Q&amp;A、アーキテクチャ特性の選択、理由・トレードオフ、システム構成など）</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">2. 収集しない情報</h2>
        <p className="text-sm leading-relaxed">
          本サービスはログイン機能を持たず、以下の情報は取得しません。
        </p>
        <ul className="text-sm leading-relaxed list-disc pl-6 space-y-1">
          <li>氏名・メールアドレス・電話番号などの連絡先</li>
          <li>所属先情報</li>
          <li>支払い情報</li>
          <li>その他、本人を特定できる個人情報</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">3. 利用目的</h2>
        <p className="text-sm leading-relaxed">
          収集した情報は、研修ワークの実施・進行状況の表示・レポート出力のためにのみ利用します。マーケティング・広告配信・第三者提供などの目的には利用しません。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">4. データの保存期間</h2>
        <p className="text-sm leading-relaxed">
          研修で入力されたデータは、一定期間経過後に運営者の判断で削除されることがあります。長期的な保存は保証されません。必要なレポートはワーク終了時に印刷・PDF 化して各自で保管してください。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">5. 第三者提供</h2>
        <p className="text-sm leading-relaxed">
          本サービスは、収集した情報を第三者に提供・販売することはありません。ただし、法令に基づく開示要請があった場合はこの限りではありません。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">6. データの保管場所</h2>
        <p className="text-sm leading-relaxed">
          入力データは <a href="https://supabase.com/" className="underline" target="_blank" rel="noreferrer">Supabase</a>（PostgreSQL）に保存され、アプリケーションは <a href="https://vercel.com/" className="underline" target="_blank" rel="noreferrer">Vercel</a> 上でホスティングされています。いずれもデータセンターの物理的な所在地はサービス提供元の管理下にあります。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">7. Cookie・トラッキング</h2>
        <p className="text-sm leading-relaxed">
          本サービスは原則として Cookie や解析目的のトラッキングを使用しません。将来的に利用状況把握のため軽量な解析ツールを導入する場合は、本ポリシーを更新します。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">8. 問い合わせ先</h2>
        <p className="text-sm leading-relaxed">
          本ポリシーに関するご質問・ご要望は <a href="https://github.com/tomota53/architecture-kata-public/issues" className="underline" target="_blank" rel="noreferrer">GitHub Issues</a> までお寄せください。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">9. 改定について</h2>
        <p className="text-sm leading-relaxed">
          本ポリシーは、法令の変更や本サービスの運用上の必要に応じて、予告なく改定されることがあります。改定後のポリシーは本ページに掲載された時点から効力を持ちます。
        </p>
      </section>
    </div>
  );
}
