export function CharacteristicsIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="charBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id="charFill1" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="charFill2" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <rect width="200" height="80" rx="12" fill="url(#charBg)" />

      {/* レーダー風の円 */}
      <g transform="translate(45 40)">
        <circle r="28" fill="none" stroke="#6366f1" strokeOpacity="0.15" strokeWidth="1" />
        <circle r="20" fill="none" stroke="#6366f1" strokeOpacity="0.15" strokeWidth="1" />
        <circle r="12" fill="none" stroke="#6366f1" strokeOpacity="0.15" strokeWidth="1" />
        <line x1="-28" y1="0" x2="28" y2="0" stroke="#6366f1" strokeOpacity="0.1" />
        <line x1="0" y1="-28" x2="0" y2="28" stroke="#6366f1" strokeOpacity="0.1" />
        <line x1="-20" y1="-20" x2="20" y2="20" stroke="#6366f1" strokeOpacity="0.1" />
        <line x1="-20" y1="20" x2="20" y2="-20" stroke="#6366f1" strokeOpacity="0.1" />
        {/* レーダープロット */}
        <polygon
          points="0,-22 18,-8 14,18 -14,16 -20,-6"
          fill="url(#charFill1)"
          fillOpacity="0.35"
          stroke="url(#charFill1)"
          strokeWidth="1.5"
        />
        <circle cx="0" cy="-22" r="2" fill="#6366f1" />
        <circle cx="18" cy="-8" r="2" fill="#6366f1" />
        <circle cx="14" cy="18" r="2" fill="#6366f1" />
        <circle cx="-14" cy="16" r="2" fill="#6366f1" />
        <circle cx="-20" cy="-6" r="2" fill="#6366f1" />
      </g>

      {/* 棒グラフ風 */}
      <g transform="translate(105 18)">
        <rect x="0" y="30" width="8" height="20" rx="2" fill="url(#charFill1)" opacity="0.8" />
        <rect x="14" y="14" width="8" height="36" rx="2" fill="url(#charFill2)" opacity="0.8" />
        <rect x="28" y="22" width="8" height="28" rx="2" fill="url(#charFill1)" opacity="0.8" />
        <rect x="42" y="6" width="8" height="44" rx="2" fill="url(#charFill2)" opacity="0.8" />
        <rect x="56" y="18" width="8" height="32" rx="2" fill="url(#charFill1)" opacity="0.8" />
        <rect x="70" y="26" width="8" height="24" rx="2" fill="url(#charFill2)" opacity="0.8" />
        <line x1="0" y1="52" x2="80" y2="52" stroke="#6366f1" strokeOpacity="0.3" strokeWidth="1" />
      </g>
    </svg>
  );
}
