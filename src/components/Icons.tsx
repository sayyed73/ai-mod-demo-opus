/** Small original line icons. */
type P = { size?: number; color?: string; strokeWidth?: number };

export const CheckIcon: React.FC<P> = ({ size = 20, color = "currentColor", strokeWidth = 3 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 12.5 10 17.5 19 7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PauseIcon: React.FC<P> = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="6" y="5" width="4" height="14" rx="1.5" fill={color} />
    <rect x="14" y="5" width="4" height="14" rx="1.5" fill={color} />
  </svg>
);

export const AlertIcon: React.FC<P> = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill={color} />
    <rect x="10.8" y="6" width="2.4" height="8" rx="1.2" fill="white" />
    <circle cx="12" cy="17.3" r="1.4" fill="white" />
  </svg>
);

export const SparkIcon: React.FC<P> = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2.5c.6 4.8 2.7 6.9 7.5 7.5-4.8.6-6.9 2.7-7.5 7.5-.6-4.8-2.7-6.9-7.5-7.5 4.8-.6 6.9-2.7 7.5-7.5Z" fill={color} />
    <path d="M19 15.5c.3 2 1.1 2.8 3 3-1.9.3-2.7 1.1-3 3-.3-1.9-1.1-2.7-3-3 1.9-.2 2.7-1 3-3Z" fill={color} />
  </svg>
);

export const PersonIcon: React.FC<P> = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" fill={color} />
    <path d="M4 20c.8-4 4-6 8-6s7.2 2 8 6" fill={color} />
  </svg>
);

export const BoxIcon: React.FC<P> = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <path d="M3.5 7.5 12 12l8.5-4.5M12 12v9" stroke={color} strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

export const DocIcon: React.FC<P> = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="5" y="3" width="14" height="18" rx="3" stroke={color} strokeWidth="2" />
    <path d="M9 8h6M9 12h6M9 16h3" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const SearchIcon: React.FC<P> = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="6.5" stroke={color} strokeWidth="2.2" />
    <path d="m16 16 4 4" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);
