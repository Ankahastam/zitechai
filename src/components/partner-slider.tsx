"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function PartnerSlider({ children, heading, itemCount, nextLabel, previousLabel, railLabel }: {
  children: ReactNode;
  heading: ReactNode;
  itemCount: number;
  nextLabel: string;
  previousLabel: string;
  railLabel: string;
}) {
  const rail = useRef<HTMLOListElement>(null);
  const cycle = useRef(0);
  const hovered = useRef(false);
  const resumeAt = useRef(0);
  const [paused, setPaused] = useState(false);

  function wrap() {
    const element = rail.current;
    const width = cycle.current;
    if (!element || !width) return;
    const position = -element.scrollLeft;
    if (position < width || position >= width * 2) {
      element.scrollLeft = -(width + ((position % width) + width) % width);
    }
  }

  useEffect(() => {
    const element = rail.current;
    if (!element || itemCount < 2) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let previousTime = 0;
    let remainder = 0;
    let frame = 0;

    const resize = () => {
      const progress = cycle.current ? (-element.scrollLeft / cycle.current) % 1 : 0;
      element.dataset.looping = "true";
      const first = element.children[0] as HTMLElement;
      const secondCopy = element.children[itemCount] as HTMLElement;
      cycle.current = first.offsetLeft - secondCopy.offsetLeft;
      element.scrollLeft = -cycle.current * (1 + progress);
    };
    const resizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    resizeObserver.observe(element);
    visibilityObserver.observe(element);
    resize();

    const tick = (time: number) => {
      const elapsed = previousTime ? Math.min(time - previousTime, 64) : 0;
      previousTime = time;
      if (visible && !document.hidden && !paused && !reducedMotion.matches && !hovered.current && time >= resumeAt.current && !element.parentElement?.matches(":focus-within")) {
        // Accumulate fractions because browsers can round scrollLeft writes.
        const distance = elapsed * 0.024 + remainder;
        const pixels = Math.floor(distance);
        remainder = distance - pixels;
        element.scrollLeft -= pixels;
        wrap();
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [itemCount, paused]);

  function move(direction: number) {
    const element = rail.current;
    if (!element) return;
    resumeAt.current = performance.now() + 2000;
    const first = element.firstElementChild as HTMLElement | null;
    const step = (first?.offsetWidth ?? element.clientWidth) + parseFloat(getComputedStyle(element).columnGap);
    element.scrollBy({ left: direction * step, behavior: "instant" });
    wrap();
  }

  return (
    <>
      <header className="partners__header">
        {heading}
        <div className="partners__controls">
          <button aria-controls="partners-rail" aria-label={previousLabel} onClick={() => move(1)} type="button">
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7" /></svg>
          </button>
          <button aria-controls="partners-rail" aria-label={paused ? "ادامهٔ حرکت خودکار" : "توقف حرکت خودکار"} aria-pressed={paused} className="partners__pause" onClick={() => setPaused(!paused)} type="button">
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d={paused ? "m9 5 10 7-10 7Z" : "M8 5v14M16 5v14"} /></svg>
          </button>
          <button aria-controls="partners-rail" aria-label={nextLabel} onClick={() => move(-1)} type="button">
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m15 5-7 7 7 7" /></svg>
          </button>
        </div>
      </header>
      <ol aria-label={railLabel} className="partners__rail" dir="rtl" id="partners-rail" onScroll={wrap}
        onPointerEnter={(event) => { if (event.pointerType === "mouse") hovered.current = true; }}
        onPointerLeave={() => { hovered.current = false; if (resumeAt.current === Infinity) resumeAt.current = performance.now() + 2000; }}
        onPointerDown={() => { resumeAt.current = Infinity; }}
        onPointerUp={() => { resumeAt.current = performance.now() + 2000; }}
        onPointerCancel={() => { resumeAt.current = performance.now() + 2000; }}
        onWheel={() => { resumeAt.current = performance.now() + 2000; }}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            move(event.key === "ArrowLeft" ? -1 : 1);
          } else if (event.key === "Home" || event.key === "End") {
            event.preventDefault();
            event.currentTarget.scrollLeft = -cycle.current;
            if (event.key === "End") move(-(itemCount - 1));
          }
        }} ref={rail} tabIndex={0}>
        {children}
      </ol>
    </>
  );
}
