import React, { useEffect, useState } from "react";

export interface StatusClockProps {
  className?: string;
  children?: React.ReactNode;
}

export type TagProps = StatusClockProps;

export const StatusClock: React.FC<StatusClockProps> = ({
  className = "",
  children,
}) => {
  const [timeStr, setTimeStr] = useState<string>("--:--:-- --");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h12 = ((now.getHours() + 11) % 12) + 1;
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";
      setTimeStr(`${h12}:${mm}:${ss} ${ampm}`);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      data-status-clock
      className={`status-clock pointer-events-none absolute bottom-[21px] left-[21px] font-[family-name:var(--font-mono)] text-base uppercase text-[var(--color-ink-mute)] leading-tight hidden sm:block ${className}`.trim()}
    >
      <p data-clock>{timeStr}</p>
      {children}
    </div>
  );
};

export default StatusClock;
