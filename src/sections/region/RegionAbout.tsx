import { Calendar } from "lucide-react";
import type { Region } from "@/lib/regions";

export default function RegionAbout({ region }: { region: Region }) {
  return (
    <section id="about" className="section-padding" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* About copy */}
          <div className="lg:col-span-7">
            <span className="font-data text-[12px] tracking-[0.16em] uppercase" style={{ color: region.accent }}>
              About {region.entity}
            </span>
            <h2 className="font-heading text-[clamp(2rem,4vw,3.2rem)] font-semibold mt-3 mb-6 leading-[1.05]" style={{ color: "var(--foreground)" }}>
              Part of a global group, local to your market.
            </h2>
            <p className="text-[1.05rem] leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>
              {region.about}
            </p>
            <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-[var(--radius)]" style={{ backgroundColor: "var(--surface-warm)" }}>
              <Calendar size={15} style={{ color: region.accent }} />
              <span className="text-[0.88rem] font-medium" style={{ color: "var(--foreground)" }}>{region.established}</span>
            </div>

            {/* Leadership */}
            {region.leadership.length > 0 && (
              <div className="mt-12">
                <h3 className="font-heading text-lg font-semibold mb-5" style={{ color: "var(--foreground)" }}>Leadership</h3>
                <div className="grid sm:grid-cols-2 gap-5">
                  {region.leadership.map((leader) => (
                    <div key={leader.name} className="p-5 rounded-[var(--radius-lg)]" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-subtle)" }}>
                      <div className="font-heading text-lg font-semibold" style={{ color: "var(--foreground)" }}>{leader.name}</div>
                      <div className="text-[0.82rem] font-medium mb-2.5" style={{ color: region.accent }}>{leader.role}</div>
                      <p className="text-[0.88rem] leading-relaxed" style={{ color: "var(--text-muted)" }}>{leader.bio}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Clients */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 p-8 rounded-[var(--radius-xl)] shadow-soft" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-subtle)" }}>
              <span className="font-data text-[12px] tracking-[0.16em] uppercase" style={{ color: "var(--text-faint)" }}>
                Trusted by
              </span>
              <h3 className="font-heading text-2xl font-semibold mt-2 mb-6" style={{ color: "var(--foreground)" }}>
                Clients &amp; partners
              </h3>
              <ul className="flex flex-col">
                {region.clients.map((client, i) => (
                  <li
                    key={client}
                    className="flex items-center gap-3 py-3.5"
                    style={{ borderTop: i === 0 ? "none" : "1px solid var(--border-subtle)" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: region.accent }} />
                    <span className="text-[0.98rem] font-medium" style={{ color: "var(--foreground)" }}>{client}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[0.78rem] mt-5 leading-relaxed" style={{ color: "var(--text-faint)" }}>
                Client logos to be supplied — shown here as a reference list for the demo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
