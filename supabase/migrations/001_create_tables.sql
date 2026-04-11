-- ========================================
-- 1. kata_problems（お題）
-- ========================================
CREATE TABLE kata_problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'medium'
    CHECK (difficulty IN ('easy', 'medium', 'hard')),
  hints TEXT[]
);

-- ========================================
-- 2. sessions（セッション）
-- ========================================
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  join_code VARCHAR(6) NOT NULL UNIQUE,
  kata_problem_id UUID REFERENCES kata_problems(id),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'finished')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ========================================
-- 3. groups（グループ）
-- ========================================
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  member_names TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ========================================
-- 4. selections（特性選択・理由・トレードオフ）
-- ========================================
CREATE TABLE selections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES sessions(id),

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

  -- 議論サマリー
  discussion_memo TEXT,

  updated_at TIMESTAMPTZ DEFAULT now()
);
