import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

type Signals = {
  wd?: boolean; langs?: number; cores?: number; touch?: number;
  vis?: string; w?: number; h?: number; dpr?: number; tz?: string | null; ref?: string | null;
};

/* Automation / email-gateway scanners that announce themselves in the UA. */
const UA_BOT = /bot|crawl|spider|slurp|baidu|bytespider|gptbot|headless|phantom|puppeteer|playwright|selenium|python-requests|curl|wget|libwww|java\/|go-http|axios|okhttp|apache-httpclient|proofpoint|mimecast|barracuda|forcepoint|messagelabs|fireeye|cloudmark|bankguard|vade/i;

/* Email-security vendors whose org/AS name is unambiguous. */
const ORG_DC = /proofpoint|mimecast|barracuda|forcepoint|symantec|broadcom|zscaler|netskope|messagelabs|cloudmark|vade|fireeye|trustwave|agari/i;

const PAGE_LABEL: Record<string, string> = {
  landing: "the region selector (home)",
  us: "the US section",
  uae: "the UAE section",
  india: "the India section",
};

export async function POST(req: NextRequest) {
  try {
    const { page = "landing", phase = "open", signals = {} } =
      (await req.json()) as { page?: string; phase?: "open" | "engaged"; signals?: Signals };

    const ua = req.headers.get("user-agent") ?? "";
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
            ?? req.headers.get("x-real-ip") ?? "";

    /* ── Geo + datacenter lookup (ip-api free: hosting flag + org/as) ──── */
    let city: string | null = null, regionName: string | null = null, country: string | null = null;
    let hosting = false, org = "";

    const isLocal = !ip || ip.startsWith("127.") || ip.startsWith("192.168.") || ip.startsWith("10.");
    if (!isLocal) {
      try {
        const r = await fetch(
          `http://ip-api.com/json/${ip}?fields=status,city,regionName,countryCode,org,as,hosting`,
          { signal: AbortSignal.timeout(2000) }
        );
        if (r.ok) {
          const d = await r.json();
          if (d.status === "success") {
            city = d.city ?? null; regionName = d.regionName ?? null; country = d.countryCode ?? null;
            hosting = !!d.hosting;
            org = `${d.org ?? ""} ${d.as ?? ""}`.trim();
          }
        }
      } catch {}
    }

    /* ── Classify ──────────────────────────────────────────────────────────
       We filter scanners by BEHAVIOUR (the engagement gate on the client),
       not by IP. The old datacenter/hosting/org checks also flagged real
       visitors on corporate or VPN networks (Zscaler, Netskope, office IPs) —
       exactly the prospect we most want to hear about. So hosting/org are
       recorded for context but never block the ping. Only obvious automation
       (declared bot UA, headless/webdriver) is treated as non-human. */
    const uaBot = UA_BOT.test(ua) || ua.trim() === "";
    const clientBot = signals.wd === true || (signals.langs === 0 && (signals.cores ?? 0) === 0);
    const dcOrg = ORG_DC.test(org);
    const isAutomation = uaBot || clientBot;
    const reason = uaBot ? "UA" : clientBot ? "automation" : (hosting || dcOrg) ? "datacenter" : "";
    const kind = isAutomation ? "automation" : phase;

    const location = [city, regionName, country].filter(Boolean).join(", ") || "Unknown";
    const isMobile = /mobile|android|iphone|ipad/i.test(ua);
    const now = new Date().toISOString();

    /* ── Persist the visit (best-effort; never breaks the page) ───────── */
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        await getSupabaseAdmin().from("demo_visits").insert({
          page,
          phase,
          kind,
          reason: reason || null,
          location,
          country,
          org: org || null,
          is_mobile: isMobile,
          user_agent: ua || null,
          created_at: now,
        });
      } catch {}
    }

    /* ── Slack: ping when a real human ENGAGES with the demo ───────────────
       "engaged" only fires after genuine foreground dwell + interaction, which
       an email-gateway scanner (load-and-leave) never does — so this is the
       behavioural filter that replaces the fragile IP check. Works regardless
       of the visitor's network, so a prospect on a corporate/VPN IP still pings. */
    const slackUrl = process.env.SLACK_WEBHOOK_URL;
    if (slackUrl && !isAutomation && phase === "engaged") {
      const where = PAGE_LABEL[page] ?? page;
      const device = isMobile ? "📱 Mobile" : "🖥️ Desktop";
      try {
        await fetch(slackUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            blocks: [{
              type: "section",
              text: { type: "mrkdwn", text: `👀 Someone is viewing *${where}* of the NCCC demo\n📍 ${location}  ·  ${device}` },
            }],
          }),
        });
      } catch {}
    }

    return NextResponse.json({ ok: true, kind, page });
  } catch (e) {
    return NextResponse.json({ ok: false, caught: String(e) });
  }
}
