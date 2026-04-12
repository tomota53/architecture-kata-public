export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 背景のグリッド */}
      <defs>
        <linearGradient id="heroGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id="heroGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="heroGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" rx="16" fill="url(#heroGrad1)" />

      {/* ノード群 */}
      <rect x="50" y="30" width="60" height="40" rx="8" fill="url(#heroGrad2)" opacity="0.9" />
      <rect x="55" y="38" width="20" height="3" rx="1.5" fill="white" opacity="0.7" />
      <rect x="55" y="45" width="35" height="3" rx="1.5" fill="white" opacity="0.4" />
      <rect x="55" y="52" width="25" height="3" rx="1.5" fill="white" opacity="0.4" />

      <rect x="170" y="15" width="60" height="40" rx="8" fill="url(#heroGrad2)" opacity="0.7" />
      <rect x="175" y="23" width="20" height="3" rx="1.5" fill="white" opacity="0.7" />
      <rect x="175" y="30" width="35" height="3" rx="1.5" fill="white" opacity="0.4" />
      <rect x="175" y="37" width="25" height="3" rx="1.5" fill="white" opacity="0.4" />

      <rect x="290" y="35" width="60" height="40" rx="8" fill="url(#heroGrad2)" opacity="0.8" />
      <rect x="295" y="43" width="20" height="3" rx="1.5" fill="white" opacity="0.7" />
      <rect x="295" y="50" width="35" height="3" rx="1.5" fill="white" opacity="0.4" />
      <rect x="295" y="57" width="25" height="3" rx="1.5" fill="white" opacity="0.4" />

      {/* 中段ノード */}
      <rect x="110" y="100" width="70" height="45" rx="8" fill="url(#heroGrad2)" opacity="0.85" />
      <circle cx="125" cy="115" r="6" fill="white" opacity="0.3" />
      <rect x="137" y="112" width="30" height="3" rx="1.5" fill="white" opacity="0.6" />
      <rect x="137" y="119" width="25" height="3" rx="1.5" fill="white" opacity="0.3" />
      <rect x="117" y="130" width="50" height="3" rx="1.5" fill="white" opacity="0.2" />

      <rect x="220" y="95" width="70" height="45" rx="8" fill="url(#heroGrad2)" opacity="0.75" />
      <circle cx="235" cy="110" r="6" fill="white" opacity="0.3" />
      <rect x="247" y="107" width="30" height="3" rx="1.5" fill="white" opacity="0.6" />
      <rect x="247" y="114" width="25" height="3" rx="1.5" fill="white" opacity="0.3" />
      <rect x="227" y="125" width="50" height="3" rx="1.5" fill="white" opacity="0.2" />

      {/* 下段ノード（DB風） */}
      <rect x="160" y="160" width="80" height="30" rx="6" fill="url(#heroGrad2)" opacity="0.6" />
      <ellipse cx="200" cy="167" rx="30" ry="5" fill="white" opacity="0.15" />
      <rect x="170" y="172" width="60" height="2" rx="1" fill="white" opacity="0.2" />
      <rect x="170" y="178" width="60" height="2" rx="1" fill="white" opacity="0.15" />

      {/* 接続線 */}
      <line x1="80" y1="70" x2="145" y2="100" stroke="url(#heroGrad3)" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="200" y1="55" x2="145" y2="100" stroke="url(#heroGrad3)" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="200" y1="55" x2="255" y2="95" stroke="url(#heroGrad3)" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="320" y1="75" x2="255" y2="95" stroke="url(#heroGrad3)" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="145" y1="145" x2="200" y2="160" stroke="url(#heroGrad3)" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="255" y1="140" x2="200" y2="160" stroke="url(#heroGrad3)" strokeWidth="1.5" strokeDasharray="4 3" />

      {/* 接続点 */}
      <circle cx="80" cy="70" r="3" fill="#6366f1" opacity="0.6" />
      <circle cx="200" cy="55" r="3" fill="#6366f1" opacity="0.6" />
      <circle cx="320" cy="75" r="3" fill="#6366f1" opacity="0.6" />
      <circle cx="145" cy="100" r="3" fill="#6366f1" opacity="0.6" />
      <circle cx="255" cy="95" r="3" fill="#6366f1" opacity="0.6" />
      <circle cx="200" cy="160" r="3" fill="#6366f1" opacity="0.6" />
    </svg>
  );
}
