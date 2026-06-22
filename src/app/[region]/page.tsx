import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getRegion, REGION_ORDER, GROUP } from "@/lib/regions";
import GSAPConfig from "@/components/shared/GSAPConfig";
import VisitTracker from "@/components/shared/VisitTracker";
import RegionNav from "@/components/region/RegionNav";
import RegionFooter from "@/components/region/RegionFooter";
import RegionHero from "@/sections/region/RegionHero";
import RegionServices from "@/sections/region/RegionServices";
import RegionProjects from "@/sections/region/RegionProjects";
import RegionAbout from "@/sections/region/RegionAbout";
import RegionContact from "@/sections/region/RegionContact";

/* Pre-build all three regional sections at deploy time. */
export function generateStaticParams() {
  return REGION_ORDER.map((region) => ({ region }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}): Promise<Metadata> {
  const { region: id } = await params;
  const region = getRegion(id);
  if (!region) return {};

  const title = `${region.country} — ${region.entity}`;
  return {
    title,
    description: region.sub,
    alternates: { canonical: `https://${GROUP.domain}/${region.id}` },
    openGraph: { title: `${title} | ${GROUP.fullName}`, description: region.sub, images: [region.heroImage] },
  };
}

export default async function RegionPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region: id } = await params;
  const region = getRegion(id);
  if (!region) return notFound();

  return (
    <>
      <VisitTracker page={region.id} />
      <RegionNav region={region} />
      <main style={{ position: "relative", zIndex: 1 }}>
        <GSAPConfig />
        <RegionHero region={region} />
        <RegionServices region={region} />
        <RegionProjects region={region} />
        <RegionAbout region={region} />
        <RegionContact region={region} />
      </main>
      <RegionFooter region={region} />
    </>
  );
}
