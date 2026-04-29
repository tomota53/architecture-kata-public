-- reports テーブルに status カラムを追加
-- 既存のレポートは提出済みとしてマーク
ALTER TABLE reports ADD COLUMN status TEXT NOT NULL DEFAULT 'draft';
UPDATE reports SET status = 'submitted';
