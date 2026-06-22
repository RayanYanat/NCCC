"use client";
import { useEffect } from "react";

/**
 * Demo-visit tracking for the onenccc pitch.
 *
 * Tells you when the prospect (NCCC) actually opens the demo — and crucially
 * separates a real human from the email-security scanner that "detonates" every
 * link from a datacenter the instant the mail lands (Microsoft Safe Links,
 * Proofpoint, Mimecast…), long before a person sees it.
 *
 *  • phase "open"    — fired on mount. Recorded; a scanner never raises an alert.
 *  • phase "engaged" — fired once the visitor proves they're human (foreground
 *                      dwell + a real interaction, or a long quiet read). This is
 *                      what earns the "they're looking at it right now" ping.
 *
 * `page` records which section was opened (landing / us / uae / india).
 * Renders nothing.
 */
export default function VisitTracker({ page }: { page: string }) {
  useEffect(() => {
    const signals = (() => {
      try {
        return {
          wd: (navigator as unknown as { webdriver?: boolean }).webdriver === true,
          langs: navigator.languages?.length ?? 0,
          cores: navigator.hardwareConcurrency ?? 0,
          touch: navigator.maxTouchPoints ?? 0,
          vis: document.visibilityState,
          w: screen.width,
          h: screen.height,
          dpr: Math.round((window.devicePixelRatio ?? 1) * 100) / 100,
          tz: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
          ref: document.referrer || null,
        };
      } catch {
        return {};
      }
    })();

    const send = (phase: "open" | "engaged") => {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, phase, signals }),
        keepalive: true,
      }).catch(() => {});
    };

    send("open");

    /* ── Engagement gate ──────────────────────────────────────────────
       Human = a real interaction AND ≥3s foreground, OR ≥12s quiet read.
       Only foreground time counts, so a hidden scanner never accrues dwell. */
    const INTERACT_DWELL = 3_000;
    const PURE_DWELL = 12_000;
    const MAX_LIFETIME = 60_000;

    let engaged = false;
    let interacted = false;
    let visibleMs = 0;
    let lastTick = document.visibilityState === "visible" ? Date.now() : 0;

    const accrue = () => {
      if (lastTick) { visibleMs += Date.now() - lastTick; lastTick = Date.now(); }
    };
    const maybeEngage = () => {
      accrue();
      if (engaged) return;
      if ((interacted && visibleMs >= INTERACT_DWELL) || visibleMs >= PURE_DWELL) {
        engaged = true;
        cleanup();
        send("engaged");
      }
    };

    const interactEvents = ["pointermove", "pointerdown", "scroll", "keydown", "touchstart", "wheel"] as const;
    const onInteract = () => {
      interacted = true;
      interactEvents.forEach((e) => window.removeEventListener(e, onInteract));
      maybeEngage();
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") lastTick = Date.now();
      else { accrue(); lastTick = 0; }
    };

    interactEvents.forEach((e) => window.addEventListener(e, onInteract, { passive: true }));
    document.addEventListener("visibilitychange", onVisibility);
    const poll = window.setInterval(maybeEngage, 1_000);
    const stop = window.setTimeout(() => cleanup(), MAX_LIFETIME);

    function cleanup() {
      interactEvents.forEach((e) => window.removeEventListener(e, onInteract));
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearInterval(poll);
      window.clearTimeout(stop);
    }

    return cleanup;
  }, [page]);

  return null;
}
