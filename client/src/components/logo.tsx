import logoImage from "@assets/8DgQKgN0SuBFAAAAAASUVORK5CYII=_1755184318408.png";

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 40, className = "" }: LogoProps) {
  return (
    <img 
      src={logoImage}
      alt="RareMatch Logo"
      width={size}
      height={size}
      className={className}
    />
  );
}