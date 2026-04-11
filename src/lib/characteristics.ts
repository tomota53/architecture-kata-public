export const ARCH_CHARACTERISTICS = [
  { id: 'availability',    name: '可用性',         description: 'システムが止まらないこと' },
  { id: 'scalability',     name: 'スケーラビリティ', description: '負荷増加に対応できること' },
  { id: 'performance',     name: 'パフォーマンス',   description: 'レスポンスが速いこと' },
  { id: 'security',        name: 'セキュリティ',     description: '不正アクセスから守られていること' },
  { id: 'maintainability', name: '保守性',          description: 'コードを変更しやすいこと' },
  { id: 'testability',     name: 'テスト容易性',     description: 'テストを書きやすいこと' },
  { id: 'deployability',   name: 'デプロイ容易性',   description: 'リリースを素早く安全に行えること' },
  { id: 'reliability',     name: '信頼性',          description: '正確に動き続けること' },
  { id: 'extensibility',   name: '拡張性',          description: '新機能を追加しやすいこと' },
  { id: 'observability',   name: '監視容易性',       description: 'システムの状態を把握しやすいこと' },
  { id: 'cost',            name: 'コスト効率',       description: '費用対効果が高いこと' },
  { id: 'compliance',      name: '法令遵守',         description: '規制・法律に対応できていること' },
] as const;

export type CharacteristicId = (typeof ARCH_CHARACTERISTICS)[number]['id'];
