export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} xmlns="http://www.w3.org/2000/svg" aria-label="OneDemand 360">
      <defs>
        <linearGradient id="od-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFB066" />
          <stop offset="55%" stopColor="#ED7625" />
          <stop offset="100%" stopColor="#B8470F" />
        </linearGradient>
        <radialGradient id="od-glow" cx="0.3" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="#FFD9B8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ED7625" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="10" fill="url(#od-grad)" />
      <rect x="1" y="1" width="38" height="38" rx="10" fill="url(#od-glow)" />
      {/* orbital ring */}
      <circle cx="20" cy="20" r="11" fill="none" stroke="white" strokeOpacity="0.55" strokeWidth="1.4" />
      <circle cx="20" cy="20" r="11" fill="none" stroke="white" strokeWidth="1.4" strokeDasharray="4 60" transform="rotate(-30 20 20)" />
      {/* core dot */}
      <circle cx="20" cy="20" r="4" fill="white" />
      <circle cx="20" cy="20" r="2" fill="#ED7625" />
      {/* satellite */}
      <circle cx="29.4" cy="14.6" r="1.7" fill="white" />
    </svg>
  );
}
