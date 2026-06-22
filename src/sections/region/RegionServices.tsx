import type { Region } from "@/lib/regions";
import { resolveIcon } from "@/lib/icons";

export default function RegionServices({ region }: { region: Region }) {
  return (
    <section id="services" className="section-padding" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <span className="font-data text-[12px] tracking-[0.16em] uppercase" style={{ color: region.accent }}>
            What we do
          </span>
          <h2 className="font-heading text-[clamp(2rem,4vw,3.2rem)] font-semibold mt-3 leading-[1.05]" style={{ color: "var(--foreground)" }}>
            Specialty services for{" "}
            <span className="italic font-display" style={{ color: region.accent }}>{region.country}</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {region.services.map((service) => {
            const Icon = resolveIcon(service.icon);
            return (
              <div
                key={service.name}
                className="lift group p-7 rounded-[var(--radius-lg)] shadow-soft"
                style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-subtle)" }}
              >
                <div
                  className="w-12 h-12 rounded-[var(--radius)] flex items-center justify-center mb-5 transition-colors duration-300"
                  style={{ backgroundColor: `${region.accent}14` }}
                >
                  <Icon size={22} style={{ color: region.accent }} />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2.5" style={{ color: "var(--foreground)" }}>
                  {service.name}
                </h3>
                <p className="text-[0.95rem] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
