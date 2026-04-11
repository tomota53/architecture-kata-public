# アーキテクチャ・カタ研修アプリ 追加機能：システム構成コンポーネント選択

## 追加機能の概要

既存の「アーキテクチャ特性選択」の後に、**システム構成に使うコンポーネントを選択して理由を書く**ステップを追加する。
構成図は描かず、チェックボックス形式で選ぶだけにすることで、新卒でも迷わず進められるようにする。

---

## 既存画面への追加位置

参加者ワーク画面（`/session/[joinCode]/group/[groupId]`）の**Step 3とStep 4の間**に新しいStep 3.5として追加する。

```
Step 1：メンバー名入力         （既存）
Step 2：特性カード選択         （既存）
Step 3：理由・トレードオフ入力  （既存）
Step 3.5：コンポーネント選択   ★新規追加
Step 4：確認・提出             （既存）
```

---

## コンポーネントマスタ定数（フロント管理）

`lib/components-master.ts` を新規作成してください。

```typescript
export type ComponentCategory = 'frontend' | 'backend' | 'data' | 'infra' | 'external';

export type ArchComponent = {
  id: string;
  name: string;
  description: string;
  category: ComponentCategory;
  icon: string; // lucide-reactのアイコン名
};

export const COMPONENT_CATEGORIES: { id: ComponentCategory; label: string }[] = [
  { id: 'frontend',  label: 'フロントエンド' },
  { id: 'backend',   label: 'バックエンド' },
  { id: 'data',      label: 'データ管理' },
  { id: 'infra',     label: 'インフラ・ネットワーク' },
  { id: 'external',  label: '外部連携' },
];

export const ARCH_COMPONENTS: ArchComponent[] = [
  // フロントエンド
  { id: 'web_browser',   name: 'Webブラウザ',     description: 'PCやスマホのブラウザからアクセス',       category: 'frontend', icon: 'Monitor' },
  { id: 'mobile_app',    name: 'モバイルアプリ',   description: 'iOS / Android ネイティブアプリ',        category: 'frontend', icon: 'Smartphone' },
  { id: 'cdn',           name: 'CDN',             description: '静的ファイルを世界中から高速配信',        category: 'frontend', icon: 'Globe' },

  // バックエンド
  { id: 'web_server',    name: 'Webサーバー',      description: 'HTMLや静的コンテンツを返すサーバー',     category: 'backend',  icon: 'Server' },
  { id: 'api_server',    name: 'APIサーバー',      description: 'ビジネスロジックを処理するサーバー',     category: 'backend',  icon: 'Code' },
  { id: 'load_balancer', name: 'ロードバランサー',  description: 'リクエストを複数サーバーに振り分ける',   category: 'backend',  icon: 'GitBranch' },
  { id: 'batch_server',  name: 'バッチサーバー',   description: '定期処理・夜間処理を実行するサーバー',   category: 'backend',  icon: 'Clock' },
  { id: 'auth_server',   name: '認証サーバー',     description: 'ログイン・権限管理を担当するサーバー',   category: 'backend',  icon: 'Lock' },

  // データ管理
  { id: 'rdb',           name: 'RDB',             description: 'PostgreSQL / MySQLなどのリレーショナルDB', category: 'data', icon: 'Database' },
  { id: 'nosql',         name: 'NoSQL DB',        description: 'MongoDB / DynamoDBなどの非リレーショナルDB', category: 'data', icon: 'Layers' },
  { id: 'cache',         name: 'キャッシュ',       description: 'RedisなどのインメモリKVS',               category: 'data', icon: 'Zap' },
  { id: 'message_queue', name: 'メッセージキュー', description: '非同期処理のためのキュー（RabbitMQなど）', category: 'data', icon: 'ArrowRightLeft' },
  { id: 'object_storage',name: 'オブジェクトストレージ', description: '画像・ファイル保存（S3など）',     category: 'data', icon: 'HardDrive' },
  { id: 'search_engine', name: '検索エンジン',     description: '全文検索（Elasticsearchなど）',          category: 'data', icon: 'Search' },

  // インフラ・ネットワーク
  { id: 'firewall',      name: 'ファイアウォール', description: '不正アクセスをブロックするネットワーク機器', category: 'infra', icon: 'Shield' },
  { id: 'monitoring',    name: '監視・ログ基盤',   description: 'システムの状態監視・ログ収集',            category: 'infra', icon: 'Activity' },
  { id: 'ci_cd',         name: 'CI/CDパイプライン', description: '自動テスト・自動デプロイの仕組み',       category: 'infra', icon: 'GitMerge' },

  // 外部連携
  { id: 'push_notify',   name: 'プッシュ通知',     description: 'FCM / APNsによるスマホ通知',            category: 'external', icon: 'Bell' },
  { id: 'email',         name: 'メール送信',       description: 'SendGridなどのメール配信サービス',        category: 'external', icon: 'Mail' },
  { id: 'payment',       name: '決済サービス',     description: 'Stripe / PayPayなどの外部決済',          category: 'external', icon: 'CreditCard' },
  { id: 'external_api',  name: '外部API',          description: '他社システムとのAPI連携',                category: 'external', icon: 'Plug' },
];
```

