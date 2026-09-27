import React from "react";

export interface ButtonProps {
  variant?: "primary" | "ghost" | "outline";
  type?: "button" | "submit" | "reset";
  href?: string;
  target?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  children?: React.ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-2 px-5 h-11 text-sm font-medium tracking-wide transition-[background-color,color,border-color,transform] duration-[var(--duration-base)] ease-[var(--ease-out-soft)] active:translate-y-px disabled:opacity-50 disabled:pointer-events-none rounded-[var(--radius-pill)]";

const variants = {
  primary:
    "bg-[var(--color-ink)] text-[var(--color-ink-inverted)] hover:bg-[var(--color-pink)]",
  ghost:
    "bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-bg-neutral)]",
  outline:
    "bg-transparent text-[var(--color-ink-dim)] border border-[var(--color-bg-neutral-2)] hover:border-[var(--color-ink-dim)] hover:text-[var(--color-ink)]",
} as const;

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  type = "button",
  href,
  target,
  className = "",
  id,
  disabled,
  onClick,
  children,
}) => {
  const cls = `${base} ${variants[variant]} ${className}`.trim();

  if (href) {
    return (
      <a
        href={href}
        id={id}
        className={cls}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined} // rel means next tab otherwise undefined means no here 
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      id={id}
      className={cls}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
