import type { Metadata } from "next";
import RegionSelector from "@/components/region/RegionSelector";
import VisitTracker from "@/components/shared/VisitTracker";
import { GROUP } from "@/lib/regions";

/**
 * Landing experience — the group hub. The visitor chooses a region
 * (US / UAE / India) and is routed to that market's section.
 */
export const metadata: Metadata = {
  title: `${GROUP.fullName} — Specialty Industrial Services`,
  description: GROUP.descriptor,
  alternates: { canonical: "https://onenccc.com" },
};

export default function Home() {
  return (
    <>
      <VisitTracker page="landing" />
      <RegionSelector />
    </>
  );
}
