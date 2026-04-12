# Architecture Kata

**ソフトウェアアーキテクチャを、実践で学ぶ**

アーキテクチャ・カタ（型）は、安全な環境で繰り返し設計判断を練習するための研修手法です。
本アプリは、グループワーク形式でアーキテクチャ特性を議論・選択し、設計レポートとしてまとめるためのワークショップ支援ツールです。

## 何ができるアプリか

- ファシリテーターが架空のプロジェクト要件（お題）を選び、セッションを発行
- 参加者は 6 桁の参加コードでグループごとに参加
- 要件確認 → アーキテクチャ特性の選択 → 理由・トレードオフ → システム構成 → レポート提出まで、一連の流れを体験
- 全グループの提出状況や比較をファシリテーター画面で確認
- 正解のない設計判断を、チームで言語化する力を鍛えることを目的としています

## 想定ユーザー

- 新卒・若手エンジニア — 実務でアーキテクチャを考える機会がまだ少ない方
- 中堅エンジニア — 設計判断の言語化を鍛えたい方
- 研修担当者・チームリーダー — チームのアーキテクチャ思考を底上げしたい方
- アーキテクト志望 — 将来アーキテクトを目指すエンジニア

## 主な機能

- ファシリテーターによるセッション作成（参加コード発行）
- カスタムお題の追加
- グループ単位で 6 ステップのワーク（メンバー名 / 要件確認 / 特性選択 / 理由・トレードオフ / システム構成 / レポート確認）
- 13 種のアーキテクチャ特性から最大 3 つまで選択
- 印刷対応の設計レポート
- ファシリテーター向けの提出状況ダッシュボード

## アクセス

公開 URL: （Vercel デプロイ後に追記）

## 開発の動機

医師は手術の前にシミュレーターで練習し、パイロットはフライトシミュレーターで訓練します。
しかしソフトウェアアーキテクトは、実際のプロジェクトでしか設計判断を経験できないのが現状です。

AI がコードを書ける時代に、人間に残されるのは「このシステムで何を優先すべきか」を判断し、
トレードオフを文脈に応じて決める力です。アーキテクチャ・カタは、この力を安全な環境で繰り返し練習できる仕組みとして生まれました。
詳しくは [About ページ](./src/app/about/page.tsx) を参照してください。

## 技術スタック

- [Next.js 15](https://nextjs.org/)（App Router） + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/)（PostgreSQL）
- [Vercel](https://vercel.com/) ホスティング

## ローカル開発手順

1. リポジトリをクローン

   ```bash
   git clone https://github.com/tomota53/architecture-kata-public.git
   cd architecture-kata-public
   ```

2. 依存をインストール

   ```bash
   npm install
   ```

3. Supabase プロジェクトを作成し、`supabase/migrations/` 配下の SQL を `001` から順に SQL Editor で実行

4. `.env.local` を作成して環境変数を設定

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

5. 開発サーバーを起動

   ```bash
   npm run dev
   ```

   [http://localhost:3000](http://localhost:3000) を開いて動作確認できます。

## バグ報告・フィードバック

バグ報告・機能要望は [GitHub Issues](https://github.com/tomota53/architecture-kata-public/issues) までお願いします。
プルリクエストも歓迎です。

## ライセンス

[MIT License](./LICENSE)

## 作者

Made by [tomota53](https://github.com/tomota53)
