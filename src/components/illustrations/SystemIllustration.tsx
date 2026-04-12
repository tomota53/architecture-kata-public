export function SystemIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="sysBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="sysNode" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <rect width="200" height="80" rx="12" fill="url(#sysBg)" />

      {/* 上段：クライアント */}
      <rect x="20" y="14" width="36" height="14" rx="3" fill="url(#sysNode)" opacity="0.85" />
      <text x="38" y="24" textAnchor="middle" fontSize="7" fill="white" fontWeight="600">Client</text>

      {/* 中段：API + LB */}
      <rect x="80" y="14" width="36" height="14" rx="3" fill="url(#sysNode)" opacity="0.7" />
      <text x="98" y="24" textAnchor="middle" fontSize="7" fill="white" fontWeight="600">LB</text>

      <rect x="60" y="36" width="32" height="14" rx="3" fill="url(#sysNode)" opacity="0.85" />
      <text x="76" y="46" textAnchor="middle" fontSize="7" fill="white" fontWeight="600">API</text>
      <rect x="100" y="36" width="32" height="14" rx="3" fill="url(#sysNode)" opacity="0.85" />
      <text x="116" y="46" textAnchor="middle" fontSize="7" fill="white" fontWeight="600">API</text>

      {/* DB & Cache */}
      <ellipse cx="76" cy="64" rx="16" ry="5" fill="url(#sysNode)" opacity="0.7" />
      <text x="76" y="67" textAnchor="middle" fontSize="6" fill="white" fontWeight="600">DB</text>
      <rect x="100" y="58" width="32" height="12" rx="6" fill="url(#sysNode)" opacity="0.6" />
      <text x="116" y="66" textAnchor="middle" fontSize="6" fill="white" fontWeight="600">Cache</text>

      {/* 外部 */}
      <rect x="150" y="14" width="36" height="14" rx="3" fill="url(#sysNode)" opacity="0.6" />
      <text x="168" y="24" textAnchor="middle" fontSize="7" fill="white" fontWeight="600">CDN</text>
      <rect x="150" y="36" width="36" height="14" rx="3" fill="url(#sysNode)" opacity="0.55" />
      <text x="168" y="46" textAnchor="middle" fontSize="7" fill="white" fontWeight="600">Auth</text>
      <rect x="150" y="58" width="36" height="14" rx="3" fill="url(#sysNode)" opacity="0.55" />
      <text x="168" y="68" textAnchor="middle" fontSize="6" fill="white" fontWeight="600">Pay</text>

      {/* 接続線 */}
      <line x1="56" y1="21" x2="80" y2="21" stroke="#06b6d4" strokeWidth="1" opacity="0.4" />
      <line x1="116" y1="21" x2="150" y2="21" stroke="#06b6d4" strokeWidth="1" opacity="0.4" />
      <line x1="98" y1="28" x2="76" y2="36" stroke="#06b6d4" strokeWidth="1" opacity="0.4" />
      <line x1="98" y1="28" x2="116" y2="36" stroke="#06b6d4" strokeWidth="1" opacity="0.4" />
      <line x1="76" y1="50" x2="76" y2="59" stroke="#06b6d4" strokeWidth="1" opacity="0.4" />
      <line x1="116" y1="50" x2="116" y2="58" stroke="#06b6d4" strokeWidth="1" opacity="0.4" />
      <line x1="132" y1="43" x2="150" y2="43" stroke="#06b6d4" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}
