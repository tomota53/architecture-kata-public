# アーキテクチャ・カタ研修アプリ MVP（シンプル版）開発指示

## プロジェクト概要

新卒エンジニア向けのアーキテクチャ・カタ研修を支援するWebアプリ。
ファシリテーターがセッションを作成し、参加者がグループごとにアーキテクチャ特性を選択・記録する。
**認証なし・リアルタイムなし・AIなし**のシンプル構成でMVPを作る。

---

## 技術スタック

| 項目 | 技術 |
|------|------|
| フレームワーク | Next.js 14（App Router） |
| スタイリング | Tailwind CSS |
| データベース | Supabase（PostgreSQL） |
| ホスティング | Vercel |
| 言語 | TypeScript |

---

## DB設計（4テーブル）

### 1. `sessions`（セッション）

```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,                      -- セッション名（例：2024年度新卒研修）
  join_code VARCHAR(6) NOT NULL UNIQUE,     -- 参加コード（6桁英数字）
  kata_problem_id UUID REFERENCES kata_problems(id),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'finished')),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 2. `kata_problems`（お題）

```sql
CREATE TABLE kata_problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'medium'
    CHECK (difficulty IN ('easy', 'medium', 'hard')),
  hints TEXT[]                              -- ファシリテーター用ヒント
);

-- 初期データ
INSERT INTO kata_problems (title, description, difficulty, hints) VALUES
(
  '社内昼食注文システム',
  '社員100人の会社で、毎日昼食を一括注文するシステムを作ってください。注文は午前11時までに締め切り、弁当業者に自動送信されます。予算は限られており、エンジニアは2人です。',
  'easy',
  ARRAY['1日1回しか動かないシステムに高可用性は必要か？', 'エンジニア2人でどこまで作れるか考えよう']
),
(
  'ECサイトのフラッシュセール',
  '人気アパレルブランドが年2回、限定商品のフラッシュセールを実施します。通常時のアクセスは1日1万PVですが、セール開始の瞬間に10万アクセスが集中します。決済機能を持ち、購入は先着順です。',
  'medium',
  ARRAY['普段は過剰スペックになるコストをどう考えるか', '先着順の厳密性をどう担保するか']
),
(
  'デジタルバンクの送金機能',
  'スマートフォン向けデジタルバンクの個人間送金機能を設計してください。1日の送金件数は平均10万件、障害時は法的に30分以内の復旧が求められます。また金融庁への監査ログ提出義務があります。',
  'medium',
  ARRAY['法令遵守と可用性は外せない前提条件', '監査ログがなぜ監視容易性に関係するか考えよう']
),
(
  '病院の患者モニタリングシステム',
  '大病院で患者のバイタルサイン（心拍・血圧・体温）をリアルタイム監視するシステムです。センサーデバイスから1秒ごとにデータが送られます。異常値を検知した場合、担当医師のスマホに3秒以内に通知が届く必要があります。',
  'hard',
  ARRAY['人命に関わるシステムで何を最優先すべきか', 'パフォーマンスと信頼性はどちらが優先か']
),
(
  '全国規模の宅配追跡システム',
  '全国に1000台のトラックが走る宅配会社の荷物追跡システムです。エンドユーザーがスマホで自分の荷物の位置をリアルタイムに確認できます。年末年始は通常の5倍の荷物量になります。',
  'hard',
  ARRAY['ピーク時と平常時でスケールが大きく変わる場合の設計', 'リアルタイム性はどこまで必要か']
);
```

### 3. `groups`（グループ）

```sql
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                       -- グループ名（例：チームA）
  member_names TEXT[],                      -- メンバー名の配列（例：['田中', '佐藤', '鈴木']）
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 4. `selections`（特性選択・理由・トレードオフ）

