import { useEffect, useRef } from "react";

type Word = {
  text: string;
  emphasis?: boolean;
};

type WelcomeHeroProps = {
  returning?: boolean;
};

const title = ["Rohit’s", "World"];

const quote: Word[] = [
  { text: "discoveries", emphasis: true },
  { text: "are" },
  { text: "out" },
  { text: "there," },
  { text: "waiting" },
  { text: "to" },
  { text: "be" },
  { text: "made." },
  { text: "Why" },
  { text: "not" },
  { text: "by", emphasis: true },
  { text: "you?", emphasis: true },
];

export default function WelcomeHero({ returning = false }: WelcomeHeroProps) {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;

    if (!hero) {
      return;
    }

    const elements = Array.from(
      hero.querySelectorAll<HTMLElement>("[data-shove]"),
    );

    const current = new WeakMap<HTMLElement, number>();
    const target = new WeakMap<HTMLElement, number>();

    elements.forEach((element) => {
      current.set(element, 0);
      target.set(element, 0);
    });

    const RADIUS = 95;
    const STRENGTH = 26;

    let rafId = 0;
    let paused = false;

    const handlePointer = (event: Event) => {
      const customEvent = event as CustomEvent<{
        x: number;
        y: number;
      }>;

      const { x, y } = customEvent.detail;

      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = centerX - x;
        const dy = centerY - y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance >= RADIUS || distance === 0) {
          target.set(element, 0);
          return;
        }

        const force = Math.pow(1 - distance / RADIUS, 1.4);
        const direction = Math.atan2(dy, dx);
        const shove = force * STRENGTH;

        const offsetX = Math.cos(direction) * shove;
        const offsetY = Math.sin(direction) * shove;

        const magnitude = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

        target.set(element, magnitude);

        element.dataset.shoveX = String(offsetX);
        element.dataset.shoveY = String(offsetY);
      });
    };

    const animate = () => {
      if (paused) {
        return;
      }

      elements.forEach((element) => {
        const previous = current.get(element) ?? 0;
        const nextTarget = target.get(element) ?? 0;

        const next = previous + (nextTarget - previous) * 0.18;

        current.set(element, next);

        const shoveX = Number(element.dataset.shoveX ?? 0);

        const shoveY = Number(element.dataset.shoveY ?? 0);

        const ratio = nextTarget === 0 ? 0 : next / nextTarget;

        const x = shoveX * ratio;
        const y = shoveY * ratio;

        const depth = Number(element.dataset.parallaxDepth ?? 0);

        const parallaxX =
          (window.innerWidth / 2 - window.innerWidth / 2) * depth;

        const parallaxY =
          (window.innerHeight / 2 - window.innerHeight / 2) * depth;

        element.style.transform = `translate3d(${x + parallaxX}px, ${
          y + parallaxY
        }px, 0)`;
      });

      rafId = window.requestAnimationFrame(animate);
    };

    const handleVisibilityChange = () => {
      paused = document.hidden;

      if (!paused) {
        window.cancelAnimationFrame(rafId);
        rafId = window.requestAnimationFrame(animate);
      }
    };

    window.addEventListener("welcome:pointer", handlePointer);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("welcome:pointer", handlePointer);

      document.removeEventListener("visibilitychange", handleVisibilityChange);

      window.cancelAnimationFrame(rafId);

      elements.forEach((element) => {
        element.style.transform = "";
        delete element.dataset.shoveX;
        delete element.dataset.shoveY;
      });
    };
  }, []);

  const handleSkipMouseEnter = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.opacity = "0.85";
  };

  const handleSkipMouseLeave = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.opacity = "0.55";
  };

  return (
    <section
      ref={heroRef}
      className="
        relative
        grid
        min-h-dvh
        w-full
        place-items-center
        px-4
        sm:px-6
      "
    >
      <div className="flex w-full max-w-[454px] flex-col items-center gap-8 sm:gap-10">
        <div className="flex w-full flex-col items-center gap-6 text-center sm:gap-8">
          {/* Welcome + Title */}
          <div className="flex flex-col items-center gap-1 leading-none">
            <div
              className="
                font-[family-name:var(--font-mono)]
                text-sm
                uppercase
                text-[var(--color-ink-mute)]
                sm:text-base
              "
            >
              Welcome Back To
            </div>

            <h1
              className="
                flex
                flex-wrap
                items-center
                justify-center
                gap-2
                font-[family-name:var(--font-display)]
                text-[28px]
                font-light
                leading-none
                text-[var(--color-ink-inverted)]
                sm:text-[36px]
              "
            >
              {title.map((word, index) => (
                <span
                  key={word}
                  data-shove
                  data-parallax-depth={index === 0 ? "0.12" : "0.08"}
                  className="inline-block"
                >
                  {word}
                </span>
              ))}
            </h1>
          </div>

          {/* Explore */}
          <div className="flex flex-col items-center gap-4">
            <a
              id="enter-cta"
              href={returning ? "/home" : "/onboarding"}
              data-returning={returning ? "" : undefined}
              className="
                btn-springy
                inline-flex
                items-center
                justify-center
                whitespace-nowrap
                rounded-[12px]
                bg-[var(--color-bg)]
                px-3
                py-2
                font-[family-name:var(--font-mono)]
                text-[14px]
                uppercase
                leading-none
                text-[var(--color-ink)]
              "
            >
              explore →
            </a>
          </div>

          {/* Quote */}
          <p
            className="
              max-w-[346px]
              font-[family-name:var(--font-mono)]
              text-sm
              uppercase
              leading-snug
              text-[var(--color-ink-mute)]
              sm:text-base
            "
          >
            {quote.map((word, index) => (
              <span key={`${word.text}-${index}`}>
                <span
                  data-shove
                  data-parallax-depth={word.emphasis ? "0.12" : "0.08"}
                  className={
                    word.emphasis
                      ? "inline-block italic text-[var(--color-ink-inverted)]"
                      : "inline-block"
                  }
                >
                  {word.text}
                </span>

                {index < quote.length - 1 && " "}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
