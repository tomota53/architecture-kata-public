export function TradeoffIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="tradeBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="tradeLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="tradeRight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <rect width="200" height="80" rx="12" fill="url(#tradeBg)" />

      {/* 天秤の支柱 */}
      <line x1="100" y1="20" x2="100" y2="68" stroke="#6366f1" strokeWidth="2" opacity="0.5" />
      <rect x="86" y="68" width="28" height="4" rx="1" fill="#6366f1" opacity="0.5" />
      <circle cx="100" cy="20" r="3" fill="#6366f1" />

      {/* 天秤の腕 */}
      <line x1="40" y1="28" x2="160" y2="20" stroke="#6366f1" strokeWidth="2" opacity="0.6" />

      {/* 左の皿（選んだ） */}
      <line x1="40" y1="28" x2="32" y2="40" stroke="#6366f1" strokeWidth="1" opacity="0.4" />
      <line x1="40" y1="28" x2="48" y2="40" stroke="#6366f1" strokeWidth="1" opacity="0.4" />
      <ellipse cx="40" cy="42" rx="18" ry="3" fill="url(#tradeLeft)" opacity="0.85" />
      <rect x="26" y="32" width="8" height="10" rx="1" fill="url(#tradeLeft)" />
      <rect x="36" y="28" width="8" height="14" rx="1" fill="url(#tradeLeft)" />
      <rect x="46" y="34" width="8" height="8" rx="1" fill="url(#tradeLeft)" />
      <text x="40" y="56" textAnchor="middle" fontSize="7" fill="#6366f1" fontWeight="700">CHOOSE</text>

      {/* 右の皿（捨てた） */}
      <line x1="160" y1="20" x2="152" y2="32" stroke="#6366f1" strokeWidth="1" opacity="0.4" />
      <line x1="160" y1="20" x2="168" y2="32" stroke="#6366f1" strokeWidth="1" opacity="0.4" />
      <ellipse cx="160" cy="34" rx="14" ry="2.5" fill="url(#tradeRight)" opacity="0.7" />
      <rect x="152" y="28" width="6" height="6" rx="1" fill="url(#tradeRight)" opacity="0.7" />
      <rect x="161" y="26" width="6" height="8" rx="1" fill="url(#tradeRight)" opacity="0.7" />
      <text x="160" y="48" textAnchor="middle" fontSize="7" fill="#f43f5e" fontWeight="700">TRADE</text>
    </svg>
  );
}