```sql
CREATE TABLE selections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES sessions(id),

  -- 選んだ特性（最大3つ・優先順位付き）
  choice_1 TEXT,                            -- 1位の特性名
  choice_1_reason TEXT,                     -- 1位の理由
  choice_2 TEXT,                            -- 2位の特性名
  choice_2_reason TEXT,                     -- 2位の理由
  choice_3 TEXT,                            -- 3位の特性名
  choice_3_reason TEXT,                     -- 3位の理由

  -- 捨てた特性（最大2つ）
  tradeoff_1 TEXT,                          -- 捨てた特性1
  tradeoff_1_reason TEXT,                   -- 捨てた理由1
  tradeoff_2 TEXT,                          -- 捨てた特性2
  tradeoff_2_reason TEXT,                   -- 捨てた理由2

  -- 議論サマリー
  discussion_memo TEXT,                     -- グループ内で議論になったこと（自由記述）

  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### アーキテクチャ特性マスタ（コードで定数管理）

テーブルは作らず、フロントエンドの定数として管理する。

```typescript
// lib/characteristics.ts
export const ARCH_CHARACTERISTICS = [
  { id: 'availability',    name: '可用性',         description: 'システムが止まらないこと' },
  { id: 'scalability',     name: 'スケーラビリティ', description: '負荷増加に対応できること' },
  { id: 'performance',     name: 'パフォーマンス',   description: 'レスポンスが速いこと' },
  { id: 'security',        name: 'セキュリティ',     description: '不正アクセスから守られていること' },
  { id: 'maintainability', name: '保守性',          description: 'コードを変更しやすいこと' },
  { id: 'testability',     name: 'テスト容易性',     description: 'テストを書きやすいこと' },
  { id: 'deployability',   name: 'デプロイ容易性',   description: 'リリースを素早く安全に行えること' },
  { id: 'reliability',     name: '信頼性',          description: '正確に動き続けること' },
  { id: 'extensibility',   name: '拡張性',          description: '新機能を追加しやすいこと' },
  { id: 'observability',   name: '監視容易性',       description: 'システムの状態を把握しやすいこと' },
  { id: 'cost',            name: 'コスト効率',       description: '費用対効果が高いこと' },
  { id: 'compliance',      name: '法令遵守',         description: '規制・法律に対応できていること' },
] as const;
```

---

## 画面設計（5画面）

### 画面1：トップページ（`/`）
- 「セッションを作成する」ボタン
- 「参加コードで参加する」入力欄 + ボタン

### 画面2：セッション作成画面（`/new`）
- セッション名入力
- お題選択（ドロップダウン）
- グループ数選択（2〜6グループ）
- 「作成する」ボタン
- 作成後 → ファシリテーター管理画面へ遷移

### 画面3：ファシリテーター管理画面（`/facilitator/[sessionId]`）
- セッション名・参加コード（大きく表示）
- お題の表示・非表示切り替え
- グループ一覧と各グループの提出状況（未提出 / 提出済み）
- 各グループの回答を確認するリンク
- 「セッションを終了する」ボタン

### 画面4：参加者ワーク画面（`/session/[joinCode]/group/[groupId]`）

**Step 1：グループ参加**
- セッション名・お題表示
- メンバー名入力（最大5人分）
- 「ワークを始める」ボタン

**Step 2：特性カード選択**
- 12枚の特性カードをグリッド表示
- タップ/クリックで選択（選択済みは色変化）
- 最大3枚まで選択可能
- 選択した順に自動で1位・2位・3位が割り当てられる

**Step 3：理由入力**
- 選んだ3つの特性それぞれに理由入力欄
- 捨てた特性から最大2つを選んで理由入力
- 「グループで一番議論になったこと」自由記述欄

**Step 4：確認・提出**
- 入力内容の確認画面
- 「提出する」ボタン → 発表用サマリーへ遷移

### 画面5：発表用サマリー（`/session/[joinCode]/group/[groupId]/summary`）
- グループ名・メンバー名
- 選んだ特性（1〜3位）と理由
- 捨てた特性と理由
- 議論メモ
- 印刷しやすいレイアウト（`@media print`対応）

---

## 開発手順（この順番でClaude Codeに指示する）

### Step 1：プロジェクト初期化
```
Next.js 14プロジェクトをTypeScript + Tailwind CSSで新規作成してください。
App Routerを使用します。
shadcn/uiも初期設定してください。
```

### Step 2：Supabase設定 + DB構築
```
Supabaseクライアントを設定し、以下のSQLでテーブルを作成するマイグレーションファイルを作成してください。
（上記のsessions / kata_problems / groups / selectionsのSQLをそのまま貼り付ける）
また kata_problems の初期データ投入SQLも作成してください。
```

### Step 3：定数ファイル作成
```
lib/characteristics.ts を作成し、12種類のアーキテクチャ特性の定数を定義してください。
（上記の ARCH_CHARACTERISTICS 定数をそのまま貼り付ける）
```

### Step 4：トップページ + セッション作成画面
```
以下の2画面を実装してください。
- トップページ（/）：セッション作成ボタン・参加コード入力欄
- セッション作成画面（/new）：セッション名・お題選択・グループ数選択・作成ボタン
作成時にsessionsテーブルにINSERTし、6桁のランダムな参加コードを生成してください。
作成後はファシリテーター管理画面（/facilitator/[sessionId]）にリダイレクトしてください。
```

### Step 5：ファシリテーター管理画面
```
/facilitator/[sessionId] 画面を実装してください。
- セッション名と参加コードを大きく表示
- お題タイトルと説明文の表示
- groupsテーブルからグループ一覧を取得して表示
- 各グループのselectionsテーブルの提出状況（レコードあり=提出済み）を表示
- 30秒ごとに自動リロードして提出状況を更新
```

### Step 6：参加者ワーク画面（Step1〜4）
```
/session/[joinCode]/group/[groupId] 画面を実装してください。
4つのステップをステート管理で切り替えるシングルページ構成にしてください。

Step1：メンバー名入力（最大5人、groups.member_namesにUPDATE）
Step2：特性カード選択UI（12枚グリッド、最大3枚選択）
Step3：理由・トレードオフ・議論メモ入力フォーム
Step4：確認画面 → 「提出する」でselectionsテーブルにINSERT → サマリー画面へ遷移
```

### Step 7：発表用サマリー画面
```
/session/[joinCode]/group/[groupId]/summary 画面を実装してください。
selectionsテーブルからデータを取得して表示します。
印刷時に綺麗に出力されるよう @media print スタイルも設定してください。
```

---

## 環境変数

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 非機能要件

- レスポンシブ対応（PC・スマホブラウザ）
- Supabase RLSは無効（MVPのため）
- ブラウザ対応：Chrome / Safari 最新版

---

## 将来対応（今は実装不要）

- ファシリテーター認証
- Supabase Realtimeによるリアルタイム同期
- Gemini APIによるAIフィードバック
- グループ間の回答比較画面
- カスタムお題追加機能
- マルチテナント・料金プラン
