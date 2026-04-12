import Link from "next/link";

const STEPS = [
  {
    title: "お題を読む",
    description:
      "架空のプロジェクト要件（RFP形式）を読み、システムの目的・制約を把握します。",
  },
  {
    title: "要件を確認する",
    description:
      "設計を始める前に「何を確認すべきか」を考え、顧客への質問と想定回答を整理します。",
  },
  {
    title: "アーキテクチャ特性を選ぶ",
    description:
      "可用性・スケーラビリティ・セキュリティなど12の特性から最大3つを選び、優先順位と理由を言語化します。",
  },
  {
    title: "システム構成を考える",
    description:
      "選んだ特性を実現するために必要なコンポーネントを選び、構成の方針を説明します。",
  },
  {
    title: "発表・議論する",
    description:
      "他のグループと回答を比較し、なぜ異なる判断になったかを議論します。正解はなく、説明できるかどうかが重要です。",
  },
];

const PERSONAS = [
  {
    title: "新卒・若手エンジニア",
    description:
      "実務でアーキテクチャを考える機会がまだ少ない方。設計判断の思考プロセスを体験できます。",
  },
  {
    title: "中堅エンジニア",
    description:
      "実装は得意だが設計判断の言語化が苦手な方。トレードオフを整理する訓練になります。",
  },
  {
    title: "研修担当・チームリーダー",
    description:
      "チームのアーキテクチャ思考を底上げしたい方。グループワークの進行ツールとして使えます。",
  },
  {
    title: "アーキテクト志望",
    description:
      "将来アーキテクトを目指すエンジニア。繰り返し練習することで設計判断の引き出しが増えます。",
  },
];

const SKILLS = [
  {
    title: "トレードオフ思考",
    description:
      "何かを得れば何かを失う。その判断を根拠とともに説明できるようになります。",
  },
  {
    title: "要件定義の入口",
    description:
      "設計の前に何を確認すべきかを考える習慣が身につきます。",
  },
  {
    title: "技術的な議論力",
    description:
      "チームで設計について話し合い、異なる判断の理由を理解できるようになります。",
  },
  {
    title: "設計の言語化",
    description:
      "なぜその構成を選んだかをステークホルダーに説明できる力が鍛えられます。",
  },
];

const AI_TASKS = [
  "コードの実装",
  "テストの生成",
  "ドキュメント作成",
  "コードレビュー補助",
];

const HUMAN_TASKS = [
  "アーキテクチャの選択",
  "トレードオフの判断",
  "ビジネス要件との調整",
  "技術的意思決定",
];

export default function AboutPage() {
  return (
    <div className="max-w-[720px] mx-auto space-y-12 py-8">
      {/* 1. ヒーローセクション */}
      <section className="text-center space-y-4 py-8">
        <span
          className="inline-block text-xs font-medium px-4 py-1.5 rounded-full"
          style={{ backgroundColor: "oklch(0.95 0.03 250)", color: "oklch(0.55 0.15 250)" }}
        >
          Architecture Kata
        </span>
        <h1 className="text-3xl font-medium">
          ソフトウェアアーキテクチャを、実践で学ぶ
        </h1>
        <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">
          アーキテクチャ・カタは、安全な環境で繰り返し設計判断を練習するための研修手法です。
          架空のプロジェクト要件に対してグループで議論し、トレードオフを考えながらアーキテクチャを設計します。
        </p>
      </section>

      <hr className="border-border" />

      {/* 2. 背景セクション */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">
          なぜアーキテクチャの練習が必要か
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          医師は手術の前にシミュレーターで練習します。パイロットはフライトシミュレーターで訓練します。
          しかしソフトウェアアーキテクトは、実際のプロジェクトでしか設計判断を経験できないのが現状です。
        </p>
        <div
          className="border-l-2 px-5 py-4 rounded-r-lg"
          style={{ borderColor: "oklch(0.7 0.12 250)", backgroundColor: "oklch(0.97 0 0)" }}
        >
          <p className="text-foreground/80 leading-relaxed text-sm">
            「優れたアーキテクトを育てたいなら、アーキテクトにアーキテクチャを設計させるしかない。
            しかし設計の機会がキャリアに6回も訪れないとしたら、どうやって腕を磨けばいいのか？」
            <span className="block mt-2 text-muted-foreground text-xs">― Ted Neward</span>
          </p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          アーキテクチャ・カタは、この問題を解決するために生まれました。
          架空のお題を使って何度でも設計判断を繰り返し、判断力を鍛えることができます。
        </p>
      </section>

      <hr className="border-border" />

      {/* 3. AI時代の文脈セクション */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">
          AIが進化するほど、アーキテクチャ力が問われる
        </h2>
        <div className="bg-muted rounded-xl p-5 space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              AIが担う
            </p>
            <div className="flex flex-wrap gap-2">
              {AI_TASKS.map((task) => (
                <span
                  key={task}
                  className="text-xs font-medium px-3 py-1 rounded-full"
                  style={{ backgroundColor: "oklch(0.95 0.03 25)", color: "oklch(0.55 0.2 25)" }}
                >
                  {task}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              人間が担う
            </p>
            <div className="flex flex-wrap gap-2">
              {HUMAN_TASKS.map((task) => (
                <span
                  key={task}
                  className="text-xs font-medium px-3 py-1 rounded-full"
                  style={{ backgroundColor: "oklch(0.95 0.04 155)", color: "oklch(0.45 0.15 155)" }}
                >
                  {task}
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          AIはコードを書けますが、「このシステムで何を優先すべきか」を判断することはできません。
          アーキテクチャの選択に正解はなく、トレードオフを文脈に応じて判断する能力は、
          AIには代替できない人間固有のスキルです。
        </p>
      </section>

      <hr className="border-border" />

      {/* 4. 演習の流れセクション */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">
          アーキテクチャ・カタで何をするか
        </h2>
        <div className="space-y-0">
          {STEPS.map((s, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium shrink-0">
                  {i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-px bg-border flex-1 my-1" />
                )}
              </div>
              <div className="pb-6">
                <p className="text-sm font-medium">{s.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-border" />

      {/* 5. 対象ユーザーセクション */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">こんな方に使ってほしい</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PERSONAS.map((p) => (
            <div key={p.title} className="bg-muted rounded-xl p-4">
              <p className="text-sm font-medium">{p.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-border" />

      {/* 6. 学べることセクション */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">このアプリで身につく力</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SKILLS.map((s) => (
            <div key={s.title} className="bg-muted rounded-xl p-4">
              <p className="text-sm font-medium">{s.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-border" />

      {/* 7. CTAセクション */}
      <section className="text-center space-y-4 py-4">
        <p className="text-sm text-muted-foreground">
          まずはお題を選んで、グループワークを始めてみましょう。
        </p>
        <Link
          href="/"
          className="inline-block border border-border rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
        >
          研修を始める
        </Link>
      </section>
    </div>
  );
}
