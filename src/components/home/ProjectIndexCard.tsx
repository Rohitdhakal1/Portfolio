import React from "react";
import { Link } from "react-router-dom";

export type Category = "side-project" | "internship" | "club-project";

export interface ProjectMetric {
  value: string;
  suffix?: string;
  label: string;
}

export interface ProjectIndexCardProps {
  title: string;
  role: string;
  team: string;
  shipped: string;
  /** Project category — colors the single card badge. */
  category: Category;
  /** One-line summary shown below the title. */
  description?: string;
  image?: string;
  imageHeight?: number;
  /** CSS background-position value, default "center". */
  imagePosition?: string;
  href?: string;
  /** Opens link in new tab + uses external cursor mode. */
  external?: boolean;
  /** Force "case-study" cursor label even when external. */
  caseStudyCursor?: boolean;
  /** Small idle rotation so a row of cards reads as a loose stack. */
  tilt?: number;
  /** Outcome stat badges shown under the description (always visible). */
  metrics?: ProjectMetric[];
  /** CSS aspect-ratio (e.g. "716 / 476"). When set, the frame matches the
      media's native ratio so nothing is cropped; overrides imageHeight. */
  imageAspect?: string;
  children?: React.ReactNode;
}

const categoryLabels: Record<Category, string> = {
  "side-project": "Side Project",
  internship: "Internship",
  "club-project": "Club Project",
};

export const ProjectIndexCard: React.FC<ProjectIndexCardProps> = ({
  title,
  role,
  team,
  shipped,
  category,
  description,
  image,
  imageHeight = 228,
  imagePosition = "center",
  href,
  external = false,
  caseStudyCursor = false,
  tilt = 0,
  metrics = [],
  imageAspect,
  children,
}) => {
  const frameStyle: React.CSSProperties = imageAspect
    ? { aspectRatio: imageAspect }
    : { height: `${imageHeight}px` };

  const cursorAttr = href
    ? external && !caseStudyCursor
      ? "external"
      : "case-study"
    : undefined;

  const cardStyle = {
    "--card-tilt": `${tilt}deg`,
  } as React.CSSProperties;

  const cardClasses = [
    "index-card group relative flex flex-col",
    "bg-[var(--color-bg-light)] text-ink rounded-[16px] p-4 gap-2",
    "shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-border-subtle)_32%,transparent)]",
    "hover:shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-border-subtle)_48%,transparent)]",
    "transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-soft)]",
    "hover:translate-y-[-3px] hover:rotate-0",
    "origin-[50%_40%]",
    href ? "cursor-none" : "cursor-default",
  ].join(" ");

  const content = (
    <>
      {image && (
        <div
          className="relative w-full rounded-[12px] overflow-hidden"
          style={frameStyle}
        >
          <img
            src={image}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover transform translate-z-0 transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
            style={{ objectPosition: imagePosition }}
          />
        </div>
      )}

      <div className="flex flex-col mt-1">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2.5">
            <h3 className="flex-[1_1_auto] min-w-0 font-display font-light text-[20px] leading-[1.15] text-ink m-0 overflow-hidden text-ellipsis whitespace-nowrap">
              {title}
            </h3>
            <div className="flex items-center gap-3 shrink-0">
              <span className="font-mono text-[11px] leading-none tracking-[0.03em] uppercase whitespace-nowrap px-1.5 py-[3px] rounded-sm bg-[var(--color-bg-neutral-2)] text-ink-dim">
                {categoryLabels[category]}
              </span>
            </div>
          </div>

          {description && (
            <p className="m-0 font-body text-[13.5px] leading-[1.4] text-ink-muted">
              {description}
            </p>
          )}

          {metrics.length > 0 && (
            <ul className="list-none m-0 mt-2 mb-0.5 p-0 grid grid-flow-col auto-cols-fr w-full">
              {metrics.map((m, idx) => (
                <li
                  key={idx}
                  className={`flex flex-col gap-1.5 py-0.5 px-4 ${
                    idx === 0
                      ? "pl-0 border-l-0"
                      : "border-l border-[color-mix(in_oklab,var(--color-ink)_16%,transparent)]"
                  }`}
                >
                  <span className="font-display font-light text-[19px] leading-none text-ink tabular-nums whitespace-nowrap">
                    {m.value}
                    {m.suffix && (
                      <span className="text-[0.6em] ml-1 align-[0.14em]">
                        {m.suffix}
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-[10px] leading-none uppercase tracking-[0.05em] text-ink-dim whitespace-nowrap">
                    {m.label}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-[var(--ease-out-soft)] motion-reduce:grid-rows-[1fr]">
          <div className="min-h-0 overflow-hidden">
            <span
              aria-hidden="true"
              className="block w-full h-px my-3 opacity-0 group-hover:opacity-100 motion-reduce:opacity-100 transition-opacity duration-200 delay-[80ms] ease-[var(--ease-out-soft)] border-t border-dashed border-[color-mix(in_oklab,var(--color-ink)_22%,transparent)]"
            />
            <dl className="m-0 pb-0.5 flex flex-col gap-2 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 motion-reduce:opacity-100 motion-reduce:translate-y-0 transition-[opacity,transform] duration-250 ease-[var(--ease-out-soft)]">
              <div className="grid grid-cols-[90px_1fr] gap-x-10 text-[12px] leading-[1.4]">
                <dt className="font-mono uppercase tracking-[0.02em] text-ink-dim">
                  Role
                </dt>
                <dd className="m-0 font-body text-ink-muted">{role}</dd>
              </div>
              <div className="grid grid-cols-[90px_1fr] gap-x-10 text-[12px] leading-[1.4]">
                <dt className="font-mono uppercase tracking-[0.02em] text-ink-dim">
                  Team
                </dt>
                <dd className="m-0 font-body text-ink-muted">{team}</dd>
              </div>
              <div className="grid grid-cols-[90px_1fr] gap-x-10 text-[12px] leading-[1.4]">
                <dt className="font-mono uppercase tracking-[0.02em] text-ink-dim">
                  Timeframe
                </dt>
                <dd className="m-0 font-body text-ink-muted">{shipped}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      {children}
    </>
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor={cursorAttr}
          style={{ ...cardStyle, transform: `rotate(var(--card-tilt, 0deg))` }}
          className={cardClasses}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        to={href}
        data-cursor={cursorAttr}
        style={{ ...cardStyle, transform: `rotate(var(--card-tilt, 0deg))` }}
        className={cardClasses}
      >
        {content}
      </Link>
    );
  }

  return (
    <article
      style={{ ...cardStyle, transform: `rotate(var(--card-tilt, 0deg))` }}
      className={cardClasses}
    >
      {content}
    </article>
  );
};

export default ProjectIndexCard;
