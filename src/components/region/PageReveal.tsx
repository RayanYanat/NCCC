"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

/**
 * Second half of the selector → region transition.
 *
 * When a visitor picks a region, the selector fades a dark veil over itself and
 * then navigates. This component paints the SAME dark veil on the incoming page
 * (set opaque before first paint, in useLayoutEffect), so the handoff has no gap
 * and no flash of the lingering selector image — then dissolves the veil to
 * reveal the hero entrance underneath.
 *
 * On a direct load (no selector hand-off) the veil stays invisible and does
 * nothing. The one-shot flag in sessionStorage distinguishes the two.
 */
export default function PageReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      let fromSelector = false;
      try {
        fromSelector = sessionStorage.getItem("nccc-transition") === "1";
        sessionStorage.removeItem("nccc-transition");
      } catch {}

      if (!fromSelector) {
        gsap.set(el, { autoAlpha: 0 });
        return;
      }

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.set(el, { autoAlpha: 1 });
      if (reduce) {
        gsap.set(el, { autoAlpha: 0 });
        return;
      }
      gsap.to(el, { autoAlpha: 0, duration: 0.6, ease: "power2.inOut", delay: 0.08 });
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed inset-0 z-[100] pointer-events-none"
      style={{ backgroundColor: "#14100C", opacity: 0 }}
    />
  );
}
