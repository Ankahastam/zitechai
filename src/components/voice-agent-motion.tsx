"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function VoiceAgentMotion() {
  useGSAP(() => {
    const root = document.querySelector<HTMLElement>(".va-page");
    if (!root) return;

    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({ defaults: { duration: 0.8, ease: "power3.out" } })
        .from(
          [".va-hero__eyebrow", ".va-hero__title", ".va-hero__promise", ".hero__lede"],
          { autoAlpha: 0, stagger: 0.08, y: 24 },
        )
        .from(".va-signal", { autoAlpha: 0, scale: 0.72 }, "<0.12")
        .from([".hero__actions", ".va-hero__marquee"], { autoAlpha: 0, stagger: 0.08, y: 18 }, "<0.2");

      gsap.to(".va-signal__halo", {
        duration: 2.4,
        ease: "sine.inOut",
        opacity: 0.08,
        repeat: -1,
        scale: 1.18,
        yoyo: true,
      });

      gsap.to(".va-window", {
        ease: "none",
        scrollTrigger: {
          end: "bottom top",
          scrub: 0.8,
          start: "top 82%",
          trigger: ".va-window",
        },
        y: -28,
      });

      gsap.utils.toArray<HTMLElement>(".va-pairs__list .va-pairs__row").forEach((row) => {
        gsap.from(row, {
          autoAlpha: 0.35,
          ease: "power2.out",
          scrollTrigger: { end: "top 58%", scrub: 0.45, start: "top 92%", trigger: row },
          x: 36,
        });
      });

      gsap.utils.toArray<HTMLElement>(".va-usecase-deck > li").forEach((card, index, cards) => {
        gsap.from(card, {
          autoAlpha: 0.45,
          ease: "power2.out",
          filter: "blur(3px)",
          scale: 0.92,
          scrollTrigger: { end: "top 52%", scrub: 0.5, start: "top 90%", trigger: card },
          y: 64,
        });

        if (index === cards.length - 1) return;
        gsap.to(card, {
          autoAlpha: 0.3,
          ease: "none",
          filter: "blur(8px)",
          scale: 0.93,
          scrollTrigger: {
            end: "top 28%",
            scrub: 0.5,
            start: "top 62%",
            trigger: cards[index + 1],
          },
        });
      });

      gsap.from(".va-integration-map", {
        autoAlpha: 0.45,
        ease: "power2.out",
        scale: 0.86,
        scrollTrigger: {
          end: "center 55%",
          scrub: 0.6,
          start: "top 92%",
          trigger: ".va-integrations-section",
        },
      });

      gsap.from(".va-integration-node", {
        autoAlpha: 0,
        ease: "power3.out",
        scale: 0.72,
        stagger: 0.08,
        scrollTrigger: {
          end: "center 58%",
          scrub: 0.55,
          start: "top 82%",
          trigger: ".va-integration-map",
        },
      });

      gsap.from(".va-integration-routes path", {
        ease: "none",
        strokeDashoffset: 1,
        stagger: 0.06,
        scrollTrigger: {
          end: "center 58%",
          scrub: 0.55,
          start: "top 82%",
          trigger: ".va-integration-map",
        },
      });
    });

    media.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        wide: "(min-width: 64rem)",
      },
      (context) => {
        const conditions = context.conditions as { motion: boolean; wide: boolean };
        if (!conditions.motion || !conditions.wide) return;

        ScrollTrigger.create({
          end: "bottom 65%",
          pin: "#va-features .pg-head",
          pinSpacing: false,
          start: "top 8rem",
          trigger: "#va-features",
        });
      },
    );

    return () => media.revert();
  }, []);

  return <span aria-hidden="true" className="va-motion-controller" data-voice-motion="ready" />;
}
