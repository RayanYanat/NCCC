"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight, MapPin } from "lucide-react";
import type { Region } from "@/lib/regions";
import { HERO_BLUR } from "@/lib/blur";

export default function RegionHero({ region }: { region: Region }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.set([".rh-eyebrow", ".rh-sub", ".rh-cta", ".rh-strip"], { y: 18, opacity: 0 });
      gsap.set([".rh-t1", ".rh-t2"], { y: 32, opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".rh-eyebrow", { y: 0, opacity: 1, duration: 0.7 }, 0.2)
        .to(".rh-t1", { y: 0, opacity: 1, duration: 1.0 }, "-=0.4")
        .to(".rh-t2", { y: 0, opacity: 1, duration: 1.0 }, "-=0.8")
        .to(".rh-sub", { y: 0, opacity: 1, duration: 0.7 }, "-=0.55")
        .to(".rh-cta", { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, "-=0.4")
        .to(".rh-strip", { y: 0, opacity: 1, duration: 0.7 }, "-=0.35");

      if (!reduce) {
        gsap.fromTo(".rh-photo", { scale: 1.16 }, { scale: 1.05, duration: 2.4, ease: "power2.out" });
      }
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden" style={{ backgroundColor: "#14100C" }}>
      {/* Accent hairline */}
      <div className="absolute top-0 left-0 right-0 h-[3px] z-30" style={{ backgroundColor: region.accent }} />

      {/* Image */}
      <div className="absolute inset-0" style={{ backgroundColor: "#14100C" }}>
        <Image src={region.heroImage} alt={`${region.country} — ${region.entity}`} fill priority placeholder="blur" blurDataURL={HERO_BLUR[region.id]} className="rh-photo object-cover will-change-transform" sizes="100vw" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(100deg, rgba(16,12,9,0.85) 0%, rgba(16,12,9,0.6) 40%, rgba(16,12,9,0.2) 72%, rgba(16,12,9,0.35) 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-72" style={{ background: "linear-gradient(to top, rgba(14,11,8,0.85) 0%, transparent 100%)" }} />
      </div>

      {/* Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-5 lg:px-8 pb-16 lg:pb-24 pt-32">
        <div className="rh-eyebrow flex items-center gap-2.5 mb-6">
          <span className="text-lg leading-none">{region.flag}</span>
          <MapPin size={14} style={{ color: region.accentSoft }} />
          <span className="font-data text-[12px] tracking-[0.14em] uppercase" style={{ color: "rgba(245,240,233,0.85)" }}>
            {region.entity} · {region.country}
          </span>
        </div>

        <h1 className="font-heading font-semibold tracking-[-0.02em] max-w-4xl text-[clamp(2.6rem,6.5vw,5.6rem)] leading-[0.98]" style={{ color: "#FBF7F1" }}>
          <span className="rh-t1 block">{region.headline}</span>
          <span className="rh-t2 block">
            <span className="italic" style={{ color: region.accentSoft }}>{region.headlineAccent}</span>.
          </span>
        </h1>

        <p className="rh-sub max-w-xl text-[1.06rem] leading-relaxed mt-6" style={{ color: "rgba(245,240,233,0.82)" }}>
          {region.sub}
        </p>

        <div className="flex flex-col sm:flex-row gap-3.5 mt-9">
          <a
            href="#contact"
            className="press inline-flex items-center justify-center gap-2.5 px-7 py-4 text-white text-[0.95rem] font-medium rounded-[var(--radius)] transition-all duration-300 shadow-card"
            style={{ backgroundColor: region.accent }}
          >
            <span>Request a consultation</span>
            <ArrowRight size={16} />
          </a>
          <a
            href="#projects"
            className="press inline-flex items-center justify-center gap-2.5 px-7 py-4 text-[0.95rem] font-medium rounded-[var(--radius)] transition-all duration-300"
            style={{ color: "#FBF7F1", border: "1px solid rgba(245,240,233,0.35)" }}
          >
            <span>View projects</span>
          </a>
        </div>

        {/* Stat strip */}
        <div className="rh-strip flex flex-wrap items-center gap-x-9 gap-y-3 mt-12 pt-7" style={{ borderTop: "1px solid rgba(245,240,233,0.18)" }}>
          {region.tileStats.map((s) => (
            <div key={s.label} className="flex items-baseline gap-2">
              <span className="font-heading text-2xl font-semibold tabular" style={{ color: "#FBF7F1" }}>{s.value}</span>
              <span className="text-xs" style={{ color: "rgba(245,240,233,0.7)" }}>{s.label}</span>
            </div>
          ))}
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-2xl font-semibold tabular" style={{ color: "#FBF7F1" }}>{region.services.length}</span>
            <span className="text-xs" style={{ color: "rgba(245,240,233,0.7)" }}>service lines</span>
          </div>
        </div>
      </div>
    </section>
  );
}
