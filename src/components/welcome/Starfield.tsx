import { useEffect, useMemo } from "react";

type Star = {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleDelay: number;
};

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;

    let t = seed;

    t = Math.imul(t ^ (t >>> 15), t | 1);

    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeLayer(
  seed: number,
  grid: number,
  maxR: number,
  skip: number,
  sizeRange: [number, number, number],
  opacityRange: [number, number],
): Star[] {
  const rand = mulberry32(seed);
  const cellSize = 100 / grid;

  const stars: Star[] = [];

  for (let row = 0; row < grid; row++) {
    for (let col = 0; col < grid; col++) {
      const cx = (col + 0.5) * cellSize - 50;
      const cy = (row + 0.5) * cellSize - 50;

      if (Math.sqrt(cx * cx + cy * cy) > maxR) {
        continue;
      }

      if (rand() < skip) {
        rand();
        rand();
        rand();
        rand();
        continue;
      }

      stars.push({
        x: col * cellSize + (rand() * 1.6 - 0.3) * cellSize,

        y: row * cellSize + (rand() * 1.6 - 0.3) * cellSize,

        size: rand() < sizeRange[0] ? sizeRange[1] : sizeRange[2],

        opacity: opacityRange[0] + rand() * (opacityRange[1] - opacityRange[0]),

        twinkleDelay: rand() * 14,
      });
    }
  }

  return stars;
}

function StarLayer({ stars, className }: { stars: Star[]; className: string }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        top: "50%",
        left: "50%",
        width: "150vmax",
        height: "150vmax",
        marginLeft: "-75vmax",
        marginTop: "-75vmax",
      }}
    >
      <div
        className={`starfield ${className}`}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          transformOrigin: "center center",
          pointerEvents: "none",
        }}
      >
        {stars.map((star, index) => (
          <span
            key={index}
            className="star"
            style={{
              position: "absolute",
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: `${star.twinkleDelay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Starfield() {
  const far = useMemo(
    () => makeLayer(17, 12, 45, 0.22, [0.8, 1, 1.5], [0.25, 0.5]),
    [],
  );

  const mid = useMemo(
    () => makeLayer(53, 10, 38, 0.28, [0.65, 1.5, 2], [0.45, 0.7]),
    [],
  );

  const near = useMemo(
    () => makeLayer(91, 9, 30, 0.32, [0.5, 2, 2.5], [0.6, 0.9]),
    [],
  );

  useEffect(() => {
    const RIPPLE_RADIUS = 420;
    const RIPPLE_SPEED = 0.9;
    const MAX_BORN = 60;

    let bornCount = 0;

    function birthStar(clientX: number, clientY: number, reduced: boolean) {
      const layer = document.querySelector<HTMLElement>(".starfield--near");

      if (!layer || bornCount >= MAX_BORN) {
        return;
      }

      const offsetX = (Math.random() - 0.5) * 14;

      const offsetY = -(26 + Math.random() * 8);

      const rotation = parseFloat(getComputedStyle(layer).rotate) || 0;

      const theta = rotation * (Math.PI / 180);

      const size = layer.offsetWidth;

      const px = clientX + offsetX - window.innerWidth / 2;

      const py = clientY + offsetY - window.innerHeight / 2;

      const lx = px * Math.cos(theta) + py * Math.sin(theta);

      const ly = -px * Math.sin(theta) + py * Math.cos(theta);

      const star = document.createElement("span");

      star.className = "star star-glyph";

      star.textContent = "✦";

      star.setAttribute("aria-hidden", "true");

      star.style.position = "absolute";

      star.style.left = `${(((lx + size / 2) / size) * 100).toFixed(3)}%`;

      star.style.top = `${(((ly + size / 2) / size) * 100).toFixed(3)}%`;

      star.style.fontSize = `${(11 + Math.random() * 4).toFixed(1)}px`;

      star.style.opacity = "1";

      layer.appendChild(star);

      bornCount++;

      const desyncTwinkle = () => {
        star.style.animationDelay = `-${(Math.random() * 13).toFixed(1)}s`;
      };

      if (!reduced) {
        star.classList.add("star--born");

        star.addEventListener(
          "animationend",
          () => {
            star.classList.remove("star--born");

            desyncTwinkle();
          },
          { once: true },
        );
      } else {
        desyncTwinkle();
      }
    }

    function onPointerDown(event: PointerEvent) {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const stars = document.querySelectorAll<HTMLElement>(".starfield .star");

      birthStar(event.clientX, event.clientY, reduced);

      if (reduced || !stars.length) {
        return;
      }

      for (const star of stars) {
        const rect = star.getBoundingClientRect();

        const dx = rect.left + rect.width / 2 - event.clientX;

        const dy = rect.top + rect.height / 2 - event.clientY;

        const distance = Math.hypot(dx, dy);

        if (distance > RIPPLE_RADIUS) {
          continue;
        }

        const scale = 3 - (distance / RIPPLE_RADIUS) * 1.4;

        window.setTimeout(() => {
          star.classList.remove("star--pulse");

          void star.offsetWidth;

          star.style.setProperty("--pulse-scale", scale.toFixed(2));

          star.classList.add("star--pulse");

          star.addEventListener(
            "animationend",
            () => star.classList.remove("star--pulse"),
            { once: true },
          );
        }, distance / RIPPLE_SPEED);
      }
    }

    window.addEventListener("pointerdown", onPointerDown, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        inset-0
        overflow-hidden
      "
    >
      <StarLayer stars={far} className="starfield--far" />

      <StarLayer stars={mid} className="starfield--mid" />

      <StarLayer stars={near} className="starfield--near" />
    </div>
  );
}
