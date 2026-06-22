import Image from "next/image";
import { MapPin } from "lucide-react";
import type { Region } from "@/lib/regions";

export default function RegionProjects({ region }: { region: Region }) {
  return (
    <section id="projects" className="section-padding" style={{ backgroundColor: "var(--surface-warm)" }}>
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <span className="font-data text-[12px] tracking-[0.16em] uppercase" style={{ color: region.accent }}>
              Selected work
            </span>
            <h2 className="font-heading text-[clamp(2rem,4vw,3.2rem)] font-semibold mt-3 leading-[1.05]" style={{ color: "var(--foreground)" }}>
              Projects across {region.country}
            </h2>
          </div>
          <p className="text-[0.95rem] max-w-xs" style={{ color: "var(--text-muted)" }}>
            A sample of recent and reference works. Full project history available on request.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {region.projects.map((project, i) => (
            <article
              key={project.title}
              className="group rounded-[var(--radius-lg)] overflow-hidden shadow-card"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-subtle)" }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(20,16,12,0.5) 0%, transparent 55%)" }} />
                <span
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide"
                  style={{ backgroundColor: "rgba(255,254,252,0.92)", color: region.accent }}
                >
                  {project.sector}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-heading text-xl font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>
                  {project.title}
                </h3>
                <div className="flex items-center gap-1.5 mb-3">
                  <MapPin size={13} style={{ color: "var(--text-faint)" }} />
                  <span className="text-[0.8rem]" style={{ color: "var(--text-muted)" }}>{project.location}</span>
                </div>
                <p className="text-[0.92rem] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {project.blurb}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