---

## DBへの追加カラム

`selections` テーブルに以下のカラムを追加するマイグレーションを作成してください。

```sql
ALTER TABLE selections
  ADD COLUMN component_ids TEXT[],         -- 選択したコンポーネントIDの配列
  ADD COLUMN component_reason TEXT;        -- コンポーネント選択の理由（全体まとめ）
```

---

## 新規Stepのコンポーネント（UI仕様）

`components/ComponentSelector.tsx` を新規作成してください。

### 表示仕様
- カテゴリごとにセクション分けして表示（5カテゴリ）
- 各コンポーネントはカード形式（アイコン・名前・説明）
- クリックで選択状態をトグル（選択済みは青くハイライト）
- 選択数に上限なし（必要なものを全部選べる）
- 選択したコンポーネントは画面下部の「選択中リスト」にも表示

### 理由入力
- コンポーネント選択エリアの下に1つのテキストエリア
- ラベル：「なぜこの構成にしたか（全体的な理由）」
- placeholder：「例：トラフィックの増加に対応するためロードバランサーとキャッシュを採用しました。決済は外部サービスに任せることでセキュリティリスクを下げています。」

### バリデーション
- 最低1つ以上コンポーネントを選択しないと次に進めない
- 理由は任意入力（空でも進める）

---

## 発表用サマリー画面への追加表示

`/session/[joinCode]/group/[groupId]/summary` に以下を追加してください。

```
## 選択したシステムコンポーネント

### フロントエンド
- Webブラウザ
- モバイルアプリ

### バックエンド
- APIサーバー
- ロードバランサー

### データ管理
- RDB
- キャッシュ

### 理由
トラフィックの増加に対応するため...
```

カテゴリごとにグループ化して表示する。
選択していないカテゴリは表示しない。

---

## ファシリテーター管理画面への追加表示

各グループの回答確認モーダル or 展開表示に、コンポーネント選択内容も表示してください。

---

## 実装手順

### Step 1：定数ファイル作成
```
lib/components-master.ts を上記の内容で作成してください。
```

### Step 2：DBマイグレーション
```
selectionsテーブルに component_ids（TEXT配列）と component_reason（TEXT）カラムを追加するマイグレーションSQLを作成・実行してください。
```

### Step 3：ComponentSelectorコンポーネント作成
```
components/ComponentSelector.tsx を作成してください。
ARCH_COMPONENTS定数をカテゴリごとにグループ化して表示し、
クリックで選択状態をトグルするUIを実装してください。
選択済みコンポーネントは青くハイライトし、画面下部に選択中リストを表示してください。
```

### Step 4：ワーク画面にStepを追加
```
/session/[joinCode]/group/[groupId] のステップ管理に新しいStep（コンポーネント選択）を追加してください。
既存のStep3（理由入力）の後、Step4（確認画面）の前に挿入してください。
```

### Step 5：提出データにコンポーネント情報を含める
```
selections テーブルへのINSERT処理に component_ids と component_reason を追加してください。
```

### Step 6：サマリー画面に表示追加
```
サマリー画面でselectionsからcomponent_idsを取得し、
ARCH_COMPONENTS定数と突合してカテゴリ別に表示してください。
```

### Step 7：ファシリテーター画面に表示追加
```
ファシリテーター管理画面のグループ回答確認部分に、コンポーネント選択内容も表示してください。
```

---

## 完成後のワーク画面フロー

```
Step 1：メンバー名入力
　↓
Step 2：アーキテクチャ特性カード選択（12枚→最大3つ）
　↓
Step 3：特性の理由・トレードオフ入力
　↓
Step 3.5：システムコンポーネント選択 ★新規
　　- 20種類のコンポーネントからチェック形式で選択
　　- 選んだ理由を入力
　↓
Step 4：確認・提出
　↓
発表用サマリー表示
```
