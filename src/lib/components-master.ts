export type ComponentCategory = 'frontend' | 'backend' | 'data' | 'infra' | 'external';

export type ArchComponent = {
  id: string;
  name: string;
  description: string;
  category: ComponentCategory;
  icon: string;
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
