-- kata_problemsにプリセットフラグを追加
ALTER TABLE kata_problems
  ADD COLUMN is_preset BOOLEAN NOT NULL DEFAULT false;

-- 既存のお題をプリセットとしてマーク
UPDATE kata_problems SET is_preset = true;
