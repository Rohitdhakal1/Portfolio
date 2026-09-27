import React from "react";

export interface LogoProps {
  className?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  children?: React.ReactNode;
}

export type TagProps = LogoProps;

export const Logo: React.FC<LogoProps> = ({
  className = "",
  alt = "Rohit Dhakal",
  width = 45,
  height = 36,
  children,
}) => {
  return (
    <div className={`inline-flex items-center ${className}`.trim()}>
      <img
        src="/portfolio-logo.png"
        alt={alt}
        width={width}
        height={height}
        className="block"
      />
      {children}
    </div>
  );
};

export default Logo;
