import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "アーキテクチャの基礎を学ぶ",
  description:
    "Architecture Kata を始める前に知っておきたい、ソフトウェアアーキテクチャとアーキテクチャ特性の基本を解説します。研修の座学パートの教材としてお使いください。",
};

const ARCHITECTURE_ELEMENTS = [
  {
    title: "システムの構造",
    description:
      "マイクロサービス、モノリス、レイヤードなど、システムの「形」を決めるもの",
  },
  {
    title: "アーキテクチャ特性",
    description:
      "可用性、セキュリティ、パフォーマンスなど、システムが備えるべき「品質」",
  },
  {
    title: "アーキテクチャ決定",
    description:
      "「データベースは RDB を使う」「認証は外部サービスに委譲する」といった重要な判断",
  },
  {
    title: "設計指針",
    description:
      "「マイクロサービス間は非同期通信を基本とする」といった開発チームが従うルール",
  },
];

const CHARACTERISTICS = [
  {
    name: "可用性",
    en: "Availability",
    summary: "システムが止まらないこと",
    example: "銀行のATMが24時間365日使える",
  },
  {
    name: "スケーラビリティ",
    en: "Scalability",
    summary: "負荷増加に対応できること",
    example: "セール時にアクセスが10倍になっても耐えられる",
  },
  {
    name: "パフォーマンス",
    en: "Performance",
    summary: "レスポンスが速いこと",
    example: "検索結果が0.5秒以内に返る",
  },
  {
    name: "セキュリティ",
    en: "Security",
    summary: "不正アクセスから守られていること",
    example: "個人情報が暗号化されて保存される",
  },
  {
    name: "保守性",
    en: "Maintainability",
    summary: "コードを変更しやすいこと",
    example: "決済方法の追加が既存機能に影響しない",
  },
  {
    name: "テスト容易性",
    en: "Testability",
    summary: "テストを書きやすいこと",
    example: "各コンポーネントを独立してテストできる",
  },
  {
    name: "デプロイ容易性",
    en: "Deployability",
    summary: "リリースを素早く安全に行えること",
    example: "1日に何度でもデプロイできる",
  },
  {
    name: "信頼性",
    en: "Reliability",
    summary: "正確に動き続けること",
    example: "送金処理で金額が1円もずれない",
  },
  {
    name: "拡張性",
    en: "Extensibility",
    summary: "新機能を追加しやすいこと",
    example: "新しい決済手段をプラグインとして追加できる",
  },
  {
    name: "監視容易性",
    en: "Observability",
    summary: "システムの状態を把握しやすいこと",
    example: "エラー発生時に原因箇所をすぐ特定できる",
  },
  {
    name: "コスト効率",
    en: "Cost",
    summary: "費用対効果が高いこと",
    example: "ピーク時以外はサーバーを自動縮小してコスト削減",
  },
  {
    name: "監査可能性",
    en: "Auditability",
    summary: "操作履歴を追跡・証明できること",
    example: "誰がいつどのデータを変更したか記録されている",
  },
];

const TRADEOFFS = [
  {
    left: "パフォーマンス",
    right: "セキュリティ",
    description: "暗号化処理を厳重にすると、レスポンスは遅くなる",
  },
  {
    left: "スケーラビリティ",
    right: "コスト効率",
    description:
      "大量のサーバーを常時稼働させれば負荷には強いが、コストが跳ね上がる",
  },
  {
    left: "可用性",
    right: "信頼性",
    description:
      "システムを止めずに動かし続けると、データの整合性チェックが難しくなる場合がある",
  },
];

const RESOURCES = [
  {
    type: "書籍",
    title: "ソフトウェアアーキテクチャの基礎",
    author: "Mark Richards & Neal Ford（O'Reilly）",
    description:
      "アーキテクチャ特性、トレードオフ、各アーキテクチャパターンを体系的に学べる定番書。特に第4章・第5章がカタの背景知識に直結します。",
    url: "https://www.oreilly.co.jp/books/9784873119823/",
  },
  {
    type: "書籍",
    title: "アーキテクトの教科書",
    author: "米久保 剛（翔泳社）",
    description:
      "アーキテクトを目指すエンジニア向けの入門書。上の本より読みやすく、最初の一冊におすすめ。",
    url: "https://www.shoeisha.co.jp/book/detail/9784798184777",
  },
  {
    type: "Web記事",
    title: "10Xにおけるアーキテクチャ特性の定義",
    author: "10X Product Blog",
    description:
      "アーキテクチャ特性を社内に導入した実践記録。「なぜ必要か」「どう選ぶか」が平易にまとまっています。",
    url: "https://product.10x.co.jp/entry/defining-architectural-characteristics",
  },
];

