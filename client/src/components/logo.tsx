interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 100, className = "" }: LogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 200 200" 
      className={className}
      style={{ flexShrink: 0 }}
    >
      {/* Outer circle with thick dark blue border */}
      <circle cx="100" cy="100" r="95" fill="none" stroke="#1e3a5f" strokeWidth="8"/>
      
      {/* Background segments */}
      <path d="M 100,100 L 100,5 A 95,95 0 0,1 167,33 Z" fill="#a855f7"/>
      <path d="M 100,100 L 167,33 A 95,95 0 0,1 167,167 Z" fill="#ec4899"/>  
      <path d="M 100,100 L 167,167 A 95,95 0 0,1 33,167 Z" fill="#3b82f6"/>
      <path d="M 100,100 L 33,167 A 95,95 0 0,1 33,33 Z" fill="#fbbf24"/>
      
      {/* Center person - head and shoulders */}
      <ellipse cx="100" cy="70" rx="28" ry="32" fill="#06b6d4" stroke="#1e3a5f" strokeWidth="5"/>
      <path d="M 65,95 Q 65,120 100,135 Q 135,120 135,95 Z" fill="#06b6d4" stroke="#1e3a5f" strokeWidth="5"/>
      
      {/* Eye - top left (purple) */}
      <ellipse cx="62" cy="52" rx="18" ry="12" fill="#fff" stroke="#1e3a5f" strokeWidth="5"/>
      <circle cx="62" cy="52" r="7" fill="#1e3a5f"/>
      
      {/* Ear - top right (pink) */}
      <path d="M 138,42 C 130,40 125,45 125,52 C 125,59 130,64 138,62 C 146,60 151,55 151,48 C 151,41 146,44 138,42" 
            fill="#fff" stroke="#1e3a5f" strokeWidth="5"/>
      
      {/* Star - bottom left (yellow) */}
      <path d="M 62,148 L 65,155 L 73,155 L 67,160 L 70,168 L 62,163 L 54,168 L 57,160 L 51,155 L 59,155 Z" 
            fill="#fff" stroke="#1e3a5f" strokeWidth="5"/>
      
      {/* Lightning - bottom right (blue) */}
      <path d="M 133,138 L 143,150 L 138,153 L 145,163 L 131,151 L 136,148 Z" 
            fill="#fff" stroke="#1e3a5f" strokeWidth="5"/>
    </svg>
  );
}
