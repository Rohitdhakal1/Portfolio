import React from "react";

export interface TagProps {
  variant?: "neutral" | "muted" | "outline";
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
}

const variants = {
  neutral: "bg-[var(--color-bg-neutral-2)] text-ink-dim",
  muted: "bg-[var(--color-bg-neutral)] text-ink-dim",
  outline:
    "bg-transparent text-ink-dim ring-1 ring-inset ring-[var(--color-bg-neutral-2)]",
} as const;

const sizes = {
  md: { pad: "px-2 py-1", text: "text-[14px]" },
  sm: { pad: "px-1.5 py-[3px]", text: "text-[11px] tracking-[0.03em]" },
} as const;

export const Tag: React.FC<TagProps> = ({
  variant = "neutral",
  size = "md",
  className = "",
  children,
}) => {
  return (
    <span
      className={`inline-flex items-center min-w-0 max-w-full ${sizes[size].pad} rounded-[4px] ${variants[variant]} ${className}`}
    >
      <span
        className={`font-mono ${sizes[size].text} leading-none uppercase whitespace-nowrap overflow-hidden text-ellipsis min-w-0`}
      >
        {children}
      </span>
    </span>
  );
};

export default Tag;
