import { useEffect, useState } from "react";

import Starfield from "../components/welcome/Starfield";
import ShootingStars from "../components/welcome/ShootingStars";
import WelcomeCursor from "../components/welcome/WelcomeCursor";
import WelcomeHero from "../components/welcome/WelcomeHero";

function WelcomeSparkles() {
  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        inset-0
        z-10
        overflow-hidden
        font-[family-name:var(--font-mono)]
        text-2xl
        text-[var(--color-ink-mute)]
      "
    >
      <span
        className="absolute"
        style={{
          left: "12.5%",
          top: "48.9%",
        }}
      >
        <span className="text-[var(--color-pink)]">⊹</span> ࣪ ˖
      </span>

      <span
        className="absolute"
        style={{
          left: "73.3%",
          top: "82.1%",
        }}
      >
        ⋆.
        <span className="text-[var(--color-teal)]">˚</span>
      </span>

      <span
        className="absolute"
        style={{
          left: "84.4%",
          top: "24.3%",
        }}
      >
        ˚<span className="text-[var(--color-orange)]">.</span>⋆
      </span>
    </div>
  );
}

function LiveClock() {
  const [time, setTime] = useState("--:--:-- --");

  useEffect(() => {
    const update = () => {
      const now = new Date();

      const hours = now.getHours();
      const hour12 = ((hours + 11) % 12) + 1;

      const minutes = String(now.getMinutes()).padStart(2, "0");

      const seconds = String(now.getSeconds()).padStart(2, "0");

      const ampm = hours >= 12 ? "PM" : "AM";

      setTime(`${hour12}:${minutes}:${seconds} ${ampm}`);
    };

    update();

    const interval = window.setInterval(update, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        bottom-[21px]
        left-[21px]
        z-20
        hidden
        font-[family-name:var(--font-mono)]
        text-base
        uppercase
        leading-tight
        text-[var(--color-ink-mute)]
        sm:block
      "
    >
      <p>{time}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <main
      className="
        relative
        min-h-dvh
        overflow-hidden
        bg-[var(--color-cosmos)]
        text-[var(--color-ink-inverted)]
      "
    >
      <Starfield />

      <ShootingStars />

      <WelcomeSparkles />

      <WelcomeHero returning={false} />

      <WelcomeCursor />

      <LiveClock />
    </main>
  );
}
