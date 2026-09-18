import { useEffect, useRef } from "react";

type PointerPosition = {
  x: number;
  y: number;
};

export default function WelcomeCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    if (!cursor) {
      return;
    }

    const cursorElement = cursor;

    if (!window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const root = document.documentElement;

    root.setAttribute("data-welcome-cursor-active", "");

    cursorElement.classList.remove("hidden");

    cursorElement.style.opacity = "0";

    const target: PointerPosition = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    const current: PointerPosition = {
      x: target.x,
      y: target.y,
    };

    let initialized = false;
    let running = false;
    let rafId = 0;
    let idleTimer: number | undefined;

    const broadcastPointer = () => {
      window.dispatchEvent(
        new CustomEvent("welcome:pointer", {
          detail: {
            x: current.x,
            y: current.y,
          },
        }),
      );
    };

    const tick = () => {
      if (!running) {
        return;
      }

      current.x += (target.x - current.x) * 0.35;

      current.y += (target.y - current.y) * 0.35;

      cursorElement.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;

      broadcastPointer();

      rafId = window.requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) {
        return;
      }

      running = true;

      window.cancelAnimationFrame(rafId);

      rafId = window.requestAnimationFrame(tick);
    };

    const stop = () => {
      running = false;

      window.cancelAnimationFrame(rafId);
    };

    const resetIdleTimer = () => {
      if (idleTimer !== undefined) {
        window.clearTimeout(idleTimer);
      }

      idleTimer = window.setTimeout(() => {
        stop();
      }, 500);
    };

    const handlePointerMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;

      if (!initialized) {
        current.x = target.x;
        current.y = target.y;

        initialized = true;

        cursorElement.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      }

      cursorElement.style.opacity = "1";

      start();
      resetIdleTimer();
    };

    const handleMouseEnter = () => {
      if (initialized) {
        cursorElement.style.opacity = "1";
      }
    };

    const handleMouseLeave = () => {
      cursorElement.style.opacity = "0";
    };

    const handleMouseOver = (event: MouseEvent) => {
      const element = event.target as Element | null;

      if (!element) {
        return;
      }

      const interactive =
        element.closest("a, button, [role='button']") !== null;

      cursorElement.dataset.mode = interactive ? "link" : "dot";
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stop();

        cursorElement.style.opacity = "0";

        return;
      }

      if (initialized) {
        cursorElement.style.opacity = "1";

        start();
        resetIdleTimer();
      }
    };

    window.addEventListener("pointermove", handlePointerMove);

    document.addEventListener("mouseenter", handleMouseEnter);

    document.addEventListener("mouseleave", handleMouseLeave);

    document.addEventListener("mouseover", handleMouseOver);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stop();

      if (idleTimer !== undefined) {
        window.clearTimeout(idleTimer);
      }

      window.removeEventListener("pointermove", handlePointerMove);

      document.removeEventListener("mouseenter", handleMouseEnter);

      document.removeEventListener("mouseleave", handleMouseLeave);

      document.removeEventListener("mouseover", handleMouseOver);

      document.removeEventListener("visibilitychange", handleVisibilityChange);

      root.removeAttribute("data-welcome-cursor-active");

      cursorElement.style.opacity = "";
      cursorElement.style.transform = "";
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      data-welcome-cursor
      aria-hidden="true"
      className="
        welcome-cursor
        pointer-events-none
        fixed
        top-0
        left-0
        z-[100]
        hidden
      "
    >
      <div className="welcome-cursor__shape" />
    </div>
  );
}
