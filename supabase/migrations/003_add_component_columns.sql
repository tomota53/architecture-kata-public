-- selectionsテーブルにコンポーネント選択カラムを追加
ALTER TABLE selections
  ADD COLUMN component_ids TEXT[],
  ADD COLUMN component_reason TEXT;
