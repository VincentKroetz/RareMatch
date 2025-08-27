interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 40, className = "" }: LogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 120 120" 
      className={className}
      style={{ flexShrink: 0 }}
    >
      {/* Outer circle */}
      <circle cx="60" cy="60" r="58" fill="none" stroke="#1e293b" strokeWidth="4"/>
      
      {/* Background segments */}
      <path d="M 60,60 L 60,2 A 58,58 0 0,1 102,18 Z" fill="#a855f7"/>
      <path d="M 60,60 L 102,18 A 58,58 0 0,1 102,102 Z" fill="#ec4899"/>  
      <path d="M 60,60 L 102,102 A 58,58 0 0,1 18,102 Z" fill="#3b82f6"/>
      <path d="M 60,60 L 18,102 A 58,58 0 0,1 18,18 Z" fill="#fbbf24"/>
      
      {/* Center person silhouette */}
      <ellipse cx="60" cy="45" rx="18" ry="22" fill="#06b6d4"/>
      <ellipse cx="60" cy="75" rx="22" ry="28" fill="#06b6d4"/>
      
      {/* Eye icon */}
      <g transform="translate(35,25)">
        <ellipse cx="0" cy="0" rx="12" ry="8" fill="#fff" stroke="#1e293b" strokeWidth="2"/>
        <circle cx="0" cy="0" r="5" fill="#1e293b"/>
      </g>
      
      {/* Ear icon */}
      <g transform="translate(85,25)">
        <path d="M -8,-8 C -8,-8 -4,-12 4,-8 C 8,-4 8,4 4,8 C -4,12 -8,8 -8,8" 
              fill="#fff" stroke="#1e293b" strokeWidth="2"/>
      </g>
      
      {/* Star icon */}
      <g transform="translate(35,85)">
        <path d="M 0,-8 L 2,-2 L 8,-2 L 3,2 L 5,8 L 0,4 L -5,8 L -3,2 L -8,-2 L -2,-2 Z" 
              fill="#fff" stroke="#1e293b" strokeWidth="2"/>
      </g>
      
      {/* Lightning bolt icon */}
      <g transform="translate(85,85)">
        <path d="M -6,-8 L 6,-2 L 0,0 L 6,8 L -6,2 L 0,0 Z" 
              fill="#fff" stroke="#1e293b" strokeWidth="2"/>
      </g>
    </svg>
  );
}
