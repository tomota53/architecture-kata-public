"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ARCH_COMPONENTS,
  COMPONENT_CATEGORIES,
} from "@/lib/components-master";
import {
  Monitor,
  Smartphone,
  Globe,
  Server,
  Code,
  GitBranch,
  Clock,
  Lock,
  Database,
  Layers,
  Zap,
  ArrowRightLeft,
  HardDrive,
  Search,
  Shield,
  Activity,
  GitMerge,
  Bell,
  Mail,
  CreditCard,
  Plug,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Monitor,
  Smartphone,
  Globe,
  Server,
  Code,
  GitBranch,
  Clock,
  Lock,
  Database,
  Layers,
  Zap,
  ArrowRightLeft,
  HardDrive,
  Search,
  Shield,
  Activity,
  GitMerge,
  Bell,
  Mail,
  CreditCard,
  Plug,
};

type Props = {
  selectedIds: string[];
  onToggle: (id: string) => void;
  reason: string;
  onReasonChange: (reason: string) => void;
};

export function ComponentSelector({
  selectedIds,
  onToggle,
  reason,
  onReasonChange,
}: Props) {
  return (
    <div className="space-y-6">
      {COMPONENT_CATEGORIES.map((category) => {
        const components = ARCH_COMPONENTS.filter(
          (c) => c.category === category.id
        );
        return (
          <div key={category.id}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              {category.label}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {components.map((comp) => {
                const isSelected = selectedIds.includes(comp.id);
                const Icon = ICON_MAP[comp.icon];
                return (
                  <button
                    key={comp.id}
                    type="button"
                    onClick={() => onToggle(comp.id)}
                    className={`flex items-start gap-3 p-3 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {Icon && (
                      <Icon
                        className={`w-5 h-5 shrink-0 mt-0.5 ${
                          isSelected ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-sm leading-tight">
                        {comp.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
                        {comp.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* 選択中リスト */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-muted rounded-md">
          <p className="text-sm font-semibold mb-2">
            選択中（{selectedIds.length}件）
          </p>
          <div className="flex flex-wrap gap-1.5">
            {selectedIds.map((id) => {
              const comp = ARCH_COMPONENTS.find((c) => c.id === id);
              return (
                <Badge key={id} variant="secondary" className="text-xs">
                  {comp?.name}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* 理由入力 */}
      <div className="space-y-2">
        <Label>なぜこの構成にしたか（全体的な理由）</Label>
        <Textarea
          placeholder="例：トラフィックの増加に対応するためロードバランサーとキャッシュを採用しました。決済は外部サービスに任せることでセキュリティリスクを下げています。"
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );
}
