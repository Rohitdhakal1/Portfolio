import React from "react";
import { Link } from "react-router-dom";
import { Tag } from "../ui/Tag";

export type ProjectStatus =
  | "SHIPPED"
  | "INTERNSHIP"
  | "HANDED OVER"
  | "IN PROGRESS";

export type ProjectAccent = "pink" | "teal" | "orange" | "green" | "neutral";

export interface ProjectCardProps {
  title: string;
  /** Image URL — leave undefined to render the colored placeholder. */
  image?: string;
  imageHeight?: number;
  /** Visual accent for the placeholder when no image is provided. */
  accent?: ProjectAccent;
  status: ProjectStatus;
  sideProject?: boolean;
  /** If provided, the card navigates internally via Link (or external URL via <a>). */
  href?: string;
  className?: string;
  children?: React.ReactNode;
}

export type TagProps = ProjectCardProps;

const accentBg: Record<ProjectAccent, string> = {
  pink: "linear-gradient(135deg, var(--color-pink) 0%, var(--color-pink-1) 100%)",
  teal: "linear-gradient(135deg, var(--color-teal) 0%, var(--color-teal-1) 100%)",
  orange: "linear-gradient(135deg, var(--color-orange) 0%, var(--color-orange-1) 100%)",
  green: "linear-gradient(135deg, var(--color-green) 0%, var(--color-green-1) 100%)",
  neutral:
    "linear-gradient(135deg, var(--color-bg-neutral-2) 0%, var(--color-bg-neutral) 100%)",
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  image,
  imageHeight = 228,
  accent = "neutral",
  status,
  sideProject = false,
  href,
  className = "",
  children,
}) => {
  const cardClasses = `project-card group bg-[var(--color-bg-light)] rounded-[16px] p-4 flex flex-col gap-3 transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-soft)] ${href ? "cursor-pointer hover:-translate-y-1" : "cursor-default hover:-translate-y-0.5"
    } ${className}`.trim();

  const content = (
    <>
      <div
        className="project-card__frame relative rounded-[12px] overflow-hidden w-full grid place-items-center text-[var(--color-ink-inverted)] font-[family-name:var(--font-display)] text-xl font-light"
        style={{ height: `${imageHeight}px` }}
        aria-hidden={image ? undefined : "true"}
        data-cursor-bg={accent}
      >
        <div
          className="project-card__media absolute inset-0 transition-all duration-[var(--duration-slow)] ease-[var(--ease-out-soft)] group-hover:scale-[1.07] group-hover:saturate-[1.08] group-hover:brightness-[1.02]"
          style={{
            background: image ? `url(${image}) center/cover` : accentBg[accent],
          }}
        />
        {/* Soft sheen effect */}
        <div
          className="project-card__sheen absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-base)]"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(115deg, transparent 38%, rgba(255, 255, 255, 0.22) 50%, transparent 62%)",
          }}
        />
        {!image && <span className="relative opacity-70 normal-case">{title}</span>}
      </div>

      <div className="flex items-center justify-between gap-3 min-w-0">
        <p className="font-[family-name:var(--font-body)] text-base text-[var(--color-ink)] flex-1 min-w-0 truncate">
          {title}
        </p>
        <div className="flex gap-2 items-center shrink min-w-0 max-w-[60%]">
          {sideProject && <Tag className="shrink min-w-0">Side Project</Tag>}
          <Tag className="shrink-0">{status}</Tag>
        </div>
      </div>
      {children}
    </>
  );

  if (href) {
    const isExternal = href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="case-study"
          className={cardClasses}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        to={href}
        data-cursor="case-study"
        className={cardClasses}
      >
        {content}
      </Link>
    );
  }

  return (
    <article className={cardClasses}>
      {content}
    </article>
  );
};

export default ProjectCard;