export default function LearnPage() {
  return (
    <div className="max-w-[720px] mx-auto space-y-12 py-8">
      {/* ヒーロー */}
      <section className="text-center space-y-4 py-8">
        <span
          className="inline-block text-xs font-medium px-4 py-1.5 rounded-full"
          style={{
            backgroundColor: "oklch(0.95 0.03 250)",
            color: "oklch(0.55 0.15 250)",
          }}
        >
          座学教材
        </span>
        <h1 className="text-3xl font-medium">
          アーキテクチャの基礎を学ぶ
        </h1>
        <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">
          Architecture Kata を始める前に知っておきたい、アーキテクチャの考え方
        </p>
      </section>

      <div
        className="bg-muted rounded-xl p-5 text-sm text-muted-foreground leading-relaxed"
      >
        このページでは、Architecture Kata ワークに入る前の前提知識として、
        ソフトウェアアーキテクチャとアーキテクチャ特性の基本を学びます。
        研修の座学パート（30〜45分）の教材としてお使いください。
      </div>

      <hr className="border-border" />

      {/* セクション1: ソフトウェアアーキテクチャとは */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">🏗️</span>
          ソフトウェアアーキテクチャとは
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          ソフトウェアアーキテクチャとは、システム全体の「骨格」のことです。
          建築に例えると、間取りや構造（木造か鉄筋か）を決めることに相当します。
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          具体的には、以下の4つの要素で構成されます。
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ARCHITECTURE_ELEMENTS.map((el, i) => (
            <div key={i} className="bg-muted rounded-xl p-4">
              <p className="text-sm font-medium flex items-center gap-2">
                <span
                  className="w-6 h-6 rounded-full text-xs text-white flex items-center justify-center shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  }}
                >
                  {i + 1}
                </span>
                {el.title}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                {el.description}
              </p>
            </div>
          ))}
        </div>
        <div
          className="border-l-2 px-5 py-4 rounded-r-lg"
          style={{
            borderColor: "oklch(0.7 0.12 250)",
            backgroundColor: "oklch(0.97 0 0)",
          }}
        >
          <p className="text-sm text-foreground/80 leading-relaxed">
            <strong>ポイント:</strong>{" "}
            アーキテクチャは「何を作るか（機能）」ではなく「どう作るか（構造と品質）」を決めるものです。
          </p>
        </div>
      </section>

      <hr className="border-border" />

      {/* セクション2: 機能要件と非機能要件 */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">⚖️</span>
          機能要件と非機能要件のちがい
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          システムに求められる要件は、大きく2つに分けられます。
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* 機能要件 */}
          <div
            className="rounded-xl p-5 space-y-3 border-2"
            style={{ borderColor: "#6366f1", background: "rgba(99,102,241,0.03)" }}
          >
            <p
              className="text-sm font-medium px-3 py-1 rounded-full inline-block"
              style={{
                backgroundColor: "oklch(0.95 0.03 250)",
                color: "oklch(0.55 0.15 250)",
              }}
            >
              機能要件
            </p>
            <p className="text-sm text-muted-foreground">
              システムが「何をするか」
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
              <li>ユーザーがログインできる</li>
              <li>商品を検索できる</li>
              <li>注文履歴を表示できる</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              「動くかどうか」でテストできる
            </p>
          </div>
          {/* 非機能要件 */}
          <div
            className="rounded-xl p-5 space-y-3 border-2"
            style={{ borderColor: "#06b6d4", background: "rgba(6,182,212,0.03)" }}
          >
            <p
              className="text-sm font-medium px-3 py-1 rounded-full inline-block"
              style={{
                backgroundColor: "oklch(0.95 0.03 190)",
                color: "oklch(0.45 0.12 190)",
              }}
            >
              非機能要件（= アーキテクチャ特性）
            </p>
            <p className="text-sm text-muted-foreground">
              システムが「どのように動くか」
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
              <li>1秒以内にレスポンスを返す</li>
              <li>99.9% の稼働率を維持する</li>
              <li>同時10万ユーザーに対応する</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              「どの程度うまく動くか」の基準
            </p>
          </div>
        </div>
        <div
          className="border-l-2 px-5 py-4 rounded-r-lg"
          style={{
            borderColor: "oklch(0.7 0.12 250)",
            backgroundColor: "oklch(0.97 0 0)",
          }}
        >
          <p className="text-sm text-foreground/80 leading-relaxed">
            機能要件は「仕様書に書いてある」ことが多いですが、非機能要件は「書かれていないけれど当然求められる」ことが多く、見落とされがちです。
            <strong>
              アーキテクチャ設計の本質は、この非機能要件（アーキテクチャ特性）をどう満たすかにあります。
            </strong>
          </p>
        </div>
      </section>

      <hr className="border-border" />

      {/* セクション3: アーキテクチャ特性一覧 */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">🎯</span>
          12のアーキテクチャ特性
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Architecture Kata ワークでは、以下の12の特性から重要なものを3つ選びます。
          まずはそれぞれの意味を理解しましょう。
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CHARACTERISTICS.map((c) => (
            <div
              key={c.en}
              className="rounded-lg border-2 p-4 space-y-2"
              style={{ borderColor: "oklch(0.85 0.04 250)" }}
            >
              <div>
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.en}</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {c.summary}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "oklch(0.55 0.12 250)" }}>
                例: {c.example}
              </p>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-border" />

      {/* セクション4: トレードオフ */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">🔄</span>
          アーキテクチャの本質はトレードオフ
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          すべてのアーキテクチャ特性を最高レベルで満たすことは不可能です。
          ある特性を高めると、別の特性が犠牲になります。これがトレードオフです。
        </p>
        <div className="space-y-3">
          {TRADEOFFS.map((t, i) => (
            <div
              key={i}
              className="rounded-xl p-4 border-l-4"
              style={{
                borderColor: "#f43f5e",
                backgroundColor: "rgba(244,63,94,0.03)",
              }}
            >
              <p className="text-sm font-medium">
                {t.left}{" "}
                <span className="text-muted-foreground mx-1">↔</span>{" "}
                {t.right}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                {t.description}
              </p>
            </div>
          ))}
        </div>
        <div
          className="border-l-2 px-5 py-4 rounded-r-lg"
          style={{
            borderColor: "oklch(0.7 0.12 250)",
            backgroundColor: "oklch(0.97 0 0)",
          }}
        >
          <p className="text-foreground/80 leading-relaxed text-sm">
            「最善のアーキテクチャを狙ってはいけない。少なくとも最悪でないアーキテクチャを狙おう。」
            <span className="block mt-2 text-muted-foreground text-xs">
              ― 『ソフトウェアアーキテクチャの基礎』Mark Richards &amp; Neal Ford
            </span>
          </p>
        </div>
        <p className="text-sm leading-relaxed">
          <strong>
            だからこそ「何を選んだか」だけでなく「何を捨てたか、そしてなぜか」を説明できることが重要です。
          </strong>
          <span className="text-muted-foreground">
            {" "}Architecture Kata ワークでは、この思考プロセスを繰り返し練習します。
          </span>
        </p>
      </section>

      <hr className="border-border" />

      {/* セクション5: デジタルバンクで考えてみよう */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">🏦</span>
          身近な例で考える ― デジタルバンクの場合
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          自分たちの仕事に当てはめて考えてみましょう。
          デジタルバンクのシステムでは、どのアーキテクチャ特性が重要でしょうか？
        </p>

        {/* シナリオカード */}
        <div
          className="rounded-xl p-5 border-2 space-y-2"
          style={{
            borderColor: "#6366f1",
            background: "linear-gradient(135deg, rgba(99,102,241,0.03), rgba(139,92,246,0.06))",
          }}
        >
          <p className="text-sm font-medium">インターネットバンキングシステム</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            顧客がスマホやPCから残高照会・振込・ローン申込などを行うシステム。
            1日あたり50万件のトランザクションを処理し、24時間365日の稼働が求められる。
          </p>
        </div>

        {/* 考えてみよう */}
        <div
          className="rounded-xl p-5 space-y-4"
          style={{ backgroundColor: "oklch(0.97 0.02 80)" }}
        >
          <p className="text-sm font-medium">考えてみよう</p>
          <ol className="text-sm text-muted-foreground leading-relaxed space-y-2 list-decimal pl-5">
            <li>
              このシステムで最も重要なアーキテクチャ特性は何でしょうか？3つ選んでみてください。
            </li>
            <li>
              なぜその3つを選びましたか？他の特性を「捨てた」理由は？
            </li>
            <li>
              もし「コスト効率」を最優先にしたら、何が犠牲になりそうですか？
            </li>
          </ol>
          <div className="bg-background/60 rounded-lg p-4 mt-2">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground/70">ヒント:</span>{" "}
              多くの銀行システムでは、可用性・セキュリティ・信頼性が上位に来ます。
              しかし「なぜパフォーマンスよりセキュリティを優先するのか」を
              自分の言葉で説明できることが大切です。正解は一つではありません。
            </p>
          </div>
        </div>
      </section>

      <hr className="border-border" />

      {/* セクション6: 参考リソース */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">📚</span>
          もっと学びたい方へ
        </h2>
        <div className="space-y-3">
          {RESOURCES.map((r) => (
            <a
              key={r.title}
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="block bg-muted rounded-xl p-4 hover:bg-muted/80 transition-colors group"
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: "oklch(0.95 0.03 250)",
                    color: "oklch(0.55 0.15 250)",
                  }}
                >
                  {r.type}
                </span>
                <p className="text-sm font-medium group-hover:underline">
                  {r.title}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{r.author}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {r.description}
              </p>
            </a>
          ))}
        </div>
      </section>

      <hr className="border-border" />

      {/* CTA */}
      <section className="text-center space-y-4 py-4">
        <h2 className="text-xl font-medium">
          基礎を学んだら、実践してみましょう
        </h2>
        <p className="text-sm text-muted-foreground">
          Architecture Kata ワークでは、ここで学んだ知識を使って
          グループでアーキテクチャ設計に挑戦します。
        </p>
        <Link
          href="/"
          className="inline-block text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-colors"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
        >
          Architecture Kata を始める &rarr;
        </Link>
      </section>
    </div>
  );
}
