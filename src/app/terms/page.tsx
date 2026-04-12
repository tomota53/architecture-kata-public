import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約 | Architecture Kata",
  description:
    "Architecture Kata の利用規約。利用条件・禁止事項・免責事項について記載しています。",
};

export default function TermsPage() {
  return (
    <div className="max-w-[720px] mx-auto space-y-8 py-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-medium">利用規約</h1>
        <p className="text-sm text-muted-foreground">最終更新日: 2026年4月12日</p>
      </header>

      <section className="space-y-3">
        <p className="text-sm leading-relaxed">
          本利用規約（以下「本規約」）は、Architecture Kata（以下「本サービス」）の利用条件を定めるものです。本サービスを利用する前に、本規約をよくお読みください。本サービスを利用した時点で、本規約に同意したものとみなします。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">1. サービス概要</h2>
        <p className="text-sm leading-relaxed">
          本サービスは、ソフトウェアアーキテクチャの設計判断を練習するためのグループワーク支援ツールです。ファシリテーターがセッションを作成し、参加者はグループ単位で要件確認・特性選択・システム構成の検討を行います。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">2. 利用条件</h2>
        <ul className="text-sm leading-relaxed list-disc pl-6 space-y-1">
          <li>本サービスは無料で誰でも利用できます。</li>
          <li>ログインやアカウント登録は不要です。</li>
          <li>本サービスの利用に必要な通信環境・機器は利用者の負担となります。</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">3. 禁止事項</h2>
        <p className="text-sm leading-relaxed">
          利用者は、本サービスの利用にあたり、以下の行為を行ってはなりません。
        </p>
        <ul className="text-sm leading-relaxed list-disc pl-6 space-y-1">
          <li>法令・公序良俗に違反する行為</li>
          <li>不適切・差別的・わいせつなコンテンツの投稿</li>
          <li>荒らし行為、スパム投稿、他者の利用を妨げる行為</li>
          <li>他者の著作権・商標権・プライバシー等の権利を侵害する行為</li>
          <li>本サービスに対する不正アクセス・脆弱性の悪用・過度な負荷をかける行為</li>
          <li>本サービスの運営を妨げる行為</li>
          <li>その他、運営者が不適切と判断する行為</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">4. 免責事項</h2>
        <ul className="text-sm leading-relaxed list-disc pl-6 space-y-1">
          <li>本サービスは現状有姿（AS IS）で提供され、いかなる保証もありません。</li>
          <li>本サービスの利用により利用者に生じた損害（データ損失・機会損失を含む）について、運営者は一切の責任を負いません。</li>
          <li>運営者は、事前の予告なく本サービスの内容変更・停止・終了を行うことができます。</li>
          <li>本サービスで入力されたデータは、運営上の都合により削除される可能性があります。</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">5. 著作権・知的財産権</h2>
        <p className="text-sm leading-relaxed">
          本サービスに関する著作権・商標権その他の知的財産権は、運営者または正当な権利者に帰属します。本サービスのソースコードは <a href="https://github.com/tomota53/architecture-kata-public" className="underline" target="_blank" rel="noreferrer">GitHub</a> で MIT License のもと公開されています。
        </p>
        <p className="text-sm leading-relaxed">
          利用者が本サービスに入力したコンテンツの著作権は利用者に帰属しますが、運営者は本サービスの提供・改善のために当該コンテンツを使用できるものとします。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">6. 規約の変更</h2>
        <p className="text-sm leading-relaxed">
          運営者は、必要に応じて本規約を変更することができます。変更後の規約は本ページに掲載された時点から効力を持ちます。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">7. 準拠法・管轄</h2>
        <p className="text-sm leading-relaxed">
          本規約の解釈および適用は、日本法に準拠します。本サービスに関連して生じた紛争については、運営者の所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">8. 問い合わせ</h2>
        <p className="text-sm leading-relaxed">
          本規約に関するご質問は <a href="https://github.com/tomota53/architecture-kata-public/issues" className="underline" target="_blank" rel="noreferrer">GitHub Issues</a> までお寄せください。
        </p>
      </section>
    </div>
  );
}
