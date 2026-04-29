-- ========================================
-- reports テーブル（個人ワーク用）
-- sessions + groups + selections を1テーブルに統合
-- ========================================
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kata_problem_id UUID NOT NULL REFERENCES kata_problems(id),
  user_name TEXT NOT NULL,
  share_code TEXT,

  -- 要件確認 Q&A
  requirements JSONB DEFAULT '[]'::jsonb,

  -- 選んだ特性（最大3つ・優先順位付き）
  choice_1 TEXT,
  choice_1_reason TEXT,
  choice_2 TEXT,
  choice_2_reason TEXT,
  choice_3 TEXT,
  choice_3_reason TEXT,

  -- 捨てた特性（最大2つ）
  tradeoff_1 TEXT,
  tradeoff_1_reason TEXT,
  tradeoff_2 TEXT,
  tradeoff_2_reason TEXT,

  -- 振り返りメモ
  discussion_memo TEXT,

  -- システムコンポーネント
  component_ids TEXT[],
  component_reason TEXT,

  created_at TIMESTAMPTZ DEFAULT now()
);

-- 共有コード検索用の部分インデックス
CREATE INDEX idx_reports_share_code ON reports (share_code) WHERE share_code IS NOT NULL;
