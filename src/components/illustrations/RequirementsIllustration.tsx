export function RequirementsIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="reqBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="reqFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect width="200" height="80" rx="12" fill="url(#reqBg)" />

      {/* 質問バブル（左） */}
      <g>
        <path
          d="M 14 16 L 14 38 Q 14 42 18 42 L 64 42 Q 68 42 68 38 L 68 22 Q 68 16 64 16 L 26 16 Z M 24 42 L 22 50 L 32 42"
          fill="url(#reqFill)"
          fillOpacity="0.85"
        />
        <text x="20" y="25" fontSize="6" fontWeight="700" fill="white">Q</text>
        <line x1="28" y1="22" x2="60" y2="22" stroke="white" strokeOpacity="0.8" strokeWidth="1.5" />
        <line x1="20" y1="29" x2="60" y2="29" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" />
        <line x1="20" y1="35" x2="55" y2="35" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" />
      </g>

      {/* 回答バブル（右） */}
      <g>
        <path
          d="M 132 30 L 132 52 Q 132 56 136 56 L 182 56 Q 186 56 186 52 L 186 36 Q 186 30 182 30 L 144 30 Z M 178 56 L 180 64 L 168 56"
          fill="#06b6d4"
          fillOpacity="0.85"
        />
        <text x="138" y="39" fontSize="6" fontWeight="700" fill="white">A</text>
        <line x1="146" y1="36" x2="178" y2="36" stroke="white" strokeOpacity="0.8" strokeWidth="1.5" />
        <line x1="138" y1="43" x2="178" y2="43" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" />
        <line x1="138" y1="49" x2="172" y2="49" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" />
      </g>

      {/* 中央のチェックリスト */}
      <g transform="translate(82 18)">
        <rect x="0" y="0" width="36" height="44" rx="3" fill="white" fillOpacity="0.7" stroke="#6366f1" strokeOpacity="0.3" strokeWidth="1" />
        <circle cx="6" cy="8" r="2" fill="#6366f1" />
        <line x1="11" y1="8" x2="32" y2="8" stroke="#6366f1" strokeOpacity="0.4" strokeWidth="1.5" />
        <circle cx="6" cy="16" r="2" fill="#6366f1" />
        <line x1="11" y1="16" x2="32" y2="16" stroke="#6366f1" strokeOpacity="0.4" strokeWidth="1.5" />
        <circle cx="6" cy="24" r="2" fill="#6366f1" opacity="0.5" />
        <line x1="11" y1="24" x2="32" y2="24" stroke="#6366f1" strokeOpacity="0.3" strokeWidth="1.5" />
        <circle cx="6" cy="32" r="2" fill="#6366f1" opacity="0.3" />
        <line x1="11" y1="32" x2="28" y2="32" stroke="#6366f1" strokeOpacity="0.2" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
