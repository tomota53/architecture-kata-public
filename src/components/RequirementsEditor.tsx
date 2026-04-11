"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type Requirement = {
  id: string;
  question: string;
  answer: string;
};

const HINTS = [
  "ユーザー数・アクセス規模はどのくらいか",
  "障害時に許容できるダウンタイムはあるか",
  "データの機密性・セキュリティ要件はあるか",
  "予算・開発チームの規模に制約はあるか",
  "将来的なスケールアップの予定はあるか",
  "法律・規制上の制約はあるか",
  "既存システムとの連携は必要か",
];

type Props = {
  value: Requirement[];
  onChange: (requirements: Requirement[]) => void;
};

export function RequirementsEditor({ value, onChange }: Props) {
  const [showHints, setShowHints] = useState(false);

  const addRequirement = () => {
    if (value.length >= 5) return;
    onChange([
      ...value,
      { id: String(Date.now()), question: "", answer: "" },
    ]);
  };

  const removeRequirement = (id: string) => {
    onChange(value.filter((r) => r.id !== id));
  };

  const updateRequirement = (
    id: string,
    field: "question" | "answer",
    text: string
  ) => {
    onChange(
      value.map((r) => (r.id === id ? { ...r, [field]: text } : r))
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          実際の開発では、設計を始める前に顧客へ要件を確認します。このお題に対して「何を確認すべきか」を考え、想定される回答も書いてみましょう。
        </p>
      </div>

      {/* Q&Aカード */}
      {value.map((req, index) => (
        <Card key={req.id}>
          <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
            <CardTitle className="text-sm">質問 #{index + 1}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive h-auto py-1 px-2 text-xs"
              onClick={() => removeRequirement(req.id)}
            >
              削除
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 px-4 pb-4 pt-0">
            <div className="space-y-1">
              <Label className="text-xs">質問</Label>
              <Input
                placeholder="例）同時アクセス数はどのくらいですか？"
                value={req.question}
                onChange={(e) =>
                  updateRequirement(req.id, "question", e.target.value)
                }
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">想定回答</Label>
              <Textarea
                placeholder="例）ピーク時で1万人を想定しています"
                value={req.answer}
                onChange={(e) =>
                  updateRequirement(req.id, "answer", e.target.value)
                }
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {/* 追加ボタン */}
      {value.length < 5 && (
        <Button
          variant="outline"
          className="w-full"
          onClick={addRequirement}
        >
          + 質問を追加する
        </Button>
      )}

      {/* ヒント */}
      <div className="border rounded-lg">
        <button
          type="button"
          className="w-full text-left p-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setShowHints(!showHints)}
        >
          確認すべき観点のヒント {showHints ? "▲" : "▼"}
        </button>
        {showHints && (
          <div className="px-3 pb-3">
            <ul className="space-y-1.5">
              {HINTS.map((hint, i) => (
                <li
                  key={i}
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <span className="text-xs mt-0.5">□</span>
                  {hint}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
