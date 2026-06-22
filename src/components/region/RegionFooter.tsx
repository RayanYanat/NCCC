import Link from "next/link";
import type { Region } from "@/lib/regions";
import { REGION_LIST, GROUP } from "@/lib/regions";

export default function RegionFooter({ region }: { region: Region }) {
  return (
    <footer style={{ backgroundColor: "#14100C", color: "#FBF7F1" }}>
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div className="grid md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="inline-block w-3 h-3 rounded-[3px]" style={{ background: "linear-gradient(135deg, #C8511F 50%, #2B6E8F 50%)" }} />
              <span className="font-heading text-xl font-semibold">{GROUP.fullName}</span>
            </div>
            <p className="text-[0.92rem] leading-relaxed max-w-sm" style={{ color: "rgba(245,240,233,0.6)" }}>
              {GROUP.descriptor}
            </p>
          </div>

          {/* Regions */}
          <div className="md:col-span-4">
            <span className="font-data text-[11px] tracking-[0.16em] uppercase" style={{ color: "rgba(245,240,233,0.45)" }}>Regions</span>
            <ul className="mt-4 flex flex-col gap-3">
              {REGION_LIST.map((r) => (
                <li key={r.id}>
                  <Link href={`/${r.id}`} className="group flex items-center gap-2.5 text-[0.95rem] transition-colors duration-200" style={{ color: r.id === region.id ? "#FBF7F1" : "rgba(245,240,233,0.62)" }}>
                    <span className="text-base leading-none">{r.flag}</span>
                    <span>{r.country}</span>
                    <span className="text-[0.78rem]" style={{ color: "rgba(245,240,233,0.4)" }}>· {r.entity}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Current region contact */}
          <div className="md:col-span-3">
            <span className="font-data text-[11px] tracking-[0.16em] uppercase" style={{ color: "rgba(245,240,233,0.45)" }}>
              {region.label} office
            </span>
            <ul className="mt-4 flex flex-col gap-2.5 text-[0.9rem]" style={{ color: "rgba(245,240,233,0.62)" }}>
              <li>{region.contact.email}</li>
              <li>{region.contact.phone}</li>
              <li>{region.contact.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-7 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid rgba(245,240,233,0.12)" }}>
          <p className="text-[0.8rem]" style={{ color: "rgba(245,240,233,0.4)" }}>
            © {GROUP.fullName}. {GROUP.domain}
          </p>
          <p className="text-[0.8rem]" style={{ color: "rgba(245,240,233,0.4)" }}>
            Specialty industrial services — US · UAE · India
          </p>
        </div>
      </div>
    </footer>
  );
}
