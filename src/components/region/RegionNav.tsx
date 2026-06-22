"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";
import type { Region } from "@/lib/regions";
import { REGION_LIST, GROUP } from "@/lib/regions";

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

/**
 * Region-aware top navigation. Carries the group identity, a persistent
 * region switcher (so a visitor can change market at any time — never trapped),
 * and in-page anchors for the regional hub.
 */
export default function RegionNav({ region }: { region: Region }) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [switchOpen, setSwitchOpen] = useState(false);
  const switchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 5);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (switchRef.current && !switchRef.current.contains(e.target as Node)) setSwitchOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const textMain = scrolled ? "var(--foreground)" : "#FBF7F1";
  const textMuted = scrolled ? "var(--text-muted)" : "rgba(245,240,233,0.82)";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled ? "rgba(250,247,242,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border-subtle)" : "1px solid transparent",
      }}
    >
      <div
        className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between gap-6 transition-all duration-500"
        style={{ height: scrolled ? "60px" : "80px" }}
      >
        {/* Group logo → back to selector */}
        <Link href="/" className="font-heading font-semibold flex items-center gap-2.5 flex-shrink-0" style={{ color: textMain, letterSpacing: "-0.02em" }}>
          <span className="inline-block w-2.5 h-2.5 rounded-[3px]" style={{ background: "linear-gradient(135deg, var(--brand) 50%, var(--cool) 50%)" }} />
          <span className="text-[1.2rem]">{GROUP.name}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-[0.92rem] font-medium transition-colors duration-200 underline-grow"
              style={{ color: textMuted }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = textMain)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = textMuted)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Region switcher */}
        <div ref={switchRef} className="relative flex-shrink-0">
          <button
            onClick={() => setSwitchOpen((v) => !v)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-[var(--radius)] transition-all duration-200"
            style={{
              color: textMain,
              border: `1px solid ${scrolled ? "var(--border-strong)" : "rgba(245,240,233,0.3)"}`,
              backgroundColor: scrolled ? "transparent" : "rgba(245,240,233,0.06)",
            }}
            aria-label="Switch region"
          >
            <span className="text-base leading-none">{region.flag}</span>
            <span className="text-[0.85rem] font-medium hidden sm:inline">{region.label}</span>
            <ChevronDown size={14} className="transition-transform duration-200" style={{ transform: switchOpen ? "rotate(180deg)" : "none" }} />
          </button>

          {switchOpen && (
            <div
              className="absolute right-0 mt-2 w-60 rounded-[var(--radius)] overflow-hidden shadow-card"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-subtle)" }}
            >
              <div className="px-4 pt-3 pb-2">
                <span className="font-data text-[10px] tracking-[0.16em] uppercase" style={{ color: "var(--text-faint)" }}>Choose region</span>
              </div>
              {REGION_LIST.map((r) => {
                const active = r.id === region.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => { setSwitchOpen(false); router.push(`/${r.id}`); }}
                    className="w-full flex items-center gap-3 px-4 py-3 transition-colors duration-150 text-left"
                    style={{ backgroundColor: active ? "var(--muted)" : "transparent" }}
                    onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--muted)"; }}
                    onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                  >
                    <span className="text-lg leading-none">{r.flag}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[0.9rem] font-medium" style={{ color: "var(--foreground)" }}>{r.country}</span>
                      <span className="block text-[0.75rem] truncate" style={{ color: "var(--text-muted)" }}>{r.entity}</span>
                    </span>
                    {active && <Check size={15} style={{ color: region.accent }} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
