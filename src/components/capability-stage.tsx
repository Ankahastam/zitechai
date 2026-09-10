"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { PointerEvent, ReactNode } from "react";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Owns which capability is open. The rows, copy and diagrams stay on the server;
 * this island only moves `data-active` and keeps `aria-expanded` in sync, so the
 * section still renders and reads correctly before hydration.
 */
export function CapabilityStage({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(1);
  const [active, setActive] = useState(1);
  const ready = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  useEffect(() => {
    const triggers = stageRef.current?.querySelectorAll<HTMLElement>("[data-capability]");
    if (!triggers) return;

    for (const trigger of triggers) {
      trigger.setAttribute("aria-expanded", trigger.dataset.capability === String(active) ? "true" : "false");
    }
  }, [active]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const desktop = window.matchMedia("(min-width: 64rem)");
    const steps = Array.from(stage.querySelectorAll<HTMLElement>("[data-capability-step]"));
    const visible = new Set<number>();
    let observer: IntersectionObserver | null = null;
    let previousScrollY = window.scrollY;

    const disconnect = () => {
      observer?.disconnect();
      observer = null;
      visible.clear();
    };

    const sync = () => {
      disconnect();

      if (!desktop.matches) {
        activeRef.current = 1;
        setActive(1);
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const target = entry.target as HTMLElement;
            const index = Number(target.dataset.capabilityStep ?? target.dataset.capability);
            if (entry.isIntersecting) visible.add(index);
            else visible.delete(index);
          }
          if (!visible.size) return;

          const scrollingDown = window.scrollY >= previousScrollY;
          previousScrollY = window.scrollY;
          const target = scrollingDown ? Math.max(...visible) : Math.min(...visible);
          activeRef.current = target;
          setActive(target);
        },
        { rootMargin: "-45% 0px -45% 0px" },
      );

      for (const step of steps) observer.observe(step);
    };

    sync();
    desktop.addEventListener("change", sync);

    return () => {
      desktop.removeEventListener("change", sync);
      disconnect();
    };
  }, []);

  const select = (target: EventTarget | null) => {
    const trigger = (target as Element | null)?.closest?.<HTMLElement>("[data-capability]");
    const index = Number(trigger?.dataset.capability);
    if (Number.isFinite(index) && index > 0) {
      activeRef.current = index;
      setActive(index);
    }
  };

  // Mouse gets feedback on press; touch waits for the tap so scrolling stays scrolling.
  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") select(event.target);
  };

  return (
    <div
      className="caps__stage"
      data-active={active}
      data-ready={ready ? "true" : undefined}
      onClick={(event) => select(event.target)}
      onPointerDown={handlePointerDown}
      ref={stageRef}
    >
      {children}
      <ol aria-hidden="true" className="caps__scroll-track">
        {Array.from({ length: 6 }, (_, index) => (
          <li data-capability-step={index + 1} key={index} />
        ))}
      </ol>
    </div>
  );
}
