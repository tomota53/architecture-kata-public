export function WorkIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="workGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      {/* ミニノード */}
      <rect x="5" y="10" width="20" height="14" rx="3" fill="#6366f1" opacity="0.15" />
      <rect x="35" y="5" width="20" height="14" rx="3" fill="#8b5cf6" opacity="0.12" />
      <rect x="65" y="10" width="20" height="14" rx="3" fill="#6366f1" opacity="0.15" />
      <rect x="95" y="8" width="20" height="14" rx="3" fill="#8b5cf6" opacity="0.12" />
      {/* 接続線 */}
      <line x1="25" y1="17" x2="35" y2="12" stroke="#6366f1" strokeWidth="1" opacity="0.2" />
      <line x1="55" y1="12" x2="65" y2="17" stroke="#6366f1" strokeWidth="1" opacity="0.2" />
      <line x1="85" y1="17" x2="95" y2="15" stroke="#6366f1" strokeWidth="1" opacity="0.2" />
      {/* 下部の装飾線 */}
      <line x1="10" y1="32" x2="110" y2="32" stroke="url(#workGrad)" strokeWidth="1.5" />
      <circle cx="15" cy="32" r="2" fill="#6366f1" opacity="0.3" />
      <circle cx="45" cy="32" r="2" fill="#8b5cf6" opacity="0.3" />
      <circle cx="75" cy="32" r="2" fill="#6366f1" opacity="0.3" />
      <circle cx="105" cy="32" r="2" fill="#8b5cf6" opacity="0.3" />
    </svg>
  );
}
