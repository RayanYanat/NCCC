"use client";

import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import { REGION_LIST, GROUP } from "@/lib/regions";
import { HERO_BLUR } from "@/lib/blur";

/**
 * The signature landing experience: a full-screen, three-panel region selector.
 * Hover expands a panel (the others recede); selecting one plays a brief
 * cinematic exit, then routes to that region's hub (/us, /uae, /india).
 *
 * No forced geo-redirect — the visitor always chooses, which keeps all three
 * regional sections crawlable for SEO.
 */
export default function RegionSelector() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [leaving, setLeaving] = useState(false);

  /* ── Entrance: header settles, panels rise in sequence ─────────────── */
  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        gsap.set([".rs-header", ".rs-panel", ".rs-panel-inner", ".rs-footer"], { opacity: 1, y: 0, clipPath: "none" });
        return;
      }
      gsap.set(".rs-panel", { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(".rs-panel-inner", { opacity: 0, y: 20 });
      gsap.set([".rs-header", ".rs-footer"], { opacity: 0, y: 16 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".rs-panel", { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, stagger: 0.12 }, 0.1)
        .to(".rs-panel-inner", { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }, 0.5)
        .to(".rs-header", { opacity: 1, y: 0, duration: 0.7 }, 0.3)
        .to(".rs-footer", { opacity: 1, y: 0, duration: 0.7 }, 0.7);
    },
    { scope: rootRef }
  );

  /* ── Select a region: cinematic exit, then route ───────────────────── */
  const enter = useCallback(
    (index: number, href: string) => {
      if (leaving) return;
      setLeaving(true);

      // One-shot flag the incoming region page reads to continue the veil.
      const flag = () => { try { sessionStorage.setItem("nccc-transition", "1"); } catch {} };

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        flag();
        router.push(href);
        return;
      }

      const panels = gsap.utils.toArray<HTMLElement>(".rs-panel");
      const chosen = panels[index];
      const others = panels.filter((_, i) => i !== index);

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => { flag(); router.push(href); },
      });
      tl.to([".rs-header", ".rs-footer"], { opacity: 0, y: -10, duration: 0.35 }, 0)
        .to(others, { flexGrow: 0, opacity: 0, duration: 0.6 }, 0)
        .to(chosen, { flexGrow: 12, duration: 0.7 }, 0)
        .to(chosen.querySelector(".rs-img"), { scale: 1.08, duration: 0.9 }, 0)
        .to(chosen.querySelector(".rs-scrim"), { opacity: 0.35, duration: 0.7 }, 0)
        // Veil closes over the expanding panel just before we navigate, so the
        // photo never lingers into the next route.
        .to(".rs-veil", { opacity: 1, duration: 0.4, ease: "power2.in" }, 0.45);
    },
    [leaving, router]
  );

  return (
    <div
      ref={rootRef}
      className="relative min-h-[100svh] flex flex-col overflow-hidden"
      style={{ backgroundColor: "#2A1F16" }}
    >
      {/* Top hairline — group hot/cold signature */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] z-40"
        style={{ background: "linear-gradient(to right, #C8511F 0%, #C8511F 33%, #2B6E8F 33%, #2B6E8F 66%, #B8860B 66%)" }}
      />

      {/* ── Group header ─────────────────────────────────────────────── */}
      <header className="rs-header absolute top-0 left-0 right-0 z-30 px-5 lg:px-10 pt-7 lg:pt-9 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2.5">
          <span
            className="inline-block w-3 h-3 rounded-[3px]"
            style={{ background: "linear-gradient(135deg, #C8511F 50%, #2B6E8F 50%)" }}
          />
          <span className="font-heading text-[1.45rem] font-semibold tracking-[-0.02em]" style={{ color: "#FBF7F1" }}>
            {GROUP.name}
          </span>
        </div>
        <span className="hidden sm:block font-data text-[11px] tracking-[0.18em] uppercase" style={{ color: "rgba(245,240,233,0.6)" }}>
          {GROUP.domain}
        </span>
      </header>

      {/* ── Panels ───────────────────────────────────────────────────── */}
      <div
        ref={panelsRef}
        className="flex-1 flex flex-col lg:flex-row"
        onMouseLeave={() => setHovered(null)}
      >
        {REGION_LIST.map((region, i) => {
          const isHovered = hovered === i;
          const isDimmed = hovered !== null && hovered !== i;
          return (
            <button
              key={region.id}
              type="button"
              onMouseEnter={() => setHovered(i)}
              onFocus={() => setHovered(i)}
              onClick={() => enter(i, `/${region.id}`)}
              aria-label={`Enter ${region.country} region`}
              className="rs-panel group relative overflow-hidden text-left outline-none cursor-pointer transition-[flex-grow,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                flexBasis: 0,
                flexGrow: isHovered ? 1.9 : isDimmed ? 0.72 : 1,
                minHeight: 0,
                filter: isDimmed ? "saturate(0.7)" : "none",
              }}
            >
              {/* Image — all three are above the fold, so load eagerly with a
                  blur placeholder for a smooth fade-in (no pop). */}
              <Image
                src={region.heroImage}
                alt={`${region.country} — ${region.entity}`}
                fill
                priority
                placeholder="blur"
                blurDataURL={HERO_BLUR[region.id]}
                sizes="(max-width: 1024px) 100vw, 34vw"
                className="rs-img object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: isHovered ? "scale(1.06)" : "scale(1.0)" }}
              />

              {/* Scrim — keeps text legible while letting the photo read through.
                  Lighter than a typical hero so the landing feels warm, not dark. */}
              <div
                className="rs-scrim absolute inset-0 transition-opacity duration-700"
                style={{
                  background: `linear-gradient(180deg, rgba(20,15,10,0.10) 0%, rgba(20,15,10,0.22) 42%, rgba(20,15,10,0.72) 100%)`,
                  opacity: isHovered ? 0.55 : 0.9,
                }}
              />
              {/* Accent wash on hover */}
              <div
                className="absolute inset-0 transition-opacity duration-700 mix-blend-overlay"
                style={{ background: `linear-gradient(180deg, transparent 40%, ${region.accent} 130%)`, opacity: isHovered ? 0.55 : 0 }}
              />

              {/* Vertical divider between panels (desktop) */}
              {i < REGION_LIST.length - 1 && (
                <div className="hidden lg:block absolute top-0 right-0 bottom-0 w-px z-20" style={{ backgroundColor: "rgba(245,240,233,0.14)" }} />
              )}

              {/* Content */}
              <div className="rs-panel-inner absolute inset-0 z-10 flex flex-col justify-end p-7 lg:p-10">
                {/* Index + flag */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-data text-[11px] tracking-[0.2em]" style={{ color: "rgba(245,240,233,0.6)" }}>
                    0{i + 1}
                  </span>
                  <span className="text-2xl leading-none">{region.flag}</span>
                </div>

                {/* Region name */}
                <h2 className="font-heading font-semibold leading-[0.95] tracking-[-0.02em]" style={{ color: "#FBF7F1", fontSize: "clamp(2.4rem, 4.5vw, 4rem)" }}>
                  {region.label}
                </h2>

                {/* Tagline — always visible, brightens on hover */}
                <p
                  className="mt-3 max-w-sm text-[0.98rem] leading-relaxed transition-colors duration-500"
                  style={{ color: isHovered ? "rgba(245,240,233,0.92)" : "rgba(245,240,233,0.66)" }}
                >
                  {region.tileTagline}
                </p>

                {/* Stats + CTA — reveal on hover (desktop), always on mobile */}
                <div
                  className="overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ maxHeight: isHovered ? "180px" : "0px", opacity: isHovered ? 1 : 0 }}
                >
                  <div className="flex items-center gap-7 mt-6 pt-6" style={{ borderTop: "1px solid rgba(245,240,233,0.18)" }}>
                    {region.tileStats.map((s) => (
                      <div key={s.label}>
                        <div className="font-heading text-xl font-semibold tabular" style={{ color: "#FBF7F1" }}>{s.value}</div>
                        <div className="text-[11px] mt-0.5" style={{ color: "rgba(245,240,233,0.62)" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <span
                    className="inline-flex items-center gap-2 mt-6 font-medium text-[0.92rem]"
                    style={{ color: region.accentSoft }}
                  >
                    Enter {region.country}
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                  </span>
                </div>

                {/* Mobile-only persistent CTA (hover states don't exist on touch) */}
                <span
                  className="lg:hidden inline-flex items-center gap-2 mt-5 font-medium text-[0.9rem]"
                  style={{ color: region.accentSoft }}
                >
                  Enter {region.country}
                  <ArrowRight size={15} />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Footer prompt ────────────────────────────────────────────── */}
      <footer className="rs-footer absolute bottom-0 left-0 right-0 z-30 px-5 lg:px-10 pb-6 lg:pb-7 flex items-center justify-between pointer-events-none">
        <p className="font-data text-[11px] tracking-[0.16em] uppercase" style={{ color: "rgba(245,240,233,0.7)" }}>
          Select your region
        </p>
        <p className="hidden sm:block text-[12px]" style={{ color: "rgba(245,240,233,0.45)" }}>
          {GROUP.descriptor.split(" operating")[0]}
        </p>
      </footer>

      {/* Transition veil — fades in over the chosen panel just before we navigate,
          then the incoming region page continues the same veil and dissolves it. */}
      <div className="rs-veil fixed inset-0 z-[60] pointer-events-none" style={{ backgroundColor: "#14100C", opacity: 0 }} aria-hidden />
    </div>
  );
}
