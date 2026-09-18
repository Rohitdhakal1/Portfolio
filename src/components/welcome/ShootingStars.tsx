import { useEffect, useRef } from "react";

const shapes = ["──────✦", "─────·", "──────⋆", "·─────✦", "─────˚"];

export default function ShootingStars() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let alive = false;
    let timeoutId: number | undefined;

    const createShootingStar = () => {
      if (alive) {
        return;
      }

      alive = true;

      const star = document.createElement("span");

      star.className = "shooting-star";

      star.textContent = shapes[Math.floor(Math.random() * shapes.length)];

      const startX = window.innerWidth * (0.72 + Math.random() * 0.28);

      const startY = window.innerHeight * (0.05 + Math.random() * 0.25);

      const distance =
        Math.min(window.innerWidth, window.innerHeight) *
        (0.35 + Math.random() * 0.3);

      const angle = (Math.PI * 3) / 4 + (Math.random() - 0.5) * 0.35;

      const dx = Math.cos(angle) * distance;

      const dy = Math.sin(angle) * distance;

      const duration = 1200 + Math.random() * 800;

      const rotation = (Math.atan2(dy, dx) * 180) / Math.PI;

      star.style.left = `${startX}px`;
      star.style.top = `${startY}px`;

      star.style.setProperty("--shoot-dx", `${dx}px`);

      star.style.setProperty("--shoot-dy", `${dy}px`);

      star.style.setProperty("--shoot-duration", `${duration}ms`);

      star.style.setProperty("--shoot-angle", `${rotation}deg`);

      container.appendChild(star);

      const animation = star.animate(
        [
          {
            opacity: "0",
            transform: `translate3d(0, 0, 0) rotate(${rotation}deg)`,
          },
          {
            opacity: "1",
            offset: 0.08,
            transform: `translate3d(0, 0, 0) rotate(${rotation}deg)`,
          },
          {
            opacity: "0",
            transform: `translate3d(${dx}px, ${dy}px, 0) rotate(${rotation}deg)`,
          },
        ],
        {
          duration,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "forwards",
        },
      );

      animation.finished
        .catch(() => undefined)
        .finally(() => {
          star.remove();
          alive = false;
        });
    };

    const scheduleNext = () => {
      const delay = 4000 + Math.random() * 3000;

      timeoutId = window.setTimeout(() => {
        createShootingStar();
        scheduleNext();
      }, delay);
    };

    timeoutId = window.setTimeout(() => {
      createShootingStar();
      scheduleNext();
    }, 800);

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }

      container.innerHTML = "";
      alive = false;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        inset-0
        overflow-hidden
      "
    />
  );
}
