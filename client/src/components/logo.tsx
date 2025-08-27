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
      {/* Outer circle with dark blue border */}
      <circle cx="100" cy="100" r="98" fill="none" stroke="#1e2a4a" strokeWidth="4"/>
      
      {/* Background segments - matching your reference image */}
      <path d="M 100,100 L 100,2 A 98,98 0 0,1 171,29 Z" fill="#a855f7"/>
      <path d="M 100,100 L 171,29 A 98,98 0 0,1 171,171 Z" fill="#ec4899"/>  
      <path d="M 100,100 L 171,171 A 98,98 0 0,1 29,171 Z" fill="#3b82f6"/>
      <path d="M 100,100 L 29,171 A 98,98 0 0,1 29,29 Z" fill="#f59e0b"/>
      
      {/* Center person silhouette - larger and more prominent */}
      <ellipse cx="100" cy="80" rx="28" ry="35" fill="#06b6d4"/>
      <ellipse cx="100" cy="125" rx="35" ry="45" fill="#06b6d4"/>
      
      {/* Eye icon - top left */}
      <g transform="translate(58,42)">
        <ellipse cx="0" cy="0" rx="18" ry="12" fill="#fff" stroke="#1e2a4a" strokeWidth="3"/>
        <circle cx="0" cy="0" r="8" fill="#1e2a4a"/>
      </g>
      
      {/* Ear icon - top right */}
      <g transform="translate(142,42)">
        <path d="M -12,-12 C -12,-12 -6,-18 6,-12 C 12,-6 12,6 6,12 C -6,18 -12,12 -12,12" 
              fill="#fff" stroke="#1e2a4a" strokeWidth="3"/>
      </g>
      
      {/* Star icon - bottom left */}
      <g transform="translate(58,158)">
        <path d="M 0,-12 L 3,-3 L 12,-3 L 5,3 L 8,12 L 0,6 L -8,12 L -5,3 L -12,-3 L -3,-3 Z" 
              fill="#fff" stroke="#1e2a4a" strokeWidth="3"/>
      </g>
      
      {/* Lightning bolt icon - bottom right */}
      <g transform="translate(142,158)">
        <path d="M -9,-12 L 9,-3 L 0,0 L 9,12 L -9,3 L 0,0 Z" 
              fill="#fff" stroke="#1e2a4a" strokeWidth="3"/>
      </g>
    </svg>
  );
}
