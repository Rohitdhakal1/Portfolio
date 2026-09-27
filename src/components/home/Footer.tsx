import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export type CardColor = "pink" | "teal" | "green" | "orange" | "neutral";
export type ActiveKey = "home" | "about" | "playground" | "gallery";

export interface FooterProps {
  color?: CardColor;
  active?: ActiveKey;
  className?: string;
  children?: React.ReactNode;
}

export type TagProps = FooterProps;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  ttl: number;
  size: number;
  alt: boolean;
}

const navItems: { key: ActiveKey; label: string; to: string }[] = [
  { key: "home", label: "Home", to: "/home" },
  { key: "about", label: "About me", to: "/about" },
  { key: "playground", label: "Playground", to: "/playground" },
  { key: "gallery", label: "Visitor Gallery", to: "/visitor-gallery" },
];

const spaceLink = { label: "✦ Back to space", to: "/" };

export const Footer: React.FC<FooterProps> = ({
  color = "pink",
  active = "home",
  className = "",
  children,
}) => {
  const footerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovering, setHovering] = useState(false);

  // Background and tint styling matching tokens
  const colorStyles: Record<
    CardColor,
    { bg: string; text: string; tint: string; spark: string; sparkAlt: string }
  > = {
    pink: {
      bg: "var(--color-pink)",
      text: "var(--color-ink-inverted)",
      tint: "var(--color-pink-1)",
      spark: "255, 255, 255",
      sparkAlt: "238, 201, 213",
    },
    teal: {
      bg: "var(--color-teal)",
      text: "var(--color-ink-inverted)",
      tint: "var(--color-teal-1)",
      spark: "217, 235, 238",
      sparkAlt: "179, 208, 213",
    },
    green: {
      bg: "var(--color-green)",
      text: "var(--color-ink-inverted)",
      tint: "var(--color-green-1)",
      spark: "255, 255, 255",
      sparkAlt: "125, 181, 146",
    },
    orange: {
      bg: "var(--color-orange)",
      text: "var(--color-ink-inverted)",
      tint: "var(--color-orange-1)",
      spark: "255, 255, 255",
      sparkAlt: "247, 201, 165",
    },
    neutral: {
      bg: "var(--color-bg-neutral-2)",
      text: "var(--color-ink)",
      tint: "var(--color-fg-neutral)",
      spark: "36, 36, 36",
      sparkAlt: "138, 133, 118",
    },
  };

  const currentTheme = colorStyles[color] || colorStyles.pink;

  // Particle Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const footer = footerRef.current;
    if (!canvas || !footer) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const particles: Particle[] = [];
    let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let rafId = 0;
    let lastFrame = performance.now();

    const resize = () => {
      const rect = footer.getBoundingClientRect();
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(resize);
      ro.observe(footer);
    }

    const tick = (now: number) => {
      const dt = Math.min(48, now - lastFrame);
      lastFrame = now;
      const dtSec = dt / 1000;

      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      if (particles.length > 0) {
        ctx.globalCompositeOperation = "lighter";
        const rgbMain = currentTheme.spark;
        const rgbAlt = currentTheme.sparkAlt;

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.life += dt;
          if (p.life >= p.ttl) {
            particles.splice(i, 1);
            continue;
          }
          if (!reduced) {
            p.vy -= 30 * dtSec;
            p.vx *= 0.95;
            p.vy *= 0.95;
            p.x += p.vx * dtSec;
            p.y += p.vy * dtSec;
          }

          const t = p.life / p.ttl;
          const fade = 1 - t;

          if (reduced) {
            const r = p.size + t * 36;
            ctx.beginPath();
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${rgbMain}, ${fade * 0.6})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            continue;
          }

          const rgb = p.alt ? rgbAlt : rgbMain;
          const radius = p.size * (1 + 0.3 * Math.sin(p.life * 0.02));

          const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 5);
          halo.addColorStop(0, `rgba(${rgb}, ${fade * 0.55})`);
          halo.addColorStop(1, `rgba(${rgb}, 0)`);
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius * 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(${rgb}, ${fade})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      if (ro) ro.disconnect();
    };
  }, [currentTheme]);

  return (
    <footer
      ref={footerRef}
      data-footer-color={color}
      data-cursor-bg={color}
      onPointerMove={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      style={{
        backgroundColor: currentTheme.bg,
        color: currentTheme.text,
      }}
      className={`relative w-full overflow-hidden min-h-[288px] md:h-[288px] transition-colors duration-[var(--duration-base)] ${className}`.trim()}
    >
      {/* Click-burst/ambient particle canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
      />

      <div className="relative z-20 h-full flex flex-col md:flex-row justify-between items-stretch gap-8 md:gap-0 p-6 sm:p-8 md:p-10">
        {/* Left: quote */}
        <div className="flex flex-col justify-between md:pr-10 max-w-full md:max-w-[460px] group/quote">
          <p className="font-[family-name:var(--font-display)] font-light text-[20px] sm:text-[22px] md:text-[24px] leading-tight select-none">
            <span className="inline-block relative underline decoration-1 underline-offset-4 decoration-transparent group-hover/quote:decoration-current transition-all">
              Discoveries
            </span>{" "}
            <span>are</span> <span>out</span> <span>there,</span>{" "}
            <span>waiting</span> <span>to</span> <span>be</span>{" "}
            <span>made.</span>
            <br />
            <span>Why</span> <span>not</span>{" "}
            <span className="inline-block relative underline decoration-1 underline-offset-4 decoration-transparent group-hover/quote:decoration-current transition-all">
              by
            </span>{" "}
            <span className="inline-block relative underline decoration-1 underline-offset-4 decoration-transparent group-hover/quote:decoration-current transition-all">
              you?
            </span>
          </p>
        </div>

        {/* Right: nav columns */}
        <div className="flex gap-10 sm:gap-14 md:gap-20 font-[family-name:var(--font-mono)] text-[15px] sm:text-[16px] md:text-[18px] uppercase">
          <ul
            className="flex flex-col gap-1 w-auto md:w-[162px]"
            style={{ color: currentTheme.tint }}
          >
            <li>
              <a
                href="mailto:rohitdhakal@example.com"
                className="hover:underline hover:opacity-100 transition-opacity"
              >
                Email
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:opacity-100 transition-opacity"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:opacity-100 transition-opacity"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:opacity-100 transition-opacity"
              >
                X
              </a>
            </li>
            <li>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:opacity-100 transition-opacity"
              >
                Resume
              </a>
            </li>
          </ul>

          <ul
            className="flex flex-col gap-1"
            style={{ color: currentTheme.tint }}
          >
            {navItems.map((item) => (
              <li key={item.key}>
                <Link
                  to={item.to}
                  className={`transition-colors relative group/link ${
                    item.key === active
                      ? "font-semibold underline"
                      : "hover:underline opacity-90 hover:opacity-100"
                  }`}
                >
                  {item.label}
                  <span className="opacity-0 group-hover/link:opacity-100 ml-1 inline-block transition-opacity text-xs">
                    ✦
                  </span>
                </Link>
              </li>
            ))}
            <li className="mt-2">
              <Link
                to={spaceLink.to}
                className="text-[12px] opacity-80 hover:opacity-100 hover:underline transition-opacity"
              >
                {spaceLink.label}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {children}
    </footer>
  );
};

export default Footer;
