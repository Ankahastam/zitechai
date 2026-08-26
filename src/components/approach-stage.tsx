"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * Tracks which step owns the viewport middle and exposes it as `data-stage`.
 * Without JavaScript the section stays a readable linear narrative.
 */
export function ApproachStage({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(1);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const stickyLayout = window.matchMedia("(min-width: 64rem)");
    const steps = Array.from(track.querySelectorAll<HTMLElement>("[data-step]"));
    if (steps.length === 0) return;

    const active = new Set<number>();
    let observer: IntersectionObserver | null = null;

    const disconnect = () => {
      observer?.disconnect();
      observer = null;
      active.clear();
    };

    const connect = () => {
      if (observer) return;

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const index = Number(entry.target.getAttribute("data-step"));
            if (entry.isIntersecting) active.add(index);
            else active.delete(index);
          }
          if (active.size > 0) setStage(Math.max(...active));
        },
        // Mobile switches near the sticky stack; desktop switches at viewport center.
        { rootMargin: stickyLayout.matches ? "-45% 0px -45% 0px" : "-18% 0px -81% 0px" },
      );

      for (const step of steps) observer.observe(step);
    };

    const sync = () => {
      disconnect();
      setReady(stickyLayout.matches);
      connect();
    };

    sync();
    stickyLayout.addEventListener("change", sync);

    return () => {
      stickyLayout.removeEventListener("change", sync);
      disconnect();
    };
  }, []);

  return (
    <div className="approach__track" data-ready={ready ? "true" : undefined} data-stage={stage} ref={trackRef}>
      {children}
    </div>
  );
}
