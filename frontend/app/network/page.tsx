import type { Metadata } from "next";
import { PageHero } from "@/sections/shared/PageHero";
import { FeatureGrid } from "@/sections/shared/FeatureGrid";
import { CTASection } from "@/sections/shared/CTASection";
import { ReleaseGate } from "@/components/release/ReleaseGate";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { SITE } from "@/constants/site";
import { HERO } from "@/data/images";

export const metadata: Metadata = {
  title: "Network",
  description:
    "Philbrick's reach — based in Ahmedabad, supplying elevator components across India and exporting to markets including China and Taiwan.",
  alternates: { canonical: "/network" },
};

const REACH = [
  {
    iconName: "FiMapPin",
    title: "Ahmedabad HQ & factory",
    description:
      "Our design and manufacturing base at GIDC Kathwada, Odhav, Ahmedabad, Gujarat.",
  },
  {
    iconName: "FiTruck",
    title: "Supply across India",
    description:
      "We supply elevator components to installers, OEMs and modernisers throughout India.",
  },
  {
    iconName: "FiGlobe",
    title: "Export markets",
    description:
      "We export elevator components to international markets including China and Taiwan.",
  },
  {
    iconName: "FiUsers",
    title: "Single-source partner",
    description:
      "Panels, doors, cabins, fixtures and displays from one supplier simplify procurement for partners.",
  },
];

export default function NetworkPage() {
  return (
    <ReleaseGate route="/network" label="Network">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Network", path: "/network" },
        ])}
      />

      <PageHero
        eyebrow="Reach"
        title="From Ahmedabad, across India and beyond"
        description="Philbrick supplies elevator components from its Ahmedabad facility to customers across India and export markets — held to the same standard everywhere."
        image={HERO.global}
        imageAlt="Distribution reach"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Network" }]}
      />

      <section className="section">
        <div className="container--wide">
          <FeatureGrid
            eyebrow="Our network"
            title="Where Philbrick reaches"
            description="An in-house manufacturing base supplying a growing footprint of customers and partners."
            align="center"
            columns={2}
            features={REACH}
          />
        </div>
      </section>

      <CTASection
        eyebrow="Partner with us"
        title="Become a Philbrick partner"
        description={`Interested in supplying or specifying Philbrick components in your region? Reach us at ${SITE.phone}.`}
        primary={{ label: "Get in touch", href: "/contact" }}
        secondary={{ label: "View products", href: "/products" }}
      />
    </ReleaseGate>
  );
}
