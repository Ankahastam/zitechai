"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function PartnerSlider({ children, heading, nextLabel, previousLabel, railLabel }: {
  children: ReactNode;
  heading: ReactNode;
  nextLabel: string;
  previousLabel: string;
  railLabel: string;
}) {
  const rail = useRef<HTMLOListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  function updateEdges() {
    const element = rail.current;
    if (!element) return;
    const position = Math.abs(element.scrollLeft);
    const start = position < 2;
    const end = position >= element.scrollWidth - element.clientWidth - 2;
    setEdges((current) => current.start === start && current.end === end ? current : { start, end });
  }

  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const observer = new ResizeObserver(updateEdges);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  function move(direction: number) {
    const element = rail.current;
    if (!element) return;
    const first = element.firstElementChild as HTMLElement | null;
    const step = (first?.offsetWidth ?? element.clientWidth) + parseFloat(getComputedStyle(element).columnGap);
    element.scrollBy({ left: direction * step, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  return (
    <>
      <header className="partners__header">
        {heading}
        <div className="partners__controls">
          <button aria-controls="partners-rail" aria-label={previousLabel} disabled={edges.start} onClick={() => move(1)} type="button">
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7" /></svg>
          </button>
          <button aria-controls="partners-rail" aria-label={nextLabel} disabled={edges.end} onClick={() => move(-1)} type="button">
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m15 5-7 7 7 7" /></svg>
          </button>
        </div>
      </header>
      <ol aria-label={railLabel} className="partners__rail" dir="rtl" id="partners-rail" onScroll={updateEdges} onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          move(event.key === "ArrowLeft" ? -1 : 1);
        } else if (event.key === "Home" || event.key === "End") {
          event.preventDefault();
          event.currentTarget.scrollTo({ left: event.key === "Home" ? 0 : -event.currentTarget.scrollWidth, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
        }
      }} ref={rail} tabIndex={0}>
        {children}
      </ol>
    </>
  );
}
