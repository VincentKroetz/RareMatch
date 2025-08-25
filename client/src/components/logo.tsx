interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 40, className = "" }: LogoProps) {
  return (
    <div 
      className={`font-bold text-primary flex items-center ${className}`}
      style={{ fontSize: size * 0.6 }}
    >
      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        RareMatch
      </span>
    </div>
  );
}
