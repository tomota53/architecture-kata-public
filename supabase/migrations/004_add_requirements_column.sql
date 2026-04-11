-- selectionsテーブルに要件確認カラムを追加
ALTER TABLE selections
  ADD COLUMN requirements JSONB DEFAULT '[]'::jsonb;
