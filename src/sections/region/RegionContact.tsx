"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, ArrowRight, Check } from "lucide-react";
import type { Region } from "@/lib/regions";

export default function RegionContact({ region }: { region: Region }) {
  const [sent, setSent] = useState(false);

  /* Demo only — in production this posts to /api/inquiry and routes to the
     correct regional inbox (region.contact.email) via nodemailer. */
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const details = [
    { icon: Mail, label: "Email", value: region.contact.email },
    { icon: Phone, label: "Phone", value: region.contact.phone },
    { icon: MapPin, label: "Office", value: region.contact.address },
    { icon: Clock, label: "Hours", value: region.contact.hours },
  ];

  return (
    <section id="contact" className="section-padding" style={{ backgroundColor: "var(--surface-warm)" }}>
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left: intro + details */}
          <div className="lg:col-span-5">
            <span className="font-data text-[12px] tracking-[0.16em] uppercase" style={{ color: region.accent }}>
              Get in touch
            </span>
            <h2 className="font-heading text-[clamp(2rem,4vw,3.2rem)] font-semibold mt-3 mb-5 leading-[1.05]" style={{ color: "var(--foreground)" }}>
              Start a conversation
            </h2>
            <p className="text-[1.02rem] leading-relaxed mb-9" style={{ color: "var(--text-muted)" }}>
              Tell us about your project in {region.country}. Inquiries reach the {region.label} team directly.
            </p>

            <div className="flex flex-col gap-1">
              {details.map((d) => (
                <div key={d.label} className="flex items-center gap-4 py-3.5" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                  <div className="w-10 h-10 rounded-[var(--radius)] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${region.accent}12` }}>
                    <d.icon size={17} style={{ color: region.accent }} />
                  </div>
                  <div>
                    <div className="text-[11px] tracking-wide uppercase font-data" style={{ color: "var(--text-faint)" }}>{d.label}</div>
                    <div className="text-[0.95rem] font-medium" style={{ color: "var(--foreground)" }}>{d.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-7">
            <div className="p-7 lg:p-9 rounded-[var(--radius-xl)] shadow-card" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-subtle)" }}>
              {sent ? (
                <div className="flex flex-col items-center justify-center text-center py-16">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: `${region.accent}16` }}>
                    <Check size={26} style={{ color: region.accent }} />
                  </div>
                  <h3 className="font-heading text-2xl font-semibold mb-2" style={{ color: "var(--foreground)" }}>Thank you</h3>
                  <p className="text-[0.95rem] max-w-sm" style={{ color: "var(--text-muted)" }}>
                    Your inquiry would be routed to <span style={{ color: "var(--foreground)", fontWeight: 500 }}>{region.contact.email}</span>. (Demo — form is not yet connected.)
                  </p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="flex flex-col gap-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Name" name="name" placeholder="Your name" required />
                    <Field label="Company" name="company" placeholder="Company name" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Email" name="email" type="email" placeholder="you@company.com" required />
                    <Field label="Phone" name="phone" placeholder="Phone number" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.82rem] font-medium" style={{ color: "var(--foreground)" }}>Project details</label>
                    <textarea
                      name="message"
                      rows={4}
                      placeholder="Tell us about the scope, site and timeline…"
                      className="px-4 py-3 rounded-[var(--radius)] text-[0.95rem] outline-none transition-all duration-200 resize-none"
                      style={{ backgroundColor: "var(--background)", border: "1px solid var(--input)", color: "var(--foreground)" }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="press inline-flex items-center justify-center gap-2.5 px-7 py-4 mt-1 text-white text-[0.95rem] font-medium rounded-[var(--radius)] transition-all duration-300 shadow-soft"
                    style={{ backgroundColor: region.accent }}
                  >
                    Send inquiry
                    <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[0.82rem] font-medium" style={{ color: "var(--foreground)" }}>
        {label}{required && <span style={{ color: "var(--text-faint)" }}> *</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className="px-4 py-3 rounded-[var(--radius)] text-[0.95rem] outline-none transition-all duration-200"
        style={{ backgroundColor: "var(--background)", border: "1px solid var(--input)", color: "var(--foreground)" }}
      />
    </div>
  );
}
