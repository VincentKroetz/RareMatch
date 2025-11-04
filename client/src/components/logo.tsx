import logoImage from '@assets/rarematch-logo.png';

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 100, className = "" }: LogoProps) {
  return (
    <img 
      src={logoImage}
      width={size} 
      height={size} 
      alt="RareMatch Logo"
      className={className}
      style={{ flexShrink: 0 }}
    />
  );
}
